-- =====================================================
-- CREATE USER PROFILES TABLE
-- =====================================================
-- This creates a table for user profiles with company information
-- =====================================================

-- Create user_profiles table
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

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own profile
CREATE POLICY "Users can manage their own profile"
ON public.user_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for members to view all profiles (for network page)
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

-- Insert default profiles for existing users
INSERT INTO public.user_profiles (user_id, company_name, email)
SELECT 
    ur.user_id,
    COALESCE(ur.email, 'No company name') as company_name,
    ur.email
FROM public.user_roles ur
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.user_id = ur.user_id
)
ON CONFLICT (user_id) DO NOTHING;

-- Verify the table creation
SELECT 
    'user_profiles' as table_name,
    COUNT(*) as record_count
FROM public.user_profiles;
