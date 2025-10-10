-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 18 USERS (BATCH 5)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: invteam@altreecapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'invteam@altreecapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'invteam@altreecapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: invteam@altreecapital.com';
    ELSE
        RAISE NOTICE 'User already exists: invteam@altreecapital.com';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'invteam@altreecapital.com';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'invteam@altreecapital.com', 'Altree Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Altree Capital',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'invteam@altreecapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'invteam@altreecapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: invteam@altreecapital.com - Altree Capital';
END $$;

-- =====================================================
-- USER 2: is@neper.africa
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'is@neper.africa') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'is@neper.africa',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: is@neper.africa';
    ELSE
        RAISE NOTICE 'User already exists: is@neper.africa';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'is@neper.africa';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'is@neper.africa', 'NEPER Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'NEPER Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'is@neper.africa', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'is@neper.africa',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: is@neper.africa - NEPER Ventures';
END $$;

-- =====================================================
-- USER 3: J.namoma@nithio.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'J.namoma@nithio.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'J.namoma@nithio.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: J.namoma@nithio.com';
    ELSE
        RAISE NOTICE 'User already exists: J.namoma@nithio.com';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'J.namoma@nithio.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'J.namoma@nithio.com', 'Nithio', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Nithio',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'J.namoma@nithio.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'J.namoma@nithio.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: J.namoma@nithio.com - Nithio';
END $$;

-- =====================================================
-- USER 4: jaap-jan@truvalu-group.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jaap-jan@truvalu-group.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'jaap-jan@truvalu-group.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: jaap-jan@truvalu-group.com';
    ELSE
        RAISE NOTICE 'User already exists: jaap-jan@truvalu-group.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'jaap-jan@truvalu-group.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'jaap-jan@truvalu-group.com', 'Truvalu', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Truvalu',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'jaap-jan@truvalu-group.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'jaap-jan@truvalu-group.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: jaap-jan@truvalu-group.com - Truvalu';
END $$;

-- =====================================================
-- USER 5: jacobus@growthcap.co.za
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jacobus@growthcap.co.za') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'jacobus@growthcap.co.za',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: jacobus@growthcap.co.za';
    ELSE
        RAISE NOTICE 'User already exists: jacobus@growthcap.co.za';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'jacobus@growthcap.co.za';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'jacobus@growthcap.co.za', 'Creative Growth Capital ("GrowthCap")', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Creative Growth Capital ("GrowthCap")',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'jacobus@growthcap.co.za', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'jacobus@growthcap.co.za',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: jacobus@growthcap.co.za - Creative Growth Capital ("GrowthCap")';
END $$;

-- =====================================================
-- USER 6: janice@aisikicapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'janice@aisikicapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'janice@aisikicapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: janice@aisikicapital.com';
    ELSE
        RAISE NOTICE 'User already exists: janice@aisikicapital.com';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'janice@aisikicapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'janice@aisikicapital.com', 'Aisiki Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Aisiki Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'janice@aisikicapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'janice@aisikicapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: janice@aisikicapital.com - Aisiki Capital';
END $$;

-- =====================================================
-- USER 7: jason@viktoria.co.ke
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jason@viktoria.co.ke') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'jason@viktoria.co.ke',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: jason@viktoria.co.ke';
    ELSE
        RAISE NOTICE 'User already exists: jason@viktoria.co.ke';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'jason@viktoria.co.ke';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'jason@viktoria.co.ke', 'ViKtoria Business Angels Network', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'ViKtoria Business Angels Network',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'jason@viktoria.co.ke', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'jason@viktoria.co.ke',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: jason@viktoria.co.ke - ViKtoria Business Angels Network';
END $$;

-- =====================================================
-- USER 8: jchamberlain@altreecapital.om
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jchamberlain@altreecapital.om') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'jchamberlain@altreecapital.om',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: jchamberlain@altreecapital.om';
    ELSE
        RAISE NOTICE 'User already exists: jchamberlain@altreecapital.om';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'jchamberlain@altreecapital.om';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'jchamberlain@altreecapital.om', 'Altree Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Altree Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'jchamberlain@altreecapital.om', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'jchamberlain@altreecapital.om',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: jchamberlain@altreecapital.om - Altree Capital';
END $$;

-- =====================================================
-- USER 9: jenny@amamventures.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jenny@amamventures.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'jenny@amamventures.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: jenny@amamventures.com';
    ELSE
        RAISE NOTICE 'User already exists: jenny@amamventures.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'jenny@amamventures.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'jenny@amamventures.com', 'Amam Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Amam Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'jenny@amamventures.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'jenny@amamventures.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: jenny@amamventures.com - Amam Ventures';
END $$;

-- =====================================================
-- USER 10: jesse@takeofffund.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jesse@takeofffund.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'jesse@takeofffund.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: jesse@takeofffund.com';
    ELSE
        RAISE NOTICE 'User already exists: jesse@takeofffund.com';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'jesse@takeofffund.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'jesse@takeofffund.com', 'The Takeoff Fund (formerly Abaarso Ventures)', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'The Takeoff Fund (formerly Abaarso Ventures)',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'jesse@takeofffund.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'jesse@takeofffund.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: jesse@takeofffund.com - The Takeoff Fund (formerly Abaarso Ventures)';
END $$;

-- =====================================================
-- USER 11: jim@untapped-global.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jim@untapped-global.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'jim@untapped-global.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: jim@untapped-global.com';
    ELSE
        RAISE NOTICE 'User already exists: jim@untapped-global.com';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'jim@untapped-global.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'jim@untapped-global.com', 'Untapped Global', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Untapped Global',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'jim@untapped-global.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'jim@untapped-global.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: jim@untapped-global.com - Untapped Global';
END $$;

-- =====================================================
-- USER 12: josh@balloonventures.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'josh@balloonventures.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'josh@balloonventures.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: josh@balloonventures.com';
    ELSE
        RAISE NOTICE 'User already exists: josh@balloonventures.com';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 'josh@balloonventures.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 'josh@balloonventures.com', 'Balloon Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Balloon Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 'josh@balloonventures.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'josh@balloonventures.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: josh@balloonventures.com - Balloon Ventures';
END $$;

-- =====================================================
-- USER 13: josh@holocene.africa
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'josh@holocene.africa') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'josh@holocene.africa',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: josh@holocene.africa';
    ELSE
        RAISE NOTICE 'User already exists: josh@holocene.africa';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'josh@holocene.africa';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'josh@holocene.africa', 'Holocene', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Holocene',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'josh@holocene.africa', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'josh@holocene.africa',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: josh@holocene.africa - Holocene';
END $$;

-- =====================================================
-- USER 14: julia@lineacap.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_14 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'julia@lineacap.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'julia@lineacap.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: julia@lineacap.com';
    ELSE
        RAISE NOTICE 'User already exists: julia@lineacap.com';
    END IF;
    
    SELECT id INTO user_id_14 FROM auth.users WHERE email = 'julia@lineacap.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_14, 'julia@lineacap.com', 'Linea Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Linea Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_14, 'julia@lineacap.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'julia@lineacap.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: julia@lineacap.com - Linea Capital';
END $$;

-- =====================================================
-- USER 15: july.andraous@jambaar-capital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_15 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'july.andraous@jambaar-capital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'july.andraous@jambaar-capital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: july.andraous@jambaar-capital.com';
    ELSE
        RAISE NOTICE 'User already exists: july.andraous@jambaar-capital.com';
    END IF;
    
    SELECT id INTO user_id_15 FROM auth.users WHERE email = 'july.andraous@jambaar-capital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_15, 'july.andraous@jambaar-capital.com', 'Jambaar Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Jambaar Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_15, 'july.andraous@jambaar-capital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'july.andraous@jambaar-capital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: july.andraous@jambaar-capital.com - Jambaar Capital';
END $$;

-- =====================================================
-- USER 16: jzongo@sinergiburkina.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_16 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'jzongo@sinergiburkina.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'jzongo@sinergiburkina.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: jzongo@sinergiburkina.com';
    ELSE
        RAISE NOTICE 'User already exists: jzongo@sinergiburkina.com';
    END IF;
    
    SELECT id INTO user_id_16 FROM auth.users WHERE email = 'jzongo@sinergiburkina.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_16, 'jzongo@sinergiburkina.com', 'Sinergi Burkina', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Sinergi Burkina',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_16, 'jzongo@sinergiburkina.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'jzongo@sinergiburkina.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: jzongo@sinergiburkina.com - Sinergi Burkina';
END $$;

-- =====================================================
-- USER 17: k.owusu-sarfo@wangaracapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_17 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'k.owusu-sarfo@wangaracapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'k.owusu-sarfo@wangaracapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: k.owusu-sarfo@wangaracapital.com';
    ELSE
        RAISE NOTICE 'User already exists: k.owusu-sarfo@wangaracapital.com';
    END IF;
    
    SELECT id INTO user_id_17 FROM auth.users WHERE email = 'k.owusu-sarfo@wangaracapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_17, 'k.owusu-sarfo@wangaracapital.com', 'Wangara Green Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Wangara Green Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_17, 'k.owusu-sarfo@wangaracapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'k.owusu-sarfo@wangaracapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: k.owusu-sarfo@wangaracapital.com - Wangara Green Ventures';
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
SELECT 'All 17 users processed successfully!' as status;
