import { supabase } from "@/integrations/supabase/client";

export const getSettings = async () => {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
  return data;
};

export const getProducts = async (categoryId?: string, searchQuery?: string) => {
  let query = supabase
    .from("products")
    .select(`
      *,
      category:categories(name, slug)
    `)
    .order("created_at", { ascending: false });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,code.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
};

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name, slug)
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
};

export const checkUserRole = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.error("Error checking user role:", error);
    return false;
  }
  return !!data;
};
