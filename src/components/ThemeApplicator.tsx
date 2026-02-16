import { useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

/**
 * Applies dynamic theme colors from site_settings to CSS variables.
 * Place this component once in the app tree.
 */
export default function ThemeApplicator() {
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;

    if (settings.theme_primary) {
      root.style.setProperty("--primary", settings.theme_primary);
      root.style.setProperty("--ring", settings.theme_primary);
      root.style.setProperty("--sidebar-primary", settings.theme_primary);
      root.style.setProperty("--sidebar-ring", settings.theme_primary);
    }
    if (settings.theme_accent) {
      root.style.setProperty("--accent", settings.theme_accent);
    }

    return () => {
      // Reset to defaults on unmount
      root.style.removeProperty("--primary");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--sidebar-primary");
      root.style.removeProperty("--sidebar-ring");
    };
  }, [settings]);

  return null;
}
