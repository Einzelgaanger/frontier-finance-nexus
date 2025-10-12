-- =====================================================
-- SIMPLE AUTH FIX - FOCUS ON CORE ISSUE
-- Just remove the problematic functions and reset RLS
-- =====================================================

-- Step 1: Remove ALL custom functions that might interfere
DROP FUNCTION IF EXISTS create_user_by_admin(TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_as_admin(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS admin_create_viewer(TEXT, TEXT, JSONB, INTEGER);
DROP FUNCTION IF EXISTS create_user_with_profile(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_or_update_user_safe(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_efficient(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_batch(TEXT, TEXT);
DROP FUNCTION IF EXISTS create_user_simple(TEXT, TEXT);

-- Step 2: Remove any custom triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_updated ON public.profiles;
DROP TRIGGER IF EXISTS handle_new_user ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON public.user_roles;
DROP TRIGGER IF EXISTS on_auth_user_updated ON public.user_roles;
DROP TRIGGER IF EXISTS handle_new_user ON public.user_roles;

-- Step 3: Reset RLS policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2021_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2022_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2023_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2024_responses DISABLE ROW LEVEL SECURITY;

-- Step 4: Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2021_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2022_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2023_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_2024_responses ENABLE ROW LEVEL SECURITY;

-- Step 5: Create basic RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own role" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own survey" ON public.survey_2021_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own survey" ON public.survey_2022_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own survey" ON public.survey_2023_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own survey" ON public.survey_2024_responses
    FOR SELECT USING (auth.uid() = user_id);

-- Step 6: Final verification
SELECT 'Auth system check:' as status, COUNT(*) as user_count FROM auth.users;
SELECT 'User roles check:' as status, COUNT(*) as role_count FROM public.user_roles;
SELECT 'Profiles check:' as status, COUNT(*) as profile_count FROM public.profiles;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Simple auth fix complete! Try signing in now.' as status;
