-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 20 USERS (BATCH 6)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: Kamaldine08@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Kamaldine08@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Kamaldine08@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: Kamaldine08@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: Kamaldine08@gmail.com';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'Kamaldine08@gmail.com';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'Kamaldine08@gmail.com', 'SINERGI SA', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'SINERGI SA',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'Kamaldine08@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Kamaldine08@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Kamaldine08@gmail.com - SINERGI SA';
END $$;

-- =====================================================
-- USER 2: karinawong@smallfoundation.ie
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'karinawong@smallfoundation.ie') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'karinawong@smallfoundation.ie',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: karinawong@smallfoundation.ie';
    ELSE
        RAISE NOTICE 'User already exists: karinawong@smallfoundation.ie';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'karinawong@smallfoundation.ie';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'karinawong@smallfoundation.ie', 'Small Foundation', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Small Foundation',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'karinawong@smallfoundation.ie', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'karinawong@smallfoundation.ie',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: karinawong@smallfoundation.ie - Small Foundation';
END $$;

-- =====================================================
-- USER 3: karthik@sangam.vc
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'karthik@sangam.vc') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'karthik@sangam.vc',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: karthik@sangam.vc';
    ELSE
        RAISE NOTICE 'User already exists: karthik@sangam.vc';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'karthik@sangam.vc';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'karthik@sangam.vc', 'Sangam Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Sangam Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'karthik@sangam.vc', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'karthik@sangam.vc',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: karthik@sangam.vc - Sangam Ventures';
END $$;

-- =====================================================
-- USER 4: kendi@hevafund.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'kendi@hevafund.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'kendi@hevafund.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: kendi@hevafund.com';
    ELSE
        RAISE NOTICE 'User already exists: kendi@hevafund.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'kendi@hevafund.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'kendi@hevafund.com', 'Heva Fund LLP', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Heva Fund LLP',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'kendi@hevafund.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'kendi@hevafund.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: kendi@hevafund.com - Heva Fund LLP';
END $$;

-- =====================================================
-- USER 5: kenza@outlierz.co
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'kenza@outlierz.co') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'kenza@outlierz.co',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: kenza@outlierz.co';
    ELSE
        RAISE NOTICE 'User already exists: kenza@outlierz.co';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'kenza@outlierz.co';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'kenza@outlierz.co', 'Outlierz Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Outlierz Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'kenza@outlierz.co', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'kenza@outlierz.co',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: kenza@outlierz.co - Outlierz Ventures';
END $$;

-- =====================================================
-- USER 6: kim@inuacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'kim@inuacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'kim@inuacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: kim@inuacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: kim@inuacapital.com';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'kim@inuacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'kim@inuacapital.com', 'Inua Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Inua Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'kim@inuacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'kim@inuacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: kim@inuacapital.com - Inua Capital';
END $$;

-- =====================================================
-- USER 7: klakhani@Invest2innovate.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'klakhani@Invest2innovate.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'klakhani@Invest2innovate.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: klakhani@Invest2innovate.com';
    ELSE
        RAISE NOTICE 'User already exists: klakhani@Invest2innovate.com';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'klakhani@Invest2innovate.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'klakhani@Invest2innovate.com', 'i2i Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'i2i Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'klakhani@Invest2innovate.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'klakhani@Invest2innovate.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: klakhani@Invest2innovate.com - i2i Ventures';
END $$;

-- =====================================================
-- USER 8: klegesi@ortusafrica.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'klegesi@ortusafrica.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'klegesi@ortusafrica.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: klegesi@ortusafrica.com';
    ELSE
        RAISE NOTICE 'User already exists: klegesi@ortusafrica.com';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'klegesi@ortusafrica.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'klegesi@ortusafrica.com', 'Ortus Africa Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Ortus Africa Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'klegesi@ortusafrica.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'klegesi@ortusafrica.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: klegesi@ortusafrica.com - Ortus Africa Capital';
END $$;

-- =====================================================
-- USER 9: lavanya@vestedworld.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'lavanya@vestedworld.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'lavanya@vestedworld.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: lavanya@vestedworld.com';
    ELSE
        RAISE NOTICE 'User already exists: lavanya@vestedworld.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'lavanya@vestedworld.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'lavanya@vestedworld.com', 'VestedWorld', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'VestedWorld',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'lavanya@vestedworld.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'lavanya@vestedworld.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: lavanya@vestedworld.com - VestedWorld';
END $$;

-- =====================================================
-- USER 10: ldavis@renewcapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ldavis@renewcapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ldavis@renewcapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: ldavis@renewcapital.com';
    ELSE
        RAISE NOTICE 'User already exists: ldavis@renewcapital.com';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'ldavis@renewcapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'ldavis@renewcapital.com', 'Renew Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Renew Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'ldavis@renewcapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ldavis@renewcapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ldavis@renewcapital.com - Renew Capital';
END $$;

-- =====================================================
-- USER 11: ldavis@renewstrategies.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ldavis@renewstrategies.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ldavis@renewstrategies.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: ldavis@renewstrategies.com';
    ELSE
        RAISE NOTICE 'User already exists: ldavis@renewstrategies.com';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'ldavis@renewstrategies.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'ldavis@renewstrategies.com', 'RENEW', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'RENEW',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'ldavis@renewstrategies.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ldavis@renewstrategies.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ldavis@renewstrategies.com - RENEW';
END $$;

-- =====================================================
-- USER 12: lelemba@africatrustgroup.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'lelemba@africatrustgroup.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'lelemba@africatrustgroup.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: lelemba@africatrustgroup.com';
    ELSE
        RAISE NOTICE 'User already exists: lelemba@africatrustgroup.com';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 'lelemba@africatrustgroup.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 'lelemba@africatrustgroup.com', 'Africa Trust Group', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Africa Trust Group',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 'lelemba@africatrustgroup.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'lelemba@africatrustgroup.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: lelemba@africatrustgroup.com - Africa Trust Group';
END $$;

-- =====================================================
-- USER 13: lidelkellytoh1989@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'lidelkellytoh1989@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'lidelkellytoh1989@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: lidelkellytoh1989@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: lidelkellytoh1989@gmail.com';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'lidelkellytoh1989@gmail.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'lidelkellytoh1989@gmail.com', 'NALDCCAM', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'NALDCCAM',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'lidelkellytoh1989@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'lidelkellytoh1989@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: lidelkellytoh1989@gmail.com - NALDCCAM';
END $$;

-- =====================================================
-- USER 14: lkamara@sahelinvest.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_14 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'lkamara@sahelinvest.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'lkamara@sahelinvest.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: lkamara@sahelinvest.com';
    ELSE
        RAISE NOTICE 'User already exists: lkamara@sahelinvest.com';
    END IF;
    
    SELECT id INTO user_id_14 FROM auth.users WHERE email = 'lkamara@sahelinvest.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_14, 'lkamara@sahelinvest.com', 'Sahelinvest', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Sahelinvest',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_14, 'lkamara@sahelinvest.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'lkamara@sahelinvest.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: lkamara@sahelinvest.com - Sahelinvest';
END $$;

-- =====================================================
-- USER 15: lkefela@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_15 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'lkefela@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'lkefela@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: lkefela@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: lkefela@gmail.com';
    END IF;
    
    SELECT id INTO user_id_15 FROM auth.users WHERE email = 'lkefela@gmail.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_15, 'lkefela@gmail.com', 'Village Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Village Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_15, 'lkefela@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'lkefela@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: lkefela@gmail.com - Village Capital';
END $$;

-- =====================================================
-- USER 16: Lisa@atgsamata.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_16 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Lisa@atgsamata.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Lisa@atgsamata.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Lisa@atgsamata.com';
    ELSE
        RAISE NOTICE 'User already exists: Lisa@atgsamata.com';
    END IF;
    
    SELECT id INTO user_id_16 FROM auth.users WHERE email = 'Lisa@atgsamata.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_16, 'Lisa@atgsamata.com', 'ATG Samata', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'ATG Samata',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_16, 'Lisa@atgsamata.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Lisa@atgsamata.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Lisa@atgsamata.com - ATG Samata';
END $$;

-- =====================================================
-- USER 17: Lmramba@gbfund.org
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_17 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Lmramba@gbfund.org') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Lmramba@gbfund.org',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Lmramba@gbfund.org';
    ELSE
        RAISE NOTICE 'User already exists: Lmramba@gbfund.org';
    END IF;
    
    SELECT id INTO user_id_17 FROM auth.users WHERE email = 'Lmramba@gbfund.org';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_17, 'Lmramba@gbfund.org', 'Grassroots Business Fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Grassroots Business Fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_17, 'Lmramba@gbfund.org', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Lmramba@gbfund.org',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Lmramba@gbfund.org - Grassroots Business Fund';
END $$;

-- =====================================================
-- USER 18: lsz@nordicimpactfunds.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_18 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'lsz@nordicimpactfunds.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'lsz@nordicimpactfunds.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: lsz@nordicimpactfunds.com';
    ELSE
        RAISE NOTICE 'User already exists: lsz@nordicimpactfunds.com';
    END IF;
    
    SELECT id INTO user_id_18 FROM auth.users WHERE email = 'lsz@nordicimpactfunds.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_18, 'lsz@nordicimpactfunds.com', 'Nordic Impact Funds', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Nordic Impact Funds',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_18, 'lsz@nordicimpactfunds.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'lsz@nordicimpactfunds.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: lsz@nordicimpactfunds.com - Nordic Impact Funds';
END $$;

-- =====================================================
-- USER 19: lthomas@samatacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_19 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'lthomas@samatacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'lthomas@samatacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: lthomas@samatacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: lthomas@samatacapital.com';
    END IF;
    
    SELECT id INTO user_id_19 FROM auth.users WHERE email = 'lthomas@samatacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_19, 'lthomas@samatacapital.com', 'Samata Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Samata Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_19, 'lthomas@samatacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'lthomas@samatacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: lthomas@samatacapital.com - Samata Capital';
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
SELECT 'All 19 users processed successfully!' as status;
