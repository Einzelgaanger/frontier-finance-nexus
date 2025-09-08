BEGIN;

-- Delete any existing 2021 survey response for Evelyne Dioh
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'edioh@wic-capital.net');

-- Insert complete 2021 survey response for Evelyne Dioh
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
  'WIC CAPITAL',                                                -- firm_name
  'EVELYNE DIOH',                                               -- participant_name
  'MANAGING DIRECTOR',                                          -- role_title
  ARRAY['Africa - West Africa'],                                -- team_based
  ARRAY['Africa - West Africa'],                                -- geographic_focus
  'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)', -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  'First investment',                                           -- first_close_date
  'As of March 2020',                                           -- first_investment_date
  'As of March 2020',                                           -- investments_march_2020
  'As of March 2020',                                           -- investments_december_2020
  '',                                                           -- optional_supplement
  ARRAY['Open-ended vehicle / Limited liability company or equivalent'], -- investment_vehicle_type
  'Current',                                                    -- current_fund_size
  'Target',                                                     -- target_fund_size
  '6-7 years',                                                  -- investment_timeframe
  ARRAY['Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth)', 'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)', 'Niche Ventures (innovative products/services targeting niche markets with growth ambitions)'], -- business_model_targeted
  ARRAY['Start-up / pre-seed (pre-revenue, concept and business plan development)', 'Early stage / seed (early revenue, product/service development, funds needed to expand business model)'], -- business_stage_targeted
  ARRAY['Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)', 'Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['Angel network', 'Development Finance Institutions (DFIs)', 'Bilateral agencies'], -- target_capital_sources
  'Achieved in most recent reporting period',                   -- target_irr_achieved
  'Targeted',                                                   -- target_irr_targeted
  'Balanced impact/financial return, Impact investing (positive screening)', -- impact_vs_financial_orientation
  ARRAY['Gender'],                                              -- explicit_lens_focus
  false,                                                        -- report_sustainable_development_goals
  '',                                                           -- top_sdg_1
  '',                                                           -- top_sdg_2
  '',                                                           -- top_sdg_3
  ARRAY['Investment Requirement', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Requirement', 'Investment Consideration', 'Investment Consideration']::text[], -- gender_considerations_investment
  ARRAY['Women ownership/participation interest is ≥ 50%', 'Women representation on the board/investment committee is ≥ 50', 'Provide specific reporting on gender related indicators for your investors/funders', 'Require specific reporting on gender related indicators by your investees/borrowers']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Common equity', 'Preferred equity (e.g. certain rights above those available to common equity holders)', 'Mezzanine debt', 'Shared revenue/earnings instruments'], -- investment_forms
  ARRAY['Sector agnostic'],                                     -- target_sectors
  '0',                                                          -- carried_interest_principals
  '< or = 2',                                                   -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 2,
    'Fundraising including access to working capital resources', 5,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 1,
    'Human capital management – hiring/retention/training', 2,
    'Technology (CRM, MIS, telecommunications, etc)', 3,
    'Legal / regulatory', 2,
    'Operations/ production / facilities and infrastructure', 4,
    'Management training', 5,
    'Other', 5
  ),
  ARRAY['Interest income/shared revenues and principal repayment', 'Other types of self-liquidating repayment structures', 'Dividends'], -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 5,
    'Fundraising with access to warehousing capital', 5,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 1,
    'Fund economics', 2,
    'Fund structuring', 5,
    'Investment process (eg origination, due diligence, structuring, closing)', 5,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 2,
    'Fund staff/Human capital management and development', 3,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
    'Exit/monetization opportunities', 5,
    'Legal/regulatory support', 4,
    'Application of impact metrics', 3,
    'Other', 5
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - no impact',
    'Customer demand', 'To date - slight impact',
    'Ability to pay staff salaries', 'To date - no impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - no impact',
    'Ability to pay existing business loans', 'To date - no impact',
    'Access to supply inputs / raw materials', 'To date - slight impact',
    'Ability to pay for raw inputs / raw materials', 'To date - no impact',
    'Need to pivot business model', 'To date - high impact'
  ),
  ARRAY['Yes, grant funding (financial)'],                      -- covid_government_support
  ARRAY['New pipeline investments through existing vehicle', 'Technical assistance to support portfolio enterprises'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds internationally', 'Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'], -- fund_vehicle_considerations
  '1',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 'N/A',
    'LP Profiles', 'N/A',
    'Market Data', 3,
    'Purpose Definition', 3,
    'Access to Capital (DfID proposal)', 'N/A'
  ),
  'Moving forward, I think the working groups could be more action driven: implement what is designed.', -- new_working_group_suggestions
  jsonb_build_object(                                            -- webinar_content_ranking
    'Gender lens investing (facilitated by Suzanne Biegel)', 2,
    'COVID-19 Response (peer discussion)', 3,
    'Fundraising (presentations from I&P, Capria & DGGF)', 2,
    'Portfolio Support (presentations from 10-Xe and AMI)', 'N/A',
    'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 2,
    'Fundraising 2.0 (peer discussion)', 3,
    'Human Capital (peer discussion)', 2,
    'Co-investing workshop with ADAP (peer discussion)', 'N/A',
    'Fundraising 3.0 – local capital (peer discussion)', 1,
    'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 'N/A',
    'Mentoring Pilot Kick-off', 'N/A'
  ),
  'Portfolio support but actual fundmanagers from the network.', -- new_webinar_suggestions
  'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)', -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 2,
    'Advocacy for early stage investing ', 2,
    'Raised profile/visibility (individual or collective)', 1,
    'Systems change to drive more capital towards local capital providers', 3
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 3,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 2,
    'Mentoring program (expert led)', 2,
    'Mentoring program (peer-led)', 3,
    'Webinars with peer-to-peer feedback sessions', 3,
    'Webinars with expert-led feedback sessions', 1,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 3,
    'Fund Manager Portal (ie library of resources, templates etc)', 3,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
    'Joint back office between actively investing fund managers', 2
  ),
  'Yes, as a mentee',                                           -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  'Looking forward to the convening :)',                        -- additional_comments
  '2021-02-11 18:02:10'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'edioh@wic-capital.net';

COMMIT;
