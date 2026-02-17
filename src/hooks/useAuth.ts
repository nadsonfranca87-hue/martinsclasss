import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
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
      console.error("Erro inesperado:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const admin = await checkAdminRole(currentUser.id);
          if (mounted) setIsAdmin(admin);
        }
      } catch (err) {
        console.error("Erro na inicialização:", err);
      } finally {
        if (mounted) {
          setLoading(false);
          initializedRef.current = true;
        }
      }
    };

    initializeAuth();

    // Set up auth state listener for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        // Skip the initial event since initializeAuth handles it
        if (!initializedRef.current) return;

        const currentUser = session?.user ?? null;

        if (currentUser) {
          // Set loading BEFORE updating user to prevent race conditions
          setLoading(true);
          setUser(currentUser);
          setIsAdmin(false);

          const admin = await checkAdminRole(currentUser.id);
          if (mounted) {
            setIsAdmin(admin);
            setLoading(false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkAdminRole]);

  const signIn = async (email: string, password: string) => {
    // Set loading before sign-in to prevent brief flash of incorrect state
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error) {
      setLoading(false);
    }
    // If successful, onAuthStateChange will handle setting user/isAdmin/loading
    return result;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, isAdmin, loading, signIn, signOut };
}
