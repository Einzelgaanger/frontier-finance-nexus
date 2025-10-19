BEGIN;

-- Delete any existing 2021 survey response for Victoria Fabunmi
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'victoria@gc.fund');

-- Insert complete 2021 survey response for Victoria Fabunmi
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
  'CcHUB Growth Capital Limited',                                -- firm_name
  'Victoria Fabunmi',                                            -- participant_name
  'Head, Investments',                                           -- role_title
  ARRAY['Africa - West Africa', 'Africa - East Africa'],         -- team_based
  ARRAY['Africa - West Africa', 'Africa - East Africa', 'Africa - Central Africa', 'Africa - Southern Africa', 'Africa - North Africa'], -- geographic_focus
  'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics), Closed ended - fundraising', -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  'First investment',                                           -- first_close_date
  'First investment',                                           -- first_investment_date
  'As of March 2020',                                          -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  '',                                                           -- optional_supplement
  ARRAY['Open-ended vehicle / Limited liability company or equivalent'], -- investment_vehicle_type
  'Current',                                                    -- current_fund_size
  'Target',                                                     -- target_fund_size
  '4-5 years',                                                  -- investment_timeframe
  ARRAY['High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)', 'Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)'], -- financing_needs
  ARRAY['Fund partners', 'Local pension funds', 'Development Finance Institutions (DFIs)', 'Bilateral agencies'], -- target_capital_sources
  'Targeted',                                                   -- target_irr_achieved
  'Achieved in most recent reporting period',                   -- target_irr_targeted
  'Balanced impact/financial return',                           -- impact_vs_financial_orientation
  ARRAY['Gender', 'Youth'],                                     -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'Others',                                                     -- top_sdg_1
  'First',                                                      -- top_sdg_2
  'Third',                                                      -- top_sdg_3
  ARRAY['Investment Consideration']::text[],                    -- gender_considerations_investment
  ARRAY['Female staffing is ≥ 50%']::text[],                    -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes', 'SAFEs'], -- investment_forms
  ARRAY['Sector agnostic', 'Financial Inclusion / Insurance / Fintech', 'Technology / ICT / Telecommunications'], -- target_sectors
  '2-3',                                                        -- carried_interest_principals
  '3-5',                                                        -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 3,
    'Fundraising including access to working capital resources', 2,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 2,
    'Human capital management – hiring/retention/training', 1,
    'Technology (CRM, MIS, telecommunications, etc)', 3,
    'Legal / regulatory', 4,
    'Operations/ production / facilities and infrastructure', 2,
    'Management training', 3,
    'Other', 5
  ),
  ARRAY['Strategic sale/merger of company', 'Financial investor take-out'], -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 3,
    'Fundraising with access to warehousing capital', 2,
    'Fundraising with access to grant capital for vehicle OPEX', 3,
    'Fundraising with access to TA support', 3,
    'Fund economics', 3,
    'Fund structuring', 1,
    'Investment process (eg origination, due diligence, structuring, closing)', 4,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
    'Fund staff/Human capital management and development', 2,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
    'Exit/monetization opportunities', 2,
    'Legal/regulatory support', 4,
    'Application of impact metrics', 3,
    'Other', 5
  ),
  'Significant positive impact',                                -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - slight impact',
    'Ability to pay staff salaries', 'To date - slight impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact',
    'Ability to pay existing business loans', 'To date - slight impact',
    'Access to supply inputs / raw materials', 'To date - high impact',
    'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
    'Need to pivot business model', 'To date - high impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['Growth capital for existing portfolio to increase market share', 'Growth capital for existing portfolio to enter new markets/expand business line(s)', 'New pipeline investments through existing vehicle', 'New pipeline investments through new vehicle'], -- raising_capital_2021
  ARRAY['No change planned'],                                   -- fund_vehicle_considerations
  '2',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 2,
    'LP Profiles', 1,
    'Market Data', 2,
    'Purpose Definition', 2,
    'Access to Capital (DfID proposal)', 2
  ),
  'Not at the moment',                                          -- new_working_group_suggestions
  jsonb_build_object(                                            -- webinar_content_ranking
    'Gender lens investing (facilitated by Suzanne Biegel)', 2,
    'COVID-19 Response (peer discussion)', 2,
    'Fundraising (presentations from I&P, Capria & DGGF)', 2,
    'Portfolio Support (presentations from 10-Xe and AMI)', 2,
    'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 2,
    'Fundraising 2.0 (peer discussion)', 2,
    'Human Capital (peer discussion)', 2,
    'Co-investing workshop with ADAP (peer discussion)', 2,
    'Fundraising 3.0 – local capital (peer discussion)', 2,
    'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 2,
    'Mentoring Pilot Kick-off', 2
  ),
  'I have some thoughts I\'d share at the sessions',            -- new_webinar_suggestions
  'Slack only',                                                 -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 1,
    'Advocacy for early stage investing ', 1,
    'Raised profile/visibility (individual or collective)', 4,
    'Systems change to drive more capital towards local capital providers', 4
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 2,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 1,
    'Mentoring program (expert led)', 1,
    'Mentoring program (peer-led)', 1,
    'Webinars with peer-to-peer feedback sessions', 1,
    'Webinars with expert-led feedback sessions', 1,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 1,
    'Fund Manager Portal (ie library of resources, templates etc)', 2,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 2
  ),
  'Not sure',                                                   -- participate_mentoring_program
  ARRAY['What does presenting entail?']::text[],                -- present_demystifying_session
  'Well done to the CFF team for the amazing work you do. We are most grateful. Warm regards', -- additional_comments
  '2021-02-17 10:05:31'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'victoria@gc.fund';

COMMIT;
