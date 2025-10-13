-- =====================================================
-- COMPLETE FIX FOR PROFILE SYSTEM
-- =====================================================
-- This script creates user_profiles table, populates it from user_backup,
-- and ensures all users have profile data
-- =====================================================

-- Step 1: Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    email VARCHAR(255),
    website VARCHAR(255),
    description TEXT,
    profile_photo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Step 2: Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Members can view all profiles" ON public.user_profiles;

-- Step 4: Create new policies
CREATE POLICY "Users can manage their own profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Members can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() 
        AND role IN ('member', 'admin')
    )
);

-- Step 5: Populate user_profiles from user_backup for ALL users
INSERT INTO public.user_profiles (user_id, company_name, email, website, description, profile_photo_url)
SELECT 
    ub.id as user_id,
    COALESCE(ub.first_name || ' ' || ub.last_name, ub.email, 'CFF Network User') as company_name,
    COALESCE(ub.email, 'no-email@example.com') as email,
    '' as website,
    '' as description,
    '' as profile_photo_url
FROM public.user_backup ub
WHERE ub.id IS NOT NULL
ON CONFLICT (user_id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    email = EXCLUDED.email,
    updated_at = NOW();

-- Step 6: Also populate from network_users for any missing users
INSERT INTO public.user_profiles (user_id, company_name, email, website, description, profile_photo_url)
SELECT 
    nu.user_id,
    COALESCE(nu.first_name || ' ' || nu.last_name, nu.email, 'CFF Network User') as company_name,
    COALESCE(nu.email, 'no-email@example.com') as email,
    '' as website,
    '' as description,
    '' as profile_photo_url
FROM public.network_users nu
WHERE nu.user_id IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.user_id = nu.user_id
)
ON CONFLICT (user_id) DO NOTHING;

-- Step 7: Verify the data
SELECT 
    'user_profiles' as table_name, 
    COUNT(*) as record_count 
FROM public.user_profiles
UNION ALL
SELECT 
    'user_backup' as table_name, 
    COUNT(*) as record_count 
FROM public.user_backup
UNION ALL
SELECT 
    'network_users' as table_name, 
    COUNT(*) as record_count 
FROM public.network_users;

-- Step 8: Show sample data
SELECT 
    'Sample user profiles:' as status,
    user_id,
    company_name,
    email,
    created_at
FROM public.user_profiles
ORDER BY created_at DESC
LIMIT 10;
