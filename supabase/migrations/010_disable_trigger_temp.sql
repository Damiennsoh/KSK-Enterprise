-- Temporarily disable the trigger to allow registration to work
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- We'll handle profile creation in the application code instead
