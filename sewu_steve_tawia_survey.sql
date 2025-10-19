BEGIN;

-- Delete any existing 2021 survey response for Sewu-Steve Tawia
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'stawia@gmail.com');

-- Insert complete 2021 survey response for Sewu-Steve Tawia
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
  'Villgro Africa',                                              -- firm_name
  'Sewu-Steve Tawia',                                            -- participant_name
  'Investment Professional',                                     -- role_title
  ARRAY['Africa - East Africa'],                                 -- team_based
  ARRAY['Africa - East Africa'],                                 -- geographic_focus
  'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)', -- fund_stage
  'Legal entity, 1st close (or equivalent)',                    -- legal_entity_date
  'First investment',                                            -- first_close_date
  'As of March 2020',                                            -- first_investment_date
  'As of March 2020',                                            -- investments_march_2020
  'As of December 2020',                                         -- investments_december_2020
  'villgro africa has made a number of investments via its incubation/acceleration program', -- optional_supplement
  ARRAY['Open-ended vehicle / Limited liability company or equivalent'], -- investment_vehicle_type
  'Current',                                                     -- current_fund_size
  'Target',                                                      -- target_fund_size
  '1-3 years',                                                   -- investment_timeframe
  ARRAY['Niche Ventures (innovative products/services targeting niche markets with growth ambitions)', 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Start-up / pre-seed (pre-revenue, concept and business plan development)', 'Early stage / seed (early revenue, product/service development, funds needed to expand business model)'], -- business_stage_targeted
  ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance', 'Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)'], -- financing_needs
  ARRAY['Fund partners', 'Local pension funds', 'High Net Worth Individuals (HNWIs)', 'Impact investing family offices', 'Donors/philanthropy'], -- target_capital_sources
  'Achieved in most recent reporting period',                    -- target_irr_achieved
  'Targeted',                                                    -- target_irr_targeted
  'Impact investing (positive screening)',                       -- impact_vs_financial_orientation
  ARRAY['Healthcare', 'Life Sciences'],                         -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'First',                                                      -- top_sdg_1
  'Second',                                                     -- top_sdg_2
  'Second',                                                     -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration']::text[], -- gender_considerations_investment
  ARRAY['Women ownership/participation interest is ≥ 50%', 'Women representation on the board/investment committee is ≥ 50']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                      -- investment_size_your_amount
  'Total raise by portfolio company',                            -- investment_size_total_raise
  ARRAY['Common equity', 'Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes', 'Shared revenue/earnings instruments', 'SAFEs'], -- investment_forms
  ARRAY['Healthcare', 'Life Sciences'],                         -- target_sectors
  '0',                                                          -- carried_interest_principals
  '< or = 2',                                                   -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 1,
    'Fundraising including access to working capital resources', 4,
    'Strategic / organizational planning', 2,
    'Product/services proof of concept /market share / competitor positioning', 2,
    'Human capital management – hiring/retention/training', 2,
    'Technology (CRM, MIS, telecommunications, etc)', 3,
    'Legal / regulatory', 3,
    'Operations/ production / facilities and infrastructure', 2,
    'Management training', 3,
    'Other', 1
  ),
  ARRAY['Other types of self-liquidating repayment structures', 'Strategic sale/merger of company'], -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 2,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 2,
    'Fund economics', 3,
    'Fund structuring', 2,
    'Investment process (eg origination, due diligence, structuring, closing)', 3,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 4,
    'Fund staff/Human capital management and development', 4,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
    'Exit/monetization opportunities', 4,
    'Legal/regulatory support', 3,
    'Application of impact metrics', 3,
    'Other', 5
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'Anticipate no future impact',
    'Customer demand', 'To date - high impact',
    'Ability to pay staff salaries', 'To date - high impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
    'Ability to pay existing business loans', 'To date - slight impact',
    'Access to supply inputs / raw materials', 'To date - no impact',
    'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
    'Need to pivot business model', 'To date - slight impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['New pipeline investments through new vehicle', 'Raise first time fund with first time team'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase use of technology in order to lower fund operational costs', 'Increase use of data and technology to facilitate investment decisions'], -- fund_vehicle_considerations
  '2',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 'N/A',
    'LP Profiles', 'N/A',
    'Market Data', 'N/A',
    'Purpose Definition', 'N/A',
    'Access to Capital (DfID proposal)', 'N/A'
  ),
  'Use of technology to change the fund management paradigm (lower operational cost), which tools are there (benchmark), in a post Covid or Covid world.', -- new_working_group_suggestions
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
    'Mentoring Pilot Kick-off', 'N/A'
  ),
  'Angel investing networks and angel syndicates; Search Funds, micro-VC models', -- new_webinar_suggestions
  'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)', -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 2,
    'Advocacy for early stage investing ', 1,
    'Raised profile/visibility (individual or collective)', 3,
    'Systems change to drive more capital towards local capital providers', 2
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 1,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 2,
    'Mentoring program (expert led)', 2,
    'Mentoring program (peer-led)', 2,
    'Webinars with peer-to-peer feedback sessions', 2,
    'Webinars with expert-led feedback sessions', 2,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 1,
    'Fund Manager Portal (ie library of resources, templates etc)', 1,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 2
  ),
  'Yes, as a mentee',                                           -- participate_mentoring_program
  ARRAY['Yes, angel investing / engaging local co-investors']::text[], -- present_demystifying_session
  '',                                                           -- additional_comments
  '2021-02-10 14:34:05'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'stawia@gmail.com';

COMMIT;
