-- =====================================================
-- SURVEY 2024 DATABASE TABLES CREATION SCRIPT
-- =====================================================
-- This script creates the complete database structure for Survey 2024
-- Based on the exact schema from Survey2024.tsx
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

-- Main survey responses table
CREATE TABLE survey_2024_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
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
    hard_commitments_2022 NUMERIC,
    hard_commitments_current NUMERIC,
    amount_invested_2022 NUMERIC,
    amount_invested_current NUMERIC,
    target_fund_size_2022 NUMERIC,
    target_fund_size_current NUMERIC,
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
    hurdle_rate_percentage NUMERIC,
    target_return_above_govt_debt NUMERIC,
    fundraising_barriers_other_description TEXT,
    
    -- Section 4: Investment Thesis (Questions 33-40)
    investment_considerations_other TEXT,
    additional_sdgs TEXT,
    
    -- Section 5: Pipeline Sourcing and Portfolio Construction (Questions 41-43)
    pipeline_sources_quality_other_enabled BOOLEAN,
    pipeline_sources_quality_other_description TEXT,
    pipeline_sources_quality_other_score NUMERIC,
    typical_investment_size VARCHAR(100),
    
    -- Section 6: Portfolio Value Creation and Exits (Questions 44-55)
    post_investment_priorities_other_enabled BOOLEAN,
    post_investment_priorities_other_description TEXT,
    post_investment_priorities_other_score NUMERIC,
    business_development_approach_other_enabled BOOLEAN,
    business_development_approach_other TEXT,
    unique_offerings_other_enabled BOOLEAN,
    unique_offerings_other_description TEXT,
    unique_offerings_other_score NUMERIC,
    typical_investment_timeframe VARCHAR(100),
    investment_monetisation_other_enabled BOOLEAN,
    investment_monetisation_other TEXT,
    
    -- Section 7: Performance to Date and Current Outlook (Questions 50-58)
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
    portfolio_performance_other_enabled BOOLEAN,
    portfolio_performance_other_description TEXT,
    portfolio_performance_other_category VARCHAR(100),
    portfolio_performance_other_value NUMERIC,
    direct_jobs_current INTEGER,
    indirect_jobs_current INTEGER,
    direct_jobs_anticipated INTEGER,
    indirect_jobs_anticipated INTEGER,
    employment_impact_other_enabled BOOLEAN,
    employment_impact_other_description TEXT,
    employment_impact_other_category VARCHAR(100),
    employment_impact_other_value INTEGER,
    fund_priorities_other_enabled BOOLEAN,
    fund_priorities_other_description TEXT,
    fund_priorities_other_category VARCHAR(100),
    data_sharing_other_enabled BOOLEAN,
    data_sharing_other TEXT,
    survey_sender VARCHAR(255),
    receive_results BOOLEAN DEFAULT FALSE,
    
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
    unique_offerings JSONB,
    fund_priorities_next_12m JSONB,
    data_sharing_willingness JSONB,
    
    -- Metadata
    user_id UUID,
    submission_status VARCHAR(50) DEFAULT 'draft',
    completion_percentage INTEGER DEFAULT 0
);

-- Junction tables for many-to-many relationships

-- Investment networks
CREATE TABLE survey_2024_investment_networks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    investment_networks VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geographic markets
CREATE TABLE survey_2024_geographic_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    geographic_markets VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team based locations
CREATE TABLE survey_2024_team_based (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    team_based VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment approval
CREATE TABLE survey_2024_investment_approval (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    investment_approval VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gender inclusion
CREATE TABLE survey_2024_gender_inclusion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    gender_inclusion VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal domicile
CREATE TABLE survey_2024_legal_domicile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    legal_domicile VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Domicile reason
CREATE TABLE survey_2024_domicile_reason (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    domicile_reason VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Concessionary capital
CREATE TABLE survey_2024_concessionary_capital (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    concessionary_capital VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GP financial commitment
CREATE TABLE survey_2024_gp_financial_commitment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    gp_financial_commitment VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business development approach
CREATE TABLE survey_2024_business_development_approach (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    business_development_approach VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment monetisation forms
CREATE TABLE survey_2024_investment_monetisation_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    investment_monetisation_forms VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data sharing willingness
CREATE TABLE survey_2024_data_sharing_willingness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2024_responses(id) ON DELETE CASCADE,
    data_sharing_willingness VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_survey_2024_responses_email ON survey_2024_responses(email_address);
CREATE INDEX idx_survey_2024_responses_created_at ON survey_2024_responses(created_at);
CREATE INDEX idx_survey_2024_responses_user_id ON survey_2024_responses(user_id);

-- Create indexes for junction tables
CREATE INDEX idx_survey_2024_investment_networks_response_id ON survey_2024_investment_networks(response_id);
CREATE INDEX idx_survey_2024_geographic_markets_response_id ON survey_2024_geographic_markets(response_id);
CREATE INDEX idx_survey_2024_team_based_response_id ON survey_2024_team_based(response_id);
CREATE INDEX idx_survey_2024_investment_approval_response_id ON survey_2024_investment_approval(response_id);
CREATE INDEX idx_survey_2024_gender_inclusion_response_id ON survey_2024_gender_inclusion(response_id);
CREATE INDEX idx_survey_2024_legal_domicile_response_id ON survey_2024_legal_domicile(response_id);
CREATE INDEX idx_survey_2024_domicile_reason_response_id ON survey_2024_domicile_reason(response_id);
CREATE INDEX idx_survey_2024_concessionary_capital_response_id ON survey_2024_concessionary_capital(response_id);
CREATE INDEX idx_survey_2024_gp_financial_commitment_response_id ON survey_2024_gp_financial_commitment(response_id);
CREATE INDEX idx_survey_2024_business_development_approach_response_id ON survey_2024_business_development_approach(response_id);
CREATE INDEX idx_survey_2024_investment_monetisation_forms_response_id ON survey_2024_investment_monetisation_forms(response_id);
CREATE INDEX idx_survey_2024_data_sharing_willingness_response_id ON survey_2024_data_sharing_willingness(response_id);

-- Add RLS (Row Level Security) policies
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

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view their own survey responses" ON survey_2024_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" ON survey_2024_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" ON survey_2024_responses
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for junction tables
CREATE POLICY "Users can manage their own investment_networks data" ON survey_2024_investment_networks
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own geographic_markets data" ON survey_2024_geographic_markets
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own team_based data" ON survey_2024_team_based
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own investment_approval data" ON survey_2024_investment_approval
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own gender_inclusion data" ON survey_2024_gender_inclusion
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own legal_domicile data" ON survey_2024_legal_domicile
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own domicile_reason data" ON survey_2024_domicile_reason
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own concessionary_capital data" ON survey_2024_concessionary_capital
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own gp_financial_commitment data" ON survey_2024_gp_financial_commitment
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own business_development_approach data" ON survey_2024_business_development_approach
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own investment_monetisation_forms data" ON survey_2024_investment_monetisation_forms
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own data_sharing_willingness data" ON survey_2024_data_sharing_willingness
    FOR ALL USING (response_id IN (SELECT id FROM survey_2024_responses WHERE user_id = auth.uid()));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_survey_2024_responses_updated_at 
    BEFORE UPDATE ON survey_2024_responses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMENT ON TABLE survey_2024_responses IS 'Main table for Survey 2024 responses with all form data';
COMMENT ON TABLE survey_2024_investment_networks IS 'Junction table for investment networks (many-to-many)';
COMMENT ON TABLE survey_2024_geographic_markets IS 'Junction table for geographic markets (many-to-many)';
COMMENT ON TABLE survey_2024_team_based IS 'Junction table for team based locations (many-to-many)';
COMMENT ON TABLE survey_2024_investment_approval IS 'Junction table for investment approval (many-to-many)';
COMMENT ON TABLE survey_2024_gender_inclusion IS 'Junction table for gender inclusion (many-to-many)';
COMMENT ON TABLE survey_2024_legal_domicile IS 'Junction table for legal domicile (many-to-many)';
COMMENT ON TABLE survey_2024_domicile_reason IS 'Junction table for domicile reason (many-to-many)';
COMMENT ON TABLE survey_2024_concessionary_capital IS 'Junction table for concessionary capital (many-to-many)';
COMMENT ON TABLE survey_2024_gp_financial_commitment IS 'Junction table for GP financial commitment (many-to-many)';
COMMENT ON TABLE survey_2024_business_development_approach IS 'Junction table for business development approach (many-to-many)';
COMMENT ON TABLE survey_2024_investment_monetisation_forms IS 'Junction table for investment monetisation forms (many-to-many)';
COMMENT ON TABLE survey_2024_data_sharing_willingness IS 'Junction table for data sharing willingness (many-to-many)';
