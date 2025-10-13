-- =====================================================
-- FIX NETWORK_USERS ACCESS FOR MEMBERS
-- =====================================================
-- This script ensures members can access network_users data
-- =====================================================

-- Step 1: Drop existing policies if they exist
DROP POLICY IF EXISTS "Members can view network users" ON public.network_users;

-- Step 2: Create a more permissive policy for network_users
CREATE POLICY "Allow authenticated users to view network users"
ON public.network_users
FOR SELECT
TO authenticated
USING (true);

-- Step 3: Alternative: Disable RLS temporarily to test
-- ALTER TABLE public.network_users DISABLE ROW LEVEL SECURITY;

-- Step 4: Test access by counting records
SELECT 
    'network_users accessible' as status,
    COUNT(*) as record_count
FROM public.network_users;

-- Step 5: Show sample data to verify access
SELECT 
    email,
    first_name,
    last_name,
    role
FROM public.network_users
LIMIT 5;
