-- Create delivery zones table for location-based delivery costs
CREATE TABLE IF NOT EXISTS delivery_zones (
  id SERIAL PRIMARY KEY,
  zone_name TEXT NOT NULL UNIQUE,
  base_delivery_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default delivery zones for Wa area
INSERT INTO delivery_zones (zone_name, base_delivery_cost, display_order) VALUES
('Wa Central', 15.00, 1),
('Wa East', 20.00, 2),
('Wa West', 20.00, 3),
('Wa North', 25.00, 4),
('Wa South', 25.00, 5),
('Out of Town', 40.00, 6)
ON CONFLICT (zone_name) DO NOTHING;

-- Enable RLS
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on delivery_zones" ON delivery_zones
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read active zones
CREATE POLICY "Authenticated read active delivery_zones" ON delivery_zones
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Add delivery cost fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS delivery_cost_override DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS include_delivery_in_summary BOOLEAN DEFAULT true;
