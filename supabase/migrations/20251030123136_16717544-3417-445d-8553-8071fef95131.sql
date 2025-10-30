-- Ensure has_role exists (text-based role)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Recreate storage policies for profile-pictures bucket
DROP POLICY IF EXISTS "pp_public_read" ON storage.objects;
DROP POLICY IF EXISTS "pp_insert_owner_or_admin" ON storage.objects;
DROP POLICY IF EXISTS "pp_update_owner_or_admin" ON storage.objects;
DROP POLICY IF EXISTS "pp_delete_owner_or_admin" ON storage.objects;

-- Public read access for profile images
CREATE POLICY "pp_public_read"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Insert: authenticated users can upload into their own user-id folder or admins anywhere
CREATE POLICY "pp_insert_owner_or_admin"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND (
    (storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')
  )
);

-- Update: authenticated users can update their own files or admins anywhere
CREATE POLICY "pp_update_owner_or_admin"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND (
    (storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')
  )
)
WITH CHECK (
  bucket_id = 'profile-pictures' AND (
    (storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')
  )
);

-- Delete: authenticated users can delete their own files or admins anywhere
CREATE POLICY "pp_delete_owner_or_admin"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND (
    (storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')
  )
);
