-- CREATE get_user_role_safe FUNCTION
-- This function safely gets user role without RLS interference

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.get_user_role_safe(UUID);

-- Create the SECURITY DEFINER function
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

-- Test the function
SELECT 'get_user_role_safe function created successfully' as status;
