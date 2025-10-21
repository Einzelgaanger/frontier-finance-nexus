-- =====================================================
-- 2023 SURVEY TABLE SCHEMA
-- Matches Survey2023.tsx form fields exactly
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2023 (
    -- Primary Key & Metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Section 1: Introduction & Context
    email_address TEXT,
    organisation_name TEXT,
    funds_raising_investing TEXT,
    fund_name TEXT,
    
    -- Section 2: Organizational Background and Team
    legal_entity_achieved TEXT,
    first_close_achieved TEXT,
    first_investment_achieved TEXT,
    geographic_markets TEXT[],
    geographic_markets_other TEXT,
    team_based TEXT[],
    team_based_other TEXT,
    fte_staff_2022 INTEGER,
    fte_staff_current INTEGER,
    fte_staff_2024_est INTEGER,
    principals_count INTEGER,
    gender_inclusion TEXT[],
    gender_inclusion_other TEXT,
    team_experience_investments JSONB,
    team_experience_exits JSONB,
    team_experience_other TEXT,
    
    -- Section 3: Vehicle Construct
    legal_domicile TEXT[],
    legal_domicile_other TEXT,
    currency_investments TEXT,
    currency_lp_commitments TEXT,
    fund_type_status TEXT,
    fund_type_status_other TEXT,
    current_funds_raised NUMERIC,
    current_amount_invested NUMERIC,
    target_fund_size NUMERIC,
    target_investments_count INTEGER,
    follow_on_investment_permitted TEXT,
    concessionary_capital TEXT[],
    concessionary_capital_other TEXT,
    lp_capital_sources_existing JSONB,
    lp_capital_sources_target JSONB,
    gp_financial_commitment TEXT[],
    gp_financial_commitment_other TEXT,
    gp_management_fee TEXT,
    gp_management_fee_other TEXT,
    hurdle_rate_currency TEXT,
    hurdle_rate_currency_other TEXT,
    hurdle_rate_percentage NUMERIC,
    target_local_currency_return NUMERIC,
    fundraising_constraints JSONB,
    fundraising_constraints_other TEXT,
    
    -- Section 4: Investment Thesis
    business_stages JSONB,
    growth_expectations JSONB,
    financing_needs JSONB,
    sector_focus JSONB,
    sector_focus_other TEXT,
    financial_instruments JSONB,
    sustainable_development_goals TEXT[],
    gender_lens_investing JSONB,
    gender_lens_investing_other TEXT,
    
    -- Section 5: Pipeline Sourcing and Portfolio Construction
    pipeline_sourcing JSONB,
    pipeline_sourcing_other TEXT,
    average_investment_size TEXT,
    capital_raise_percentage NUMERIC,
    
    -- Section 6: Portfolio Value Creation and Exits
    portfolio_priorities JSONB,
    portfolio_priorities_other TEXT,
    technical_assistance_funding JSONB,
    technical_assistance_funding_other TEXT,
    business_development_support TEXT[],
    business_development_support_other TEXT,
    investment_timeframe TEXT,
    exit_form TEXT[],
    exit_form_other TEXT,
    
    -- Section 7: Performance to Date and Current Outlook
    equity_investments_count INTEGER,
    debt_investments_count INTEGER,
    equity_exits_count INTEGER,
    debt_exits_count INTEGER,
    equity_exits_anticipated INTEGER,
    debt_exits_anticipated INTEGER,
    other_investments TEXT,
    revenue_growth_historical NUMERIC,
    revenue_growth_expected NUMERIC,
    cash_flow_growth_historical NUMERIC,
    cash_flow_growth_expected NUMERIC,
    jobs_impact_historical_direct INTEGER,
    jobs_impact_historical_indirect INTEGER,
    jobs_impact_historical_other TEXT,
    jobs_impact_expected_direct INTEGER,
    jobs_impact_expected_indirect INTEGER,
    jobs_impact_expected_other TEXT,
    fund_priorities JSONB,
    fund_priorities_other TEXT,
    concerns_ranking JSONB,
    concerns_ranking_other TEXT,
    
    -- Section 8: Future Research
    future_research_data TEXT[],
    future_research_data_other TEXT,
    one_on_one_meeting BOOLEAN,
    receive_survey_results BOOLEAN,
    
    -- System Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for 2023
CREATE INDEX IF NOT EXISTS idx_survey_2023_user_id ON public.survey_responses_2023(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2023_organisation ON public.survey_responses_2023(organisation_name);
CREATE INDEX IF NOT EXISTS idx_survey_2023_email ON public.survey_responses_2023(email_address);
CREATE INDEX IF NOT EXISTS idx_survey_2023_completed_at ON public.survey_responses_2023(completed_at);
CREATE INDEX IF NOT EXISTS idx_survey_2023_created_at ON public.survey_responses_2023(created_at);

-- Enable RLS
ALTER TABLE public.survey_responses_2023 ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_2023_updated_at ON public.survey_responses_2023;
CREATE TRIGGER update_survey_2023_updated_at
    BEFORE UPDATE ON public.survey_responses_2023
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '2023 Survey Table Created Successfully!';
    RAISE NOTICE '========================================';
END $$;
