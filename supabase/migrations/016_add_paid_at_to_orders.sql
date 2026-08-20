-- Add paid_at column to orders table for webhook payment tracking
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
