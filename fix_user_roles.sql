-- Fix user_roles table and ensure all users have roles
-- Run this in your Supabase SQL Editor

-- First, let's check if the user_roles table exists and has the right structure
DO $$
BEGIN
    -- Create user_roles table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        CREATE TABLE user_roles (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            role TEXT NOT NULL DEFAULT 'viewer',
            UNIQUE(user_id)
        );
        
        -- Enable RLS
        ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
        
        -- Create policies
        CREATE POLICY "Users can view their own role" ON user_roles
            FOR SELECT USING (auth.uid() = user_id);
            
        CREATE POLICY "Admins can view all roles" ON user_roles
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
                )
            );
            
        CREATE POLICY "Users can update their own role" ON user_roles
            FOR UPDATE USING (auth.uid() = user_id);
            
        CREATE POLICY "Admins can insert roles" ON user_roles
            FOR INSERT WITH CHECK (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
                )
            );
    END IF;
END $$;

-- Ensure all users have a role
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

-- Show results
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