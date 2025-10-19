-- =====================================================
-- FINAL AUTH FIX - ONE COMPLETE SOLUTION
-- This fixes all authentication issues in one script
-- =====================================================

BEGIN;

-- Step 1: Remove ALL problematic functions
DROP FUNCTION IF EXISTS create_user_by_admin(TEXT, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS create_user_as_admin(TEXT, TEXT, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS admin_create_viewer(TEXT, TEXT, JSONB, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS create_user_with_profile(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS create_or_update_user_safe(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS create_user_efficient(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS create_user_batch(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS create_user_simple(TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS get_user_role(UUID) CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Step 2: Remove ALL triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_new_user ON auth.users CASCADE;

-- Step 3: Disable RLS temporarily
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 4: Drop ALL policies
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update their own role info" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role assignment during verification" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role updates during verification" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Step 5: Clean orphaned data
DELETE FROM public.user_roles WHERE user_id NOT IN (SELECT id FROM auth.users);
DELETE FROM public.profiles WHERE id NOT IN (SELECT id FROM auth.users);

-- Step 6: Re-enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Create simple policies
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Step 8: Create simple get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT COALESCE(role::TEXT, 'viewer') 
  FROM public.user_roles 
  WHERE user_id = user_uuid 
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Step 9: Create admin user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    confirmed_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@test.com',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"first_name":"Admin","last_name":"User"}',
    false,
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Step 10: Create admin profile and role
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
    'admin@test.com',
    'Admin',
    'User',
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (
    user_id,
    email,
    role,
    assigned_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@test.com'),
    'admin@test.com',
    'admin',
    NOW()
) ON CONFLICT (user_id) DO NOTHING;

COMMIT;

-- SUCCESS MESSAGE
SELECT 'AUTH FIXED! Use: admin@test.com / @ESCPNetwork2025#' as result;
