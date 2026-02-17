import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signIn } = useAuth();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate("/painel/dashboard");
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("[v0] Attempting login with email:", email);
    const { error: err } = await signIn(email, password);
    if (err) {
      console.log("[v0] Login error:", err.message);
      setError("Email ou senha incorretos");
    } else {
      console.log("[v0] Login successful, waiting for auth state change...");
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-foreground text-center mb-2">Painel Admin</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-8">Martins Class</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
              required
            />
          </div>
          <div>
            <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
              required
            />
          </div>
          {error && <p className="font-body text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors duration-300 w-full disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
