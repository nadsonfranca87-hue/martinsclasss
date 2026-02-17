"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { CartProvider, useCart } from "@/components/cart-provider";
import ThemeApplicator from "@/components/theme-applicator";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import Footer from "@/components/footer";
import { ArrowLeft, ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react";
import Image from "next/image";

async function fetchProduct(id: string) {
  const supabase = createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select(
      `*, category:categories(id, name), style:styles(id, name), brand:brands(id, name)`
    )
    .eq("id", id)
    .single();
  if (error) throw error;

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  return { ...product, images: images || [] };
}

function ProductContent() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useSWR(
    params.id ? `product-${params.id}` : null,
    () => fetchProduct(params.id as string)
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-body text-sm">
          Carregando...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-body text-muted-foreground">
          Produto nao encontrado
        </p>
        <button
          onClick={() => router.push("/")}
          className="font-body text-xs letter-wide uppercase text-primary hover:underline"
        >
          Voltar para a loja
        </button>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[selectedImage]?.image_url;
  const discount = product.discount_percent || 0;
  const originalPrice = Number(product.price);
  const finalPrice =
    discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

  const handleAdd = () => {
    addItem({
      id: product.id,
      productKey: product.key,
      title: product.title,
      price: finalPrice,
      image: images[0]?.image_url || "",
    });
  };

  const prevImage = () =>
    setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () =>
    setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <main className="pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative bg-secondary aspect-[3/4] overflow-hidden">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground font-body text-sm">
                  Sem imagem
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-background/80 p-1.5 sm:p-2 hover:bg-background transition-colors"
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-background/80 p-1.5 sm:p-2 hover:bg-background transition-colors"
                    aria-label="Proxima imagem"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </>
              )}

              {product.is_new && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-primary text-primary-foreground font-body text-[10px] letter-wide uppercase px-3 py-1">
                  Novidade
                </span>
              )}
              {product.is_promo && (
                <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-destructive text-destructive-foreground font-body text-[10px] letter-wide uppercase px-3 py-1">
                  Promocao
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide">
                {images.map((img: any, i: number) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 border-2 transition-colors ${
                      i === selectedImage
                        ? "border-primary"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <Image
                      src={img.image_url}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {product.category && (
              <p className="font-body text-[10px] sm:text-xs letter-wider uppercase text-muted-foreground">
                {product.category.name}
                {product.style && ` / ${product.style.name}`}
              </p>
            )}

            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground text-balance">
              {product.title}
            </h1>

            {product.brand && (
              <p className="font-body text-xs text-muted-foreground">
                Marca: {product.brand.name}
              </p>
            )}

            <div className="flex items-baseline gap-3">
              {discount > 0 && (
                <span className="font-body text-sm sm:text-base text-muted-foreground line-through">
                  R$ {originalPrice.toFixed(2)}
                </span>
              )}
              <span className="font-display text-2xl sm:text-3xl text-primary">
                R$ {finalPrice.toFixed(2)}
              </span>
              {discount > 0 && (
                <span className="font-body text-[10px] sm:text-xs bg-destructive/20 text-destructive px-2 py-1">
                  -{discount}%
                </span>
              )}
            </div>

            {product.description && (
              <div className="pt-2 sm:pt-4 border-t border-border">
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              <div className="flex items-center justify-center gap-3 border border-border">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:text-primary transition-colors"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-body text-sm w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:text-primary transition-colors"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 font-body text-xs letter-wide uppercase bg-primary text-primary-foreground py-4 hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="h-4 w-4" />
                Adicionar ao Carrinho
              </button>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.title, url: window.location.href });
                  }
                }}
                className="flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductPage() {
  return (
    <CartProvider>
      <ThemeApplicator />
      <Navbar />
      <CartDrawer />
      <ProductContent />
      <Footer />
    </CartProvider>
  );
}
