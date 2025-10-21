-- =====================================================
-- 2024 MSME Financing Survey Schema for Supabase
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Main Survey Responses Table
-- =====================================================
CREATE TABLE survey_responses_2024 (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    is_draft BOOLEAN DEFAULT true,
    
    -- Section 1: Introduction & Context (Questions 1-5)
    email_address TEXT NOT NULL,
    investment_networks TEXT[] NOT NULL DEFAULT '{}',
    investment_networks_other TEXT,
    organisation_name TEXT NOT NULL,
    funds_raising_investing TEXT NOT NULL,
    fund_name TEXT NOT NULL,
    
    -- Section 2: Organizational Background and Team (Questions 6-14)
    legal_entity_achieved TEXT,
    first_close_achieved TEXT,
    first_investment_achieved TEXT,
    geographic_markets TEXT[] NOT NULL DEFAULT '{}',
    geographic_markets_other TEXT,
    team_based TEXT[] NOT NULL DEFAULT '{}',
    team_based_other TEXT,
    fte_staff_2023_actual INTEGER CHECK (fte_staff_2023_actual >= 0),
    fte_staff_current INTEGER CHECK (fte_staff_current >= 0),
    fte_staff_2025_forecast INTEGER CHECK (fte_staff_2025_forecast >= 0),
    investment_approval TEXT[] NOT NULL DEFAULT '{}',
    investment_approval_other TEXT,
    principals_total INTEGER CHECK (principals_total >= 0),
    principals_women INTEGER CHECK (principals_women >= 0),
    gender_inclusion TEXT[] NOT NULL DEFAULT '{}',
    gender_inclusion_other TEXT,
    team_experience_investments JSONB DEFAULT '{}'::jsonb,
    team_experience_exits JSONB DEFAULT '{}'::jsonb,
    
    -- Section 3: Vehicle Construct (Questions 15-32)
    legal_domicile TEXT[] NOT NULL DEFAULT '{}',
    legal_domicile_other TEXT,
    domicile_reason TEXT[] NOT NULL DEFAULT '{}',
    domicile_reason_other TEXT,
    regulatory_impact JSONB DEFAULT '{}'::jsonb,
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
    target_number_investments INTEGER CHECK (target_number_investments >= 0),
    follow_on_permitted TEXT,
    concessionary_capital TEXT[] DEFAULT '{}',
    concessionary_capital_other TEXT,
    existing_lp_sources JSONB DEFAULT '{}'::jsonb,
    target_lp_sources JSONB DEFAULT '{}'::jsonb,
    gp_financial_commitment TEXT[] DEFAULT '{}',
    gp_financial_commitment_other TEXT,
    gp_management_fee TEXT,
    gp_management_fee_other TEXT,
    hurdle_rate_currency TEXT,
    hurdle_rate_percentage NUMERIC,
    target_return_above_govt_debt NUMERIC,
    fundraising_barriers JSONB DEFAULT '{}'::jsonb,
    
    -- Section 4: Investment Thesis (Questions 33-40)
    business_stages JSONB DEFAULT '{}'::jsonb,
    revenue_growth_mix JSONB DEFAULT '{}'::jsonb,
    financing_needs JSONB DEFAULT '{}'::jsonb,
    sector_target_allocation JSONB DEFAULT '{}'::jsonb,
    investment_considerations JSONB DEFAULT '{}'::jsonb,
    financial_instruments_ranking JSONB DEFAULT '{}'::jsonb,
    top_sdgs TEXT[] DEFAULT '{}',
    additional_sdgs TEXT,
    gender_lens_investing JSONB DEFAULT '{}'::jsonb,
    
    -- Section 5: Pipeline Sourcing and Portfolio Construction (Questions 41-43)
    pipeline_sources_quality JSONB DEFAULT '{}'::jsonb,
    sgb_financing_trends JSONB DEFAULT '{}'::jsonb,
    typical_investment_size TEXT,
    
    -- Section 6: Portfolio Value Creation and Exits (Questions 44-55)
    post_investment_priorities JSONB DEFAULT '{}'::jsonb,
    technical_assistance_funding JSONB DEFAULT '{}'::jsonb,
    business_development_approach TEXT[] DEFAULT '{}',
    business_development_approach_other TEXT,
    unique_offerings JSONB DEFAULT '{}'::jsonb,
    typical_investment_timeframe TEXT,
    investment_monetisation_forms TEXT[] DEFAULT '{}',
    investment_monetisation_other TEXT,
    equity_investments_made INTEGER CHECK (equity_investments_made >= 0),
    debt_investments_made INTEGER CHECK (debt_investments_made >= 0),
    equity_exits_achieved INTEGER CHECK (equity_exits_achieved >= 0),
    debt_repayments_achieved INTEGER CHECK (debt_repayments_achieved >= 0),
    equity_exits_anticipated INTEGER CHECK (equity_exits_anticipated >= 0),
    debt_repayments_anticipated INTEGER CHECK (debt_repayments_anticipated >= 0),
    other_investments_supplement TEXT,
    portfolio_revenue_growth_12m NUMERIC,
    portfolio_revenue_growth_next_12m NUMERIC,
    portfolio_cashflow_growth_12m NUMERIC,
    portfolio_cashflow_growth_next_12m NUMERIC,
    portfolio_performance_other TEXT,
    direct_jobs_current INTEGER CHECK (direct_jobs_current >= 0),
    indirect_jobs_current INTEGER CHECK (indirect_jobs_current >= 0),
    direct_jobs_anticipated INTEGER CHECK (direct_jobs_anticipated >= 0),
    indirect_jobs_anticipated INTEGER CHECK (indirect_jobs_anticipated >= 0),
    employment_impact_other TEXT,
    fund_priorities_next_12m JSONB DEFAULT '{}'::jsonb,
    
    -- Section 7: Future Research (Questions 56-59)
    data_sharing_willingness TEXT[] DEFAULT '{}',
    data_sharing_other TEXT,
    survey_sender TEXT,
    receive_results BOOLEAN DEFAULT false,
    
    -- Constraints
    CONSTRAINT valid_user_2024 UNIQUE(user_id, id),
    CONSTRAINT check_dates_2024 CHECK (
        (completed_at IS NULL AND is_draft = true) OR
        (completed_at IS NOT NULL AND is_draft = false)
    ),
    CONSTRAINT check_principals_women_2024 CHECK (
        principals_women IS NULL OR 
        principals_total IS NULL OR 
        principals_women <= principals_total
    )
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_survey_2024_user_id ON survey_responses_2024(user_id);
CREATE INDEX idx_survey_2024_created_at ON survey_responses_2024(created_at);
CREATE INDEX idx_survey_2024_completed_at ON survey_responses_2024(completed_at);
CREATE INDEX idx_survey_2024_is_draft ON survey_responses_2024(is_draft);
CREATE INDEX idx_survey_2024_organisation_name ON survey_responses_2024(organisation_name);
CREATE INDEX idx_survey_2024_fund_name ON survey_responses_2024(fund_name);
CREATE INDEX idx_survey_2024_email ON survey_responses_2024(email_address);

-- GIN indexes for array and JSONB columns for faster searching
CREATE INDEX idx_survey_2024_investment_networks ON survey_responses_2024 USING GIN(investment_networks);
CREATE INDEX idx_survey_2024_geographic_markets ON survey_responses_2024 USING GIN(geographic_markets);
CREATE INDEX idx_survey_2024_team_based ON survey_responses_2024 USING GIN(team_based);
CREATE INDEX idx_survey_2024_legal_domicile ON survey_responses_2024 USING GIN(legal_domicile);
CREATE INDEX idx_survey_2024_team_experience_inv ON survey_responses_2024 USING GIN(team_experience_investments);
CREATE INDEX idx_survey_2024_team_experience_exits ON survey_responses_2024 USING GIN(team_experience_exits);
CREATE INDEX idx_survey_2024_regulatory_impact ON survey_responses_2024 USING GIN(regulatory_impact);
CREATE INDEX idx_survey_2024_lp_sources_existing ON survey_responses_2024 USING GIN(existing_lp_sources);
CREATE INDEX idx_survey_2024_lp_sources_target ON survey_responses_2024 USING GIN(target_lp_sources);
CREATE INDEX idx_survey_2024_business_stages ON survey_responses_2024 USING GIN(business_stages);
CREATE INDEX idx_survey_2024_sector_allocation ON survey_responses_2024 USING GIN(sector_target_allocation);
CREATE INDEX idx_survey_2024_top_sdgs ON survey_responses_2024 USING GIN(top_sdgs);
CREATE INDEX idx_survey_2024_gender_lens ON survey_responses_2024 USING GIN(gender_lens_investing);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================
ALTER TABLE survey_responses_2024 ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own responses
CREATE POLICY "Users can view own responses"
    ON survey_responses_2024
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own responses
CREATE POLICY "Users can insert own responses"
    ON survey_responses_2024
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own responses
CREATE POLICY "Users can update own responses"
    ON survey_responses_2024
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own responses
CREATE POLICY "Users can delete own responses"
    ON survey_responses_2024
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Admins can view all responses (optional - requires admin role setup)
-- CREATE POLICY "Admins can view all responses"
--     ON survey_responses_2024
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

CREATE TRIGGER update_survey_2024_updated_at
    BEFORE UPDATE ON survey_responses_2024
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Helper Views for Analytics
-- =====================================================

-- View: Completed surveys only
CREATE VIEW survey_2024_completed AS
SELECT *
FROM survey_responses_2024
WHERE is_draft = false AND completed_at IS NOT NULL;

-- View: Draft surveys
CREATE VIEW survey_2024_drafts AS
SELECT *
FROM survey_responses_2024
WHERE is_draft = true;

-- View: Survey summary statistics
CREATE VIEW survey_2024_stats AS
SELECT
    COUNT(*) as total_responses,
    COUNT(*) FILTER (WHERE is_draft = false) as completed_responses,
    COUNT(*) FILTER (WHERE is_draft = true) as draft_responses,
    COUNT(DISTINCT user_id) as unique_respondents,
    COUNT(DISTINCT organisation_name) as unique_organisations,
    MIN(created_at) as first_response_date,
    MAX(completed_at) as last_completion_date,
    AVG(fte_staff_current) as avg_current_ftes,
    AVG(target_fund_size_current) as avg_target_fund_size,
    AVG(equity_investments_made) as avg_equity_investments,
    AVG(debt_investments_made) as avg_debt_investments,
    AVG(principals_total) as avg_principals,
    AVG(principals_women) as avg_women_principals
FROM survey_responses_2024;

-- View: Geographic distribution
CREATE VIEW survey_2024_geographic_distribution AS
SELECT
    unnest(geographic_markets) as market,
    COUNT(*) as count
FROM survey_responses_2024
WHERE is_draft = false
GROUP BY market
ORDER BY count DESC;

-- View: Fund type distribution
CREATE VIEW survey_2024_fund_types AS
SELECT
    fund_type_status,
    COUNT(*) as count,
    AVG(target_fund_size_current) as avg_target_size,
    AVG(hard_commitments_current) as avg_funds_raised
FROM survey_responses_2024
WHERE is_draft = false
GROUP BY fund_type_status
ORDER BY count DESC;

-- View: Investment networks distribution
CREATE VIEW survey_2024_networks AS
SELECT
    unnest(investment_networks) as network,
    COUNT(*) as count
FROM survey_responses_2024
WHERE is_draft = false
GROUP BY network
ORDER BY count DESC;

-- =====================================================
-- Excel Import Helper Table (Optional)
-- =====================================================
CREATE TABLE survey_2024_import_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    import_batch_id UUID NOT NULL,
    row_number INTEGER,
    raw_data JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_staging_2024_batch ON survey_2024_import_staging(import_batch_id);
CREATE INDEX idx_staging_2024_processed ON survey_2024_import_staging(processed);

-- =====================================================
-- Comments for Documentation
-- =====================================================
COMMENT ON TABLE survey_responses_2024 IS '2024 MSME Financing Survey responses with comprehensive data collection across 7 sections';
COMMENT ON COLUMN survey_responses_2024.is_draft IS 'Indicates if the response is a draft (true) or completed (false)';
COMMENT ON COLUMN survey_responses_2024.completed_at IS 'Timestamp when the survey was completed and submitted';
COMMENT ON COLUMN survey_responses_2024.investment_networks IS 'Array of investment networks/associations the respondent is part of';
COMMENT ON COLUMN survey_responses_2024.team_experience_investments IS 'JSONB object storing team experience levels for investments';
COMMENT ON COLUMN survey_responses_2024.team_experience_exits IS 'JSONB object storing team experience levels for exits';
COMMENT ON COLUMN survey_responses_2024.regulatory_impact IS 'JSONB object storing regulatory impact rankings (1-5 scale)';
COMMENT ON COLUMN survey_responses_2024.existing_lp_sources IS 'JSONB object storing existing LP capital source percentages (sum to 100%)';
COMMENT ON COLUMN survey_responses_2024.target_lp_sources IS 'JSONB object storing target LP capital source percentages (sum to 100%)';
COMMENT ON COLUMN survey_responses_2024.business_stages IS 'JSONB object storing business stage allocations (sum to 100%)';
COMMENT ON COLUMN survey_responses_2024.revenue_growth_mix IS 'JSONB object storing revenue growth mix percentages (sum to 100%)';
COMMENT ON COLUMN survey_responses_2024.financing_needs IS 'JSONB object storing financing needs percentages (sum to 100%)';
COMMENT ON COLUMN survey_responses_2024.sector_target_allocation IS 'JSONB object storing sector allocation percentages';
COMMENT ON COLUMN survey_responses_2024.investment_considerations IS 'JSONB object storing investment consideration rankings (1-5 scale)';
COMMENT ON COLUMN survey_responses_2024.financial_instruments_ranking IS 'JSONB object storing financial instrument rankings (1-8 scale)';
COMMENT ON COLUMN survey_responses_2024.gender_lens_investing IS 'JSONB object storing gender lens investing considerations/requirements';
COMMENT ON COLUMN survey_responses_2024.pipeline_sources_quality IS 'JSONB object storing pipeline source quality ratings (1-5 scale)';
COMMENT ON COLUMN survey_responses_2024.sgb_financing_trends IS 'JSONB object storing SGB financing trend observations (-5 to +5 scale)';
COMMENT ON COLUMN survey_responses_2024.post_investment_priorities IS 'JSONB object storing post-investment priority rankings (1-5 scale)';
COMMENT ON COLUMN survey_responses_2024.technical_assistance_funding IS 'JSONB object storing TA funding source percentages (sum to 100%)';
COMMENT ON COLUMN survey_responses_2024.unique_offerings IS 'JSONB object storing unique offering relevance rankings (1-5 scale)';
COMMENT ON COLUMN survey_responses_2024.fund_priorities_next_12m IS 'JSONB object storing fund priorities for next 12 months';
COMMENT ON COLUMN survey_responses_2024.fundraising_barriers IS 'JSONB object storing fundraising barrier rankings (1-5 scale)';

-- =====================================================
-- Grant Permissions (adjust based on your setup)
-- =====================================================
-- GRANT SELECT, INSERT, UPDATE, DELETE ON survey_responses_2024 TO authenticated;
-- GRANT SELECT ON survey_2024_completed TO authenticated;
-- GRANT SELECT ON survey_2024_stats TO authenticated;
-- GRANT SELECT ON survey_2024_geographic_distribution TO authenticated;
-- GRANT SELECT ON survey_2024_fund_types TO authenticated;
-- GRANT SELECT ON survey_2024_networks TO authenticated;
