-- Create stock settings table for global stock status configuration
CREATE TABLE IF NOT EXISTS stock_settings (
  id SERIAL PRIMARY KEY,
  low_stock_threshold INTEGER DEFAULT 10,
  limited_stock_threshold INTEGER DEFAULT 20,
  custom_labels JSONB DEFAULT '{"low_stock": "Low Stock", "limited_stock": "Limited"}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings if table is empty
INSERT INTO stock_settings (low_stock_threshold, limited_stock_threshold, custom_labels)
SELECT 10, 20, '{"low_stock": "Low Stock", "limited_stock": "Limited"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM stock_settings);

-- Enable RLS
ALTER TABLE stock_settings ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on stock_settings" ON stock_settings
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read settings
CREATE POLICY "Authenticated read stock_settings" ON stock_settings
  FOR SELECT TO authenticated
  USING (true);
