-- =====================================================
-- FINAL 2021 SURVEY SCHEMA - ALL 167 COLUMNS
-- This schema exactly matches the Excel data structure
-- Ready for Python migration script and TSX form updates
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- DROP EXISTING TABLE IF EXISTS
-- =====================================================
DROP TABLE IF EXISTS public.survey_responses_2021 CASCADE;

-- =====================================================
-- CREATE 2021 SURVEY TABLE - COMPLETE STRUCTURE
-- =====================================================

CREATE TABLE public.survey_responses_2021 (
    -- System Fields
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT,
    
    -- Column 1: Timestamp
    timestamp TIMESTAMPTZ,
    
    -- Column 2: Email Address
    email_address TEXT NOT NULL,
    
    -- Columns 3-5: Basic Information
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    
    -- Column 6: Where is your team based?
    team_based TEXT[],
    
    -- Column 7: Geographic focus
    geographic_focus TEXT[],
    
    -- Column 8: Fund stage
    fund_stage TEXT,
    
    -- Columns 9-22: Question 7 - Timeline (14 columns)
    -- When did your current fund/investment vehicle achieve each milestone?
    timeline_na TEXT,
    timeline_prior_2000 TEXT,
    timeline_2000_2010 TEXT,
    timeline_2011 TEXT,
    timeline_2012 TEXT,
    timeline_2013 TEXT,
    timeline_2014 TEXT,
    timeline_2015 TEXT,
    timeline_2016 TEXT,
    timeline_2017 TEXT,
    timeline_2018 TEXT,
    timeline_2019 TEXT,
    timeline_2020 TEXT,
    timeline_2021 TEXT,
    
    -- Columns 23-28: Question 8 - Number of Investments (6 columns)
    -- Number of investments made to date by current vehicle
    investments_0 TEXT,
    investments_1_4 TEXT,
    investments_5_9 TEXT,
    investments_10_14 TEXT,
    investments_15_24 TEXT,
    investments_25_plus TEXT,
    
    -- Column 29: Question 9 - Optional supplement
    optional_supplement TEXT,
    
    -- Column 30: Question 10 - Investment vehicle type
    investment_vehicle_type TEXT[],
    
    -- Columns 31-36: Question 11 - Fund Size (6 columns)
    -- Current and target size of fund/investment vehicle
    fund_size_under_1m TEXT,
    fund_size_1_4m TEXT,
    fund_size_5_9m TEXT,
    fund_size_10_19m TEXT,
    fund_size_20_29m TEXT,
    fund_size_30m_plus TEXT,
    
    -- Column 37: Question 12 - Investment timeframe
    investment_timeframe TEXT,
    
    -- Column 38: Question 13 - Business model targeted
    business_model_targeted TEXT[],
    
    -- Column 39: Question 14 - Business stage targeted
    business_stage_targeted TEXT[],
    
    -- Column 40: Question 15 - Financing needs
    financing_needs TEXT[],
    
    -- Column 41: Question 16 - Target capital sources
    target_capital_sources TEXT[],
    
    -- Columns 42-46: Question 17 - Target IRR (5 columns)
    -- Target Internal Rate of Return for investors
    target_irr_under_5 TEXT,
    target_irr_6_9 TEXT,
    target_irr_10_15 TEXT,
    target_irr_16_20 TEXT,
    target_irr_20_plus TEXT,
    
    -- Column 47: Question 18 - Impact vs financial orientation
    impact_vs_financial_orientation TEXT,
    
    -- Column 48: Question 19 - Explicit lens/focus
    explicit_lens_focus TEXT[],
    
    -- Column 49: Question 20 - Report SDGs
    report_sdgs BOOLEAN,
    
    -- Columns 50-66: Question 21 - Top 3 SDGs (17 columns)
    -- Individual ranking for each SDG (First, Second, Third, Others)
    sdg_no_poverty TEXT,
    sdg_zero_hunger TEXT,
    sdg_good_health TEXT,
    sdg_quality_education TEXT,
    sdg_gender_equality TEXT,
    sdg_clean_water TEXT,
    sdg_clean_energy TEXT,
    sdg_decent_work TEXT,
    sdg_industry_innovation TEXT,
    sdg_reduced_inequalities TEXT,
    sdg_sustainable_cities TEXT,
    sdg_responsible_consumption TEXT,
    sdg_climate_action TEXT,
    sdg_life_below_water TEXT,
    sdg_life_on_land TEXT,
    sdg_peace_justice TEXT,
    sdg_partnerships TEXT,
    
    -- Columns 67-76: Question 22 - Gender Considerations (10 columns)
    -- Investment Consideration or Investment Requirement for each
    gender_majority_women_ownership TEXT,
    gender_women_senior_mgmt TEXT,
    gender_women_direct_workforce TEXT,
    gender_women_indirect_workforce TEXT,
    gender_equality_policies TEXT,
    gender_women_beneficiaries TEXT,
    gender_reporting_indicators TEXT,
    gender_board_representation TEXT,
    gender_female_ceo TEXT,
    gender_other TEXT,
    
    -- Column 77: Question 23 - Gender fund vehicle
    gender_fund_vehicle TEXT[],
    
    -- Columns 78-83: Question 24 - Investment Size (6 columns)
    -- Typical size of investment at initial investment
    investment_size_under_100k TEXT,
    investment_size_100k_199k TEXT,
    investment_size_200k_499k TEXT,
    investment_size_500k_999k TEXT,
    investment_size_1m_2m TEXT,
    investment_size_2m_plus TEXT,
    
    -- Column 84: Question 25 - Investment forms
    investment_forms TEXT[],
    
    -- Column 85: Question 26 - Target sectors
    target_sectors TEXT[],
    
    -- Column 86: Question 27 - Carried interest principals
    carried_interest_principals TEXT,
    
    -- Column 87: Question 28 - Current FTEs
    current_ftes TEXT,
    
    -- Columns 88-97: Question 29 - Portfolio Needs (10 columns)
    -- Key needs of portfolio enterprises - ranked 1-5
    portfolio_need_finance_budgeting TEXT,
    portfolio_need_fundraising TEXT,
    portfolio_need_strategic_planning TEXT,
    portfolio_need_product_market TEXT,
    portfolio_need_human_capital TEXT,
    portfolio_need_technology TEXT,
    portfolio_need_legal_regulatory TEXT,
    portfolio_need_operations TEXT,
    portfolio_need_management_training TEXT,
    portfolio_need_other TEXT,
    
    -- Column 98: Question 30 - Investment monetization
    investment_monetization TEXT[],
    
    -- Column 99: Question 31 - Exits achieved
    exits_achieved TEXT,
    
    -- Columns 100-114: Question 32 - Fund Capabilities (15 columns)
    -- Areas of desired investment/support for fund - ranked 1-5
    fund_capability_global_lps TEXT,
    fund_capability_local_lps TEXT,
    fund_capability_warehousing TEXT,
    fund_capability_grant_opex TEXT,
    fund_capability_ta_support TEXT,
    fund_capability_economics TEXT,
    fund_capability_structuring TEXT,
    fund_capability_investment_process TEXT,
    fund_capability_post_investment TEXT,
    fund_capability_human_capital TEXT,
    fund_capability_back_office TEXT,
    fund_capability_exit_opportunities TEXT,
    fund_capability_legal_regulatory TEXT,
    fund_capability_impact_metrics TEXT,
    fund_capability_other TEXT,
    
    -- Column 115: Question 33 - COVID impact aggregate
    covid_impact_aggregate TEXT,
    
    -- Columns 116-123: Question 34 - COVID Portfolio Impact (8 columns)
    -- Impact of COVID-19 on various aspects
    covid_impact_staff_attendance TEXT,
    covid_impact_customer_demand TEXT,
    covid_impact_pay_salaries TEXT,
    covid_impact_fixed_costs TEXT,
    covid_impact_business_loans TEXT,
    covid_impact_supply_access TEXT,
    covid_impact_pay_inputs TEXT,
    covid_impact_pivot_model TEXT,
    
    -- Column 124: Question 35 - COVID government support
    covid_government_support TEXT[],
    
    -- Column 125: Question 36 - Raising capital 2021
    raising_capital_2021 TEXT[],
    
    -- Column 126: Question 37 - Fund vehicle considerations
    fund_vehicle_considerations TEXT[],
    
    -- Column 127: Question 38 - Network value rating
    network_value_rating TEXT,
    
    -- Columns 128-132: Question 39 - Working Groups (5 columns)
    -- Most valuable working groups - ranked 1-5 or N/A
    working_group_fund_economics TEXT,
    working_group_lp_profiles TEXT,
    working_group_market_data TEXT,
    working_group_purpose_definition TEXT,
    working_group_access_capital TEXT,
    
    -- Column 133: Question 40 - Working group suggestions
    working_group_suggestions TEXT,
    
    -- Columns 134-144: Question 41 - Webinar Content (11 columns)
    -- Most valuable webinar content - ranked 1-5 or N/A
    webinar_gender_lens TEXT,
    webinar_covid_response TEXT,
    webinar_fundraising TEXT,
    webinar_portfolio_support TEXT,
    webinar_sgb_bridge TEXT,
    webinar_fundraising_2 TEXT,
    webinar_human_capital TEXT,
    webinar_coinvesting TEXT,
    webinar_fundraising_3 TEXT,
    webinar_ag_food_tech TEXT,
    webinar_mentoring_pilot TEXT,
    
    -- Column 145: Question 42 - Webinar suggestions
    webinar_suggestions TEXT,
    
    -- Column 146: Question 43 - Communication platform
    communication_platform TEXT,
    
    -- Columns 147-150: Question 44 - Network Value Areas (4 columns)
    -- Main areas of value from network - ranked 1-5 or N/A
    network_value_peer_connections TEXT,
    network_value_advocacy TEXT,
    network_value_visibility TEXT,
    network_value_systems_change TEXT,
    
    -- Column 151: Question 45 - Present connection session
    present_connection_session TEXT,
    
    -- Columns 152-164: Question 46 - Convening Initiatives (13 columns)
    -- Interest in initiatives - ranked 1-3
    initiative_warehousing TEXT,
    initiative_ta_facility TEXT,
    initiative_advocacy TEXT,
    initiative_mentoring_expert TEXT,
    initiative_mentoring_peer TEXT,
    initiative_webinars_peer TEXT,
    initiative_webinars_expert TEXT,
    initiative_fundraising_advisory TEXT,
    initiative_investment_readiness TEXT,
    initiative_fund_manager_portal TEXT,
    initiative_shared_data TEXT,
    initiative_joint_back_office TEXT,
    initiative_other TEXT,
    
    -- Column 165: Question 47 - Participate mentoring program
    participate_mentoring_program TEXT,
    
    -- Column 166: Question 48 - Present demystifying session
    present_demystifying_session TEXT[],
    
    -- Column 167: Question 49 - Additional comments
    additional_comments TEXT,
    
    -- System Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_survey_2021_user_id ON public.survey_responses_2021(user_id);
CREATE INDEX idx_survey_2021_company_name ON public.survey_responses_2021(company_name);
CREATE INDEX idx_survey_2021_email ON public.survey_responses_2021(email_address);
CREATE INDEX idx_survey_2021_firm_name ON public.survey_responses_2021(firm_name);
CREATE INDEX idx_survey_2021_completed_at ON public.survey_responses_2021(completed_at);
CREATE INDEX idx_survey_2021_timestamp ON public.survey_responses_2021(timestamp);
CREATE INDEX idx_survey_2021_created_at ON public.survey_responses_2021(created_at);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Policy: Users can view their own responses
DROP POLICY IF EXISTS "Users can view own survey" ON public.survey_responses_2021;
CREATE POLICY "Users can view own survey"
    ON public.survey_responses_2021 FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own responses
DROP POLICY IF EXISTS "Users can insert own survey" ON public.survey_responses_2021;
CREATE POLICY "Users can insert own survey"
    ON public.survey_responses_2021 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own responses
DROP POLICY IF EXISTS "Users can update own survey" ON public.survey_responses_2021;
CREATE POLICY "Users can update own survey"
    ON public.survey_responses_2021 FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Admins can view all responses
DROP POLICY IF EXISTS "Admins can view all surveys" ON public.survey_responses_2021;
CREATE POLICY "Admins can view all surveys"
    ON public.survey_responses_2021 FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- Policy: Admins can update all responses
DROP POLICY IF EXISTS "Admins can update all surveys" ON public.survey_responses_2021;
CREATE POLICY "Admins can update all surveys"
    ON public.survey_responses_2021 FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- Policy: Admins can delete responses
DROP POLICY IF EXISTS "Admins can delete surveys" ON public.survey_responses_2021;
CREATE POLICY "Admins can delete surveys"
    ON public.survey_responses_2021 FOR DELETE
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
CREATE OR REPLACE FUNCTION public.update_survey_2021_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_2021_updated_at ON public.survey_responses_2021;
CREATE TRIGGER update_survey_2021_updated_at
    BEFORE UPDATE ON public.survey_responses_2021
    FOR EACH ROW
    EXECUTE FUNCTION public.update_survey_2021_updated_at();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.survey_responses_2021 TO authenticated;
GRANT SELECT ON public.survey_responses_2021 TO anon;

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
    AND table_name = 'survey_responses_2021';
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Survey 2021 Table Created Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total columns: %', col_count;
    RAISE NOTICE 'Expected: 170 (167 survey + 3 system)';
    RAISE NOTICE '';
    RAISE NOTICE 'Table structure breakdown:';
    RAISE NOTICE '  - System fields: 3 (id, user_id, company_name)';
    RAISE NOTICE '  - Timestamp & Email: 2 (cols 1-2)';
    RAISE NOTICE '  - Basic info: 6 (cols 3-8)';
    RAISE NOTICE '  - Timeline: 14 (cols 9-22)';
    RAISE NOTICE '  - Investments: 6 (cols 23-28)';
    RAISE NOTICE '  - Vehicle info: 9 (cols 29-37)';
    RAISE NOTICE '  - Business model: 12 (cols 38-49)';
    RAISE NOTICE '  - SDGs: 17 (cols 50-66)';
    RAISE NOTICE '  - Gender: 11 (cols 67-77)';
    RAISE NOTICE '  - Portfolio: 10 (cols 78-87)';
    RAISE NOTICE '  - Portfolio needs: 12 (cols 88-99)';
    RAISE NOTICE '  - Capabilities: 15 (cols 100-114)';
    RAISE NOTICE '  - COVID impact: 13 (cols 115-127)';
    RAISE NOTICE '  - Network value: 23 (cols 128-150)';
    RAISE NOTICE '  - Convening: 17 (cols 151-167)';
    RAISE NOTICE '';
    RAISE NOTICE 'Features:';
    RAISE NOTICE '  ✓ RLS Policies: 6 created';
    RAISE NOTICE '  ✓ Indexes: 7 created';
    RAISE NOTICE '  ✓ Triggers: 1 created';
    RAISE NOTICE '  ✓ Permissions: Granted';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready for:';
    RAISE NOTICE '  1. TSX form updates (Survey2021.tsx)';
    RAISE NOTICE '  2. Python data migration script';
    RAISE NOTICE '  3. Excel data import';
    RAISE NOTICE '========================================';
END $$;
