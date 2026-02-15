import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSiteData, saveSiteData, getDefaultProducts, type SiteData, type Product } from "@/lib/siteData";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SiteData>(getSiteData());
  const [activeTab, setActiveTab] = useState<"hero" | "products" | "about" | "contact">("hero");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("admin_auth") !== "true") {
      navigate("/painel");
    }
  }, [navigate]);

  const save = (newData: SiteData) => {
    setData(newData);
    saveSiteData(newData);
    toast.success("Alterações salvas!");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    navigate("/painel");
  };

  const updateProduct = (product: Product) => {
    const newProducts = data.products.map((p) => (p.id === product.id ? product : p));
    save({ ...data, products: newProducts });
    setEditingProduct(null);
  };

  const deleteProduct = (id: string) => {
    save({ ...data, products: data.products.filter((p) => p.id !== id) });
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      image: "",
      title: "Novo Produto",
      category: "Roupas",
      price: "R$ 0",
    };
    save({ ...data, products: [...data.products, newProduct] });
    setEditingProduct(newProduct);
  };

  const resetProducts = () => {
    save({ ...data, products: getDefaultProducts() });
    toast.success("Catálogo resetado!");
  };

  const tabs = [
    { id: "hero" as const, label: "Hero" },
    { id: "products" as const, label: "Catálogo" },
    { id: "about" as const, label: "Sobre" },
    { id: "contact" as const, label: "Contato" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl text-foreground">Painel — Martins Class</h1>
        <div className="flex gap-4">
          <a href="/" target="_blank" className="font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors">
            Ver Site
          </a>
          <button onClick={handleLogout} className="font-body text-xs letter-wide uppercase text-destructive hover:text-destructive/80 transition-colors">
            Sair
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 border-r border-border min-h-[calc(100vh-65px)] p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 font-body text-sm transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-8 max-w-4xl">
          {activeTab === "hero" && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-foreground mb-6">Seção Hero</h2>
              <Field label="Subtítulo" value={data.heroSubtitle} onChange={(v) => setData({ ...data, heroSubtitle: v })} />
              <Field label="Título Principal" value={data.heroTitle} onChange={(v) => setData({ ...data, heroTitle: v })} />
              <Field label="Descrição" value={data.heroDescription} onChange={(v) => setData({ ...data, heroDescription: v })} multiline />
              <button onClick={() => save(data)} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors">
                Salvar
              </button>
            </div>
          )}

          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl text-foreground">Catálogo de Produtos</h2>
                <div className="flex gap-3">
                  <button onClick={resetProducts} className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-4 py-2 hover:text-foreground transition-colors">
                    Resetar
                  </button>
                  <button onClick={addProduct} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors">
                    + Novo
                  </button>
                </div>
              </div>

              {editingProduct && (
                <div className="border border-primary/30 bg-secondary p-6 space-y-4 mb-6">
                  <h3 className="font-display text-lg text-foreground">Editando: {editingProduct.title}</h3>
                  <Field label="Nome" value={editingProduct.title} onChange={(v) => setEditingProduct({ ...editingProduct, title: v })} />
                  <Field label="Categoria" value={editingProduct.category} onChange={(v) => setEditingProduct({ ...editingProduct, category: v })} />
                  <Field label="Preço" value={editingProduct.price} onChange={(v) => setEditingProduct({ ...editingProduct, price: v })} />
                  <Field label="URL da Imagem (cole o link)" value={editingProduct.image} onChange={(v) => setEditingProduct({ ...editingProduct, image: v })} />
                  <div className="flex gap-3">
                    <button onClick={() => updateProduct(editingProduct)} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-6 py-2 hover:bg-primary/90 transition-colors">
                      Salvar Produto
                    </button>
                    <button onClick={() => setEditingProduct(null)} className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-6 py-2 hover:text-foreground transition-colors">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.products.map((product) => (
                  <div key={product.id} className="border border-border p-4 flex gap-4 items-center">
                    <div className="w-16 h-20 bg-secondary overflow-hidden flex-shrink-0">
                      {product.image && <img src={product.image} alt={product.title} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-foreground truncate">{product.title}</p>
                      <p className="font-body text-xs text-muted-foreground">{product.category} — {product.price}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setEditingProduct(product)} className="font-body text-xs text-primary hover:text-primary/80 transition-colors">
                        Editar
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="font-body text-xs text-destructive hover:text-destructive/80 transition-colors">
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-foreground mb-6">Seção Sobre</h2>
              <Field label="Título" value={data.aboutTitle} onChange={(v) => setData({ ...data, aboutTitle: v })} />
              <Field label="Parágrafo 1" value={data.aboutText1} onChange={(v) => setData({ ...data, aboutText1: v })} multiline />
              <Field label="Parágrafo 2" value={data.aboutText2} onChange={(v) => setData({ ...data, aboutText2: v })} multiline />
              <button onClick={() => save(data)} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors">
                Salvar
              </button>
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-foreground mb-6">Contato & Redes</h2>
              <Field label="Email" value={data.contactEmail} onChange={(v) => setData({ ...data, contactEmail: v })} />
              <Field label="Telefone" value={data.contactPhone} onChange={(v) => setData({ ...data, contactPhone: v })} />
              <Field label="Endereço" value={data.contactAddress} onChange={(v) => setData({ ...data, contactAddress: v })} />
              <Field label="Link do WhatsApp" value={data.whatsappLink} onChange={(v) => setData({ ...data, whatsappLink: v })} />
              <Field label="Link do Instagram" value={data.instagramLink} onChange={(v) => setData({ ...data, instagramLink: v })} />
              <button onClick={() => save(data)} className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors">
                Salvar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
  <div>
    <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-2 block">
      {label}
    </label>
    {multiline ? (
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300 resize-none"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-secondary border border-border py-3 px-4 font-body text-foreground focus:outline-none focus:border-primary transition-colors duration-300"
      />
    )}
  </div>
);

export default AdminDashboard;
