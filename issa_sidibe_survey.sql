BEGIN;

-- Delete any existing 2021 survey response for Issa Sidibe
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'i.sidibe@comoecapital.com');

-- Insert complete 2021 survey response for Issa Sidibe
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
  'Comoé Capital',                                               -- firm_name
  'Issa SIDIBE',                                                -- participant_name
  'CEO & Cofounder',                                            -- role_title
  ARRAY['Africa - West Africa'],                                 -- team_based
  ARRAY['Africa - West Africa'],                                 -- geographic_focus
  'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics', -- fund_stage
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
  ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)'], -- business_model_targeted
  ARRAY['Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['Fund partners', 'Local pension funds', 'Development Finance Institutions (DFIs)', 'Bilateral agencies', 'Impact investing family offices', 'Donors/philanthropy', 'Corporates'], -- target_capital_sources
  'Targeted',                                                   -- target_irr_achieved
  'Targeted',                                                   -- target_irr_targeted
  'Balanced impact/financial return, Impact investing (positive screening)', -- impact_vs_financial_orientation
  ARRAY['N/A'],                                                -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'First',                                                      -- top_sdg_1
  'Second',                                                     -- top_sdg_2
  'Third',                                                      -- top_sdg_3
  ARRAY['Investment Consideration']::text[],                    -- gender_considerations_investment
  ARRAY['Provide specific reporting on gender related indicators for your investors/funders']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Common equity', 'Preferred equity (e.g. certain rights above those available to common equity holders)', 'Mezzanine debt', 'Shared revenue/earnings instruments'], -- investment_forms
  ARRAY['Sector agnostic'],                                     -- target_sectors
  '2-3',                                                        -- carried_interest_principals
  '6-10',                                                       -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 3,
    'Fundraising including access to working capital resources', 2,
    'Strategic / organizational planning', 4,
    'Product/services proof of concept /market share / competitor positioning', 5,
    'Human capital management – hiring/retention/training', 1,
    'Technology (CRM, MIS, telecommunications, etc)', 5,
    'Legal / regulatory', 5,
    'Operations/ production / facilities and infrastructure', 3,
    'Management training', 3,
    'Other', 5
  ),
  ARRAY['Dividends', 'Management buyout'],                      -- investment_monetization
  '1-4',                                                        -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 1,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 2,
    'Fund economics', 5,
    'Fund structuring', 5,
    'Investment process (eg origination, due diligence, structuring, closing)', 5,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 4,
    'Fund staff/Human capital management and development', 5,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
    'Exit/monetization opportunities', 5,
    'Legal/regulatory support', 4,
    'Application of impact metrics', 4,
    'Other', 4
  ),
  'Somewhat positive impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'Anticipate future impact',
    'Ability to pay staff salaries', 'Anticipate future impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'Anticipate future impact',
    'Ability to pay existing business loans', 'Anticipate future impact',
    'Access to supply inputs / raw materials', 'Anticipate future impact',
    'Ability to pay for raw inputs / raw materials', 'Anticipate future impact',
    'Need to pivot business model', 'To date - slight impact'
  ),
  ARRAY['Yes, grant funding (financial)'],                      -- covid_government_support
  ARRAY['Growth capital for existing portfolio to increase market share', 'Growth capital for existing portfolio to enter new markets/expand business line(s)', 'New pipeline investments through existing vehicle'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'], -- fund_vehicle_considerations
  '2',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 1,
    'LP Profiles', 1,
    'Market Data', 1,
    'Purpose Definition', 2,
    'Access to Capital (DfID proposal)', 2
  ),
  'Presence of more LPs to help them to learn about our model (et less financial return)', -- new_working_group_suggestions
  jsonb_build_object(                                            -- webinar_content_ranking
    'Gender lens investing (facilitated by Suzanne Biegel)', 3,
    'COVID-19 Response (peer discussion)', 2,
    'Fundraising (presentations from I&P, Capria & DGGF)', 1,
    'Portfolio Support (presentations from 10-Xe and AMI)', 1,
    'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 2,
    'Fundraising 2.0 (peer discussion)', 1,
    'Human Capital (peer discussion)', 1,
    'Co-investing workshop with ADAP (peer discussion)', 2,
    'Fundraising 3.0 – local capital (peer discussion)', 1,
    'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 3,
    'Mentoring Pilot Kick-off', 3
  ),
  'No',                                                         -- new_webinar_suggestions
  'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)', -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 1,
    'Advocacy for early stage investing ', 2,
    'Raised profile/visibility (individual or collective)', 3,
    'Systems change to drive more capital towards local capital providers', 2
  ),
  true,                                                         -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 3,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 1,
    'Mentoring program (expert led)', 2,
    'Mentoring program (peer-led)', 2,
    'Webinars with peer-to-peer feedback sessions', 2,
    'Webinars with expert-led feedback sessions', 2,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 1,
    'Fund Manager Portal (ie library of resources, templates etc)', 1,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 1
  ),
  'Yes but just as attendee. I don\''t know how it works',       -- participate_mentoring_program
  ARRAY['Yes, open ended vehicles', 'Yes, early stage debt vehicles']::text[], -- present_demystifying_session
  '',                                                           -- additional_comments
  '2021-02-15 11:47:32'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'i.sidibe@comoecapital.com';

COMMIT;
