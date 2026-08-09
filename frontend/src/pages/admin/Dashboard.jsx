import { useEffect, useState } from "react";
<<<<<<< HEAD
import api from "../../lib/api";
=======
import api from "../lib/api";
>>>>>>> 4ae347f (Replace all @/ path aliases with relative paths)
import { Library, BookCopy, Boxes, CheckCircle2, Loader2 } from "lucide-react";

const Card=({icon:Icon,label,value,testid})=><div className="bg-white border border-line p-6 rounded-sm" data-testid={testid}><div className="w-10 h-10 bg-[#EAF3EB] flex items-center justify-center rounded-sm mb-4"><Icon className="w-5 h-5 text-green"/></div><p className="font-serif text-4xl font-bold">{value}</p><p className="text-sm text-muted mt-1">{label}</p></div>;

export default function Dashboard(){
  const [stats,setStats]=useState(null);
  useEffect(()=>{api.get("/admin/stats").then(r=>setStats(r.data));},[]);
  return <div><p className="text-gold font-medium uppercase tracking-widest text-xs mb-2">Dashboard</p><h1 className="font-serif text-4xl font-bold tracking-tight mb-8">Overview</h1>
    {!stats?<div className="flex gap-2 text-muted"><Loader2 className="animate-spin"/>Loading stats…</div>:
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><Card icon={Library} label="Libraries" value={stats.total_libraries} testid="stat-libraries"/><Card icon={BookCopy} label="Book titles" value={stats.total_books} testid="stat-books"/><Card icon={CheckCircle2} label="Copies available" value={stats.available_copies} testid="stat-available"/><Card icon={Boxes} label="Copies borrowed" value={stats.borrowed_copies} testid="stat-borrowed"/></div>}
  </div>;
}
