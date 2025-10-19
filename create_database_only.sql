-- =====================================================
-- CREATE DATABASE SCHEMA ONLY (NO DATA INSERTION)
-- =====================================================
-- This script only creates the database tables without inserting data
-- =====================================================

-- =====================================================
-- USER ROLES TABLE
-- =====================================================
DROP TABLE IF EXISTS user_roles CASCADE;

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- RLS for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to read user_roles"
ON user_roles FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert their own role"
ON user_roles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to update their own role"
ON user_roles FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for user_roles
CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_user_roles_email ON user_roles (email);

-- =====================================================
-- PROFILES TABLE
-- =====================================================
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    organization_name VARCHAR(255),
    role_title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own profile."
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Indexes for profiles
CREATE INDEX idx_profiles_email ON profiles (email);

-- =====================================================
-- SURVEY 2021 RESPONSES TABLE
-- =====================================================
DROP TABLE IF EXISTS survey_2021_responses CASCADE;

CREATE TABLE survey_2021_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(50) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Contact Information
    email_address VARCHAR(255) NOT NULL,
    firm_name VARCHAR(255),
    participant_name VARCHAR(255),
    role_title VARCHAR(255),

    -- Organizational Background
    geographic_focus TEXT,
    team_based_other TEXT,
    current_ftes INTEGER,
    fte_2022_est INTEGER,
    principals_count INTEGER,
    gender_inclusion_other TEXT,

    -- Vehicle Construct
    legal_domicile VARCHAR(255),
    legal_domicile_other TEXT,
    currency_investments VARCHAR(255),
    currency_lp_commitments VARCHAR(255),
    fund_operations VARCHAR(255),
    fund_operations_other TEXT,
    current_funds_raised VARCHAR(255),
    current_amount_invested VARCHAR(255),
    target_fund_size VARCHAR(255),
    target_investments VARCHAR(255),
    follow_on_investments VARCHAR(255),
    target_irr VARCHAR(255),
    target_irr_other TEXT,

    -- Investment Thesis
    business_stages JSONB,
    business_stages_other_description TEXT,
    enterprise_types TEXT[],
    financing_needs JSONB,
    financing_needs_other TEXT,
    sector_focus JSONB,
    sector_focus_other TEXT,
    financial_instruments JSONB,
    financial_instruments_other TEXT,
    sdg_ranking JSONB,
    gender_lens_investing JSONB,
    gender_lens_investing_other TEXT,
    technology_role VARCHAR(255),

    -- Pipeline Sourcing
    pipeline_sourcing JSONB,
    pipeline_sourcing_other TEXT,
    average_investment_size_per_company VARCHAR(255),

    -- Portfolio Value Creation
    portfolio_value_creation_priorities JSONB,
    portfolio_value_creation_other_selected BOOLEAN,
    portfolio_value_creation_other_description TEXT,
    typical_investment_timeframe VARCHAR(255),
    investment_monetization_exit_forms TEXT[],
    investment_monetization_exit_forms_other TEXT,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,

    -- Performance
    investments_made_to_date INTEGER,
    other_investments_supplement TEXT,
    anticipated_exits_12_months VARCHAR(255),
    revenue_growth_recent_12_months INTEGER,
    cash_flow_growth_recent_12_months INTEGER,
    revenue_growth_next_12_months INTEGER,
    cash_flow_growth_next_12_months INTEGER,
    portfolio_performance_other_selected BOOLEAN,
    revenue_growth_other INTEGER,
    cash_flow_growth_other INTEGER,
    portfolio_performance_other_description TEXT,
    direct_jobs_created_cumulative INTEGER,
    direct_jobs_anticipated_change INTEGER,
    indirect_jobs_created_cumulative INTEGER,
    indirect_jobs_anticipated_change INTEGER,
    jobs_impact_other_selected BOOLEAN,
    other_jobs_created_cumulative INTEGER,
    other_jobs_anticipated_change INTEGER,
    jobs_impact_other_description TEXT,
    fund_priority_areas JSONB,
    fund_priority_areas_other_selected BOOLEAN,
    fund_priority_areas_other_description TEXT,
    domestic_factors_concerns JSONB,
    domestic_factors_concerns_other_selected BOOLEAN,
    domestic_factors_concerns_other_description TEXT,
    international_factors_concerns JSONB,
    international_factors_concerns_other_selected BOOLEAN,
    international_factors_concerns_other_description TEXT,
    receive_results BOOLEAN DEFAULT false,

    -- Store all form data as JSONB
    form_data JSONB DEFAULT '{}'::jsonb
);

-- RLS for survey_2021_responses
ALTER TABLE survey_2021_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2021 survey responses."
ON survey_2021_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2021 survey responses."
ON survey_2021_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2021 survey responses."
ON survey_2021_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for survey_2021_responses
CREATE INDEX idx_survey_2021_responses_user_id ON survey_2021_responses (user_id);
CREATE INDEX idx_survey_2021_responses_submission_status ON survey_2021_responses (submission_status);

-- =====================================================
-- SURVEY 2022 RESPONSES TABLE
-- =====================================================
DROP TABLE IF EXISTS survey_2022_responses CASCADE;

CREATE TABLE survey_2022_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(50) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Contact Information
    email_address VARCHAR(255) NOT NULL,
    firm_name VARCHAR(255),
    participant_name VARCHAR(255),
    role_title VARCHAR(255),

    -- Organizational Background
    geographic_focus TEXT,
    team_based_other TEXT,
    current_ftes INTEGER,
    fte_2023_est INTEGER,
    principals_count INTEGER,
    gender_orientation_other TEXT,

    -- Vehicle Construct
    legal_domicile VARCHAR(255),
    legal_domicile_other TEXT,
    currency_investments VARCHAR(255),
    currency_lp_commitments VARCHAR(255),
    fund_operations VARCHAR(255),
    fund_operations_other TEXT,
    current_funds_raised VARCHAR(255),
    current_amount_invested VARCHAR(255),
    target_fund_size VARCHAR(255),
    target_investments VARCHAR(255),
    follow_on_investments VARCHAR(255),
    target_irr VARCHAR(255),
    target_irr_other TEXT,

    -- Investment Thesis
    business_stages JSONB,
    business_stages_other_description TEXT,
    enterprise_types TEXT[],
    financing_needs JSONB,
    financing_needs_other TEXT,
    sector_focus JSONB,
    sector_focus_other TEXT,
    financial_instruments JSONB,
    financial_instruments_other TEXT,
    sdg_ranking JSONB,
    gender_lens_investing JSONB,
    gender_lens_investing_other TEXT,
    technology_role VARCHAR(255),

    -- Pipeline Sourcing
    pipeline_sourcing JSONB,
    pipeline_sourcing_other TEXT,
    average_investment_size_per_company VARCHAR(255),

    -- Portfolio Value Creation
    portfolio_value_creation_priorities JSONB,
    portfolio_value_creation_other_selected BOOLEAN,
    portfolio_value_creation_other_description TEXT,
    typical_investment_timeframe VARCHAR(255),
    investment_monetization_exit_forms TEXT[],
    investment_monetization_exit_forms_other TEXT,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,

    -- Performance
    investments_made_to_date INTEGER,
    other_investments_supplement TEXT,
    anticipated_exits_12_months VARCHAR(255),
    revenue_growth_recent_12_months INTEGER,
    cash_flow_growth_recent_12_months INTEGER,
    revenue_growth_next_12_months INTEGER,
    cash_flow_growth_next_12_months INTEGER,
    portfolio_performance_other_selected BOOLEAN,
    revenue_growth_other INTEGER,
    cash_flow_growth_other INTEGER,
    portfolio_performance_other_description TEXT,
    direct_jobs_created_cumulative INTEGER,
    direct_jobs_anticipated_change INTEGER,
    indirect_jobs_created_cumulative INTEGER,
    indirect_jobs_anticipated_change INTEGER,
    jobs_impact_other_selected BOOLEAN,
    other_jobs_created_cumulative INTEGER,
    other_jobs_anticipated_change INTEGER,
    jobs_impact_other_description TEXT,
    fund_priority_areas JSONB,
    fund_priority_areas_other_selected BOOLEAN,
    fund_priority_areas_other_description TEXT,
    domestic_factors_concerns JSONB,
    domestic_factors_concerns_other_selected BOOLEAN,
    domestic_factors_concerns_other_description TEXT,
    international_factors_concerns JSONB,
    international_factors_concerns_other_selected BOOLEAN,
    international_factors_concerns_other_description TEXT,
    receive_results BOOLEAN DEFAULT false,

    -- Store all form data as JSONB
    form_data JSONB DEFAULT '{}'::jsonb
);

-- RLS for survey_2022_responses
ALTER TABLE survey_2022_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2022 survey responses."
ON survey_2022_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2022 survey responses."
ON survey_2022_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2022 survey responses."
ON survey_2022_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for survey_2022_responses
CREATE INDEX idx_survey_2022_responses_user_id ON survey_2022_responses (user_id);
CREATE INDEX idx_survey_2022_responses_submission_status ON survey_2022_responses (submission_status);

-- =====================================================
-- SURVEY 2023 RESPONSES TABLE
-- =====================================================
DROP TABLE IF EXISTS survey_2023_responses CASCADE;

CREATE TABLE survey_2023_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(50) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Contact Information
    email_address VARCHAR(255) NOT NULL,
    firm_name VARCHAR(255),
    participant_name VARCHAR(255),
    role_title VARCHAR(255),

    -- Organizational Background
    geographic_focus TEXT,
    team_based_other TEXT,
    current_ftes INTEGER,
    fte_2024_est INTEGER,
    principals_count INTEGER,
    gender_inclusion_other TEXT,

    -- Vehicle Construct
    legal_domicile VARCHAR(255),
    legal_domicile_other TEXT,
    currency_investments VARCHAR(255),
    currency_lp_commitments VARCHAR(255),
    fund_operations VARCHAR(255),
    fund_operations_other TEXT,
    current_funds_raised VARCHAR(255),
    current_amount_invested VARCHAR(255),
    target_fund_size VARCHAR(255),
    target_investments VARCHAR(255),
    follow_on_investments VARCHAR(255),
    target_irr VARCHAR(255),
    target_irr_other TEXT,

    -- Investment Thesis
    business_stages JSONB,
    business_stages_other_description TEXT,
    enterprise_types TEXT[],
    financing_needs JSONB,
    financing_needs_other TEXT,
    sector_focus JSONB,
    sector_focus_other TEXT,
    financial_instruments JSONB,
    financial_instruments_other TEXT,
    sdg_ranking JSONB,
    gender_lens_investing JSONB,
    gender_lens_investing_other TEXT,
    technology_role VARCHAR(255),

    -- Pipeline Sourcing
    pipeline_sourcing JSONB,
    pipeline_sourcing_other TEXT,
    average_investment_size_per_company VARCHAR(255),

    -- Portfolio Value Creation
    portfolio_value_creation_priorities JSONB,
    portfolio_value_creation_other_selected BOOLEAN,
    portfolio_value_creation_other_description TEXT,
    typical_investment_timeframe VARCHAR(255),
    investment_monetization_exit_forms TEXT[],
    investment_monetization_exit_forms_other TEXT,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,

    -- Performance
    investments_made_to_date INTEGER,
    other_investments_supplement TEXT,
    anticipated_exits_12_months VARCHAR(255),
    revenue_growth_recent_12_months INTEGER,
    cash_flow_growth_recent_12_months INTEGER,
    revenue_growth_next_12_months INTEGER,
    cash_flow_growth_next_12_months INTEGER,
    portfolio_performance_other_selected BOOLEAN,
    revenue_growth_other INTEGER,
    cash_flow_growth_other INTEGER,
    portfolio_performance_other_description TEXT,
    direct_jobs_created_cumulative INTEGER,
    direct_jobs_anticipated_change INTEGER,
    indirect_jobs_created_cumulative INTEGER,
    indirect_jobs_anticipated_change INTEGER,
    jobs_impact_other_selected BOOLEAN,
    other_jobs_created_cumulative INTEGER,
    other_jobs_anticipated_change INTEGER,
    jobs_impact_other_description TEXT,
    fund_priority_areas JSONB,
    fund_priority_areas_other_selected BOOLEAN,
    fund_priority_areas_other_description TEXT,
    domestic_factors_concerns JSONB,
    domestic_factors_concerns_other_selected BOOLEAN,
    domestic_factors_concerns_other_description TEXT,
    international_factors_concerns JSONB,
    international_factors_concerns_other_selected BOOLEAN,
    international_factors_concerns_other_description TEXT,
    receive_results BOOLEAN DEFAULT false,

    -- Store all form data as JSONB
    form_data JSONB DEFAULT '{}'::jsonb
);

-- RLS for survey_2023_responses
ALTER TABLE survey_2023_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2023 survey responses."
ON survey_2023_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2023 survey responses."
ON survey_2023_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2023 survey responses."
ON survey_2023_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for survey_2023_responses
CREATE INDEX idx_survey_2023_responses_user_id ON survey_2023_responses (user_id);
CREATE INDEX idx_survey_2023_responses_submission_status ON survey_2023_responses (submission_status);

-- =====================================================
-- SURVEY 2024 RESPONSES TABLE
-- =====================================================
DROP TABLE IF EXISTS survey_2024_responses CASCADE;

CREATE TABLE survey_2024_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(50) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Contact Information
    email_address VARCHAR(255) NOT NULL,
    firm_name VARCHAR(255),
    participant_name VARCHAR(255),
    role_title VARCHAR(255),

    -- Organizational Background
    geographic_focus TEXT,
    team_based_other TEXT,
    current_ftes INTEGER,
    fte_2025_est INTEGER,
    principals_count INTEGER,
    gender_inclusion_other TEXT,

    -- Vehicle Construct
    legal_domicile VARCHAR(255),
    legal_domicile_other TEXT,
    currency_investments VARCHAR(255),
    currency_lp_commitments VARCHAR(255),
    fund_operations VARCHAR(255),
    fund_operations_other TEXT,
    current_funds_raised VARCHAR(255),
    current_amount_invested VARCHAR(255),
    target_fund_size VARCHAR(255),
    target_investments VARCHAR(255),
    follow_on_investments VARCHAR(255),
    target_irr VARCHAR(255),
    target_irr_other TEXT,

    -- Investment Thesis
    business_stages JSONB,
    business_stages_other_description TEXT,
    enterprise_types TEXT[],
    financing_needs JSONB,
    financing_needs_other TEXT,
    sector_focus JSONB,
    sector_focus_other TEXT,
    financial_instruments JSONB,
    financial_instruments_other TEXT,
    sdg_ranking JSONB,
    gender_lens_investing JSONB,
    gender_lens_investing_other TEXT,
    technology_role VARCHAR(255),

    -- Pipeline Sourcing
    pipeline_sourcing JSONB,
    pipeline_sourcing_other TEXT,
    average_investment_size_per_company VARCHAR(255),

    -- Portfolio Value Creation
    portfolio_value_creation_priorities JSONB,
    portfolio_value_creation_other_selected BOOLEAN,
    portfolio_value_creation_other_description TEXT,
    typical_investment_timeframe VARCHAR(255),
    investment_monetization_exit_forms TEXT[],
    investment_monetization_exit_forms_other TEXT,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,

    -- Performance
    investments_made_to_date INTEGER,
    other_investments_supplement TEXT,
    anticipated_exits_12_months VARCHAR(255),
    revenue_growth_recent_12_months INTEGER,
    cash_flow_growth_recent_12_months INTEGER,
    revenue_growth_next_12_months INTEGER,
    cash_flow_growth_next_12_months INTEGER,
    portfolio_performance_other_selected BOOLEAN,
    revenue_growth_other INTEGER,
    cash_flow_growth_other INTEGER,
    portfolio_performance_other_description TEXT,
    direct_jobs_created_cumulative INTEGER,
    direct_jobs_anticipated_change INTEGER,
    indirect_jobs_created_cumulative INTEGER,
    indirect_jobs_anticipated_change INTEGER,
    jobs_impact_other_selected BOOLEAN,
    other_jobs_created_cumulative INTEGER,
    other_jobs_anticipated_change INTEGER,
    jobs_impact_other_description TEXT,
    fund_priority_areas JSONB,
    fund_priority_areas_other_selected BOOLEAN,
    fund_priority_areas_other_description TEXT,
    domestic_factors_concerns JSONB,
    domestic_factors_concerns_other_selected BOOLEAN,
    domestic_factors_concerns_other_description TEXT,
    international_factors_concerns JSONB,
    international_factors_concerns_other_selected BOOLEAN,
    international_factors_concerns_other_description TEXT,
    receive_results BOOLEAN DEFAULT false,

    -- Store all form data as JSONB
    form_data JSONB DEFAULT '{}'::jsonb
);

-- RLS for survey_2024_responses
ALTER TABLE survey_2024_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2024 survey responses."
ON survey_2024_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2024 survey responses."
ON survey_2024_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2024 survey responses."
ON survey_2024_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for survey_2024_responses
CREATE INDEX idx_survey_2024_responses_user_id ON survey_2024_responses (user_id);
CREATE INDEX idx_survey_2024_responses_submission_status ON survey_2024_responses (submission_status);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Database schema created successfully!
-- You can now test the survey functionality.
-- =====================================================
