import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save } from "lucide-react";
import AdminField from "./AdminField";

export default function SettingsTab() {
  const { data: settings, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const handleSave = async () => {
    for (const [key, value] of Object.entries(form)) {
      await supabase.from("site_settings").upsert({ key, value });
    }
    queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    toast.success("Configurações salvas!");
  };

  if (isLoading) return (
    <div className="space-y-4">
      <div className="h-8 bg-secondary rounded w-64 animate-pulse" />
      {[1,2,3,4].map(i => <div key={i} className="h-16 bg-secondary rounded animate-pulse" />)}
    </div>
  );

  const groups = [
    {
      title: "Hero / Página Inicial",
      fields: [
        { key: "hero_title", label: "Título Hero" },
        { key: "hero_subtitle", label: "Subtítulo Hero" },
        { key: "hero_description", label: "Descrição Hero", multiline: true },
      ],
    },
    {
      title: "Sobre",
      fields: [
        { key: "about_title", label: "Título Sobre" },
        { key: "about_text1", label: "Parágrafo 1", multiline: true },
        { key: "about_text2", label: "Parágrafo 2", multiline: true },
      ],
    },
    {
      title: "Contato & Redes",
      fields: [
        { key: "contact_email", label: "Email" },
        { key: "contact_phone", label: "Telefone" },
        { key: "contact_address", label: "Endereço" },
        { key: "whatsapp_number", label: "WhatsApp (números)" },
        { key: "whatsapp_link", label: "Link WhatsApp" },
        { key: "instagram_link", label: "Link Instagram" },
      ],
    },
    {
      title: "Rodapé",
      fields: [
        { key: "footer_text", label: "Texto do Rodapé" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display text-xl sm:text-2xl text-foreground">Configurações do Site</h2>
        <button onClick={handleSave} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors flex items-center gap-1.5 rounded-sm self-start sm:self-auto">
          <Save className="h-3.5 w-3.5" /> Salvar
        </button>
      </div>

      <div className="space-y-5 max-w-2xl">
        {groups.map((group) => (
          <div key={group.title} className="border border-border bg-card/50 p-4 sm:p-5 rounded-sm space-y-4">
            <h3 className="font-body text-[10px] letter-wide uppercase text-primary">{group.title}</h3>
            <div className="space-y-3">
              {group.fields.map((f) => (
                <AdminField
                  key={f.key}
                  label={f.label}
                  value={form[f.key] || ""}
                  onChange={(v) => setForm({ ...form, [f.key]: v })}
                  multiline={f.multiline}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
