import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Package, Settings, Tag, ShoppingCart, LogOut, ExternalLink, LayoutDashboard, Truck, Star, AlertCircle } from "lucide-react";
import ProductsTab from "@/components/admin/ProductsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";
import OrdersTab from "@/components/admin/OrdersTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ShippingTab from "@/components/admin/ShippingTab";
import TestimonialsTab from "@/components/admin/TestimonialsTab";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("products");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/painel");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/painel");
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <LayoutDashboard className="h-8 w-8 text-primary mx-auto animate-pulse" />
        <p className="font-body text-sm text-muted-foreground">Carregando painel...</p>
      </div>
    </div>
  );

  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-md space-y-6">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
          <h1 className="font-display text-3xl text-foreground">Acesso Negado</h1>
          <p className="font-body text-muted-foreground">
            Você está logado, mas não possui permissões de administrador para acessar este painel.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/")}
              className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors"
            >
              Voltar para a Loja
            </button>
            <button
              onClick={handleLogout}
              className="font-body text-xs letter-wide uppercase border border-border text-muted-foreground px-8 py-3 hover:text-foreground transition-colors"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "products", label: "Produtos", icon: Package },
    { id: "categories", label: "Categorias", icon: Tag },
    { id: "orders", label: "Pedidos", icon: ShoppingCart },
    { id: "shipping", label: "Frete", icon: Truck },
    { id: "testimonials", label: "Depoimentos", icon: Star },
    { id: "settings", label: "Config", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-5 w-5 text-primary hidden sm:block" />
          <h1 className="font-display text-base sm:text-lg text-foreground">Painel Admin</h1>
        </div>
        <div className="flex gap-3 items-center">
          <a
            href="/"
            target="_blank"
            className="font-body text-[10px] sm:text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ver Site</span>
          </a>
          <button
            onClick={handleLogout}
            className="font-body text-[10px] sm:text-xs letter-wide uppercase text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-52 border-r border-border flex-col bg-card/50 p-3 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2.5 font-body text-sm transition-all duration-200 flex items-center gap-2.5 rounded-sm ${
                activeTab === tab.id
                  ? "bg-primary/15 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <tab.icon className="h-4 w-4 flex-shrink-0" />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-20 md:pb-6 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {activeTab === "products" && <ProductsTab />}
            {activeTab === "categories" && <CategoriesTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "shipping" && <ShippingTab />}
            {activeTab === "testimonials" && <TestimonialsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="font-body text-[9px] letter-wide uppercase">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminDashboard;