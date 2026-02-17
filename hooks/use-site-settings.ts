"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("*");
        if (error) throw error;
        const settings: Record<string, string> = {};
        (data || []).forEach((row: any) => {
          settings[row.key] = row.value;
        });
        return settings;
      } catch (err) {
        console.warn("Erro ao buscar configuracoes:", err);
        return {};
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
