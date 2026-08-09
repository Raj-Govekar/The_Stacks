import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Library, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

function BookCard({ book }) {
  const status = book.total_copies === 0 ? "Not Available" : book.available_copies > 0 ? "Available" : "Borrowed";
  return (
    <article className="bg-white border border-line p-5 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-editorial transition-transform duration-200" data-testid="book-card">
      <div className="h-44 bg-surface border border-line flex items-center justify-center overflow-hidden">
        <BookOpen className="w-12 h-12 text-green/40" />
      </div>
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl font-bold tracking-tight">{book.title}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-muted mt-1">{book.author}</p>
        {book.genre && <p className="text-xs text-gold uppercase tracking-wider mt-3">{book.genre}</p>}
      </div>
      <div className="border-t border-line pt-3">
        <p className="text-sm font-medium">{book.available_copies} available / {book.total_copies} copies</p>
        <div className="mt-2 space-y-1">
          {book.libraries.slice(0,3).map(lib => (
            <Link key={lib.id} to={`/libraries/${lib.id}`} data-testid="book-library-link" className="text-xs text-muted hover:text-green transition-colors flex items-center gap-1">
              <Library className="w-3.5 h-3.5" /> {lib.name} · {lib.available_copies} available
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [q, setQ] = useState("");
  const [books, setBooks] = useState([]);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = async (query = q) => {
    setLoading(true);
    try {
      const { data } = await api.get("/search", { params: { q: query } });
      setBooks(data);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    search("");
    api.get("/libraries").then(r=>setLibraries(r.data));
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <main className="max-w-7xl mx-auto px-5 lg:px-8">
        <section className="py-16 sm:py-24 border-b border-line">
          <p className="text-gold uppercase tracking-[.2em] text-xs font-medium mb-3">Library catalogue</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">Every shelf. One search.</h1>
          <p className="mt-6 text-muted text-lg max-w-2xl leading-8">Find books by title, author, ISBN or genre, then see which branch has a copy ready.</p>
          <form onSubmit={e=>{e.preventDefault();search();}} className="mt-10 max-w-3xl flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input value={q} onChange={e=>setQ(e.target.value)} data-testid="search-input" className="w-full bg-white border border-line px-12 py-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-green text-base" placeholder="Search title, author, ISBN or genre…" />
            </div>
            <button className="bg-green text-paper px-6 rounded-sm hover:bg-green-dark transition-colors" data-testid="search-button">Search</button>
          </form>
        </section>

        <section className="py-12">
          <div className="flex items-end justify-between mb-8">
            <div><p className="text-gold uppercase tracking-widest text-xs mb-2">Catalogue</p><h2 className="font-serif text-3xl font-bold">Books</h2></div>
            <p className="text-sm text-muted">{books.length} result{books.length !== 1 ? "s" : ""}</p>
          </div>
          {loading ? <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-green" /></div> :
            books.length === 0 ? <div className="py-16 border border-dashed border-line text-center text-muted">No books matched your search.</div> :
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{books.map(b=><BookCard key={b.id} book={b}/>)}</div>}
        </section>

        <section className="py-14 border-t border-line">
          <div className="flex items-end justify-between mb-8"><div><p className="text-gold uppercase tracking-widest text-xs mb-2">Branches</p><h2 className="font-serif text-3xl font-bold">Libraries</h2></div></div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {libraries.map(l => <Link key={l.id} to={`/libraries/${l.id}`} data-testid="library-card-link" className="bg-surface border border-line p-6 hover:shadow-editorial transition-shadow">
              <Library className="w-5 h-5 text-green mb-6"/><h3 className="font-serif text-2xl font-bold">{l.name}</h3><p className="text-muted text-sm mt-2">{l.address}</p><span className="mt-5 inline-flex items-center gap-2 text-sm text-green">View collection <ArrowRight className="w-4 h-4"/></span>
            </Link>)}
          </div>
        </section>
      </main>
    </div>
  );
}
