import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { BookMarked, LayoutDashboard, Library, BookCopy, Boxes, LogOut, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  {to:"/admin",label:"Overview",icon:LayoutDashboard,testid:"admin-nav-overview"},
  {to:"/admin/libraries",label:"Libraries",icon:Library,testid:"admin-nav-libraries"},
  {to:"/admin/books",label:"Books",icon:BookCopy,testid:"admin-nav-books"},
  {to:"/admin/inventory",label:"Inventory",icon:Boxes,testid:"admin-nav-inventory"}
];

export default function AdminLayout() {
  const location=useLocation(), navigate=useNavigate();
  const {logout,user}=useAuth();
  const handleLogout=async()=>{await logout();navigate("/login");};
  return <div className="min-h-screen flex bg-paper">
    <aside className="w-60 shrink-0 bg-surface border-r border-line flex flex-col fixed h-screen z-40">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-line"><div className="w-8 h-8 bg-green flex items-center justify-center rounded-sm"><BookMarked className="w-4 h-4 text-paper"/></div><span className="font-serif text-lg font-bold">Admin</span></div>
      <nav className="flex-1 p-3 space-y-1">{NAV.map(item=>{const active=item.to==="/admin"?location.pathname==="/admin":location.pathname.startsWith(item.to);const Icon=item.icon;return <Link key={item.to} to={item.to} data-testid={item.testid} className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${active?"bg-green text-white":"text-ink hover:bg-[#EAF3EB]"}`}><Icon className="w-4 h-4"/>{item.label}</Link>})}</nav>
      <div className="p-3 border-t border-line space-y-1">
        <Link to="/" data-testid="admin-goto-search" className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm hover:bg-[#EAF3EB] transition-colors"><Search className="w-4 h-4"/>Search site</Link>
        <button onClick={handleLogout} data-testid="admin-logout-btn" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm text-[#9A2B2B] hover:bg-[#FBEBEA] transition-colors"><LogOut className="w-4 h-4"/>Sign out</button>
        <p className="px-3 pt-3 text-xs text-muted truncate">{user?.email}</p>
      </div>
    </aside>
    <main className="flex-1 ml-60 p-8 lg:p-12"><Outlet/></main>
  </div>;
}
