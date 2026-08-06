
-- ============================================================
-- KSK Enterprise - Storage Buckets for Image Uploads
-- Run this after the initial schema migration
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('products', 'products', true),
  ('vehicles', 'vehicles', true),
  ('materials', 'materials', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for storage
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id IN ('products', 'vehicles', 'materials'));

DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id IN ('products', 'vehicles', 'materials') AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id IN ('products', 'vehicles', 'materials') AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
