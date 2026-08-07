
-- ============================================================
-- KSK Enterprise - Storage Buckets for Image Uploads
-- Run this after the initial schema migration
-- ============================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('products', 'products', true),
  ('vehicles', 'vehicles', true),
  ('materials', 'materials', true),
  ('hero-slides', 'hero-slides', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for storage
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
CREATE POLICY "Public can view images" ON storage.objects
  FOR SELECT USING (bucket_id IN ('products', 'vehicles', 'materials', 'hero-slides'));

DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
CREATE POLICY "Admins can upload images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id IN ('products', 'vehicles', 'materials', 'hero-slides') AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
CREATE POLICY "Admins can update images" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id IN ('products', 'vehicles', 'materials', 'hero-slides') AND public.is_admin()
  ) WITH CHECK (
    bucket_id IN ('products', 'vehicles', 'materials', 'hero-slides') AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;
CREATE POLICY "Admins can delete images" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id IN ('products', 'vehicles', 'materials') AND public.is_admin()
  );
