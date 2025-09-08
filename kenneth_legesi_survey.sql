BEGIN;

-- Delete any existing 2021 survey response for Kenneth Legesi
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'klegesi@ortusafrica.com');

-- Insert complete 2021 survey response for Kenneth Legesi
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
  'Ortus Africa Capital',                                        -- firm_name
  'Kenneth Legesi',                                              -- participant_name
  'CEO',                                                         -- role_title
  ARRAY['Africa - East Africa'],                                 -- team_based
  ARRAY['Africa - West Africa', 'Africa - East Africa', 'Africa - Central Africa', 'Africa - Southern Africa'], -- geographic_focus
  'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)', -- fund_stage
  'Legal entity',                                                -- legal_entity_date
  '1st close (or equivalent), First investment',                 -- first_close_date
  'As of December 2020',                                         -- first_investment_date
  '',                                                            -- investments_march_2020
  'As of December 2020',                                         -- investments_december_2020
  '',                                                            -- optional_supplement
  ARRAY['Open-ended vehicle / Limited liability company or equivalent'], -- investment_vehicle_type
  'Current',                                                     -- current_fund_size
  'Target',                                                      -- target_fund_size
  '8+ years',                                                    -- investment_timeframe
  ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)', 'Niche Ventures (innovative products/services targeting niche markets with growth ambitions)', 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Start-up / pre-seed (pre-revenue, concept and business plan development)', 'Early stage / seed (early revenue, product/service development, funds needed to expand business model)'], -- business_stage_targeted
  ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance', 'Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['Local pension funds', 'High Net Worth Individuals (HNWIs)', 'Angel network', 'Development Finance Institutions (DFIs)', 'Crowd funding', 'Bilateral agencies', 'Impact investing family offices', 'Donors/philanthropy', 'Corporates'], -- target_capital_sources
  'Achieved in most recent reporting period',                    -- target_irr_achieved
  'Targeted',                                                    -- target_irr_targeted
  'Balanced impact/financial return',                            -- impact_vs_financial_orientation
  ARRAY['Gender', 'Youth', 'Job creation'],                      -- explicit_lens_focus
  false,                                                         -- report_sustainable_development_goals
  'Second',                                                      -- top_sdg_1
  'Others',                                                      -- top_sdg_2
  'First',                                                       -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Requirement', 'Investment Requirement', 'Investment Requirement']::text[], -- gender_considerations_investment
  ARRAY['Female staffing is ≥ 50%', 'Provide specific reporting on gender related indicators for your investors/funders', 'Require specific reporting on gender related indicators by your investees/borrowers']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount, Total raise by portfolio company',    -- investment_size_your_amount
  'Your investment amount, Total raise by portfolio company',    -- investment_size_total_raise
  ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes', 'Shared revenue/earnings instruments', 'SAFEs'], -- investment_forms
  ARRAY['Sector agnostic'],                                      -- target_sectors
  '0',                                                           -- carried_interest_principals
  '6-10',                                                        -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 2,
    'Fundraising including access to working capital resources', 1,
    'Strategic / organizational planning', 3,
    'Product/services proof of concept /market share / competitor positioning', 2,
    'Human capital management – hiring/retention/training', 2,
    'Technology (CRM, MIS, telecommunications, etc)', 2,
    'Legal / regulatory', 3,
    'Operations/ production / facilities and infrastructure', 2,
    'Management training', 4,
    'Other', 5
  ),
  ARRAY['Interest income/shared revenues and principal repayment', 'Other types of self-liquidating repayment structures', 'Financial investor take-out'], -- investment_monetization
  '0',                                                           -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 2,
    'Fundraising with access to warehousing capital', 3,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 2,
    'Fund economics', 2,
    'Fund structuring', 3,
    'Investment process (eg origination, due diligence, structuring, closing)', 3,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 2,
    'Fund staff/Human capital management and development', 1,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
    'Exit/monetization opportunities', 1,
    'Legal/regulatory support', 3,
    'Application of impact metrics', 1,
    'Other', 5
  ),
  'Somewhat negative impact',                                    -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - high impact',
    'Ability to pay staff salaries', 'To date - high impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact',
    'Ability to pay existing business loans', 'To date - high impact',
    'Access to supply inputs / raw materials', 'To date - high impact',
    'Ability to pay for raw inputs / raw materials', 'To date - high impact',
    'Need to pivot business model', 'To date - high impact'
  ),
  ARRAY['No'],                                                   -- covid_government_support
  ARRAY['Growth capital for existing portfolio to increase market share', 'New pipeline investments through existing vehicle', 'Technical assistance to support portfolio enterprises'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)', 'Increase use of technology in order to lower fund operational costs', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'], -- fund_vehicle_considerations
  '1',                                                           -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 2,
    'LP Profiles', 1,
    'Market Data', 3,
    'Purpose Definition', 3,
    'Access to Capital (DfID proposal)', 5
  ),
  'None',                                                        -- new_working_group_suggestions
  jsonb_build_object(                                            -- webinar_content_ranking
    'Gender lens investing (facilitated by Suzanne Biegel)', 'N/A',
    'COVID-19 Response (peer discussion)', 4,
    'Fundraising (presentations from I&P, Capria & DGGF)', 1,
    'Portfolio Support (presentations from 10-Xe and AMI)', 'N/A',
    'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 'N/A',
    'Fundraising 2.0 (peer discussion)', 'N/A',
    'Human Capital (peer discussion)', 'N/A',
    'Co-investing workshop with ADAP (peer discussion)', 'N/A',
    'Fundraising 3.0 – local capital (peer discussion)', 'N/A',
    'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 'N/A',
    'Mentoring Pilot Kick-off', 1
  ),
  'Impact measurement; Fund economics for open-end vehicles',    -- new_webinar_suggestions
  'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)', -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 1,
    'Advocacy for early stage investing ', 1,
    'Raised profile/visibility (individual or collective)', 2,
    'Systems change to drive more capital towards local capital providers', 1
  ),
  false,                                                         -- present_connection_session
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
    'Fund Manager Portal (ie library of resources, templates etc)', 2,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 2
  ),
  'Yes, as a mentee',                                            -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  'None',                                                        -- additional_comments
  '2021-02-08 18:14:24'::timestamp,                            -- completed_at
  now(),                                                         -- created_at
  now()                                                          -- updated_at
FROM auth.users u
WHERE u.email = 'klegesi@ortusafrica.com';

COMMIT;