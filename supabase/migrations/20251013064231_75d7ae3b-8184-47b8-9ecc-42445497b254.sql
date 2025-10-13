-- Add missing policy for survey_2024_team_based
CREATE POLICY "Users can view own survey 2024 team based" 
ON public.survey_2024_team_based
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);