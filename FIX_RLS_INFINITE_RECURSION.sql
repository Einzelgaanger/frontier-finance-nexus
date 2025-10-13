-- Fix infinite recursion in user_roles RLS policy
-- This script will resolve the critical database issues

-- 1. Drop all existing policies on user_roles table
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can delete their own role" ON user_roles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON user_roles;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON user_roles;

-- 2. Disable RLS temporarily to clean up data
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- 3. Clean up duplicate entries
DELETE FROM user_roles 
WHERE user_id IN (
    SELECT user_id 
    FROM user_roles 
    GROUP BY user_id 
    HAVING COUNT(*) > 1
);

-- 4. Re-enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Create simple, non-recursive policies
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own role" ON user_roles
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON user_roles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 7. Create a function to safely get or create user role
CREATE OR REPLACE FUNCTION get_or_create_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Try to get existing role
    SELECT role INTO user_role 
    FROM user_roles 
    WHERE user_id = user_uuid;
    
    -- If no role exists, create default 'viewer' role
    IF user_role IS NULL THEN
        INSERT INTO user_roles (user_id, role) 
        VALUES (user_uuid, 'viewer') 
        ON CONFLICT (user_id) DO NOTHING;
        
        SELECT role INTO user_role 
        FROM user_roles 
        WHERE user_id = user_uuid;
    END IF;
    
    RETURN COALESCE(user_role, 'viewer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_or_create_user_role(UUID) TO authenticated;

-- 9. Clean up any remaining issues
UPDATE user_roles SET role = 'viewer' WHERE role IS NULL;
