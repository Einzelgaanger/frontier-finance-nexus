-- Add website and description to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS description text;

-- Update RLS policies for user_profiles to allow viewing all profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

CREATE POLICY "Users can view all profiles" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Keep existing policies for insert/update
CREATE POLICY "Users can view their own profile details" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Add unique constraints to survey tables to enable upsert behavior
ALTER TABLE public.survey_responses_2021 
DROP CONSTRAINT IF EXISTS survey_responses_2021_user_id_key;

ALTER TABLE public.survey_responses_2022 
DROP CONSTRAINT IF EXISTS survey_responses_2022_user_id_key;

ALTER TABLE public.survey_responses_2023 
DROP CONSTRAINT IF EXISTS survey_responses_2023_user_id_key;

ALTER TABLE public.survey_responses_2024 
DROP CONSTRAINT IF EXISTS survey_responses_2024_user_id_key;

-- Add unique constraints (one survey per user per year)
ALTER TABLE public.survey_responses_2021 
ADD CONSTRAINT survey_responses_2021_user_id_key UNIQUE (user_id);

ALTER TABLE public.survey_responses_2022 
ADD CONSTRAINT survey_responses_2022_user_id_key UNIQUE (user_id);

ALTER TABLE public.survey_responses_2023 
ADD CONSTRAINT survey_responses_2023_user_id_key UNIQUE (user_id);

ALTER TABLE public.survey_responses_2024 
ADD CONSTRAINT survey_responses_2024_user_id_key UNIQUE (user_id);