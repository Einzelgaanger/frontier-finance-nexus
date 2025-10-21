-- =====================================================
-- CREATE TEST USER FOR SURVEY TESTING
-- =====================================================

-- Create a test user in auth.users (simplified approach)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    invited_at,
    confirmation_token,
    confirmation_sent_at,
    recovery_token,
    recovery_sent_at,
    email_change_token_new,
    email_change,
    email_change_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    phone_change_sent_at,
    email_change_token_current,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    NOW(),
    '',
    NULL,
    '',
    '',
    NULL,
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Test User", "company": "Test Company"}',
    false,
    NOW(),
    NOW(),
    NULL,
    NULL,
    '',
    '',
    NULL,
    '',
    0,
    NULL,
    '',
    NULL,
    false,
    NULL
);

-- Create user profile
INSERT INTO public.user_profiles (
    id,
    company_name,
    company_id,
    email,
    full_name,
    role_title,
    user_role,
    is_active,
    email_verified,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'test@example.com'),
    'Test Company',
    gen_random_uuid(),
    'test@example.com',
    'Test User',
    'Fund Manager',
    'admin',
    true,
    true,
    NOW(),
    NOW()
);

-- Create user role
INSERT INTO public.user_roles (
    user_id,
    email,
    role,
    assigned_at,
    created_at,
    updated_at
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'test@example.com'),
    'test@example.com',
    'admin',
    NOW(),
    NOW(),
    NOW()
);

-- Success message
SELECT 'Test user created successfully!' as result;
SELECT 
    u.email,
    p.full_name,
    p.company_name,
    ur.role
FROM auth.users u
JOIN public.user_profiles p ON u.id = p.id
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'test@example.com';
