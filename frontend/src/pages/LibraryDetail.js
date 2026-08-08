import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Mail, MapPin, Phone, Loader2 } from "lucide-react";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";

export default function LibraryDetail() {
  const { id } = useParams();
  const [library, setLibrary] = useState(null);
  useEffect(()=>{ api.get(`/libraries/${id}`).then(r=>setLibrary(r.data)); },[id]);

  if (!library) return <div className="min-h-screen flex items-center justify-center bg-paper"><Loader2 className="animate-spin text-green"/></div>;

  return <div className="min-h-screen bg-paper"><Navbar/><main className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
    <Link to="/" data-testid="library-back-link" className="inline-flex items-center gap-2 text-sm text-green hover:underline mb-10"><ArrowLeft className="w-4 h-4"/> Back to catalogue</Link>
    <section className="border-b border-line pb-10">
      <p className="text-gold uppercase tracking-widest text-xs mb-2">Library branch</p>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold">{library.name}</h1>
      <div className="mt-6 flex flex-wrap gap-5 text-sm text-muted">
        <span className="flex gap-2"><MapPin className="w-4 h-4 text-green"/>{library.address}</span>
        {library.phone && <span className="flex gap-2"><Phone className="w-4 h-4 text-green"/>{library.phone}</span>}
        {library.email && <span className="flex gap-2"><Mail className="w-4 h-4 text-green"/>{library.email}</span>}
      </div>
    </section>
    <section className="py-10">
      <h2 className="font-serif text-3xl font-bold mb-7">Collection</h2>
      {library.collection.length === 0 ? <div className="border border-dashed border-line p-12 text-center text-muted">No books are currently recorded here.</div> :
      <div className="divide-y divide-line border-y border-line">
        {library.collection.map(item => {
          const status=item.available_copies===0 ? (item.total_copies===0?"Not Available":"Borrowed"):"Available";
          return <div key={item.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" data-testid="library-book-row">
            <div className="flex gap-4 items-center"><div className="w-12 h-14 bg-surface flex items-center justify-center border border-line"><BookOpen className="w-5 h-5 text-green/50"/></div><div><h3 className="font-serif text-xl font-bold">{item.book.title}</h3><p className="text-sm text-muted">{item.book.author}</p></div></div>
            <div className="flex items-center gap-5"><span className="text-sm text-muted">{item.available_copies} / {item.total_copies} available</span><StatusBadge status={status}/></div>
          </div>
        })}
      </div>}
    </section>
  </main></div>;
}
