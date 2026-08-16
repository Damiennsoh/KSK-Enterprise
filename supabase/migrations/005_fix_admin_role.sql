-- Set the admin_emails configuration in the database
-- This allows the trigger function to check against the admin email list
SET app.settings.admin_emails = 'admin@kskenterprise.com';

-- Fix existing admin role for admin@kskenterprise.com
-- This ensures the admin user has the correct role in the profiles table
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@kskenterprise.com';

-- If no profile exists for this email, create one (shouldn't happen but just in case)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, email, 'admin'
FROM auth.users
WHERE email = 'admin@kskenterprise.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'admin@kskenterprise.com');
