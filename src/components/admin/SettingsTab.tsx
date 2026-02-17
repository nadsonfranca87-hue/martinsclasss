import { useState, useEffect, useRef } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save, Upload, Trash2, Palette } from "lucide-react";
import AdminField from "./AdminField";

const COLOR_PRESETS = [
  { name: "Dourado (padrão)", primary: "33 30% 70%", accent: "33 40% 55%" },
  { name: "Azul Royal", primary: "220 70% 55%", accent: "220 80% 45%" },
  { name: "Vermelho", primary: "0 70% 55%", accent: "0 80% 45%" },
  { name: "Verde Esmeralda", primary: "160 60% 45%", accent: "160 70% 35%" },
  { name: "Rosa", primary: "330 60% 60%", accent: "330 70% 50%" },
  { name: "Branco & Preto", primary: "0 0% 85%", accent: "0 0% 70%" },
];

export default function SettingsTab() {
  const { data: settings, isLoading } = useSiteSettings();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const bgFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const handleSave = async () => {
    try {
      for (const [key, value] of Object.entries(form)) {
        const { error } = await supabase.from("site_settings").upsert({ key, value });
        if (error) throw error;
      }
      await queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Configurações salvas!");
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      toast.error("Erro ao salvar: " + (err.message || "verifique se você está logado como admin"));
    }
  };

  const handleBgUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setUploadingBg(true);
    const ext = file.name.split(".").pop();
    const path = `hero-bg/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (uploadErr) { toast.error("Erro no upload"); setUploadingBg(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(path);
    setForm({ ...form, hero_bg_image: publicUrl });
    setUploadingBg(false);
    toast.success("Imagem enviada! Salve para aplicar.");
  };

  const handleLogoUpload = async (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setUploadingLogo(true);
    const ext = file.name.split(".").pop();
    const path = `logo/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (uploadErr) { toast.error("Erro no upload"); setUploadingLogo(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("site-assets").getPublicUrl(path);
    setForm({ ...form, logo_url: publicUrl });
    setUploadingLogo(false);
    toast.success("Logo enviada! Salve para aplicar.");
  };

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setForm({ ...form, theme_primary: preset.primary, theme_accent: preset.accent });
    toast.success(`Tema "${preset.name}" selecionado. Salve para aplicar.`);
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
          <Save className="h-3.5 w-3.5" /> Salvar Tudo
        </button>
      </div>

      <div className="space-y-5 max-w-2xl">
        {/* Theme Colors */}
        <div className="border border-border bg-card/50 p-4 sm:p-5 rounded-sm space-y-4">
          <h3 className="font-body text-[10px] letter-wide uppercase text-primary flex items-center gap-1.5">
            <Palette className="h-3.5 w-3.5" /> Cores do Tema
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyColorPreset(preset)}
                className={`flex items-center gap-2 border border-border p-2.5 rounded-sm hover:border-primary/50 transition-colors text-left ${
                  form.theme_primary === preset.primary ? "border-primary bg-primary/10" : ""
                }`}
              >
                <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: `hsl(${preset.primary})` }} />
                <span className="font-body text-xs text-foreground">{preset.name}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <AdminField label="Cor Primária (HSL)" value={form.theme_primary || ""} onChange={(v) => setForm({ ...form, theme_primary: v })} placeholder="33 30% 70%" />
            <AdminField label="Cor Accent (HSL)" value={form.theme_accent || ""} onChange={(v) => setForm({ ...form, theme_accent: v })} placeholder="33 40% 55%" />
          </div>
        </div>

        {/* Logo */}
        <div className="border border-border bg-card/50 p-4 sm:p-5 rounded-sm space-y-4">
          <h3 className="font-body text-[10px] letter-wide uppercase text-primary">Logo da Loja</h3>
          {form.logo_url && (
            <div className="relative w-24 h-24 bg-secondary rounded-full overflow-hidden">
              <img src={form.logo_url} alt="Logo" className="w-full h-full object-contain" />
              <button
                onClick={() => setForm({ ...form, logo_url: "" })}
                className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-1 rounded-full"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          )}
          <input ref={logoFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleLogoUpload(e.target.files)} />
          <button
            onClick={() => logoFileRef.current?.click()}
            disabled={uploadingLogo}
            className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-4 py-2 hover:text-foreground hover:border-primary transition-all flex items-center gap-1.5 rounded-sm disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> {uploadingLogo ? "Enviando..." : "Upload Logo"}
          </button>
          <AdminField label="Ou URL da logo" value={form.logo_url || ""} onChange={(v) => setForm({ ...form, logo_url: v })} placeholder="https://..." />
        </div>

        {/* Background Image */}
        <div className="border border-border bg-card/50 p-4 sm:p-5 rounded-sm space-y-4">
          <h3 className="font-body text-[10px] letter-wide uppercase text-primary">Imagem de Fundo (Hero)</h3>
          {form.hero_bg_image && (
            <div className="relative w-full aspect-video bg-secondary rounded-sm overflow-hidden">
              <img src={form.hero_bg_image} alt="Background" className="w-full h-full object-cover" />
              <button
                onClick={() => setForm({ ...form, hero_bg_image: "" })}
                className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-sm"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
          <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && handleBgUpload(e.target.files)} />
          <button
            onClick={() => bgFileRef.current?.click()}
            disabled={uploadingBg}
            className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-4 py-2 hover:text-foreground hover:border-primary transition-all flex items-center gap-1.5 rounded-sm disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" /> {uploadingBg ? "Enviando..." : "Upload Imagem de Fundo"}
          </button>
          <AdminField label="Ou URL da imagem" value={form.hero_bg_image || ""} onChange={(v) => setForm({ ...form, hero_bg_image: v })} placeholder="https://..." />
        </div>

        {/* Content groups */}
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
