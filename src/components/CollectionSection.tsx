import { useState } from "react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Plus } from "lucide-react";
import { getSiteData } from "@/lib/siteData";

const CollectionSection = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { addItem } = useCart();
  const fallbackData = getSiteData();

  const categoryNames = ["Todos", ...(categories?.map((c) => c.name) || [])];

  const hasDbProducts = products && products.length > 0;

  const filtered = hasDbProducts
    ? activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category?.name === activeCategory)
    : activeCategory === "Todos"
      ? fallbackData.products
      : fallbackData.products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: any) => {
    if (hasDbProducts) {
      addItem({
        id: product.id,
        productKey: product.key,
        title: product.title,
        price: product.price,
        image: product.images?.[0]?.image_url || "",
      });
    } else {
      addItem({
        id: product.id,
        productKey: `PROD-${product.id.toString().padStart(3, "0")}`,
        title: product.title,
        price: parseFloat(product.price.replace(/[^\d,]/g, "").replace(",", ".")),
        image: product.image,
      });
    }
  };

  return (
    <section id="colecao" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-3 sm:mb-4">COLEÇÃO</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 sm:mb-6">Peças Selecionadas</h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Curadoria de peças que combinam qualidade, conforto e estilo atemporal
          </p>
        </div>

        {/* Scrollable categories on mobile */}
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-16 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center scrollbar-hide">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-xs letter-wide uppercase transition-colors duration-300 pb-2 border-b-2 whitespace-nowrap flex-shrink-0 ${
                activeCategory === cat
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary aspect-[3/4] mb-3 sm:mb-4" />
                <div className="h-3 bg-secondary w-1/3 mb-2" />
                <div className="h-4 bg-secondary w-2/3 mb-2" />
                <div className="h-3 bg-secondary w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((product: any) => {
              const image = hasDbProducts
                ? product.images?.[0]?.image_url
                : product.image;
              const categoryName = hasDbProducts ? product.category?.name : product.category;
              const priceDisplay = hasDbProducts ? `R$ ${Number(product.price).toFixed(2)}` : product.price;

              return (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-2 sm:mb-4 bg-secondary aspect-[3/4]">
                    {image && (
                      <img
                        src={image}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
                    
                    {/* Desktop: hover button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-primary text-primary-foreground p-2 sm:p-3 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4 sm:hidden" />
                      <ShoppingBag className="h-4 w-4 hidden sm:block" />
                    </button>

                    {hasDbProducts && product.is_new && (
                      <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-primary text-primary-foreground font-body text-[8px] sm:text-[10px] letter-wide uppercase px-2 py-0.5 sm:px-3 sm:py-1">
                        Novidade
                      </span>
                    )}
                    {hasDbProducts && product.is_promo && (
                      <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-destructive text-destructive-foreground font-body text-[8px] sm:text-[10px] letter-wide uppercase px-2 py-0.5 sm:px-3 sm:py-1">
                        Promoção
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <p className="font-body text-[9px] sm:text-[10px] letter-wide uppercase text-muted-foreground">{categoryName}</p>
                    <h3 className="font-display text-sm sm:text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-primary">{priceDisplay}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;
