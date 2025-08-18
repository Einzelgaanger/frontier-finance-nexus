-- Fix missing profiles for existing users
-- This script creates profiles for users who exist in auth.users but not in profiles

-- Insert profiles for users who exist in auth.users but not in profiles
INSERT INTO profiles (id, email, first_name, last_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'User') as first_name,
  COALESCE(au.raw_user_meta_data->>'last_name', 'User') as last_name,
  au.created_at,
  au.updated_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL
  AND au.email IS NOT NULL
  AND au.email != ''
ON CONFLICT (id) DO NOTHING;

-- Update existing profiles with better fallback data
UPDATE profiles 
SET 
  first_name = COALESCE(first_name, 'User'),
  last_name = COALESCE(last_name, 'User'),
  email = COALESCE(email, 'user@example.com')
WHERE first_name IS NULL 
   OR last_name IS NULL 
   OR email IS NULL;

-- Ensure all users have a role
INSERT INTO user_roles (user_id, role, assigned_at)
SELECT 
  au.id,
  'viewer',
  au.created_at
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
WHERE ur.user_id IS NULL
ON CONFLICT (user_id) DO NOTHING;

-- Show results
SELECT 
  'Profiles created' as action,
  COUNT(*) as count
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.first_name = 'User' AND p.last_name LIKE '%User%';

SELECT 
  'Users with roles' as action,
  COUNT(*) as count
FROM user_roles; 