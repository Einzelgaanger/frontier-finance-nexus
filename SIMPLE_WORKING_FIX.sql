-- =====================================================
-- SIMPLE WORKING FIX - MINIMAL CHANGES
-- =====================================================

-- Just create a working admin user, don't touch anything else
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

-- Create profile if it doesn't exist
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

-- Create role if it doesn't exist
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

-- Test the user exists
SELECT 'ADMIN USER CREATED:' as status, email FROM auth.users WHERE email = 'admin@test.com';
