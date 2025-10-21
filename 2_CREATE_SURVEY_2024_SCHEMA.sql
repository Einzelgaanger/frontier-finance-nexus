-- =====================================================
-- 2024 SURVEY TABLE SCHEMA
-- Matches Survey2024.tsx form fields exactly
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2024 (
    -- Primary Key & Metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Section 1: Introduction & Context (Questions 1-5)
    email_address TEXT,
    investment_networks TEXT[],
    investment_networks_other TEXT,
    organisation_name TEXT,
    funds_raising_investing TEXT,
    fund_name TEXT,
    
    -- Section 2: Organizational Background and Team (Questions 6-14)
    legal_entity_achieved TEXT,
    first_close_achieved TEXT,
    first_investment_achieved TEXT,
    geographic_markets TEXT[],
    geographic_markets_other TEXT,
    team_based TEXT[],
    team_based_other TEXT,
    fte_staff_2023_actual INTEGER,
    fte_staff_current INTEGER,
    fte_staff_2025_forecast INTEGER,
    investment_approval TEXT[],
    investment_approval_other TEXT,
    principals_total INTEGER,
    principals_women INTEGER,
    gender_inclusion TEXT[],
    gender_inclusion_other TEXT,
    team_experience_investments JSONB,
    team_experience_exits JSONB,
    
    -- Section 3: Vehicle Construct (Questions 15-32)
    legal_domicile TEXT[],
    legal_domicile_other TEXT,
    domicile_reason TEXT[],
    domicile_reason_other TEXT,
    regulatory_impact JSONB,
    regulatory_impact_other TEXT,
    currency_investments TEXT,
    currency_lp_commitments TEXT,
    currency_hedging_strategy TEXT,
    currency_hedging_details TEXT,
    fund_type_status TEXT,
    fund_type_status_other TEXT,
    hard_commitments_2022 NUMERIC,
    hard_commitments_current NUMERIC,
    amount_invested_2022 NUMERIC,
    amount_invested_current NUMERIC,
    target_fund_size_2022 NUMERIC,
    target_fund_size_current NUMERIC,
    target_number_investments INTEGER,
    follow_on_permitted TEXT,
    concessionary_capital TEXT[],
    concessionary_capital_other TEXT,
    existing_lp_sources JSONB,
    target_lp_sources JSONB,
    gp_financial_commitment TEXT[],
    gp_financial_commitment_other TEXT,
    gp_management_fee TEXT,
    gp_management_fee_other TEXT,
    hurdle_rate_currency TEXT,
    hurdle_rate_percentage NUMERIC,
    target_return_above_govt_debt NUMERIC,
    fundraising_barriers JSONB,
    
    -- Section 4: Investment Thesis (Questions 33-40)
    business_stages JSONB,
    revenue_growth_mix JSONB,
    financing_needs JSONB,
    sector_target_allocation JSONB,
    investment_considerations JSONB,
    financial_instruments_ranking JSONB,
    top_sdgs TEXT[],
    additional_sdgs TEXT,
    gender_lens_investing JSONB,
    
    -- Section 5: Pipeline Sourcing and Portfolio Construction (Questions 41-43)
    pipeline_sources_quality JSONB,
    sgb_financing_trends JSONB,
    typical_investment_size TEXT,
    
    -- Section 6: Portfolio Value Creation and Exits (Questions 44-55)
    post_investment_priorities JSONB,
    technical_assistance_funding JSONB,
    business_development_approach TEXT[],
    business_development_approach_other TEXT,
    unique_offerings JSONB,
    typical_investment_timeframe TEXT,
    investment_monetisation_forms TEXT[],
    investment_monetisation_other TEXT,
    equity_investments_made INTEGER,
    debt_investments_made INTEGER,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,
    equity_exits_anticipated INTEGER,
    debt_repayments_anticipated INTEGER,
    other_investments_supplement TEXT,
    portfolio_revenue_growth_12m NUMERIC,
    portfolio_revenue_growth_next_12m NUMERIC,
    portfolio_cashflow_growth_12m NUMERIC,
    portfolio_cashflow_growth_next_12m NUMERIC,
    portfolio_performance_other TEXT,
    direct_jobs_current INTEGER,
    indirect_jobs_current INTEGER,
    direct_jobs_anticipated INTEGER,
    indirect_jobs_anticipated INTEGER,
    employment_impact_other TEXT,
    fund_priorities_next_12m JSONB,
    
    -- Section 7: Future Research (Questions 56-59)
    data_sharing_willingness TEXT[],
    data_sharing_other TEXT,
    survey_sender TEXT,
    receive_results BOOLEAN,
    
    -- System Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for 2024
CREATE INDEX IF NOT EXISTS idx_survey_2024_user_id ON public.survey_responses_2024(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2024_organisation ON public.survey_responses_2024(organisation_name);
CREATE INDEX IF NOT EXISTS idx_survey_2024_email ON public.survey_responses_2024(email_address);
CREATE INDEX IF NOT EXISTS idx_survey_2024_completed_at ON public.survey_responses_2024(completed_at);
CREATE INDEX IF NOT EXISTS idx_survey_2024_created_at ON public.survey_responses_2024(created_at);

-- Enable RLS
ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_2024_updated_at ON public.survey_responses_2024;
CREATE TRIGGER update_survey_2024_updated_at
    BEFORE UPDATE ON public.survey_responses_2024
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '2024 Survey Table Created Successfully!';
    RAISE NOTICE '========================================';
END $$;
