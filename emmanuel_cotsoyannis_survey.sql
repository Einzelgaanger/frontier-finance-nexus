BEGIN;

-- Delete any existing 2021 survey response for Emmanuel Cotsoyannis
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'e.cotsoyannis@miarakap.com');

-- Insert complete 2021 survey response for Emmanuel Cotsoyannis
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
  'Miarakap',                                                    -- firm_name
  'Emmanuel Cotsoyannis',                                        -- participant_name
  'CEO',                                                        -- role_title
  ARRAY['Africa - Southern Africa'],                             -- team_based
  ARRAY['Africa - Southern Africa'],                             -- geographic_focus
  'Closed ended - completed first close',                        -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  '1st close (or equivalent)',                                  -- first_close_date
  'First investment',                                           -- first_investment_date
  'As of March 2020',                                          -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  '',                                                           -- optional_supplement
  ARRAY['Open-ended vehicle / Limited liability company or equivalent'], -- investment_vehicle_type
  'Current',                                                    -- current_fund_size
  'Target',                                                     -- target_fund_size
  '4-5 years',                                                  -- investment_timeframe
  ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)', 'Niche Ventures (innovative products/services targeting niche markets with growth ambitions)'], -- business_model_targeted
  ARRAY['Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['Fund partners', 'Corporates'],                         -- target_capital_sources
  'Targeted',                                                   -- target_irr_achieved
  'Achieved in most recent reporting period',                   -- target_irr_targeted
  'Balanced impact/financial return',                           -- impact_vs_financial_orientation
  ARRAY['N/A'],                                                -- explicit_lens_focus
  false,                                                        -- report_sustainable_development_goals
  NULL,                                                         -- top_sdg_1
  NULL,                                                         -- top_sdg_2
  NULL,                                                         -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration']::text[], -- gender_considerations_investment
  ARRAY['Female staffing is ≥ 50%']::text[],                    -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes'], -- investment_forms
  ARRAY['Sector agnostic'],                                     -- target_sectors
  '1',                                                          -- carried_interest_principals
  '3-5',                                                        -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 1,
    'Fundraising including access to working capital resources', 3,
    'Strategic / organizational planning', 2,
    'Product/services proof of concept /market share / competitor positioning', 4,
    'Human capital management – hiring/retention/training', 2,
    'Technology (CRM, MIS, telecommunications, etc)', 3,
    'Legal / regulatory', 3,
    'Operations/ production / facilities and infrastructure', 3,
    'Management training', 3,
    'Other', 3
  ),
  ARRAY['Interest income/shared revenues and principal repayment', 'Dividends', 'Management buyout'], -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 5,
    'Fundraising with access to warehousing capital', 5,
    'Fundraising with access to grant capital for vehicle OPEX', 3,
    'Fundraising with access to TA support', 3,
    'Fund economics', 5,
    'Fund structuring', 5,
    'Investment process (eg origination, due diligence, structuring, closing)', 5,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 5,
    'Fund staff/Human capital management and development', 5,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 5,
    'Exit/monetization opportunities', 1,
    'Legal/regulatory support', 5,
    'Application of impact metrics', 5,
    'Other', 3
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - slight impact',
    'Ability to pay staff salaries', 'To date - slight impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
    'Ability to pay existing business loans', 'To date - slight impact',
    'Access to supply inputs / raw materials', 'To date - slight impact',
    'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
    'Need to pivot business model', 'To date - no impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['Technical assistance to support portfolio enterprises'], -- raising_capital_2021
  ARRAY['Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'], -- fund_vehicle_considerations
  '5',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', NULL,
    'LP Profiles', NULL,
    'Market Data', NULL,
    'Purpose Definition', NULL,
    'Access to Capital (DfID proposal)', NULL
  ),
  'NA',                                                         -- new_working_group_suggestions
  jsonb_build_object(                                            -- webinar_content_ranking
    'Gender lens investing (facilitated by Suzanne Biegel)', NULL,
    'COVID-19 Response (peer discussion)', NULL,
    'Fundraising (presentations from I&P, Capria & DGGF)', NULL,
    'Portfolio Support (presentations from 10-Xe and AMI)', NULL,
    'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', NULL,
    'Fundraising 2.0 (peer discussion)', NULL,
    'Human Capital (peer discussion)', NULL,
    'Co-investing workshop with ADAP (peer discussion)', NULL,
    'Fundraising 3.0 – local capital (peer discussion)', NULL,
    'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', NULL,
    'Mentoring Pilot Kick-off', NULL
  ),
  'no',                                                         -- new_webinar_suggestions
  'Neither',                                                    -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 2,
    'Advocacy for early stage investing ', 2,
    'Raised profile/visibility (individual or collective)', NULL,
    'Systems change to drive more capital towards local capital providers', 2
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 2,
    'TA facility to support early fund economics and activities', 2,
    'Advocacy for the early-stage investing ecosystem', 3,
    'Mentoring program (expert led)', 3,
    'Mentoring program (peer-led)', 3,
    'Webinars with peer-to-peer feedback sessions', 3,
    'Webinars with expert-led feedback sessions', 2,
    'Fundraising Readiness Advisory Program for fund managers', 2,
    'Investment readiness for portfolio companies', 2,
    'Fund Manager Portal (ie library of resources, templates etc)', 2,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 1
  ),
  'No',                                                         -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  'NA',                                                         -- additional_comments
  '2021-03-11 06:42:59'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'e.cotsoyannis@miarakap.com';

COMMIT;
