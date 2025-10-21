-- =====================================================
-- COMPLETE FRESH DATABASE SCHEMA
-- Run this AFTER 1_DELETE_ALL.sql
-- Creates everything in correct order
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- STEP 1: CREATE USER PROFILES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
    -- Primary Key & Metadata
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Company Information (Primary)
    company_name TEXT NOT NULL,
    company_id UUID DEFAULT gen_random_uuid(), -- Groups users from same company
    
    -- User Information
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role_title TEXT,
    phone TEXT,
    profile_picture_url TEXT,
    
    -- User Role in System
    user_role TEXT NOT NULL DEFAULT 'viewer' CHECK (user_role IN ('admin', 'member', 'viewer')),
    
    -- Account Status
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_id ON public.user_profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_company_name ON public.user_profiles(company_name);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_role ON public.user_profiles(user_role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles(is_active);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles"
    ON public.user_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
CREATE POLICY "Admins can update all profiles"
    ON public.user_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;
CREATE POLICY "Admins can insert profiles"
    ON public.user_profiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- =====================================================
-- STEP 2: CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, company_name, user_role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'company_name', 'Unknown Company'),
        COALESCE(NEW.raw_user_meta_data->>'user_role', 'viewer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Apply update trigger to user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- STEP 3: CREATE 2021 SURVEY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2021 (
    -- Primary Key & Metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Section 1: Background Information
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    team_based TEXT[],
    team_based_other TEXT,
    geographic_focus TEXT[],
    geographic_focus_other TEXT,
    fund_stage TEXT,
    fund_stage_other TEXT,
    legal_entity_date TEXT,
    first_close_date TEXT,
    first_investment_date TEXT,
    
    -- Section 2: Investment Thesis & Capital Construct
    investments_march_2020 TEXT,
    investments_december_2020 TEXT,
    optional_supplement TEXT,
    investment_vehicle_type TEXT[],
    investment_vehicle_type_other TEXT,
    current_fund_size TEXT,
    target_fund_size TEXT,
    investment_timeframe TEXT,
    investment_timeframe_other TEXT,
    business_model_targeted TEXT[],
    business_model_targeted_other TEXT,
    business_stage_targeted TEXT[],
    business_stage_targeted_other TEXT,
    financing_needs TEXT[],
    financing_needs_other TEXT,
    target_capital_sources TEXT[],
    target_capital_sources_other TEXT,
    target_irr_achieved TEXT,
    target_irr_targeted TEXT,
    impact_vs_financial_orientation TEXT,
    explicit_lens_focus TEXT[],
    explicit_lens_focus_other TEXT,
    report_sustainable_development_goals BOOLEAN,
    top_sdg_1 TEXT,
    top_sdg_2 TEXT,
    top_sdg_3 TEXT,
    gender_considerations_investment TEXT[],
    gender_considerations_investment_other TEXT,
    gender_considerations_requirement TEXT[],
    gender_considerations_requirement_other TEXT,
    gender_fund_vehicle TEXT[],
    gender_fund_vehicle_other TEXT,
    
    -- Section 3: Portfolio Construction and Team
    investment_size_your_amount TEXT,
    investment_size_total_raise TEXT,
    investment_forms TEXT[],
    investment_forms_other TEXT,
    target_sectors TEXT[],
    target_sectors_other TEXT,
    carried_interest_principals TEXT,
    current_ftes TEXT,
    
    -- Section 4: Portfolio Development & Investment Return Monetization
    portfolio_needs_ranking JSONB,
    portfolio_needs_other TEXT,
    investment_monetization TEXT[],
    investment_monetization_other TEXT,
    exits_achieved TEXT,
    fund_capabilities_ranking JSONB,
    fund_capabilities_other TEXT,
    
    -- Section 5: Impact of COVID-19 on Vehicle and Portfolio
    covid_impact_aggregate TEXT,
    covid_impact_portfolio JSONB,
    covid_government_support TEXT[],
    covid_government_support_other TEXT,
    raising_capital_2021 TEXT[],
    raising_capital_2021_other TEXT,
    fund_vehicle_considerations TEXT[],
    fund_vehicle_considerations_other TEXT,
    
    -- Section 6: Feedback on ESCP Network Membership
    network_value_rating TEXT,
    working_groups_ranking JSONB,
    new_working_group_suggestions TEXT,
    webinar_content_ranking JSONB,
    new_webinar_suggestions TEXT,
    communication_platform TEXT,
    network_value_areas JSONB,
    present_connection_session BOOLEAN,
    convening_initiatives_ranking JSONB,
    convening_initiatives_other TEXT,
    
    -- Section 7: 2021 Convening Objectives & Goals
    participate_mentoring_program TEXT,
    present_demystifying_session TEXT[],
    present_demystifying_session_other TEXT,
    additional_comments TEXT,
    
    -- System Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for 2021
CREATE INDEX IF NOT EXISTS idx_survey_2021_user_id ON public.survey_responses_2021(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2021_firm_name ON public.survey_responses_2021(firm_name);
CREATE INDEX IF NOT EXISTS idx_survey_2021_completed_at ON public.survey_responses_2021(completed_at);
CREATE INDEX IF NOT EXISTS idx_survey_2021_created_at ON public.survey_responses_2021(created_at);

-- Enable RLS (policies will be added separately)
ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;

-- Create trigger for 2021
DROP TRIGGER IF EXISTS update_survey_2021_updated_at ON public.survey_responses_2021;
CREATE TRIGGER update_survey_2021_updated_at
    BEFORE UPDATE ON public.survey_responses_2021
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- STEP 4: CREATE 2022 SURVEY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2022 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    role_title TEXT,
    email TEXT,
    organisation TEXT,
    legal_entity_date TEXT,
    first_close_date TEXT,
    first_investment_date TEXT,
    geographic_markets TEXT[],
    team_based TEXT[],
    current_ftes TEXT,
    ye2023_ftes TEXT,
    principals_count TEXT,
    new_to_investment TEXT,
    adjacent_finance_experience TEXT,
    business_management_experience TEXT,
    fund_investment_experience TEXT,
    senior_fund_experience TEXT,
    investments_experience TEXT,
    exits_experience TEXT,
    legal_domicile TEXT,
    currency_investments TEXT,
    currency_lp_commitments TEXT,
    fund_operations TEXT,
    current_funds_raised TEXT,
    current_amount_invested TEXT,
    target_fund_size TEXT,
    target_investments TEXT,
    follow_on_permitted TEXT,
    target_irr TEXT,
    gp_commitment TEXT,
    management_fee TEXT,
    carried_interest_hurdle TEXT,
    average_investment_size TEXT,
    investment_timeframe TEXT,
    investments_made TEXT,
    anticipated_exits TEXT,
    investment_stage TEXT,
    investment_size TEXT,
    investment_type TEXT,
    sector_focus TEXT,
    geographic_focus TEXT,
    value_add_services TEXT,
    receive_results BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_survey_2022_user_id ON public.survey_responses_2022(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2022_organisation ON public.survey_responses_2022(organisation);
ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_survey_2022_updated_at ON public.survey_responses_2022;
CREATE TRIGGER update_survey_2022_updated_at
    BEFORE UPDATE ON public.survey_responses_2022
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- STEP 5: CREATE 2023 SURVEY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2023 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_address TEXT,
    organisation_name TEXT,
    funds_raising_investing TEXT,
    fund_name TEXT,
    legal_entity_achieved TEXT,
    first_close_achieved TEXT,
    first_investment_achieved TEXT,
    geographic_markets TEXT[],
    geographic_markets_other TEXT,
    team_based TEXT[],
    team_based_other TEXT,
    fte_staff_2022 INTEGER,
    fte_staff_current INTEGER,
    fte_staff_2024_est INTEGER,
    principals_count INTEGER,
    gender_inclusion TEXT[],
    gender_inclusion_other TEXT,
    team_experience_investments JSONB,
    team_experience_exits JSONB,
    team_experience_other TEXT,
    legal_domicile TEXT[],
    legal_domicile_other TEXT,
    currency_investments TEXT,
    currency_lp_commitments TEXT,
    fund_type_status TEXT,
    fund_type_status_other TEXT,
    current_funds_raised NUMERIC,
    current_amount_invested NUMERIC,
    target_fund_size NUMERIC,
    target_investments_count INTEGER,
    follow_on_investment_permitted TEXT,
    concessionary_capital TEXT[],
    concessionary_capital_other TEXT,
    lp_capital_sources_existing JSONB,
    lp_capital_sources_target JSONB,
    gp_financial_commitment TEXT[],
    gp_financial_commitment_other TEXT,
    gp_management_fee TEXT,
    gp_management_fee_other TEXT,
    hurdle_rate_currency TEXT,
    hurdle_rate_currency_other TEXT,
    hurdle_rate_percentage NUMERIC,
    target_local_currency_return NUMERIC,
    fundraising_constraints JSONB,
    fundraising_constraints_other TEXT,
    business_stages JSONB,
    growth_expectations JSONB,
    financing_needs JSONB,
    sector_focus JSONB,
    sector_focus_other TEXT,
    financial_instruments JSONB,
    sustainable_development_goals TEXT[],
    gender_lens_investing JSONB,
    gender_lens_investing_other TEXT,
    pipeline_sourcing JSONB,
    pipeline_sourcing_other TEXT,
    average_investment_size TEXT,
    capital_raise_percentage NUMERIC,
    portfolio_priorities JSONB,
    portfolio_priorities_other TEXT,
    technical_assistance_funding JSONB,
    technical_assistance_funding_other TEXT,
    business_development_support TEXT[],
    business_development_support_other TEXT,
    investment_timeframe TEXT,
    exit_form TEXT[],
    exit_form_other TEXT,
    equity_investments_count INTEGER,
    debt_investments_count INTEGER,
    equity_exits_count INTEGER,
    debt_exits_count INTEGER,
    equity_exits_anticipated INTEGER,
    debt_exits_anticipated INTEGER,
    other_investments TEXT,
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
    fund_priorities JSONB,
    fund_priorities_other TEXT,
    concerns_ranking JSONB,
    concerns_ranking_other TEXT,
    future_research_data TEXT[],
    future_research_data_other TEXT,
    one_on_one_meeting BOOLEAN,
    receive_survey_results BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_survey_2023_user_id ON public.survey_responses_2023(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2023_organisation ON public.survey_responses_2023(organisation_name);
ALTER TABLE public.survey_responses_2023 ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_survey_2023_updated_at ON public.survey_responses_2023;
CREATE TRIGGER update_survey_2023_updated_at
    BEFORE UPDATE ON public.survey_responses_2023
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- STEP 6: CREATE 2024 SURVEY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_address TEXT,
    investment_networks TEXT[],
    investment_networks_other TEXT,
    organisation_name TEXT,
    funds_raising_investing TEXT,
    fund_name TEXT,
    legal_entity_achieved TEXT,
    first_close_achieved TEXT,
    first_investment_achieved TEXT,
    geographic_markets TEXT[],
    geographic_markets_other TEXT,
    team_based TEXT[],
    team_based_other TEXT,
    fte_staff_2023_actual INTEGER,
    fte_staff_current INTEGER,
    fte_staff_2025_forecast INTEGER,
    investment_approval TEXT[],
    investment_approval_other TEXT,
    principals_total INTEGER,
    principals_women INTEGER,
    gender_inclusion TEXT[],
    gender_inclusion_other TEXT,
    team_experience_investments JSONB,
    team_experience_exits JSONB,
    legal_domicile TEXT[],
    legal_domicile_other TEXT,
    domicile_reason TEXT[],
    domicile_reason_other TEXT,
    regulatory_impact JSONB,
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
    target_number_investments INTEGER,
    follow_on_permitted TEXT,
    concessionary_capital TEXT[],
    concessionary_capital_other TEXT,
    existing_lp_sources JSONB,
    target_lp_sources JSONB,
    gp_financial_commitment TEXT[],
    gp_financial_commitment_other TEXT,
    gp_management_fee TEXT,
    gp_management_fee_other TEXT,
    hurdle_rate_currency TEXT,
    hurdle_rate_percentage NUMERIC,
    target_return_above_govt_debt NUMERIC,
    fundraising_barriers JSONB,
    business_stages JSONB,
    revenue_growth_mix JSONB,
    financing_needs JSONB,
    sector_target_allocation JSONB,
    investment_considerations JSONB,
    financial_instruments_ranking JSONB,
    top_sdgs TEXT[],
    additional_sdgs TEXT,
    gender_lens_investing JSONB,
    pipeline_sources_quality JSONB,
    sgb_financing_trends JSONB,
    typical_investment_size TEXT,
    post_investment_priorities JSONB,
    technical_assistance_funding JSONB,
    business_development_approach TEXT[],
    business_development_approach_other TEXT,
    unique_offerings JSONB,
    typical_investment_timeframe TEXT,
    investment_monetisation_forms TEXT[],
    investment_monetisation_other TEXT,
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
    portfolio_performance_other TEXT,
    direct_jobs_current INTEGER,
    indirect_jobs_current INTEGER,
    direct_jobs_anticipated INTEGER,
    indirect_jobs_anticipated INTEGER,
    employment_impact_other TEXT,
    fund_priorities_next_12m JSONB,
    data_sharing_willingness TEXT[],
    data_sharing_other TEXT,
    survey_sender TEXT,
    receive_results BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_survey_2024_user_id ON public.survey_responses_2024(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2024_organisation ON public.survey_responses_2024(organisation_name);
ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_survey_2024_updated_at ON public.survey_responses_2024;
CREATE TRIGGER update_survey_2024_updated_at
    BEFORE UPDATE ON public.survey_responses_2024
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Database Schema Created Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  ✓ user_profiles';
    RAISE NOTICE '  ✓ survey_responses_2021';
    RAISE NOTICE '  ✓ survey_responses_2022';
    RAISE NOTICE '  ✓ survey_responses_2023';
    RAISE NOTICE '  ✓ survey_responses_2024';
    RAISE NOTICE '';
    RAISE NOTICE 'Functions created:';
    RAISE NOTICE '  ✓ update_updated_at_column()';
    RAISE NOTICE '  ✓ handle_new_user()';
    RAISE NOTICE '';
    RAISE NOTICE 'Triggers created:';
    RAISE NOTICE '  ✓ on_auth_user_created';
    RAISE NOTICE '  ✓ update_user_profiles_updated_at';
    RAISE NOTICE '  ✓ update_survey_2021_updated_at';
    RAISE NOTICE '  ✓ update_survey_2022_updated_at';
    RAISE NOTICE '  ✓ update_survey_2023_updated_at';
    RAISE NOTICE '  ✓ update_survey_2024_updated_at';
    RAISE NOTICE '';
    RAISE NOTICE 'RLS enabled on all tables';
    RAISE NOTICE 'All schemas match survey form fields!';
    RAISE NOTICE 'Ready for testing and data import!';
    RAISE NOTICE '========================================';
END $$;
