-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 10 USERS (BATCH 2)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: bu@aruwacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'bu@aruwacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'bu@aruwacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: bu@aruwacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: bu@aruwacapital.com';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'bu@aruwacapital.com';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'bu@aruwacapital.com', 'Aruwa Capital Management', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Aruwa Capital Management',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'bu@aruwacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'bu@aruwacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: bu@aruwacapital.com - Aruwa Capital Management';
END $$;

-- =====================================================
-- USER 2: carol.birungi@xsmlcapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'carol.birungi@xsmlcapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'carol.birungi@xsmlcapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: carol.birungi@xsmlcapital.com';
    ELSE
        RAISE NOTICE 'User already exists: carol.birungi@xsmlcapital.com';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'carol.birungi@xsmlcapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'carol.birungi@xsmlcapital.com', 'XSML Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'XSML Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'carol.birungi@xsmlcapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'carol.birungi@xsmlcapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: carol.birungi@xsmlcapital.com - XSML Capital';
END $$;

-- =====================================================
-- USER 3: cathy@fyrefem.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'cathy@fyrefem.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'cathy@fyrefem.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: cathy@fyrefem.com';
    ELSE
        RAISE NOTICE 'User already exists: cathy@fyrefem.com';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'cathy@fyrefem.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'cathy@fyrefem.com', 'FyreFem Fund Managers', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'FyreFem Fund Managers',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'cathy@fyrefem.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'cathy@fyrefem.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: cathy@fyrefem.com - FyreFem Fund Managers';
END $$;

-- =====================================================
-- USER 4: cedella.besong@cfbholding.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'cedella.besong@cfbholding.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'cedella.besong@cfbholding.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: cedella.besong@cfbholding.com';
    ELSE
        RAISE NOTICE 'User already exists: cedella.besong@cfbholding.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'cedella.besong@cfbholding.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'cedella.besong@cfbholding.com', 'CFB Holding Ltd', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'CFB Holding Ltd',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'cedella.besong@cfbholding.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'cedella.besong@cfbholding.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: cedella.besong@cfbholding.com - CFB Holding Ltd';
END $$;

-- =====================================================
-- USER 5: chai@vakayi.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'chai@vakayi.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'chai@vakayi.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: chai@vakayi.com';
    ELSE
        RAISE NOTICE 'User already exists: chai@vakayi.com';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'chai@vakayi.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'chai@vakayi.com', 'Vakayi Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Vakayi Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'chai@vakayi.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'chai@vakayi.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: chai@vakayi.com - Vakayi Capital';
END $$;

-- =====================================================
-- USER 6: chibamba@finbond.co.zm
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'chibamba@finbond.co.zm') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'chibamba@finbond.co.zm',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: chibamba@finbond.co.zm';
    ELSE
        RAISE NOTICE 'User already exists: chibamba@finbond.co.zm';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'chibamba@finbond.co.zm';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'chibamba@finbond.co.zm', 'FinBond Limited', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'FinBond Limited',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'chibamba@finbond.co.zm', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'chibamba@finbond.co.zm',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: chibamba@finbond.co.zm - FinBond Limited';
END $$;

-- =====================================================
-- USER 7: ckingombe@4ipgroup.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ckingombe@4ipgroup.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ckingombe@4ipgroup.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: ckingombe@4ipgroup.com';
    ELSE
        RAISE NOTICE 'User already exists: ckingombe@4ipgroup.com';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'ckingombe@4ipgroup.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'ckingombe@4ipgroup.com', '4IP Group LLC (Invisible Heart Ventures No.2)', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = '4IP Group LLC (Invisible Heart Ventures No.2)',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'ckingombe@4ipgroup.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ckingombe@4ipgroup.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ckingombe@4ipgroup.com - 4IP Group LLC (Invisible Heart Ventures No.2)';
END $$;

-- =====================================================
-- USER 8: Ckirabo@mkyalaventures.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Ckirabo@mkyalaventures.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Ckirabo@mkyalaventures.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Ckirabo@mkyalaventures.com';
    ELSE
        RAISE NOTICE 'User already exists: Ckirabo@mkyalaventures.com';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'Ckirabo@mkyalaventures.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'Ckirabo@mkyalaventures.com', 'M-Kyala Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'M-Kyala Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'Ckirabo@mkyalaventures.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Ckirabo@mkyalaventures.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Ckirabo@mkyalaventures.com - M-Kyala Ventures';
END $$;

-- =====================================================
-- USER 9: colin@lineacap.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'colin@lineacap.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'colin@lineacap.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: colin@lineacap.com';
    ELSE
        RAISE NOTICE 'User already exists: colin@lineacap.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'colin@lineacap.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'colin@lineacap.com', 'Linea Capital Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Linea Capital Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'colin@lineacap.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'colin@lineacap.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: colin@lineacap.com - Linea Capital Partners';
END $$;

-- =====================================================
-- USER 10: d.doumbia@comoecapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'd.doumbia@comoecapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'd.doumbia@comoecapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: d.doumbia@comoecapital.com';
    ELSE
        RAISE NOTICE 'User already exists: d.doumbia@comoecapital.com';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'd.doumbia@comoecapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'd.doumbia@comoecapital.com', 'Comoé Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Comoé Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'd.doumbia@comoecapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'd.doumbia@comoecapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: d.doumbia@comoecapital.com - Comoé Capital';
END $$;

-- =====================================================
-- USER 11: d.rono@samawaticapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'd.rono@samawaticapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'd.rono@samawaticapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: d.rono@samawaticapital.com';
    ELSE
        RAISE NOTICE 'User already exists: d.rono@samawaticapital.com';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'd.rono@samawaticapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'd.rono@samawaticapital.com', 'Samawati Capital Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Samawati Capital Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'd.rono@samawaticapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'd.rono@samawaticapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: d.rono@samawaticapital.com - Samawati Capital Partners';
END $$;

-- =====================================================
-- USER 12: david.wangolo@pearlcapital.net
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'david.wangolo@pearlcapital.net') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'david.wangolo@pearlcapital.net',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: david.wangolo@pearlcapital.net';
    ELSE
        RAISE NOTICE 'User already exists: david.wangolo@pearlcapital.net';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 'david.wangolo@pearlcapital.net';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 'david.wangolo@pearlcapital.net', 'Pearl Capital Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Pearl Capital Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 'david.wangolo@pearlcapital.net', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'david.wangolo@pearlcapital.net',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: david.wangolo@pearlcapital.net - Pearl Capital Partners';
END $$;

-- =====================================================
-- USER 13: dayo@microtraction.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'dayo@microtraction.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'dayo@microtraction.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: dayo@microtraction.com';
    ELSE
        RAISE NOTICE 'User already exists: dayo@microtraction.com';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'dayo@microtraction.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'dayo@microtraction.com', 'Microtraction', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Microtraction',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'dayo@microtraction.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'dayo@microtraction.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: dayo@microtraction.com - Microtraction';
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
SELECT 'All 13 users processed successfully!' as status;
