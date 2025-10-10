-- =====================================================
-- COMPLETE USER CREATION SCRIPT - 10 USERS
-- Creates auth users, profiles, and roles for specified users
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: a.annan@impcapadv.com
-- =====================================================
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

DO $$
DECLARE
    user_id_1 UUID;
BEGIN
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'a.annan@impcapadv.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'a.annan@impcapadv.com', 'Impact Capital Advisors', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'a.annan@impcapadv.com', 'viewer', NOW());
    
    RAISE NOTICE 'Created user: a.annan@impcapadv.com - Impact Capital Advisors';
END $$;

-- =====================================================
-- USER 2: a.fofana@comoecapital.com
-- =====================================================
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
    VALUES (user_id_2, 'a.fofana@comoecapital.com', 'COMOE CAPITAL', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'a.fofana@comoecapital.com', 'viewer', NOW());
    
    RAISE NOTICE 'Created user: a.fofana@comoecapital.com - COMOE CAPITAL';
END $$;

-- =====================================================
-- USER 3: a@a.com
-- =====================================================
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
    
    RAISE NOTICE 'Created user: a@a.com - sss';
END $$;

-- =====================================================
-- USER 4: aarthi.ramasubramanian@opesfund.eu
-- =====================================================
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
    
    RAISE NOTICE 'Created user: aarthi.ramasubramanian@opesfund.eu - Opes-LCEF';
END $$;

-- =====================================================
-- USER 5: agnes@firstcircle.capital
-- =====================================================
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
    
    RAISE NOTICE 'Created user: agnes@firstcircle.capital - First Circle Capital';
END $$;

-- =====================================================
-- USER 6: ali.alsuhail@kapita.iq
-- =====================================================
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'ali.alsuhail@kapita.iq',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_6 UUID;
BEGIN
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'ali.alsuhail@kapita.iq';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'ali.alsuhail@kapita.iq', 'Kapita', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'ali.alsuhail@kapita.iq', 'viewer', NOW());
    
    RAISE NOTICE 'Created user: ali.alsuhail@kapita.iq - Kapita';
END $$;

-- =====================================================
-- USER 7: allert@mmfm-ltd.com
-- =====================================================
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'allert@mmfm-ltd.com',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_7 UUID;
BEGIN
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'allert@mmfm-ltd.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'allert@mmfm-ltd.com', 'SME Impact Fund', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'allert@mmfm-ltd.com', 'viewer', NOW());
    
    RAISE NOTICE 'Created user: allert@mmfm-ltd.com - SME Impact Fund';
END $$;

-- =====================================================
-- USER 8: alyune@loftyinc.vc
-- =====================================================
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'alyune@loftyinc.vc',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_8 UUID;
BEGIN
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'alyune@loftyinc.vc';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'alyune@loftyinc.vc', 'LoftyInc Capital', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'alyune@loftyinc.vc', 'viewer', NOW());
    
    RAISE NOTICE 'Created user: alyune@loftyinc.vc - LoftyInc Capital';
END $$;

-- =====================================================
-- USER 9: amaka@weavcapital.com
-- =====================================================
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'amaka@weavcapital.com',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_9 UUID;
BEGIN
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'amaka@weavcapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'amaka@weavcapital.com', 'WEAV Capital', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'amaka@weavcapital.com', 'viewer', NOW());
    
    RAISE NOTICE 'Created user: amaka@weavcapital.com - WEAV Capital';
END $$;

-- =====================================================
-- USER 10: ambar@ibtikarfund.com
-- =====================================================
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'ambar@ibtikarfund.com',
    crypt('@ESCPNetwork2025#', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);

DO $$
DECLARE
    user_id_10 UUID;
BEGIN
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'ambar@ibtikarfund.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'ambar@ibtikarfund.com', 'Ibtikar Fund', '', NOW(), NOW());
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'ambar@ibtikarfund.com', 'viewer', NOW());
    
    RAISE NOTICE 'Created user: ambar@ibtikarfund.com - Ibtikar Fund';
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check final user count
SELECT 'Final user count:' as status, COUNT(*) as count FROM auth.users;

-- Show all created users
SELECT 
    u.email,
    p.first_name as organization_name,
    ur.role,
    u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at DESC;

-- Success message
SELECT 'All 10 users created successfully!' as status;
