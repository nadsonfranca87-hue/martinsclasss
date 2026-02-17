"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import { CartProvider } from "@/components/cart-provider";
import ThemeApplicator from "@/components/theme-applicator";
import Navbar from "@/components/navbar";
import CartDrawer from "@/components/cart-drawer";
import Footer from "@/components/footer";
import { CheckCircle, Clock, Package, ArrowLeft } from "lucide-react";

async function fetchOrder(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

const statusConfig: Record<string, { icon: any; label: string; color: string }> = {
  pending: { icon: Clock, label: "Pendente", color: "text-yellow-500" },
  confirmed: { icon: CheckCircle, label: "Confirmado", color: "text-primary" },
  shipped: { icon: Package, label: "Enviado", color: "text-blue-400" },
  delivered: { icon: CheckCircle, label: "Entregue", color: "text-green-400" },
  cancelled: { icon: Clock, label: "Cancelado", color: "text-destructive" },
};

function OrderContent() {
  const params = useParams();
  const router = useRouter();
  const { data: order, isLoading } = useSWR(
    params.id ? `order-${params.id}` : null,
    () => fetchOrder(params.id as string)
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

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-body text-muted-foreground">Pedido nao encontrado</p>
        <button
          onClick={() => router.push("/")}
          className="font-body text-xs letter-wide uppercase text-primary hover:underline"
        >
          Voltar para a loja
        </button>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const items = order.items || [];

  return (
    <main className="pt-24 sm:pt-28 pb-16 sm:pb-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-2xl">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 font-body text-xs letter-wide uppercase text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a loja
        </button>

        <div className="text-center mb-8 sm:mb-12">
          <StatusIcon className={`h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 ${status.color}`} />
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-foreground mb-2">
            Pedido Criado!
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            Seu pedido foi recebido com sucesso
          </p>
        </div>

        <div className="border border-border p-4 sm:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div>
              <p className="font-body text-xs text-muted-foreground mb-1">
                Pedido
              </p>
              <p className="font-body text-sm text-foreground">
                #{order.id.slice(0, 8)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-body text-xs text-muted-foreground mb-1">
                Status
              </p>
              <p className={`font-body text-sm ${status.color}`}>
                {status.label}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-border">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-foreground">
                    {item.title}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    x{item.quantity}
                  </p>
                </div>
                <p className="font-body text-sm text-foreground">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="font-body text-xs letter-wide uppercase text-muted-foreground">
              Total
            </span>
            <span className="font-display text-xl text-primary">
              R$ {Number(order.total).toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-body text-xs text-muted-foreground mb-1">
                Cliente
              </p>
              <p className="font-body text-foreground">{order.customer_name}</p>
            </div>
            <div>
              <p className="font-body text-xs text-muted-foreground mb-1">
                Pagamento
              </p>
              <p className="font-body text-foreground capitalize">
                {order.payment_method}
              </p>
            </div>
            {order.customer_address && (
              <div className="sm:col-span-2">
                <p className="font-body text-xs text-muted-foreground mb-1">
                  Endereco
                </p>
                <p className="font-body text-foreground">
                  {order.customer_address}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <CartProvider>
      <ThemeApplicator />
      <Navbar />
      <CartDrawer />
      <OrderContent />
      <Footer />
    </CartProvider>
  );
}
