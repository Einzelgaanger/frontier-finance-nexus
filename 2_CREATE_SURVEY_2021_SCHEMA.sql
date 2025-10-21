-- =====================================================
-- 2021 SURVEY TABLE SCHEMA
-- Matches Survey2021.tsx form fields exactly
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2021 (
    -- Primary Key & Metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Section 1: Background Information
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    team_based TEXT[],
    team_based_other TEXT,
    geographic_focus TEXT[],
    geographic_focus_other TEXT,
    fund_stage TEXT,
    fund_stage_other TEXT,
    legal_entity_date TEXT,
    first_close_date TEXT,
    first_investment_date TEXT,
    
    -- Section 2: Investment Thesis & Capital Construct
    investments_march_2020 TEXT,
    investments_december_2020 TEXT,
    optional_supplement TEXT,
    investment_vehicle_type TEXT[],
    investment_vehicle_type_other TEXT,
    current_fund_size TEXT,
    target_fund_size TEXT,
    investment_timeframe TEXT,
    investment_timeframe_other TEXT,
    business_model_targeted TEXT[],
    business_model_targeted_other TEXT,
    business_stage_targeted TEXT[],
    business_stage_targeted_other TEXT,
    financing_needs TEXT[],
    financing_needs_other TEXT,
    target_capital_sources TEXT[],
    target_capital_sources_other TEXT,
    target_irr_achieved TEXT,
    target_irr_targeted TEXT,
    impact_vs_financial_orientation TEXT,
    explicit_lens_focus TEXT[],
    explicit_lens_focus_other TEXT,
    report_sustainable_development_goals BOOLEAN,
    top_sdg_1 TEXT,
    top_sdg_2 TEXT,
    top_sdg_3 TEXT,
    gender_considerations_investment TEXT[],
    gender_considerations_investment_other TEXT,
    gender_considerations_requirement TEXT[],
    gender_considerations_requirement_other TEXT,
    gender_fund_vehicle TEXT[],
    gender_fund_vehicle_other TEXT,
    
    -- Section 3: Portfolio Construction and Team
    investment_size_your_amount TEXT,
    investment_size_total_raise TEXT,
    investment_forms TEXT[],
    investment_forms_other TEXT,
    target_sectors TEXT[],
    target_sectors_other TEXT,
    carried_interest_principals TEXT,
    current_ftes TEXT,
    
    -- Section 4: Portfolio Development & Investment Return Monetization
    portfolio_needs_ranking JSONB,
    portfolio_needs_other TEXT,
    investment_monetization TEXT[],
    investment_monetization_other TEXT,
    exits_achieved TEXT,
    fund_capabilities_ranking JSONB,
    fund_capabilities_other TEXT,
    
    -- Section 5: Impact of COVID-19 on Vehicle and Portfolio
    covid_impact_aggregate TEXT,
    covid_impact_portfolio JSONB,
    covid_government_support TEXT[],
    covid_government_support_other TEXT,
    raising_capital_2021 TEXT[],
    raising_capital_2021_other TEXT,
    fund_vehicle_considerations TEXT[],
    fund_vehicle_considerations_other TEXT,
    
    -- Section 6: Feedback on ESCP Network Membership
    network_value_rating TEXT,
    working_groups_ranking JSONB,
    new_working_group_suggestions TEXT,
    webinar_content_ranking JSONB,
    new_webinar_suggestions TEXT,
    communication_platform TEXT,
    network_value_areas JSONB,
    present_connection_session BOOLEAN,
    convening_initiatives_ranking JSONB,
    convening_initiatives_other TEXT,
    
    -- Section 7: 2021 Convening Objectives & Goals
    participate_mentoring_program TEXT,
    present_demystifying_session TEXT[],
    present_demystifying_session_other TEXT,
    additional_comments TEXT,
    
    -- System Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for 2021
CREATE INDEX IF NOT EXISTS idx_survey_2021_user_id ON public.survey_responses_2021(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2021_firm_name ON public.survey_responses_2021(firm_name);
CREATE INDEX IF NOT EXISTS idx_survey_2021_completed_at ON public.survey_responses_2021(completed_at);
CREATE INDEX IF NOT EXISTS idx_survey_2021_created_at ON public.survey_responses_2021(created_at);

-- Enable RLS
ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_2021_updated_at ON public.survey_responses_2021;
CREATE TRIGGER update_survey_2021_updated_at
    BEFORE UPDATE ON public.survey_responses_2021
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '2021 Survey Table Created Successfully!';
    RAISE NOTICE '========================================';
END $$;
