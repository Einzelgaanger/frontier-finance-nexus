
-- Add missing columns to invitation_codes table
ALTER TABLE public.invitation_codes 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS vehicle_name TEXT;

-- Add missing columns to survey_responses table for complete implementation
ALTER TABLE public.survey_responses
ADD COLUMN IF NOT EXISTS vehicle_type_other TEXT,
ADD COLUMN IF NOT EXISTS legal_entity_month_from INTEGER,
ADD COLUMN IF NOT EXISTS legal_entity_month_to INTEGER,
ADD COLUMN IF NOT EXISTS first_close_month_from INTEGER,
ADD COLUMN IF NOT EXISTS first_close_month_to INTEGER;

-- Create data field visibility entries for all survey fields
INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
('vehicle_type_other', 'member'),
('legal_entity_month_from', 'member'),
('legal_entity_month_to', 'member'),
('first_close_month_from', 'member'),
('first_close_month_to', 'member')
ON CONFLICT (field_name) DO NOTHING;
