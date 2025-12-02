-- Create product_categories junction table for multiple categories per product
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON product_categories(category_id);

-- Enable RLS
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read product_categories
CREATE POLICY "Allow public read access to product_categories"
ON product_categories FOR SELECT
USING (true);

-- Allow authenticated users to insert/update/delete product_categories
CREATE POLICY "Allow authenticated users to manage product_categories"
ON product_categories FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update product_categories"
ON product_categories FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete product_categories"
ON product_categories FOR DELETE
USING (auth.role() = 'authenticated');
