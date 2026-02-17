import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("A senha deve ter pelo menos 6 caracteres"); return; }
    setLoading(true);

    // Sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          role: 'admin'
        }
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Assign admin role via database RPC function
      const { error: roleError } = await supabase.rpc("assign_first_admin", {
        target_user_id: data.user.id,
      });

      if (roleError) {
        toast.error("Conta criada, mas erro ao definir como admin: " + roleError.message);
        setLoading(false);
        return;
      }

      // If email confirmation is disabled, user is already logged in
      // If confirmation is required, show message
      if (data.session) {
        toast.success("Conta admin criada com sucesso! Redirecionando...");
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate("/painel/dashboard");
      } else {
        toast.success("Conta criada! Faça login com suas credenciais.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        navigate("/painel");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl text-foreground text-center mb-2">Setup Admin</h1>
        <p className="font-body text-sm text-muted-foreground text-center mb-8">Crie sua conta de administrador</p>

        <form onSubmit={handleSetup} className="space-y-6">
          <div>
            <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300" required />
          </div>
          <div>
            <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300" required />
          </div>
          <button type="submit" disabled={loading} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors duration-300 w-full disabled:opacity-50">
            {loading ? "Criando..." : "Criar Conta Admin"}
          </button>
        </form>

        <p className="font-body text-xs text-muted-foreground text-center mt-6">
          Já tem uma conta? <a href="/painel" className="text-primary hover:text-primary/80 underline">Fazer login</a>
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;
