import { supabase } from "@/integrations/supabase/client";

/**
 * Upload a single image file to Supabase Storage
 * @param file - The image file to upload
 * @param productId - Optional product ID for organizing files
 * @returns The public URL of the uploaded image, or null if upload failed
 */
export const uploadImage = async (
  file: File,
  productId?: string
): Promise<string | null> => {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Image size must be less than 5MB");
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = productId ? `${productId}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      // Provide a clearer error when the storage bucket is missing
      const msg = ((error as any) && ((error as any).message || (error as any).error_description || (error as any).msg)) || String(error);
      if (msg && msg.toLowerCase().includes("bucket not found")) {
        throw new Error(
          'Supabase storage bucket "product-images" not found. Create the bucket in your Supabase dashboard or run the migration to create it.'
        );
      }
      throw error;
    }

    // Return stored path (useful to generate URLs on demand)
    return data.path;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return null;
  }
};

/**
 * Upload multiple image files to Supabase Storage
 * @param files - Array of image files to upload
 * @param productId - Optional product ID for organizing files
 * @returns Array of public URLs of uploaded images
 */
export const uploadMultipleImages = async (
  files: File[],
  productId?: string
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file, productId));
  const results = await Promise.all(uploadPromises);
  return results.filter((path): path is string => path !== null);
};

/**
 * Delete an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 * @returns true if deletion was successful, false otherwise
 */
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Accept either a full public URL or a stored path
    let filePath = imageUrl;
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split("/");
      const idx = pathParts.indexOf("product-images");
      if (idx >= 0) {
        filePath = pathParts.slice(idx + 1).join("/");
      }
    } catch (e) {
      // Not a URL, assume it's already a path
    }

    const { error } = await supabase.storage.from("product-images").remove([filePath]);

    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteImage:", error);
    return false;
  }
};

