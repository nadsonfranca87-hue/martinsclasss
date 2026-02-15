import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

  if (isLoading) return <p className="font-body text-muted-foreground">Carregando...</p>;

  const fields = [
    { key: "hero_title", label: "Título Hero" },
    { key: "hero_subtitle", label: "Subtítulo Hero" },
    { key: "hero_description", label: "Descrição Hero", multiline: true },
    { key: "about_title", label: "Título Sobre" },
    { key: "about_text1", label: "Sobre - Parágrafo 1", multiline: true },
    { key: "about_text2", label: "Sobre - Parágrafo 2", multiline: true },
    { key: "contact_email", label: "Email de Contato" },
    { key: "contact_phone", label: "Telefone" },
    { key: "contact_address", label: "Endereço" },
    { key: "whatsapp_number", label: "WhatsApp (somente números)" },
    { key: "whatsapp_link", label: "Link WhatsApp" },
    { key: "instagram_link", label: "Link Instagram" },
    { key: "footer_text", label: "Texto do Rodapé" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-foreground">Configurações do Site</h2>
      <div className="space-y-4 max-w-2xl">
        {fields.map((f) => (
          <AdminField key={f.key} label={f.label} value={form[f.key] || ""} onChange={(v) => setForm({ ...form, [f.key]: v })} multiline={f.multiline} />
        ))}
      </div>
      <button onClick={handleSave} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors">Salvar Configurações</button>
    </div>
  );
}
