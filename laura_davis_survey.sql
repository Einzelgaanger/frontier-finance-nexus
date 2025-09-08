BEGIN;

-- Delete any existing 2021 survey response for Laura Davis
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ldavis@renewstrategies.com');

-- Insert complete 2021 survey response for Laura Davis
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
  'RENEW',                                                       -- firm_name
  'Laura Davis',                                                 -- participant_name
  'managing partner',                                            -- role_title
  ARRAY['US/Europe', 'Africa - East Africa'],                    -- team_based
  ARRAY['Africa - East Africa'],                                 -- geographic_focus
  'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics), also, we have the IAN on an ongoing basis on a deal by deal basis.', -- fund_stage
  'Legal entity, 1st close (or equivalent)',                    -- legal_entity_date
  'First investment',                                            -- first_close_date
  'As of December 2020',                                         -- first_investment_date
  '',                                                            -- investments_march_2020
  'As of December 2020',                                         -- investments_december_2020
  '',                                                            -- optional_supplement
  ARRAY['Open-ended vehicle / Limited liability company or equivalent', 'Angel network'], -- investment_vehicle_type
  'Current',                                                     -- current_fund_size
  'Target',                                                      -- target_fund_size
  '4-5 years',                                                   -- investment_timeframe
  ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)', 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)', 'Real assets / infrastructure'], -- business_model_targeted
  ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)', 'Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['High Net Worth Individuals (HNWIs)', 'Development Finance Institutions (DFIs)', 'Impact investing family offices', 'Donors/philanthropy'], -- target_capital_sources
  'Targeted',                                                    -- target_irr_achieved
  '',                                                            -- target_irr_targeted
  'Financial return first',                                      -- impact_vs_financial_orientation
  ARRAY['Gender', 'Job creation'],                              -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'First',                                                      -- top_sdg_1
  'First',                                                      -- top_sdg_2
  '',                                                           -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration']::text[], -- gender_considerations_investment
  ARRAY['Provide specific reporting on gender related indicators for your investors/funders', 'Require specific reporting on gender related indicators by your investees/borrowers']::text[], -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                      -- investment_size_your_amount
  'Total raise by portfolio company',                            -- investment_size_total_raise
  ARRAY['Common equity', 'Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes'], -- investment_forms
  ARRAY['Sector agnostic'],                                     -- target_sectors
  '5+',                                                         -- carried_interest_principals
  '10+',                                                        -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 1,
    'Fundraising including access to working capital resources', 4,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 3,
    'Human capital management – hiring/retention/training', 2,
    'Technology (CRM, MIS, telecommunications, etc)', 4,
    'Legal / regulatory', 3,
    'Operations/ production / facilities and infrastructure', 3,
    'Management training', 1,
    'Other', 4
  ),
  ARRAY['Dividends', 'Management buyout'],                      -- investment_monetization
  'Angel network has achieved exits, Holding company is just getting started.', -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 5,
    'Fundraising with access to warehousing capital', 3,
    'Fundraising with access to grant capital for vehicle OPEX', 4,
    'Fundraising with access to TA support', 1,
    'Fund economics', 4,
    'Fund structuring', 4,
    'Investment process (eg origination, due diligence, structuring, closing)', 4,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 4,
    'Fund staff/Human capital management and development', 4,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 2,
    'Exit/monetization opportunities', 3,
    'Legal/regulatory support', 4,
    'Application of impact metrics', 4,
    'Other', 4
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - slight impact',
    'Ability to pay staff salaries', 'To date - slight impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
    'Ability to pay existing business loans', 'To date - slight impact',
    'Access to supply inputs / raw materials', 'To date - slight impact',
    'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
    'Need to pivot business model', 'To date - slight impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['Growth capital for existing portfolio to enter new markets/expand business line(s)', 'New pipeline investments through existing vehicle'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds internationally'], -- fund_vehicle_considerations
  '2',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 'N/A',
    'LP Profiles', 'N/A',
    'Market Data', 'N/A',
    'Purpose Definition', 'N/A',
    'Access to Capital (DfID proposal)', 'N/A'
  ),
  'mainly our capacity that limits our participation. Have some new team members, so perhaps should look at who can engage more fully this next year.', -- new_working_group_suggestions
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
    'Mentoring Pilot Kick-off', 3
  ),
  'not at the moment.',                                         -- new_webinar_suggestions
  'WhatsApp only',                                              -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 2,
    'Advocacy for early stage investing ', 1,
    'Raised profile/visibility (individual or collective)', 2,
    'Systems change to drive more capital towards local capital providers', 1
  ),
  false,                                                        -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 3,
    'TA facility to support early fund economics and activities', 2,
    'Advocacy for the early-stage investing ecosystem', 1,
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
  'No, for me right now, it''s just a time issue.',             -- participate_mentoring_program
  ARRAY['Yes, gender lens investing', 'Yes, angel investing / engaging local co-investors, let me know if you are really interested in our sharing, and I can work with Matt.']::text[], -- present_demystifying_session
  'really appreciate all your work, how you add value every time we can engage.', -- additional_comments
  '2021-02-10 08:56:12'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'ldavis@renewstrategies.com';

COMMIT;
