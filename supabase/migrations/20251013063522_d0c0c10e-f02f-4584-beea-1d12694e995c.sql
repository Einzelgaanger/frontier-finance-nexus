-- Add RLS policies for all survey sub-tables so users can access their survey data

-- Survey 2021 sub-tables policies
CREATE POLICY "Users can view own survey 2021 business model" ON public.survey_2021_business_model_targeted
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 business stage" ON public.survey_2021_business_stage_targeted
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 covid support" ON public.survey_2021_covid_government_support
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 lens focus" ON public.survey_2021_explicit_lens_focus
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 financing needs" ON public.survey_2021_financing_needs
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 fund vehicle considerations" ON public.survey_2021_fund_vehicle_considerations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 gender considerations investment" ON public.survey_2021_gender_considerations_investment
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 gender considerations requirement" ON public.survey_2021_gender_considerations_requirement
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 gender fund vehicle" ON public.survey_2021_gender_fund_vehicle
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 geographic focus" ON public.survey_2021_geographic_focus
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 investment forms" ON public.survey_2021_investment_forms
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 investment monetization" ON public.survey_2021_investment_monetization
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 investment vehicle type" ON public.survey_2021_investment_vehicle_type
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 demystifying session" ON public.survey_2021_present_demystifying_session
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 raising capital" ON public.survey_2021_raising_capital_2021
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 target capital sources" ON public.survey_2021_target_capital_sources
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 target sectors" ON public.survey_2021_target_sectors
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2021 team based" ON public.survey_2021_team_based
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2021_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

-- Survey 2022 sub-tables policies
CREATE POLICY "Users can view own survey 2022 concessionary capital" ON public.survey_2022_concessionary_capital
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2022_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2022 enterprise types" ON public.survey_2022_enterprise_types
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2022_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2022 gender orientation" ON public.survey_2022_gender_orientation
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2022_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2022 geographic markets" ON public.survey_2022_geographic_markets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2022_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2022 investment monetization" ON public.survey_2022_investment_monetization_exit_forms
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2022_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2022 team based" ON public.survey_2022_team_based
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2022_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

-- Survey 2023 sub-tables policies
CREATE POLICY "Users can view own survey 2023 business development" ON public.survey_2023_business_development_approach
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 concessionary capital" ON public.survey_2023_concessionary_capital
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 exit form" ON public.survey_2023_exit_form
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 future research" ON public.survey_2023_future_research_data
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 gender inclusion" ON public.survey_2023_gender_inclusion
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 geographic markets" ON public.survey_2023_geographic_markets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 gp financial commitment" ON public.survey_2023_gp_financial_commitment
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 legal domicile" ON public.survey_2023_legal_domicile
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 sustainable development goals" ON public.survey_2023_sustainable_development_goals
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2023 team based" ON public.survey_2023_team_based
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2023_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

-- Survey 2024 sub-tables policies
CREATE POLICY "Users can view own survey 2024 business development" ON public.survey_2024_business_development_approach
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 concessionary capital" ON public.survey_2024_concessionary_capital
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 data sharing" ON public.survey_2024_data_sharing_willingness
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 domicile reason" ON public.survey_2024_domicile_reason
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 gender inclusion" ON public.survey_2024_gender_inclusion
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 geographic markets" ON public.survey_2024_geographic_markets
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 gp financial commitment" ON public.survey_2024_gp_financial_commitment
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 investment approval" ON public.survey_2024_investment_approval
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 investment monetisation" ON public.survey_2024_investment_monetisation_forms
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 investment networks" ON public.survey_2024_investment_networks
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own survey 2024 legal domicile" ON public.survey_2024_legal_domicile
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.survey_2024_responses sr
    WHERE sr.id = response_id AND sr.user_id = auth.uid()
  )
);