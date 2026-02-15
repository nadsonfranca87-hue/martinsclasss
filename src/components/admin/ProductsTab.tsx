import { useState, useRef } from "react";
import { useAllProducts, useCategories, useStyles, useBrands } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import AdminField from "./AdminField";

export default function ProductsTab() {
  const { data: products, isLoading } = useAllProducts();
  const { data: categories } = useCategories();
  const { data: styles } = useStyles();
  const { data: brands } = useBrands();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const generateKey = (title: string, styleName?: string) => {
    const t = title.toUpperCase().replace(/\s+/g, "-").slice(0, 15);
    const s = styleName ? styleName.toUpperCase().slice(0, 5) : "GEN";
    const num = String(Math.floor(Math.random() * 999)).padStart(3, "0");
    return `${t}-${s}-${num}`;
  };

  const handleCreate = async () => {
    const key = generateKey("NOVO", "GEN");
    const { data, error } = await supabase.from("products").insert({
      key,
      title: "Novo Produto",
      price: 0,
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
      title: product.title,
      key: product.key,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      style_id: product.style_id,
      brand_id: product.brand_id,
      status: product.status,
      is_new: product.is_new,
      is_promo: product.is_promo,
      sort_order: product.sort_order,
      video_url: product.video_url,
    }).eq("id", product.id);
    if (error) { toast.error("Erro ao salvar"); return; }
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    setEditing(null);
    setCreating(false);
    toast.success("Produto salvo!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    await supabase.from("products").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["all-products"] });
    toast.success("Produto excluído!");
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Produtos ({products?.length || 0})</h2>
        <button onClick={handleCreate} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors flex items-center gap-1">
          <Plus className="h-3 w-3" /> Novo Produto
        </button>
      </div>

      {editing && (
        <div className="border border-primary/30 bg-card p-6 space-y-4">
          <h3 className="font-display text-lg text-foreground">{creating ? "Novo Produto" : `Editando: ${editing.title}`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminField label="Nome" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <AdminField label="KEY (código único)" value={editing.key} onChange={(v) => setEditing({ ...editing, key: v })} />
            <AdminField label="Preço" value={String(editing.price)} onChange={(v) => setEditing({ ...editing, price: parseFloat(v) || 0 })} type="number" />
            <AdminField label="Ordem" value={String(editing.sort_order || 0)} onChange={(v) => setEditing({ ...editing, sort_order: parseInt(v) || 0 })} type="number" />
            <div>
              <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Categoria</label>
              <select value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground">
                <option value="">Nenhuma</option>
                {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Estilo</label>
              <select value={editing.style_id || ""} onChange={(e) => setEditing({ ...editing, style_id: e.target.value || null })} className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground">
                <option value="">Nenhum</option>
                {styles?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Marca</label>
              <select value={editing.brand_id || ""} onChange={(e) => setEditing({ ...editing, brand_id: e.target.value || null })} className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground">
                <option value="">Nenhuma</option>
                {brands?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <AdminField label="URL do Vídeo (opcional)" value={editing.video_url || ""} onChange={(v) => setEditing({ ...editing, video_url: v || null })} />
          </div>
          <AdminField label="Descrição" value={editing.description || ""} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={editing.is_new} onChange={(e) => setEditing({ ...editing, is_new: e.target.checked })} /> Novidade
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={editing.is_promo} onChange={(e) => setEditing({ ...editing, is_promo: e.target.checked })} /> Promoção
            </label>
          </div>

          <div>
            <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">Imagens</label>
            <div className="flex gap-3 flex-wrap mb-3">
              {(editing as any).images?.map((img: any) => (
                <div key={img.id} className="relative w-20 h-24 bg-secondary">
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => handleDeleteImage(img.id)} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && handleImageUpload(editing.id, e.target.files)} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-4 py-2 hover:text-foreground transition-colors flex items-center gap-1 disabled:opacity-50">
              <Upload className="h-3 w-3" /> {uploading ? "Enviando..." : "Adicionar Imagens"}
            </button>
          </div>

          <div className="flex gap-3">
            <button onClick={() => handleSave(editing)} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-6 py-2 hover:bg-primary/90 transition-colors">Salvar</button>
            <button onClick={() => { setEditing(null); setCreating(false); }} className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-6 py-2 hover:text-foreground transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="font-body text-muted-foreground">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products?.map((product) => (
            <div key={product.id} className={`border border-border p-4 flex gap-4 items-center ${product.status === "inactive" ? "opacity-50" : ""}`}>
              <div className="w-16 h-20 bg-secondary overflow-hidden flex-shrink-0">
                {product.images?.[0] && <img src={product.images[0].image_url} alt={product.title} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-foreground truncate">{product.title}</p>
                <p className="font-body text-[10px] letter-wide text-muted-foreground">KEY: {product.key}</p>
                <p className="font-body text-xs text-muted-foreground">{product.category?.name} — R$ {Number(product.price).toFixed(2)}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => handleToggleStatus(product.id, product.status)} className="p-1 text-muted-foreground hover:text-foreground" title={product.status === "active" ? "Ocultar" : "Ativar"}>
                  {product.status === "active" ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button onClick={() => setEditing({ ...product, category_id: product.category?.id, style_id: product.style?.id, brand_id: product.brand?.id })} className="font-body text-xs text-primary hover:text-primary/80">Editar</button>
                <button onClick={() => handleDelete(product.id)} className="font-body text-xs text-destructive hover:text-destructive/80">Excluir</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
