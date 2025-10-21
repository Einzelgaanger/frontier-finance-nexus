-- =====================================================
-- 2023 MSME Financing Survey Schema for Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Main Survey Responses Table
-- =====================================================
CREATE TABLE survey_responses_2023 (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    is_draft BOOLEAN DEFAULT true,
    
    -- Section 1: Introduction & Context
    email_address TEXT NOT NULL,
    organisation_name TEXT NOT NULL,
    funds_raising_investing TEXT NOT NULL,
    fund_name TEXT NOT NULL,
    
    -- Section 2: Organizational Background and Team
    legal_entity_achieved TEXT,
    first_close_achieved TEXT,
    first_investment_achieved TEXT,
    geographic_markets TEXT[] NOT NULL DEFAULT '{}',
    geographic_markets_other TEXT,
    team_based TEXT[] NOT NULL DEFAULT '{}',
    team_based_other TEXT,
    fte_staff_2022 INTEGER,
    fte_staff_current INTEGER,
    fte_staff_2024_est INTEGER,
    principals_count INTEGER,
    gender_inclusion TEXT[] NOT NULL DEFAULT '{}',
    gender_inclusion_other TEXT,
    team_experience_investments JSONB DEFAULT '{}'::jsonb,
    team_experience_exits JSONB DEFAULT '{}'::jsonb,
    team_experience_other TEXT,
    
    -- Section 3: Vehicle Construct
    legal_domicile TEXT[] NOT NULL DEFAULT '{}',
    legal_domicile_other TEXT,
    currency_investments TEXT NOT NULL,
    currency_lp_commitments TEXT NOT NULL,
    fund_type_status TEXT NOT NULL,
    fund_type_status_other TEXT,
    current_funds_raised NUMERIC,
    current_amount_invested NUMERIC,
    target_fund_size NUMERIC,
    target_investments_count INTEGER,
    follow_on_investment_permitted TEXT NOT NULL,
    concessionary_capital TEXT[] NOT NULL DEFAULT '{}',
    concessionary_capital_other TEXT,
    lp_capital_sources_existing JSONB DEFAULT '{}'::jsonb,
    lp_capital_sources_target JSONB DEFAULT '{}'::jsonb,
    gp_financial_commitment TEXT[] NOT NULL DEFAULT '{}',
    gp_financial_commitment_other TEXT,
    gp_management_fee TEXT NOT NULL,
    gp_management_fee_other TEXT,
    hurdle_rate_currency TEXT NOT NULL,
    hurdle_rate_currency_other TEXT,
    hurdle_rate_percentage NUMERIC CHECK (hurdle_rate_percentage >= 0 AND hurdle_rate_percentage <= 100),
    target_local_currency_return NUMERIC CHECK (target_local_currency_return >= 0 AND target_local_currency_return <= 100),
    fundraising_constraints JSONB DEFAULT '{}'::jsonb,
    fundraising_constraints_other TEXT,
    
    -- Section 4: Investment Thesis
    business_stages JSONB DEFAULT '{}'::jsonb,
    growth_expectations JSONB DEFAULT '{}'::jsonb,
    financing_needs JSONB DEFAULT '{}'::jsonb,
    sector_focus JSONB DEFAULT '{}'::jsonb,
    sector_focus_other TEXT,
    financial_instruments JSONB DEFAULT '{}'::jsonb,
    sustainable_development_goals TEXT[] NOT NULL DEFAULT '{}',
    gender_lens_investing JSONB DEFAULT '{}'::jsonb,
    gender_lens_investing_other TEXT,
    
    -- Section 5: Pipeline Sourcing and Portfolio Construction
    pipeline_sourcing JSONB DEFAULT '{}'::jsonb,
    pipeline_sourcing_other TEXT,
    average_investment_size TEXT NOT NULL,
    capital_raise_percentage NUMERIC CHECK (capital_raise_percentage >= 0 AND capital_raise_percentage <= 100),
    
    -- Section 6: Portfolio Value Creation and Exits
    portfolio_priorities JSONB DEFAULT '{}'::jsonb,
    portfolio_priorities_other TEXT,
    technical_assistance_funding JSONB DEFAULT '{}'::jsonb,
    technical_assistance_funding_other TEXT,
    business_development_support TEXT[] NOT NULL DEFAULT '{}',
    business_development_support_other TEXT,
    investment_timeframe TEXT NOT NULL,
    exit_form TEXT[] NOT NULL DEFAULT '{}',
    exit_form_other TEXT,
    
    -- Section 7: Performance to Date and Current Outlook
    equity_investments_count INTEGER CHECK (equity_investments_count >= 0),
    debt_investments_count INTEGER CHECK (debt_investments_count >= 0),
    equity_exits_count INTEGER CHECK (equity_exits_count >= 0),
    debt_exits_count INTEGER CHECK (debt_exits_count >= 0),
    equity_exits_anticipated INTEGER CHECK (equity_exits_anticipated >= 0),
    debt_exits_anticipated INTEGER CHECK (debt_exits_anticipated >= 0),
    other_investments TEXT,
    revenue_growth_historical NUMERIC,
    revenue_growth_expected NUMERIC,
    cash_flow_growth_historical NUMERIC,
    cash_flow_growth_expected NUMERIC,
    jobs_impact_historical_direct INTEGER CHECK (jobs_impact_historical_direct >= 0),
    jobs_impact_historical_indirect INTEGER CHECK (jobs_impact_historical_indirect >= 0),
    jobs_impact_historical_other TEXT,
    jobs_impact_expected_direct INTEGER CHECK (jobs_impact_expected_direct >= 0),
    jobs_impact_expected_indirect INTEGER CHECK (jobs_impact_expected_indirect >= 0),
    jobs_impact_expected_other TEXT,
    fund_priorities JSONB DEFAULT '{}'::jsonb,
    fund_priorities_other TEXT,
    concerns_ranking JSONB DEFAULT '{}'::jsonb,
    concerns_ranking_other TEXT,
    
    -- Section 8: Future Research
    future_research_data TEXT[] NOT NULL DEFAULT '{}',
    future_research_data_other TEXT,
    one_on_one_meeting BOOLEAN DEFAULT false,
    receive_survey_results BOOLEAN DEFAULT false,
    
    -- Constraints
    CONSTRAINT valid_user_2023 UNIQUE(user_id, id),
    CONSTRAINT check_dates_2023 CHECK (
        (completed_at IS NULL AND is_draft = true) OR
        (completed_at IS NOT NULL AND is_draft = false)
    )
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_survey_2023_user_id ON survey_responses_2023(user_id);
CREATE INDEX idx_survey_2023_created_at ON survey_responses_2023(created_at);
CREATE INDEX idx_survey_2023_completed_at ON survey_responses_2023(completed_at);
CREATE INDEX idx_survey_2023_is_draft ON survey_responses_2023(is_draft);
CREATE INDEX idx_survey_2023_organisation_name ON survey_responses_2023(organisation_name);
CREATE INDEX idx_survey_2023_fund_name ON survey_responses_2023(fund_name);
CREATE INDEX idx_survey_2023_email ON survey_responses_2023(email_address);

-- GIN indexes for array and JSONB columns for faster searching
CREATE INDEX idx_survey_2023_geographic_markets ON survey_responses_2023 USING GIN(geographic_markets);
CREATE INDEX idx_survey_2023_team_based ON survey_responses_2023 USING GIN(team_based);
CREATE INDEX idx_survey_2023_team_experience_inv ON survey_responses_2023 USING GIN(team_experience_investments);
CREATE INDEX idx_survey_2023_team_experience_exits ON survey_responses_2023 USING GIN(team_experience_exits);
CREATE INDEX idx_survey_2023_legal_domicile ON survey_responses_2023 USING GIN(legal_domicile);
CREATE INDEX idx_survey_2023_lp_sources_existing ON survey_responses_2023 USING GIN(lp_capital_sources_existing);
CREATE INDEX idx_survey_2023_lp_sources_target ON survey_responses_2023 USING GIN(lp_capital_sources_target);
CREATE INDEX idx_survey_2023_business_stages ON survey_responses_2023 USING GIN(business_stages);
CREATE INDEX idx_survey_2023_sector_focus ON survey_responses_2023 USING GIN(sector_focus);
CREATE INDEX idx_survey_2023_sdgs ON survey_responses_2023 USING GIN(sustainable_development_goals);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
ALTER TABLE survey_responses_2023 ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own responses
CREATE POLICY "Users can view own responses"
    ON survey_responses_2023
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own responses
CREATE POLICY "Users can insert own responses"
    ON survey_responses_2023
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own responses
CREATE POLICY "Users can update own responses"
    ON survey_responses_2023
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own responses
CREATE POLICY "Users can delete own responses"
    ON survey_responses_2023
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Admins can view all responses (optional - requires admin role setup)
-- CREATE POLICY "Admins can view all responses"
--     ON survey_responses_2023
--     FOR SELECT
--     USING (
--         EXISTS (
--             SELECT 1 FROM user_profiles
--             WHERE id = auth.uid() AND user_role = 'admin'
--         )
--     );

-- =====================================================
-- Trigger for Updated At Timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_survey_2023_updated_at
    BEFORE UPDATE ON survey_responses_2023
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Helper Views for Analytics
-- =====================================================

-- View: Completed surveys only
CREATE VIEW survey_2023_completed AS
SELECT *
FROM survey_responses_2023
WHERE is_draft = false AND completed_at IS NOT NULL;

-- View: Draft surveys
CREATE VIEW survey_2023_drafts AS
SELECT *
FROM survey_responses_2023
WHERE is_draft = true;

-- View: Survey summary statistics
CREATE VIEW survey_2023_stats AS
SELECT
    COUNT(*) as total_responses,
    COUNT(*) FILTER (WHERE is_draft = false) as completed_responses,
    COUNT(*) FILTER (WHERE is_draft = true) as draft_responses,
    COUNT(DISTINCT user_id) as unique_respondents,
    COUNT(DISTINCT organisation_name) as unique_organisations,
    MIN(created_at) as first_response_date,
    MAX(completed_at) as last_completion_date,
    AVG(fte_staff_current) as avg_current_ftes,
    AVG(target_fund_size) as avg_target_fund_size,
    AVG(equity_investments_count) as avg_equity_investments,
    AVG(debt_investments_count) as avg_debt_investments
FROM survey_responses_2023;

-- View: Geographic distribution
CREATE VIEW survey_2023_geographic_distribution AS
SELECT
    unnest(geographic_markets) as market,
    COUNT(*) as count
FROM survey_responses_2023
WHERE is_draft = false
GROUP BY market
ORDER BY count DESC;

-- View: Fund type distribution
CREATE VIEW survey_2023_fund_types AS
SELECT
    fund_type_status,
    COUNT(*) as count,
    AVG(target_fund_size) as avg_target_size,
    AVG(current_funds_raised) as avg_funds_raised
FROM survey_responses_2023
WHERE is_draft = false
GROUP BY fund_type_status
ORDER BY count DESC;

-- =====================================================
-- Excel Import Helper Table (Optional)
-- =====================================================
CREATE TABLE survey_2023_import_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_batch_id UUID NOT NULL,
    row_number INTEGER,
    raw_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_staging_2023_batch ON survey_2023_import_staging(import_batch_id);
CREATE INDEX idx_staging_2023_processed ON survey_2023_import_staging(processed);

-- =====================================================
-- Comments for Documentation
-- =====================================================
COMMENT ON TABLE survey_responses_2023 IS '2023 MSME Financing Survey responses with comprehensive data collection across 8 sections';
COMMENT ON COLUMN survey_responses_2023.is_draft IS 'Indicates if the response is a draft (true) or completed (false)';
COMMENT ON COLUMN survey_responses_2023.completed_at IS 'Timestamp when the survey was completed and submitted';
COMMENT ON COLUMN survey_responses_2023.team_experience_investments IS 'JSONB object storing team experience levels for investments';
COMMENT ON COLUMN survey_responses_2023.team_experience_exits IS 'JSONB object storing team experience levels for exits';
COMMENT ON COLUMN survey_responses_2023.lp_capital_sources_existing IS 'JSONB object storing existing LP capital source percentages';
COMMENT ON COLUMN survey_responses_2023.lp_capital_sources_target IS 'JSONB object storing target LP capital source percentages';
COMMENT ON COLUMN survey_responses_2023.business_stages IS 'JSONB object storing business stage allocations/rankings';
COMMENT ON COLUMN survey_responses_2023.sector_focus IS 'JSONB object storing sector focus allocations/rankings';
COMMENT ON COLUMN survey_responses_2023.portfolio_priorities IS 'JSONB object storing portfolio priority rankings';
COMMENT ON COLUMN survey_responses_2023.fund_priorities IS 'JSONB object storing fund priority rankings';

-- =====================================================
-- Grant Permissions (adjust based on your setup)
-- =====================================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON survey_responses_2023 TO authenticated;
-- GRANT SELECT ON survey_2023_completed TO authenticated;
-- GRANT SELECT ON survey_2023_stats TO authenticated;
-- GRANT SELECT ON survey_2023_geographic_distribution TO authenticated;
-- GRANT SELECT ON survey_2023_fund_types TO authenticated;
