-- =====================================================
-- SURVEY 2021 DATABASE TABLES CREATION SCRIPT
-- =====================================================
-- This script creates the complete database structure for Survey 2021
-- Based on the exact schema from Survey2021.tsx
-- =====================================================

-- Drop existing tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS survey_2021_responses CASCADE;
DROP TABLE IF EXISTS survey_2021_team_based CASCADE;
DROP TABLE IF EXISTS survey_2021_geographic_focus CASCADE;
DROP TABLE IF EXISTS survey_2021_investment_vehicle_type CASCADE;
DROP TABLE IF EXISTS survey_2021_business_model_targeted CASCADE;
DROP TABLE IF EXISTS survey_2021_business_stage_targeted CASCADE;
DROP TABLE IF EXISTS survey_2021_financing_needs CASCADE;
DROP TABLE IF EXISTS survey_2021_target_capital_sources CASCADE;
DROP TABLE IF EXISTS survey_2021_explicit_lens_focus CASCADE;
DROP TABLE IF EXISTS survey_2021_gender_considerations_investment CASCADE;
DROP TABLE IF EXISTS survey_2021_gender_considerations_requirement CASCADE;
DROP TABLE IF EXISTS survey_2021_gender_fund_vehicle CASCADE;
DROP TABLE IF EXISTS survey_2021_investment_forms CASCADE;
DROP TABLE IF EXISTS survey_2021_target_sectors CASCADE;
DROP TABLE IF EXISTS survey_2021_investment_monetization CASCADE;
DROP TABLE IF EXISTS survey_2021_covid_government_support CASCADE;
DROP TABLE IF EXISTS survey_2021_raising_capital_2021 CASCADE;
DROP TABLE IF EXISTS survey_2021_fund_vehicle_considerations CASCADE;
DROP TABLE IF EXISTS survey_2021_present_demystifying_session CASCADE;

-- Main survey responses table
CREATE TABLE survey_2021_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Section 1: Background Information
    email_address VARCHAR(255) NOT NULL,
    firm_name VARCHAR(255) NOT NULL,
    participant_name VARCHAR(255) NOT NULL,
    role_title VARCHAR(255) NOT NULL,
    team_based_other TEXT,
    geographic_focus_other TEXT,
    fund_stage VARCHAR(100) NOT NULL,
    fund_stage_other TEXT,
    legal_entity_date VARCHAR(50) NOT NULL,
    first_close_date VARCHAR(50) NOT NULL,
    first_investment_date VARCHAR(50) NOT NULL,
    
    -- Section 2: Investment Thesis & Capital Construct
    investments_march_2020 VARCHAR(100) NOT NULL,
    investments_december_2020 VARCHAR(100) NOT NULL,
    optional_supplement TEXT,
    investment_vehicle_type_other TEXT,
    current_fund_size VARCHAR(100) NOT NULL,
    target_fund_size VARCHAR(100) NOT NULL,
    investment_timeframe VARCHAR(100) NOT NULL,
    investment_timeframe_other TEXT,
    business_model_targeted_other TEXT,
    business_stage_targeted_other TEXT,
    financing_needs_other TEXT,
    target_capital_sources_other TEXT,
    target_irr_achieved VARCHAR(100) NOT NULL,
    target_irr_targeted VARCHAR(100) NOT NULL,
    impact_vs_financial_orientation VARCHAR(100) NOT NULL,
    impact_vs_financial_orientation_other TEXT,
    explicit_lens_focus_other TEXT,
    report_sustainable_development_goals BOOLEAN NOT NULL,
    top_sdg_1 VARCHAR(100),
    top_sdg_2 VARCHAR(100),
    top_sdg_3 VARCHAR(100),
    gender_considerations_investment_other TEXT,
    gender_considerations_requirement_other TEXT,
    gender_considerations_other_enabled BOOLEAN,
    gender_considerations_other_description TEXT,
    gender_fund_vehicle_other TEXT,
    
    -- Section 3: Portfolio Construction and Team
    investment_size_your_amount VARCHAR(100) NOT NULL,
    investment_size_total_raise VARCHAR(100) NOT NULL,
    investment_forms_other TEXT,
    target_sectors_other TEXT,
    carried_interest_principals VARCHAR(100) NOT NULL,
    current_ftes VARCHAR(100) NOT NULL,
    
    -- Section 4: Portfolio Development & Investment Return Monetization
    portfolio_needs_other TEXT,
    portfolio_needs_other_enabled BOOLEAN,
    investment_monetization_other TEXT,
    exits_achieved VARCHAR(100) NOT NULL,
    exits_achieved_other TEXT,
    fund_capabilities_other TEXT,
    fund_capabilities_other_enabled BOOLEAN,
    
    -- Section 5: Impact of COVID-19 on Vehicle and Portfolio
    covid_impact_aggregate VARCHAR(100) NOT NULL,
    covid_government_support_other TEXT,
    raising_capital_2021_other TEXT,
    fund_vehicle_considerations_other TEXT,
    
    -- Section 6: Feedback on ESCP Network Membership
    network_value_rating VARCHAR(100) NOT NULL,
    new_working_group_suggestions TEXT,
    new_webinar_suggestions TEXT,
    communication_platform VARCHAR(100) NOT NULL,
    communication_platform_other TEXT,
    present_connection_session VARCHAR(100) NOT NULL,
    present_connection_session_other TEXT,
    convening_initiatives_other TEXT,
    convening_initiatives_other_enabled BOOLEAN,
    
    -- Section 7: 2021 Convening Objectives & Goals
    participate_mentoring_program VARCHAR(100),
    participate_mentoring_program_other TEXT,
    present_demystifying_session_other TEXT,
    present_demystifying_session_other_enabled BOOLEAN,
    additional_comments TEXT,
    
    -- JSON fields for complex data structures
    portfolio_needs_ranking JSONB,
    covid_impact_portfolio JSONB,
    working_groups_ranking JSONB,
    webinar_content_ranking JSONB,
    network_value_areas JSONB,
    convening_initiatives_ranking JSONB,
    top_sdgs JSONB,
    
    -- Metadata
    user_id UUID,
    submission_status VARCHAR(50) DEFAULT 'draft',
    completion_percentage INTEGER DEFAULT 0
);

-- Junction tables for many-to-many relationships

-- Team based locations
CREATE TABLE survey_2021_team_based (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    team_based VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geographic focus
CREATE TABLE survey_2021_geographic_focus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    geographic_focus VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment vehicle types
CREATE TABLE survey_2021_investment_vehicle_type (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    investment_vehicle_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business models targeted
CREATE TABLE survey_2021_business_model_targeted (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    business_model_targeted VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business stages targeted
CREATE TABLE survey_2021_business_stage_targeted (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    business_stage_targeted VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financing needs
CREATE TABLE survey_2021_financing_needs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    financing_needs VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Target capital sources
CREATE TABLE survey_2021_target_capital_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    target_capital_sources VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Explicit lens focus
CREATE TABLE survey_2021_explicit_lens_focus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    explicit_lens_focus VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gender considerations in investment
CREATE TABLE survey_2021_gender_considerations_investment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    gender_considerations_investment VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gender considerations requirements
CREATE TABLE survey_2021_gender_considerations_requirement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    gender_considerations_requirement VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gender fund vehicle
CREATE TABLE survey_2021_gender_fund_vehicle (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    gender_fund_vehicle VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment forms
CREATE TABLE survey_2021_investment_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    investment_forms VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Target sectors
CREATE TABLE survey_2021_target_sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    target_sectors VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment monetization
CREATE TABLE survey_2021_investment_monetization (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    investment_monetization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COVID government support
CREATE TABLE survey_2021_covid_government_support (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    covid_government_support VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raising capital 2021
CREATE TABLE survey_2021_raising_capital_2021 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    raising_capital_2021 VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fund vehicle considerations
CREATE TABLE survey_2021_fund_vehicle_considerations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    fund_vehicle_considerations VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Present demystifying session
CREATE TABLE survey_2021_present_demystifying_session (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES survey_2021_responses(id) ON DELETE CASCADE,
    present_demystifying_session VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_survey_2021_responses_email ON survey_2021_responses(email_address);
CREATE INDEX idx_survey_2021_responses_created_at ON survey_2021_responses(created_at);
CREATE INDEX idx_survey_2021_responses_user_id ON survey_2021_responses(user_id);

-- Create indexes for junction tables
CREATE INDEX idx_survey_2021_team_based_response_id ON survey_2021_team_based(response_id);
CREATE INDEX idx_survey_2021_geographic_focus_response_id ON survey_2021_geographic_focus(response_id);
CREATE INDEX idx_survey_2021_investment_vehicle_type_response_id ON survey_2021_investment_vehicle_type(response_id);
CREATE INDEX idx_survey_2021_business_model_targeted_response_id ON survey_2021_business_model_targeted(response_id);
CREATE INDEX idx_survey_2021_business_stage_targeted_response_id ON survey_2021_business_stage_targeted(response_id);
CREATE INDEX idx_survey_2021_financing_needs_response_id ON survey_2021_financing_needs(response_id);
CREATE INDEX idx_survey_2021_target_capital_sources_response_id ON survey_2021_target_capital_sources(response_id);
CREATE INDEX idx_survey_2021_explicit_lens_focus_response_id ON survey_2021_explicit_lens_focus(response_id);
CREATE INDEX idx_survey_2021_gender_considerations_investment_response_id ON survey_2021_gender_considerations_investment(response_id);
CREATE INDEX idx_survey_2021_gender_considerations_requirement_response_id ON survey_2021_gender_considerations_requirement(response_id);
CREATE INDEX idx_survey_2021_gender_fund_vehicle_response_id ON survey_2021_gender_fund_vehicle(response_id);
CREATE INDEX idx_survey_2021_investment_forms_response_id ON survey_2021_investment_forms(response_id);
CREATE INDEX idx_survey_2021_target_sectors_response_id ON survey_2021_target_sectors(response_id);
CREATE INDEX idx_survey_2021_investment_monetization_response_id ON survey_2021_investment_monetization(response_id);
CREATE INDEX idx_survey_2021_covid_government_support_response_id ON survey_2021_covid_government_support(response_id);
CREATE INDEX idx_survey_2021_raising_capital_2021_response_id ON survey_2021_raising_capital_2021(response_id);
CREATE INDEX idx_survey_2021_fund_vehicle_considerations_response_id ON survey_2021_fund_vehicle_considerations(response_id);
CREATE INDEX idx_survey_2021_present_demystifying_session_response_id ON survey_2021_present_demystifying_session(response_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE survey_2021_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_team_based ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_geographic_focus ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_investment_vehicle_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_business_model_targeted ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_business_stage_targeted ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_financing_needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_target_capital_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_explicit_lens_focus ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_gender_considerations_investment ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_gender_considerations_requirement ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_gender_fund_vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_investment_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_target_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_investment_monetization ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_covid_government_support ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_raising_capital_2021 ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_fund_vehicle_considerations ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_present_demystifying_session ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Users can view their own survey responses" ON survey_2021_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" ON survey_2021_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" ON survey_2021_responses
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for junction tables
CREATE POLICY "Users can manage their own team_based data" ON survey_2021_team_based
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own geographic_focus data" ON survey_2021_geographic_focus
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own investment_vehicle_type data" ON survey_2021_investment_vehicle_type
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own business_model_targeted data" ON survey_2021_business_model_targeted
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own business_stage_targeted data" ON survey_2021_business_stage_targeted
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own financing_needs data" ON survey_2021_financing_needs
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own target_capital_sources data" ON survey_2021_target_capital_sources
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own explicit_lens_focus data" ON survey_2021_explicit_lens_focus
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own gender_considerations_investment data" ON survey_2021_gender_considerations_investment
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own gender_considerations_requirement data" ON survey_2021_gender_considerations_requirement
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own gender_fund_vehicle data" ON survey_2021_gender_fund_vehicle
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own investment_forms data" ON survey_2021_investment_forms
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own target_sectors data" ON survey_2021_target_sectors
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own investment_monetization data" ON survey_2021_investment_monetization
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own covid_government_support data" ON survey_2021_covid_government_support
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own raising_capital_2021 data" ON survey_2021_raising_capital_2021
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own fund_vehicle_considerations data" ON survey_2021_fund_vehicle_considerations
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

CREATE POLICY "Users can manage their own present_demystifying_session data" ON survey_2021_present_demystifying_session
    FOR ALL USING (response_id IN (SELECT id FROM survey_2021_responses WHERE user_id = auth.uid()));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_survey_2021_responses_updated_at 
    BEFORE UPDATE ON survey_2021_responses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

COMMENT ON TABLE survey_2021_responses IS 'Main table for Survey 2021 responses with all form data';
COMMENT ON TABLE survey_2021_team_based IS 'Junction table for team based locations (many-to-many)';
COMMENT ON TABLE survey_2021_geographic_focus IS 'Junction table for geographic focus areas (many-to-many)';
COMMENT ON TABLE survey_2021_investment_vehicle_type IS 'Junction table for investment vehicle types (many-to-many)';
COMMENT ON TABLE survey_2021_business_model_targeted IS 'Junction table for business models targeted (many-to-many)';
COMMENT ON TABLE survey_2021_business_stage_targeted IS 'Junction table for business stages targeted (many-to-many)';
COMMENT ON TABLE survey_2021_financing_needs IS 'Junction table for financing needs (many-to-many)';
COMMENT ON TABLE survey_2021_target_capital_sources IS 'Junction table for target capital sources (many-to-many)';
COMMENT ON TABLE survey_2021_explicit_lens_focus IS 'Junction table for explicit lens focus (many-to-many)';
COMMENT ON TABLE survey_2021_gender_considerations_investment IS 'Junction table for gender considerations in investment (many-to-many)';
COMMENT ON TABLE survey_2021_gender_considerations_requirement IS 'Junction table for gender considerations requirements (many-to-many)';
COMMENT ON TABLE survey_2021_gender_fund_vehicle IS 'Junction table for gender fund vehicle (many-to-many)';
COMMENT ON TABLE survey_2021_investment_forms IS 'Junction table for investment forms (many-to-many)';
COMMENT ON TABLE survey_2021_target_sectors IS 'Junction table for target sectors (many-to-many)';
COMMENT ON TABLE survey_2021_investment_monetization IS 'Junction table for investment monetization (many-to-many)';
COMMENT ON TABLE survey_2021_covid_government_support IS 'Junction table for COVID government support (many-to-many)';
COMMENT ON TABLE survey_2021_raising_capital_2021 IS 'Junction table for raising capital 2021 (many-to-many)';
COMMENT ON TABLE survey_2021_fund_vehicle_considerations IS 'Junction table for fund vehicle considerations (many-to-many)';
COMMENT ON TABLE survey_2021_present_demystifying_session IS 'Junction table for present demystifying session (many-to-many)';
