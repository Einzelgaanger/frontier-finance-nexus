-- Fix existing users with "User User" names
-- This script updates profiles where both first_name and last_name are "User"

-- Update profiles where both first_name and last_name are "User"
-- Extract a meaningful name from the email address
UPDATE profiles 
SET 
  first_name = COALESCE(
    NULLIF(SPLIT_PART(email, '@', 1), ''),
    'Unknown'
  ),
  last_name = 'User'
WHERE first_name = 'User' 
  AND last_name = 'User'
  AND email IS NOT NULL
  AND email != '';

-- Update profiles where first_name is "User" but last_name is different
UPDATE profiles 
SET 
  first_name = COALESCE(
    NULLIF(SPLIT_PART(email, '@', 1), ''),
    'Unknown'
  )
WHERE first_name = 'User' 
  AND last_name != 'User'
  AND email IS NOT NULL
  AND email != '';

-- Update profiles where last_name is "User" but first_name is different
UPDATE profiles 
SET 
  last_name = 'User'
WHERE last_name = 'User' 
  AND first_name != 'User'
  AND first_name IS NOT NULL;

-- Show the results
SELECT 
  'Updated profiles' as action,
  COUNT(*) as count
FROM profiles 
WHERE first_name != 'User' 
  AND (last_name = 'User' OR last_name IS NULL);

SELECT 
  'Profiles with meaningful names' as action,
  COUNT(*) as count
FROM profiles 
WHERE first_name IS NOT NULL 
  AND first_name != 'User'
  AND email IS NOT NULL; 