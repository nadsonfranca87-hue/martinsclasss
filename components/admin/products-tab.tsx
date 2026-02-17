"use client";

import { useState, useRef } from "react";
import { useAllProducts, useCategories, useStyles, useBrands } from "@/hooks/use-products";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Trash2, Plus, Eye, EyeOff, Search, X } from "lucide-react";
import AdminField from "./admin-field";

const supabase = createClient();

export default function ProductsTab() {
  const { data: products, isLoading } = useAllProducts();
  const { data: categories } = useCategories();
  const { data: styles } = useStyles();
  const { data: brands } = useBrands();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const filtered = products?.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.key.toLowerCase().includes(search.toLowerCase())
  );

  const generateKey = (title: string, styleName?: string) => {
    const t = title.toUpperCase().replace(/\s+/g, "-").slice(0, 15);
    const s = styleName ? styleName.toUpperCase().slice(0, 5) : "GEN";
    const num = String(Math.floor(Math.random() * 999)).padStart(3, "0");
    return `${t}-${s}-${num}`;
  };

  const handleCreate = async () => {
    const key = generateKey("NOVO", "GEN");
    const { data, error } = await supabase.from("products").insert({
      key, title: "Novo Produto", price: 0,
      category_id: categories?.[0]?.id || null,
      style_id: styles?.[0]?.id || null,
      brand_id: brands?.[0]?.id || null,
    }).select().single();
    if (error) { toast.error("Erro ao criar produto"); return; }
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    setEditing(data);
    setCreating(true);
    toast.success("Produto criado!");
  };

  const handleSave = async (product: any) => {
    const { error } = await supabase.from("products").update({
      title: product.title, key: product.key, description: product.description,
      price: product.price, discount_percent: product.discount_percent || 0,
      category_id: product.category_id, style_id: product.style_id,
      brand_id: product.brand_id, status: product.status, is_new: product.is_new,
      is_promo: product.is_promo, sort_order: product.sort_order, video_url: product.video_url,
    }).eq("id", product.id);
    if (error) { toast.error("Erro ao salvar"); return; }
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    setEditing(null); setCreating(false);
    toast.success("Produto salvo!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    await supabase.from("products").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    toast.success("Produto excluido!");
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await supabase.from("products").update({ status: newStatus }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    toast.success(newStatus === "active" ? "Produto ativado" : "Produto ocultado");
  };

  const handleImageUpload = async (productId: string, files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${productId}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("product-images").upload(path, file);
      if (uploadErr) { toast.error("Erro no upload"); continue; }
      const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(path);
      await supabase.from("product_images").insert({ product_id: productId, image_url: publicUrl });
    }
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    setUploading(false);
    toast.success("Imagens enviadas!");
  };

  const handleDeleteImage = async (imageId: string) => {
    await supabase.from("product_images").delete().eq("id", imageId);
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    toast.success("Imagem removida!");
  };

  const selectClass = "w-full bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))] py-2.5 px-3 font-sans text-sm text-[hsl(var(--foreground))] rounded-sm focus:outline-none focus:border-[hsl(var(--primary))]";

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-serif text-xl sm:text-2xl text-[hsl(var(--foreground))]">
          Produtos <span className="text-[hsl(var(--muted-foreground))] text-base">({filtered?.length || 0})</span>
        </h2>
        <button onClick={handleCreate} className="font-sans text-xs tracking-widest uppercase bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2.5 hover:bg-[hsl(var(--primary))]/90 transition-colors flex items-center gap-1.5 rounded-sm self-start sm:self-auto">
          <Plus className="h-3.5 w-3.5" /> Novo Produto
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--muted-foreground))]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou KEY..."
          className="w-full bg-[hsl(var(--secondary))]/50 border border-[hsl(var(--border))] py-2.5 pl-9 pr-9 font-sans text-sm text-[hsl(var(--foreground))] rounded-sm focus:outline-none focus:border-[hsl(var(--primary))]"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {editing && (
        <div className="border border-[hsl(var(--primary))]/20 bg-[hsl(var(--card))] p-4 sm:p-6 space-y-4 rounded-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-[hsl(var(--foreground))]">{creating ? "Novo Produto" : `Editando: ${editing.title}`}</h3>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AdminField label="Nome" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <AdminField label="KEY (codigo unico)" value={editing.key} onChange={(v) => setEditing({ ...editing, key: v })} />
            <AdminField label="Preco" value={String(editing.price)} onChange={(v) => setEditing({ ...editing, price: parseFloat(v) || 0 })} type="number" />
            <AdminField label="Desconto (%)" value={String(editing.discount_percent || 0)} onChange={(v) => setEditing({ ...editing, discount_percent: parseInt(v) || 0 })} type="number" />
            {editing.discount_percent > 0 && (
              <div className="space-y-1.5">
                <label className="font-sans text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block">Preco Final</label>
                <div className="flex items-center gap-2 py-2.5 px-3 bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 rounded-sm">
                  <span className="font-sans text-sm text-[hsl(var(--muted-foreground))] line-through">R$ {Number(editing.price).toFixed(2)}</span>
                  <span className="font-sans text-sm text-[hsl(var(--primary))] font-medium">R$ {(editing.price * (1 - editing.discount_percent / 100)).toFixed(2)}</span>
                  <span className="font-sans text-[10px] bg-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive))] px-1.5 py-0.5 rounded-sm">-{editing.discount_percent}%</span>
                </div>
              </div>
            )}
            <AdminField label="Ordem" value={String(editing.sort_order || 0)} onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })} type="number" />
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block">Categoria</label>
              <select value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className={selectClass}>
                <option value="">Nenhuma</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block">Estilo</label>
              <select value={editing.style_id || ""} onChange={(e) => setEditing({ ...editing, style_id: e.target.value || null })} className={selectClass}>
                <option value="">Nenhum</option>
                {styles?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block">Marca</label>
              <select value={editing.brand_id || ""} onChange={(e) => setEditing({ ...editing, brand_id: e.target.value || null })} className={selectClass}>
                <option value="">Nenhuma</option>
                {brands?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <AdminField label="URL do Video" value={editing.video_url || ""} onChange={(v) => setEditing({ ...editing, video_url: v || null })} placeholder="https://..." />
          </div>
          <AdminField label="Descricao" value={editing.description || ""} onChange={(v) => setEditing({ ...editing, description: v })} multiline />

          <div className="flex gap-5 items-center">
            <label className="flex items-center gap-2 font-sans text-sm text-[hsl(var(--foreground))] cursor-pointer select-none">
              <input type="checkbox" checked={editing.is_new} onChange={(e) => setEditing({ ...editing, is_new: e.target.checked })} className="accent-[hsl(var(--primary))]" /> Novidade
            </label>
            <label className="flex items-center gap-2 font-sans text-sm text-[hsl(var(--foreground))] cursor-pointer select-none">
              <input type="checkbox" checked={editing.is_promo} onChange={(e) => setEditing({ ...editing, is_promo: e.target.checked })} className="accent-[hsl(var(--primary))]" /> Promocao
            </label>
          </div>

          <div className="space-y-3">
            <label className="font-sans text-[10px] tracking-widest uppercase text-[hsl(var(--muted-foreground))] block">Imagens</label>
            <div className="flex gap-2 flex-wrap">
              {(editing as any).images?.map((img: any) => (
                <div key={img.id} className="relative w-16 h-20 sm:w-20 sm:h-24 bg-[hsl(var(--secondary))] rounded-sm overflow-hidden group">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => handleDeleteImage(img.id)} className="absolute inset-0 bg-[hsl(var(--destructive))]/60 text-[hsl(var(--destructive-foreground))] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleImageUpload(editing.id, e.target.files)} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="font-sans text-xs tracking-widest uppercase border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] px-4 py-2 hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--primary))] transition-all flex items-center gap-1.5 rounded-sm disabled:opacity-50">
              <Upload className="h-3.5 w-3.5" /> {uploading ? "Enviando..." : "Adicionar Imagens"}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleSave(editing)} className="font-sans text-xs tracking-widest uppercase bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-6 py-2.5 hover:bg-[hsl(var(--primary))]/90 transition-colors rounded-sm">Salvar</button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="font-sans text-xs tracking-widest uppercase border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] px-6 py-2.5 hover:text-[hsl(var(--foreground))] transition-colors rounded-sm">Cancelar</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="border border-[hsl(var(--border))] p-4 flex gap-3 animate-pulse">
              <div className="w-14 h-18 bg-[hsl(var(--secondary))] rounded-sm" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[hsl(var(--secondary))] rounded w-3/4" />
                <div className="h-3 bg-[hsl(var(--secondary))] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered?.map((product) => (
            <div key={product.id} className={`border border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-3 sm:p-4 flex gap-3 items-center transition-all hover:border-[hsl(var(--primary))]/30 rounded-sm ${product.status === "inactive" ? "opacity-50" : ""}`}>
              <div className="w-12 h-16 sm:w-14 sm:h-18 bg-[hsl(var(--secondary))] overflow-hidden flex-shrink-0 rounded-sm">
                {product.images?.[0] && <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm text-[hsl(var(--foreground))] truncate">{product.title}</p>
                <p className="font-sans text-[10px] tracking-widest text-[hsl(var(--muted-foreground))] mt-0.5">KEY: {product.key}</p>
                <div className="flex items-center gap-2 mt-1">
                  {product.discount_percent ? (
                    <>
                      <span className="font-sans text-xs text-[hsl(var(--muted-foreground))] line-through">R$ {Number(product.price).toFixed(2)}</span>
                      <span className="font-sans text-xs text-[hsl(var(--primary))] font-medium">R$ {(Number(product.price) * (1 - product.discount_percent / 100)).toFixed(2)}</span>
                      <span className="font-sans text-[9px] bg-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive))] px-1.5 py-0.5 rounded-sm">-{product.discount_percent}%</span>
                    </>
                  ) : (
                    <span className="font-sans text-xs text-[hsl(var(--primary))] font-medium">R$ {Number(product.price).toFixed(2)}</span>
                  )}
                  {product.category?.name && <span className="font-sans text-[10px] text-[hsl(var(--muted-foreground))]">{'\u00B7'} {product.category.name}</span>}
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => handleToggleStatus(product.id, product.status)} className="p-1.5 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] rounded-sm hover:bg-[hsl(var(--secondary))] transition-colors" title={product.status === "active" ? "Ocultar" : "Ativar"}>
                  {product.status === "active" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing({ ...product, category_id: product.category?.id, style_id: product.style?.id, brand_id: product.brand?.id })} className="font-sans text-[10px] sm:text-xs text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/80 px-2 py-1 rounded-sm hover:bg-[hsl(var(--primary))]/10 transition-colors">Editar</button>
                <button onClick={() => handleDelete(product.id)} className="font-sans text-[10px] sm:text-xs text-[hsl(var(--destructive))] hover:text-[hsl(var(--destructive))]/80 px-2 py-1 rounded-sm hover:bg-[hsl(var(--destructive))]/10 transition-colors">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
