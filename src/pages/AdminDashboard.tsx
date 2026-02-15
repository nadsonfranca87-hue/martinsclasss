import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Package, Settings, Tag, ShoppingCart, LogOut, ExternalLink } from "lucide-react";
import ProductsTab from "@/components/admin/ProductsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import OrdersTab from "@/components/admin/OrdersTab";
import SettingsTab from "@/components/admin/SettingsTab";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("products");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/painel");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/painel");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="font-body text-muted-foreground">Carregando...</p></div>;

  const tabs = [
    { id: "products", label: "Produtos", icon: Package },
    { id: "categories", label: "Categorias", icon: Tag },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl text-foreground">Painel — Martins Class</h1>
        <div className="flex gap-4 items-center">
          <a href="/" target="_blank" className="font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <ExternalLink className="h-3 w-3" /> Ver Site
          </a>
          <button onClick={handleLogout} className="font-body text-xs letter-wide uppercase text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1">
            <LogOut className="h-3 w-3" /> Sair
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="w-56 border-r border-border min-h-[calc(100vh-65px)] p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 font-body text-sm transition-colors flex items-center gap-2 ${
                activeTab === tab.id ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 p-8 max-w-6xl overflow-auto">
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
