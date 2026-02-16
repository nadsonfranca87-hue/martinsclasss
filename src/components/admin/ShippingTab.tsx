import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Save, Truck } from "lucide-react";
import AdminField from "./AdminField";

interface ShippingZone {
  id: string;
  name: string;
  cep_start: string;
  cep_end: string;
  price: number;
  estimated_days: number;
  is_active: boolean;
}

export default function ShippingTab() {
  const queryClient = useQueryClient();
  const { data: zones, isLoading } = useQuery({
    queryKey: ["shipping-zones-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shipping_zones").select("*").order("cep_start");
      if (error) throw error;
      return data as ShippingZone[];
    },
  });

  const [editing, setEditing] = useState<Partial<ShippingZone> | null>(null);

  const handleSave = async () => {
    if (!editing || !editing.name || !editing.cep_start || !editing.cep_end) {
      toast.error("Preencha nome, CEP início e CEP fim");
      return;
    }
    try {
      if (editing.id) {
        const { error } = await supabase.from("shipping_zones").update({
          name: editing.name,
          cep_start: editing.cep_start.replace(/\D/g, "").padEnd(8, "0"),
          cep_end: editing.cep_end.replace(/\D/g, "").padEnd(8, "0"),
          price: Number(editing.price) || 0,
          estimated_days: Number(editing.estimated_days) || 5,
          is_active: editing.is_active ?? true,
        }).eq("id", editing.id);
        if (error) throw error;
        toast.success("Zona atualizada!");
      } else {
        const { error } = await supabase.from("shipping_zones").insert({
          name: editing.name,
          cep_start: editing.cep_start.replace(/\D/g, "").padEnd(8, "0"),
          cep_end: editing.cep_end.replace(/\D/g, "").padEnd(8, "0"),
          price: Number(editing.price) || 0,
          estimated_days: Number(editing.estimated_days) || 5,
          is_active: editing.is_active ?? true,
        });
        if (error) throw error;
        toast.success("Zona criada!");
      }
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["shipping-zones-admin"] });
    } catch (err: any) {
      toast.error("Erro: " + (err.message || "verifique permissões"));
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("shipping_zones").delete().eq("id", id);
    if (error) { toast.error("Erro ao excluir"); return; }
    toast.success("Zona excluída!");
    queryClient.invalidateQueries({ queryKey: ["shipping-zones-admin"] });
  };

  if (isLoading) return <div className="h-8 bg-secondary rounded w-64 animate-pulse" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display text-xl sm:text-2xl text-foreground flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" /> Zonas de Frete
        </h2>
        <button
          onClick={() => setEditing({ name: "", cep_start: "", cep_end: "", price: 0, estimated_days: 5, is_active: true })}
          className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors flex items-center gap-1.5 rounded-sm self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" /> Nova Zona
        </button>
      </div>

      {/* Editing form */}
      {editing && (
        <div className="border border-primary/30 bg-primary/5 p-4 rounded-sm space-y-3 max-w-2xl">
          <h3 className="font-body text-xs letter-wide uppercase text-primary">
            {editing.id ? "Editar Zona" : "Nova Zona"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminField label="Nome da região" value={editing.name || ""} onChange={(v) => setEditing({ ...editing, name: v })} />
            <AdminField label="CEP Início" value={editing.cep_start || ""} onChange={(v) => setEditing({ ...editing, cep_start: v })} placeholder="01000000" />
            <AdminField label="CEP Fim" value={editing.cep_end || ""} onChange={(v) => setEditing({ ...editing, cep_end: v })} placeholder="09999999" />
            <AdminField label="Preço (R$)" value={String(editing.price || "")} onChange={(v) => setEditing({ ...editing, price: Number(v) })} placeholder="12.90" />
            <AdminField label="Dias estimados" value={String(editing.estimated_days || "")} onChange={(v) => setEditing({ ...editing, estimated_days: Number(v) })} placeholder="5" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-5 py-2.5 hover:bg-primary/90 transition-colors flex items-center gap-1.5 rounded-sm">
              <Save className="h-3.5 w-3.5" /> Salvar
            </button>
            <button onClick={() => setEditing(null)} className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-5 py-2.5 hover:text-foreground transition-colors rounded-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Zones list */}
      <div className="space-y-2 max-w-2xl">
        {zones?.length === 0 && <p className="font-body text-sm text-muted-foreground">Nenhuma zona cadastrada.</p>}
        {zones?.map((zone) => (
          <div key={zone.id} className="flex items-center gap-3 border border-border bg-card/50 p-3 rounded-sm">
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-foreground font-medium">{zone.name}</p>
              <p className="font-body text-xs text-muted-foreground">
                CEP: {zone.cep_start} - {zone.cep_end} · R$ {Number(zone.price).toFixed(2)} · {zone.estimated_days} dias
              </p>
            </div>
            <button onClick={() => setEditing(zone)} className="font-body text-[10px] letter-wide uppercase text-primary hover:text-primary/80 transition-colors">
              Editar
            </button>
            <button onClick={() => handleDelete(zone.id)} className="p-1.5 text-destructive hover:text-destructive/80 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
