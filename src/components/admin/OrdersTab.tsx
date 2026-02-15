import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setOrders(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="font-body text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-foreground">Pedidos ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="font-body text-muted-foreground">Nenhum pedido ainda.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{order.customer_name}</p>
                  <p className="font-body text-xs text-muted-foreground">{order.customer_whatsapp} — {order.customer_address}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-primary">R$ {Number(order.total).toFixed(2)}</p>
                  <p className="font-body text-[10px] text-muted-foreground">{new Date(order.created_at).toLocaleString("pt-BR")}</p>
                </div>
              </div>
              <div className="border-t border-border pt-2">
                {(order.items as any[]).map((item: any, i: number) => (
                  <p key={i} className="font-body text-xs text-muted-foreground">
                    {item.title} (KEY: {item.key}) x{item.quantity} — R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
