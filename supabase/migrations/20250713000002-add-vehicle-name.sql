-- Add vehicle_name column to survey_responses table
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS vehicle_name TEXT;

-- Add vehicle_name to data field visibility
INSERT INTO public.data_field_visibility (field_name, visibility_level) 
VALUES ('vehicle_name', 'public')
ON CONFLICT (field_name) DO UPDATE SET visibility_level = 'public'; 