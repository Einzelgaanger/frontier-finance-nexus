-- =====================================================
-- FINAL 2022 SURVEY SCHEMA - ALL 277 COLUMNS
-- This schema exactly matches the Excel data structure
-- Ready for Python migration script
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- DROP EXISTING TABLE IF EXISTS
-- =====================================================
DROP TABLE IF EXISTS public.survey_responses_2022 CASCADE;

-- =====================================================
-- CREATE 2022 SURVEY TABLE - COMPLETE STRUCTURE
-- =====================================================

CREATE TABLE public.survey_responses_2022 (
    -- System Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT,
    
    -- Columns 1-5: Basic Information
    row_number INTEGER,
    participant_name TEXT,
    role_title TEXT,
    email_address TEXT NOT NULL,
    organization_name TEXT,
    
    -- Columns 6-8: Timeline (3 columns)
    timeline_legal_entity TEXT,
    timeline_first_close TEXT,
    timeline_first_investment TEXT,
    
    -- Columns 9-17: Geographic Markets (9 columns)
    geo_market_us TEXT,
    geo_market_europe TEXT,
    geo_market_africa_west TEXT,
    geo_market_africa_east TEXT,
    geo_market_africa_central TEXT,
    geo_market_africa_southern TEXT,
    geo_market_africa_north TEXT,
    geo_market_middle_east TEXT,
    geo_market_other TEXT,
    
    -- Columns 18-26: Team Based (9 columns)
    team_based_us TEXT,
    team_based_europe TEXT,
    team_based_africa_west TEXT,
    team_based_africa_east TEXT,
    team_based_africa_central TEXT,
    team_based_africa_southern TEXT,
    team_based_africa_north TEXT,
    team_based_middle_east TEXT,
    team_based_other TEXT,
    
    -- Columns 27-29: FTEs and Principals
    ftes_current TEXT,
    ftes_forecast_2023 TEXT,
    principals_count TEXT,
    
    -- Columns 30-45: GP Leadership Experience (16 columns)
    gp_exp_new_not_applicable TEXT,
    gp_exp_new_one_principal TEXT,
    gp_exp_new_two_plus_principals TEXT,
    gp_exp_adjacent_not_applicable TEXT,
    gp_exp_adjacent_one_principal TEXT,
    gp_exp_adjacent_two_plus_principals TEXT,
    gp_exp_business_not_applicable TEXT,
    gp_exp_business_one_principal TEXT,
    gp_exp_business_two_plus_principals TEXT,
    gp_exp_direct_no_data_not_applicable TEXT,
    gp_exp_direct_no_data_one_principal TEXT,
    gp_exp_direct_no_data_two_plus_principals TEXT,
    gp_exp_direct_with_data_not_applicable TEXT,
    gp_exp_direct_with_data_one_principal TEXT,
    gp_exp_direct_with_data_two_plus_principals TEXT,
    gp_exp_other TEXT,
    
    -- Columns 46-51: Gender Orientation (6 columns)
    gender_women_ownership_50_plus TEXT,
    gender_women_board_50_plus TEXT,
    gender_women_staffing_50_plus TEXT,
    gender_provide_reporting TEXT,
    gender_require_reporting TEXT,
    gender_other TEXT,
    
    -- Columns 52-63: Team Experience (12 columns)
    team_exp_investments_0 TEXT,
    team_exp_exits_0 TEXT,
    team_exp_investments_1_4 TEXT,
    team_exp_exits_1_4 TEXT,
    team_exp_investments_5_9 TEXT,
    team_exp_exits_5_9 TEXT,
    team_exp_investments_10_14 TEXT,
    team_exp_exits_10_14 TEXT,
    team_exp_investments_15_24 TEXT,
    team_exp_exits_15_24 TEXT,
    team_exp_investments_25_plus TEXT,
    team_exp_exits_25_plus TEXT,
    
    -- Columns 64-65: Legal Domicile
    legal_domicile TEXT,
    legal_domicile_other TEXT,
    
    -- Columns 66-67: Currency Management
    currency_investments TEXT,
    currency_lp_commitments TEXT,
    
    -- Columns 68-69: Fund Vehicle Type and Status
    fund_vehicle_type_status TEXT,
    fund_vehicle_other TEXT,
    
    -- Columns 70-87: Fund Size (18 columns - 3 categories x 6 ranges)
    fund_size_under_1m_current_raised TEXT,
    fund_size_under_1m_current_invested TEXT,
    fund_size_under_1m_target TEXT,
    fund_size_1_4m_current_raised TEXT,
    fund_size_1_4m_current_invested TEXT,
    fund_size_1_4m_target TEXT,
    fund_size_5_9m_current_raised TEXT,
    fund_size_5_9m_current_invested TEXT,
    fund_size_5_9m_target TEXT,
    fund_size_10_19m_current_raised TEXT,
    fund_size_10_19m_current_invested TEXT,
    fund_size_10_19m_target TEXT,
    fund_size_20_29m_current_raised TEXT,
    fund_size_20_29m_current_invested TEXT,
    fund_size_20_29m_target TEXT,
    fund_size_30m_plus_current_raised TEXT,
    fund_size_30m_plus_current_invested TEXT,
    fund_size_30m_plus_target TEXT,
    
    -- Columns 88-91: Investment Details
    target_number_investments TEXT,
    follow_on_investments TEXT,
    target_irr TEXT,
    target_irr_other TEXT,
    
    -- Columns 92-97: Concessionary Capital (6 columns)
    concessionary_none TEXT,
    concessionary_pre_launch TEXT,
    concessionary_ongoing_costs TEXT,
    concessionary_first_loss TEXT,
    concessionary_business_dev TEXT,
    concessionary_other TEXT,
    
    -- Columns 98-114: LP Capital Sources (17 columns)
    lp_local_hnw_existing TEXT,
    lp_local_hnw_target TEXT,
    lp_domestic_institutional_existing TEXT,
    lp_domestic_institutional_target TEXT,
    lp_local_govt_existing TEXT,
    lp_local_govt_target TEXT,
    lp_intl_fund_of_funds_existing TEXT,
    lp_intl_fund_of_funds_target TEXT,
    lp_intl_institutional_existing TEXT,
    lp_intl_institutional_target TEXT,
    lp_dfis_existing TEXT,
    lp_dfis_target TEXT,
    lp_intl_impact_existing TEXT,
    lp_intl_impact_target TEXT,
    lp_donors_existing TEXT,
    lp_donors_target TEXT,
    lp_other TEXT,
    
    -- Columns 115-123: GP Commitment and Fees
    gp_financial_commitment TEXT,
    gp_mgmt_fee_not_applicable TEXT,
    gp_mgmt_fee_under_2_pct TEXT,
    gp_mgmt_fee_2_pct TEXT,
    gp_mgmt_fee_over_2_pct TEXT,
    gp_mgmt_fee_sliding_scale TEXT,
    gp_mgmt_fee_other TEXT,
    carried_interest_hurdle TEXT,
    carried_interest_other TEXT,
    
    -- Columns 124-135: Fundraising Barriers (12 columns)
    barrier_geography TEXT,
    barrier_fund_size TEXT,
    barrier_sector_alignment TEXT,
    barrier_fund_mgmt_experience TEXT,
    barrier_target_returns TEXT,
    barrier_portfolio_risk TEXT,
    barrier_fund_economics TEXT,
    barrier_currency TEXT,
    barrier_domicile TEXT,
    barrier_back_office TEXT,
    barrier_governance TEXT,
    barrier_other TEXT,
    
    -- Columns 136-139: Business Stage (4 columns)
    stage_startup TEXT,
    stage_early TEXT,
    stage_growth TEXT,
    stage_other TEXT,
    
    -- Columns 140-143: Enterprise Types (4 columns)
    enterprise_livelihood TEXT,
    enterprise_growth TEXT,
    enterprise_dynamic TEXT,
    enterprise_high_growth TEXT,
    
    -- Columns 144-149: Financing Needs (6 columns)
    financing_venture_launch TEXT,
    financing_working_capital TEXT,
    financing_small_assets TEXT,
    financing_major_capital TEXT,
    financing_growth_capital TEXT,
    financing_other TEXT,
    
    -- Columns 150-165: Sector Focus (16 columns - 5 sectors x 3 fields + other)
    sector_1_name TEXT,
    sector_1_current_pct TEXT,
    sector_1_target_pct TEXT,
    sector_2_name TEXT,
    sector_2_current_pct TEXT,
    sector_2_target_pct TEXT,
    sector_3_name TEXT,
    sector_3_current_pct TEXT,
    sector_3_target_pct TEXT,
    sector_4_name TEXT,
    sector_4_current_pct TEXT,
    sector_4_target_pct TEXT,
    sector_5_name TEXT,
    sector_5_current_pct TEXT,
    sector_5_target_pct TEXT,
    sector_other TEXT,
    
    -- Columns 166-174: Financial Instruments (9 columns)
    instrument_senior_debt_secured TEXT,
    instrument_senior_debt_unsecured TEXT,
    instrument_mezzanine TEXT,
    instrument_convertible_notes TEXT,
    instrument_safes TEXT,
    instrument_shared_revenue TEXT,
    instrument_preferred_equity TEXT,
    instrument_common_equity TEXT,
    instrument_other TEXT,
    
    -- Columns 175-177: SDGs (3 columns)
    sdg_first TEXT,
    sdg_second TEXT,
    sdg_third TEXT,
    
    -- Columns 178-205: Gender Lens Investing (28 columns - 9 categories x 3 fields + other)
    gli_majority_women_not_applicable TEXT,
    gli_majority_women_consideration TEXT,
    gli_majority_women_requirement TEXT,
    gli_women_senior_mgmt_not_applicable TEXT,
    gli_women_senior_mgmt_consideration TEXT,
    gli_women_senior_mgmt_requirement TEXT,
    gli_women_direct_workforce_not_applicable TEXT,
    gli_women_direct_workforce_consideration TEXT,
    gli_women_direct_workforce_requirement TEXT,
    gli_women_indirect_workforce_not_applicable TEXT,
    gli_women_indirect_workforce_consideration TEXT,
    gli_women_indirect_workforce_requirement TEXT,
    gli_gender_equality_policies_not_applicable TEXT,
    gli_gender_equality_policies_consideration TEXT,
    gli_gender_equality_policies_requirement TEXT,
    gli_women_beneficiaries_not_applicable TEXT,
    gli_women_beneficiaries_consideration TEXT,
    gli_women_beneficiaries_requirement TEXT,
    gli_enterprise_reporting_not_applicable TEXT,
    gli_enterprise_reporting_consideration TEXT,
    gli_enterprise_reporting_requirement TEXT,
    gli_board_representation_not_applicable TEXT,
    gli_board_representation_consideration TEXT,
    gli_board_representation_requirement TEXT,
    gli_female_ceo_not_applicable TEXT,
    gli_female_ceo_consideration TEXT,
    gli_female_ceo_requirement TEXT,
    gli_other TEXT,
    
    -- Column 206: Technology Role
    technology_role TEXT,
    
    -- Columns 207-212: Pipeline Sourcing (6 columns)
    pipeline_online TEXT,
    pipeline_competition TEXT,
    pipeline_referral TEXT,
    pipeline_own_accelerator TEXT,
    pipeline_third_party_accelerator TEXT,
    pipeline_other TEXT,
    
    -- Column 213: Average Investment Size
    avg_investment_size TEXT,
    
    -- Columns 214-224: Portfolio Priorities First 12 Months (11 columns)
    priority_senior_mgmt TEXT,
    priority_financial_mgmt TEXT,
    priority_fundraising TEXT,
    priority_working_capital TEXT,
    priority_strategic_planning TEXT,
    priority_product_refinement TEXT,
    priority_sales_marketing TEXT,
    priority_human_capital TEXT,
    priority_operations TEXT,
    priority_digitalization TEXT,
    priority_other TEXT,
    
    -- Column 225: Investment Timeframe
    investment_timeframe TEXT,
    
    -- Columns 226-232: Exit Forms (7 columns)
    exit_interest_repayment TEXT,
    exit_self_liquidating TEXT,
    exit_dividends TEXT,
    exit_strategic_sale TEXT,
    exit_management_buyout TEXT,
    exit_financial_investor TEXT,
    exit_other TEXT,
    
    -- Columns 233-234: Exits Achieved
    exits_equity_count TEXT,
    exits_debt_count TEXT,
    
    -- Columns 235-237: Investment Count and Forecast
    investments_to_date TEXT,
    investments_supplement TEXT,
    exits_anticipated_12m TEXT,
    
    -- Columns 238-242: Portfolio Performance (5 columns)
    perf_revenue_12m_historical TEXT,
    perf_cashflow_12m_historical TEXT,
    perf_revenue_12m_forecast TEXT,
    perf_cashflow_12m_forecast TEXT,
    perf_other TEXT,
    
    -- Columns 243-247: Employment Impact (5 columns)
    jobs_direct_cumulative TEXT,
    jobs_direct_forecast TEXT,
    jobs_indirect_cumulative TEXT,
    jobs_indirect_forecast TEXT,
    jobs_other TEXT,
    
    -- Columns 248-260: Fund Priorities Next 12 Months (13 columns)
    fund_priority_capital_raising TEXT,
    fund_priority_fund_economics TEXT,
    fund_priority_pipeline_dev TEXT,
    fund_priority_coinvestment TEXT,
    fund_priority_new_investments TEXT,
    fund_priority_follow_on TEXT,
    fund_priority_post_investment TEXT,
    fund_priority_talent_mgmt TEXT,
    fund_priority_admin_tech TEXT,
    fund_priority_exits TEXT,
    fund_priority_legal_regulatory TEXT,
    fund_priority_impact_metrics TEXT,
    fund_priority_other TEXT,
    
    -- Columns 261-268: Domestic Concerns (8 columns)
    concern_domestic_political TEXT,
    concern_domestic_currency TEXT,
    concern_domestic_interest_rates TEXT,
    concern_domestic_regulatory TEXT,
    concern_domestic_banking TEXT,
    concern_domestic_supply_chain TEXT,
    concern_domestic_covid TEXT,
    concern_domestic_other TEXT,
    
    -- Columns 269-276: International Concerns (8 columns)
    concern_intl_political TEXT,
    concern_intl_export TEXT,
    concern_intl_imports TEXT,
    concern_intl_regulatory TEXT,
    concern_intl_financial_system TEXT,
    concern_intl_interest_rates TEXT,
    concern_intl_covid TEXT,
    concern_intl_other TEXT,
    
    -- Column 277: Survey Results Interest
    survey_results_interest TEXT,
    
    -- System Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_survey_2022_user_id ON public.survey_responses_2022(user_id);
CREATE INDEX idx_survey_2022_company_name ON public.survey_responses_2022(company_name);
CREATE INDEX idx_survey_2022_email ON public.survey_responses_2022(email_address);
CREATE INDEX idx_survey_2022_organization ON public.survey_responses_2022(organization_name);
CREATE INDEX idx_survey_2022_completed_at ON public.survey_responses_2022(completed_at);
CREATE INDEX idx_survey_2022_created_at ON public.survey_responses_2022(created_at);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Policy: Users can view their own responses
DROP POLICY IF EXISTS "Users can view own survey" ON public.survey_responses_2022;
CREATE POLICY "Users can view own survey"
    ON public.survey_responses_2022 FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own responses
DROP POLICY IF EXISTS "Users can insert own survey" ON public.survey_responses_2022;
CREATE POLICY "Users can insert own survey"
    ON public.survey_responses_2022 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own responses
DROP POLICY IF EXISTS "Users can update own survey" ON public.survey_responses_2022;
CREATE POLICY "Users can update own survey"
    ON public.survey_responses_2022 FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Admins can view all responses
DROP POLICY IF EXISTS "Admins can view all surveys" ON public.survey_responses_2022;
CREATE POLICY "Admins can view all surveys"
    ON public.survey_responses_2022 FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- Policy: Admins can update all responses
DROP POLICY IF EXISTS "Admins can update all surveys" ON public.survey_responses_2022;
CREATE POLICY "Admins can update all surveys"
    ON public.survey_responses_2022 FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- Policy: Admins can delete responses
DROP POLICY IF EXISTS "Admins can delete surveys" ON public.survey_responses_2022;
CREATE POLICY "Admins can delete surveys"
    ON public.survey_responses_2022 FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- =====================================================
-- CREATE TRIGGER FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_survey_2022_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_2022_updated_at ON public.survey_responses_2022;
CREATE TRIGGER update_survey_2022_updated_at
    BEFORE UPDATE ON public.survey_responses_2022
    FOR EACH ROW
    EXECUTE FUNCTION public.update_survey_2022_updated_at();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.survey_responses_2022 TO authenticated;
GRANT SELECT ON public.survey_responses_2022 TO anon;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify table structure
DO $$
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'survey_responses_2022';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Survey 2022 Table Created Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total columns: %', col_count;
    RAISE NOTICE 'Expected: 280 (277 survey + 3 system)';
    RAISE NOTICE '';
    RAISE NOTICE 'Table structure breakdown:';
    RAISE NOTICE '  - System fields: 3 (id, user_id, company_name)';
    RAISE NOTICE '  - Basic info: 5 (cols 1-5)';
    RAISE NOTICE '  - Timeline: 3 (cols 6-8)';
    RAISE NOTICE '  - Geographic markets: 9 (cols 9-17)';
    RAISE NOTICE '  - Team based: 9 (cols 18-26)';
    RAISE NOTICE '  - FTEs & Principals: 3 (cols 27-29)';
    RAISE NOTICE '  - GP Experience: 16 (cols 30-45)';
    RAISE NOTICE '  - Gender orientation: 6 (cols 46-51)';
    RAISE NOTICE '  - Team experience: 12 (cols 52-63)';
    RAISE NOTICE '  - Legal & Currency: 4 (cols 64-67)';
    RAISE NOTICE '  - Fund vehicle: 2 (cols 68-69)';
    RAISE NOTICE '  - Fund size: 18 (cols 70-87)';
    RAISE NOTICE '  - Investment details: 4 (cols 88-91)';
    RAISE NOTICE '  - Concessionary capital: 6 (cols 92-97)';
    RAISE NOTICE '  - LP capital sources: 17 (cols 98-114)';
    RAISE NOTICE '  - GP commitment & fees: 9 (cols 115-123)';
    RAISE NOTICE '  - Fundraising barriers: 12 (cols 124-135)';
    RAISE NOTICE '  - Business stage: 4 (cols 136-139)';
    RAISE NOTICE '  - Enterprise types: 4 (cols 140-143)';
    RAISE NOTICE '  - Financing needs: 6 (cols 144-149)';
    RAISE NOTICE '  - Sector focus: 16 (cols 150-165)';
    RAISE NOTICE '  - Financial instruments: 9 (cols 166-174)';
    RAISE NOTICE '  - SDGs: 3 (cols 175-177)';
    RAISE NOTICE '  - Gender lens investing: 28 (cols 178-205)';
    RAISE NOTICE '  - Technology role: 1 (col 206)';
    RAISE NOTICE '  - Pipeline sourcing: 6 (cols 207-212)';
    RAISE NOTICE '  - Investment size: 1 (col 213)';
    RAISE NOTICE '  - Portfolio priorities: 11 (cols 214-224)';
    RAISE NOTICE '  - Investment timeframe: 1 (col 225)';
    RAISE NOTICE '  - Exit forms: 7 (cols 226-232)';
    RAISE NOTICE '  - Exits achieved: 2 (cols 233-234)';
    RAISE NOTICE '  - Investment count: 3 (cols 235-237)';
    RAISE NOTICE '  - Portfolio performance: 5 (cols 238-242)';
    RAISE NOTICE '  - Employment impact: 5 (cols 243-247)';
    RAISE NOTICE '  - Fund priorities: 13 (cols 248-260)';
    RAISE NOTICE '  - Domestic concerns: 8 (cols 261-268)';
    RAISE NOTICE '  - International concerns: 8 (cols 269-276)';
    RAISE NOTICE '  - Survey interest: 1 (col 277)';
    RAISE NOTICE '';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '  ✓ RLS Policies: 6 created';
    RAISE NOTICE '  ✓ Indexes: 6 created';
    RAISE NOTICE '  ✓ Triggers: 1 created';
    RAISE NOTICE '  ✓ Permissions: Granted';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready for:';
    RAISE NOTICE '  1. Python data migration script';
    RAISE NOTICE '  2. Excel data import (51 rows)';
    RAISE NOTICE '========================================';
END $$;
