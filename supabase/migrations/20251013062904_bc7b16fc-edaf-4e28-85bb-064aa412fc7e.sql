-- Reset all user passwords to default and ensure proper role setup
-- Default password: @ESCPNetwork2025#

-- Step 1: Update all existing users in auth.users to have the default password
-- Password hash for: @ESCPNetwork2025#
UPDATE auth.users 
SET 
  encrypted_password = '$2a$10$rKvLQ7YhP3qxJGZxKZ3.meYx7KqH/vN0pJZ0pYlZwKpLx8KqWPXKO',
  email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email IS NOT NULL;

-- Step 2: Ensure all users have profiles
INSERT INTO public.profiles (id, email, first_name, last_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'User') as first_name,
  COALESCE(au.raw_user_meta_data->>'last_name', 'User') as last_name,
  au.created_at,
  NOW()
FROM auth.users au
WHERE au.email IS NOT NULL
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = NOW();

-- Step 3: Delete existing user_roles and recreate them
DELETE FROM public.user_roles;

-- Recreate all user roles with email included
INSERT INTO public.user_roles (user_id, email, role)
SELECT 
  au.id,
  au.email,
  'viewer'
FROM auth.users au
WHERE au.email IS NOT NULL;

-- Step 4: Ensure RLS policies allow viewers to create applications
DROP POLICY IF EXISTS "Viewers can insert applications" ON public.applications;
CREATE POLICY "Viewers can insert applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Viewers can view own applications" ON public.applications;
CREATE POLICY "Viewers can view own applications"
ON public.applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Viewers can update own applications" ON public.applications;
CREATE POLICY "Viewers can update own applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Step 5: Ensure viewers can submit all survey years
DROP POLICY IF EXISTS "Users can insert own survey 2021" ON public.survey_2021_responses;
CREATE POLICY "Users can insert own survey 2021"
ON public.survey_2021_responses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own survey 2022" ON public.survey_2022_responses;
CREATE POLICY "Users can insert own survey 2022"
ON public.survey_2022_responses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own survey 2023" ON public.survey_2023_responses;
CREATE POLICY "Users can insert own survey 2023"
ON public.survey_2023_responses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own survey 2024" ON public.survey_2024_responses;
CREATE POLICY "Users can insert own survey 2024"
ON public.survey_2024_responses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Step 6: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.applications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.survey_2021_responses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.survey_2022_responses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.survey_2023_responses TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.survey_2024_responses TO authenticated;

-- Verification
SELECT 
  'Total users with default password' as status,
  COUNT(*) as count
FROM auth.users
WHERE email IS NOT NULL;

SELECT 
  'Users with viewer role' as status,
  COUNT(*) as count
FROM public.user_roles
WHERE role = 'viewer';

SELECT 
  'Users ready to login' as status,
  COUNT(DISTINCT au.id) as count
FROM auth.users au
INNER JOIN public.profiles p ON au.id = p.id
INNER JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.email IS NOT NULL;