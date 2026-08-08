# The Stacks — Library Management System

A complete React + FastAPI + MongoDB library catalogue and inventory system.

## Features
- Login and registration
- Role-based admin access
- Search books by title, author, ISBN or genre
- Browse library branches
- View library collections
- Admin dashboard with live statistics
- CRUD for libraries and books
- Inventory management with validation
- Warm editorial "classic library" design
- Responsive layout
- HTTP-only authentication cookies
- Automatic access-token refresh

## Project structure
```text
the-stacks/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
└── frontend/
    ├── package.json
    ├── .env.example
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── public/index.html
    └── src/
        ├── App.js
        ├── App.css
        ├── index.css
        ├── index.js
        ├── components/
        ├── context/
        ├── lib/
        └── pages/
```

## Run backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
uvicorn main:app --reload
```

## Run frontend
```bash
cd frontend
npm install
copy .env.example .env       # Windows
# cp .env.example .env       # macOS/Linux
npm start
```

Frontend: http://localhost:3000  
Backend: http://localhost:8000

## MongoDB
Use a local MongoDB server or MongoDB Atlas. Set `MONGO_URL` and `DB_NAME` in `backend/.env`.

## Default admin
The backend creates the configured admin account on startup:
- Email: `admin@example.com`
- Password: `admin123`

Change these values in `.env` before using the application anywhere public.
