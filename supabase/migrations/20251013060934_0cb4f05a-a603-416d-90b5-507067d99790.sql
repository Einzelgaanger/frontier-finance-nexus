-- Fix infinite recursion in user_roles RLS policies
-- This is a critical fix to allow users to login

BEGIN;

-- 1. Drop all existing RLS policies on user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can delete their own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "System can insert logs" ON user_roles;

-- 2. Create a SECURITY DEFINER function to safely get user role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
    user_role_value TEXT;
BEGIN
    -- Directly query user_roles without RLS interference
    SELECT role INTO user_role_value
    FROM public.user_roles
    WHERE user_id = user_uuid
    LIMIT 1;
    
    -- Return the role or 'viewer' as default
    RETURN COALESCE(user_role_value, 'viewer');
EXCEPTION
    WHEN OTHERS THEN
        -- Return 'viewer' on any error
        RETURN 'viewer';
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_role_safe(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role_safe(UUID) TO anon;

-- 3. Create simple, non-recursive RLS policies
CREATE POLICY "Anyone can read their own role"
ON user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can insert roles"
ON user_roles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own role"
ON user_roles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Ensure all auth users have a role entry
INSERT INTO user_roles (user_id, role)
SELECT 
    au.id,
    COALESCE(
        (SELECT role FROM user_roles ur WHERE ur.user_id = au.id LIMIT 1),
        'viewer'
    ) as role
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM user_roles ur WHERE ur.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;

-- 5. Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_roles TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMIT;

-- Verify fix
SELECT 
    'Total auth users' as metric,
    COUNT(*) as count
FROM auth.users;

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