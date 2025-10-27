-- Update default password for all users except test accounts
-- New default password: @ESCPNetwork2025!
-- Test accounts to preserve:
--   viewer.test@escpnetwork.net / ViewerTest123!
--   member.test@escpnetwork.net / MemberTest123!
--   admin.test@escpnetwork.net / AdminTest123!

-- Update passwords for non-test accounts to new default
UPDATE auth.users
SET encrypted_password = crypt('@ESCPNetwork2025!', gen_salt('bf')),
    updated_at = NOW()
WHERE email NOT IN (
    'viewer.test@escpnetwork.net',
    'member.test@escpnetwork.net', 
    'admin.test@escpnetwork.net'
)
AND email IS NOT NULL;