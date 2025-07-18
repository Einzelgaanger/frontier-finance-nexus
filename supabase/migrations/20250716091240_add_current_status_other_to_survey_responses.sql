-- Add current_status_other column to survey_responses
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS current_status_other TEXT;
