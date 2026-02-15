import { useState } from "react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag } from "lucide-react";
import { getSiteData } from "@/lib/siteData";

const CollectionSection = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const { addItem } = useCart();
  const fallbackData = getSiteData();

  const categoryNames = ["Todos", ...(categories?.map((c) => c.name) || [])];

  // Use DB products if available, otherwise fallback to local data
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
    <section id="colecao" className="py-32 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-4">COLEÇÃO</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">Peças Selecionadas</h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Curadoria de peças que combinam qualidade, conforto e estilo atemporal
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-16">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-body text-xs letter-wide uppercase transition-colors duration-300 pb-2 border-b-2 ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary aspect-[3/4] mb-4" />
                <div className="h-3 bg-secondary w-1/3 mb-2" />
                <div className="h-4 bg-secondary w-2/3 mb-2" />
                <div className="h-3 bg-secondary w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product: any) => {
              const image = hasDbProducts
                ? product.images?.[0]?.image_url
                : product.image;
              const categoryName = hasDbProducts ? product.category?.name : product.category;
              const priceDisplay = hasDbProducts ? `R$ ${Number(product.price).toFixed(2)}` : product.price;

              return (
                <div key={product.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-4 bg-secondary aspect-[3/4]">
                    {image && (
                      <img
                        src={image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="absolute bottom-4 right-4 bg-primary text-primary-foreground p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/90"
                    >
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                    {hasDbProducts && product.is_new && (
                      <span className="absolute top-4 left-4 bg-primary text-primary-foreground font-body text-[10px] letter-wide uppercase px-3 py-1">
                        Novidade
                      </span>
                    )}
                    {hasDbProducts && product.is_promo && (
                      <span className="absolute top-4 left-4 bg-destructive text-destructive-foreground font-body text-[10px] letter-wide uppercase px-3 py-1">
                        Promoção
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="font-body text-[10px] letter-wide uppercase text-muted-foreground">{categoryName}</p>
                    <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="font-body text-sm text-primary">{priceDisplay}</p>
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
