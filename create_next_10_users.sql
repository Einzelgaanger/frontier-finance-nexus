-- =====================================================
-- SAFE USER CREATION SCRIPT - NEXT 10 USERS
-- Checks for existing users before creating
-- Default password: @ESCPNetwork2025#
-- All users start as 'viewer' role
-- =====================================================

-- Check current state
SELECT 'Current users before creation:' as status, COUNT(*) as count FROM auth.users;

-- =====================================================
-- USER 1: ani@mostfund.vc
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_1 UUID;
BEGIN
    -- Check if user already exists
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ani@mostfund.vc') INTO user_exists;
    
    IF NOT user_exists THEN
        -- Create new user
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ani@mostfund.vc',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Created new user: ani@mostfund.vc';
    ELSE
        RAISE NOTICE 'User already exists: ani@mostfund.vc';
    END IF;
    
    -- Get user ID and create/update profile and role
    SELECT id INTO user_id_1 FROM auth.users WHERE email = 'ani@mostfund.vc';
    
    -- Upsert profile
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_1, 'ani@mostfund.vc', 'MOST Ventures', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'MOST Ventures',
        updated_at = NOW();
    
    -- Upsert user role
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_1, 'ani@mostfund.vc', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ani@mostfund.vc',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ani@mostfund.vc - MOST Ventures';
END $$;

-- =====================================================
-- USER 2: anne@sayuni.capital
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_2 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'anne@sayuni.capital') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'anne@sayuni.capital',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: anne@sayuni.capital';
    ELSE
        RAISE NOTICE 'User already exists: anne@sayuni.capital';
    END IF;
    
    SELECT id INTO user_id_2 FROM auth.users WHERE email = 'anne@sayuni.capital';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_2, 'anne@sayuni.capital', 'Sayuni Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Sayuni Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_2, 'anne@sayuni.capital', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'anne@sayuni.capital',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: anne@sayuni.capital - Sayuni Capital';
END $$;

-- =====================================================
-- USER 3: annan.anthony@gmail.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_3 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'annan.anthony@gmail.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'annan.anthony@gmail.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: annan.anthony@gmail.com';
    ELSE
        RAISE NOTICE 'User already exists: annan.anthony@gmail.com';
    END IF;
    
    SELECT id INTO user_id_3 FROM auth.users WHERE email = 'annan.anthony@gmail.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_3, 'annan.anthony@gmail.com', 'Impact Capital Advisors', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Impact Capital Advisors',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_3, 'annan.anthony@gmail.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'annan.anthony@gmail.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: annan.anthony@gmail.com - Impact Capital Advisors';
END $$;

-- =====================================================
-- USER 4: aor@aruwacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_4 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'aor@aruwacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'aor@aruwacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: aor@aruwacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: aor@aruwacapital.com';
    END IF;
    
    SELECT id INTO user_id_4 FROM auth.users WHERE email = 'aor@aruwacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_4, 'aor@aruwacapital.com', 'Aruwa Capital Management', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Aruwa Capital Management',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_4, 'aor@aruwacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'aor@aruwacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: aor@aruwacapital.com - Aruwa Capital Management';
END $$;

-- =====================================================
-- USER 5: arthi.ramasubramanian@opesfund.eu
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_5 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'arthi.ramasubramanian@opesfund.eu') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'arthi.ramasubramanian@opesfund.eu',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: arthi.ramasubramanian@opesfund.eu';
    ELSE
        RAISE NOTICE 'User already exists: arthi.ramasubramanian@opesfund.eu';
    END IF;
    
    SELECT id INTO user_id_5 FROM auth.users WHERE email = 'arthi.ramasubramanian@opesfund.eu';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_5, 'arthi.ramasubramanian@opesfund.eu', 'Opes-Lcef Fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Opes-Lcef Fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_5, 'arthi.ramasubramanian@opesfund.eu', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'arthi.ramasubramanian@opesfund.eu',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: arthi.ramasubramanian@opesfund.eu - Opes-Lcef Fund';
END $$;

-- =====================================================
-- USER 6: ashleigh.fynn-munda@opp-gen.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_6 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'ashleigh.fynn-munda@opp-gen.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'ashleigh.fynn-munda@opp-gen.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: ashleigh.fynn-munda@opp-gen.com';
    ELSE
        RAISE NOTICE 'User already exists: ashleigh.fynn-munda@opp-gen.com';
    END IF;
    
    SELECT id INTO user_id_6 FROM auth.users WHERE email = 'ashleigh.fynn-munda@opp-gen.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_6, 'ashleigh.fynn-munda@opp-gen.com', 'OG Impact Fund', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'OG Impact Fund',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_6, 'ashleigh.fynn-munda@opp-gen.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'ashleigh.fynn-munda@opp-gen.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: ashleigh.fynn-munda@opp-gen.com - OG Impact Fund';
END $$;

-- =====================================================
-- USER 7: audrey@anza.holdings
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_7 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'audrey@anza.holdings') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'audrey@anza.holdings',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: audrey@anza.holdings';
    ELSE
        RAISE NOTICE 'User already exists: audrey@anza.holdings';
    END IF;
    
    SELECT id INTO user_id_7 FROM auth.users WHERE email = 'audrey@anza.holdings';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_7, 'audrey@anza.holdings', 'Anza Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Anza Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_7, 'audrey@anza.holdings', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'audrey@anza.holdings',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: audrey@anza.holdings - Anza Capital';
END $$;

-- =====================================================
-- USER 8: bfaga.negocio@am.bfa.ao
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_8 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'bfaga.negocio@am.bfa.ao') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'bfaga.negocio@am.bfa.ao',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: bfaga.negocio@am.bfa.ao';
    ELSE
        RAISE NOTICE 'User already exists: bfaga.negocio@am.bfa.ao';
    END IF;
    
    SELECT id INTO user_id_8 FROM auth.users WHERE email = 'bfaga.negocio@am.bfa.ao';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_8, 'bfaga.negocio@am.bfa.ao', 'BFA Asset Management', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'BFA Asset Management',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_8, 'bfaga.negocio@am.bfa.ao', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'bfaga.negocio@am.bfa.ao',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: bfaga.negocio@am.bfa.ao - BFA Asset Management';
END $$;

-- =====================================================
-- USER 9: brendan@sechacapital.com
-- =====================================================
DO $$
DECLARE
    user_exists BOOLEAN;
    user_id_9 UUID;
BEGIN
    SELECT EXISTS(SELECT 1 FROM auth.users WHERE email = 'brendan@sechacapital.com') INTO user_exists;
    
    IF NOT user_exists THEN
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'brendan@sechacapital.com',
            crypt('@ESCPNetwork2025#', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Created new user: brendan@sechacapital.com';
    ELSE
        RAISE NOTICE 'User already exists: brendan@sechacapital.com';
    END IF;
    
    SELECT id INTO user_id_9 FROM auth.users WHERE email = 'brendan@sechacapital.com';
    
    INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
    VALUES (user_id_9, 'brendan@sechacapital.com', 'Secha Capital', '', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        first_name = 'Secha Capital',
        updated_at = NOW();
    
    INSERT INTO public.user_roles (user_id, email, role, assigned_at)
    VALUES (user_id_9, 'brendan@sechacapital.com', 'viewer', NOW())
    ON CONFLICT (user_id) DO UPDATE SET
        role = 'viewer',
        email = 'brendan@sechacapital.com',
        assigned_at = NOW();
    
    RAISE NOTICE 'Updated profile and role for: brendan@sechacapital.com - Secha Capital';
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
