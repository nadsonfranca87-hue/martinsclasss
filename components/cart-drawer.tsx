"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  } = useCart();
  const router = useRouter();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] bg-background border-l border-border transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
          <h2 className="font-display text-base sm:text-lg text-foreground">
            Carrinho ({itemCount})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:text-primary transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="font-body text-sm text-muted-foreground mb-4">
                Seu carrinho esta vazio
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="font-body text-xs letter-wide uppercase text-primary hover:underline"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border"
                >
                  <div className="relative w-16 h-20 sm:w-20 sm:h-24 flex-shrink-0 bg-secondary">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-sm text-foreground truncate mb-1">
                      {item.title}
                    </h3>
                    <p className="font-body text-xs text-primary mb-2 sm:mb-3">
                      R$ {item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border border-border hover:border-primary transition-colors"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-body text-xs sm:text-sm w-6 text-center text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border border-border hover:border-primary transition-colors"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-border">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <span className="font-body text-xs letter-wide uppercase text-muted-foreground">
                Total
              </span>
              <span className="font-display text-lg sm:text-xl text-foreground">
                R$ {total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/checkout");
              }}
              className="w-full font-body text-xs letter-wide uppercase bg-primary text-primary-foreground py-3 sm:py-4 hover:bg-primary/90 transition-colors duration-300"
            >
              Finalizar Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
}
