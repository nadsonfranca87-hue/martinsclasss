import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { X, Minus, Plus, ShoppingBag, Trash2, Truck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useShippingCalculator } from "@/hooks/useShipping";
import { toast } from "sonner";

const CartDrawer = () => {
  const { items, removeItem, updateQuantity, clearCart, total, isOpen, setIsOpen } = useCart();
  const { data: settings } = useSiteSettings();
  const shipping = useShippingCalculator();
  const [showCheckout, setShowCheckout] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", whatsapp: "" });
  const [sending, setSending] = useState(false);

  const shippingCost = shipping.result?.price ?? 0;
  const grandTotal = total + shippingCost;

  if (!isOpen) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.whatsapp.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }
    setSending(true);

    // Save order to DB
    const orderItems = items.map((i) => ({
      key: i.productKey,
      title: i.title,
      price: i.price,
      quantity: i.quantity,
      color: i.color || null,
      size: i.size || null,
    }));

    await supabase.from("orders").insert({
      customer_name: form.name,
      customer_address: form.address,
      customer_whatsapp: form.whatsapp,
      items: orderItems,
      total: grandTotal,
    });

    // Build WhatsApp message
    const itemsText = items
      .map((i) => {
        let line = `• ${i.title} x${i.quantity} — R$ ${(i.price * i.quantity).toFixed(2)}`;
        const vars = [i.color, i.size].filter(Boolean);
        if (vars.length) line += `\n   ↳ ${vars.join(" | ")}`;
        return line;
      })
      .join("\n");

    const shippingText = shipping.result
      ? `*Frete (${shipping.result.zone.name}):* R$ ${shippingCost.toFixed(2)} (${shipping.result.days} dias úteis)`
      : "*Frete:* A calcular via WhatsApp";

    const msg = encodeURIComponent(
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🛍️ *MARTINS CLASS — NOVO PEDIDO*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `👤 *Cliente:* ${form.name}\n` +
      `📍 *Endereço:* ${form.address}\n` +
      `📮 *CEP:* ${shipping.cep || "Não informado"}\n` +
      `📱 *WhatsApp:* ${form.whatsapp}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 *PRODUTOS:*\n\n${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *Subtotal:* R$ ${total.toFixed(2)}\n` +
      `🚚 ${shippingText}\n` +
      `✅ *TOTAL: R$ ${grandTotal.toFixed(2)}*\n` +
      `━━━━━━━━━━━━━━━━━━━━`
    );

    const whatsappNumber = settings?.whatsapp_number || "5585997692382";
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");

    toast.success("Seu pedido foi enviado com sucesso!");
    clearCart();
    setShowCheckout(false);
    setForm({ name: "", address: "", whatsapp: "" });
    setIsOpen(false);
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="absolute right-0 top-0 bottom-0 w-full sm:max-w-md bg-card border-l border-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl text-foreground">Carrinho</h2>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {items.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground text-center py-12">Seu carrinho está vazio</p>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.color || ''}-${item.size || ''}`} className="flex gap-4 border-b border-border pb-4">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-16 h-20 object-cover bg-secondary" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-foreground truncate">{item.title}</p>
                  <p className="font-body text-[10px] letter-wide uppercase text-muted-foreground">KEY: {item.productKey}</p>
                  {(item.color || item.size) && (
                    <p className="font-body text-[10px] text-muted-foreground mt-0.5">
                      {[item.color && `Cor: ${item.color}`, item.size && `Tam: ${item.size}`].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <p className="font-body text-sm text-primary mt-1">R$ {item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 border border-border hover:border-primary transition-colors">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 border border-border hover:border-primary transition-colors">
                      <Plus className="h-3 w-3" />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto p-1 text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            {!showCheckout ? (
              <>
                {/* Shipping calculator */}
                <div className="space-y-2">
                  <label className="font-body text-[10px] letter-wide uppercase text-muted-foreground flex items-center gap-1">
                    <Truck className="h-3 w-3" /> Calcular Frete
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Digite seu CEP"
                      value={shipping.cep}
                      onChange={(e) => shipping.setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      className="flex-1 bg-secondary border border-border py-2 px-3 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                      maxLength={8}
                    />
                    <button
                      onClick={shipping.calculate}
                      className="font-body text-xs letter-wide uppercase bg-secondary border border-border text-foreground px-4 py-2 hover:border-primary transition-colors"
                    >
                      Calcular
                    </button>
                  </div>
                  {shipping.error && <p className="font-body text-xs text-destructive">{shipping.error}</p>}
                  {shipping.result && (
                    <p className="font-body text-xs text-primary">
                      {shipping.result.zone.name} — R$ {shipping.result.price.toFixed(2)} ({shipping.result.days} dias úteis)
                    </p>
                  )}
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-body text-sm text-foreground">R$ {total.toFixed(2)}</span>
                  </div>
                  {shipping.result && (
                    <div className="flex justify-between">
                      <span className="font-body text-sm text-muted-foreground">Frete</span>
                      <span className="font-body text-sm text-foreground">R$ {shippingCost.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-1.5">
                    <span className="font-body text-sm text-muted-foreground">Total</span>
                    <span className="font-display text-xl text-foreground">R$ {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full font-body text-xs letter-wide uppercase bg-primary text-primary-foreground py-4 hover:bg-primary/90 transition-colors"
                >
                  Finalizar Pedido
                </button>
              </>
            ) : (
              <form onSubmit={handleCheckout} className="space-y-3">
                <h3 className="font-display text-lg text-foreground">Dados para entrega</h3>
                <input
                  type="text"
                  placeholder="Nome completo *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-secondary border border-border py-2 px-3 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="Endereço completo *"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-secondary border border-border py-2 px-3 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="WhatsApp (ex: 11999990000) *"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className="w-full bg-secondary border border-border py-2 px-3 font-body text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1 font-body text-xs letter-wide uppercase border border-border text-muted-foreground py-3 hover:text-foreground transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 font-body text-xs letter-wide uppercase bg-primary text-primary-foreground py-3 hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {sending ? "Enviando..." : "Enviar Pedido"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
