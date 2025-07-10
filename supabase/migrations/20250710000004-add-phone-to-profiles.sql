-- Add phone field to profiles table
ALTER TABLE public.profiles ADD COLUMN phone TEXT;

-- Add phone field to data field visibility
INSERT INTO public.data_field_visibility (field_name, visibility_level) 
VALUES ('phone', 'member')
ON CONFLICT (field_name) DO UPDATE SET visibility_level = 'member'; 