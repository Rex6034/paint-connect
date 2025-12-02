-- Remove category_id column from products table since we're using product_categories junction table
-- Note: This may have already been executed if you ran it manually
ALTER TABLE products DROP COLUMN IF EXISTS category_id;

-- If the column has already been dropped, this statement is safe due to the IF EXISTS clause
