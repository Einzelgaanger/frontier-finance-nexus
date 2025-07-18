-- Add markets_operated_other column to survey_responses
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS markets_operated_other TEXT;
