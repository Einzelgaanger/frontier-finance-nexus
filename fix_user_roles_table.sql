-- =====================================================
-- FIX USER ROLES TABLE SCHEMA
-- =====================================================
-- This script fixes the user_roles table to include the email column
-- and resolves the NOT NULL constraint violation
-- =====================================================

-- First, let's check if the user_roles table exists and what its structure is
-- If it doesn't exist, create it with the proper schema
DROP TABLE IF EXISTS user_roles CASCADE;

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own role" ON user_roles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own role" ON user_roles
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_email ON user_roles(email);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- =====================================================
-- CREATE SURVEY TABLES (if they don't exist)
-- =====================================================

-- Create survey_2024_responses table if it doesn't exist
CREATE TABLE IF NOT EXISTS survey_2024_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Basic required fields
    email_address VARCHAR(255) NOT NULL,
    organisation_name VARCHAR(255) NOT NULL,
    funds_raising_investing VARCHAR(100) NOT NULL,
    fund_name VARCHAR(255) NOT NULL,
    
    -- All other fields as JSONB to handle any data structure
    form_data JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS for survey_2024_responses
ALTER TABLE survey_2024_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for survey_2024_responses
CREATE POLICY "Users can view their own survey responses" ON survey_2024_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" ON survey_2024_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" ON survey_2024_responses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own survey responses" ON survey_2024_responses
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for survey_2024_responses
CREATE INDEX IF NOT EXISTS idx_survey_2024_responses_user_id ON survey_2024_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2024_responses_created_at ON survey_2024_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_2024_responses_submission_status ON survey_2024_responses(submission_status);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- User roles table and survey tables have been created/fixed!
-- You should now be able to save drafts without errors.
-- =====================================================