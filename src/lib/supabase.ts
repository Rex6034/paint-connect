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

export const getProducts = async (categoryIds?: string | string[], searchQuery?: string, page = 1, itemsPerPage = 12) => {
  const offset = (page - 1) * itemsPerPage;

  try {
    let allProductIds: string[] = [];

    // If filtering by categories, get product IDs from junction table
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const { data: productIds } = await (supabase as any)
        .from("product_categories")
        .select("product_id")
        .in("category_id", categoryIds);
      
      if (!productIds || productIds.length === 0) {
        return { data: [], count: 0 };
      }

      allProductIds = productIds.map((row: any) => row.product_id);
    }

    // Query products
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (allProductIds.length > 0) {
      query = query.in("id", allProductIds);
    }

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,code.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
    }

    query = query.range(offset, offset + itemsPerPage - 1);
    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching products:", error);
      return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { data: [], count: 0 };
  }
};

export const getProduct = async (id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
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

export const updateProductCategories = async (productId: string, categoryIds: string[]) => {
  try {
    // Delete existing categories for this product
    const { error: deleteError } = await (supabase
      .from("product_categories") as any)
      .delete()
      .eq("product_id", productId);

    if (deleteError) {
      console.error("Error deleting existing product categories:", deleteError);
      return false;
    }

    // Insert new categories
    if (categoryIds.length > 0) {
      const categoryRecords = categoryIds.map((categoryId) => ({
        product_id: productId,
        category_id: categoryId,
      }));

      const { error: insertError } = await (supabase
        .from("product_categories") as any)
        .insert(categoryRecords);

      if (insertError) {
        console.error("Error inserting product categories:", insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error("Error updating product categories:", error);
    return false;
  }
};

export const getProductCategories = async (productId: string): Promise<string[]> => {
  const { data, error } = await (supabase as any)
    .from("product_categories")
    .select("category_id")
    .eq("product_id", productId);

  if (error) {
    console.error("Error fetching product categories:", error);
    return [];
  }
  return data.map((row: any) => row.category_id);
};

export const getProductCategoryNames = async (productId: string) => {
  const { data, error } = await supabase
    .from("product_categories")
    .select("categories(id, name, slug)")
    .eq("product_id", productId);

  if (error) {
    console.error("Error fetching product category names:", error);
    return [];
  }
  return (data || []).map((row: any) => row.categories).filter((c: any) => c);
};
