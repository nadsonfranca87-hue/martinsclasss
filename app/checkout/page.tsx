"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartProvider, useCart } from "@/components/cart-provider";
import ThemeApplicator from "@/components/theme-applicator";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import Footer from "@/components/footer";
import { useSiteSettings } from "@/components/theme-applicator";
import { defaultSiteData } from "@/lib/site-data";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Truck, Shield, CreditCard, Copy, Check as CheckIcon, ExternalLink } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

function CheckoutContent() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.whatsapp_link || defaultSiteData.whatsappLink;
  const pixKey = settings?.pix_key || "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "whatsapp">("pix");
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCopyPix = async () => {
    if (!pixKey) return;
    await navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave Pix copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const orderItems = items.map((item) => ({
        product_id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: `${form.address}, ${form.city} - ${form.state}, ${form.zip}`,
          items: orderItems,
          total,
          payment_method: paymentMethod,
          status: "pending",
          note: form.note || null,
        })
        .select()
        .single();

      if (error) throw error;

      if (paymentMethod === "whatsapp") {
        const itemsList = items
          .map((i) => `- ${i.title} (x${i.quantity}): R$ ${(i.price * i.quantity).toFixed(2)}`)
          .join("\n");
        const msg = encodeURIComponent(
          `Ola! Gostaria de finalizar meu pedido:\n\n${itemsList}\n\nTotal: R$ ${total.toFixed(2)}\n\nNome: ${form.name}\nTelefone: ${form.phone}\nEndereco: ${form.address}, ${form.city} - ${form.state}\n\nPedido #${order.id.slice(0, 8)}`
        );
        window.open(`${whatsapp}?text=${msg}`, "_blank");
      }

      clearCart();
      router.push(`/pedido/${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="font-display text-2xl sm:text-3xl text-foreground mb-4">
            Carrinho Vazio
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Adicione produtos ao carrinho para finalizar a compra.
          </p>
          <button
            onClick={() => router.push("/")}
            className="font-body text-xs letter-wide uppercase bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors"
          >
            Ver Produtos
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 sm:pt-24 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>

        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-8 sm:mb-12">
          Finalizar Pedido
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left: Form */}
            <div className="lg:col-span-2 flex flex-col gap-6 sm:gap-8">
              <div>
                <h2 className="font-display text-base sm:text-lg text-foreground mb-4 sm:mb-6">
                  Dados Pessoais
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs text-muted-foreground block mb-1.5">
                      Nome completo *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground block mb-1.5">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground block mb-1.5">
                      Telefone *
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-base sm:text-lg text-foreground mb-4 sm:mb-6">
                  Endereco de Entrega
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-body text-xs text-muted-foreground block mb-1.5">
                      Endereco *
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs text-muted-foreground block mb-1.5">
                      Cidade *
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="font-body text-xs text-muted-foreground block mb-1.5">
                        Estado *
                      </label>
                      <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-body text-xs text-muted-foreground block mb-1.5">
                        CEP *
                      </label>
                      <input
                        name="zip"
                        value={form.zip}
                        onChange={handleChange}
                        required
                        className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-base sm:text-lg text-foreground mb-4 sm:mb-6">
                  Forma de Pagamento
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pix")}
                    className={`flex items-center gap-3 p-4 border transition-colors ${
                      paymentMethod === "pix"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-body text-sm text-foreground">Pix</p>
                      <p className="font-body text-xs text-muted-foreground">
                        Pagamento instantaneo
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`flex items-center gap-3 p-4 border transition-colors ${
                      paymentMethod === "whatsapp"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <ExternalLink className="h-5 w-5 text-primary" />
                    <div className="text-left">
                      <p className="font-body text-sm text-foreground">
                        WhatsApp
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        Combinar pelo chat
                      </p>
                    </div>
                  </button>
                </div>

                {paymentMethod === "pix" && pixKey && (
                  <div className="mt-4 p-4 border border-border bg-card">
                    <p className="font-body text-xs text-muted-foreground mb-2">
                      Chave Pix:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="font-body text-sm text-foreground flex-1 truncate">
                        {pixKey}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                      >
                        {copied ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="font-body text-xs text-muted-foreground block mb-1.5">
                  Observacao (opcional)
                </label>
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="sticky top-24 border border-border p-4 sm:p-6">
                <h2 className="font-display text-base sm:text-lg text-foreground mb-4 sm:mb-6">
                  Resumo
                </h2>

                <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-12 h-14 flex-shrink-0 bg-secondary">
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
                        <p className="font-body text-xs text-foreground truncate">
                          {item.title}
                        </p>
                        <p className="font-body text-xs text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-body text-xs text-foreground">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs letter-wide uppercase text-muted-foreground">
                      Total
                    </span>
                    <span className="font-display text-xl text-foreground">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-body text-xs letter-wide uppercase bg-primary text-primary-foreground py-4 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processando..." : "Confirmar Pedido"}
                </button>

                <div className="flex flex-col gap-2 mt-4 sm:mt-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span className="font-body text-[10px]">
                      Compra 100% segura
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-3 w-3" />
                    <span className="font-body text-[10px]">
                      Entrega para todo o Brasil
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <CartProvider>
      <ThemeApplicator />
      <Navbar />
      <CartDrawer />
      <CheckoutContent />
      <Footer />
    </CartProvider>
  );
}
