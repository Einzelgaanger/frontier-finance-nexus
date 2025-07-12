-- Add domicile_country column to membership_requests table
ALTER TABLE public.membership_requests ADD COLUMN IF NOT EXISTS domicile_country TEXT;

-- Add domicile_country to data field visibility
INSERT INTO public.data_field_visibility (field_name, visibility_level) 
VALUES ('domicile_country', 'public')
ON CONFLICT (field_name) DO UPDATE SET visibility_level = 'public'; 