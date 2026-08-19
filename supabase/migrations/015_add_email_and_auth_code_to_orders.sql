-- Add email and authorization_code to orders table for Paystack integration
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS authorization_code TEXT;

-- Add index for faster lookups by paystack reference
CREATE INDEX IF NOT EXISTS idx_orders_paystack_reference ON orders(paystack_reference);
