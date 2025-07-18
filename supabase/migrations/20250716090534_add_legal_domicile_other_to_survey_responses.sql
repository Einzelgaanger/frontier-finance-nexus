-- Add legal_domicile_other column to survey_responses
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS legal_domicile_other TEXT;
