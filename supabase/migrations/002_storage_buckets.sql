
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
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id IN ('products', 'vehicles', 'materials'));

CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id IN ('products', 'vehicles', 'materials') AND public.is_admin()
  );

CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id IN ('products', 'vehicles', 'materials') AND public.is_admin()
  );
