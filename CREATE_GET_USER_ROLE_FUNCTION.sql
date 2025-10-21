-- ============================================================================
-- CREATE get_user_role FUNCTION
-- ============================================================================
-- This function retrieves the user's role from the user_roles table
-- ============================================================================

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.get_user_role(uuid);

-- Create the function
CREATE OR REPLACE FUNCTION public.get_user_role(user_id_param uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_result text;
BEGIN
  -- Get the role from user_roles table
  SELECT role INTO user_role_result
  FROM public.user_roles
  WHERE user_id = user_id_param
  LIMIT 1;
  
  -- Return the role, or 'viewer' as default if not found
  RETURN COALESCE(user_role_result, 'viewer');
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;

-- Test the function
SELECT 'get_user_role function created successfully' as status;
