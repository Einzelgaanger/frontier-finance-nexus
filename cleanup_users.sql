-- =====================================================
-- FORCE CLEANUP SCRIPT - Remove all users except abeautifulmind.ke@gmail.com
-- =====================================================

-- First, let's see what users currently exist
SELECT 
    u.email,
    u.created_at,
    ur.role,
    p.first_name as organization_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Get count before cleanup
SELECT 'Users before cleanup:' as status, COUNT(*) as count FROM auth.users;

-- FORCE DELETE: Remove all survey responses first (to avoid foreign key constraints)
DELETE FROM public.survey_2021_responses WHERE user_id IN (
    SELECT id FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com'
);

DELETE FROM public.survey_2022_responses WHERE user_id IN (
    SELECT id FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com'
);

DELETE FROM public.survey_2023_responses WHERE user_id IN (
    SELECT id FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com'
);

DELETE FROM public.survey_2024_responses WHERE user_id IN (
    SELECT id FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com'
);

-- FORCE DELETE: Remove all membership requests
DELETE FROM public.membership_requests WHERE user_id IN (
    SELECT id FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com'
);

-- FORCE DELETE: Remove all activity logs
DELETE FROM public.activity_logs WHERE user_id IN (
    SELECT id FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com'
);

-- FORCE DELETE: Remove all user roles
DELETE FROM public.user_roles WHERE user_id IN (
    SELECT id FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com'
);

-- FORCE DELETE: Remove all profiles
DELETE FROM public.profiles WHERE id IN (
    SELECT id FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com'
);

-- FORCE DELETE: Remove all auth users except abeautifulmind.ke@gmail.com
DELETE FROM auth.users WHERE email != 'abeautifulmind.ke@gmail.com';

-- Verify cleanup
SELECT 'Users after cleanup:' as status, COUNT(*) as count FROM auth.users;

-- Show remaining user details
SELECT 
    u.email,
    u.created_at,
    ur.role,
    p.first_name as organization_name
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id;

-- Show what was cleaned up
SELECT 'Cleanup completed successfully!' as status;
