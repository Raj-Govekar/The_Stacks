from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional
import os
import re
import uuid

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "library_system")
JWT_SECRET = os.getenv("JWT_SECRET", "development-secret-change-me")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "admin@example.com").lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
CORS_ORIGINS = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",") if x.strip()]

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

ACCESS_MINUTES = 15
REFRESH_DAYS = 7
ALGORITHM = "HS256"

app = FastAPI(title="The Stacks API", version="1.0.0")
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

api = APIRouter(prefix="/api")


def now():
    return datetime.now(timezone.utc)


def password_valid(password: str):
    if len(password) < 8:
        return False
    return bool(re.search(r"[A-Z]", password) and re.search(r"[a-z]", password) and re.search(r"\d", password))


def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode(), hashed.encode())


def token(subject: str, token_type: str, expires):
    return jwt.encode(
        {"sub": subject, "type": token_type, "iat": int(now().timestamp()), "exp": int(expires.timestamp())},
        JWT_SECRET,
        algorithm=ALGORITHM,
    )


def public_user(user):
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
    }


async def get_current_user(request: Request):
    raw = request.cookies.get("access_token")
    if not raw:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(raw, JWT_SECRET, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"_id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Session expired")


async def admin_user(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


def set_auth_cookies(response: Response, user_id: str, email: str):
    response.set_cookie(
        "access_token",
        token(user_id, "access", now() + timedelta(minutes=ACCESS_MINUTES)),
        httponly=True, secure=COOKIE_SECURE, samesite="lax", max_age=ACCESS_MINUTES * 60, path="/",
    )
    response.set_cookie(
        "refresh_token",
        token(user_id, "refresh", now() + timedelta(days=REFRESH_DAYS)),
        httponly=True, secure=COOKIE_SECURE, samesite="lax", max_age=REFRESH_DAYS * 86400, path="/",
    )


class RegisterInput(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class LibraryInput(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    address: str = Field(min_length=1, max_length=300)
    phone: str = ""
    email: str = ""


class BookInput(BaseModel):
    title: str = Field(min_length=1, max_length=250)
    author: str = Field(min_length=1, max_length=180)
    isbn: str = ""
    genre: str = ""
    publication_year: Optional[int] = None


class InventoryInput(BaseModel):
    library_id: str
    book_id: str
    total_copies: int = Field(ge=0)
    available_copies: int = Field(ge=0)


def clean(doc):
    if not doc:
        return None
    doc.pop("_id", None)
    for key, value in list(doc.items()):
        if hasattr(value, "isoformat"):
            doc[key] = value.isoformat()
    return doc


async def ensure_admin():
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "_id": str(uuid.uuid4()),
            "email": ADMIN_EMAIL,
            "name": "Library Administrator",
            "role": "admin",
            "password_hash": hash_password(ADMIN_PASSWORD),
            "created_at": now(),
            "updated_at": now(),
        })


@app.on_event("startup")
async def startup():
    await ensure_admin()


@api.get("/")
async def root():
    return {"message": "The Stacks API is running"}


@api.post("/auth/register")
@limiter.limit("10/hour")
async def register(request: Request, data: RegisterInput, response: Response):
    email = str(data.email).lower()
    if not password_valid(data.password):
        raise HTTPException(status_code=400, detail="Password must contain uppercase, lowercase and a number")
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Email already registered")
    user = {
        "_id": str(uuid.uuid4()),
        "email": email,
        "name": data.name.strip(),
        "role": "user",
        "password_hash": hash_password(data.password),
        "created_at": now(),
        "updated_at": now(),
    }
    await db.users.insert_one(user)
    set_auth_cookies(response, user["_id"], email)
    return public_user(user)


@api.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, data: LoginInput, response: Response):
    user = await db.users.find_one({"email": str(data.email).lower()})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    set_auth_cookies(response, user["_id"], user["email"])
    return public_user(user)


@api.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return public_user(user)


@api.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    raw = request.cookies.get("refresh_token")
    if not raw:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(raw, JWT_SECRET, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        user = await db.users.find_one({"_id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        set_auth_cookies(response, user["_id"], user["email"])
        return {"message": "refreshed"}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Refresh token expired")


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "logged out"}


@api.get("/libraries")
async def libraries(user=Depends(get_current_user)):
    docs = await db.libraries.find({"deleted_at": None}).sort("name", 1).to_list(1000)
    return [clean(d) for d in docs]


@api.get("/libraries/{library_id}")
async def library_detail(library_id: str, user=Depends(get_current_user)):
    lib = await db.libraries.find_one({"id": library_id, "deleted_at": None})
    if not lib:
        raise HTTPException(status_code=404, detail="Library not found")
    inventory = await db.inventory.find({"library_id": library_id, "deleted_at": None}).to_list(1000)
    books = []
    for item in inventory:
        book = await db.books.find_one({"id": item["book_id"], "deleted_at": None})
        if book:
            item["book"] = clean(book)
            books.append(clean(item))
    result = clean(lib)
    result["collection"] = books
    return result


@api.post("/libraries")
async def create_library(data: LibraryInput, user=Depends(admin_user)):
    doc = data.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now(), "updated_at": now(), "deleted_at": None})
    await db.libraries.insert_one(doc)
    return clean(doc)


@api.put("/libraries/{library_id}")
async def update_library(library_id: str, data: LibraryInput, user=Depends(admin_user)):
    result = await db.libraries.update_one(
        {"id": library_id, "deleted_at": None},
        {"$set": {**data.model_dump(), "updated_at": now()}},
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Library not found")
    return clean(await db.libraries.find_one({"id": library_id}))


@api.delete("/libraries/{library_id}")
async def delete_library(library_id: str, user=Depends(admin_user)):
    result = await db.libraries.update_one(
        {"id": library_id, "deleted_at": None},
        {"$set": {"deleted_at": now(), "updated_at": now()}},
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Library not found")
    await db.inventory.update_many({"library_id": library_id, "deleted_at": None}, {"$set": {"deleted_at": now()}})
    return {"message": "Library deleted"}


@api.get("/books")
async def books(user=Depends(get_current_user)):
    docs = await db.books.find({"deleted_at": None}).sort("title", 1).to_list(2000)
    return [clean(d) for d in docs]


@api.post("/books")
async def create_book(data: BookInput, user=Depends(admin_user)):
    doc = data.model_dump()
    doc.update({"id": str(uuid.uuid4()), "created_at": now(), "updated_at": now(), "deleted_at": None})
    await db.books.insert_one(doc)
    return clean(doc)


@api.put("/books/{book_id}")
async def update_book(book_id: str, data: BookInput, user=Depends(admin_user)):
    result = await db.books.update_one(
        {"id": book_id, "deleted_at": None},
        {"$set": {**data.model_dump(), "updated_at": now()}},
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Book not found")
    return clean(await db.books.find_one({"id": book_id}))


@api.delete("/books/{book_id}")
async def delete_book(book_id: str, user=Depends(admin_user)):
    result = await db.books.update_one(
        {"id": book_id, "deleted_at": None},
        {"$set": {"deleted_at": now(), "updated_at": now()}},
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Book not found")
    await db.inventory.update_many({"book_id": book_id, "deleted_at": None}, {"$set": {"deleted_at": now()}})
    return {"message": "Book deleted"}


@api.get("/search")
async def search(q: str = "", user=Depends(get_current_user)):
    query = q.strip()
    if query:
        regex = {"$regex": re.escape(query), "$options": "i"}
        cursor = db.books.find({
            "deleted_at": None,
            "$or": [{"title": regex}, {"author": regex}, {"isbn": regex}, {"genre": regex}],
        }).sort("title", 1)
    else:
        cursor = db.books.find({"deleted_at": None}).sort("title", 1)
    found = await cursor.to_list(2000)
    output = []
    for book in found:
        inv = await db.inventory.find({"book_id": book["id"], "deleted_at": None}).to_list(1000)
        total = sum(x.get("total_copies", 0) for x in inv)
        available = sum(x.get("available_copies", 0) for x in inv)
        libraries = []
        for x in inv:
            lib = await db.libraries.find_one({"id": x["library_id"], "deleted_at": None})
            if lib:
                libraries.append({
                    "id": lib["id"], "name": lib["name"],
                    "total_copies": x["total_copies"],
                    "available_copies": x["available_copies"],
                })
        item = clean(book)
        item.update({
            "total_copies": total,
            "available_copies": available,
            "borrowed_copies": max(0, total - available),
            "libraries": libraries,
        })
        output.append(item)
    return output


@api.get("/inventory")
async def inventory(user=Depends(admin_user)):
    docs = await db.inventory.find({"deleted_at": None}).to_list(5000)
    result = []
    for d in docs:
        book = await db.books.find_one({"id": d["book_id"], "deleted_at": None})
        lib = await db.libraries.find_one({"id": d["library_id"], "deleted_at": None})
        item = clean(d)
        item["book"] = clean(book)
        item["library"] = clean(lib)
        result.append(item)
    return result


@api.post("/inventory")
async def create_or_update_inventory(data: InventoryInput, user=Depends(admin_user)):
    if data.available_copies > data.total_copies:
        raise HTTPException(status_code=400, detail="Available copies cannot exceed total copies")
    if not await db.books.find_one({"id": data.book_id, "deleted_at": None}):
        raise HTTPException(status_code=404, detail="Book not found")
    if not await db.libraries.find_one({"id": data.library_id, "deleted_at": None}):
        raise HTTPException(status_code=404, detail="Library not found")

    existing = await db.inventory.find_one({
        "library_id": data.library_id, "book_id": data.book_id, "deleted_at": None
    })
    values = {**data.model_dump(), "updated_at": now()}
    if existing:
        await db.inventory.update_one({"id": existing["id"]}, {"$set": values})
        doc = await db.inventory.find_one({"id": existing["id"]})
    else:
        values.update({"id": str(uuid.uuid4()), "created_at": now(), "deleted_at": None})
        await db.inventory.insert_one(values)
        doc = values
    return clean(doc)


@api.delete("/inventory")
async def delete_inventory(library_id: str, book_id: str, user=Depends(admin_user)):
    result = await db.inventory.update_one(
        {"library_id": library_id, "book_id": book_id, "deleted_at": None},
        {"$set": {"deleted_at": now(), "updated_at": now()}},
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Inventory record not found")
    return {"message": "Inventory removed"}


@api.get("/admin/stats")
async def stats(user=Depends(admin_user)):
    total_libraries = await db.libraries.count_documents({"deleted_at": None})
    total_books = await db.books.count_documents({"deleted_at": None})
    rows = await db.inventory.find({"deleted_at": None}).to_list(10000)
    total = sum(x.get("total_copies", 0) for x in rows)
    available = sum(x.get("available_copies", 0) for x in rows)
    return {
        "total_libraries": total_libraries,
        "total_books": total_books,
        "total_copies": total,
        "available_copies": available,
        "borrowed_copies": max(0, total - available),
    }


app.include_router(api)
