-- Fix remaining security issues

-- Fix: Update get_or_create_user_role function to have proper search_path
CREATE OR REPLACE FUNCTION public.get_or_create_user_role(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Try to get existing role
    SELECT role INTO user_role 
    FROM user_roles 
    WHERE user_id = user_uuid;
    
    -- If no role exists, create default 'viewer' role
    IF user_role IS NULL THEN
        INSERT INTO user_roles (user_id, email, role) 
        SELECT user_uuid, email, 'viewer'
        FROM auth.users
        WHERE id = user_uuid
        ON CONFLICT (user_id) DO NOTHING;
        
        SELECT role INTO user_role 
        FROM user_roles 
        WHERE user_id = user_uuid;
    END IF;
    
    RETURN COALESCE(user_role, 'viewer');
END;
$$;

-- Enable RLS on member_surveys and add policies
DROP POLICY IF EXISTS "Viewers can view member surveys" ON public.member_surveys;
CREATE POLICY "Viewers can view member surveys"
ON public.member_surveys
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on data_field_visibility
DROP POLICY IF EXISTS "Viewers can view field visibility" ON public.data_field_visibility;
CREATE POLICY "Viewers can view field visibility"
ON public.data_field_visibility
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on invitation_codes (if not already enabled)
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view codes for verification" ON public.invitation_codes;
CREATE POLICY "Users can view codes for verification"
ON public.invitation_codes
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on activity_logs (if not already enabled)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;