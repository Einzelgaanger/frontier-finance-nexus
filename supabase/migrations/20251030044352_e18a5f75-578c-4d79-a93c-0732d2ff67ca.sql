-- Ensure has_role function exists (text-based to match existing user_roles)
create or replace function public.has_role(_user_id uuid, _role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- Policies for profile-pictures bucket
-- Clean up possibly conflicting prior policies
DROP POLICY IF EXISTS "profile_pictures_public_access" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_user_insert" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_user_update" ON storage.objects;
DROP POLICY IF EXISTS "profile_pictures_user_delete" ON storage.objects;

-- Public read for profile images
CREATE POLICY "profile_pictures_public_access"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'profile-pictures'
);

-- Users (or admins) can insert into their own folder
CREATE POLICY "profile_pictures_user_insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures'
  AND ( (
        (storage.foldername(name))[1] = auth.uid()::text
      ) OR public.has_role(auth.uid(), 'admin') )
);

-- Users (or admins) can update
CREATE POLICY "profile_pictures_user_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND ( (
        (storage.foldername(name))[1] = auth.uid()::text
      ) OR public.has_role(auth.uid(), 'admin') )
)
WITH CHECK (
  bucket_id = 'profile-pictures'
  AND ( (
        (storage.foldername(name))[1] = auth.uid()::text
      ) OR public.has_role(auth.uid(), 'admin') )
);

-- Users (or admins) can delete
CREATE POLICY "profile_pictures_user_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures'
  AND ( (
        (storage.foldername(name))[1] = auth.uid()::text
      ) OR public.has_role(auth.uid(), 'admin') )
);
