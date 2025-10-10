-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 20 USERS (BATCH 10)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role`
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: sam@mirepaadvisors.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sam@mirepaadvisors.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'sam@mirepaadvisors.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: sam@mirepaadvisors.com';
    ELSE
        RAISE NOTICE 'User already exists: sam@mirepaadvisors.com';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'sam@mirepaadvisors.com';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'sam@mirepaadvisors.com', 'MIREPA Investment Advisors', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'MIREPA Investment Advisors',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'sam@mirepaadvisors.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'sam@mirepaadvisors.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: sam@mirepaadvisors.com - MIREPA Investment Advisors';
END $$;

-- =====================================================
-- USER 2: samuel@saviu.vc
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'samuel@saviu.vc') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'samuel@saviu.vc',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: samuel@saviu.vc';
    ELSE
        RAISE NOTICE 'User already exists: samuel@saviu.vc';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'samuel@saviu.vc';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'samuel@saviu.vc', 'Saviu Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Saviu Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'samuel@saviu.vc', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'samuel@saviu.vc',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: samuel@saviu.vc - Saviu Ventures';
END $$;

-- =====================================================
-- USER 3: sana@headingforchange.org
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sana@headingforchange.org') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'sana@headingforchange.org',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: sana@headingforchange.org';
    ELSE
        RAISE NOTICE 'User already exists: sana@headingforchange.org';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'sana@headingforchange.org';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'sana@headingforchange.org', 'Heading for Change', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Heading for Change',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'sana@headingforchange.org', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'sana@headingforchange.org',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: sana@headingforchange.org - Heading for Change';
END $$;

-- =====================================================
-- USER 4: sawadh@ssc.co.tz
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sawadh@ssc.co.tz') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'sawadh@ssc.co.tz',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: sawadh@ssc.co.tz';
    ELSE
        RAISE NOTICE 'User already exists: sawadh@ssc.co.tz';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'sawadh@ssc.co.tz';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'sawadh@ssc.co.tz', 'SSC Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'SSC Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'sawadh@ssc.co.tz', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'sawadh@ssc.co.tz',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: sawadh@ssc.co.tz - SSC Capital';
END $$;

-- =====================================================
-- USER 5: Sejakekana@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Sejakekana@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Sejakekana@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Sejakekana@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: Sejakekana@gmail.com';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'Sejakekana@gmail.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'Sejakekana@gmail.com', 'Makoti Kekana Capital (Pty) Ltd', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Makoti Kekana Capital (Pty) Ltd',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'Sejakekana@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Sejakekana@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Sejakekana@gmail.com - Makoti Kekana Capital (Pty) Ltd';
END $$;

-- =====================================================
-- USER 6: selma@firstcircle.capital
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'selma@firstcircle.capital') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'selma@firstcircle.capital',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: selma@firstcircle.capital';
    ELSE
        RAISE NOTICE 'User already exists: selma@firstcircle.capital';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'selma@firstcircle.capital';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'selma@firstcircle.capital', 'First Circle Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'First Circle Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'selma@firstcircle.capital', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'selma@firstcircle.capital',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: selma@firstcircle.capital - First Circle Capital';
END $$;

-- =====================================================
-- USER 7: sewu@jazarift.vc
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sewu@jazarift.vc') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'sewu@jazarift.vc',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: sewu@jazarift.vc';
    ELSE
        RAISE NOTICE 'User already exists: sewu@jazarift.vc';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'sewu@jazarift.vc';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'sewu@jazarift.vc', 'Jaza Rift Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Jaza Rift Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'sewu@jazarift.vc', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'sewu@jazarift.vc',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: sewu@jazarift.vc - Jaza Rift Ventures';
END $$;

-- =====================================================
-- USER 8: shiluba@tshiamoimpact.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'shiluba@tshiamoimpact.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'shiluba@tshiamoimpact.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: shiluba@tshiamoimpact.com';
    ELSE
        RAISE NOTICE 'User already exists: shiluba@tshiamoimpact.com';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'shiluba@tshiamoimpact.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'shiluba@tshiamoimpact.com', 'Tshiamo Impact Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Tshiamo Impact Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'shiluba@tshiamoimpact.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'shiluba@tshiamoimpact.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: shiluba@tshiamoimpact.com - Tshiamo Impact Partners';
END $$;

-- =====================================================
-- USER 9: shiva@ankurcapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'shiva@ankurcapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'shiva@ankurcapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: shiva@ankurcapital.com';
    ELSE
        RAISE NOTICE 'User already exists: shiva@ankurcapital.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'shiva@ankurcapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'shiva@ankurcapital.com', 'Ankur Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Ankur Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'shiva@ankurcapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'shiva@ankurcapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: shiva@ankurcapital.com - Ankur Capital';
END $$;

-- =====================================================
-- USER 10: shuyin@beaconfund.asia
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'shuyin@beaconfund.asia') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'shuyin@beaconfund.asia',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: shuyin@beaconfund.asia';
    ELSE
        RAISE NOTICE 'User already exists: shuyin@beaconfund.asia';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'shuyin@beaconfund.asia';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'shuyin@beaconfund.asia', 'Beacon Fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Beacon Fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'shuyin@beaconfund.asia', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'shuyin@beaconfund.asia',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: shuyin@beaconfund.asia - Beacon Fund';
END $$;

-- =====================================================
-- USER 11: sro@ceo-enterprises.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sro@ceo-enterprises.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'sro@ceo-enterprises.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: sro@ceo-enterprises.com';
    ELSE
        RAISE NOTICE 'User already exists: sro@ceo-enterprises.com';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'sro@ceo-enterprises.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'sro@ceo-enterprises.com', 'CEO Africa', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'CEO Africa',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'sro@ceo-enterprises.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'sro@ceo-enterprises.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: sro@ceo-enterprises.com - CEO Africa';
END $$;

-- =====================================================
-- USER 12: Ssircar@graymatterscap.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Ssircar@graymatterscap.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Ssircar@graymatterscap.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Ssircar@graymatterscap.com';
    ELSE
        RAISE NOTICE 'User already exists: Ssircar@graymatterscap.com';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 'Ssircar@graymatterscap.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 'Ssircar@graymatterscap.com', 'Gmc', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Gmc',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 'Ssircar@graymatterscap.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Ssircar@graymatterscap.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Ssircar@graymatterscap.com - Gmc';
END $$;

-- =====================================================
-- USER 13: stawia@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'stawia@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'stawia@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: stawia@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: stawia@gmail.com';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'stawia@gmail.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'stawia@gmail.com', 'Villgro Africa', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Villgro Africa',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'stawia@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'stawia@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: stawia@gmail.com - Villgro Africa';
END $$;

-- =====================================================
-- USER 14: stephengugu@viktoria.co.ke
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_14 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'stephengugu@viktoria.co.ke') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'stephengugu@viktoria.co.ke',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: stephengugu@viktoria.co.ke';
    ELSE
        RAISE NOTICE 'User already exists: stephengugu@viktoria.co.ke';
    END IF;
    
    SELECT id INTO user_id_14 FROM auth.users WHERE email = 'stephengugu@viktoria.co.ke';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_14, 'stephengugu@viktoria.co.ke', 'Viktoria Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Viktoria Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_14, 'stephengugu@viktoria.co.ke', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'stephengugu@viktoria.co.ke',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: stephengugu@viktoria.co.ke - Viktoria Ventures';
END $$;

-- =====================================================
-- USER 15: steven@frontend.vc
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_15 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'steven@frontend.vc') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'steven@frontend.vc',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: steven@frontend.vc';
    ELSE
        RAISE NOTICE 'User already exists: steven@frontend.vc';
    END IF;
    
    SELECT id INTO user_id_15 FROM auth.users WHERE email = 'steven@frontend.vc';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_15, 'steven@frontend.vc', 'FrontEnd Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'FrontEnd Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_15, 'steven@frontend.vc', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'steven@frontend.vc',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: steven@frontend.vc - FrontEnd Ventures';
END $$;

-- =====================================================
-- USER 16: sven.haefner@30ThirtyCapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_16 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sven.haefner@30ThirtyCapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'sven.haefner@30ThirtyCapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: sven.haefner@30ThirtyCapital.com';
    ELSE
        RAISE NOTICE 'User already exists: sven.haefner@30ThirtyCapital.com';
    END IF;
    
    SELECT id INTO user_id_16 FROM auth.users WHERE email = 'sven.haefner@30ThirtyCapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_16, 'sven.haefner@30ThirtyCapital.com', '30Thirty Capital Ltd.', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = '30Thirty Capital Ltd.',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_16, 'sven.haefner@30ThirtyCapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'sven.haefner@30ThirtyCapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: sven.haefner@30ThirtyCapital.com - 30Thirty Capital Ltd.';
END $$;

-- =====================================================
-- USER 17: tadlam@agrifrontier.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_17 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'tadlam@agrifrontier.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'tadlam@agrifrontier.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: tadlam@agrifrontier.com';
    ELSE
        RAISE NOTICE 'User already exists: tadlam@agrifrontier.com';
    END IF;
    
    SELECT id INTO user_id_17 FROM auth.users WHERE email = 'tadlam@agrifrontier.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_17, 'tadlam@agrifrontier.com', 'Agri Frontier', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Agri Frontier',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_17, 'tadlam@agrifrontier.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'tadlam@agrifrontier.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: tadlam@agrifrontier.com - Agri Frontier';
END $$;

-- =====================================================
-- USER 18: tamara@amamventures.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_18 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'tamara@amamventures.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'tamara@amamventures.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: tamara@amamventures.com';
    ELSE
        RAISE NOTICE 'User already exists: tamara@amamventures.com';
    END IF;
    
    SELECT id INTO user_id_18 FROM auth.users WHERE email = 'tamara@amamventures.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_18, 'tamara@amamventures.com', 'Amam Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Amam Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_18, 'tamara@amamventures.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'tamara@amamventures.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: tamara@amamventures.com - Amam Ventures';
END $$;

-- =====================================================
-- USER 19: tawana@afirca-growth.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_19 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'tawana@afirca-growth.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'tawana@afirca-growth.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: tawana@afirca-growth.com';
    ELSE
        RAISE NOTICE 'User already exists: tawana@afirca-growth.com';
    END IF;
    
    SELECT id INTO user_id_19 FROM auth.users WHERE email = 'tawana@afirca-growth.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_19, 'tawana@afirca-growth.com', 'Africa Growth LLC', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Africa Growth LLC',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_19, 'tawana@afirca-growth.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'tawana@afirca-growth.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: tawana@afirca-growth.com - Africa Growth LLC';
END $$;

-- =====================================================
-- USER 20: tawana@africa-growth.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_20 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'tawana@africa-growth.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'tawana@africa-growth.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: tawana@africa-growth.com';
    ELSE
        RAISE NOTICE 'User already exists: tawana@africa-growth.com';
    END IF;
    
    SELECT id INTO user_id_20 FROM auth.users WHERE email = 'tawana@africa-growth.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_20, 'tawana@africa-growth.com', 'Africa Growth LLC', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Africa Growth LLC',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_20, 'tawana@africa-growth.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'tawana@africa-growth.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: tawana@africa-growth.com - Africa Growth LLC';
END $$;

-- =====================================================
-- USER 21: tekiyor@nigeriasme.ng
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_21 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'tekiyor@nigeriasme.ng') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'tekiyor@nigeriasme.ng',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: tekiyor@nigeriasme.ng';
    ELSE
        RAISE NOTICE 'User already exists: tekiyor@nigeriasme.ng';
    END IF;
    
    SELECT id INTO user_id_21 FROM auth.users WHERE email = 'tekiyor@nigeriasme.ng';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_21, 'tekiyor@nigeriasme.ng', 'Chapel Hill Denham Nigeria SME Ltd (SME.NG)', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Chapel Hill Denham Nigeria SME Ltd (SME.NG)',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_21, 'tekiyor@nigeriasme.ng', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'tekiyor@nigeriasme.ng',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: tekiyor@nigeriasme.ng - Chapel Hill Denham Nigeria SME Ltd (SME.NG)';
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
SELECT 'All 21 users processed successfully!' as status;
