"use client";

import { useState } from "react";
import { useCategories, useStyles, useBrands } from "@/hooks/use-products";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const supabase = createClient();

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
    if (error) { toast.error(error.message.includes("duplicate") ? "Ja existe!" : "Erro ao criar"); return; }
    queryClient.invalidateQueries({ queryKey: [table] });
    setter("");
    toast.success("Criado!");
  };

  const deleteItem = async (table: "categories" | "styles" | "brands", id: string) => {
    if (!confirm("Excluir?")) return;
    await supabase.from(table).delete().eq("id", id as any);
    queryClient.invalidateQueries({ queryKey: [table] });
    toast.success("Excluido!");
  };

  const Section = ({ title, items, table, value, setValue }: any) => (
    <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-4 sm:p-5 rounded-sm space-y-4">
      <h3 className="font-serif text-lg text-[hsl(var(--foreground))]">{title} <span className="text-[hsl(var(--muted-foreground))] text-sm">({items?.length || 0})</span></h3>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          placeholder={`Nova ${title.toLowerCase().slice(0, -1)}...`}
          onKeyDown={(e: any) => e.key === "Enter" && addItem(table, value, setValue)}
          className="flex-1 bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))] py-2 px-3 font-sans text-sm text-[hsl(var(--foreground))] rounded-sm focus:outline-none focus:border-[hsl(var(--primary))]"
        />
        <button onClick={() => addItem(table, value, setValue)} className="font-sans text-xs tracking-widest uppercase bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 hover:bg-[hsl(var(--primary))]/90 rounded-sm flex items-center gap-1">
          <Plus className="h-3 w-3" /> Adicionar
        </button>
      </div>
      {items?.length === 0 ? (
        <p className="font-sans text-xs text-[hsl(var(--muted-foreground))] py-2">Nenhum item.</p>
      ) : (
        <div className="divide-y divide-[hsl(var(--border))]">
          {items?.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between py-2.5 group">
              <span className="font-sans text-sm text-[hsl(var(--foreground))]">{item.name}</span>
              <button onClick={() => deleteItem(table, item.id)} className="text-[hsl(var(--destructive))]/60 hover:text-[hsl(var(--destructive))] transition-colors opacity-0 group-hover:opacity-100 p-1">
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
      <h2 className="font-serif text-xl sm:text-2xl text-[hsl(var(--foreground))]">Categorias, Estilos e Marcas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Categorias" items={categories} table="categories" value={newCat} setValue={setNewCat} />
        <Section title="Estilos" items={styles} table="styles" value={newStyle} setValue={setNewStyle} />
        <Section title="Marcas" items={brands} table="brands" value={newBrand} setValue={setNewBrand} />
      </div>
    </div>
  );
}
