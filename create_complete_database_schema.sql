-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR NETWORK DIRECTORY
-- =====================================================
-- This creates all necessary tables with proper columns for network display
-- =====================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS survey_2021_responses CASCADE;
DROP TABLE IF EXISTS survey_2022_responses CASCADE;
DROP TABLE IF EXISTS survey_2023_responses CASCADE;
DROP TABLE IF EXISTS survey_2024_responses CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- =====================================================
-- USER ROLES TABLE
-- =====================================================
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    organization_name VARCHAR(255),
    role_title VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- =====================================================
-- SURVEY 2021 RESPONSES
-- =====================================================
CREATE TABLE survey_2021_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Basic profile information for network display
    firm_name VARCHAR(255),
    participant_name VARCHAR(255),
    geographic_focus VARCHAR(255),
    investment_vehicle_type VARCHAR(100),
    fund_stage VARCHAR(100),
    current_ftes INTEGER,
    role_title VARCHAR(100),
    
    -- All form data stored as JSONB
    form_data JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- SURVEY 2022 RESPONSES
-- =====================================================
CREATE TABLE survey_2022_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Basic profile information for network display
    firm_name VARCHAR(255),
    participant_name VARCHAR(255),
    geographic_focus VARCHAR(255),
    investment_vehicle_type VARCHAR(100),
    fund_stage VARCHAR(100),
    current_ftes INTEGER,
    role_title VARCHAR(100),
    
    -- All form data stored as JSONB
    form_data JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- SURVEY 2023 RESPONSES
-- =====================================================
CREATE TABLE survey_2023_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Basic profile information for network display
    firm_name VARCHAR(255),
    participant_name VARCHAR(255),
    geographic_focus VARCHAR(255),
    investment_vehicle_type VARCHAR(100),
    fund_stage VARCHAR(100),
    current_ftes INTEGER,
    role_title VARCHAR(100),
    
    -- All form data stored as JSONB
    form_data JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- SURVEY 2024 RESPONSES
-- =====================================================
CREATE TABLE survey_2024_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    submission_status VARCHAR(20) DEFAULT 'draft',
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Basic profile information for network display
    firm_name VARCHAR(255),
    participant_name VARCHAR(255),
    geographic_focus VARCHAR(255),
    investment_vehicle_type VARCHAR(100),
    fund_stage VARCHAR(100),
    current_ftes INTEGER,
    role_title VARCHAR(100),
    
    -- All form data stored as JSONB
    form_data JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2021_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2022_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2023_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_2024_responses ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- User roles policies
CREATE POLICY "Users can view their own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON user_roles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own role" ON user_roles
    FOR UPDATE USING (auth.uid() = user_id);

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Survey policies - users can view all completed surveys
CREATE POLICY "Users can view all completed surveys" ON survey_2021_responses
    FOR SELECT USING (submission_status = 'completed');

CREATE POLICY "Users can view all completed surveys" ON survey_2022_responses
    FOR SELECT USING (submission_status = 'completed');

CREATE POLICY "Users can view all completed surveys" ON survey_2023_responses
    FOR SELECT USING (submission_status = 'completed');

CREATE POLICY "Users can view all completed surveys" ON survey_2024_responses
    FOR SELECT USING (submission_status = 'completed');

-- Users can manage their own surveys
CREATE POLICY "Users can manage their own surveys" ON survey_2021_responses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own surveys" ON survey_2022_responses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own surveys" ON survey_2023_responses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own surveys" ON survey_2024_responses
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- CREATE INDEXES
-- =====================================================
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_survey_2021_responses_user_id ON survey_2021_responses(user_id);
CREATE INDEX idx_survey_2022_responses_user_id ON survey_2022_responses(user_id);
CREATE INDEX idx_survey_2023_responses_user_id ON survey_2023_responses(user_id);
CREATE INDEX idx_survey_2024_responses_user_id ON survey_2024_responses(user_id);

-- =====================================================
-- INSERT SAMPLE DATA FOR TESTING
-- =====================================================

-- Insert sample user roles
INSERT INTO user_roles (user_id, email, role) VALUES
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'abeautifulmind.ke@gmail.com', 'member');

-- Insert sample profiles
INSERT INTO profiles (user_id, first_name, last_name, email, organization_name, role_title) VALUES
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Abraham', 'Beautiful', 'abeautifulmind.ke@gmail.com', 'Beautiful Ventures', 'Managing Partner');

-- Insert sample survey responses
INSERT INTO survey_2021_responses (user_id, firm_name, participant_name, geographic_focus, investment_vehicle_type, fund_stage, current_ftes, role_title, submission_status) VALUES
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Beautiful Ventures', 'Abraham Beautiful', 'East Africa', 'Private Equity', 'Growth Stage', 15, 'Managing Partner', 'completed');

INSERT INTO survey_2023_responses (user_id, firm_name, participant_name, geographic_focus, investment_vehicle_type, fund_stage, current_ftes, role_title, submission_status) VALUES
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Beautiful Ventures', 'Abraham Beautiful', 'East Africa', 'Private Equity', 'Growth Stage', 18, 'Managing Partner', 'completed');

INSERT INTO survey_2024_responses (user_id, firm_name, participant_name, geographic_focus, investment_vehicle_type, fund_stage, current_ftes, role_title, submission_status) VALUES
    ('477a7c9a-5479-4a22-bdc2-c926ba488f6f', 'Beautiful Ventures', 'Abraham Beautiful', 'East Africa', 'Private Equity', 'Growth Stage', 20, 'Managing Partner', 'completed');

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Database schema created successfully!
-- Network directory should now show unique fund managers.
-- =====================================================
