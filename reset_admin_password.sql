-- =====================================================
-- RESET ADMIN PASSWORD
-- Reset password for abeautifulmind.ke@gmail.com
-- =====================================================

-- Check if the user exists
SELECT 
    'User check:' as status,
    id,
    email,
    email_confirmed_at,
    created_at
FROM auth.users 
WHERE email = 'abeautifulmind.ke@gmail.com';

-- Update the password for the admin user
UPDATE auth.users 
SET 
    encrypted_password = crypt('@ESCPNetwork2025#', gen_salt('bf')),
    updated_at = NOW(),
    email_confirmed_at = NOW()
WHERE email = 'abeautifulmind.ke@gmail.com';

-- Verify the update
SELECT 
    'Password updated for:' as status,
    email,
    email_confirmed_at,
    updated_at
FROM auth.users 
WHERE email = 'abeautifulmind.ke@gmail.com';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Admin password reset complete! You can now sign in with @ESCPNetwork2025#' as status;
