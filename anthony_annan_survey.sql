BEGIN;

-- Delete any existing 2021 survey response for Anthony Annan
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'annan.anthony@gmail.com');

-- Insert complete 2021 survey response for Anthony Annan
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
  'Impact Capital Advisors',                                    -- firm_name
  'Anthony Annan',                                              -- participant_name
  'CEO & Fund Manager',                                         -- role_title
  ARRAY['Africa - West Africa', 'Africa - East Africa', 'Africa - Southern Africa'], -- team_based
  ARRAY['Africa - West Africa'],                                -- geographic_focus
  'Closed ended - completed first close',                       -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  '1st close (or equivalent)',                                  -- first_close_date
  'First investment',                                           -- first_investment_date
  'As of December 2020',                                        -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  '',                                                           -- optional_supplement
  ARRAY['Closed-end fund'],                                     -- investment_vehicle_type
  'Current',                                                    -- current_fund_size
  'Target',                                                     -- target_fund_size
  '6-7 years',                                                  -- investment_timeframe
  ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)', 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Start-up / pre-seed (pre-revenue, concept and business plan development)', 'Early stage / seed (early revenue, product/service development, funds needed to expand business model)', 'Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['Local pension funds', 'Development Finance Institutions (DFIs)', 'Bilateral agencies', 'Impact investing family offices', 'Donors/philanthropy', 'Corporates'], -- target_capital_sources
  'Targeted',                                                   -- target_irr_achieved
  'Targeted',                                                   -- target_irr_targeted
  'Balanced impact/financial return',                           -- impact_vs_financial_orientation
  ARRAY['Gender', 'Youth', 'Job creation', 'Climate / green ventures'], -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'Second',                                                     -- top_sdg_1
  'First',                                                      -- top_sdg_2
  'First',                                                      -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration']::text[], -- gender_considerations_investment
  ARRAY['Female staffing is ≥ 50%', 'Provide specific reporting on gender related indicators for your investors/funders']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Your investment amount',                                     -- investment_size_total_raise
  ARRAY['Common equity', 'Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes', 'Shared revenue/earnings instruments'], -- investment_forms
  ARRAY['Agriculture / Food supply chain', 'Manufacturing'],    -- target_sectors
  '2-3',                                                        -- carried_interest_principals
  '6-10',                                                       -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 1,
    'Fundraising including access to working capital resources', 1,
    'Strategic / organizational planning', 2,
    'Product/services proof of concept /market share / competitor positioning', 4,
    'Human capital management – hiring/retention/training', 3,
    'Technology (CRM, MIS, telecommunications, etc)', 4,
    'Legal / regulatory', 5,
    'Operations/ production / facilities and infrastructure', 1,
    'Management training', 3,
    'Other', 1
  ),
  ARRAY['Interest income/shared revenues and principal repayment', 'Other types of self-liquidating repayment structures', 'Dividends', 'Strategic sale/merger of company'], -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 3,
    'Fundraising with access to warehousing capital', 2,
    'Fundraising with access to grant capital for vehicle OPEX', 4,
    'Fundraising with access to TA support', 2,
    'Fund economics', 3,
    'Fund structuring', 3,
    'Investment process (eg origination, due diligence, structuring, closing)', 3,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 1,
    'Fund staff/Human capital management and development', 3,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 1,
    'Exit/monetization opportunities', 1,
    'Legal/regulatory support', 3,
    'Application of impact metrics', 1,
    'Other', 1
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - slight impact',
    'Ability to pay staff salaries', 'To date - no impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - no impact',
    'Ability to pay existing business loans', 'To date - no impact',
    'Access to supply inputs / raw materials', 'To date - no impact',
    'Ability to pay for raw inputs / raw materials', 'To date - no impact',
    'Need to pivot business model', 'To date - no impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['Technical assistance to support portfolio enterprises', 'To reach target fund size.'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase use of technology in order to lower fund operational costs', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'], -- fund_vehicle_considerations
  '1',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 1,
    'LP Profiles', 3,
    'Market Data', 1,
    'Purpose Definition', 4,
    'Access to Capital (DfID proposal)', 1
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
    'Mentoring Pilot Kick-off', 2
  ),
  'N/A',                                                        -- new_webinar_suggestions
  'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)', -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 1,
    'Advocacy for early stage investing ', 1,
    'Raised profile/visibility (individual or collective)', 1,
    'Systems change to drive more capital towards local capital providers', 4
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 1,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 2,
    'Mentoring program (expert led)', 1,
    'Mentoring program (peer-led)', 3,
    'Webinars with peer-to-peer feedback sessions', 1,
    'Webinars with expert-led feedback sessions', 1,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 1,
    'Fund Manager Portal (ie library of resources, templates etc)', 1,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
    'Joint back office between actively investing fund managers', 1
  ),
  'Not sure',                                                   -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  'N/A',                                                        -- additional_comments
  '2021-02-12 00:51:52'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'annan.anthony@gmail.com';

COMMIT;
