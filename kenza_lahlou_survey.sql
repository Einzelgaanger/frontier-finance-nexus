BEGIN;

-- Delete any existing 2021 survey response for Kenza Lahlou
DELETE FROM public.survey_responses_2021 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'kenza@outlierz.co');

-- Insert complete 2021 survey response for Kenza Lahlou
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
  'Outlierz Ventures',                                           -- firm_name
  'Kenza Lahlou',                                                -- participant_name
  'General Partner',                                             -- role_title
  ARRAY['Africa - North Africa'],                                -- team_based
  ARRAY['Africa - West Africa', 'Africa - East Africa', 'Africa - North Africa'], -- geographic_focus
  'We raised and closed our first fund as a small pilot fund to make 10 investments with very strong performance to date', -- fund_stage
  'First investment',                                            -- legal_entity_date
  'Legal entity, 1st close (or equivalent)',                    -- first_close_date
  'As of March 2020',                                            -- first_investment_date
  'As of March 2020',                                            -- investments_march_2020
  'As of December 2020',                                         -- investments_december_2020
  'We warehoused the first deals, that''s why the date of our first investment came few monthly earlier than our fund entity formation and first close', -- optional_supplement
  ARRAY['Closed-end fund'],                                      -- investment_vehicle_type
  'Current',                                                     -- current_fund_size
  'Target',                                                      -- target_fund_size
  '1-3 years',                                                   -- investment_timeframe
  ARRAY['High-Growth Ventures (disruptive business models targeting large markets with high growth potential)'], -- business_model_targeted
  ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)'], -- business_stage_targeted
  ARRAY['Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)'], -- financing_needs
  ARRAY['High Net Worth Individuals (HNWIs)', 'Angel network', 'Impact investing family offices'], -- target_capital_sources
  'Targeted',                                                    -- target_irr_achieved
  '',                                                            -- target_irr_targeted
  'Responsible/ESG investing (negative screening)',              -- impact_vs_financial_orientation
  ARRAY['Gender', 'Job creation', 'ESG compliant'],             -- explicit_lens_focus
  false,                                                         -- report_sustainable_development_goals
  '',                                                            -- top_sdg_1
  '',                                                            -- top_sdg_2
  '',                                                            -- top_sdg_3
  ARRAY['Investment Consideration', 'Investment Consideration', 'Investment Consideration']::text[], -- gender_considerations_investment
  ARRAY[]::text[],                                              -- gender_considerations_requirement
  ARRAY[]::text[],                                              -- gender_fund_vehicle
  'Your investment amount',                                      -- investment_size_your_amount
  'Total raise by portfolio company',                            -- investment_size_total_raise
  ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)', 'Convertible notes', 'SAFEs'], -- investment_forms
  ARRAY['Distribution / Logistics', 'Financial Inclusion / Insurance / Fintech', 'Healthcare', 'We are sector agnostic as long as it''s tech-enabled and had primarily invested in these sectors so far'], -- target_sectors
  '2-3',                                                         -- carried_interest_principals
  '< or = 2',                                                    -- current_ftes
  jsonb_build_object(                                            -- portfolio_needs_ranking
    'Finance, budgeting, accounting, cash and tax management', 2,
    'Fundraising including access to working capital resources', 3,
    'Strategic / organizational planning', 1,
    'Product/services proof of concept /market share / competitor positioning', 1,
    'Human capital management – hiring/retention/training', 1,
    'Technology (CRM, MIS, telecommunications, etc)', 3,
    'Legal / regulatory', 2,
    'Operations/ production / facilities and infrastructure', 3,
    'Management training', 3,
    'Other', 5
  ),
  ARRAY['Strategic sale/merger of company', 'Financial investor take-out'], -- investment_monetization
  '1-4',                                                         -- exits_achieved
  jsonb_build_object(                                            -- fund_capabilities_ranking
    'Fundraising with access to global LPs', 1,
    'Fundraising with access to local LPs', 1,
    'Fundraising with access to warehousing capital', 1,
    'Fundraising with access to grant capital for vehicle OPEX', 1,
    'Fundraising with access to TA support', 2,
    'Fund economics', 3,
    'Fund structuring', 2,
    'Investment process (eg origination, due diligence, structuring, closing)', 4,
    'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
    'Fund staff/Human capital management and development', 3,
    'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 2,
    'Exit/monetization opportunities', 2,
    'Legal/regulatory support', 2,
    'Application of impact metrics', 2,
    'Other', 5
  ),
  'Somewhat positive impact',                                    -- covid_impact_aggregate
  jsonb_build_object(                                            -- covid_impact_portfolio
    'Staff attendance', 'To date - slight impact',
    'Customer demand', 'To date - high impact',
    'Ability to pay staff salaries', 'To date - no impact',
    'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - no impact',
    'Ability to pay existing business loans', 'To date - no impact',
    'Access to supply inputs / raw materials', 'To date - no impact',
    'Ability to pay for raw inputs / raw materials', 'To date - no impact',
    'Need to pivot business model', 'To date - slight impact'
  ),
  ARRAY['No'],                                                   -- covid_government_support
  ARRAY['New pipeline investments through new vehicle', 'Fund II'], -- raising_capital_2021
  ARRAY['Seek increased access to new LP funds locally', 'Seek increased access to new LP funds internationally', 'Increase use of data and technology to facilitate investment decisions', 'Build new partnerships for joint co-investment opportunities, expand pipeline opportunities', 'Explore a new juridiction for our Fund II in Europe to be compliant with DFIs (Fund I was in Delaware)'], -- fund_vehicle_considerations
  '1',                                                           -- network_value_rating
  jsonb_build_object(                                            -- working_groups_ranking
    'Fund Economics', 'N/A',
    'LP Profiles', 'N/A',
    'Market Data', 'N/A',
    'Purpose Definition', 'N/A',
    'Access to Capital (DfID proposal)', 'N/A'
  ),
  'I haven''t participated to any group for the moment but have attended some very interesting talks with LPs, I have participated as a speaker in a talk as well and most importantly, I have recently been match with a great mentor with which there is a great fit (Tom Sperry). Thank you for this, very helpful!', -- new_working_group_suggestions
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
    'Mentoring Pilot Kick-off', 1
  ),
  'Portfolio construction is a great topic. Also Inv process, deal analysis and Due diligence best practice would be great.', -- new_webinar_suggestions
  'WhatsApp only',                                               -- communication_platform
  jsonb_build_object(                                            -- network_value_areas
    'Peer connections and peer learning', 'N/A',
    'Advocacy for early stage investing ', 'N/A',
    'Raised profile/visibility (individual or collective)', 'N/A',
    'Systems change to drive more capital towards local capital providers', 'N/A'
  ),
  true,                                                          -- present_connection_session
  jsonb_build_object(                                            -- convening_initiatives_ranking
    'Warehousing/seed funding for fund managers to build track record', 1,
    'TA facility to support early fund economics and activities', 2,
    'Advocacy for the early-stage investing ecosystem', 2,
    'Mentoring program (expert led)', 1,
    'Mentoring program (peer-led)', 1,
    'Webinars with peer-to-peer feedback sessions', 2,
    'Webinars with expert-led feedback sessions', 2,
    'Fundraising Readiness Advisory Program for fund managers', 1,
    'Investment readiness for portfolio companies', 1,
    'Fund Manager Portal (ie library of resources, templates etc)', 2,
    'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
    'Joint back office between actively investing fund managers', 3
  ),
  'Yes, as a mentee',                                            -- participate_mentoring_program
  ARRAY['No']::text[],                                          -- present_demystifying_session
  'That was a long survey :) Thank you and great job!',         -- additional_comments
  '2021-02-09 12:19:07'::timestamp,                            -- completed_at
  now(),                                                         -- created_at
  now()                                                          -- updated_at
FROM auth.users u
WHERE u.email = 'kenza@outlierz.co';

COMMIT;