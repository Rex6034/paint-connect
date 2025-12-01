-- Migration to support multiple images per product
-- Step 1: Add new image_urls column as array
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';

-- Step 2: Migrate existing image_url data to image_urls array
UPDATE public.products 
SET image_urls = CASE 
  WHEN image_url IS NOT NULL AND image_url != '' THEN ARRAY[image_url]
  ELSE '{}'
END
WHERE image_urls = '{}' OR image_urls IS NULL;

-- Step 3: Drop the old image_url column
ALTER TABLE public.products DROP COLUMN IF EXISTS image_url;

-- Step 4: Create storage bucket for product images (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Step 5: Create storage policies for product images
-- Allow public read access
CREATE POLICY IF NOT EXISTS "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users (admins) to upload images
CREATE POLICY IF NOT EXISTS "Admins can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated users (admins) to update images
CREATE POLICY IF NOT EXISTS "Admins can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated users (admins) to delete images
CREATE POLICY IF NOT EXISTS "Admins can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND public.has_role(auth.uid(), 'admin')
);

