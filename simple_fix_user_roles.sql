-- Simple fix for user_roles - ensure all users have roles
-- Run this in your Supabase SQL Editor

-- Ensure all users have a role (only insert if they don't have one)
INSERT INTO user_roles (user_id, role)
SELECT 
  au.id,
  'viewer'
FROM auth.users au
LEFT JOIN user_roles ur ON au.id = ur.user_id
WHERE ur.user_id IS NULL
  AND au.email IS NOT NULL
  AND au.email != ''
ON CONFLICT (user_id) DO NOTHING;

-- Update any null roles to viewer
UPDATE user_roles 
SET role = 'viewer' 
WHERE role IS NULL;

-- Show current status
SELECT 
  'Total users' as metric,
  COUNT(*) as count
FROM auth.users 
WHERE email IS NOT NULL AND email != '';

SELECT 
  'Users with roles' as metric,
  COUNT(*) as count
FROM user_roles;

SELECT 
  'Role distribution' as metric,
  role,
  COUNT(*) as count
FROM user_roles 
GROUP BY role 
ORDER BY count DESC; 