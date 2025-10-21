-- =====================================================
-- 2022 SURVEY TABLE SCHEMA
-- Matches Survey2022.tsx form fields exactly
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2022 (
    -- Primary Key & Metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    name TEXT,
    role_title TEXT,
    email TEXT,
    organisation TEXT,
    
    -- Timeline
    legal_entity_date TEXT,
    first_close_date TEXT,
    first_investment_date TEXT,
    
    -- Geographic & Team
    geographic_markets TEXT[],
    team_based TEXT[],
    current_ftes TEXT,
    ye2023_ftes TEXT,
    principals_count TEXT,
    
    -- Team Experience
    new_to_investment TEXT,
    adjacent_finance_experience TEXT,
    business_management_experience TEXT,
    fund_investment_experience TEXT,
    senior_fund_experience TEXT,
    investments_experience TEXT,
    exits_experience TEXT,
    
    -- Fund Structure
    legal_domicile TEXT,
    currency_investments TEXT,
    currency_lp_commitments TEXT,
    fund_operations TEXT,
    current_funds_raised TEXT,
    current_amount_invested TEXT,
    target_fund_size TEXT,
    target_investments TEXT,
    follow_on_permitted TEXT,
    target_irr TEXT,
    gp_commitment TEXT,
    management_fee TEXT,
    carried_interest_hurdle TEXT,
    
    -- Investment Details
    average_investment_size TEXT,
    investment_timeframe TEXT,
    investments_made TEXT,
    anticipated_exits TEXT,
    investment_stage TEXT,
    investment_size TEXT,
    investment_type TEXT,
    sector_focus TEXT,
    geographic_focus TEXT,
    value_add_services TEXT,
    
    -- Preferences
    receive_results BOOLEAN,
    
    -- System Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for 2022
CREATE INDEX IF NOT EXISTS idx_survey_2022_user_id ON public.survey_responses_2022(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2022_organisation ON public.survey_responses_2022(organisation);
CREATE INDEX IF NOT EXISTS idx_survey_2022_email ON public.survey_responses_2022(email);
CREATE INDEX IF NOT EXISTS idx_survey_2022_completed_at ON public.survey_responses_2022(completed_at);
CREATE INDEX IF NOT EXISTS idx_survey_2022_created_at ON public.survey_responses_2022(created_at);

-- Enable RLS
ALTER TABLE public.survey_responses_2022 ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_survey_2022_updated_at ON public.survey_responses_2022;
CREATE TRIGGER update_survey_2022_updated_at
    BEFORE UPDATE ON public.survey_responses_2022
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '2022 Survey Table Created Successfully!';
    RAISE NOTICE '========================================';
END $$;
