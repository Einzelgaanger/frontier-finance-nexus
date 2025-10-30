-- Clean up all duplicate profile-pictures policies and create working ones

-- Drop ALL existing profile-pictures policies
DROP POLICY IF EXISTS "Anyone can view profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Public read profile-pictures" ON storage.objects;
DROP POLICY IF EXISTS "pp_public_read" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_public_access" ON storage.objects;

DROP POLICY IF EXISTS "Users can insert their profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "pp_insert_owner_or_admin" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_user_insert" ON storage.objects;

DROP POLICY IF EXISTS "Users can update their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "pp_update_owner_or_admin" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_user_update" ON storage.objects;

DROP POLICY IF EXISTS "Users can delete their own profile picture" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "pp_delete_owner_or_admin" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_user_delete" ON storage.objects;

-- Create clean, simple policies that work
-- Public SELECT
CREATE POLICY "profile_pictures_select"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- INSERT: owner or admin
CREATE POLICY "profile_pictures_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- UPDATE: owner or admin
CREATE POLICY "profile_pictures_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR public.has_role(auth.uid(), 'admin')
  )
)
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR public.has_role(auth.uid(), 'admin')
  )
);

-- DELETE: owner or admin
CREATE POLICY "profile_pictures_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND (
    (storage.foldername(name))[1] = auth.uid()::text 
    OR public.has_role(auth.uid(), 'admin')
  )
);