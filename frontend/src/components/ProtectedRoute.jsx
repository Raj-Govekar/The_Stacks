import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import { Loader2 } from "lucide-react";

function Guard({ children, admin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-paper"><Loader2 className="w-6 h-6 animate-spin text-green" /></div>;
  }
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export const ProtectedRoute = ({ children }) => <Guard>{children}</Guard>;
export const AdminRoute = ({ children }) => <Guard admin>{children}</Guard>;
