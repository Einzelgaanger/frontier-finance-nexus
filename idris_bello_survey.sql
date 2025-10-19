BEGIN;

-- Delete any existing 2021 survey response for Idris Ayodeji Bello
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'idris.bello@loftyincltd.biz');

-- Insert complete 2021 survey response for Idris Ayodeji Bello
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
  'LoftyInc Capital Management',                                -- firm_name
  'Idris Ayodeji Bello',                                        -- participant_name
  'Partner',                                                    -- role_title
  ARRAY['Africa - West Africa', 'Africa - North Africa'],       -- team_based
  ARRAY['Africa - West Africa', 'Africa - North Africa', 'Africa Diaspora'], -- geographic_focus
  'Third or later fund/vehicle',                                -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  'First investment',                                           -- first_close_date
  '1st close (or equivalent)',                                  -- first_investment_date
  'As of March 2020',                                           -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  '',                                                           -- optional_supplement
  ARRAY['Closed-end fund'],                                     -- investment_vehicle_type
  'Target',                                                     -- current_fund_size
  'Target',                                                     -- target_fund_size
  '6-7 years',                                                  -- investment_timeframe
  ARRAY['High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)'], -- business_stage_targeted
  ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance', 'Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)', 'Major capital investments (facilities, production equipment, fleet/logistics, etc.)'], -- financing_needs
  ARRAY['Fund partners', 'High Net Worth Individuals (HNWIs)', 'Angel network', 'Impact investing family offices', 'Corporates'], -- target_capital_sources
  'Targeted',                                                   -- target_irr_achieved
  'Achieved in most recent reporting period',                   -- target_irr_targeted
  'Financial return first, Balanced impact/financial return',   -- impact_vs_financial_orientation
  ARRAY['Youth', 'Job creation'],                               -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'Second',                                                     -- top_sdg_1
  'Third',                                                      -- top_sdg_2
  'First',                                                      -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Requirement', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration']::text[], -- gender_considerations_investment
  ARRAY['Women ownership/participation interest is ≥ 50%', 'Require specific reporting on gender related indicators by your investees/borrowers']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes', 'SAFEs'], -- investment_forms
  ARRAY['Agriculture / Food supply chain', 'Education', 'Energy / Renewables / Green Mobility', 'Financial Inclusion / Insurance / Fintech', 'Healthcare', 'Technology / ICT / Telecommunications'], -- target_sectors
  '2-3',                                                        -- carried_interest_principals
  '3-5',                                                        -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 2,
    'Fundraising including access to working capital resources', 5,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 3,
    'Human capital management – hiring/retention/training', 3,
    'Technology (CRM, MIS, telecommunications, etc)', 1,
    'Legal / regulatory', 2,
    'Operations/ production / facilities and infrastructure', 2,
    'Management training', 2,
    'Other', 4
  ),
  ARRAY['Financial investor take-out'],                         -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 4,
    'Fundraising with access to grant capital for vehicle OPEX', 5,
    'Fundraising with access to TA support', 1,
    'Fund economics', 2,
    'Fund structuring', 3,
    'Investment process (eg origination, due diligence, structuring, closing)', 3,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
    'Fund staff/Human capital management and development', 3,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 1,
    'Exit/monetization opportunities', 3,
    'Legal/regulatory support', 4,
    'Application of impact metrics', 3,
    'Other', 4
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - high impact',
    'Customer demand', 'To date - high impact',
    'Ability to pay staff salaries', 'To date - high impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact',
    'Ability to pay existing business loans', 'To date - high impact',
    'Access to supply inputs / raw materials', 'To date - high impact',
    'Ability to pay for raw inputs / raw materials', 'To date - high impact',
    'Need to pivot business model', 'To date - high impact'
  ),
  ARRAY['Yes, non-financial assistance'],                       -- covid_government_support
  ARRAY['New pipeline investments through existing vehicle', 'New pipeline investments through new vehicle', 'Technical assistance to support portfolio enterprises'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase use of technology in order to lower fund operational costs', 'Increase use of data and technology to facilitate investment decisions', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'], -- fund_vehicle_considerations
  '3',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 3,
    'LP Profiles', 3,
    'Market Data', 3,
    'Purpose Definition', 3,
    'Access to Capital (DfID proposal)', 3
  ),
  'No comment',                                                 -- new_working_group_suggestions
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
  'Co Investing',                                               -- new_webinar_suggestions
  'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)', -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 1,
    'Advocacy for early stage investing ', 2,
    'Raised profile/visibility (individual or collective)', 3,
    'Systems change to drive more capital towards local capital providers', 2
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 2,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 2,
    'Mentoring program (expert led)', 2,
    'Mentoring program (peer-led)', 3,
    'Webinars with peer-to-peer feedback sessions', 3,
    'Webinars with expert-led feedback sessions', 1,
    'Fundraising Readiness Advisory Program for fund managers', 2,
    'Investment readiness for portfolio companies', 3,
    'Fund Manager Portal (ie library of resources, templates etc)', 3,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
    'Joint back office between actively investing fund managers', 2
  ),
  'Not sure',                                                   -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  '',                                                           -- additional_comments
  '2021-02-12 00:09:15'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'idris.bello@loftyincltd.biz';

COMMIT;
