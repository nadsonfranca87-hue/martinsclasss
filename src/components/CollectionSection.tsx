import { useState } from "react";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";
import collection4 from "@/assets/collection-4.jpg";
import collection5 from "@/assets/collection-5.jpg";
import collection6 from "@/assets/collection-6.jpg";

const categories = ["Todos", "Roupas", "Acessórios", "Novidades"];

const products = [
  { image: collection1, title: "Camisa Linho Natural", category: "Roupas", price: "R$ 289" },
  { image: collection2, title: "Casaco Oversized Noir", category: "Roupas", price: "R$ 599" },
  { image: collection3, title: "Vestido Seda Dourada", category: "Novidades", price: "R$ 459" },
  { image: collection4, title: "Bolsa & Óculos Set", category: "Acessórios", price: "R$ 349" },
  { image: collection5, title: "Blazer Terracota", category: "Roupas", price: "R$ 489" },
  { image: collection6, title: "Tricô Creme Premium", category: "Novidades", price: "R$ 329" },
];

const CollectionSection = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = activeCategory === "Todos"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <section id="colecao" className="py-32 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-4">
            COLEÇÃO
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mb-6">
            Peças Selecionadas
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto">
            Curadoria de peças que combinam qualidade, conforto e estilo atemporal
          </p>
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-8 mb-16">
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product, i) => (
            <div
              key={i}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden mb-4 bg-secondary aspect-[3/4]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-500" />
              </div>
              <div className="space-y-1">
                <p className="font-body text-[10px] letter-wide uppercase text-muted-foreground">
                  {product.category}
                </p>
                <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                  {product.title}
                </h3>
                <p className="font-body text-sm text-primary">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
