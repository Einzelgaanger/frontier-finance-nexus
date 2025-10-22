-- Fix auth.users schema issue - set required fields that are NULL
-- This fixes the "confirmation_token: converting NULL to string is unsupported" error

UPDATE auth.users 
SET 
  confirmation_token = '',
  recovery_token = '',
  email_change_token_new = '',
  email_change = ''
WHERE 
  confirmation_token IS NULL 
  OR recovery_token IS NULL 
  OR email_change_token_new IS NULL
  OR email_change IS NULL;

-- Verify the fix
SELECT 
  'Auth users fixed' as status,
  COUNT(*) as total_users,
  COUNT(CASE WHEN confirmation_token = '' THEN 1 END) as users_with_empty_confirmation_token
FROM auth.users;