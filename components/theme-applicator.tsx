"use client";

import { useEffect } from "react";
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";

async function fetchSettings() {
  const supabase = createClient();
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  const settings: Record<string, string> = {};
  (data || []).forEach((row: any) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export function useSiteSettings() {
  return useSWR("site-settings", fetchSettings, {
    revalidateOnFocus: false,
    dedupingInterval: 300000,
    errorRetryCount: 1,
  });
}

export default function ThemeApplicator() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;

    if (settings.theme_primary) {
      root.style.setProperty("--primary", settings.theme_primary);
      root.style.setProperty("--ring", settings.theme_primary);
    }
    if (settings.theme_accent) {
      root.style.setProperty("--accent", settings.theme_accent);
    }

    return () => {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--accent");
    };
  }, [settings]);

  return null;
}
