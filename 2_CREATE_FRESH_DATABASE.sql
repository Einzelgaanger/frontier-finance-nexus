-- =====================================================
-- FRESH DATABASE SCHEMA CREATION
-- Creates a clean, optimized database structure
-- Company-centric approach with proper user management
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. USER PROFILES TABLE
-- Company-centric design where company is the primary entity
-- =====================================================
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Company Information (Primary)
    company_name TEXT NOT NULL,
    company_id UUID DEFAULT uuid_generate_v4(), -- Groups users from same company
    
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
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Indexes for performance
    CONSTRAINT unique_email UNIQUE (email)
);

-- Create indexes
CREATE INDEX idx_user_profiles_company_id ON public.user_profiles(company_id);
CREATE INDEX idx_user_profiles_company_name ON public.user_profiles(company_name);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_user_role ON public.user_profiles(user_role);
CREATE INDEX idx_user_profiles_is_active ON public.user_profiles(is_active);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
    ON public.user_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

CREATE POLICY "Admins can update all profiles"
    ON public.user_profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

CREATE POLICY "Admins can insert profiles"
    ON public.user_profiles FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role = 'admin'
        )
    );

-- =====================================================
-- 2. SURVEY RESPONSES 2021 TABLE
-- =====================================================
CREATE TABLE public.survey_responses_2021 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    
    -- Section 1: Basic Information
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    email_address TEXT,
    
    -- Section 2: Team & Geography
    team_based TEXT[],
    team_based_other TEXT,
    geographic_focus TEXT[],
    geographic_focus_other TEXT,
    
    -- Section 3: Fund Operations
    fund_stage TEXT,
    fund_stage_other TEXT,
    legal_entity_date DATE,
    first_close_date DATE,
    first_investment_date DATE,
    investments_march_2020 TEXT,
    investments_december_2020 TEXT,
    optional_supplement TEXT,
    
    -- Section 4: Investment Vehicle
    investment_vehicle_type TEXT[],
    investment_vehicle_type_other TEXT,
    current_fund_size TEXT,
    target_fund_size TEXT,
    investment_timeframe TEXT,
    investment_timeframe_other TEXT,
    
    -- Section 5: Business Model & Stage
    business_model_targeted TEXT[],
    business_model_targeted_other TEXT,
    business_stage_targeted TEXT[],
    business_stage_targeted_other TEXT,
    
    -- Section 6: Financing
    financing_needs TEXT[],
    financing_needs_other TEXT,
    target_capital_sources TEXT[],
    target_capital_sources_other TEXT,
    target_irr_achieved TEXT,
    target_irr_targeted TEXT,
    
    -- Section 7: Impact & SDGs
    impact_vs_financial_orientation TEXT,
    impact_vs_financial_orientation_other TEXT,
    explicit_lens_focus TEXT[],
    explicit_lens_focus_other TEXT,
    report_sustainable_development_goals BOOLEAN,
    top_sdgs JSONB,
    
    -- Section 8: Gender Considerations
    gender_considerations_investment TEXT[],
    gender_considerations_investment_other TEXT,
    gender_considerations_requirement TEXT[],
    gender_considerations_requirement_other TEXT,
    gender_considerations_other_enabled BOOLEAN,
    gender_considerations_other_description TEXT,
    gender_fund_vehicle TEXT[],
    gender_fund_vehicle_other TEXT,
    
    -- Section 9: Investment Details
    investment_size_your_amount TEXT,
    investment_size_total_raise TEXT,
    investment_forms TEXT[],
    investment_forms_other TEXT,
    target_sectors TEXT[],
    target_sectors_other TEXT,
    
    -- Section 10: Team Structure
    carried_interest_principals TEXT,
    current_ftes TEXT,
    
    -- Section 11: Portfolio Needs
    portfolio_needs_ranking JSONB,
    portfolio_needs_other TEXT,
    portfolio_needs_other_enabled BOOLEAN,
    
    -- Section 12: Exits
    investment_monetization TEXT[],
    investment_monetization_other TEXT,
    exits_achieved TEXT,
    exits_achieved_other TEXT,
    
    -- Section 13: Fund Capabilities
    fund_capabilities_ranking JSONB,
    fund_capabilities_other TEXT,
    fund_capabilities_other_enabled BOOLEAN,
    
    -- Section 14: COVID-19 Impact
    covid_impact_aggregate TEXT,
    covid_impact_portfolio JSONB,
    covid_government_support TEXT[],
    covid_government_support_other TEXT,
    
    -- Section 15: Future Plans
    raising_capital_2021 TEXT[],
    raising_capital_2021_other TEXT,
    fund_vehicle_considerations TEXT[],
    fund_vehicle_considerations_other TEXT,
    
    -- Section 16: Network Value
    network_value_rating TEXT,
    working_groups_ranking JSONB,
    new_working_group_suggestions TEXT,
    webinar_content_ranking JSONB,
    new_webinar_suggestions TEXT,
    communication_platform TEXT,
    communication_platform_other TEXT,
    network_value_areas JSONB,
    
    -- Section 17: Engagement
    present_connection_session TEXT,
    present_connection_session_other TEXT,
    convening_initiatives_ranking JSONB,
    convening_initiatives_other TEXT,
    convening_initiatives_other_enabled BOOLEAN,
    participate_mentoring_program TEXT,
    participate_mentoring_program_other TEXT,
    present_demystifying_session TEXT[],
    present_demystifying_session_other TEXT,
    present_demystifying_session_other_enabled BOOLEAN,
    
    -- Additional Comments
    additional_comments TEXT,
    
    -- Status & Timestamps
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for 2021
CREATE INDEX idx_survey_2021_user_id ON public.survey_responses_2021(user_id);
CREATE INDEX idx_survey_2021_company_name ON public.survey_responses_2021(company_name);
CREATE INDEX idx_survey_2021_completed_at ON public.survey_responses_2021(completed_at);

-- Enable RLS
ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 2021
CREATE POLICY "Users can view own 2021 surveys"
    ON public.survey_responses_2021 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own 2021 surveys"
    ON public.survey_responses_2021 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own 2021 surveys"
    ON public.survey_responses_2021 FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins and members can view all 2021 surveys"
    ON public.survey_responses_2021 FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role IN ('admin', 'member')
        )
    );

-- =====================================================
-- 3. SURVEY RESPONSES 2022 TABLE
-- =====================================================
CREATE TABLE public.survey_responses_2022 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    
    -- Basic Information
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    email_address TEXT,
    
    -- Fund Information
    fund_stage TEXT,
    team_based TEXT[],
    geographic_focus TEXT[],
    investment_vehicle_type TEXT[],
    current_fund_size TEXT,
    target_fund_size TEXT,
    
    -- Investment Strategy
    business_model_targeted TEXT[],
    business_stage_targeted TEXT[],
    target_sectors TEXT[],
    investment_forms TEXT[],
    investment_size_range TEXT,
    
    -- Impact & Gender
    impact_orientation TEXT,
    report_sdgs BOOLEAN,
    top_sdgs JSONB,
    gender_lens_investing BOOLEAN,
    gender_considerations TEXT[],
    
    -- Team & Operations
    team_size TEXT,
    carried_interest_principals TEXT,
    
    -- Portfolio & Performance
    number_of_investments TEXT,
    exits_to_date TEXT,
    target_irr TEXT,
    
    -- Network Engagement
    network_value_rating TEXT,
    areas_of_interest TEXT[],
    willing_to_present BOOLEAN,
    mentoring_interest TEXT,
    
    -- Additional
    additional_comments TEXT,
    
    -- Status & Timestamps
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for 2022
CREATE INDEX idx_survey_2022_user_id ON public.survey_responses_2022(user_id);
CREATE INDEX idx_survey_2022_company_name ON public.survey_responses_2022(company_name);
CREATE INDEX idx_survey_2022_completed_at ON public.survey_responses_2022(completed_at);

-- Enable RLS
ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 2022 (same pattern as 2021)
CREATE POLICY "Users can view own 2022 surveys"
    ON public.survey_responses_2022 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own 2022 surveys"
    ON public.survey_responses_2022 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own 2022 surveys"
    ON public.survey_responses_2022 FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins and members can view all 2022 surveys"
    ON public.survey_responses_2022 FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role IN ('admin', 'member')
        )
    );

-- =====================================================
-- 4. SURVEY RESPONSES 2023 TABLE
-- =====================================================
CREATE TABLE public.survey_responses_2023 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    
    -- Basic Information
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    email_address TEXT,
    
    -- Fund Information
    fund_stage TEXT,
    team_location TEXT[],
    geographic_focus TEXT[],
    investment_vehicle_type TEXT[],
    current_fund_size TEXT,
    target_fund_size TEXT,
    fund_vintage_year TEXT,
    
    -- Investment Strategy
    business_model_targeted TEXT[],
    business_stage_targeted TEXT[],
    target_sectors TEXT[],
    investment_forms TEXT[],
    typical_investment_size TEXT,
    investment_timeframe TEXT,
    
    -- Impact & ESG
    impact_orientation TEXT,
    report_sdgs BOOLEAN,
    top_sdgs JSONB,
    esg_framework TEXT[],
    gender_lens_investing BOOLEAN,
    gender_considerations TEXT[],
    
    -- Team & Operations
    team_size TEXT,
    carried_interest_principals TEXT,
    key_team_capabilities TEXT[],
    
    -- Portfolio & Performance
    number_of_investments TEXT,
    exits_to_date TEXT,
    target_irr TEXT,
    actual_irr TEXT,
    
    -- Challenges & Support Needs
    key_challenges TEXT[],
    support_needs TEXT[],
    technical_assistance_areas TEXT[],
    
    -- Network Engagement
    network_value_rating TEXT,
    most_valuable_network_aspects TEXT[],
    willing_to_present BOOLEAN,
    presentation_topics TEXT[],
    mentoring_interest TEXT,
    peer_learning_interest TEXT[],
    
    -- Market Insights
    market_outlook TEXT,
    emerging_trends TEXT[],
    
    -- Additional
    additional_comments TEXT,
    
    -- Status & Timestamps
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for 2023
CREATE INDEX idx_survey_2023_user_id ON public.survey_responses_2023(user_id);
CREATE INDEX idx_survey_2023_company_name ON public.survey_responses_2023(company_name);
CREATE INDEX idx_survey_2023_completed_at ON public.survey_responses_2023(completed_at);

-- Enable RLS
ALTER TABLE public.survey_responses_2023 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 2023
CREATE POLICY "Users can view own 2023 surveys"
    ON public.survey_responses_2023 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own 2023 surveys"
    ON public.survey_responses_2023 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own 2023 surveys"
    ON public.survey_responses_2023 FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins and members can view all 2023 surveys"
    ON public.survey_responses_2023 FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role IN ('admin', 'member')
        )
    );

-- =====================================================
-- 5. SURVEY RESPONSES 2024 TABLE
-- =====================================================
CREATE TABLE public.survey_responses_2024 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    
    -- Basic Information
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    email_address TEXT,
    
    -- Fund Information
    fund_stage TEXT,
    team_location TEXT[],
    geographic_focus TEXT[],
    markets_operated TEXT[],
    investment_vehicle_type TEXT[],
    current_fund_size TEXT,
    target_fund_size TEXT,
    fund_vintage_year TEXT,
    legal_domicile TEXT,
    
    -- Investment Strategy
    business_model_targeted TEXT[],
    business_stage_targeted TEXT[],
    target_sectors TEXT[],
    investment_forms TEXT[],
    typical_investment_size TEXT,
    investment_timeframe TEXT,
    co_investment_approach TEXT,
    
    -- Impact & ESG
    impact_orientation TEXT,
    impact_measurement_frameworks TEXT[],
    report_sdgs BOOLEAN,
    top_sdgs JSONB,
    esg_framework TEXT[],
    climate_focus BOOLEAN,
    gender_lens_investing BOOLEAN,
    gender_considerations TEXT[],
    diversity_metrics_tracked TEXT[],
    
    -- Team & Operations
    team_size TEXT,
    carried_interest_principals TEXT,
    key_team_capabilities TEXT[],
    advisory_board BOOLEAN,
    investment_committee_structure TEXT,
    
    -- Portfolio & Performance
    number_of_investments TEXT,
    active_portfolio_companies TEXT,
    exits_to_date TEXT,
    exit_strategies TEXT[],
    target_irr TEXT,
    actual_irr TEXT,
    dpi TEXT,
    tvpi TEXT,
    
    -- Fundraising
    currently_fundraising BOOLEAN,
    fundraising_target TEXT,
    fundraising_progress TEXT,
    target_investor_types TEXT[],
    
    -- Challenges & Support Needs
    key_challenges TEXT[],
    support_needs TEXT[],
    technical_assistance_areas TEXT[],
    capacity_building_priorities TEXT[],
    
    -- Network Engagement
    network_value_rating TEXT,
    most_valuable_network_aspects TEXT[],
    willing_to_present BOOLEAN,
    presentation_topics TEXT[],
    mentoring_interest TEXT,
    peer_learning_interest TEXT[],
    working_groups_interest TEXT[],
    
    -- Market Insights
    market_outlook TEXT,
    emerging_trends TEXT[],
    technology_adoption TEXT[],
    regulatory_concerns TEXT[],
    
    -- Innovation & Digital
    digital_tools_used TEXT[],
    ai_ml_adoption TEXT,
    blockchain_interest BOOLEAN,
    
    -- Additional
    success_stories TEXT,
    lessons_learned TEXT,
    additional_comments TEXT,
    
    -- Status & Timestamps
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for 2024
CREATE INDEX idx_survey_2024_user_id ON public.survey_responses_2024(user_id);
CREATE INDEX idx_survey_2024_company_name ON public.survey_responses_2024(company_name);
CREATE INDEX idx_survey_2024_completed_at ON public.survey_responses_2024(completed_at);

-- Enable RLS
ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 2024
CREATE POLICY "Users can view own 2024 surveys"
    ON public.survey_responses_2024 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own 2024 surveys"
    ON public.survey_responses_2024 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own 2024 surveys"
    ON public.survey_responses_2024 FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins and members can view all 2024 surveys"
    ON public.survey_responses_2024 FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role IN ('admin', 'member')
        )
    );

-- =====================================================
-- 6. HELPER FUNCTIONS
-- =====================================================

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
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_2021_updated_at
    BEFORE UPDATE ON public.survey_responses_2021
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_2022_updated_at
    BEFORE UPDATE ON public.survey_responses_2022
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_2023_updated_at
    BEFORE UPDATE ON public.survey_responses_2023
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_survey_2024_updated_at
    BEFORE UPDATE ON public.survey_responses_2024
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Fresh database schema created successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Tables created:';
    RAISE NOTICE '  - user_profiles (company-centric)';
    RAISE NOTICE '  - survey_responses_2021';
    RAISE NOTICE '  - survey_responses_2022';
    RAISE NOTICE '  - survey_responses_2023';
    RAISE NOTICE '  - survey_responses_2024';
    RAISE NOTICE '';
    RAISE NOTICE 'All tables have RLS enabled';
    RAISE NOTICE 'Triggers and functions configured';
    RAISE NOTICE 'Ready for data import!';
    RAISE NOTICE '========================================';
END $$;
