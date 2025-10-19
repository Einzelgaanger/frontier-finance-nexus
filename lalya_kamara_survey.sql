BEGIN;

-- Delete any existing 2021 survey response for Lalya Kamara
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'lkamara@sahelinvest.com');

-- Insert complete 2021 survey response for Lalya Kamara
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
  'Sahelinvest',                                                 -- firm_name
  'Lalya Kamara',                                               -- participant_name
  'CEO',                                                        -- role_title
  ARRAY['Africa - West Africa'],                                 -- team_based
  ARRAY['Africa - West Africa', 'Africa - Central Africa'],      -- geographic_focus
  'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)', -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  'First investment',                                           -- first_close_date
  'First investment',                                           -- first_investment_date
  'As of March 2020',                                          -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  'As Sahel 1 has not been closed yet, we invested in Micro-debt funds using Sahelinvest available resources.', -- optional_supplement
  ARRAY['Open-ended vehicle / Limited liability company or equivalent'], -- investment_vehicle_type
  'Current',                                                    -- current_fund_size
  'Target',                                                     -- target_fund_size
  ARRAY['1-3 years', '4-5 years', 'As an open-ended vehicle, the timeframe will be specific to each investment.'], -- investment_timeframe
  ARRAY['Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth)', 'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)', 'Niche Ventures (innovative products/services targeting niche markets with growth ambitions)', 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)', 'Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)'], -- financing_needs
  ARRAY['High Net Worth Individuals (HNWIs)', 'Development Finance Institutions (DFIs)', 'Impact investing family offices', 'Donors/philanthropy'], -- target_capital_sources
  'Targeted',                                                   -- target_irr_achieved
  'Targeted',                                                   -- target_irr_targeted
  'Balanced impact/financial return',                           -- impact_vs_financial_orientation
  ARRAY['Gender', 'Youth', 'Job creation'],                     -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'Third',                                                      -- top_sdg_1
  'Second',                                                     -- top_sdg_2
  'First',                                                      -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Consideration']::text[], -- gender_considerations_investment
  ARRAY['Provide specific reporting on gender related indicators for your investors/funders']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Common equity', 'Convertible notes', 'Mezzanine debt'], -- investment_forms
  ARRAY['Sector agnostic'],                                     -- target_sectors
  '0',                                                          -- carried_interest_principals
  '3-5',                                                        -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 2,
    'Fundraising including access to working capital resources', 1,
    'Strategic / organizational planning', 5,
    'Product/services proof of concept /market share / competitor positioning', 4,
    'Human capital management – hiring/retention/training', 3,
    'Technology (CRM, MIS, telecommunications, etc)', 5,
    'Legal / regulatory', 5,
    'Operations/ production / facilities and infrastructure', 5,
    'Management training', 5,
    'Other', 5
  ),
  ARRAY['Dividends', 'Strategic sale/merger of company', 'Management buyout'], -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 2,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 2,
    'Fund economics', 4,
    'Fund structuring', 4,
    'Investment process (eg origination, due diligence, structuring, closing)', 5,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 5,
    'Fund staff/Human capital management and development', 5,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 5,
    'Exit/monetization opportunities', 5,
    'Legal/regulatory support', 4,
    'Application of impact metrics', 5,
    'Other', 5
  ),
  'Neither positive nor negative impact',                       -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - high impact',
    'Customer demand', 'To date - no impact',
    'Ability to pay staff salaries', 'To date - no impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - no impact',
    'Ability to pay existing business loans', 'To date - no impact',
    'Access to supply inputs / raw materials', 'To date - slight impact',
    'Ability to pay for raw inputs / raw materials', 'To date - no impact',
    'Need to pivot business model', 'To date - no impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['Close our first fund Sahel 1'],                        -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds internationally', 'Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'], -- fund_vehicle_considerations
  '1',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 1,
    'LP Profiles', 1,
    'Market Data', NULL,
    'Purpose Definition', NULL,
    'Access to Capital (DfID proposal)', NULL
  ),
  'Legal structuring',                                          -- new_working_group_suggestions
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
  'No',                                                         -- new_webinar_suggestions
  'WhatsApp only',                                              -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', NULL,
    'Advocacy for early stage investing ', NULL,
    'Raised profile/visibility (individual or collective)', NULL,
    'Systems change to drive more capital towards local capital providers', NULL
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 2,
    'TA facility to support early fund economics and activities', 2,
    'Advocacy for the early-stage investing ecosystem', 3,
    'Mentoring program (expert led)', 3,
    'Mentoring program (peer-led)', 3,
    'Webinars with peer-to-peer feedback sessions', 3,
    'Webinars with expert-led feedback sessions', 3,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 1,
    'Fund Manager Portal (ie library of resources, templates etc)', 3,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 3
  ),
  'No',                                                         -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  '',                                                           -- additional_comments
  '2021-02-25 15:12:40'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'lkamara@sahelinvest.com';

COMMIT;
