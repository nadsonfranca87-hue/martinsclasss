"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShoppingCart, RefreshCw } from "lucide-react";

const supabase = createClient();

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  };

  useEffect(() => { fetchOrders(); }, []);

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400" },
    confirmed: { label: "Confirmado", color: "bg-green-500/20 text-green-400" },
    delivered: { label: "Entregue", color: "bg-blue-500/20 text-blue-400" },
    cancelled: { label: "Cancelado", color: "bg-red-500/20 text-red-400" },
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 bg-[hsl(var(--secondary))] rounded w-48 animate-pulse" />
      {[1,2,3].map(i => <div key={i} className="h-24 bg-[hsl(var(--secondary))] rounded animate-pulse" />)}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl sm:text-2xl text-[hsl(var(--foreground))]">
          Pedidos <span className="text-[hsl(var(--muted-foreground))] text-base">({orders.length})</span>
        </h2>
        <button onClick={fetchOrders} className="p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] rounded-sm transition-colors" title="Atualizar">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="border border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-10 flex flex-col items-center gap-3 rounded-sm">
          <ShoppingCart className="h-10 w-10 text-[hsl(var(--muted-foreground))]/30" />
          <p className="font-sans text-sm text-[hsl(var(--muted-foreground))]">Nenhum pedido ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusMap[order.status] || statusMap.pending;
            return (
              <div key={order.id} className="border border-[hsl(var(--border))] bg-[hsl(var(--card))]/50 p-4 space-y-3 rounded-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <p className="font-sans text-sm font-medium text-[hsl(var(--foreground))]">{order.customer_name}</p>
                    <p className="font-sans text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{order.customer_whatsapp}</p>
                    <p className="font-sans text-[10px] text-[hsl(var(--muted-foreground))]">{order.customer_address}</p>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right">
                    <span className={`font-sans text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm ${status.color}`}>
                      {status.label}
                    </span>
                    <div>
                      <p className="font-serif text-lg text-[hsl(var(--primary))]">R$ {Number(order.total).toFixed(2)}</p>
                      <p className="font-sans text-[10px] text-[hsl(var(--muted-foreground))]">{new Date(order.created_at).toLocaleString("pt-BR")}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-[hsl(var(--border))] pt-2 space-y-1">
                  {(order.items as any[])?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                      <p className="font-sans text-xs text-[hsl(var(--muted-foreground))]">
                        {item.title} <span className="text-[hsl(var(--muted-foreground))]/60">({item.key})</span> x {item.quantity}
                      </p>
                      <p className="font-sans text-xs text-[hsl(var(--foreground))]">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
