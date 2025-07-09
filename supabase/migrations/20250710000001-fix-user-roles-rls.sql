-- Fix RLS policies for user_roles table to allow verification process
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role assignment during verification" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role updates during verification" ON public.user_roles;

-- Create comprehensive policies that allow verification process
CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can view their own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Allow role assignment during verification" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow role updates during verification" 
  ON public.user_roles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Ensure invitation_codes policies allow verification
DROP POLICY IF EXISTS "Users can view codes to redeem" ON public.invitation_codes;
DROP POLICY IF EXISTS "Users can view and update codes for verification" ON public.invitation_codes;

CREATE POLICY "Users can view and update codes for verification" 
  ON public.invitation_codes 
  FOR ALL 
  USING (true); 