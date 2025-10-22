-- Create the update trigger function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing tables for fresh start (keeping user_profiles)
DROP TABLE IF EXISTS public.field_visibility CASCADE;
DROP TABLE IF EXISTS public.survey_responses_2024 CASCADE;
DROP TABLE IF EXISTS public.survey_responses_2023 CASCADE;
DROP TABLE IF EXISTS public.survey_responses_2022 CASCADE;
DROP TABLE IF EXISTS public.survey_responses_2021 CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(UUID) CASCADE;

-- =============================================================
-- USER ROLES TABLE
-- =============================================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'member', 'viewer')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- Security definer function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1), 'viewer');
$$;

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================
-- SURVEY RESPONSES TABLES
-- =============================================================

-- 2021 Survey
CREATE TABLE public.survey_responses_2021 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email_address TEXT NOT NULL,
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    form_data JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own 2021" ON public.survey_responses_2021
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Others view completed 2021" ON public.survey_responses_2021
    FOR SELECT USING (public.get_user_role(auth.uid()) IN ('viewer', 'member', 'admin') AND submission_status = 'completed');

CREATE INDEX idx_survey_2021_user ON survey_responses_2021(user_id);
CREATE TRIGGER update_survey_2021_updated_at BEFORE UPDATE ON public.survey_responses_2021
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2022 Survey
CREATE TABLE public.survey_responses_2022 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email_address TEXT NOT NULL,
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    form_data JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own 2022" ON public.survey_responses_2022
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Others view completed 2022" ON public.survey_responses_2022
    FOR SELECT USING (public.get_user_role(auth.uid()) IN ('viewer', 'member', 'admin') AND submission_status = 'completed');

CREATE INDEX idx_survey_2022_user ON survey_responses_2022(user_id);
CREATE TRIGGER update_survey_2022_updated_at BEFORE UPDATE ON public.survey_responses_2022
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2023 Survey
CREATE TABLE public.survey_responses_2023 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email_address TEXT NOT NULL,
    organisation_name TEXT NOT NULL,
    fund_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    form_data JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.survey_responses_2023 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own 2023" ON public.survey_responses_2023
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Others view completed 2023" ON public.survey_responses_2023
    FOR SELECT USING (public.get_user_role(auth.uid()) IN ('viewer', 'member', 'admin') AND submission_status = 'completed');

CREATE INDEX idx_survey_2023_user ON survey_responses_2023(user_id);
CREATE INDEX idx_survey_2023_org ON survey_responses_2023(organisation_name);
CREATE TRIGGER update_survey_2023_updated_at BEFORE UPDATE ON public.survey_responses_2023
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2024 Survey
CREATE TABLE public.survey_responses_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    email_address TEXT NOT NULL,
    organisation_name TEXT NOT NULL,
    fund_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    form_data JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own 2024" ON public.survey_responses_2024
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Others view completed 2024" ON public.survey_responses_2024
    FOR SELECT USING (public.get_user_role(auth.uid()) IN ('viewer', 'member', 'admin') AND submission_status = 'completed');

CREATE INDEX idx_survey_2024_user ON survey_responses_2024(user_id);
CREATE INDEX idx_survey_2024_org ON survey_responses_2024(organisation_name);
CREATE TRIGGER update_survey_2024_updated_at BEFORE UPDATE ON public.survey_responses_2024
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================
-- FIELD VISIBILITY TABLE
-- =============================================================
CREATE TABLE public.field_visibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_year INTEGER NOT NULL,
    field_name TEXT NOT NULL,
    field_category TEXT NOT NULL,
    viewer_visible BOOLEAN DEFAULT false,
    member_visible BOOLEAN DEFAULT false,
    admin_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(survey_year, field_name)
);

ALTER TABLE public.field_visibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone views field visibility"
    ON public.field_visibility FOR SELECT USING (true);

-- Insert visibility rules for 2023
INSERT INTO public.field_visibility (survey_year, field_name, field_category, viewer_visible, member_visible, admin_visible) VALUES
(2023, 'organisation_name', 'Basic Info', true, true, true),
(2023, 'fund_name', 'Basic Info', true, true, true),
(2023, 'geographic_markets', 'Basic Info', true, true, true),
(2023, 'sector_focus', 'Basic Info', true, true, true),
(2023, 'fund_type_status', 'Basic Info', true, true, true),
(2023, 'target_fund_size', 'Basic Info', true, true, true),
(2023, 'email_address', 'Contact', false, true, true),
(2023, 'team_based', 'Team', false, true, true),
(2023, 'fte_staff_current', 'Team', false, true, true);

-- Insert visibility rules for 2024
INSERT INTO public.field_visibility (survey_year, field_name, field_category, viewer_visible, member_visible, admin_visible) VALUES
(2024, 'organisation_name', 'Basic Info', true, true, true),
(2024, 'fund_name', 'Basic Info', true, true, true),
(2024, 'geographic_markets', 'Basic Info', true, true, true),
(2024, 'sector_target_allocation', 'Basic Info', true, true, true),
(2024, 'fund_type_status', 'Basic Info', true, true, true),
(2024, 'target_fund_size_current', 'Basic Info', true, true, true),
(2024, 'email_address', 'Contact', false, true, true),
(2024, 'team_based', 'Team', false, true, true),
(2024, 'fte_staff_current', 'Team', false, true, true);