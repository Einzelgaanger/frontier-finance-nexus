BEGIN;

-- Delete any existing 2021 survey response for Samuel Yeboah
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'sam@mirepacapital.com');

-- Insert complete 2021 survey response for Samuel Yeboah
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
  'Mirepa Capital Ltd',                                         -- firm_name
  'Samuel Yeboah',                                              -- participant_name
  'Founder/Executive Director',                                 -- role_title
  ARRAY['Africa - West Africa'],                                -- team_based
  ARRAY['Africa - West Africa'],                                -- geographic_focus
  'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)', -- fund_stage
  'Legal entity',                                               -- legal_entity_date
  'First investment',                                           -- first_close_date
  'As of December 2020',                                        -- first_investment_date
  'As of December 2020',                                        -- investments_march_2020
  'As of December 2020',                                        -- investments_december_2020
  'Making investments on a deal by deal basis until the fund is closed. Using an unregulated vehicle to make partial investments towards commitment to investee companies so they are able to execute on their plans for the year. Looking to raise additional capital to meet full commitments', -- optional_supplement
  ARRAY['Closed-end fund', 'Open-ended vehicle / Limited liability company or equivalent'], -- investment_vehicle_type
  'Current',                                                    -- current_fund_size
  'Target',                                                     -- target_fund_size
  '4-5 years',                                                  -- investment_timeframe
  ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)', 'Niche Ventures (innovative products/services targeting niche markets with growth ambitions)', 'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)', 'Growth (established business in need of funds for expansion, assets, working capital etc)'], -- business_stage_targeted
  ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)', 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)', 'Inventory and working capital requirements'], -- financing_needs
  ARRAY['Fund partners', 'Local pension funds', 'High Net Worth Individuals (HNWIs)', 'Impact investing family offices', 'Donors/philanthropy', 'Corporates'], -- target_capital_sources
  'Targeted',                                                   -- target_irr_achieved
  'Targeted',                                                   -- target_irr_targeted
  'Balanced impact/financial return',                           -- impact_vs_financial_orientation
  ARRAY['Gender', 'Job creation', 'Climate / green ventures'],  -- explicit_lens_focus
  true,                                                         -- report_sustainable_development_goals
  'Others',                                                     -- top_sdg_1
  'Others',                                                     -- top_sdg_2
  'Others',                                                     -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Requirement', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', 'Investment Consideration', '>=40% representation on board and investment committee as well as staffing']::text[], -- gender_considerations_investment
  ARRAY[]::text[],                                              -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                     -- investment_size_your_amount
  'Total raise by portfolio company',                           -- investment_size_total_raise
  ARRAY['Common equity', 'Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes', 'Mezzanine debt', 'Shared revenue/earnings instruments'], -- investment_forms
  ARRAY['Agriculture / Food supply chain', 'Education', 'Energy / Renewables / Green Mobility', 'Financial Inclusion / Insurance / Fintech', 'Healthcare', 'Manufacturing'], -- target_sectors
  '2-3',                                                        -- carried_interest_principals
  '3-5',                                                        -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 1,
    'Fundraising including access to working capital resources', 2,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 2,
    'Human capital management – hiring/retention/training', 2,
    'Technology (CRM, MIS, telecommunications, etc)', 3,
    'Legal / regulatory', 1,
    'Operations/ production / facilities and infrastructure', 2,
    'Management training', 1,
    'Other', 1
  ),
  ARRAY['Interest income/shared revenues and principal repayment', 'Other types of self-liquidating repayment structures', 'Dividends', 'Management buyout'], -- investment_monetization
  '0',                                                          -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 1,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 2,
    'Fund economics', 3,
    'Fund structuring', 4,
    'Investment process (eg origination, due diligence, structuring, closing)', 5,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
    'Fund staff/Human capital management and development', 5,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 4,
    'Exit/monetization opportunities', 4,
    'Legal/regulatory support', 4,
    'Application of impact metrics', 3,
    'Other', 5
  ),
  'Somewhat negative impact',                                   -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - no impact',
    'Customer demand', 'To date - slight impact',
    'Ability to pay staff salaries', 'To date - slight impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'Anticipate future impact',
    'Ability to pay existing business loans', 'Anticipate no future impact',
    'Access to supply inputs / raw materials', 'Anticipate future impact',
    'Ability to pay for raw inputs / raw materials', 'Anticipate future impact',
    'Need to pivot business model', 'Anticipate no future impact'
  ),
  ARRAY['No'],                                                  -- covid_government_support
  ARRAY['Growth capital for existing portfolio to increase market share', 'Growth capital for existing portfolio to enter new markets/expand business line(s)', 'New pipeline investments through existing vehicle', 'New pipeline investments through new vehicle', 'Technical assistance to support portfolio enterprises'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)', 'Increase use of technology in order to lower fund operational costs', 'Increase use of data and technology to facilitate investment decisions'], -- fund_vehicle_considerations
  '3',                                                          -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 5,
    'LP Profiles', 5,
    'Market Data', 3,
    'Purpose Definition', 3,
    'Access to Capital (DfID proposal)', 3
  ),
  'Catalyzing and providing bridge capital for members',        -- new_working_group_suggestions
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
    'Mentoring Pilot Kick-off', 5
  ),
  'Peer-led panel discussions talking about real issues that members are facing and how they have dealt with them or are dealing with them', -- new_webinar_suggestions
  'Slack only',                                                 -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 2,
    'Advocacy for early stage investing ', 2,
    'Raised profile/visibility (individual or collective)', 4,
    'Systems change to drive more capital towards local capital providers', 4
  ),
  true,                                                         -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 1,
    'TA facility to support early fund economics and activities', 1,
    'Advocacy for the early-stage investing ecosystem', 2,
    'Mentoring program (expert led)', 2,
    'Mentoring program (peer-led)', 3,
    'Webinars with peer-to-peer feedback sessions', 2,
    'Webinars with expert-led feedback sessions', 1,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 3,
    'Fund Manager Portal (ie library of resources, templates etc)', 2,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
    'Joint back office between actively investing fund managers', 1
  ),
  'Yes, as a mentor, Yes, as a mentee, Only if the mentor can bring relevant support at this stage in our business', -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  '',                                                           -- additional_comments
  '2021-02-11 14:23:15'::timestamp,                            -- completed_at
  now(),                                                        -- created_at
  now()                                                         -- updated_at
FROM auth.users u
WHERE u.email = 'sam@mirepacapital.com';

COMMIT;
