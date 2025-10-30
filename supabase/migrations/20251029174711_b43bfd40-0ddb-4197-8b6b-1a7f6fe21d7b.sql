-- Fix RLS policies for profile-pictures storage bucket
-- Note: We can only create policies, not modify the storage.objects table itself

-- Create policy for public viewing of profile pictures
CREATE POLICY "profile_pictures_public_access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Create policy for users to insert their own profile pictures
CREATE POLICY "profile_pictures_user_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy for users to update their own profile pictures
CREATE POLICY "profile_pictures_user_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy for users to delete their own profile pictures
CREATE POLICY "profile_pictures_user_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);