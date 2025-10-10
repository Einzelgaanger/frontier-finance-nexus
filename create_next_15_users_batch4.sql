-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 15 USERS (BATCH 4)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: florian.ibrahim@responsability.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'florian.ibrahim@responsability.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'florian.ibrahim@responsability.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: florian.ibrahim@responsability.com';
    ELSE
        RAISE NOTICE 'User already exists: florian.ibrahim@responsability.com';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'florian.ibrahim@responsability.com';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'florian.ibrahim@responsability.com', 'rA', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'rA',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'florian.ibrahim@responsability.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'florian.ibrahim@responsability.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: florian.ibrahim@responsability.com - rA';
END $$;

-- =====================================================
-- USER 2: fngenyi@sycomore-venture.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'fngenyi@sycomore-venture.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'fngenyi@sycomore-venture.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: fngenyi@sycomore-venture.com';
    ELSE
        RAISE NOTICE 'User already exists: fngenyi@sycomore-venture.com';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'fngenyi@sycomore-venture.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'fngenyi@sycomore-venture.com', 'SYCOMORE-VENTURE', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'SYCOMORE-VENTURE',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'fngenyi@sycomore-venture.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'fngenyi@sycomore-venture.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: fngenyi@sycomore-venture.com - SYCOMORE-VENTURE';
END $$;

-- =====================================================
-- USER 3: franziska@unconventional.capital
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'franziska@unconventional.capital') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'franziska@unconventional.capital',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: franziska@unconventional.capital';
    ELSE
        RAISE NOTICE 'User already exists: franziska@unconventional.capital';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'franziska@unconventional.capital';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'franziska@unconventional.capital', 'Uncap', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Uncap',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'franziska@unconventional.capital', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'franziska@unconventional.capital',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: franziska@unconventional.capital - Uncap';
END $$;

-- =====================================================
-- USER 4: geraldine@darenaventures.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'geraldine@darenaventures.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'geraldine@darenaventures.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: geraldine@darenaventures.com';
    ELSE
        RAISE NOTICE 'User already exists: geraldine@darenaventures.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'geraldine@darenaventures.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'geraldine@darenaventures.com', 'Darena Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Darena Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'geraldine@darenaventures.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'geraldine@darenaventures.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: geraldine@darenaventures.com - Darena Ventures';
END $$;

-- =====================================================
-- USER 5: h.vincent-genod@ietp.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'h.vincent-genod@ietp.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'h.vincent-genod@ietp.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: h.vincent-genod@ietp.com';
    ELSE
        RAISE NOTICE 'User already exists: h.vincent-genod@ietp.com';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'h.vincent-genod@ietp.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'h.vincent-genod@ietp.com', 'I&P', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'I&P',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'h.vincent-genod@ietp.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'h.vincent-genod@ietp.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: h.vincent-genod@ietp.com - I&P';
END $$;

-- =====================================================
-- USER 6: ha@cra.fund
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ha@cra.fund') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ha@cra.fund',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: ha@cra.fund';
    ELSE
        RAISE NOTICE 'User already exists: ha@cra.fund';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'ha@cra.fund';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'ha@cra.fund', 'CRAF', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'CRAF',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'ha@cra.fund', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ha@cra.fund',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ha@cra.fund - CRAF';
END $$;

-- =====================================================
-- USER 7: hema@five35.ventures
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'hema@five35.ventures') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'hema@five35.ventures',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: hema@five35.ventures';
    ELSE
        RAISE NOTICE 'User already exists: hema@five35.ventures';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'hema@five35.ventures';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'hema@five35.ventures', 'Five35 Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Five35 Ventures',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'hema@five35.ventures', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'hema@five35.ventures',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: hema@five35.ventures - Five35 Ventures';
END $$;

-- =====================================================
-- USER 8: Hilina@kazanafund.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Hilina@kazanafund.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Hilina@kazanafund.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Hilina@kazanafund.com';
    ELSE
        RAISE NOTICE 'User already exists: Hilina@kazanafund.com';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'Hilina@kazanafund.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'Hilina@kazanafund.com', 'Kazana fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Kazana fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'Hilina@kazanafund.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Hilina@kazanafund.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Hilina@kazanafund.com - Kazana fund';
END $$;

-- =====================================================
-- USER 9: i.sidibe@comoecapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'i.sidibe@comoecapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'i.sidibe@comoecapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: i.sidibe@comoecapital.com';
    ELSE
        RAISE NOTICE 'User already exists: i.sidibe@comoecapital.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'i.sidibe@comoecapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'i.sidibe@comoecapital.com', 'Comoé Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Comoé Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'i.sidibe@comoecapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'i.sidibe@comoecapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: i.sidibe@comoecapital.com - Comoé Capital';
END $$;

-- =====================================================
-- USER 10: idris.bello@loftyincltd.biz
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'idris.bello@loftyincltd.biz') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'idris.bello@loftyincltd.biz',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: idris.bello@loftyincltd.biz';
    ELSE
        RAISE NOTICE 'User already exists: idris.bello@loftyincltd.biz';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'idris.bello@loftyincltd.biz';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'idris.bello@loftyincltd.biz', 'LoftyInc Capital Management', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'LoftyInc Capital Management',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'idris.bello@loftyincltd.biz', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'idris.bello@loftyincltd.biz',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: idris.bello@loftyincltd.biz - LoftyInc Capital Management';
END $$;

-- =====================================================
-- USER 11: idris@loftyinc.vc
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'idris@loftyinc.vc') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'idris@loftyinc.vc',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: idris@loftyinc.vc';
    ELSE
        RAISE NOTICE 'User already exists: idris@loftyinc.vc';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'idris@loftyinc.vc';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'idris@loftyinc.vc', 'LoftyInc Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'LoftyInc Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'idris@loftyinc.vc', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'idris@loftyinc.vc',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: idris@loftyinc.vc - LoftyInc Capital';
END $$;

-- =====================================================
-- USER 12: imare@startupbugu.net
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'imare@startupbugu.net') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'imare@startupbugu.net',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: imare@startupbugu.net';
    ELSE
        RAISE NOTICE 'User already exists: imare@startupbugu.net';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 'imare@startupbugu.net';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 'imare@startupbugu.net', 'Startup''BUGU', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Startup''BUGU',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 'imare@startupbugu.net', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'imare@startupbugu.net',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: imare@startupbugu.net - Startup''BUGU';
END $$;

-- =====================================================
-- USER 13: imandela@shonacapital.co
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'imandela@shonacapital.co') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'imandela@shonacapital.co',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: imandela@shonacapital.co';
    ELSE
        RAISE NOTICE 'User already exists: imandela@shonacapital.co';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'imandela@shonacapital.co';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'imandela@shonacapital.co', 'SHONA Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'SHONA Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'imandela@shonacapital.co', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'imandela@shonacapital.co',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: imandela@shonacapital.co - SHONA Capital';
END $$;

-- =====================================================
-- USER 14: innocent@anzaentrepreneurs.co.tz
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_14 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'innocent@anzaentrepreneurs.co.tz') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'innocent@anzaentrepreneurs.co.tz',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: innocent@anzaentrepreneurs.co.tz';
    ELSE
        RAISE NOTICE 'User already exists: innocent@anzaentrepreneurs.co.tz';
    END IF;
    
    SELECT id INTO user_id_14 FROM auth.users WHERE email = 'innocent@anzaentrepreneurs.co.tz';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_14, 'innocent@anzaentrepreneurs.co.tz', 'Anza Growth Fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Anza Growth Fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_14, 'innocent@anzaentrepreneurs.co.tz', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'innocent@anzaentrepreneurs.co.tz',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: innocent@anzaentrepreneurs.co.tz - Anza Growth Fund';
END $$;

-- =====================================================
-- USER 15: Invest@blackstoneafrica.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_15 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'Invest@blackstoneafrica.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'Invest@blackstoneafrica.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: Invest@blackstoneafrica.com';
    ELSE
        RAISE NOTICE 'User already exists: Invest@blackstoneafrica.com';
    END IF;
    
    SELECT id INTO user_id_15 FROM auth.users WHERE email = 'Invest@blackstoneafrica.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_15, 'Invest@blackstoneafrica.com', 'Blackstone Africa', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Blackstone Africa',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_15, 'Invest@blackstoneafrica.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'Invest@blackstoneafrica.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: Invest@blackstoneafrica.com - Blackstone Africa';
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
SELECT 'All 15 users processed successfully!' as status;
