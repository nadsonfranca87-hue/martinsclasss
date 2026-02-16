import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Eye, EyeOff, X, Star } from "lucide-react";
import AdminField from "./AdminField";

export default function TestimonialsTab() {
  const queryClient = useQueryClient();
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
      if (error) throw error;
      return data || [];
    },
  });

  const [editing, setEditing] = useState<any>(null);

  const handleCreate = async () => {
    const { data, error } = await supabase.from("testimonials").insert({
      customer_name: "Novo Cliente",
      message: "Escreva o depoimento aqui...",
      rating: 5,
    }).select().single();
    if (error) { toast.error("Erro ao criar"); return; }
    queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    setEditing(data);
    toast.success("Depoimento criado!");
  };

  const handleSave = async () => {
    if (!editing) return;
    const { error } = await supabase.from("testimonials").update({
      customer_name: editing.customer_name,
      customer_photo: editing.customer_photo,
      message: editing.message,
      rating: editing.rating,
      is_visible: editing.is_visible,
      sort_order: editing.sort_order,
    }).eq("id", editing.id);
    if (error) { toast.error("Erro ao salvar"); return; }
    queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    setEditing(null);
    toast.success("Depoimento salvo!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este depoimento?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    toast.success("Excluído!");
  };

  const handleToggle = async (id: string, visible: boolean) => {
    await supabase.from("testimonials").update({ is_visible: !visible }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
  };

  if (isLoading) return <div className="h-8 bg-secondary rounded w-48 animate-pulse" />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display text-xl sm:text-2xl text-foreground">
          Depoimentos <span className="text-muted-foreground text-base">({testimonials?.length || 0})</span>
        </h2>
        <button onClick={handleCreate} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-4 py-2.5 hover:bg-primary/90 transition-colors flex items-center gap-1.5 rounded-sm self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" /> Novo Depoimento
        </button>
      </div>

      {editing && (
        <div className="border border-primary/20 bg-card p-4 sm:p-6 space-y-4 rounded-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-foreground">Editando Depoimento</h3>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminField label="Nome do Cliente" value={editing.customer_name} onChange={(v) => setEditing({ ...editing, customer_name: v })} />
            <AdminField label="Foto (URL)" value={editing.customer_photo || ""} onChange={(v) => setEditing({ ...editing, customer_photo: v })} placeholder="https://..." />
            <div className="space-y-1.5">
              <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground block">Avaliação</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setEditing({ ...editing, rating: n })} className="p-1">
                    <Star className={`h-5 w-5 ${n <= editing.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  </button>
                ))}
              </div>
            </div>
            <AdminField label="Ordem" value={String(editing.sort_order || 0)} onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })} type="number" />
          </div>
          <AdminField label="Mensagem" value={editing.message} onChange={(v) => setEditing({ ...editing, message: v })} multiline />
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-6 py-2.5 hover:bg-primary/90 transition-colors rounded-sm">Salvar</button>
            <button onClick={() => setEditing(null)} className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-6 py-2.5 hover:text-foreground transition-colors rounded-sm">Cancelar</button>
          </div>
        </div>
      )}

      {testimonials?.length === 0 ? (
        <div className="border border-border bg-card/50 p-10 flex flex-col items-center gap-3 rounded-sm">
          <Star className="h-10 w-10 text-muted-foreground/30" />
          <p className="font-body text-sm text-muted-foreground">Nenhum depoimento ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {testimonials?.map((t: any) => (
            <div key={t.id} className={`border border-border bg-card/50 p-4 flex gap-3 items-start rounded-sm ${!t.is_visible ? "opacity-50" : ""}`}>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground font-medium">{t.customer_name}</p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                  ))}
                </div>
                <p className="font-body text-xs text-muted-foreground mt-1 line-clamp-2">{t.message}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => handleToggle(t.id, t.is_visible)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary transition-colors">
                  {t.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing({ ...t })} className="font-body text-[10px] sm:text-xs text-primary hover:text-primary/80 px-2 py-1 rounded-sm hover:bg-primary/10 transition-colors">Editar</button>
                <button onClick={() => handleDelete(t.id)} className="font-body text-[10px] sm:text-xs text-destructive hover:text-destructive/80 px-2 py-1 rounded-sm hover:bg-destructive/10 transition-colors">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
