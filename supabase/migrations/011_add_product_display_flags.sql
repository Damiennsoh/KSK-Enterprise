-- Add display flags to products table to control which details are shown in cart/checkout
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS show_dimensions BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_sizes BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_colors BOOLEAN DEFAULT true;

-- Update existing products to have default values
UPDATE products 
SET show_dimensions = true, show_sizes = true, show_colors = true 
WHERE show_dimensions IS NULL OR show_sizes IS NULL OR show_colors IS NULL;
