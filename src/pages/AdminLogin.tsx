import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "os martins frança" && password === "vencedores 2026") {
      sessionStorage.setItem("admin_auth", "true");
      navigate("/painel/dashboard");
    } else {
      setError("Usuário ou senha incorretos");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-foreground text-center mb-2">Painel Admin</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-8">Martins Class</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
            />
          </div>
          <div>
            <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
            />
          </div>
          {error && <p className="font-body text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors duration-300 w-full"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
