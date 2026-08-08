import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
const BG = "https://images.unsplash.com/photo-1739918075668-fc7844c6d921?auto=format&fit=crop&w=1800&q=85";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = mode === "login" ? await login(email, password) : await register(name, email, password);
      navigate(location.state?.from || (user.role === "admin" ? "/admin" : "/"));
    } catch (err) {
      toast.error(err.response?.data?.detail || "Unable to continue");
    } finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper">
      <section className="hidden lg:block relative min-h-screen bg-cover bg-center" style={{backgroundImage: `linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),url(${BG})`}}>
        <div className="absolute inset-0 flex flex-col justify-end p-14 text-paper">
          <p className="uppercase tracking-[.25em] text-xs mb-3">A catalogue for curious minds</p>
          <h1 className="font-serif text-6xl font-bold tracking-tight max-w-xl">Find your next chapter.</h1>
          <p className="mt-5 max-w-lg text-paper/80 leading-7">Search collections across your library branches and know exactly where a book is waiting.</p>
        </div>
      </section>
      <section className="grain min-h-screen flex items-center p-7 sm:p-12 lg:p-20">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <span className="w-10 h-10 bg-green text-paper rounded-sm flex items-center justify-center"><BookOpen className="w-5 h-5" /></span>
            <span className="font-serif text-2xl font-bold">The Stacks</span>
          </div>
          <p className="text-gold uppercase tracking-widest text-xs font-medium mb-2">{mode === "login" ? "Welcome back" : "Join the catalogue"}</p>
          <h2 className="font-serif text-4xl font-bold tracking-tight">{mode === "login" ? "Sign in" : "Create an account"}</h2>
          <p className="text-muted mt-3 mb-8">{mode === "login" ? "Enter your details to continue." : "Create a reader account in a few seconds."}</p>
          <form onSubmit={submit} className="space-y-5">
            {mode === "register" && <div><Label>Name</Label><Input className="mt-1.5" value={name} onChange={e=>setName(e.target.value)} required data-testid="register-name-input" /></div>}
            <div><Label>Email</Label><Input type="email" className="mt-1.5" value={email} onChange={e=>setEmail(e.target.value)} required data-testid="login-email-input" /></div>
            <div><Label>Password</Label><Input type="password" className="mt-1.5" value={password} onChange={e=>setPassword(e.target.value)} required data-testid="login-password-input" /></div>
            <Button type="submit" disabled={busy} className="w-full bg-green hover:bg-green-dark text-paper" data-testid="login-submit-button">
              {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}{mode === "login" ? "Sign in" : "Create account"}
            </Button>
          </form>
          <button onClick={()=>setMode(mode==="login"?"register":"login")} data-testid="auth-mode-toggle" className="mt-6 text-sm text-green hover:underline transition-colors">
            {mode === "login" ? "Need an account? Register" : "Already have an account? Sign in"}
          </button>
        </div>
      </section>
    </div>
  );
}
