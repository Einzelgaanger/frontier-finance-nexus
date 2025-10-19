-- =====================================================
-- SIMPLE SURVEY 2024 TABLE CREATION
-- =====================================================
-- This creates just the essential table to get draft saving working
-- =====================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS survey_2024_responses CASCADE;

-- Create the main survey responses table
CREATE TABLE survey_2024_responses (
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

-- Enable Row Level Security (RLS)
ALTER TABLE survey_2024_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own survey responses" ON survey_2024_responses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own survey responses" ON survey_2024_responses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own survey responses" ON survey_2024_responses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own survey responses" ON survey_2024_responses
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_survey_2024_responses_user_id ON survey_2024_responses(user_id);
CREATE INDEX idx_survey_2024_responses_created_at ON survey_2024_responses(created_at);
CREATE INDEX idx_survey_2024_responses_submission_status ON survey_2024_responses(submission_status);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Table created successfully! You can now save drafts.
-- =====================================================
