-- =====================================================
-- SIMPLE USER CREATION SCRIPT
-- Creates all 186 users step by step
-- =====================================================

-- First, let's see current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- Create users one by one with simple approach
-- User 1
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'a.annan@impcapadv.com',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

-- Get the user ID and create profile/role
DO $$
DECLARE
    user_id_1 UUID;
BEGIN
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'a.annan@impcapadv.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'a.annan@impcapadv.com', 'Impact Capital Advisors', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'a.annan@impcapadv.com', 'viewer', NOW());
END $$;

-- User 2
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'a.fofana@comoecapital.com',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_2 UUID;
BEGIN
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'a.fofana@comoecapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'a.fofana@comoecapital.com', 'Comoé Capital', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'a.fofana@comoecapital.com', 'viewer', NOW());
END $$;

-- User 3
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'a@a.com',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_3 UUID;
BEGIN
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'a@a.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'a@a.com', 'sss', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'a@a.com', 'viewer', NOW());
END $$;

-- User 4
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'aarthi.ramasubramanian@opesfund.eu',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_4 UUID;
BEGIN
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'aarthi.ramasubramanian@opesfund.eu';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'aarthi.ramasubramanian@opesfund.eu', 'Opes-LCEF', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'aarthi.ramasubramanian@opesfund.eu', 'viewer', NOW());
END $$;

-- User 5
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'agnes@firstcircle.capital',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_5 UUID;
BEGIN
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'agnes@firstcircle.capital';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'agnes@firstcircle.capital', 'First Circle Capital', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'agnes@firstcircle.capital', 'viewer', NOW());
END $$;

-- Check progress
SELECT 'Users created so far:' as status, COUNT(*) as count FROM auth.users;

-- Show the created users
SELECT 
    u.email,
    p.first_name as organization_name,
    ur.role,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;

