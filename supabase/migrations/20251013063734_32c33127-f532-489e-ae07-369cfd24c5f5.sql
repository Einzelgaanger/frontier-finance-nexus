-- Enable RLS on user_backup table and add admin-only access policy
ALTER TABLE public.user_backup ENABLE ROW LEVEL SECURITY;

-- Only admins can view user backup data
CREATE POLICY "Only admins can view user backup"
ON public.user_backup
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);