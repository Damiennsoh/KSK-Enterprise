
-- ============================================================
-- Add Length & Width columns to products table for smock/fugu dimensions
-- ============================================================

ALTER TABLE products
ADD COLUMN IF NOT EXISTS length_cm DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS width_cm DECIMAL(10,2);
