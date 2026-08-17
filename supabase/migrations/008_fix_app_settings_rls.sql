-- Enable RLS on app_settings table
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read app_settings (needed for trigger function)
CREATE POLICY "Authenticated can read app_settings" ON app_settings
  FOR SELECT TO authenticated
  USING (true);

-- Allow service role to manage app_settings
CREATE POLICY "Service role can manage app_settings" ON app_settings
  FOR ALL TO service_role
  USING (true);

-- Grant execute permission on handle_new_user function to authenticated users
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
