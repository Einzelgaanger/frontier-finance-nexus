-- =====================================================
-- SAFE USER CREATION SCRIPT - 10 USERS
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: a.annan@impcapadv.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'a.annan@impcapadv.com') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'a.annan@impcapadv.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: a.annan@impcapadv.com';
    ELSE
        RAISE NOTICE 'User already exists: a.annan@impcapadv.com';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'a.annan@impcapadv.com';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'a.annan@impcapadv.com', 'Impact Capital Advisors', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Impact Capital Advisors',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'a.annan@impcapadv.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'a.annan@impcapadv.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: a.annan@impcapadv.com - Impact Capital Advisors';
END $$;

-- =====================================================
-- USER 2: a.fofana@comoecapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'a.fofana@comoecapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'a.fofana@comoecapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: a.fofana@comoecapital.com';
    ELSE
        RAISE NOTICE 'User already exists: a.fofana@comoecapital.com';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'a.fofana@comoecapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'a.fofana@comoecapital.com', 'COMOE CAPITAL', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'COMOE CAPITAL',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'a.fofana@comoecapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'a.fofana@comoecapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: a.fofana@comoecapital.com - COMOE CAPITAL';
END $$;

-- =====================================================
-- USER 3: a@a.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'a@a.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'a@a.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: a@a.com';
    ELSE
        RAISE NOTICE 'User already exists: a@a.com';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'a@a.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'a@a.com', 'sss', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'sss',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'a@a.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'a@a.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: a@a.com - sss';
END $$;

-- =====================================================
-- USER 4: aarthi.ramasubramanian@opesfund.eu
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'aarthi.ramasubramanian@opesfund.eu') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'aarthi.ramasubramanian@opesfund.eu',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: aarthi.ramasubramanian@opesfund.eu';
    ELSE
        RAISE NOTICE 'User already exists: aarthi.ramasubramanian@opesfund.eu';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'aarthi.ramasubramanian@opesfund.eu';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'aarthi.ramasubramanian@opesfund.eu', 'Opes-LCEF', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Opes-LCEF',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'aarthi.ramasubramanian@opesfund.eu', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'aarthi.ramasubramanian@opesfund.eu',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: aarthi.ramasubramanian@opesfund.eu - Opes-LCEF';
END $$;

-- =====================================================
-- USER 5: agnes@firstcircle.capital
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'agnes@firstcircle.capital') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'agnes@firstcircle.capital',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: agnes@firstcircle.capital';
    ELSE
        RAISE NOTICE 'User already exists: agnes@firstcircle.capital';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'agnes@firstcircle.capital';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'agnes@firstcircle.capital', 'First Circle Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'First Circle Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'agnes@firstcircle.capital', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'agnes@firstcircle.capital',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: agnes@firstcircle.capital - First Circle Capital';
END $$;

-- =====================================================
-- USER 6: ali.alsuhail@kapita.iq
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ali.alsuhail@kapita.iq') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ali.alsuhail@kapita.iq',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: ali.alsuhail@kapita.iq';
    ELSE
        RAISE NOTICE 'User already exists: ali.alsuhail@kapita.iq';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'ali.alsuhail@kapita.iq';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'ali.alsuhail@kapita.iq', 'Kapita', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Kapita',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'ali.alsuhail@kapita.iq', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ali.alsuhail@kapita.iq',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ali.alsuhail@kapita.iq - Kapita';
END $$;

-- =====================================================
-- USER 7: allert@mmfm-ltd.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'allert@mmfm-ltd.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'allert@mmfm-ltd.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: allert@mmfm-ltd.com';
    ELSE
        RAISE NOTICE 'User already exists: allert@mmfm-ltd.com';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'allert@mmfm-ltd.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'allert@mmfm-ltd.com', 'SME Impact Fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'SME Impact Fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'allert@mmfm-ltd.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'allert@mmfm-ltd.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: allert@mmfm-ltd.com - SME Impact Fund';
END $$;

-- =====================================================
-- USER 8: alyune@loftyinc.vc
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'alyune@loftyinc.vc') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'alyune@loftyinc.vc',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: alyune@loftyinc.vc';
    ELSE
        RAISE NOTICE 'User already exists: alyune@loftyinc.vc';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'alyune@loftyinc.vc';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'alyune@loftyinc.vc', 'LoftyInc Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'LoftyInc Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'alyune@loftyinc.vc', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'alyune@loftyinc.vc',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: alyune@loftyinc.vc - LoftyInc Capital';
END $$;

-- =====================================================
-- USER 9: amaka@weavcapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'amaka@weavcapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'amaka@weavcapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: amaka@weavcapital.com';
    ELSE
        RAISE NOTICE 'User already exists: amaka@weavcapital.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'amaka@weavcapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'amaka@weavcapital.com', 'WEAV Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'WEAV Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'amaka@weavcapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'amaka@weavcapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: amaka@weavcapital.com - WEAV Capital';
END $$;


-- =====================================================
-- USER 10: ambar@ibtikarfund.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_10 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ambar@ibtikarfund.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ambar@ibtikarfund.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: ambar@ibtikarfund.com';
    ELSE
        RAISE NOTICE 'User already exists: ambar@ibtikarfund.com';
    END IF;
    
    SELECT id INTO user_id_10 FROM auth.users WHERE email = 'ambar@ibtikarfund.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_10, 'ambar@ibtikarfund.com', 'Ibtikar Fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Ibtikar Fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_10, 'ambar@ibtikarfund.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ambar@ibtikarfund.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ambar@ibtikarfund.com - Ibtikar Fund';
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
SELECT 'All 10 users processed successfully!' as status;
