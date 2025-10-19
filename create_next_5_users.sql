-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 5 USERS
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: amel.saidane@betawaves.io
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'amel.saidane@betawaves.io') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'amel.saidane@betawaves.io',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: amel.saidane@betawaves.io';
    ELSE
        RAISE NOTICE 'User already exists: amel.saidane@betawaves.io';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'amel.saidane@betawaves.io';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'amel.saidane@betawaves.io', 'Betawaves', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Betawaves',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'amel.saidane@betawaves.io', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'amel.saidane@betawaves.io',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: amel.saidane@betawaves.io - Betawaves';
END $$;

-- =====================================================
-- USER 2: amanda.kabagambe@tlgcapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'amanda.kabagambe@tlgcapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'amanda.kabagambe@tlgcapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: amanda.kabagambe@tlgcapital.com';
    ELSE
        RAISE NOTICE 'User already exists: amanda.kabagambe@tlgcapital.com';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'amanda.kabagambe@tlgcapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'amanda.kabagambe@tlgcapital.com', 'GenCap Partners', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'GenCap Partners',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'amanda.kabagambe@tlgcapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'amanda.kabagambe@tlgcapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: amanda.kabagambe@tlgcapital.com - GenCap Partners';
END $$;

-- =====================================================
-- USER 3: AndiaC@gracamacheltrust.org
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'AndiaC@gracamacheltrust.org') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'AndiaC@gracamacheltrust.org',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: AndiaC@gracamacheltrust.org';
    ELSE
        RAISE NOTICE 'User already exists: AndiaC@gracamacheltrust.org';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'AndiaC@gracamacheltrust.org';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'AndiaC@gracamacheltrust.org', 'Graca Machel Trust', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Graca Machel Trust',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'AndiaC@gracamacheltrust.org', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'AndiaC@gracamacheltrust.org',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: AndiaC@gracamacheltrust.org - Graca Machel Trust';
END $$;

-- =====================================================
-- USER 4: andylower@adapcapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'andylower@adapcapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'andylower@adapcapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: andylower@adapcapital.com';
    ELSE
        RAISE NOTICE 'User already exists: andylower@adapcapital.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'andylower@adapcapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'andylower@adapcapital.com', 'ADAP Capital LLC', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'ADAP Capital LLC',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'andylower@adapcapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'andylower@adapcapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: andylower@adapcapital.com - ADAP Capital LLC';
END $$;

-- =====================================================
-- USER 5: angela@angazacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'angela@angazacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'angela@angazacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: angela@angazacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: angela@angazacapital.com';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'angela@angazacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'angela@angazacapital.com', 'Angaza Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Angaza Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'angela@angazacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'angela@angazacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: angela@angazacapital.com - Angaza Capital';
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
SELECT 'All 5 users processed successfully!' as status;
