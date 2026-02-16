import { useState } from "react";
import { useCategories, useStyles, useBrands } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function CategoriesTab() {
  const { data: categories } = useCategories();
  const { data: styles } = useStyles();
  const { data: brands } = useBrands();
  const queryClient = useQueryClient();
  const [newCat, setNewCat] = useState("");
  const [newStyle, setNewStyle] = useState("");
  const [newBrand, setNewBrand] = useState("");

  const addItem = async (table: "categories" | "styles" | "brands", name: string, setter: (v: string) => void) => {
    if (!name.trim()) return;
    const { error } = await supabase.from(table).insert({ name: name.trim() } as any);
    if (error) { toast.error(error.message.includes("duplicate") ? "Já existe!" : "Erro ao criar"); return; }
    queryClient.invalidateQueries({ queryKey: [table] });
    setter("");
    toast.success("Criado!");
  };

  const deleteItem = async (table: "categories" | "styles" | "brands", id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from(table).delete().eq("id", id as any);
    queryClient.invalidateQueries({ queryKey: [table] });
    toast.success("Excluído!");
  };

  const Section = ({ title, items, table, value, setValue }: any) => (
    <div className="border border-border bg-card/50 p-4 sm:p-5 rounded-sm space-y-4">
      <h3 className="font-display text-lg text-foreground">{title} <span className="text-muted-foreground text-sm">({items?.length || 0})</span></h3>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          placeholder={`Nova ${title.toLowerCase().slice(0, -1)}...`}
          onKeyDown={(e: any) => e.key === "Enter" && addItem(table, value, setValue)}
          className="flex-1 bg-secondary/50 border border-border py-2 px-3 font-body text-sm text-foreground rounded-sm focus:outline-none focus:border-primary"
        />
        <button onClick={() => addItem(table, value, setValue)} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 rounded-sm flex items-center gap-1">
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {items?.length === 0 ? (
        <p className="font-body text-xs text-muted-foreground py-2">Nenhum item.</p>
      ) : (
        <div className="divide-y divide-border">
          {items?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between py-2.5 group">
              <span className="font-body text-sm text-foreground">{item.name}</span>
              <button onClick={() => deleteItem(table, item.id)} className="text-destructive/60 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-1">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-5">
      <h2 className="font-display text-xl sm:text-2xl text-foreground">Categorias, Estilos e Marcas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Categorias" items={categories} table="categories" value={newCat} setValue={setNewCat} />
        <Section title="Estilos" items={styles} table="styles" value={newStyle} setValue={setNewStyle} />
        <Section title="Marcas" items={brands} table="brands" value={newBrand} setValue={setNewBrand} />
      </div>
    </div>
  );
}
