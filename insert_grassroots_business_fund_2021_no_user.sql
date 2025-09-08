BEGIN;

-- Insert 2021 survey response for Grassroots Business Fund without user association
-- This version works even if the user doesn't exist in auth.users

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
) VALUES (
  NULL,                                                          -- user_id (no user association)
  'Grassroots Business Fund',                                    -- firm_name
  'Lilian Mramba',                                               -- participant_name
  'Africa Regional Director',                                    -- role_title
  ARRAY['Africa - East Africa'],                                 -- team_based
  ARRAY['Africa - East Africa'],                                 -- geographic_focus
  'Second fund/vehicle',                                         -- fund_stage
  'Legal entity, 1st close (or equivalent), First investment',  -- legal_entity_date
  'Legal entity, 1st close (or equivalent), First investment',  -- first_close_date
  'Legal entity, 1st close (or equivalent), First investment',  -- first_investment_date
  'As of March 2020',                                           -- investments_march_2020
  'As of December 2020',                                         -- investments_december_2020
  '',                                                            -- optional_supplement
  ARRAY['Closed-end fund', 'Second vehicle will be open-ended'], -- investment_vehicle_type
  'Current',                                                     -- current_fund_size
  'Target',                                                      -- target_fund_size
  '6-7 years',                                                   -- investment_timeframe
  ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)'], -- business_model_targeted
  ARRAY['Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['High Net Worth Individuals (HNWIs)', 'Development Finance Institutions (DFIs)', 'Impact investing family offices'], -- target_capital_sources
  'Targeted',                                                    -- target_irr_achieved
  'Targeted',                                                    -- target_irr_targeted
  'Balanced impact/financial return',                           -- impact_vs_financial_orientation
  ARRAY['Gender', 'Climate / green ventures'],                  -- explicit_lens_focus
  true,                                                          -- report_sustainable_development_goals
  'First',                                                       -- top_sdg_1
  'Second',                                                      -- top_sdg_2
  'Third',                                                       -- top_sdg_3
  ARRAY['Investment Consideration']::text[],                     -- gender_considerations_investment
  ARRAY['Women ownership/participation interest is ≥ 50%', 'Female staffing is ≥ 50%', 'Provide specific reporting on gender related indicators for your investors/funders', 'Require specific reporting on gender related indicators by your investees/borrowers']::text[], -- gender_considerations_requirement
  ARRAY['Your investment amount', 'Total raise by portfolio company']::text[], -- gender_fund_vehicle
  'Your investment amount',                                      -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Mezzanine debt'],                                       -- investment_forms
  ARRAY['Agriculture / Food supply chain'],                     -- target_sectors
  '0',                                                           -- carried_interest_principals
  '6-10',                                                        -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 1,
    'Fundraising including access to working capital resources', 3,
    'Strategic / organizational planning', 2,
    'Product/services proof of concept /market share / competitor positioning', 5,
    'Human capital management – hiring/retention/training', 3,
    'Technology (CRM, MIS, telecommunications, etc)', 5,
    'Legal / regulatory', 5,
    'Operations/ production / facilities and infrastructure', 5,
    'Management training', 4,
    'Other', 2
  ),
  ARRAY['Other types of self-liquidating repayment structures'], -- investment_monetization
  '10-14',                                                       -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 2,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 3,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 5,
    'Fund economics', 2,
    'Fund structuring', 3,
    'Investment process (eg origination, due diligence, structuring, closing)', 5,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 5,
    'Fund staff/Human capital management and development', 5,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 5,
    'Exit/monetization opportunities', 2,
    'Legal/regulatory support', 3,
    'Application of impact metrics', 5,
    'Other', 5
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - slight impact',
    'Ability to pay staff salaries', 'To date - slight impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact',
    'Ability to pay existing business loans', 'To date - high impact',
    'Access to supply inputs / raw materials', 'To date - slight impact',
    'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
    'Need to pivot business model', 'To date - slight impact'
  ),
  ARRAY['Yes, government support (financial)'],                 -- covid_government_support
  ARRAY['New pipeline investments through new vehicle'],        -- raising_capital_2021
  ARRAY['We are exiting current fund'],                         -- fund_vehicle_considerations
  '3',                                                           -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 'N/A',
    'LP Profiles', 'N/A',
    'Market Data', 'N/A',
    'Purpose Definition', 'N/A',
    'Access to Capital (DfID proposal)', 'N/A'
  ),
  '',                                                            -- new_working_group_suggestions
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
  'I''d love to see something that talks about the climate + gender nexus and how to operationalize it in funds', -- new_webinar_suggestions
  'WhatsApp only',                                               -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 1,
    'Advocacy for early stage investing ', 'N/A',
    'Raised profile/visibility (individual or collective)', 'N/A',
    'Systems change to drive more capital towards local capital providers', 3
  ),
  false,                                                         -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 3,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 2,
    'Mentoring program (expert led)', 2,
    'Mentoring program (peer-led)', 2,
    'Webinars with peer-to-peer feedback sessions', 3,
    'Webinars with expert-led feedback sessions', 2,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 3,
    'Fund Manager Portal (ie library of resources, templates etc)', 3,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 3,
    'Other', 3
  ),
  'No',                                                          -- participate_mentoring_program
  ARRAY[]::text[],                                               -- present_demystifying_session
  'I am happy to speak if you are looking for speakers',         -- additional_comments
  '2021-02-08 17:23:33'::timestamp,                            -- completed_at
  now(),                                                         -- created_at
  now()                                                          -- updated_at
);

COMMIT;
