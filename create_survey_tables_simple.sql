-- =====================================================
-- SIMPLIFIED SURVEY TABLES FOR IMMEDIATE TESTING
-- =====================================================
-- This script creates simplified survey tables with only essential columns
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS survey_2021_responses CASCADE;
DROP TABLE IF EXISTS survey_2022_responses CASCADE;
DROP TABLE IF EXISTS survey_2023_responses CASCADE;
DROP TABLE IF EXISTS survey_2024_responses CASCADE;

-- =====================================================
-- SURVEY 2021 RESPONSES TABLE (SIMPLIFIED)
-- =====================================================
CREATE TABLE survey_2021_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255),
    funds_raising_investing VARCHAR(100),
    fund_name VARCHAR(255),
    form_data JSONB DEFAULT '{}'::jsonb,
    submission_status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS for survey_2021_responses
ALTER TABLE survey_2021_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2021 survey responses."
ON survey_2021_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2021 survey responses."
ON survey_2021_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2021 survey responses."
ON survey_2021_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for survey_2021_responses
CREATE INDEX idx_survey_2021_responses_user_id ON survey_2021_responses (user_id);
CREATE INDEX idx_survey_2021_responses_submission_status ON survey_2021_responses (submission_status);

-- =====================================================
-- SURVEY 2022 RESPONSES TABLE (SIMPLIFIED)
-- =====================================================
CREATE TABLE survey_2022_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255),
    funds_raising_investing VARCHAR(100),
    fund_name VARCHAR(255),
    form_data JSONB DEFAULT '{}'::jsonb,
    submission_status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS for survey_2022_responses
ALTER TABLE survey_2022_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2022 survey responses."
ON survey_2022_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2022 survey responses."
ON survey_2022_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2022 survey responses."
ON survey_2022_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for survey_2022_responses
CREATE INDEX idx_survey_2022_responses_user_id ON survey_2022_responses (user_id);
CREATE INDEX idx_survey_2022_responses_submission_status ON survey_2022_responses (submission_status);

-- =====================================================
-- SURVEY 2023 RESPONSES TABLE (SIMPLIFIED)
-- =====================================================
CREATE TABLE survey_2023_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255),
    funds_raising_investing VARCHAR(100),
    fund_name VARCHAR(255),
    form_data JSONB DEFAULT '{}'::jsonb,
    submission_status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS for survey_2023_responses
ALTER TABLE survey_2023_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2023 survey responses."
ON survey_2023_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2023 survey responses."
ON survey_2023_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2023 survey responses."
ON survey_2023_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for survey_2023_responses
CREATE INDEX idx_survey_2023_responses_user_id ON survey_2023_responses (user_id);
CREATE INDEX idx_survey_2023_responses_submission_status ON survey_2023_responses (submission_status);

-- =====================================================
-- SURVEY 2024 RESPONSES TABLE (SIMPLIFIED)
-- =====================================================
CREATE TABLE survey_2024_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255),
    funds_raising_investing VARCHAR(100),
    fund_name VARCHAR(255),
    form_data JSONB DEFAULT '{}'::jsonb,
    submission_status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS for survey_2024_responses
ALTER TABLE survey_2024_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own 2024 survey responses."
ON survey_2024_responses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2024 survey responses."
ON survey_2024_responses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2024 survey responses."
ON survey_2024_responses FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for survey_2024_responses
CREATE INDEX idx_survey_2024_responses_user_id ON survey_2024_responses (user_id);
CREATE INDEX idx_survey_2024_responses_submission_status ON survey_2024_responses (submission_status);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if all tables were created successfully
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%survey%'
ORDER BY table_name;

-- Test a simple query on each table
SELECT 'survey_2021_responses' as table_name, COUNT(*) as record_count FROM survey_2021_responses
UNION ALL
SELECT 'survey_2022_responses' as table_name, COUNT(*) as record_count FROM survey_2022_responses
UNION ALL
SELECT 'survey_2023_responses' as table_name, COUNT(*) as record_count FROM survey_2023_responses
UNION ALL
SELECT 'survey_2024_responses' as table_name, COUNT(*) as record_count FROM survey_2024_responses;
