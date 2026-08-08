import { Link, useNavigate } from "react-router-dom";
import { BookMarked, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate("/login"); };

  return (
    <header className="h-16 border-b border-line bg-paper sticky top-0 z-40">
      <div className="max-w-7xl mx-auto h-full px-5 lg:px-8 flex items-center justify-between">
        <Link to="/" data-testid="brand-link" className="flex items-center gap-3">
          <span className="w-8 h-8 bg-green text-paper rounded-sm flex items-center justify-center">
            <BookMarked className="w-4 h-4" />
          </span>
          <span className="font-serif font-bold text-xl tracking-tight">The Stacks</span>
        </Link>
        <div className="flex items-center gap-5 text-sm">
          {user?.role === "admin" && (
            <Link to="/admin" data-testid="nav-admin" className="flex items-center gap-2 text-green hover:text-green-dark transition-colors">
              <Shield className="w-4 h-4" /> Admin
            </Link>
          )}
          <span className="hidden sm:block text-muted">{user?.name}</span>
          <button onClick={signOut} data-testid="nav-logout" className="flex items-center gap-2 text-[#9A2B2B] hover:underline transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
