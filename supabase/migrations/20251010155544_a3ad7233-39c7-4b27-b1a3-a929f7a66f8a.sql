-- =====================================================
-- COMPREHENSIVE SURVEY DATABASE SETUP
-- Clean structure for surveys 2021-2024 with proper RLS
-- =====================================================

-- Drop existing confusing tables
DROP TABLE IF EXISTS survey_2021_responses CASCADE;
DROP TABLE IF EXISTS survey_2022_responses CASCADE;
DROP TABLE IF EXISTS survey_2023_responses CASCADE;
DROP TABLE IF EXISTS survey_2024_responses CASCADE;
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS survey_responses_2021 CASCADE;
DROP TABLE IF EXISTS survey_responses_2022 CASCADE;
DROP TABLE IF EXISTS survey_responses_2023 CASCADE;
DROP TABLE IF EXISTS survey_responses_2024 CASCADE;

-- =====================================================
-- CREATE SURVEY RESPONSES TABLE FOR 2021
-- =====================================================
CREATE TABLE survey_2021_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    
    -- Store all form data as JSONB for flexibility
    form_data JSONB DEFAULT '{}'::jsonb,
    
    -- Key searchable fields (for admin filtering)
    email_address TEXT NOT NULL,
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    
    UNIQUE(user_id)
);

-- =====================================================
-- CREATE SURVEY RESPONSES TABLE FOR 2022
-- =====================================================
CREATE TABLE survey_2022_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    
    -- Store all form data as JSONB for flexibility
    form_data JSONB DEFAULT '{}'::jsonb,
    
    -- Key searchable fields (for admin filtering)
    email TEXT NOT NULL,
    name TEXT,
    role_title TEXT,
    organisation TEXT,
    legal_entity_date TEXT,
    
    UNIQUE(user_id)
);

-- =====================================================
-- CREATE SURVEY RESPONSES TABLE FOR 2023
-- =====================================================
CREATE TABLE survey_2023_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    
    -- Store all form data as JSONB for flexibility
    form_data JSONB DEFAULT '{}'::jsonb,
    
    -- Key searchable fields (for admin filtering)
    email_address TEXT NOT NULL,
    organisation_name TEXT,
    fund_name TEXT,
    funds_raising_investing TEXT,
    
    UNIQUE(user_id)
);

-- =====================================================
-- CREATE SURVEY RESPONSES TABLE FOR 2024
-- =====================================================
CREATE TABLE survey_2024_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    
    -- Store all form data as JSONB for flexibility
    form_data JSONB DEFAULT '{}'::jsonb,
    
    -- Key searchable fields (for admin filtering)
    email_address TEXT NOT NULL,
    organisation_name TEXT,
    fund_name TEXT,
    funds_raising_investing TEXT,
    
    UNIQUE(user_id)
);

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================
ALTER TABLE survey_2021_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2022_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_responses ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTION TO GET USER ROLE
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_role_safe(user_uuid UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role::TEXT FROM public.user_roles WHERE user_id = user_uuid LIMIT 1),
    'viewer'
  );
$$;

-- =====================================================
-- HELPER FUNCTION TO CHECK IF USER IS APPROVED MEMBER
-- =====================================================
CREATE OR REPLACE FUNCTION is_approved_member(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND role IN ('member', 'admin')
  );
$$;

-- =====================================================
-- RLS POLICIES FOR SURVEY 2021
-- =====================================================

-- Users can view their own responses
CREATE POLICY "Users can view own 2021 responses"
ON survey_2021_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert own 2021 responses"
ON survey_2021_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own 2021 responses"
ON survey_2021_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own 2021 responses"
ON survey_2021_responses
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all responses
CREATE POLICY "Admins can view all 2021 responses"
ON survey_2021_responses
FOR SELECT
USING (get_user_role_safe(auth.uid()) = 'admin');

-- Members can view first 4 sections of other approved members
CREATE POLICY "Members can view approved members 2021"
ON survey_2021_responses
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'member'
  AND is_approved_member(user_id)
  AND submission_status = 'completed'
  AND completed_at IS NOT NULL
);

-- Viewers can only see approved members' data
CREATE POLICY "Viewers can view approved members 2021"
ON survey_2021_responses
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'viewer'
  AND is_approved_member(user_id)
  AND submission_status = 'completed'
  AND completed_at IS NOT NULL
);

-- =====================================================
-- RLS POLICIES FOR SURVEY 2022
-- =====================================================

-- Users can view their own responses
CREATE POLICY "Users can view own 2022 responses"
ON survey_2022_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert own 2022 responses"
ON survey_2022_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own 2022 responses"
ON survey_2022_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own 2022 responses"
ON survey_2022_responses
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all responses
CREATE POLICY "Admins can view all 2022 responses"
ON survey_2022_responses
FOR SELECT
USING (get_user_role_safe(auth.uid()) = 'admin');

-- Members can view first 4 sections of other approved members
CREATE POLICY "Members can view approved members 2022"
ON survey_2022_responses
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'member'
  AND is_approved_member(user_id)
  AND submission_status = 'completed'
  AND completed_at IS NOT NULL
);

-- Viewers can only see approved members' data
CREATE POLICY "Viewers can view approved members 2022"
ON survey_2022_responses
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'viewer'
  AND is_approved_member(user_id)
  AND submission_status = 'completed'
  AND completed_at IS NOT NULL
);

-- =====================================================
-- RLS POLICIES FOR SURVEY 2023
-- =====================================================

-- Users can view their own responses
CREATE POLICY "Users can view own 2023 responses"
ON survey_2023_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert own 2023 responses"
ON survey_2023_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own 2023 responses"
ON survey_2023_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own 2023 responses"
ON survey_2023_responses
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all responses
CREATE POLICY "Admins can view all 2023 responses"
ON survey_2023_responses
FOR SELECT
USING (get_user_role_safe(auth.uid()) = 'admin');

-- Members can view first 4 sections of other approved members
CREATE POLICY "Members can view approved members 2023"
ON survey_2023_responses
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'member'
  AND is_approved_member(user_id)
  AND submission_status = 'completed'
  AND completed_at IS NOT NULL
);

-- Viewers can only see approved members' data
CREATE POLICY "Viewers can view approved members 2023"
ON survey_2023_responses
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'viewer'
  AND is_approved_member(user_id)
  AND submission_status = 'completed'
  AND completed_at IS NOT NULL
);

-- =====================================================
-- RLS POLICIES FOR SURVEY 2024
-- =====================================================

-- Users can view their own responses
CREATE POLICY "Users can view own 2024 responses"
ON survey_2024_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own responses
CREATE POLICY "Users can insert own 2024 responses"
ON survey_2024_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own responses
CREATE POLICY "Users can update own 2024 responses"
ON survey_2024_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own responses
CREATE POLICY "Users can delete own 2024 responses"
ON survey_2024_responses
FOR DELETE
USING (auth.uid() = user_id);

-- Admins can view all responses
CREATE POLICY "Admins can view all 2024 responses"
ON survey_2024_responses
FOR SELECT
USING (get_user_role_safe(auth.uid()) = 'admin');

-- Members can view first 4 sections of other approved members
CREATE POLICY "Members can view approved members 2024"
ON survey_2024_responses
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'member'
  AND is_approved_member(user_id)
  AND submission_status = 'completed'
  AND completed_at IS NOT NULL
);

-- Viewers can only see approved members' data
CREATE POLICY "Viewers can view approved members 2024"
ON survey_2024_responses
FOR SELECT
USING (
  get_user_role_safe(auth.uid()) = 'viewer'
  AND is_approved_member(user_id)
  AND submission_status = 'completed'
  AND completed_at IS NOT NULL
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_2021_user_id ON survey_2021_responses(user_id);
CREATE INDEX idx_2021_status ON survey_2021_responses(submission_status);
CREATE INDEX idx_2021_completed ON survey_2021_responses(completed_at);

CREATE INDEX idx_2022_user_id ON survey_2022_responses(user_id);
CREATE INDEX idx_2022_status ON survey_2022_responses(submission_status);
CREATE INDEX idx_2022_completed ON survey_2022_responses(completed_at);

CREATE INDEX idx_2023_user_id ON survey_2023_responses(user_id);
CREATE INDEX idx_2023_status ON survey_2023_responses(submission_status);
CREATE INDEX idx_2023_completed ON survey_2023_responses(completed_at);

CREATE INDEX idx_2024_user_id ON survey_2024_responses(user_id);
CREATE INDEX idx_2024_status ON survey_2024_responses(submission_status);
CREATE INDEX idx_2024_completed ON survey_2024_responses(completed_at);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_survey_2021_updated_at
    BEFORE UPDATE ON survey_2021_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_2022_updated_at
    BEFORE UPDATE ON survey_2022_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_2023_updated_at
    BEFORE UPDATE ON survey_2023_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_2024_updated_at
    BEFORE UPDATE ON survey_2024_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();