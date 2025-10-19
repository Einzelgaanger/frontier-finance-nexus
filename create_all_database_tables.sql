-- =====================================================
-- COMPLETE DATABASE SETUP FOR ALL SURVEYS
-- =====================================================
-- Run this entire script in your Supabase SQL editor
-- This creates all necessary tables for all surveys
-- =====================================================

-- =====================================================
-- SURVEY 2024 TABLES
-- =====================================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS survey_2024_responses CASCADE;
DROP TABLE IF EXISTS survey_2024_investment_networks CASCADE;
DROP TABLE IF EXISTS survey_2024_geographic_markets CASCADE;
DROP TABLE IF EXISTS survey_2024_team_based CASCADE;
DROP TABLE IF EXISTS survey_2024_investment_approval CASCADE;
DROP TABLE IF EXISTS survey_2024_gender_inclusion CASCADE;
DROP TABLE IF EXISTS survey_2024_legal_domicile CASCADE;
DROP TABLE IF EXISTS survey_2024_domicile_reason CASCADE;
DROP TABLE IF EXISTS survey_2024_concessionary_capital CASCADE;
DROP TABLE IF EXISTS survey_2024_gp_financial_commitment CASCADE;
DROP TABLE IF EXISTS survey_2024_business_development_approach CASCADE;
DROP TABLE IF EXISTS survey_2024_investment_monetisation_forms CASCADE;
DROP TABLE IF EXISTS survey_2024_data_sharing_willingness CASCADE;

-- Main survey responses table for 2024
CREATE TABLE survey_2024_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Section 1: Introduction & Context (Questions 1-5)
    email_address VARCHAR(255) NOT NULL,
    investment_networks_other TEXT,
    organisation_name VARCHAR(255) NOT NULL,
    funds_raising_investing VARCHAR(100) NOT NULL,
    fund_name VARCHAR(255) NOT NULL,
    
    -- Section 2: Organizational Background and Team (Questions 6-14)
    legal_entity_achieved VARCHAR(50),
    first_close_achieved VARCHAR(50),
    first_investment_achieved VARCHAR(50),
    geographic_markets_other TEXT,
    team_based_other TEXT,
    fte_staff_2023_actual INTEGER,
    fte_staff_current INTEGER,
    fte_staff_2025_forecast INTEGER,
    investment_approval_other TEXT,
    principals_total INTEGER,
    principals_women INTEGER,
    gender_inclusion_other TEXT,
    
    -- Section 3: Vehicle Construct (Questions 15-32)
    legal_domicile_other TEXT,
    domicile_reason_other TEXT,
    regulatory_impact_other TEXT,
    currency_investments VARCHAR(100),
    currency_lp_commitments VARCHAR(100),
    currency_hedging_strategy VARCHAR(100),
    currency_hedging_details TEXT,
    fund_type_status VARCHAR(100),
    fund_type_status_other TEXT,
    hard_commitments_2022 INTEGER,
    hard_commitments_current INTEGER,
    amount_invested_2022 INTEGER,
    amount_invested_current INTEGER,
    target_fund_size_2022 INTEGER,
    target_fund_size_current INTEGER,
    target_number_investments INTEGER,
    follow_on_permitted VARCHAR(100),
    concessionary_capital_other TEXT,
    existing_lp_sources_other_description TEXT,
    target_lp_sources_other_description TEXT,
    gp_financial_commitment_other TEXT,
    gp_management_fee VARCHAR(100),
    gp_management_fee_other TEXT,
    hurdle_rate_currency VARCHAR(100),
    hurdle_rate_currency_other TEXT,
    hurdle_rate_percentage INTEGER,
    target_return_above_govt_debt INTEGER,
    fundraising_barriers_other_description TEXT,
    
    -- Section 4: Investment Thesis
    investment_considerations_other TEXT,
    additional_sdgs TEXT,
    
    -- Section 5: Pipeline Sourcing and Portfolio Construction
    pipeline_sources_quality_other_enabled BOOLEAN DEFAULT FALSE,
    pipeline_sources_quality_other_description TEXT,
    pipeline_sources_quality_other_score INTEGER DEFAULT 0,
    typical_investment_size VARCHAR(100),
    
    -- Section 6: Portfolio Value Creation and Exits
    post_investment_priorities_other_enabled BOOLEAN DEFAULT FALSE,
    post_investment_priorities_other_description TEXT,
    post_investment_priorities_other_score INTEGER DEFAULT 0,
    business_development_approach_other_enabled BOOLEAN DEFAULT FALSE,
    business_development_approach_other TEXT,
    business_development_support_other TEXT,
    investment_monetisation_other_enabled BOOLEAN DEFAULT FALSE,
    investment_monetisation_other TEXT,
    
    -- Section 7: Performance to Date and Current Outlook
    other_investments_supplement TEXT,
    portfolio_performance_other_enabled BOOLEAN DEFAULT FALSE,
    portfolio_performance_other_description TEXT,
    portfolio_performance_other_category VARCHAR(100),
    portfolio_performance_other_value INTEGER,
    employment_impact_other_enabled BOOLEAN DEFAULT FALSE,
    employment_impact_other_description TEXT,
    employment_impact_other_category VARCHAR(100),
    employment_impact_other_value INTEGER,
    fund_priorities_other_enabled BOOLEAN DEFAULT FALSE,
    fund_priorities_other_description TEXT,
    fund_priorities_other_category VARCHAR(100),
    data_sharing_other_enabled BOOLEAN DEFAULT FALSE,
    data_sharing_other TEXT,
    
    -- JSON fields for complex data structures
    team_experience_investments JSONB,
    team_experience_exits JSONB,
    regulatory_impact JSONB,
    existing_lp_sources JSONB,
    target_lp_sources JSONB,
    fundraising_barriers JSONB,
    business_stages JSONB,
    revenue_growth_mix JSONB,
    financing_needs JSONB,
    sector_target_allocation JSONB,
    investment_considerations JSONB,
    financial_instruments_ranking JSONB,
    top_sdgs JSONB,
    gender_lens_investing JSONB,
    pipeline_sources_quality JSONB,
    sgb_financing_trends JSONB,
    post_investment_priorities JSONB,
    technical_assistance_funding JSONB,
    business_development_approach JSONB,
    investment_monetisation_forms JSONB,
    equity_investments_made INTEGER,
    debt_investments_made INTEGER,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,
    equity_exits_anticipated INTEGER,
    debt_repayments_anticipated INTEGER,
    portfolio_revenue_growth_12m INTEGER,
    portfolio_revenue_growth_next_12m INTEGER,
    portfolio_cashflow_growth_12m INTEGER,
    portfolio_cashflow_growth_next_12m INTEGER,
    direct_jobs_current INTEGER,
    indirect_jobs_current INTEGER,
    direct_jobs_anticipated INTEGER,
    indirect_jobs_anticipated INTEGER,
    fund_priorities JSONB,
    concerns_ranking JSONB,
    data_sharing_willingness JSONB,
    one_on_one_meeting VARCHAR(10),
    receive_survey_results BOOLEAN DEFAULT FALSE
);

-- Junction tables for many-to-many relationships
CREATE TABLE survey_2024_investment_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    network VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_geographic_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    market VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_team_based (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_investment_approval (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    approval_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_gender_inclusion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    inclusion_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_legal_domicile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    domicile VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_domicile_reason (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    reason VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_concessionary_capital (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    capital_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_gp_financial_commitment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    commitment_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_business_development_approach (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    approach VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_investment_monetisation_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    form VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE survey_2024_data_sharing_willingness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    data_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE survey_2024_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_investment_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_geographic_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_team_based ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_investment_approval ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_gender_inclusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_legal_domicile ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_domicile_reason ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_concessionary_capital ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_gp_financial_commitment ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_business_development_approach ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_investment_monetisation_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_data_sharing_willingness ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own survey responses" ON survey_2024_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" ON survey_2024_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" ON survey_2024_responses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own survey responses" ON survey_2024_responses
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_survey_2024_responses_user_id ON survey_2024_responses(user_id);
CREATE INDEX idx_survey_2024_responses_created_at ON survey_2024_responses(created_at);
CREATE INDEX idx_survey_2024_responses_submission_status ON survey_2024_responses(submission_status);

-- =====================================================
-- SURVEY 2023 TABLES (Simplified for now)
-- =====================================================

DROP TABLE IF EXISTS survey_2023_responses CASCADE;

CREATE TABLE survey_2023_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Basic fields for now - can be expanded later
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255) NOT NULL,
    funds_raising_investing VARCHAR(100) NOT NULL,
    fund_name VARCHAR(255) NOT NULL,
    
    -- JSON fields for complex data
    geographic_markets JSONB,
    team_based JSONB,
    gender_inclusion JSONB,
    team_experience_investments JSONB,
    team_experience_exits JSONB,
    legal_domicile JSONB,
    concessionary_capital JSONB,
    lp_capital_sources_existing JSONB,
    lp_capital_sources_target JSONB,
    gp_financial_commitment JSONB,
    fundraising_constraints JSONB,
    business_stages JSONB,
    growth_expectations JSONB,
    financing_needs JSONB,
    sector_focus JSONB,
    financial_instruments JSONB,
    sdg_ranking JSONB,
    gender_lens_investing JSONB,
    pipeline_sourcing JSONB,
    portfolio_funding_mix JSONB,
    portfolio_value_creation_priorities JSONB,
    technical_assistance_funding JSONB,
    business_development_approach JSONB,
    investment_monetisation_forms JSONB,
    portfolio_performance JSONB,
    jobs_impact JSONB,
    fund_priorities JSONB,
    concerns_ranking JSONB,
    
    -- Text fields
    geographic_markets_other TEXT,
    team_based_other TEXT,
    gender_inclusion_other TEXT,
    team_experience_other TEXT,
    other_experience_selected BOOLEAN DEFAULT FALSE,
    legal_domicile_other TEXT,
    fund_type_status_other TEXT,
    concessionary_capital_other TEXT,
    gp_financial_commitment_other TEXT,
    gp_management_fee_other TEXT,
    hurdle_rate_currency_other TEXT,
    fundraising_constraints_other TEXT,
    other_constraint_selected BOOLEAN DEFAULT FALSE,
    sector_focus_other TEXT,
    financial_instruments_other TEXT,
    gender_lens_investing_other TEXT,
    gender_other_selected BOOLEAN DEFAULT FALSE,
    pipeline_sourcing_other TEXT,
    portfolio_funding_mix_other TEXT,
    portfolio_value_creation_other TEXT,
    portfolio_other_selected BOOLEAN DEFAULT FALSE,
    technical_assistance_funding_other TEXT,
    business_development_approach_other TEXT,
    business_development_support_other TEXT,
    exit_form_other TEXT,
    other_investments_description TEXT,
    portfolio_performance_other_description TEXT,
    portfolio_performance_other_selected BOOLEAN DEFAULT FALSE,
    jobs_impact_other_description TEXT,
    jobs_impact_other_selected BOOLEAN DEFAULT FALSE,
    fund_priorities_other_description TEXT,
    fund_priorities_other_selected BOOLEAN DEFAULT FALSE,
    concerns_ranking_other TEXT,
    concerns_other_selected BOOLEAN DEFAULT FALSE,
    future_research_data_other TEXT,
    
    -- Numeric fields
    fte_staff_2022 INTEGER,
    fte_staff_current INTEGER,
    fte_staff_2024_est INTEGER,
    principals_count INTEGER,
    current_funds_raised INTEGER,
    current_amount_invested INTEGER,
    target_fund_size INTEGER,
    target_investments_count INTEGER,
    hurdle_rate_percentage INTEGER,
    equity_investments_count INTEGER,
    debt_investments_count INTEGER,
    equity_exits_count INTEGER,
    debt_exits_count INTEGER,
    equity_exits_anticipated INTEGER,
    debt_exits_anticipated INTEGER,
    
    -- String fields
    legal_entity_achieved VARCHAR(50),
    first_close_achieved VARCHAR(50),
    first_investment_achieved VARCHAR(50),
    currency_investments VARCHAR(100),
    currency_lp_commitments VARCHAR(100),
    fund_type_status VARCHAR(100),
    follow_on_investment_permitted VARCHAR(100),
    gp_management_fee VARCHAR(100),
    hurdle_rate_currency VARCHAR(100),
    average_investment_size_per_company VARCHAR(100),
    typical_investment_timeframe VARCHAR(100),
    one_on_one_meeting VARCHAR(10),
    receive_survey_results BOOLEAN DEFAULT FALSE,
    
    -- Complex JSON fields
    target_local_currency_return_methods JSONB,
    lp_capital_sources_other_description TEXT,
    target_local_currency_return TEXT
);

-- Enable RLS for 2023
ALTER TABLE survey_2023_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 2023
CREATE POLICY "Users can view their own 2023 survey responses" ON survey_2023_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2023 survey responses" ON survey_2023_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2023 survey responses" ON survey_2023_responses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 2023 survey responses" ON survey_2023_responses
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for 2023
CREATE INDEX idx_survey_2023_responses_user_id ON survey_2023_responses(user_id);
CREATE INDEX idx_survey_2023_responses_created_at ON survey_2023_responses(created_at);
CREATE INDEX idx_survey_2023_responses_submission_status ON survey_2023_responses(submission_status);

-- =====================================================
-- SURVEY 2022 TABLES (Simplified)
-- =====================================================

DROP TABLE IF EXISTS survey_2022_responses CASCADE;

CREATE TABLE survey_2022_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Basic fields
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255) NOT NULL,
    funds_raising_investing VARCHAR(100) NOT NULL,
    fund_name VARCHAR(255) NOT NULL,
    
    -- JSON fields for complex data
    geographic_markets JSONB,
    team_based JSONB,
    gender_orientation JSONB,
    legal_domicile JSONB,
    concessionary_capital JSONB,
    lp_capital_sources JSONB,
    business_stages JSONB,
    enterprise_types JSONB,
    financing_needs JSONB,
    sector_activities JSONB,
    financial_instruments JSONB,
    sdg_targets JSONB,
    gender_lens_investing JSONB,
    pipeline_sourcing JSONB,
    portfolio_value_creation_priorities JSONB,
    investment_monetisation_forms JSONB,
    fund_priority_areas JSONB,
    domestic_factors_concerns JSONB,
    international_factors_concerns JSONB,
    
    -- Text fields
    geographic_markets_other TEXT,
    team_based_other TEXT,
    gender_orientation_other TEXT,
    gp_experience_other_description TEXT,
    legal_domicile_other TEXT,
    fund_operations_other TEXT,
    target_irr_other TEXT,
    concessionary_capital_other TEXT,
    lp_capital_sources_other_description TEXT,
    management_fee_other TEXT,
    carried_interest_hurdle_other TEXT,
    fundraising_constraints_other_description TEXT,
    business_stages_other_description TEXT,
    financing_needs_other_description TEXT,
    sector_activities_other_description TEXT,
    financial_instruments_other_description TEXT,
    gender_lens_investing_other_description TEXT,
    pipeline_sourcing_other_description TEXT,
    portfolio_value_creation_other_description TEXT,
    portfolio_value_creation_other_selected BOOLEAN DEFAULT FALSE,
    investment_monetisation_forms_other TEXT,
    portfolio_performance_other_description TEXT,
    portfolio_performance_other_selected BOOLEAN DEFAULT FALSE,
    jobs_impact_other_description TEXT,
    jobs_impact_other_selected BOOLEAN DEFAULT FALSE,
    fund_priority_areas_other_description TEXT,
    fund_priority_areas_other_selected BOOLEAN DEFAULT FALSE,
    domestic_factors_concerns_other_description TEXT,
    domestic_factors_concerns_other_selected BOOLEAN DEFAULT FALSE,
    international_factors_concerns_other_description TEXT,
    international_factors_concerns_other_selected BOOLEAN DEFAULT FALSE,
    
    -- Numeric fields
    fte_staff_current INTEGER,
    fte_staff_2023_est INTEGER,
    principals_count INTEGER,
    principals_women INTEGER,
    current_funds_raised INTEGER,
    current_amount_invested INTEGER,
    target_fund_size INTEGER,
    target_investments_count INTEGER,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,
    investments_made_to_date INTEGER,
    revenue_growth_recent_12_months INTEGER,
    cash_flow_growth_recent_12_months INTEGER,
    revenue_growth_next_12_months INTEGER,
    cash_flow_growth_next_12_months INTEGER,
    revenue_growth_other INTEGER,
    cash_flow_growth_other INTEGER,
    direct_jobs_created_cumulative INTEGER,
    direct_jobs_anticipated_change INTEGER,
    indirect_jobs_created_cumulative INTEGER,
    indirect_jobs_anticipated_change INTEGER,
    other_jobs_created_cumulative INTEGER,
    other_jobs_anticipated_change INTEGER,
    
    -- String fields
    legal_entity_achieved VARCHAR(50),
    first_close_achieved VARCHAR(50),
    first_investment_achieved VARCHAR(50),
    currency_investments VARCHAR(100),
    currency_lp_commitments VARCHAR(100),
    fund_operations VARCHAR(100),
    follow_on_investment_permitted VARCHAR(100),
    target_irr VARCHAR(100),
    gp_financial_commitment VARCHAR(100),
    management_fee VARCHAR(100),
    carried_interest_hurdle VARCHAR(100),
    average_investment_size_per_company VARCHAR(100),
    typical_investment_timeframe VARCHAR(100),
    anticipated_exits_12_months VARCHAR(100),
    receive_results BOOLEAN DEFAULT FALSE,
    
    -- Complex JSON fields
    gp_experience JSONB,
    fundraising_constraints JSONB,
    other_investments_supplement TEXT
);

-- Enable RLS for 2022
ALTER TABLE survey_2022_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 2022
CREATE POLICY "Users can view their own 2022 survey responses" ON survey_2022_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2022 survey responses" ON survey_2022_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2022 survey responses" ON survey_2022_responses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 2022 survey responses" ON survey_2022_responses
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for 2022
CREATE INDEX idx_survey_2022_responses_user_id ON survey_2022_responses(user_id);
CREATE INDEX idx_survey_2022_responses_created_at ON survey_2022_responses(created_at);
CREATE INDEX idx_survey_2022_responses_submission_status ON survey_2022_responses(submission_status);

-- =====================================================
-- SURVEY 2021 TABLES (Simplified)
-- =====================================================

DROP TABLE IF EXISTS survey_2021_responses CASCADE;

CREATE TABLE survey_2021_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Basic fields
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255) NOT NULL,
    funds_raising_investing VARCHAR(100) NOT NULL,
    fund_name VARCHAR(255) NOT NULL,
    
    -- JSON fields for complex data
    team_based JSONB,
    geographic_focus JSONB,
    gender_inclusion JSONB,
    legal_domicile JSONB,
    concessionary_capital JSONB,
    business_stages JSONB,
    financing_needs JSONB,
    sector_focus JSONB,
    financial_instruments JSONB,
    sdg_targets JSONB,
    gender_lens_investing JSONB,
    pipeline_sourcing JSONB,
    portfolio_value_creation_priorities JSONB,
    investment_monetisation_forms JSONB,
    fund_priorities JSONB,
    concerns_ranking JSONB,
    
    -- Text fields
    team_based_other TEXT,
    geographic_focus_other TEXT,
    gender_inclusion_other TEXT,
    legal_domicile_other TEXT,
    concessionary_capital_other TEXT,
    business_stages_other_description TEXT,
    financing_needs_other_description TEXT,
    sector_focus_other_description TEXT,
    financial_instruments_other_description TEXT,
    gender_lens_investing_other_description TEXT,
    pipeline_sourcing_other_description TEXT,
    portfolio_value_creation_other_description TEXT,
    portfolio_value_creation_other_selected BOOLEAN DEFAULT FALSE,
    investment_monetisation_forms_other TEXT,
    fund_priorities_other_description TEXT,
    fund_priorities_other_selected BOOLEAN DEFAULT FALSE,
    concerns_ranking_other_description TEXT,
    concerns_other_selected BOOLEAN DEFAULT FALSE,
    
    -- Numeric fields
    fte_staff_current INTEGER,
    fte_staff_2022_est INTEGER,
    principals_count INTEGER,
    principals_women INTEGER,
    current_funds_raised INTEGER,
    current_amount_invested INTEGER,
    target_fund_size INTEGER,
    target_investments_count INTEGER,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,
    investments_made_to_date INTEGER,
    revenue_growth_recent_12_months INTEGER,
    cash_flow_growth_recent_12_months INTEGER,
    revenue_growth_next_12_months INTEGER,
    cash_flow_growth_next_12_months INTEGER,
    revenue_growth_other INTEGER,
    cash_flow_growth_other INTEGER,
    direct_jobs_created_cumulative INTEGER,
    direct_jobs_anticipated_change INTEGER,
    indirect_jobs_created_cumulative INTEGER,
    indirect_jobs_anticipated_change INTEGER,
    other_jobs_created_cumulative INTEGER,
    other_jobs_anticipated_change INTEGER,
    
    -- String fields
    legal_entity_achieved VARCHAR(50),
    first_close_achieved VARCHAR(50),
    first_investment_achieved VARCHAR(50),
    currency_investments VARCHAR(100),
    currency_lp_commitments VARCHAR(100),
    fund_operations VARCHAR(100),
    follow_on_investment_permitted VARCHAR(100),
    target_irr VARCHAR(100),
    gp_financial_commitment VARCHAR(100),
    management_fee VARCHAR(100),
    carried_interest_hurdle VARCHAR(100),
    average_investment_size_per_company VARCHAR(100),
    typical_investment_timeframe VARCHAR(100),
    anticipated_exits_12_months VARCHAR(100),
    receive_results BOOLEAN DEFAULT FALSE,
    
    -- Complex JSON fields
    gp_experience JSONB,
    fundraising_constraints JSONB,
    other_investments_supplement TEXT
);

-- Enable RLS for 2021
ALTER TABLE survey_2021_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for 2021
CREATE POLICY "Users can view their own 2021 survey responses" ON survey_2021_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2021 survey responses" ON survey_2021_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2021 survey responses" ON survey_2021_responses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own 2021 survey responses" ON survey_2021_responses
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for 2021
CREATE INDEX idx_survey_2021_responses_user_id ON survey_2021_responses(user_id);
CREATE INDEX idx_survey_2021_responses_created_at ON survey_2021_responses(created_at);
CREATE INDEX idx_survey_2021_responses_submission_status ON survey_2021_responses(submission_status);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- All database tables have been created successfully!
-- You can now save drafts and submit surveys.
-- =====================================================

