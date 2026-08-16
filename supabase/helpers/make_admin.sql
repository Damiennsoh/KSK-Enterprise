
-- ============================================================
-- MANUAL ADMIN PROMOTION HELPER
-- Run this in Supabase SQL Editor if your existing users
-- don't have admin role or are missing a profiles row.
--
-- STEPS:
--   1. Replace 'your-email@example.com' with the email
--      that signed up in Supabase Auth.
--   2. Execute in SQL Editor.
--   3. Log out & log back in.
-- ============================================================

-- Option A: Promote an existing user (has auth.users entry) to admin
INSERT INTO public.profiles (id, email, full_name, role, created_at)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  'admin',
  NOW()
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, email = EXCLUDED.email;

-- Verify: after running, the user's role should be 'admin'
SELECT id, email, full_name, role FROM public.profiles ORDER BY created_at DESC LIMIT 5;
