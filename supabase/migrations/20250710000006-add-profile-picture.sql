-- Add profile_picture_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;

-- Add profile_picture_url to data field visibility
INSERT INTO public.data_field_visibility (field_name, visibility_level) 
VALUES ('profile_picture_url', 'member')
ON CONFLICT (field_name) DO UPDATE SET visibility_level = 'member'; 