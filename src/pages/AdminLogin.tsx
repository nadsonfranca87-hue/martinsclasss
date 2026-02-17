import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const hasAttemptedLogin = useRef(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signIn } = useAuth();

  // Redirect when user is authenticated and is admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate("/painel/dashboard", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Show error if logged in but NOT admin (after auth finishes loading and login was attempted)
  useEffect(() => {
    if (!authLoading && user && !isAdmin && hasAttemptedLogin.current) {
      setError("Esta conta não possui permissão de administrador. Use a conta admin correta.");
      setLoginLoading(false);
      hasAttemptedLogin.current = false;
    }
  }, [authLoading, user, isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoginLoading(true);
    hasAttemptedLogin.current = true;

    const { error: err } = await signIn(email, password);
    if (err) {
      setError("Email ou senha incorretos. Se é o primeiro acesso, crie sua conta admin primeiro.");
      setLoginLoading(false);
      hasAttemptedLogin.current = false;
    }
    // If signIn succeeded, wait for useEffect to handle redirect or show not-admin error
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // If already logged in and admin, show nothing while redirecting
  if (user && isAdmin) {
    return null;
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
          {error && (
            <div className="space-y-3">
              <p className="font-body text-sm text-destructive">{error}</p>
              <a
                href="/painel/setup"
                className="block text-center font-body text-xs text-primary hover:text-primary/80 underline"
              >
                Criar primeira conta admin
              </a>
            </div>
          )}
          <button
            type="submit"
            disabled={loginLoading}
            className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors duration-300 w-full disabled:opacity-50"
          >
            {loginLoading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="font-body text-xs text-muted-foreground text-center mt-6">
          Primeiro acesso? <a href="/painel/setup" className="text-primary hover:text-primary/80 underline">Criar conta admin</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
