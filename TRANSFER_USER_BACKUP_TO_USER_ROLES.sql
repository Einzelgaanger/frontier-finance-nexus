-- =====================================================
-- TRANSFER DATA FROM USER_BACKUP TO USER_ROLES
-- =====================================================
-- This script copies all user data from user_backup to user_roles
-- so that members can access the network data
-- =====================================================

-- Step 1: Check which users from user_backup exist in auth.users
SELECT 
    'Users in user_backup but NOT in auth.users:' as status,
    COUNT(*) as count
FROM public.user_backup ub
LEFT JOIN auth.users au ON ub.id = au.id
WHERE au.id IS NULL;

-- Step 2: Show sample of users that don't exist in auth.users
SELECT 
    ub.id,
    ub.email,
    ub.role,
    'NOT in auth.users' as status
FROM public.user_backup ub
LEFT JOIN auth.users au ON ub.id = au.id
WHERE au.id IS NULL
LIMIT 5;

-- Step 3: Insert only users that exist in auth.users
INSERT INTO public.user_roles (
    user_id,
    email,
    role,
    assigned_at,
    created_at,
    updated_at
)
SELECT 
    ub.id as user_id,
    COALESCE(ub.email, au.email, 'no-email@example.com') as email,
    COALESCE(ub.role, 'viewer') as role,
    COALESCE(ub.created_at, NOW()) as assigned_at,
    COALESCE(ub.created_at, NOW()) as created_at,
    NOW() as updated_at
FROM public.user_backup ub
INNER JOIN auth.users au ON ub.id = au.id
WHERE ub.id IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    assigned_at = EXCLUDED.assigned_at,
    updated_at = NOW();

-- Step 4: Verify the transfer
SELECT 
    'user_backup' as source_table,
    COUNT(*) as record_count
FROM public.user_backup
UNION ALL
SELECT 
    'user_roles' as source_table,
    COUNT(*) as record_count
FROM public.user_roles;

-- Step 5: Show sample of transferred data
SELECT 
    user_id,
    email,
    role,
    assigned_at
FROM public.user_roles
ORDER BY created_at DESC
LIMIT 10;
