import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useProductColors, useProductSizes } from "@/hooks/useProductVariations";
import { ArrowLeft, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { addItem } = useCart();
  const { data: settings } = useSiteSettings();
  const { data: colors } = useProductColors(id);
  const { data: sizes } = useProductSizes(id);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const product = products?.find((p) => p.id === id);

  const discount = product?.discount_percent || 0;
  const finalPrice = product ? (discount > 0 ? product.price * (1 - discount / 100) : product.price) : 0;

  const hasColors = colors && colors.length > 0;
  const hasSizes = sizes && sizes.length > 0;

  const handleAddToCart = () => {
    if (!product) return;
    if (hasColors && !selectedColor) {
      toast.error("Selecione uma cor");
      return;
    }
    if (hasSizes && !selectedSize) {
      toast.error("Selecione um tamanho");
      return;
    }
    addItem({
      id: product.id,
      productKey: product.key,
      title: product.title,
      price: finalPrice,
      image: product.images?.[0]?.image_url || "",
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });
  };

  const nextImage = () => {
    if (!product?.images.length) return;
    setActiveImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images.length) return;
    setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4 container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 animate-pulse">
            <div className="aspect-[3/4] bg-secondary" />
            <div className="space-y-4 py-8">
              <div className="h-4 bg-secondary w-1/4" />
              <div className="h-8 bg-secondary w-3/4" />
              <div className="h-6 bg-secondary w-1/3" />
              <div className="h-20 bg-secondary w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4 container mx-auto text-center py-20">
          <h1 className="font-display text-2xl text-foreground mb-4">Produto não encontrado</h1>
          <button onClick={() => navigate("/")} className="font-body text-sm text-primary hover:text-primary/80 flex items-center gap-1 mx-auto">
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images || [];
  const whatsappNumber = settings?.whatsapp_number || "";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartDrawer />

      <main className="pt-20 sm:pt-24">
        <div className="container mx-auto px-4 sm:px-6 mb-6">
          <button onClick={() => navigate(-1)} className="font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </button>
        </div>

        <div className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                {images.length > 0 ? (
                  <img src={images[activeImage]?.image_url} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ShoppingBag className="h-16 w-16 opacity-20" />
                  </div>
                )}
                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm text-foreground p-2 hover:bg-background/80 transition-colors">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur-sm text-foreground p-2 hover:bg-background/80 transition-colors">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                {product.is_new && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground font-body text-[10px] letter-wide uppercase px-3 py-1">Novidade</span>
                )}
                {product.is_promo && (
                  <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground font-body text-[10px] letter-wide uppercase px-3 py-1">Promoção</span>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {images.map((img, i) => (
                    <button key={img.id} onClick={() => setActiveImage(i)} className={`w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 overflow-hidden border-2 transition-colors ${activeImage === i ? "border-primary" : "border-transparent hover:border-primary/30"}`}>
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {product.video_url && (
                <div className="aspect-video bg-secondary">
                  <video src={product.video_url} controls className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="py-2 lg:py-8 space-y-6">
              <div className="space-y-2">
                {product.category && (
                  <p className="font-body text-[10px] letter-wide uppercase text-muted-foreground">{product.category.name}</p>
                )}
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground">{product.title}</h1>
                {discount > 0 ? (
                  <div className="flex items-center gap-3">
                    <span className="font-body text-base sm:text-lg text-muted-foreground line-through">R$ {Number(product.price).toFixed(2)}</span>
                    <span className="font-display text-xl sm:text-2xl text-primary">R$ {finalPrice.toFixed(2)}</span>
                    <span className="font-body text-xs bg-destructive/20 text-destructive px-2 py-1">-{discount}%</span>
                  </div>
                ) : (
                  <p className="font-display text-xl sm:text-2xl text-primary">R$ {Number(product.price).toFixed(2)}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {product.style && (
                  <span className="font-body text-[10px] letter-wide uppercase text-muted-foreground border border-border px-3 py-1">{product.style.name}</span>
                )}
                {product.brand && (
                  <span className="font-body text-[10px] letter-wide uppercase text-muted-foreground border border-border px-3 py-1">{product.brand.name}</span>
                )}
              </div>

              <p className="font-body text-[10px] letter-wide text-muted-foreground/60">KEY: {product.key}</p>

              {/* Color selection */}
              {hasColors && (
                <div className="space-y-2">
                  <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground block">
                    Cor {selectedColor && <span className="text-foreground ml-1">— {selectedColor}</span>}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === c.name ? "border-primary scale-110" : "border-border hover:border-foreground/40"}`}
                        style={{ backgroundColor: c.hex_code }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {hasSizes && (
                <div className="space-y-2">
                  <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground block">Tamanho</label>
                  <div className="flex gap-2 flex-wrap">
                    {sizes.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(s.name)}
                        className={`font-body text-xs letter-wide uppercase px-4 py-2 border transition-colors ${selectedSize === s.name ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"}`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.description && (
                <div className="border-t border-border pt-6">
                  <h3 className="font-body text-[10px] letter-wide uppercase text-muted-foreground mb-3">Descrição</h3>
                  <p className="font-body text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-line">{product.description}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-8 py-4 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" /> Adicionar ao Carrinho
                </button>

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Tenho interesse no produto: ${product.title} (KEY: ${product.key}) - R$ ${finalPrice.toFixed(2)}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-xs letter-wide uppercase border border-border text-foreground px-8 py-4 hover:border-primary hover:text-primary transition-colors text-center"
                  >
                    Perguntar no WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
