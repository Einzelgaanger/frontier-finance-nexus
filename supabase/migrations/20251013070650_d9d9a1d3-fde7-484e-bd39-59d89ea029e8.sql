-- Transfer only users from user_backup that exist in auth.users
INSERT INTO user_roles (user_id, email, role, created_at)
SELECT 
  ub.id as user_id,
  ub.email,
  ub.role,
  ub.created_at
FROM user_backup ub
INNER JOIN auth.users au ON ub.id = au.id
ON CONFLICT (user_id) 
DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Show summary
SELECT 
  'Total in backup' as metric,
  COUNT(*) as count 
FROM user_backup
UNION ALL
SELECT 
  'Transferred to user_roles' as metric,
  COUNT(*) as count 
FROM user_roles;