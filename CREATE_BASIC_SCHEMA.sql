-- =====================================================
-- CREATE BASIC DATABASE SCHEMA
-- This creates the essential tables needed for the app
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CREATE USER PROFILES TABLE
-- =====================================================
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Company Information
    company_name TEXT NOT NULL,
    company_id UUID DEFAULT gen_random_uuid(),
    
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

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- CREATE USER ROLES TABLE
-- =====================================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- CREATE BASIC SURVEY TABLES
-- =====================================================

-- 2021 Survey Table
CREATE TABLE public.survey_responses_2021 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    
    -- Store all form data as JSONB for flexibility
    form_data JSONB DEFAULT '{}'::jsonb,
    
    -- Key searchable fields
    email_address TEXT NOT NULL,
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    
    UNIQUE(user_id)
);

-- 2022 Survey Table
CREATE TABLE public.survey_responses_2022 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    
    form_data JSONB DEFAULT '{}'::jsonb,
    
    email_address TEXT NOT NULL,
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    
    UNIQUE(user_id)
);

-- 2023 Survey Table
CREATE TABLE public.survey_responses_2023 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    
    form_data JSONB DEFAULT '{}'::jsonb,
    
    email_address TEXT NOT NULL,
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    
    UNIQUE(user_id)
);

-- 2024 Survey Table
CREATE TABLE public.survey_responses_2024 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    submission_status TEXT DEFAULT 'draft',
    
    form_data JSONB DEFAULT '{}'::jsonb,
    
    email_address TEXT NOT NULL,
    firm_name TEXT,
    participant_name TEXT,
    role_title TEXT,
    fund_stage TEXT,
    
    UNIQUE(user_id)
);

-- Enable RLS on survey tables
ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses_2023 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses_2024 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for surveys
CREATE POLICY "Users can view their own 2021 surveys"
    ON public.survey_responses_2021 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2021 surveys"
    ON public.survey_responses_2021 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2021 surveys"
    ON public.survey_responses_2021 FOR UPDATE
    USING (auth.uid() = user_id);

-- Similar policies for other survey years
CREATE POLICY "Users can view their own 2022 surveys"
    ON public.survey_responses_2022 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2022 surveys"
    ON public.survey_responses_2022 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2022 surveys"
    ON public.survey_responses_2022 FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own 2023 surveys"
    ON public.survey_responses_2023 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2023 surveys"
    ON public.survey_responses_2023 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2023 surveys"
    ON public.survey_responses_2023 FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own 2024 surveys"
    ON public.survey_responses_2024 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own 2024 surveys"
    ON public.survey_responses_2024 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2024 surveys"
    ON public.survey_responses_2024 FOR UPDATE
    USING (auth.uid() = user_id);

-- Success message
SELECT 'Basic database schema created successfully!' as result;
