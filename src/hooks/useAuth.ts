import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

async function checkAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Erro ao verificar admin:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Erro inesperado na verificação de admin:", err);
    return false;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up listener FIRST (before getSession) to catch all auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Defer Supabase call to avoid deadlock inside callback
          setTimeout(async () => {
            if (!mounted) return;
            const adminStatus = await checkAdmin(currentUser.id);
            if (mounted) setIsAdmin(adminStatus);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Initial session check - controls loading state
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const adminStatus = await checkAdmin(currentUser.id);
          if (mounted) setIsAdmin(adminStatus);
        }
      } catch (err) {
        console.error("Erro na inicialização da auth:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, isAdmin, loading, signIn, signOut };
}
