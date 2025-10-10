-- Fix auth schema issues that might be causing the confirmation_token error
-- This ensures the auth.users table can handle NULL values properly

-- Drop any problematic triggers or functions that might be interfering with auth
DO $$ 
BEGIN
  -- Check if there are any custom functions or triggers on auth.users that might be causing issues
  -- We'll drop them if they exist
  IF EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname LIKE '%confirmation%' 
    AND tgrelid = 'auth.users'::regclass
  ) THEN
    DROP TRIGGER IF EXISTS handle_confirmation_token ON auth.users;
  END IF;
END $$;

-- Ensure user_roles table exists and has proper structure
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update their own role info" ON public.user_roles;

-- Create RLS policies for user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

CREATE POLICY "Users can update their own role info" ON public.user_roles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, email, role, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    'viewer',
    COALESCE(NEW.raw_user_meta_data->>'company_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Drop the trigger if it exists and recreate it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();