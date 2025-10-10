-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 15 USERS (BATCH 7)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: m.roestenberg@fmo.nl
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'm.roestenberg@fmo.nl') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'm.roestenberg@fmo.nl',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: m.roestenberg@fmo.nl';
    ELSE
        RAISE NOTICE 'User already exists: m.roestenberg@fmo.nl';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'm.roestenberg@fmo.nl';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'm.roestenberg@fmo.nl', 'FMO', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'FMO',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'm.roestenberg@fmo.nl', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'm.roestenberg@fmo.nl',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: m.roestenberg@fmo.nl - FMO';
END $$;

-- =====================================================
-- USER 2: mamokete@mamorcapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'mamokete@mamorcapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'mamokete@mamorcapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: mamokete@mamorcapital.com';
    ELSE
        RAISE NOTICE 'User already exists: mamokete@mamorcapital.com';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'mamokete@mamorcapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'mamokete@mamorcapital.com', 'Mamor Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Mamor Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'mamokete@mamorcapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'mamokete@mamorcapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: mamokete@mamorcapital.com - Mamor Capital';
END $$;

-- =====================================================
-- USER 3: mariamkamel@aucegypt.edu
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'mariamkamel@aucegypt.edu') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'mariamkamel@aucegypt.edu',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: mariamkamel@aucegypt.edu';
    ELSE
        RAISE NOTICE 'User already exists: mariamkamel@aucegypt.edu';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'mariamkamel@aucegypt.edu';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'mariamkamel@aucegypt.edu', 'AUC Angels', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'AUC Angels',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'mariamkamel@aucegypt.edu', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'mariamkamel@aucegypt.edu',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: mariamkamel@aucegypt.edu - AUC Angels';
END $$;

-- =====================================================
-- USER 4: mark@bidcp.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'mark@bidcp.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'mark@bidcp.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: mark@bidcp.com';
    ELSE
        RAISE NOTICE 'User already exists: mark@bidcp.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'mark@bidcp.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'mark@bidcp.com', 'Bid Capital Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Bid Capital Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'mark@bidcp.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'mark@bidcp.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: mark@bidcp.com - Bid Capital Partners';
END $$;

-- =====================================================
-- USER 5: martin@warioba.ventures
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'martin@warioba.ventures') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'martin@warioba.ventures',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: martin@warioba.ventures';
    ELSE
        RAISE NOTICE 'User already exists: martin@warioba.ventures';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'martin@warioba.ventures';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'martin@warioba.ventures', 'Warioba Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Warioba Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'martin@warioba.ventures', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'martin@warioba.ventures',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: martin@warioba.ventures - Warioba Ventures';
END $$;

-- =====================================================
-- USER 6: maya@womvest.club
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'maya@womvest.club') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'maya@womvest.club',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: maya@womvest.club';
    ELSE
        RAISE NOTICE 'User already exists: maya@womvest.club';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'maya@womvest.club';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'maya@womvest.club', 'Womvest', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Womvest',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'maya@womvest.club', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'maya@womvest.club',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: maya@womvest.club - Womvest';
END $$;

-- =====================================================
-- USER 7: micheal.m@bamboocp.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'micheal.m@bamboocp.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'micheal.m@bamboocp.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: micheal.m@bamboocp.com';
    ELSE
        RAISE NOTICE 'User already exists: micheal.m@bamboocp.com';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'micheal.m@bamboocp.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'micheal.m@bamboocp.com', 'Bamboo Capital Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Bamboo Capital Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'micheal.m@bamboocp.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'micheal.m@bamboocp.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: micheal.m@bamboocp.com - Bamboo Capital Partners';
END $$;

-- =====================================================
-- USER 8: micheal@cosefinvest.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'micheal@cosefinvest.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'micheal@cosefinvest.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: micheal@cosefinvest.com';
    ELSE
        RAISE NOTICE 'User already exists: micheal@cosefinvest.com';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'micheal@cosefinvest.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'micheal@cosefinvest.com', 'COSEF', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'COSEF',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'micheal@cosefinvest.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'micheal@cosefinvest.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: micheal@cosefinvest.com - COSEF';
END $$;

-- =====================================================
-- USER 9: mouattara@footprint-cap.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'mouattara@footprint-cap.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'mouattara@footprint-cap.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: mouattara@footprint-cap.com';
    ELSE
        RAISE NOTICE 'User already exists: mouattara@footprint-cap.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'mouattara@footprint-cap.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'mouattara@footprint-cap.com', 'FOOTPRINT CAPITAL', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'FOOTPRINT CAPITAL',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'mouattara@footprint-cap.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'mouattara@footprint-cap.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: mouattara@footprint-cap.com - FOOTPRINT CAPITAL';
END $$;

-- =====================================================
-- USER 10: ndeye.thiaw@brightmorecapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ndeye.thiaw@brightmorecapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ndeye.thiaw@brightmorecapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: ndeye.thiaw@brightmorecapital.com';
    ELSE
        RAISE NOTICE 'User already exists: ndeye.thiaw@brightmorecapital.com';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'ndeye.thiaw@brightmorecapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'ndeye.thiaw@brightmorecapital.com', 'Brightmore Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Brightmore Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'ndeye.thiaw@brightmorecapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ndeye.thiaw@brightmorecapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ndeye.thiaw@brightmorecapital.com - Brightmore Capital';
END $$;

-- =====================================================
-- USER 11: Nkhulu@torhotech.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Nkhulu@torhotech.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Nkhulu@torhotech.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Nkhulu@torhotech.com';
    ELSE
        RAISE NOTICE 'User already exists: Nkhulu@torhotech.com';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'Nkhulu@torhotech.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'Nkhulu@torhotech.com', 'Ubukai Ventures / Ubuntu Kaizen Capital Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Ubukai Ventures / Ubuntu Kaizen Capital Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'Nkhulu@torhotech.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Nkhulu@torhotech.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Nkhulu@torhotech.com - Ubukai Ventures / Ubuntu Kaizen Capital Partners';
END $$;

-- =====================================================
-- USER 12: nneka@vestedworld.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'nneka@vestedworld.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'nneka@vestedworld.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: nneka@vestedworld.com';
    ELSE
        RAISE NOTICE 'User already exists: nneka@vestedworld.com';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 'nneka@vestedworld.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 'nneka@vestedworld.com', 'VestedWorld', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'VestedWorld',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 'nneka@vestedworld.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'nneka@vestedworld.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: nneka@vestedworld.com - VestedWorld';
END $$;

-- =====================================================
-- USER 13: nyeji@womencapital.co
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'nyeji@womencapital.co') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'nyeji@womencapital.co',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: nyeji@womencapital.co';
    ELSE
        RAISE NOTICE 'User already exists: nyeji@womencapital.co';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'nyeji@womencapital.co';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'nyeji@womencapital.co', 'wCap Limited', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'wCap Limited',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'nyeji@womencapital.co', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'nyeji@womencapital.co',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: nyeji@womencapital.co - wCap Limited';
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
