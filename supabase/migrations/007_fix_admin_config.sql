-- Create a configuration table for admin emails
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert admin emails configuration
INSERT INTO app_settings (key, value) 
VALUES ('admin_emails', 'admin@kskenterprise.com')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- Update the trigger function to use the configuration table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_emails TEXT;
BEGIN
  SELECT value INTO admin_emails FROM app_settings WHERE key = 'admin_emails';
  
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN admin_emails IS NOT NULL AND NEW.email = ANY(string_to_array(admin_emails, ',')) 
      THEN 'admin' 
      ELSE 'user' 
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
