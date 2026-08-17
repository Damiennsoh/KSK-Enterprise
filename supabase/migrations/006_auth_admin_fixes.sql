
-- ============================================================
-- Auth + Admin Role Hardening
-- Fixes: is_admin() robustness, ensures trigger uses ADMIN_EMAILS env var
-- Also: manual admin-promotion helper (run after this migration)
-- ============================================================

-- 1. Drop & recreate is_admin() with a more robust definition
--    (In case the original migration had RLS policy recursion issues.)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  _uid UUID;
  _role TEXT;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RETURN FALSE;
  END IF;
  SELECT role INTO STRICT _role
    FROM public.profiles
    WHERE id = _uid;
  RETURN _role = 'admin';
EXCEPTION WHEN NO_DATA_FOUND THEN
  RETURN FALSE;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Re-create the admin profile policy to avoid recursion (since is_admin() is SECURITY DEFINER now)
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (public.is_admin());

-- 3. Update the handle_new_user trigger to support admin emails via:
--    - either the app.settings.admin_emails runtime setting (as before), OR
--    - direct email match against a list.
--    NOTE: If you use Supabase Email signup, ADMIN_EMAILS are set in the
--    signUp server action directly (hardcoded role='admin' via profiles insert).
--    This trigger is a safety net for direct auth.users inserts via Supabase Dashboard or SSO.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _admin_emails TEXT[];
  _email TEXT;
BEGIN
  _email := NEW.email;

  -- Priority 1: runtime setting (middleware/edge-functions can set this)
  BEGIN
    _admin_emails := string_to_array(current_setting('app.settings.admin_emails', true), ',');
  EXCEPTION WHEN OTHERS THEN
    _admin_emails := ARRAY[]::TEXT[];
  END;

  -- Priority 2: if runtime setting not found, fallback to hardcoded list.
  -- EDIT THIS LIST FOR YOUR ADMINS (also update ADMIN_EMAILS env var in .env!)
  IF _admin_emails IS NULL OR array_length(_admin_emails, 1) IS NULL THEN
    _admin_emails := ARRAY[
      'admin@kskenterprise.com',
      'your-email@example.com'
    ];
  END IF;

  INSERT INTO public.profiles (id, email, full_name, phone, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    CASE WHEN NEW.email = ANY(_admin_emails) THEN 'admin' ELSE 'user' END,
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
