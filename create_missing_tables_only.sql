-- =====================================================
-- CREATE MISSING SURVEY TABLES ONLY
-- =====================================================
-- This script creates only the missing tables for 2022-2024
-- It does NOT touch the existing survey_responses_2021 table
-- =====================================================

-- Create survey_2022_responses table
CREATE TABLE IF NOT EXISTS survey_2022_responses (
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
CREATE INDEX IF NOT EXISTS idx_survey_2022_responses_user_id ON survey_2022_responses (user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2022_responses_submission_status ON survey_2022_responses (submission_status);

-- Create survey_2023_responses table
CREATE TABLE IF NOT EXISTS survey_2023_responses (
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
CREATE INDEX IF NOT EXISTS idx_survey_2023_responses_user_id ON survey_2023_responses (user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2023_responses_submission_status ON survey_2023_responses (submission_status);

-- Create survey_2024_responses table
CREATE TABLE IF NOT EXISTS survey_2024_responses (
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
CREATE INDEX IF NOT EXISTS idx_survey_2024_responses_user_id ON survey_2024_responses (user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2024_responses_submission_status ON survey_2024_responses (submission_status);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%survey%'
ORDER BY table_name;

-- Test if survey_2023_responses table is accessible
SELECT COUNT(*) as record_count FROM survey_2023_responses;
