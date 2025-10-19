-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 20 USERS (BATCH 9)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: teluwo@fbx.ventures
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'teluwo@fbx.ventures') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'teluwo@fbx.ventures',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: teluwo@fbx.ventures';
    ELSE
        RAISE NOTICE 'User already exists: teluwo@fbx.ventures';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'teluwo@fbx.ventures';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'teluwo@fbx.ventures', 'FbX Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'FbX Ventures',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'teluwo@fbx.ventures', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'teluwo@fbx.ventures',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: teluwo@fbx.ventures - FbX Ventures';
END $$;

-- =====================================================
-- USER 2: thandeka@digitalafricaventures.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'thandeka@digitalafricaventures.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'thandeka@digitalafricaventures.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: thandeka@digitalafricaventures.com';
    ELSE
        RAISE NOTICE 'User already exists: thandeka@digitalafricaventures.com';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'thandeka@digitalafricaventures.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'thandeka@digitalafricaventures.com', 'Digital Africa Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Digital Africa Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'thandeka@digitalafricaventures.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'thandeka@digitalafricaventures.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: thandeka@digitalafricaventures.com - Digital Africa Ventures';
END $$;

-- =====================================================
-- USER 3: tna@kukulacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'tna@kukulacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'tna@kukulacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: tna@kukulacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: tna@kukulacapital.com';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'tna@kukulacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'tna@kukulacapital.com', 'Kukula capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Kukula capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'tna@kukulacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'tna@kukulacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: tna@kukulacapital.com - Kukula capital';
END $$;

-- =====================================================
-- USER 4: tony@kinyungu.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'tony@kinyungu.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'tony@kinyungu.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: tony@kinyungu.com';
    ELSE
        RAISE NOTICE 'User already exists: tony@kinyungu.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'tony@kinyungu.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'tony@kinyungu.com', 'Kinyungu Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Kinyungu Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'tony@kinyungu.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'tony@kinyungu.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: tony@kinyungu.com - Kinyungu Ventures';
END $$;

-- =====================================================
-- USER 5: toukam@persistent.energy
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'toukam@persistent.energy') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'toukam@persistent.energy',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: toukam@persistent.energy';
    ELSE
        RAISE NOTICE 'User already exists: toukam@persistent.energy';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'toukam@persistent.energy';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'toukam@persistent.energy', 'Persistent Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Persistent Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'toukam@persistent.energy', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'toukam@persistent.energy',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: toukam@persistent.energy - Persistent Capital';
END $$;

-- =====================================================
-- USER 6: v.tchatchueng@fakocapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'v.tchatchueng@fakocapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'v.tchatchueng@fakocapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: v.tchatchueng@fakocapital.com';
    ELSE
        RAISE NOTICE 'User already exists: v.tchatchueng@fakocapital.com';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'v.tchatchueng@fakocapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'v.tchatchueng@fakocapital.com', 'FAKO CAPITAL INVESTMENTS', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'FAKO CAPITAL INVESTMENTS',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'v.tchatchueng@fakocapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'v.tchatchueng@fakocapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: v.tchatchueng@fakocapital.com - FAKO CAPITAL INVESTMENTS';
END $$;

-- =====================================================
-- USER 7: veronique@adopes.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'veronique@adopes.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'veronique@adopes.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: veronique@adopes.com';
    ELSE
        RAISE NOTICE 'User already exists: veronique@adopes.com';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'veronique@adopes.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'veronique@adopes.com', 'adOpes', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'adOpes',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'veronique@adopes.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'veronique@adopes.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: veronique@adopes.com - adOpes';
END $$;

-- =====================================================
-- USER 8: vfraser@jengacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'vfraser@jengacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'vfraser@jengacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: vfraser@jengacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: vfraser@jengacapital.com';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'vfraser@jengacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'vfraser@jengacapital.com', 'Jenga Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Jenga Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'vfraser@jengacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'vfraser@jengacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: vfraser@jengacapital.com - Jenga Capital';
END $$;

-- =====================================================
-- USER 9: victor.ndiege@kcv.co.ke
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'victor.ndiege@kcv.co.ke') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'victor.ndiege@kcv.co.ke',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: victor.ndiege@kcv.co.ke';
    ELSE
        RAISE NOTICE 'User already exists: victor.ndiege@kcv.co.ke';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'victor.ndiege@kcv.co.ke';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'victor.ndiege@kcv.co.ke', 'Kenya Climate Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Kenya Climate Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'victor.ndiege@kcv.co.ke', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'victor.ndiege@kcv.co.ke',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: victor.ndiege@kcv.co.ke - Kenya Climate Ventures';
END $$;

-- =====================================================
-- USER 10: victoria@gc.fund
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'victoria@gc.fund') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'victoria@gc.fund',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: victoria@gc.fund';
    ELSE
        RAISE NOTICE 'User already exists: victoria@gc.fund';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'victoria@gc.fund';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'victoria@gc.fund', 'CcHUB Growth Capital Limited', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'CcHUB Growth Capital Limited',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'victoria@gc.fund', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'victoria@gc.fund',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: victoria@gc.fund - CcHUB Growth Capital Limited';
END $$;

-- =====================================================
-- USER 11: vkiyingi@businesspartners.co.ug
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'vkiyingi@businesspartners.co.ug') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'vkiyingi@businesspartners.co.ug',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: vkiyingi@businesspartners.co.ug';
    ELSE
        RAISE NOTICE 'User already exists: vkiyingi@businesspartners.co.ug';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'vkiyingi@businesspartners.co.ug';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'vkiyingi@businesspartners.co.ug', 'Business Partners International', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Business Partners International',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'vkiyingi@businesspartners.co.ug', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'vkiyingi@businesspartners.co.ug',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: vkiyingi@businesspartners.co.ug - Business Partners International';
END $$;

-- =====================================================
-- USER 12: Wakiuru@hevafund.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Wakiuru@hevafund.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Wakiuru@hevafund.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Wakiuru@hevafund.com';
    ELSE
        RAISE NOTICE 'User already exists: Wakiuru@hevafund.com';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 'Wakiuru@hevafund.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 'Wakiuru@hevafund.com', 'HEVA Fund LLP', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'HEVA Fund LLP',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 'Wakiuru@hevafund.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Wakiuru@hevafund.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Wakiuru@hevafund.com - HEVA Fund LLP';
END $$;

-- =====================================================
-- USER 13: wiem.abdeljaouad@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'wiem.abdeljaouad@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'wiem.abdeljaouad@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: wiem.abdeljaouad@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: wiem.abdeljaouad@gmail.com';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'wiem.abdeljaouad@gmail.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'wiem.abdeljaouad@gmail.com', 'Actawa', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Actawa',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'wiem.abdeljaouad@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'wiem.abdeljaouad@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: wiem.abdeljaouad@gmail.com - Actawa';
END $$;

-- =====================================================
-- USER 14: wiem@actawa.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_14 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'wiem@actawa.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'wiem@actawa.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: wiem@actawa.com';
    ELSE
        RAISE NOTICE 'User already exists: wiem@actawa.com';
    END IF;
    
    SELECT id INTO user_id_14 FROM auth.users WHERE email = 'wiem@actawa.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_14, 'wiem@actawa.com', 'Actawa', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Actawa',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_14, 'wiem@actawa.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'wiem@actawa.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: wiem@actawa.com - Actawa';
END $$;

-- =====================================================
-- USER 15: wilfred@villgroafrica.org
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_15 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'wilfred@villgroafrica.org') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'wilfred@villgroafrica.org',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: wilfred@villgroafrica.org';
    ELSE
        RAISE NOTICE 'User already exists: wilfred@villgroafrica.org';
    END IF;
    
    SELECT id INTO user_id_15 FROM auth.users WHERE email = 'wilfred@villgroafrica.org';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_15, 'wilfred@villgroafrica.org', 'Villgro Africa', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Villgro Africa',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_15, 'wilfred@villgroafrica.org', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'wilfred@villgroafrica.org',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: wilfred@villgroafrica.org - Villgro Africa';
END $$;

-- =====================================================
-- USER 16: william.prothais@uberiscapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_16 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'william.prothais@uberiscapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'william.prothais@uberiscapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: william.prothais@uberiscapital.com';
    ELSE
        RAISE NOTICE 'User already exists: william.prothais@uberiscapital.com';
    END IF;
    
    SELECT id INTO user_id_16 FROM auth.users WHERE email = 'william.prothais@uberiscapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_16, 'william.prothais@uberiscapital.com', 'Uberis', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Uberis',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_16, 'william.prothais@uberiscapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'william.prothais@uberiscapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: william.prothais@uberiscapital.com - Uberis';
END $$;

-- =====================================================
-- USER 17: yvonne.sahara@saharaimpactventures.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_17 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'yvonne.sahara@saharaimpactventures.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'yvonne.sahara@saharaimpactventures.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: yvonne.sahara@saharaimpactventures.com';
    ELSE
        RAISE NOTICE 'User already exists: yvonne.sahara@saharaimpactventures.com';
    END IF;
    
    SELECT id INTO user_id_17 FROM auth.users WHERE email = 'yvonne.sahara@saharaimpactventures.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_17, 'yvonne.sahara@saharaimpactventures.com', 'Sahara Impact Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Sahara Impact Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_17, 'yvonne.sahara@saharaimpactventures.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'yvonne.sahara@saharaimpactventures.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: yvonne.sahara@saharaimpactventures.com - Sahara Impact Ventures';
END $$;

-- =====================================================
-- USER 18: yvonne@womencapital.co
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_18 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'yvonne@womencapital.co') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'yvonne@womencapital.co',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: yvonne@womencapital.co';
    ELSE
        RAISE NOTICE 'User already exists: yvonne@womencapital.co';
    END IF;
    
    SELECT id INTO user_id_18 FROM auth.users WHERE email = 'yvonne@womencapital.co';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_18, 'yvonne@womencapital.co', 'wCap Limited', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'wCap Limited',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_18, 'yvonne@womencapital.co', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'yvonne@womencapital.co',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: yvonne@womencapital.co - wCap Limited';
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
SELECT 'All 18 users processed successfully!' as status;
