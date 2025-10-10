-- =====================================================
-- PRESERVE EXISTING SURVEY DATA AND CREATE NEW TABLES
-- =====================================================
-- This script preserves existing survey_responses_2021 data
-- and creates new tables for 2022-2024 surveys
-- =====================================================

-- =====================================================
-- STEP 1: CHECK EXISTING DATA
-- =====================================================

-- Check what tables currently exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%survey%'
ORDER BY table_name;

-- Check existing data in survey_responses_2021
SELECT 
    COUNT(*) as total_records,
    COUNT(DISTINCT email_address) as unique_emails
FROM survey_responses_2021;

-- =====================================================
-- STEP 2: CREATE NEW TABLES FOR 2022-2024 (DON'T TOUCH 2021)
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
-- STEP 3: CREATE UNIFIED VIEW FOR NETWORK DIRECTORY
-- =====================================================

-- Create a view that combines all survey data for the network directory
CREATE OR REPLACE VIEW all_survey_responses AS
SELECT 
    '2021' as survey_year,
    id,
    user_id,
    email_address,
    organisation_name,
    funds_raising_investing,
    fund_name,
    submission_status,
    created_at,
    updated_at,
    completed_at
FROM survey_responses_2021
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2022' as survey_year,
    id,
    user_id,
    email_address,
    organisation_name,
    funds_raising_investing,
    fund_name,
    submission_status,
    created_at,
    updated_at,
    completed_at
FROM survey_2022_responses
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2023' as survey_year,
    id,
    user_id,
    email_address,
    organisation_name,
    funds_raising_investing,
    fund_name,
    submission_status,
    created_at,
    updated_at,
    completed_at
FROM survey_2023_responses
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    '2024' as survey_year,
    id,
    user_id,
    email_address,
    organisation_name,
    funds_raising_investing,
    fund_name,
    submission_status,
    created_at,
    updated_at,
    completed_at
FROM survey_2024_responses
WHERE submission_status = 'completed';

-- =====================================================
-- STEP 4: VERIFICATION QUERIES
-- =====================================================

-- Check all survey tables and their record counts
SELECT 
    'survey_responses_2021' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT email_address) as unique_emails
FROM survey_responses_2021
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    'survey_2022_responses' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT email_address) as unique_emails
FROM survey_2022_responses
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    'survey_2023_responses' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT email_address) as unique_emails
FROM survey_2023_responses
WHERE submission_status = 'completed'

UNION ALL

SELECT 
    'survey_2024_responses' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT email_address) as unique_emails
FROM survey_2024_responses
WHERE submission_status = 'completed';

-- Check the unified view
SELECT 
    COUNT(*) as total_responses,
    COUNT(DISTINCT email_address) as unique_fund_managers,
    COUNT(DISTINCT survey_year) as survey_years_covered
FROM all_survey_responses;

-- Show unique fund managers across all surveys
SELECT 
    email_address,
    organisation_name,
    COUNT(DISTINCT survey_year) as survey_years_participated,
    STRING_AGG(DISTINCT survey_year, ', ' ORDER BY survey_year) as years
FROM all_survey_responses
GROUP BY email_address, organisation_name
ORDER BY survey_years_participated DESC, organisation_name;
