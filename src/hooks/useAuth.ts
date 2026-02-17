import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = useCallback(async (userId: string) => {
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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);

      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const admin = await checkAdminRole(currentUser.id);
        if (isMounted) setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }

      if (isMounted) setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const admin = await checkAdminRole(currentUser.id);
          if (isMounted) setIsAdmin(admin);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  return { user, isAdmin, loading, signIn, signOut };
}
