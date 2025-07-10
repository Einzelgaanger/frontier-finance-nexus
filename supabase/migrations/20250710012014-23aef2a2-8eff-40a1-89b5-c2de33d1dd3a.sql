
-- Fix the user_roles RLS policies to allow system operations
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow role assignment during verification" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role updates during verification" ON public.user_roles;

-- Create a policy that allows the system trigger to insert roles for new users
CREATE POLICY "System can assign default roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (role = 'viewer');

-- Allow users to view their own role (keep existing)
-- Allow admins to manage all roles (keep existing)

-- Also ensure the handle_new_user function works properly by recreating it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer'::app_role)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block user creation
    RAISE WARNING 'Failed to create user role for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
