-- Clean up duplicate user roles and ensure data integrity
-- This will keep only the most recent role for each user

-- First, create a temporary table with the latest role for each user
CREATE TEMP TABLE temp_user_roles AS
SELECT DISTINCT ON (user_id) 
  user_id,
  role,
  assigned_at,
  assigned_by
FROM public.user_roles
ORDER BY user_id, assigned_at DESC;

-- Delete all existing user roles
DELETE FROM public.user_roles;

-- Re-insert the cleaned data
INSERT INTO public.user_roles (user_id, role, assigned_at, assigned_by)
SELECT user_id, role, assigned_at, assigned_by
FROM temp_user_roles;

-- Drop the temporary table
DROP TABLE temp_user_roles;

-- Add a unique constraint to prevent future duplicates
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Ensure the get_user_role function works correctly
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT role::TEXT FROM public.user_roles WHERE user_id = user_uuid LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE; 