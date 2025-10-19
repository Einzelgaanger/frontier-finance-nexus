-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 15 USERS (BATCH 3)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: dmitry.fotiyev@brightmorecapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'dmitry.fotiyev@brightmorecapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'dmitry.fotiyev@brightmorecapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: dmitry.fotiyev@brightmorecapital.com';
    ELSE
        RAISE NOTICE 'User already exists: dmitry.fotiyev@brightmorecapital.com';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'dmitry.fotiyev@brightmorecapital.com';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'dmitry.fotiyev@brightmorecapital.com', 'Brightmore Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Brightmore Capital',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'dmitry.fotiyev@brightmorecapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'dmitry.fotiyev@brightmorecapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: dmitry.fotiyev@brightmorecapital.com - Brightmore Capital';
END $$;

-- =====================================================
-- USER 2: e.arthur@wangaracapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'e.arthur@wangaracapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'e.arthur@wangaracapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: e.arthur@wangaracapital.com';
    ELSE
        RAISE NOTICE 'User already exists: e.arthur@wangaracapital.com';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'e.arthur@wangaracapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'e.arthur@wangaracapital.com', 'Wangara Green Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Wangara Green Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'e.arthur@wangaracapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'e.arthur@wangaracapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: e.arthur@wangaracapital.com - Wangara Green Ventures';
END $$;

-- =====================================================
-- USER 3: e.cotsoyannis@miarakap.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'e.cotsoyannis@miarakap.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'e.cotsoyannis@miarakap.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: e.cotsoyannis@miarakap.com';
    ELSE
        RAISE NOTICE 'User already exists: e.cotsoyannis@miarakap.com';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'e.cotsoyannis@miarakap.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'e.cotsoyannis@miarakap.com', 'Miarakap', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Miarakap',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'e.cotsoyannis@miarakap.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'e.cotsoyannis@miarakap.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: e.cotsoyannis@miarakap.com - Miarakap';
END $$;

-- =====================================================
-- USER 4: e.ravohitrarivo@miarakap.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'e.ravohitrarivo@miarakap.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'e.ravohitrarivo@miarakap.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: e.ravohitrarivo@miarakap.com';
    ELSE
        RAISE NOTICE 'User already exists: e.ravohitrarivo@miarakap.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'e.ravohitrarivo@miarakap.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'e.ravohitrarivo@miarakap.com', 'Miarakap', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Miarakap',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'e.ravohitrarivo@miarakap.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'e.ravohitrarivo@miarakap.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: e.ravohitrarivo@miarakap.com - Miarakap';
END $$;

-- =====================================================
-- USER 5: eddie.sembatya@findingxy.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'eddie.sembatya@findingxy.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'eddie.sembatya@findingxy.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: eddie.sembatya@findingxy.com';
    ELSE
        RAISE NOTICE 'User already exists: eddie.sembatya@findingxy.com';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'eddie.sembatya@findingxy.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'eddie.sembatya@findingxy.com', 'Finding XY', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Finding XY',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'eddie.sembatya@findingxy.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'eddie.sembatya@findingxy.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: eddie.sembatya@findingxy.com - Finding XY';
END $$;

-- =====================================================
-- USER 6: edioh@wic-capital.net
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'edioh@wic-capital.net') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'edioh@wic-capital.net',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: edioh@wic-capital.net';
    ELSE
        RAISE NOTICE 'User already exists: edioh@wic-capital.net';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'edioh@wic-capital.net';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'edioh@wic-capital.net', 'WIC CAPITAL', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'WIC CAPITAL',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'edioh@wic-capital.net', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'edioh@wic-capital.net',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: edioh@wic-capital.net - WIC CAPITAL';
END $$;

-- =====================================================
-- USER 7: edson@relevant.is
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'edson@relevant.is') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'edson@relevant.is',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: edson@relevant.is';
    ELSE
        RAISE NOTICE 'User already exists: edson@relevant.is';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'edson@relevant.is';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'edson@relevant.is', 'Relevant Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Relevant Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'edson@relevant.is', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'edson@relevant.is',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: edson@relevant.is - Relevant Ventures';
END $$;

-- =====================================================
-- USER 8: egla@msftventures.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'egla@msftventures.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'egla@msftventures.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: egla@msftventures.com';
    ELSE
        RAISE NOTICE 'User already exists: egla@msftventures.com';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'egla@msftventures.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'egla@msftventures.com', 'MsFiT Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'MsFiT Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'egla@msftventures.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'egla@msftventures.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: egla@msftventures.com - MsFiT Ventures';
END $$;

-- =====================================================
-- USER 9: enyonam@mirepacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'enyonam@mirepacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'enyonam@mirepacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: enyonam@mirepacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: enyonam@mirepacapital.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'enyonam@mirepacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'enyonam@mirepacapital.com', 'Mirepa Investment Advisors', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Mirepa Investment Advisors',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'enyonam@mirepacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'enyonam@mirepacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: enyonam@mirepacapital.com - Mirepa Investment Advisors';
END $$;

-- =====================================================
-- USER 10: enyonam@mirepaadvisors.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'enyonam@mirepaadvisors.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'enyonam@mirepaadvisors.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: enyonam@mirepaadvisors.com';
    ELSE
        RAISE NOTICE 'User already exists: enyonam@mirepaadvisors.com';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'enyonam@mirepaadvisors.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'enyonam@mirepaadvisors.com', 'Mirepa Investment Advisors Ltd.', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Mirepa Investment Advisors Ltd.',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'enyonam@mirepaadvisors.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'enyonam@mirepaadvisors.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: enyonam@mirepaadvisors.com - Mirepa Investment Advisors Ltd.';
END $$;

-- =====================================================
-- USER 11: eric@happysmala.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'eric@happysmala.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'eric@happysmala.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: eric@happysmala.com';
    ELSE
        RAISE NOTICE 'User already exists: eric@happysmala.com';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'eric@happysmala.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'eric@happysmala.com', 'happy smala', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'happy smala',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'eric@happysmala.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'eric@happysmala.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: eric@happysmala.com - happy smala';
END $$;

-- =====================================================
-- USER 12: esther@unconventional.capital
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'esther@unconventional.capital') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'esther@unconventional.capital',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: esther@unconventional.capital';
    ELSE
        RAISE NOTICE 'User already exists: esther@unconventional.capital';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 'esther@unconventional.capital';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 'esther@unconventional.capital', 'Uncap', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Uncap',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 'esther@unconventional.capital', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'esther@unconventional.capital',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: esther@unconventional.capital - Uncap';
END $$;

-- =====================================================
-- USER 13: farynv@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'farynv@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'farynv@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: farynv@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: farynv@gmail.com';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'farynv@gmail.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'farynv@gmail.com', 'BUSINESS PARTNERS LTD', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'BUSINESS PARTNERS LTD',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'farynv@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'farynv@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: farynv@gmail.com - BUSINESS PARTNERS LTD';
END $$;

-- =====================================================
-- USER 14: finance@habacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_14 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'finance@habacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'finance@habacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: finance@habacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: finance@habacapital.com';
    END IF;
    
    SELECT id INTO user_id_14 FROM auth.users WHERE email = 'finance@habacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_14, 'finance@habacapital.com', 'Haba Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Haba Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_14, 'finance@habacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'finance@habacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: finance@habacapital.com - Haba Capital';
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
SELECT 'All 14 users processed successfully!' as status;
