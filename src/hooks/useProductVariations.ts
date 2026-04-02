import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductColor {
  id: string;
  product_id: string;
  name: string;
  hex_code: string;
  sort_order: number;
}

export interface ProductSize {
  id: string;
  product_id: string;
  name: string;
  sort_order: number;
}

export function useProductColors(productId: string | undefined) {
  return useQuery({
    queryKey: ["product-colors", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_colors")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ProductColor[];
    },
    enabled: !!productId,
  });
}

export function useProductSizes(productId: string | undefined) {
  return useQuery({
    queryKey: ["product-sizes", productId],
    queryFn: async () => {
      if (!productId) return [];
      const { data, error } = await supabase
        .from("product_sizes")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ProductSize[];
    },
    enabled: !!productId,
  });
}
