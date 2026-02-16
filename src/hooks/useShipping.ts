import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export interface ShippingZone {
  id: string;
  name: string;
  cep_start: string;
  cep_end: string;
  price: number;
  estimated_days: number;
  is_active: boolean;
}

export function useShippingZones() {
  return useQuery({
    queryKey: ["shipping-zones"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shipping_zones")
        .select("*")
        .eq("is_active", true)
        .order("cep_start", { ascending: true });
      if (error) throw error;
      return data as ShippingZone[];
    },
  });
}

export function useShippingCalculator() {
  const { data: zones } = useShippingZones();
  const [cep, setCep] = useState("");
  const [result, setResult] = useState<{ zone: ShippingZone; price: number; days: number } | null>(null);
  const [error, setError] = useState("");

  const calculate = () => {
    const cleanCep = cep.replace(/\D/g, "").padEnd(8, "0");
    if (cleanCep.length !== 8) {
      setError("CEP inválido");
      setResult(null);
      return;
    }
    if (!zones || zones.length === 0) {
      setError("Nenhuma região de entrega cadastrada");
      setResult(null);
      return;
    }
    const found = zones.find(
      (z) => cleanCep >= z.cep_start && cleanCep <= z.cep_end
    );
    if (found) {
      setResult({ zone: found, price: Number(found.price), days: found.estimated_days });
      setError("");
    } else {
      setError("CEP fora da área de entrega");
      setResult(null);
    }
  };

  return { cep, setCep, result, error, calculate };
}
