-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 15 USERS (BATCH 8)
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: o.adepoju@pearlbridgecapital.africa
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'o.adepoju@pearlbridgecapital.africa') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'o.adepoju@pearlbridgecapital.africa',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: o.adepoju@pearlbridgecapital.africa';
    ELSE
        RAISE NOTICE 'User already exists: o.adepoju@pearlbridgecapital.africa';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'o.adepoju@pearlbridgecapital.africa';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'o.adepoju@pearlbridgecapital.africa', 'PearlBridge Capital Managers Ltd', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'PearlBridge Capital Managers Ltd',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'o.adepoju@pearlbridgecapital.africa', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'o.adepoju@pearlbridgecapital.africa',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: o.adepoju@pearlbridgecapital.africa - PearlBridge Capital Managers Ltd';
END $$;

-- =====================================================
-- USER 2: oeharmon@gemicap.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'oeharmon@gemicap.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'oeharmon@gemicap.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: oeharmon@gemicap.com';
    ELSE
        RAISE NOTICE 'User already exists: oeharmon@gemicap.com';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'oeharmon@gemicap.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'oeharmon@gemicap.com', 'Gemini Capital Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Gemini Capital Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'oeharmon@gemicap.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'oeharmon@gemicap.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: oeharmon@gemicap.com - Gemini Capital Partners';
END $$;

-- =====================================================
-- USER 3: olivier.furdelle@terangacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'olivier.furdelle@terangacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'olivier.furdelle@terangacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: olivier.furdelle@terangacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: olivier.furdelle@terangacapital.com';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'olivier.furdelle@terangacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'olivier.furdelle@terangacapital.com', 'Teranga Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Teranga Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'olivier.furdelle@terangacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'olivier.furdelle@terangacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: olivier.furdelle@terangacapital.com - Teranga Capital';
END $$;

-- =====================================================
-- USER 4: p.koelbl@shequity.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'p.koelbl@shequity.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'p.koelbl@shequity.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: p.koelbl@shequity.com';
    ELSE
        RAISE NOTICE 'User already exists: p.koelbl@shequity.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'p.koelbl@shequity.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'p.koelbl@shequity.com', 'ShEquity Partners ("ShEquity")', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'ShEquity Partners ("ShEquity")',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'p.koelbl@shequity.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'p.koelbl@shequity.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: p.koelbl@shequity.com - ShEquity Partners ("ShEquity")';
END $$;

-- =====================================================
-- USER 5: patrick.mutenda@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'patrick.mutenda@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'patrick.mutenda@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: patrick.mutenda@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: patrick.mutenda@gmail.com';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'patrick.mutenda@gmail.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'patrick.mutenda@gmail.com', 'Tunahase Agri', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Tunahase Agri',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'patrick.mutenda@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'patrick.mutenda@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: patrick.mutenda@gmail.com - Tunahase Agri';
END $$;

-- =====================================================
-- USER 6: paul@agleaseco.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'paul@agleaseco.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'paul@agleaseco.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: paul@agleaseco.com';
    ELSE
        RAISE NOTICE 'User already exists: paul@agleaseco.com';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'paul@agleaseco.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'paul@agleaseco.com', 'Agricultural Leasing Company Zambia Ltd (''AgLeaseCo'')', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Agricultural Leasing Company Zambia Ltd (''AgLeaseCo'')',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'paul@agleaseco.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'paul@agleaseco.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: paul@agleaseco.com - Agricultural Leasing Company Zambia Ltd (''AgLeaseCo'')';
END $$;

-- =====================================================
-- USER 7: peter@vestedworld.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'peter@vestedworld.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'peter@vestedworld.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: peter@vestedworld.com';
    ELSE
        RAISE NOTICE 'User already exists: peter@vestedworld.com';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'peter@vestedworld.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'peter@vestedworld.com', 'VestedWorld', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'VestedWorld',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'peter@vestedworld.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'peter@vestedworld.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: peter@vestedworld.com - VestedWorld';
END $$;

-- =====================================================
-- USER 8: rekia@barkafund.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'rekia@barkafund.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'rekia@barkafund.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: rekia@barkafund.com';
    ELSE
        RAISE NOTICE 'User already exists: rekia@barkafund.com';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'rekia@barkafund.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'rekia@barkafund.com', 'Barka Fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Barka Fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'rekia@barkafund.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'rekia@barkafund.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: rekia@barkafund.com - Barka Fund';
END $$;

-- =====================================================
-- USER 9: rnyakinyua@meda.org
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'rnyakinyua@meda.org') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'rnyakinyua@meda.org',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: rnyakinyua@meda.org';
    ELSE
        RAISE NOTICE 'User already exists: rnyakinyua@meda.org';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'rnyakinyua@meda.org';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'rnyakinyua@meda.org', 'MEDA', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'MEDA',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'rnyakinyua@meda.org', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'rnyakinyua@meda.org',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: rnyakinyua@meda.org - MEDA';
END $$;

-- =====================================================
-- USER 10: roeland@iungocapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'roeland@iungocapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'roeland@iungocapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: roeland@iungocapital.com';
    ELSE
        RAISE NOTICE 'User already exists: roeland@iungocapital.com';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'roeland@iungocapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'roeland@iungocapital.com', 'iungo capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'iungo capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'roeland@iungocapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'roeland@iungocapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: roeland@iungocapital.com - iungo capital';
END $$;

-- =====================================================
-- USER 11: rtugume@practitionerscp.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_11 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'rtugume@practitionerscp.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'rtugume@practitionerscp.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: rtugume@practitionerscp.com';
    ELSE
        RAISE NOTICE 'User already exists: rtugume@practitionerscp.com';
    END IF;
    
    SELECT id INTO user_id_11 FROM auth.users WHERE email = 'rtugume@practitionerscp.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_11, 'rtugume@practitionerscp.com', 'Practitioners of Contemporary Philosophy Ltd', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Practitioners of Contemporary Philosophy Ltd',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_11, 'rtugume@practitionerscp.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'rtugume@practitionerscp.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: rtugume@practitionerscp.com - Practitioners of Contemporary Philosophy Ltd';
END $$;

-- =====================================================
-- USER 12: s.ndonga@samawaticapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_12 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 's.ndonga@samawaticapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            's.ndonga@samawaticapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: s.ndonga@samawaticapital.com';
    ELSE
        RAISE NOTICE 'User already exists: s.ndonga@samawaticapital.com';
    END IF;
    
    SELECT id INTO user_id_12 FROM auth.users WHERE email = 's.ndonga@samawaticapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_12, 's.ndonga@samawaticapital.com', 'Samawati Capital Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Samawati Capital Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_12, 's.ndonga@samawaticapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 's.ndonga@samawaticapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: s.ndonga@samawaticapital.com - Samawati Capital Partners';
END $$;

-- =====================================================
-- USER 13: sagar@firstfollowers.co
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_13 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sagar@firstfollowers.co') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'sagar@firstfollowers.co',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: sagar@firstfollowers.co';
    ELSE
        RAISE NOTICE 'User already exists: sagar@firstfollowers.co';
    END IF;
    
    SELECT id INTO user_id_13 FROM auth.users WHERE email = 'sagar@firstfollowers.co';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_13, 'sagar@firstfollowers.co', 'First Followers Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'First Followers Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_13, 'sagar@firstfollowers.co', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'sagar@firstfollowers.co',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: sagar@firstfollowers.co - First Followers Capital';
END $$;

-- =====================================================
-- USER 14: sam@mirepacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_14 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'sam@mirepacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'sam@mirepacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: sam@mirepacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: sam@mirepacapital.com';
    END IF;
    
    SELECT id INTO user_id_14 FROM auth.users WHERE email = 'sam@mirepacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_14, 'sam@mirepacapital.com', 'Mirepa Capital Ltd', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Mirepa Capital Ltd',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_14, 'sam@mirepacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'sam@mirepacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: sam@mirepacapital.com - Mirepa Capital Ltd';
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
