-- Drop existing field_visibility table and recreate with comprehensive coverage
DROP TABLE IF EXISTS public.field_visibility CASCADE;

-- Create comprehensive field_visibility table
CREATE TABLE public.field_visibility (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  field_name text NOT NULL,
  field_category text NOT NULL,
  survey_year integer,
  admin_visible boolean DEFAULT true,
  member_visible boolean DEFAULT false,
  viewer_visible boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(table_name, field_name)
);

-- Enable RLS
ALTER TABLE public.field_visibility ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view field visibility
CREATE POLICY "Everyone views field visibility"
  ON public.field_visibility
  FOR SELECT
  USING (true);

-- ============================================================================
-- SURVEY 2021 FIELD VISIBILITY
-- ============================================================================

-- Public fields (viewer, member, admin can see)
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2021', 'firm_name', 'Basic Information', 2021, true, true, true),
('survey_responses_2021', 'fund_stage', 'Fund Status', 2021, true, true, true),
('survey_responses_2021', 'geographic_focus', 'Geographic Information', 2021, true, true, true),
('survey_responses_2021', 'target_sectors', 'Investment Strategy', 2021, true, true, true),
('survey_responses_2021', 'investment_forms', 'Investment Strategy', 2021, true, true, true),
('survey_responses_2021', 'business_model_targeted', 'Investment Strategy', 2021, true, true, true);

-- Member-visible fields (member, admin can see)
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2021', 'team_based', 'Team Information', 2021, false, true, true),
('survey_responses_2021', 'current_ftes', 'Team Information', 2021, false, true, true),
('survey_responses_2021', 'investment_vehicle_type', 'Fund Structure', 2021, false, true, true),
('survey_responses_2021', 'legal_entity_date', 'Fund Timeline', 2021, false, true, true),
('survey_responses_2021', 'first_close_date', 'Fund Timeline', 2021, false, true, true),
('survey_responses_2021', 'first_investment_date', 'Fund Timeline', 2021, false, true, true),
('survey_responses_2021', 'business_stage_targeted', 'Investment Strategy', 2021, false, true, true),
('survey_responses_2021', 'financing_needs', 'Investment Strategy', 2021, false, true, true),
('survey_responses_2021', 'explicit_lens_focus', 'Impact Focus', 2021, false, true, true),
('survey_responses_2021', 'top_sdgs', 'Impact Focus', 2021, false, true, true),
('survey_responses_2021', 'gender_considerations_investment', 'Gender Lens', 2021, false, true, true);

-- Admin-only fields (admin can see)
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2021', 'email_address', 'Contact Information', 2021, false, false, true),
('survey_responses_2021', 'participant_name', 'Contact Information', 2021, false, false, true),
('survey_responses_2021', 'role_title', 'Contact Information', 2021, false, false, true),
('survey_responses_2021', 'current_fund_size', 'Financial Information', 2021, false, false, true),
('survey_responses_2021', 'target_fund_size', 'Financial Information', 2021, false, false, true),
('survey_responses_2021', 'investment_size_your_amount', 'Financial Information', 2021, false, false, true),
('survey_responses_2021', 'target_irr_targeted', 'Financial Performance', 2021, false, false, true),
('survey_responses_2021', 'target_irr_achieved', 'Financial Performance', 2021, false, false, true),
('survey_responses_2021', 'carried_interest_principals', 'Financial Terms', 2021, false, false, true),
('survey_responses_2021', 'exits_achieved', 'Portfolio Performance', 2021, false, false, true),
('survey_responses_2021', 'investments_december_2020', 'Portfolio Performance', 2021, false, false, true);

-- ============================================================================
-- SURVEY 2022 FIELD VISIBILITY
-- ============================================================================

-- Public fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2022', 'organisation', 'Basic Information', 2022, true, true, true),
('survey_responses_2022', 'geographic_markets', 'Geographic Information', 2022, true, true, true),
('survey_responses_2022', 'sector_activities', 'Investment Strategy', 2022, true, true, true),
('survey_responses_2022', 'financial_instruments', 'Investment Strategy', 2022, true, true, true),
('survey_responses_2022', 'business_stages', 'Investment Strategy', 2022, true, true, true);

-- Member-visible fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2022', 'team_based', 'Team Information', 2022, false, true, true),
('survey_responses_2022', 'current_ftes', 'Team Information', 2022, false, true, true),
('survey_responses_2022', 'principals_count', 'Team Information', 2022, false, true, true),
('survey_responses_2022', 'gp_experience', 'Team Experience', 2022, false, true, true),
('survey_responses_2022', 'legal_entity_date', 'Fund Timeline', 2022, false, true, true),
('survey_responses_2022', 'first_close_date', 'Fund Timeline', 2022, false, true, true),
('survey_responses_2022', 'first_investment_date', 'Fund Timeline', 2022, false, true, true),
('survey_responses_2022', 'legal_domicile', 'Fund Structure', 2022, false, true, true),
('survey_responses_2022', 'sdg_targets', 'Impact Focus', 2022, false, true, true),
('survey_responses_2022', 'gender_lens_investing', 'Gender Lens', 2022, false, true, true),
('survey_responses_2022', 'pipeline_sourcing', 'Investment Process', 2022, false, true, true);

-- Admin-only fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2022', 'email', 'Contact Information', 2022, false, false, true),
('survey_responses_2022', 'name', 'Contact Information', 2022, false, false, true),
('survey_responses_2022', 'role_title', 'Contact Information', 2022, false, false, true),
('survey_responses_2022', 'current_funds_raised', 'Financial Information', 2022, false, false, true),
('survey_responses_2022', 'target_fund_size', 'Financial Information', 2022, false, false, true),
('survey_responses_2022', 'current_amount_invested', 'Financial Information', 2022, false, false, true),
('survey_responses_2022', 'average_investment_size_per_company', 'Financial Information', 2022, false, false, true),
('survey_responses_2022', 'target_irr', 'Financial Performance', 2022, false, false, true),
('survey_responses_2022', 'carried_interest_hurdle', 'Financial Terms', 2022, false, false, true),
('survey_responses_2022', 'management_fee', 'Financial Terms', 2022, false, false, true),
('survey_responses_2022', 'gp_commitment', 'Financial Terms', 2022, false, false, true),
('survey_responses_2022', 'investments_made_to_date', 'Portfolio Performance', 2022, false, false, true),
('survey_responses_2022', 'equity_exits_achieved', 'Portfolio Performance', 2022, false, false, true),
('survey_responses_2022', 'revenue_growth_recent_12_months', 'Portfolio Performance', 2022, false, false, true);

-- ============================================================================
-- SURVEY 2023 FIELD VISIBILITY
-- ============================================================================

-- Public fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2023', 'organisation_name', 'Basic Information', 2023, true, true, true),
('survey_responses_2023', 'fund_name', 'Basic Information', 2023, true, true, true),
('survey_responses_2023', 'geographic_markets', 'Geographic Information', 2023, true, true, true),
('survey_responses_2023', 'sector_focus', 'Investment Strategy', 2023, true, true, true),
('survey_responses_2023', 'business_stages', 'Investment Strategy', 2023, true, true, true),
('survey_responses_2023', 'financial_instruments', 'Investment Strategy', 2023, true, true, true);

-- Member-visible fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2023', 'team_based', 'Team Information', 2023, false, true, true),
('survey_responses_2023', 'fte_staff_current', 'Team Information', 2023, false, true, true),
('survey_responses_2023', 'principals_count', 'Team Information', 2023, false, true, true),
('survey_responses_2023', 'team_experience_investments', 'Team Experience', 2023, false, true, true),
('survey_responses_2023', 'team_experience_exits', 'Team Experience', 2023, false, true, true),
('survey_responses_2023', 'legal_entity_achieved', 'Fund Timeline', 2023, false, true, true),
('survey_responses_2023', 'first_close_achieved', 'Fund Timeline', 2023, false, true, true),
('survey_responses_2023', 'first_investment_achieved', 'Fund Timeline', 2023, false, true, true),
('survey_responses_2023', 'legal_domicile', 'Fund Structure', 2023, false, true, true),
('survey_responses_2023', 'sdg_ranking', 'Impact Focus', 2023, false, true, true),
('survey_responses_2023', 'gender_lens_investing', 'Gender Lens', 2023, false, true, true),
('survey_responses_2023', 'pipeline_sourcing', 'Investment Process', 2023, false, true, true),
('survey_responses_2023', 'portfolio_value_creation_priorities', 'Value Creation', 2023, false, true, true);

-- Admin-only fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2023', 'email_address', 'Contact Information', 2023, false, false, true),
('survey_responses_2023', 'current_funds_raised', 'Financial Information', 2023, false, false, true),
('survey_responses_2023', 'target_fund_size', 'Financial Information', 2023, false, false, true),
('survey_responses_2023', 'current_amount_invested', 'Financial Information', 2023, false, false, true),
('survey_responses_2023', 'average_investment_size', 'Financial Information', 2023, false, false, true),
('survey_responses_2023', 'target_local_currency_return', 'Financial Performance', 2023, false, false, true),
('survey_responses_2023', 'hurdle_rate_percentage', 'Financial Terms', 2023, false, false, true),
('survey_responses_2023', 'gp_management_fee', 'Financial Terms', 2023, false, false, true),
('survey_responses_2023', 'gp_financial_commitment', 'Financial Terms', 2023, false, false, true),
('survey_responses_2023', 'revenue_growth_historical', 'Portfolio Performance', 2023, false, false, true),
('survey_responses_2023', 'revenue_growth_expected', 'Portfolio Performance', 2023, false, false, true),
('survey_responses_2023', 'jobs_impact_historical_direct', 'Portfolio Performance', 2023, false, false, true),
('survey_responses_2023', 'equity_exits_anticipated', 'Portfolio Performance', 2023, false, false, true);

-- ============================================================================
-- SURVEY 2024 FIELD VISIBILITY
-- ============================================================================

-- Public fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2024', 'organisation_name', 'Basic Information', 2024, true, true, true),
('survey_responses_2024', 'fund_name', 'Basic Information', 2024, true, true, true),
('survey_responses_2024', 'geographic_markets', 'Geographic Information', 2024, true, true, true),
('survey_responses_2024', 'sector_target_allocation', 'Investment Strategy', 2024, true, true, true),
('survey_responses_2024', 'business_stages', 'Investment Strategy', 2024, true, true, true),
('survey_responses_2024', 'financial_instruments_ranking', 'Investment Strategy', 2024, true, true, true);

-- Member-visible fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2024', 'team_based', 'Team Information', 2024, false, true, true),
('survey_responses_2024', 'fte_staff_current', 'Team Information', 2024, false, true, true),
('survey_responses_2024', 'principals_total', 'Team Information', 2024, false, true, true),
('survey_responses_2024', 'principals_women', 'Team Information', 2024, false, true, true),
('survey_responses_2024', 'team_experience_investments', 'Team Experience', 2024, false, true, true),
('survey_responses_2024', 'team_experience_exits', 'Team Experience', 2024, false, true, true),
('survey_responses_2024', 'legal_entity_achieved', 'Fund Timeline', 2024, false, true, true),
('survey_responses_2024', 'first_close_achieved', 'Fund Timeline', 2024, false, true, true),
('survey_responses_2024', 'first_investment_achieved', 'Fund Timeline', 2024, false, true, true),
('survey_responses_2024', 'legal_domicile', 'Fund Structure', 2024, false, true, true),
('survey_responses_2024', 'top_sdgs', 'Impact Focus', 2024, false, true, true),
('survey_responses_2024', 'gender_lens_investing', 'Gender Lens', 2024, false, true, true),
('survey_responses_2024', 'pipeline_sources_quality', 'Investment Process', 2024, false, true, true),
('survey_responses_2024', 'post_investment_priorities', 'Value Creation', 2024, false, true, true),
('survey_responses_2024', 'unique_offerings', 'Value Creation', 2024, false, true, true);

-- Admin-only fields
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('survey_responses_2024', 'email_address', 'Contact Information', 2024, false, false, true),
('survey_responses_2024', 'hard_commitments_current', 'Financial Information', 2024, false, false, true),
('survey_responses_2024', 'target_fund_size_current', 'Financial Information', 2024, false, false, true),
('survey_responses_2024', 'amount_invested_current', 'Financial Information', 2024, false, false, true),
('survey_responses_2024', 'typical_investment_size', 'Financial Information', 2024, false, false, true),
('survey_responses_2024', 'target_return_above_govt_debt', 'Financial Performance', 2024, false, false, true),
('survey_responses_2024', 'hurdle_rate_percentage', 'Financial Terms', 2024, false, false, true),
('survey_responses_2024', 'gp_management_fee', 'Financial Terms', 2024, false, false, true),
('survey_responses_2024', 'gp_financial_commitment', 'Financial Terms', 2024, false, false, true),
('survey_responses_2024', 'portfolio_revenue_growth_12m', 'Portfolio Performance', 2024, false, false, true),
('survey_responses_2024', 'portfolio_revenue_growth_next_12m', 'Portfolio Performance', 2024, false, false, true),
('survey_responses_2024', 'equity_investments_made', 'Portfolio Performance', 2024, false, false, true),
('survey_responses_2024', 'equity_exits_achieved', 'Portfolio Performance', 2024, false, false, true),
('survey_responses_2024', 'direct_jobs_current', 'Portfolio Performance', 2024, false, false, true);

-- ============================================================================
-- OTHER TABLES FIELD VISIBILITY
-- ============================================================================

-- User Credits (for gamification queries)
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('user_credits', 'total_points', 'Gamification', NULL, true, true, true),
('user_credits', 'ai_usage_count', 'Gamification', NULL, true, true, true),
('user_credits', 'blog_posts_count', 'Gamification', NULL, true, true, true),
('user_credits', 'login_streak', 'Gamification', NULL, true, true, true);

-- Activity Log
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('activity_log', 'activity_type', 'Activity', NULL, true, true, true),
('activity_log', 'points_earned', 'Activity', NULL, true, true, true),
('activity_log', 'created_at', 'Activity', NULL, true, true, true),
('activity_log', 'description', 'Activity', NULL, true, true, true);

-- Applications
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('applications', 'company_name', 'Application', NULL, false, false, true),
('applications', 'applicant_name', 'Application', NULL, false, false, true),
('applications', 'email', 'Application', NULL, false, false, true),
('applications', 'status', 'Application', NULL, false, false, true),
('applications', 'created_at', 'Application', NULL, false, false, true),
('applications', 'vehicle_name', 'Application', NULL, false, false, true),
('applications', 'investment_thesis', 'Application', NULL, false, false, true);

-- Blogs
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('blogs', 'title', 'Blog', NULL, true, true, true),
('blogs', 'content', 'Blog', NULL, true, true, true),
('blogs', 'created_at', 'Blog', NULL, true, true, true),
('blogs', 'is_published', 'Blog', NULL, true, true, true);

-- User Profiles (limited access)
INSERT INTO public.field_visibility (table_name, field_name, field_category, survey_year, viewer_visible, member_visible, admin_visible) VALUES
('user_profiles', 'full_name', 'Profile', NULL, false, true, true),
('user_profiles', 'company_name', 'Profile', NULL, false, true, true),
('user_profiles', 'role_title', 'Profile', NULL, false, true, true),
('user_profiles', 'email', 'Profile', NULL, false, false, true);

SELECT 'Field visibility configuration complete' as status;