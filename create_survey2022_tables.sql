-- =====================================================
-- SURVEY 2022 DATABASE TABLES CREATION SCRIPT
-- =====================================================
-- This script creates the complete database structure for Survey 2022
-- Based on the exact schema from Survey2022.tsx
-- =====================================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS survey_2022_responses CASCADE;
DROP TABLE IF EXISTS survey_2022_geographic_markets CASCADE;
DROP TABLE IF EXISTS survey_2022_team_based CASCADE;
DROP TABLE IF EXISTS survey_2022_concessionary_capital CASCADE;
DROP TABLE IF EXISTS survey_2022_gender_orientation CASCADE;
DROP TABLE IF EXISTS survey_2022_enterprise_types CASCADE;
DROP TABLE IF EXISTS survey_2022_investment_monetization_exit_forms CASCADE;

-- Main survey responses table
CREATE TABLE survey_2022_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contact Information (Questions 1-4)
    name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    organisation VARCHAR(255) NOT NULL,
    
    -- Section 2: Organizational Background and Team (Questions 5-12)
    legal_entity_date VARCHAR(50) NOT NULL,
    first_close_date VARCHAR(50) NOT NULL,
    first_investment_date VARCHAR(50) NOT NULL,
    geographic_markets_other TEXT,
    team_based_other TEXT,
    current_ftes VARCHAR(50) NOT NULL,
    ye2023_ftes VARCHAR(50) NOT NULL,
    principals_count VARCHAR(50) NOT NULL,
    gp_experience_other_selected BOOLEAN,
    gp_experience_other_description TEXT,
    gender_orientation_other TEXT,
    investments_experience VARCHAR(50) NOT NULL,
    exits_experience VARCHAR(50) NOT NULL,
    
    -- Section 3: Vehicle Construct (Questions 13-25)
    legal_domicile VARCHAR(100) NOT NULL,
    legal_domicile_other TEXT,
    currency_investments VARCHAR(100) NOT NULL,
    currency_lp_commitments VARCHAR(100) NOT NULL,
    fund_operations VARCHAR(100) NOT NULL,
    fund_operations_other TEXT,
    current_funds_raised VARCHAR(100) NOT NULL,
    current_amount_invested VARCHAR(100) NOT NULL,
    target_fund_size VARCHAR(100) NOT NULL,
    target_investments VARCHAR(100) NOT NULL,
    follow_on_permitted VARCHAR(100) NOT NULL,
    target_irr VARCHAR(100) NOT NULL,
    target_irr_other TEXT,
    concessionary_capital_other TEXT,
    lp_capital_sources_other_description TEXT,
    gp_commitment VARCHAR(100) NOT NULL,
    management_fee VARCHAR(100) NOT NULL,
    management_fee_other TEXT,
    carried_interest_hurdle VARCHAR(100) NOT NULL,
    carried_interest_hurdle_other TEXT,
    fundraising_constraints_other_selected BOOLEAN,
    fundraising_constraints_other_description TEXT,
    
    -- Section 4: Investment Thesis (Questions 26-33)
    business_stages_other_selected BOOLEAN,
    business_stages_other_description TEXT,
    financing_needs_other_selected BOOLEAN,
    financing_needs_other_description TEXT,
    sector_activities_other_selected BOOLEAN,
    sector_activities_other_description TEXT,
    financial_instruments_other_selected BOOLEAN,
    financial_instruments_other_description TEXT,
    gender_lens_investing_other_selected BOOLEAN,
    gender_lens_investing_other_description TEXT,
    technology_role_investment_thesis VARCHAR(100),
    
    -- Section 5: Pipeline Sourcing and Portfolio Construction (Questions 34-35)
    pipeline_sourcing_other_selected BOOLEAN,
    pipeline_sourcing_other_description TEXT,
    average_investment_size_per_company VARCHAR(100),
    
    -- Section 6: Portfolio Value Creation and Exits (Questions 36-39)
    portfolio_value_creation_other_selected BOOLEAN,
    portfolio_value_creation_other_description TEXT,
    typical_investment_timeframe VARCHAR(100),
    investment_monetization_exit_forms_other TEXT,
    equity_exits_achieved INTEGER,
    debt_repayments_achieved INTEGER,
    
    -- Section 7: Performance to Date and Current Outlook (Questions 40-48)
    investments_made_to_date INTEGER,
    other_investments_supplement TEXT,
    anticipated_exits_12_months VARCHAR(100),
    revenue_growth_recent_12_months NUMERIC,
    cash_flow_growth_recent_12_months NUMERIC,
    revenue_growth_next_12_months NUMERIC,
    cash_flow_growth_next_12_months NUMERIC,
    portfolio_performance_other_selected BOOLEAN,
    revenue_growth_other NUMERIC,
    cash_flow_growth_other NUMERIC,
    portfolio_performance_other_description TEXT,
    direct_jobs_created_cumulative INTEGER,
    direct_jobs_anticipated_change INTEGER,
    indirect_jobs_created_cumulative INTEGER,
    indirect_jobs_anticipated_change INTEGER,
    jobs_impact_other_selected BOOLEAN,
    other_jobs_created_cumulative INTEGER,
    other_jobs_anticipated_change INTEGER,
    jobs_impact_other_description TEXT,
    fund_priority_areas_other_selected BOOLEAN,
    fund_priority_areas_other_description TEXT,
    domestic_factors_concerns_other_selected BOOLEAN,
    domestic_factors_concerns_other_description TEXT,
    international_factors_concerns_other_selected BOOLEAN,
    international_factors_concerns_other_description TEXT,
    receive_results BOOLEAN DEFAULT FALSE,
    
    -- Legacy fields (from old structure)
    investment_stage VARCHAR(100),
    investment_size VARCHAR(100),
    investment_type VARCHAR(100),
    sector_focus VARCHAR(100),
    geographic_focus VARCHAR(100),
    value_add_services VARCHAR(100),
    
    -- JSON fields for complex data structures
    gp_experience JSONB,
    lp_capital_sources JSONB,
    fundraising_constraints JSONB,
    business_stages JSONB,
    financing_needs JSONB,
    sector_activities JSONB,
    financial_instruments JSONB,
    sdg_targets JSONB,
    gender_lens_investing JSONB,
    pipeline_sourcing JSONB,
    portfolio_value_creation_priorities JSONB,
    fund_priority_areas JSONB,
    domestic_factors_concerns JSONB,
    international_factors_concerns JSONB,
    
    -- Metadata
    user_id UUID,
    submission_status VARCHAR(50) DEFAULT 'draft',
    completion_percentage INTEGER DEFAULT 0
);

-- Junction tables for many-to-many relationships

-- Geographic markets
CREATE TABLE survey_2022_geographic_markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2022_responses(id) ON DELETE CASCADE,
    geographic_markets VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team based locations
CREATE TABLE survey_2022_team_based (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2022_responses(id) ON DELETE CASCADE,
    team_based VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Concessionary capital
CREATE TABLE survey_2022_concessionary_capital (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2022_responses(id) ON DELETE CASCADE,
    concessionary_capital VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gender orientation
CREATE TABLE survey_2022_gender_orientation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2022_responses(id) ON DELETE CASCADE,
    gender_orientation VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enterprise types
CREATE TABLE survey_2022_enterprise_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2022_responses(id) ON DELETE CASCADE,
    enterprise_types VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment monetization exit forms
CREATE TABLE survey_2022_investment_monetization_exit_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2022_responses(id) ON DELETE CASCADE,
    investment_monetization_exit_forms VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_survey_2022_responses_email ON survey_2022_responses(email);
CREATE INDEX idx_survey_2022_responses_created_at ON survey_2022_responses(created_at);
CREATE INDEX idx_survey_2022_responses_user_id ON survey_2022_responses(user_id);

-- Create indexes for junction tables
CREATE INDEX idx_survey_2022_geographic_markets_response_id ON survey_2022_geographic_markets(response_id);
CREATE INDEX idx_survey_2022_team_based_response_id ON survey_2022_team_based(response_id);
CREATE INDEX idx_survey_2022_concessionary_capital_response_id ON survey_2022_concessionary_capital(response_id);
CREATE INDEX idx_survey_2022_gender_orientation_response_id ON survey_2022_gender_orientation(response_id);
CREATE INDEX idx_survey_2022_enterprise_types_response_id ON survey_2022_enterprise_types(response_id);
CREATE INDEX idx_survey_2022_investment_monetization_exit_forms_response_id ON survey_2022_investment_monetization_exit_forms(response_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE survey_2022_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2022_geographic_markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2022_team_based ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2022_concessionary_capital ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2022_gender_orientation ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2022_enterprise_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2022_investment_monetization_exit_forms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view their own survey responses" ON survey_2022_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" ON survey_2022_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" ON survey_2022_responses
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for junction tables
CREATE POLICY "Users can manage their own geographic_markets data" ON survey_2022_geographic_markets
    FOR ALL USING (response_id IN (SELECT id FROM survey_2022_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own team_based data" ON survey_2022_team_based
    FOR ALL USING (response_id IN (SELECT id FROM survey_2022_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own concessionary_capital data" ON survey_2022_concessionary_capital
    FOR ALL USING (response_id IN (SELECT id FROM survey_2022_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own gender_orientation data" ON survey_2022_gender_orientation
    FOR ALL USING (response_id IN (SELECT id FROM survey_2022_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own enterprise_types data" ON survey_2022_enterprise_types
    FOR ALL USING (response_id IN (SELECT id FROM survey_2022_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own investment_monetization_exit_forms data" ON survey_2022_investment_monetization_exit_forms
    FOR ALL USING (response_id IN (SELECT id FROM survey_2022_responses WHERE user_id = auth.uid()));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_survey_2022_responses_updated_at 
    BEFORE UPDATE ON survey_2022_responses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMENT ON TABLE survey_2022_responses IS 'Main table for Survey 2022 responses with all form data';
COMMENT ON TABLE survey_2022_geographic_markets IS 'Junction table for geographic markets (many-to-many)';
COMMENT ON TABLE survey_2022_team_based IS 'Junction table for team based locations (many-to-many)';
COMMENT ON TABLE survey_2022_concessionary_capital IS 'Junction table for concessionary capital (many-to-many)';
COMMENT ON TABLE survey_2022_gender_orientation IS 'Junction table for gender orientation (many-to-many)';
COMMENT ON TABLE survey_2022_enterprise_types IS 'Junction table for enterprise types (many-to-many)';
COMMENT ON TABLE survey_2022_investment_monetization_exit_forms IS 'Junction table for investment monetization exit forms (many-to-many)';
