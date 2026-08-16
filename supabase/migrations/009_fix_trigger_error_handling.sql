-- Update the trigger function to handle existing profiles and errors better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_emails TEXT;
BEGIN
  SELECT value INTO admin_emails FROM app_settings WHERE key = 'admin_emails';
  
  -- Insert profile only if it doesn't already exist
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
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = CASE 
      WHEN admin_emails IS NOT NULL AND NEW.email = ANY(string_to_array(admin_emails, ',')) 
      THEN 'admin' 
      ELSE 'user' 
    END;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the user creation
  RAISE WARNING 'Failed to create profile for user %: %', NEW.email, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
