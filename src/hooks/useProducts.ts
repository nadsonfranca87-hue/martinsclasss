import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProductWithDetails {
  id: string;
  key: string;
  title: string;
  description: string;
  price: number;
  status: string;
  is_new: boolean;
  is_promo: boolean;
  sort_order: number;
  video_url: string | null;
  category: { id: string; name: string } | null;
  style: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  images: { id: string; image_url: string; sort_order: number }[];
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<ProductWithDetails[]> => {
      const { data: products, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name),
          style:styles(id, name),
          brand:brands(id, name)
        `)
        .eq("status", "active")
        .order("sort_order", { ascending: true });

      if (error) throw error;

      // Fetch images for all products
      const productIds = (products || []).map((p: any) => p.id);
      const { data: images } = await supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("sort_order", { ascending: true });

      return (products || []).map((p: any) => ({
        ...p,
        images: (images || []).filter((img: any) => img.product_id === p.id),
      }));
    },
  });
}

export function useAllProducts() {
  return useQuery({
    queryKey: ["all-products"],
    queryFn: async (): Promise<ProductWithDetails[]> => {
      const { data: products, error } = await supabase
        .from("products")
        .select(`
          *,
          category:categories(id, name),
          style:styles(id, name),
          brand:brands(id, name)
        `)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      const productIds = (products || []).map((p: any) => p.id);
      const { data: images } = await supabase
        .from("product_images")
        .select("*")
        .in("product_id", productIds)
        .order("sort_order", { ascending: true });

      return (products || []).map((p: any) => ({
        ...p,
        images: (images || []).filter((img: any) => img.product_id === p.id),
      }));
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useStyles() {
  return useQuery({
    queryKey: ["styles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("styles").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brands").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}
