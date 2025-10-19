-- =====================================================
-- COMPLETE FIX FOR NETWORK_USERS ACCESS
-- =====================================================
-- This script ensures network_users table works properly for members
-- =====================================================

-- Step 1: Drop and recreate network_users table to ensure clean state
DROP TABLE IF EXISTS public.network_users CASCADE;

-- Step 2: Create network_users table with proper structure
CREATE TABLE public.network_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Can be null since these might not be real auth users
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Copy all data from user_backup to network_users
INSERT INTO public.network_users (
    user_id,
    email,
    first_name,
    last_name,
    role,
    created_at
)
SELECT 
    ub.id as user_id,
    COALESCE(ub.email, 'no-email@example.com') as email,
    ub.first_name,
    ub.last_name,
    COALESCE(ub.role, 'viewer') as role,
    COALESCE(ub.created_at, NOW()) as created_at
FROM public.user_backup ub
WHERE ub.id IS NOT NULL;

-- Step 4: Enable RLS
ALTER TABLE public.network_users ENABLE ROW LEVEL SECURITY;

-- Step 5: Create permissive policy for all authenticated users
CREATE POLICY "Allow all authenticated users to view network users"
ON public.network_users
FOR SELECT
TO authenticated
USING (true);

-- Step 6: Verify the data transfer
SELECT 
    'user_backup' as source_table,
    COUNT(*) as record_count
FROM public.user_backup
UNION ALL
SELECT 
    'network_users' as target_table,
    COUNT(*) as record_count
FROM public.network_users;

-- Step 7: Show sample of transferred data
SELECT 
    id,
    user_id,
    email,
    first_name,
    last_name,
    role,
    created_at
FROM public.network_users
ORDER BY created_at DESC
LIMIT 10;

-- Step 8: Test RLS policy
SELECT 
    'RLS Test' as test_name,
    COUNT(*) as accessible_records
FROM public.network_users;
