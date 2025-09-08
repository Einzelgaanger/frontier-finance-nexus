BEGIN;

-- Delete any existing 2021 survey response for Aarthi Ramasubramanian
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'arthi.ramasubramanian@opesfund.eu');

-- Insert complete 2021 survey response for Aarthi Ramasubramanian
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
  'Opes-Lcef Fund',                                             -- firm_name
  'Aarthi Ramasubramanian',                                     -- participant_name
  'Fund Manager',                                               -- role_title
  ARRAY['US/Europe', 'Asia - South Asia', 'Africa - East Africa'], -- team_based
  ARRAY['US/Europe', 'Africa - East Africa'],                   -- geographic_focus
  'Closed ended - fundraising, Second fund/vehicle',           -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  '1st close (or equivalent)',                                  -- first_close_date
  'First investment',                                           -- first_investment_date
  'As of March 2020',                                          -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  'The number of investments indicated above is from the Opes-LCEF Trust which had invested across the globe. Opes-LCEF has set up the Restart Fund in 2020 which is a sub $1mn fund and is set up as a pre-fund to identify pipeline companies and showcase to potential investors about our investment process. The Reimagine Fund is envisaged to be a $50mn early stage fund for East Africa. We intend to establish a Fund continuum between the Restart and Reimagine fund by providing companies with short term funding initially (from Restart)and getting them ready for potential long term investments from Reimagine Fund once it is raised.', -- optional_supplement
  ARRAY['Closed-end fund'],                                     -- investment_vehicle_type
  'Current',                                                    -- current_fund_size
  'Target',                                                     -- target_fund_size
  '1-3 years',                                                  -- investment_timeframe
  ARRAY['Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth)', 'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)', 'Niche Ventures (innovative products/services targeting niche markets with growth ambitions)', 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)'], -- business_stage_targeted
  ARRAY['Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['Fund partners', 'Local pension funds', 'High Net Worth Individuals (HNWIs)', 'Development Finance Institutions (DFIs)', 'Bilateral agencies', 'Impact investing family offices', 'Donors/philanthropy'], -- target_capital_sources
  'Achieved in most recent reporting period',                   -- target_irr_achieved
  'Targeted',                                                   -- target_irr_targeted
  'Impact investing (positive screening)',                      -- impact_vs_financial_orientation
  ARRAY['Gender'],                                              -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'Second',                                                     -- top_sdg_1
  'Third',                                                      -- top_sdg_2
  'Second',                                                     -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Requirement', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Requirement', 'Investment Requirement', 'Investment Requirement']::text[], -- gender_considerations_investment
  ARRAY['Women representation on the board/investment committee is ≥ 50', 'Female staffing is ≥ 50%', 'Provide specific reporting on gender related indicators for your investors/funders', 'Require specific reporting on gender related indicators by your investees/borrowers']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Common equity', 'Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes', 'Senior debt', 'Shared revenue/earnings instruments'], -- investment_forms
  ARRAY['Agriculture / Food supply chain', 'Distribution / Logistics', 'Education', 'Energy / Renewables / Green Mobility'], -- target_sectors
  '2-3',                                                        -- carried_interest_principals
  '< or = 2',                                                   -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 2,
    'Fundraising including access to working capital resources', 2,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 2,
    'Human capital management – hiring/retention/training', 2,
    'Technology (CRM, MIS, telecommunications, etc)', 4,
    'Legal / regulatory', 2,
    'Operations/ production / facilities and infrastructure', 4,
    'Management training', 3,
    'Other', 3
  ),
  ARRAY['Interest income/shared revenues and principal repayment', 'Strategic sale/merger of company', 'Management buyout', 'Financial investor take-out'], -- investment_monetization
  '1-4',                                                        -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 5,
    'Fundraising with access to grant capital for vehicle OPEX', 2,
    'Fundraising with access to TA support', 2,
    'Fund economics', 5,
    'Fund structuring', 2,
    'Investment process (eg origination, due diligence, structuring, closing)', 5,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 5,
    'Fund staff/Human capital management and development', 3,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 5,
    'Exit/monetization opportunities', 4,
    'Legal/regulatory support', 3,
    'Application of impact metrics', 4,
    'Other', 4
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - high impact',
    'Ability to pay staff salaries', 'To date - slight impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
    'Ability to pay existing business loans', 'To date - slight impact',
    'Access to supply inputs / raw materials', 'To date - high impact',
    'Ability to pay for raw inputs / raw materials', 'To date - high impact',
    'Need to pivot business model', 'To date - slight impact'
  ),
  ARRAY['Yes, grant funding (financial)', 'Recoverable Grant instrument'], -- covid_government_support
  ARRAY['New pipeline investments through new vehicle'],        -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'], -- fund_vehicle_considerations
  '2',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 2,
    'LP Profiles', 1,
    'Market Data', 2,
    'Purpose Definition', 3,
    'Access to Capital (DfID proposal)', 1
  ),
  'Impact measurement, Portfolios Management and support through data', -- new_working_group_suggestions
  jsonb_build_object(                                            -- webinar_content_ranking
    'Gender lens investing (facilitated by Suzanne Biegel)', 1,
    'COVID-19 Response (peer discussion)', 2,
    'Fundraising (presentations from I&P, Capria & DGGF)', 1,
    'Portfolio Support (presentations from 10-Xe and AMI)', 3,
    'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 2,
    'Fundraising 2.0 (peer discussion)', 2,
    'Human Capital (peer discussion)', 2,
    'Co-investing workshop with ADAP (peer discussion)', 2,
    'Fundraising 3.0 – local capital (peer discussion)', 2,
    'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 1,
    'Mentoring Pilot Kick-off', 2
  ),
  'None',                                                       -- new_webinar_suggestions
  'WhatsApp only',                                              -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 2,
    'Advocacy for early stage investing ', 1,
    'Raised profile/visibility (individual or collective)', 2,
    'Systems change to drive more capital towards local capital providers', 2
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 1,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 1,
    'Mentoring program (expert led)', 3,
    'Mentoring program (peer-led)', 2,
    'Webinars with peer-to-peer feedback sessions', 1,
    'Webinars with expert-led feedback sessions', 1,
    'Fundraising Readiness Advisory Program for fund managers', 3,
    'Investment readiness for portfolio companies', 3,
    'Fund Manager Portal (ie library of resources, templates etc)', 1,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 1
  ),
  'Not sure',                                                   -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  '',                                                           -- additional_comments
  '2021-02-12 08:47:31'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'arthi.ramasubramanian@opesfund.eu';

COMMIT;
