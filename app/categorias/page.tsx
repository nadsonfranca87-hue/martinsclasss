"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { CartProvider } from "@/components/cart-provider";
import ThemeApplicator from "@/components/theme-applicator";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import Footer from "@/components/footer";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

async function fetchCategoriesWithCounts() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  const { data: products } = await supabase
    .from("products")
    .select("id, category_id, status")
    .eq("status", "active");

  return (categories || []).map((cat: any) => ({
    ...cat,
    productCount: (products || []).filter(
      (p: any) => p.category_id === cat.id
    ).length,
  }));
}

function CategoriesContent() {
  const router = useRouter();
  const { data: categories, isLoading } = useSWR(
    "categories-with-counts",
    fetchCategoriesWithCounts
  );

  return (
    <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10 sm:mb-16">
          <p className="font-body text-xs letter-wider uppercase text-muted-foreground mb-3 sm:mb-4">
            EXPLORE
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground mb-4 text-balance">
            Categorias
          </h1>
          <p className="font-body text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Navegue por nossas categorias e encontre a peca perfeita
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary aspect-[4/3] mb-3" />
                <div className="h-4 bg-secondary w-1/2" />
              </div>
            ))}
          </div>
        ) : !categories || categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-body text-muted-foreground">
              Nenhuma categoria cadastrada ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => router.push(`/?categoria=${cat.name}`)}
                className="group text-left border border-border hover:border-primary transition-colors duration-300"
              >
                {cat.image_url ? (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors duration-500" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-lg text-foreground">
                        {cat.name}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground">
                        {cat.productCount} produto
                        {cat.productCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-lg text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        {cat.productCount} produto
                        {cat.productCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function CategoriesPage() {
  return (
    <CartProvider>
      <ThemeApplicator />
      <Navbar />
      <CartDrawer />
      <CategoriesContent />
      <Footer />
    </CartProvider>
  );
}
