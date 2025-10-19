BEGIN;

-- Delete any existing 2021 survey response for François Ngenyi
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'fngenyi@sycomore-venture.com');

-- Insert complete 2021 survey response for François Ngenyi
INSERT INTO public.survey_responses_2021 (
  user_id,
  firm_name,
  participant_name,
  role_title,
  team_based,
  geographic_focus,
  fund_stage,
  legal_entity_date,
  first_close_date,
  first_investment_date,
  investments_march_2020,
  investments_december_2020,
  optional_supplement,
  investment_vehicle_type,
  current_fund_size,
  target_fund_size,
  investment_timeframe,
  business_model_targeted,
  business_stage_targeted,
  financing_needs,
  target_capital_sources,
  target_irr_achieved,
  target_irr_targeted,
  impact_vs_financial_orientation,
  explicit_lens_focus,
  report_sustainable_development_goals,
  top_sdg_1,
  top_sdg_2,
  top_sdg_3,
  gender_considerations_investment,
  gender_considerations_requirement,
  gender_fund_vehicle,
  investment_size_your_amount,
  investment_size_total_raise,
  investment_forms,
  target_sectors,
  carried_interest_principals,
  current_ftes,
  portfolio_needs_ranking,
  investment_monetization,
  exits_achieved,
  fund_capabilities_ranking,
  covid_impact_aggregate,
  covid_impact_portfolio,
  covid_government_support,
  raising_capital_2021,
  fund_vehicle_considerations,
  network_value_rating,
  working_groups_ranking,
  new_working_group_suggestions,
  webinar_content_ranking,
  new_webinar_suggestions,
  communication_platform,
  network_value_areas,
  present_connection_session,
  convening_initiatives_ranking,
  participate_mentoring_program,
  present_demystifying_session,
  additional_comments,
  completed_at,
  created_at,
  updated_at
)
SELECT
  u.id,                                                          -- user_id
  'SYCOMORE-VENTURE',                                           -- firm_name
  'FRANCOIS NGENYI',                                            -- participant_name
  'CEO',                                                        -- role_title
  ARRAY['Africa - Central Africa'],                             -- team_based
  ARRAY['Africa - Central Africa'],                             -- geographic_focus
  'Early stage! Not yet raised fund',                           -- fund_stage
  '1st close (or equivalent)',                                  -- legal_entity_date
  'First investment',                                           -- first_close_date
  'As of March 2020',                                           -- first_investment_date
  'As of March 2020',                                           -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  'We are in discussion with angel investors',                  -- optional_supplement
  ARRAY['Angel network'],                                       -- investment_vehicle_type
  'Target',                                                     -- current_fund_size
  'Target',                                                     -- target_fund_size
  '<1 year',                                                    -- investment_timeframe
  ARRAY['Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth)'], -- business_model_targeted
  ARRAY['Start-up / pre-seed (pre-revenue, concept and business plan development)'], -- business_stage_targeted
  ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance'], -- financing_needs
  ARRAY['High Net Worth Individuals (HNWIs)', 'Angel network', 'Crowd funding', 'Donors/philanthropy'], -- target_capital_sources
  'Targeted',                                                   -- target_irr_achieved
  'Targeted',                                                   -- target_irr_targeted
  'Responsible/ESG investing (negative screening)',            -- impact_vs_financial_orientation
  ARRAY['Gender', 'Youth'],                                     -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'First',                                                      -- top_sdg_1
  'First',                                                      -- top_sdg_2
  'First',                                                      -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Requirement', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Requirement']::text[], -- gender_considerations_investment
  ARRAY['Provide specific reporting on gender related indicators for your investors/funders']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Your investment amount',                                     -- investment_size_total_raise
  ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)'], -- investment_forms
  ARRAY['Agriculture / Food supply chain', 'Education', 'Energy / Renewables / Green Mobility', 'Technology / ICT / Telecommunications'], -- target_sectors
  '1',                                                          -- carried_interest_principals
  '< or = 2',                                                   -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 1,
    'Fundraising including access to working capital resources', 2,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 1,
    'Human capital management – hiring/retention/training', 2,
    'Technology (CRM, MIS, telecommunications, etc)', 2,
    'Legal / regulatory', 2,
    'Operations/ production / facilities and infrastructure', 2,
    'Management training', 2,
    'Other', 3
  ),
  ARRAY['Interest income/shared revenues and principal repayment'], -- investment_monetization
  '1-4',                                                        -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 2,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 3,
    'Fundraising with access to grant capital for vehicle OPEX', 3,
    'Fundraising with access to TA support', 1,
    'Fund economics', 1,
    'Fund structuring', 1,
    'Investment process (eg origination, due diligence, structuring, closing)', 1,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 1,
    'Fund staff/Human capital management and development', 1,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 2,
    'Exit/monetization opportunities', 1,
    'Legal/regulatory support', 1,
    'Application of impact metrics', 1,
    'Other', 2
  ),
  'Significant negative impact',                                -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - no impact',
    'Ability to pay staff salaries', 'To date - slight impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
    'Ability to pay existing business loans', 'To date - high impact',
    'Access to supply inputs / raw materials', 'To date - high impact',
    'Ability to pay for raw inputs / raw materials', 'To date - high impact',
    'Need to pivot business model', 'To date - high impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['N/A - have no plans to raise capital in 2021'],       -- raising_capital_2021
  ARRAY['No change planned'],                                   -- fund_vehicle_considerations
  '3',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 2,
    'LP Profiles', 4,
    'Market Data', 4,
    'Purpose Definition', 4,
    'Access to Capital (DfID proposal)', 3
  ),
  'N/A',                                                        -- new_working_group_suggestions
  jsonb_build_object(                                            -- webinar_content_ranking
    'Gender lens investing (facilitated by Suzanne Biegel)', 'N/A',
    'COVID-19 Response (peer discussion)', 'N/A',
    'Fundraising (presentations from I&P, Capria & DGGF)', 'N/A',
    'Portfolio Support (presentations from 10-Xe and AMI)', 'N/A',
    'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 'N/A',
    'Fundraising 2.0 (peer discussion)', 'N/A',
    'Human Capital (peer discussion)', 'N/A',
    'Co-investing workshop with ADAP (peer discussion)', 'N/A',
    'Fundraising 3.0 – local capital (peer discussion)', 'N/A',
    'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 'N/A',
    'Mentoring Pilot Kick-off', 3
  ),
  'N/A',                                                        -- new_webinar_suggestions
  'WhatsApp only',                                              -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 4,
    'Advocacy for early stage investing ', 'N/A',
    'Raised profile/visibility (individual or collective)', 'N/A',
    'Systems change to drive more capital towards local capital providers', 'N/A'
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 1,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 2,
    'Mentoring program (expert led)', 1,
    'Mentoring program (peer-led)', 1,
    'Webinars with peer-to-peer feedback sessions', 1,
    'Webinars with expert-led feedback sessions', 2,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 1,
    'Fund Manager Portal (ie library of resources, templates etc)', 1,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 1
  ),
  'Yes, as a mentee',                                           -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  'N/A',                                                        -- additional_comments
  '2021-02-11 09:39:08'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'fngenyi@sycomore-venture.com';

COMMIT;
