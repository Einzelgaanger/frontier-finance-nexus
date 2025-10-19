-- =====================================================
-- SURVEY 2023 DATABASE TABLES CREATION SCRIPT
-- =====================================================
-- This script creates the complete database structure for Survey 2023
-- Based on the exact schema from Survey2023.tsx
-- =====================================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS survey_2023_responses CASCADE;
DROP TABLE IF EXISTS survey_2023_geographic_markets CASCADE;
DROP TABLE IF EXISTS survey_2023_team_based CASCADE;
DROP TABLE IF EXISTS survey_2023_legal_domicile CASCADE;
DROP TABLE IF EXISTS survey_2023_concessionary_capital CASCADE;
DROP TABLE IF EXISTS survey_2023_gp_financial_commitment CASCADE;
DROP TABLE IF EXISTS survey_2023_gender_inclusion CASCADE;
DROP TABLE IF EXISTS survey_2023_sustainable_development_goals CASCADE;
DROP TABLE IF EXISTS survey_2023_business_development_approach CASCADE;
DROP TABLE IF EXISTS survey_2023_exit_form CASCADE;
DROP TABLE IF EXISTS survey_2023_future_research_data CASCADE;

-- Main survey responses table
CREATE TABLE survey_2023_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Section 1: Introduction & Context
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255) NOT NULL,
    funds_raising_investing VARCHAR(100) NOT NULL,
    fund_name VARCHAR(255) NOT NULL,
    
    -- Section 2: Organizational Background and Team
    legal_entity_achieved VARCHAR(50),
    first_close_achieved VARCHAR(50),
    first_investment_achieved VARCHAR(50),
    geographic_markets_other TEXT,
    team_based_other TEXT,
    fte_staff_2022 INTEGER,
    fte_staff_current INTEGER,
    fte_staff_2024_est INTEGER,
    principals_count INTEGER,
    gender_inclusion_other TEXT,
    team_experience_other TEXT,
    other_experience_selected BOOLEAN,
    
    -- Section 3: Vehicle Construct
    legal_domicile_other TEXT,
    currency_investments VARCHAR(100) NOT NULL,
    currency_lp_commitments VARCHAR(100) NOT NULL,
    fund_type_status VARCHAR(100) NOT NULL,
    fund_type_status_other TEXT,
    current_funds_raised NUMERIC,
    current_amount_invested NUMERIC,
    target_fund_size NUMERIC,
    target_investments_count INTEGER,
    follow_on_investment_permitted VARCHAR(100) NOT NULL,
    concessionary_capital_other TEXT,
    gp_financial_commitment_other TEXT,
    gp_management_fee VARCHAR(100) NOT NULL,
    gp_management_fee_other TEXT,
    hurdle_rate_currency VARCHAR(100) NOT NULL,
    hurdle_rate_currency_other TEXT,
    hurdle_rate_percentage NUMERIC,
    target_local_currency_return NUMERIC,
    fundraising_constraints_other TEXT,
    other_constraint_selected BOOLEAN,
    
    -- Section 4: Investment Thesis
    sector_focus_other TEXT,
    gender_lens_investing_other TEXT,
    gender_other_selected BOOLEAN,
    
    -- Section 5: Pipeline Sourcing and Portfolio Construction
    pipeline_sourcing_other TEXT,
    average_investment_size VARCHAR(100) NOT NULL,
    capital_raise_percentage NUMERIC,
    portfolio_funding_mix_other TEXT,
    
    -- Section 6: Portfolio Value Creation and Exits
    portfolio_priorities_other TEXT,
    portfolio_value_creation_other TEXT,
    portfolio_other_selected BOOLEAN,
    technical_assistance_funding_other TEXT,
    business_development_approach_other TEXT,
    business_development_support_other TEXT,
    investment_timeframe VARCHAR(100) NOT NULL,
    exit_form_other TEXT,
    
    -- Section 7: Performance to Date and Current Outlook
    equity_exits_anticipated INTEGER,
    debt_exits_anticipated INTEGER,
    other_investments_description TEXT,
    other_investments TEXT,
    portfolio_performance_other_selected BOOLEAN,
    portfolio_performance_other_description TEXT,
    jobs_impact_other_selected BOOLEAN,
    jobs_impact_other_description TEXT,
    fund_priorities_other_selected BOOLEAN,
    fund_priorities_other_description TEXT,
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
    concerns_ranking_other TEXT,
    concerns_other_selected BOOLEAN,
    
    -- Section 8: Future Research
    future_research_data_other TEXT,
    one_on_one_meeting VARCHAR(100),
    receive_survey_results BOOLEAN DEFAULT FALSE,
    
    -- JSON fields for complex data structures
    team_experience_investments JSONB,
    team_experience_exits JSONB,
    lp_capital_sources_existing JSONB,
    lp_capital_sources_target JSONB,
    target_local_currency_return_methods JSONB,
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
    portfolio_priorities JSONB,
    portfolio_value_creation_priorities JSONB,
    technical_assistance_funding JSONB,
    business_development_support JSONB,
    portfolio_performance JSONB,
    jobs_impact JSONB,
    fund_priorities JSONB,
    concerns_ranking JSONB,
    
    -- Metadata
    user_id UUID,
    submission_status VARCHAR(50) DEFAULT 'draft',
    completion_percentage INTEGER DEFAULT 0
);

-- Junction tables for many-to-many relationships

-- Geographic markets
CREATE TABLE survey_2023_geographic_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    geographic_markets VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team based locations
CREATE TABLE survey_2023_team_based (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    team_based VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legal domicile
CREATE TABLE survey_2023_legal_domicile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    legal_domicile VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Concessionary capital
CREATE TABLE survey_2023_concessionary_capital (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    concessionary_capital VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GP financial commitment
CREATE TABLE survey_2023_gp_financial_commitment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    gp_financial_commitment VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gender inclusion
CREATE TABLE survey_2023_gender_inclusion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    gender_inclusion VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sustainable development goals
CREATE TABLE survey_2023_sustainable_development_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    sustainable_development_goals VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business development approach
CREATE TABLE survey_2023_business_development_approach (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    business_development_approach VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exit form
CREATE TABLE survey_2023_exit_form (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    exit_form VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Future research data
CREATE TABLE survey_2023_future_research_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2023_responses(id) ON DELETE CASCADE,
    future_research_data VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_survey_2023_responses_email ON survey_2023_responses(email_address);
CREATE INDEX idx_survey_2023_responses_created_at ON survey_2023_responses(created_at);
CREATE INDEX idx_survey_2023_responses_user_id ON survey_2023_responses(user_id);

-- Create indexes for junction tables
CREATE INDEX idx_survey_2023_geographic_markets_response_id ON survey_2023_geographic_markets(response_id);
CREATE INDEX idx_survey_2023_team_based_response_id ON survey_2023_team_based(response_id);
CREATE INDEX idx_survey_2023_legal_domicile_response_id ON survey_2023_legal_domicile(response_id);
CREATE INDEX idx_survey_2023_concessionary_capital_response_id ON survey_2023_concessionary_capital(response_id);
CREATE INDEX idx_survey_2023_gp_financial_commitment_response_id ON survey_2023_gp_financial_commitment(response_id);
CREATE INDEX idx_survey_2023_gender_inclusion_response_id ON survey_2023_gender_inclusion(response_id);
CREATE INDEX idx_survey_2023_sustainable_development_goals_response_id ON survey_2023_sustainable_development_goals(response_id);
CREATE INDEX idx_survey_2023_business_development_approach_response_id ON survey_2023_business_development_approach(response_id);
CREATE INDEX idx_survey_2023_exit_form_response_id ON survey_2023_exit_form(response_id);
CREATE INDEX idx_survey_2023_future_research_data_response_id ON survey_2023_future_research_data(response_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE survey_2023_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_geographic_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_team_based ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_legal_domicile ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_concessionary_capital ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_gp_financial_commitment ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_gender_inclusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_sustainable_development_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_business_development_approach ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_exit_form ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_future_research_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view their own survey responses" ON survey_2023_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" ON survey_2023_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" ON survey_2023_responses
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for junction tables
CREATE POLICY "Users can manage their own geographic_markets data" ON survey_2023_geographic_markets
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own team_based data" ON survey_2023_team_based
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own legal_domicile data" ON survey_2023_legal_domicile
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own concessionary_capital data" ON survey_2023_concessionary_capital
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own gp_financial_commitment data" ON survey_2023_gp_financial_commitment
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own gender_inclusion data" ON survey_2023_gender_inclusion
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own sustainable_development_goals data" ON survey_2023_sustainable_development_goals
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own business_development_approach data" ON survey_2023_business_development_approach
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own exit_form data" ON survey_2023_exit_form
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own future_research_data data" ON survey_2023_future_research_data
    FOR ALL USING (response_id IN (SELECT id FROM survey_2023_responses WHERE user_id = auth.uid()));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_survey_2023_responses_updated_at 
    BEFORE UPDATE ON survey_2023_responses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMENT ON TABLE survey_2023_responses IS 'Main table for Survey 2023 responses with all form data';
COMMENT ON TABLE survey_2023_geographic_markets IS 'Junction table for geographic markets (many-to-many)';
COMMENT ON TABLE survey_2023_team_based IS 'Junction table for team based locations (many-to-many)';
COMMENT ON TABLE survey_2023_legal_domicile IS 'Junction table for legal domicile (many-to-many)';
COMMENT ON TABLE survey_2023_concessionary_capital IS 'Junction table for concessionary capital (many-to-many)';
COMMENT ON TABLE survey_2023_gp_financial_commitment IS 'Junction table for GP financial commitment (many-to-many)';
COMMENT ON TABLE survey_2023_gender_inclusion IS 'Junction table for gender inclusion (many-to-many)';
COMMENT ON TABLE survey_2023_sustainable_development_goals IS 'Junction table for sustainable development goals (many-to-many)';
COMMENT ON TABLE survey_2023_business_development_approach IS 'Junction table for business development approach (many-to-many)';
COMMENT ON TABLE survey_2023_exit_form IS 'Junction table for exit form (many-to-many)';
COMMENT ON TABLE survey_2023_future_research_data IS 'Junction table for future research data (many-to-many)';
