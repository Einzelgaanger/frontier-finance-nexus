BEGIN;

-- Delete any existing 2021 survey response for Sagar Tandon
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'sagar@firstfollowers.co');

-- Insert complete 2021 survey response for Sagar Tandon
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
  'First Followers Capital',                                     -- firm_name
  'Sagar Tandon',                                               -- participant_name
  'Partner',                                                    -- role_title
  ARRAY['Asia - South East Asia'],                               -- team_based
  ARRAY['Asia - South East Asia'],                               -- geographic_focus
  'Closed ended - fundraising',                                 -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  '1st close (or equivalent)',                                  -- first_close_date
  'First investment',                                           -- first_investment_date
  'As of March 2020',                                          -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  'As a founding partner in Indonesia Women Empowerment Fund, I have led 3 investments and currently on my path to close 4 more investments.', -- optional_supplement
  ARRAY['Closed-end fund'],                                     -- investment_vehicle_type
  'Current',                                                    -- current_fund_size
  'Target',                                                     -- target_fund_size
  '1-3 years',                                                  -- investment_timeframe
  ARRAY['Niche Ventures (innovative products/services targeting niche markets with growth ambitions)', 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)', 'Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance', 'Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['Fund partners', 'Local pension funds', 'High Net Worth Individuals (HNWIs)', 'Angel network', 'Development Finance Institutions (DFIs)', 'Impact investing family offices', 'Corporates'], -- target_capital_sources
  'Achieved in most recent reporting period',                   -- target_irr_achieved
  'Targeted',                                                   -- target_irr_targeted
  'Financial return first, Responsible/ESG investing (negative screening)', -- impact_vs_financial_orientation
  ARRAY['Job creation'],                                        -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'First',                                                      -- top_sdg_1
  'Second',                                                     -- top_sdg_2
  'Third',                                                      -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Requirement']::text[], -- gender_considerations_investment
  ARRAY['We are not GLI fund vehicle']::text[],                 -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Convertible notes', 'Mezzanine debt', 'Shared revenue/earnings instruments', 'SAFEs'], -- investment_forms
  ARRAY['Sector agnostic', 'Our investment thesis is future of work, gig economy and growth SMEs'], -- target_sectors
  '2-3',                                                        -- carried_interest_principals
  '< or = 2',                                                   -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 5,
    'Fundraising including access to working capital resources', 1,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 1,
    'Human capital management – hiring/retention/training', 1,
    'Technology (CRM, MIS, telecommunications, etc)', 3,
    'Legal / regulatory', 3,
    'Operations/ production / facilities and infrastructure', 3,
    'Management training', 5,
    'Other', 5
  ),
  ARRAY['Interest income/shared revenues and principal repayment', 'Other types of self-liquidating repayment structures', 'Strategic sale/merger of company', 'IPO', 'Secondaries'], -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 1,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 5,
    'Fund economics', 3,
    'Fund structuring', 2,
    'Investment process (eg origination, due diligence, structuring, closing)', 4,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 4,
    'Fund staff/Human capital management and development', 4,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
    'Exit/monetization opportunities', 3,
    'Legal/regulatory support', 3,
    'Application of impact metrics', 5,
    'Other', 5
  ),
  'Neither positive nor negative impact',                       -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - no impact',
    'Customer demand', 'To date - no impact',
    'Ability to pay staff salaries', 'To date - no impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - no impact',
    'Ability to pay existing business loans', 'To date - no impact',
    'Access to supply inputs / raw materials', 'To date - no impact',
    'Ability to pay for raw inputs / raw materials', 'To date - no impact',
    'Need to pivot business model', 'To date - no impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['New pipeline investments through new vehicle'],        -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)'], -- fund_vehicle_considerations
  '1',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 1,
    'LP Profiles', 3,
    'Market Data', 2,
    'Purpose Definition', 2,
    'Access to Capital (DfID proposal)', 4
  ),
  'NA',                                                         -- new_working_group_suggestions
  jsonb_build_object(                                            -- webinar_content_ranking
    'Gender lens investing (facilitated by Suzanne Biegel)', 1,
    'COVID-19 Response (peer discussion)', 2,
    'Fundraising (presentations from I&P, Capria & DGGF)', 2,
    'Portfolio Support (presentations from 10-Xe and AMI)', 4,
    'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 4,
    'Fundraising 2.0 (peer discussion)', 4,
    'Human Capital (peer discussion)', 3,
    'Co-investing workshop with ADAP (peer discussion)', 3,
    'Fundraising 3.0 – local capital (peer discussion)', 4,
    'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 3,
    'Mentoring Pilot Kick-off', 1
  ),
  'NA',                                                         -- new_webinar_suggestions
  'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)', -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 1,
    'Advocacy for early stage investing ', 2,
    'Raised profile/visibility (individual or collective)', 2,
    'Systems change to drive more capital towards local capital providers', 4
  ),
  true,                                                         -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 1,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 1,
    'Mentoring program (expert led)', 1,
    'Mentoring program (peer-led)', 2,
    'Webinars with peer-to-peer feedback sessions', 1,
    'Webinars with expert-led feedback sessions', 1,
    'Fundraising Readiness Advisory Program for fund managers', 2,
    'Investment readiness for portfolio companies', 2,
    'Fund Manager Portal (ie library of resources, templates etc)', 2,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 3,
    'Joint back office between actively investing fund managers', 3
  ),
  'Yes, as a mentor, Yes, as a mentee, Not sure',               -- participate_mentoring_program
  ARRAY['Yes, early stage debt vehicles', 'Yes, early stage equity', 'Yes, angel investing / engaging local co-investors']::text[], -- present_demystifying_session
  'NA',                                                         -- additional_comments
  '2021-02-13 03:11:11'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'sagar@firstfollowers.co';

COMMIT;
