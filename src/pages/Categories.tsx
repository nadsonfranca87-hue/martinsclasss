import { useProducts, useCategories } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { ShoppingBag, Plus } from "lucide-react";
import testimonialsBg from "@/assets/testimonials-bg.jpg";

const Categories = () => {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const groupedByCategory = (categories || []).map((cat) => ({
    ...cat,
    products: (products || []).filter((p) => p.category?.id === cat.id),
  })).filter((cat) => cat.products.length > 0);

  const uncategorized = (products || []).filter((p) => !p.category);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    const discount = product.discount_percent || 0;
    const finalPrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
    addItem({
      id: product.id,
      productKey: product.key,
      title: product.title,
      price: finalPrice,
      image: product.images?.[0]?.image_url || "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src={testimonialsBg}
          alt="Categorias"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="relative z-10 text-center px-4">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-3">EXPLORE</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-foreground mb-4">
            Categorias
          </h1>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Encontre peças organizadas por categoria para facilitar sua escolha
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {isLoading ? (
          <div className="space-y-16">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-secondary w-48 mb-8" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <div className="bg-secondary aspect-[3/4] mb-3" />
                      <div className="h-4 bg-secondary w-2/3 mb-2" />
                      <div className="h-3 bg-secondary w-1/3" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : groupedByCategory.length === 0 && uncategorized.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-16 sm:space-y-24">
            {groupedByCategory.map((cat) => (
              <section key={cat.id}>
                <div className="flex items-center gap-4 mb-8 sm:mb-12">
                  <h2 className="font-display text-2xl sm:text-3xl text-foreground">{cat.name}</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="font-body text-xs text-muted-foreground">{cat.products.length} {cat.products.length === 1 ? 'peça' : 'peças'}</span>
                </div>
                <ProductGrid products={cat.products} onAddToCart={handleAddToCart} onProductClick={(p) => navigate(`/produto/${p.id}`)} />
              </section>
            ))}

            {uncategorized.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8 sm:mb-12">
                  <h2 className="font-display text-2xl sm:text-3xl text-foreground">Outras Peças</h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="font-body text-xs text-muted-foreground">{uncategorized.length} peças</span>
                </div>
                <ProductGrid products={uncategorized} onAddToCart={handleAddToCart} onProductClick={(p) => navigate(`/produto/${p.id}`)} />
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
};

const ProductGrid = ({
  products,
  onAddToCart,
  onProductClick,
}: {
  products: any[];
  onAddToCart: (e: React.MouseEvent, product: any) => void;
  onProductClick: (product: any) => void;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
    {products.map((product) => {
      const image = product.images?.[0]?.image_url;
      const discount = product.discount_percent || 0;
      const originalPrice = Number(product.price);
      const finalPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

      return (
        <div key={product.id} className="group cursor-pointer" onClick={() => onProductClick(product)}>
          <div className="relative overflow-hidden mb-2 sm:mb-4 bg-secondary aspect-[3/4]">
            {image && (
              <img src={image} alt={product.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            )}
            <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
            <button
              onClick={(e) => onAddToCart(e, product)}
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-primary text-primary-foreground p-2 sm:p-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 sm:hidden" />
              <ShoppingBag className="h-4 w-4 hidden sm:block" />
            </button>
            {product.is_new && (
              <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary text-primary-foreground font-body text-[8px] sm:text-[10px] letter-wide uppercase px-2 py-0.5 sm:px-3 sm:py-1">Novidade</span>
            )}
            {discount > 0 && (
              <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-destructive text-destructive-foreground font-body text-[8px] sm:text-[10px] letter-wide uppercase px-2 py-0.5 sm:px-3 sm:py-1">-{discount}%</span>
            )}
          </div>
          <div className="space-y-0.5 sm:space-y-1">
            <h3 className="font-display text-sm sm:text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">{product.title}</h3>
            {discount > 0 ? (
              <div className="flex items-center gap-2">
                <span className="font-body text-[10px] sm:text-xs text-muted-foreground line-through">R$ {originalPrice.toFixed(2)}</span>
                <span className="font-body text-xs sm:text-sm text-primary">R$ {finalPrice.toFixed(2)}</span>
              </div>
            ) : (
              <p className="font-body text-xs sm:text-sm text-primary">R$ {originalPrice.toFixed(2)}</p>
            )}
          </div>
        </div>
      );
    })}
  </div>
);

export default Categories;
