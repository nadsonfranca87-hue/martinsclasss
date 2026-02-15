import { useState } from "react";
import { getSiteData } from "@/lib/siteData";

const categories = ["Todos", "Roupas", "Acessórios", "Novidades"];

const CollectionSection = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const data = getSiteData();

  const filtered = activeCategory === "Todos"
    ? data.products
    : data.products.filter((p) => p.category === activeCategory);

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
          {categories.map((cat) => (
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-secondary aspect-[3/4]">
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
              </div>
              <div className="space-y-1">
                <p className="font-body text-[10px] letter-wide uppercase text-muted-foreground">{product.category}</p>
                <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors duration-300">{product.title}</h3>
                <p className="font-body text-sm text-primary">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
