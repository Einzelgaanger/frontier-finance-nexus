BEGIN;

WITH raw_rows AS (
  -- 1) roeland@iungocapital.com
  SELECT
    'roeland@iungocapital.com'::text AS email,
    'iungo capital'::text AS firm_name,
    'Roeland Donckers'::text AS participant_name,
    'managing partner'::text AS role_title,
    ARRAY['Africa - East Africa']::text[] AS team_based,
    ARRAY['Africa - East Africa']::text[] AS geographic_focus,
    'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics'::text AS fund_stage,
    'Legal entity, First investment'::text AS legal_entity_date,
    '1st close (or equivalent)'::text AS first_close_date,
    'As of March 2020'::text AS first_investment_date,
    'As of March 2020'::text AS investments_march_2020,
    'As of December 2020'::text AS investments_december_2020,
    NULL::text AS optional_supplement,
    ARRAY['Open-ended vehicle / Limited liability company or equivalent']::text[] AS investment_vehicle_type,
    'Current'::text AS current_fund_size,
    'Target'::text AS target_fund_size,
    '1-3 years, 4-5 years'::text AS investment_timeframe,
    ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)']::text[] AS business_model_targeted,
    ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)','Growth (established business in need of funds for expansion, assets, working capital etc)']::text[] AS business_stage_targeted,
    ARRAY['Inventory and working capital requirements']::text[] AS financing_needs,
    ARRAY['Development Finance Institutions (DFIs)','Impact investing family offices','Foundations']::text[] AS target_capital_sources,
    ''::text AS target_irr_achieved,
    'Targeted'::text AS target_irr_targeted,
    'Responsible/ESG investing (negative screening), Impact investing (positive screening)'::text AS impact_vs_financial_orientation,
    ARRAY['Gender','Youth','Job creation']::text[] AS explicit_lens_focus,
    false AS report_sustainable_development_goals,
    NULL::text AS top_sdg_1,
    NULL::text AS top_sdg_2,
    NULL::text AS top_sdg_3,
    ARRAY['Investment Consideration','Investment Consideration','Investment Consideration','Investment Consideration','Investment Requirement','Investment Consideration','Investment Consideration','Investment Consideration']::text[] AS gender_considerations_investment,
    ARRAY['Provide specific reporting on gender related indicators for your investors/funders','Require specific reporting on gender related indicators by your investees/borrowers']::text[] AS gender_considerations_requirement,
    ARRAY[]::text[] AS gender_fund_vehicle,
    'Your investment amount, Total raise by portfolio company'::text AS investment_size_your_amount,
    'Your investment amount, Total raise by portfolio company'::text AS investment_size_total_raise,
    ARRAY['Mezzanine debt','Shared revenue/earnings instruments']::text[] AS investment_forms,
    ARRAY['Sector agnostic']::text[] AS target_sectors,
    '2-3'::text AS carried_interest_principals,
    '10+'::text AS current_ftes,
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 1,
      'Fundraising including access to working capital resources', 4,
      'Strategic / organizational planning', 2,
      'Product/services proof of concept /market share / competitor positioning', 5,
      'Human capital management – hiring/retention/training', 3,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 4,
      'Operations/ production / facilities and infrastructure', 2,
      'Management training', 4,
      'Other', 3
    ) AS portfolio_needs_ranking,
    ARRAY['Interest income/shared revenues and principal repayment']::text[] AS investment_monetization,
    '1-4'::text AS exits_achieved,
    jsonb_build_object(
      'Fundraising with access to global LPs', 3,
      'Fundraising with access to local LPs', 5,
      'Fundraising with access to warehousing capital', 5,
      'Fundraising with access to grant capital for vehicle OPEX', 3,
      'Fundraising with access to TA support', 5,
      'Fund economics', 5,
      'Fund structuring', 4,
      'Investment process (eg origination, due diligence, structuring, closing)', 3,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
      'Fund staff/Human capital management and development', 2,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 4,
      'Exit/monetization opportunities', 1,
      'Legal/regulatory support', 5,
      'Application of impact metrics', 5,
      'Other', 2
    ) AS fund_capabilities_ranking,
    'Somewhat negative impact'::text AS covid_impact_aggregate,
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - slight impact',
      'Ability to pay staff salaries', 'To date - slight impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - slight impact',
      'Access to supply inputs / raw materials', 'To date - slight impact',
      'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
      'Need to pivot business model', 'Anticipate no future impact'
    ) AS covid_impact_portfolio,
    ARRAY['concessionary capital']::text[] AS covid_government_support,
    ARRAY['Growth capital for existing portfolio to increase market share','Growth capital for existing portfolio to enter new markets/expand business line(s)','New pipeline investments through existing vehicle']::text[] AS raising_capital_2021,
    ARRAY['Seek increased access to new LP funds internationally','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[] AS fund_vehicle_considerations,
    '3'::text AS network_value_rating,
    jsonb_build_object(
      'Fund Economics', 3,
      'LP Profiles', 3,
      'Market Data', 5,
      'Purpose Definition', 5,
      'Access to Capital (DfID proposal)', 4
    ) AS working_groups_ranking,
    'peer to peer mentoring'::text AS new_working_group_suggestions,
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 3,
      'COVID-19 Response (peer discussion)', 3,
      'Fundraising (presentations from I&P, Capria & DGGF)', 5,
      'Portfolio Support (presentations from 10-Xe and AMI)', 5,
      'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 4,
      'Fundraising 2.0 (peer discussion)', 3,
      'Human Capital (peer discussion)', 3
    ) AS webinar_content_ranking,
    NULL::text AS new_webinar_suggestions,
    'Slack only'::text AS communication_platform,
    jsonb_build_object(
      'Peer connections and peer learning', 3,
      'Advocacy for early stage investing ', 4,
      'Raised profile/visibility (individual or collective)', 4,
      'Systems change to drive more capital towards local capital providers', 'N/A'
    ) AS network_value_areas,
    false AS present_connection_session,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 3,
      'TA facility to support early fund economics and activities', 3,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 2,
      'Mentoring program (peer-led)', 1,
      'Webinars with peer-to-peer feedback sessions', 1,
      'Webinars with expert-led feedback sessions', 2,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 1,
      'Fund Manager Portal (ie library of resources, templates etc)', 2,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2
    ) AS convening_initiatives_ranking,
    'Yes, as a mentor, Yes, as a mentee'::text AS participate_mentoring_program,
    ARRAY['Yes, open ended vehicles','Yes, gender lens investing','Yes, angel investing / engaging local co-investors']::text[] AS present_demystifying_session,
    NULL::text AS additional_comments

  UNION ALL











  -- 2) brendan@sechacapital.com
  SELECT
    'brendan@sechacapital.com',
    'Secha Capital',
    'Brendan Mullen',
    'Managing Director',
    ARRAY['Africa - Central Africa'],
    ARRAY['Africa - Southern Africa'],
    'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics',
    'Legal entity, 1st close (or equivalent), First investment',
    'As of March 2020',
    'As of December 2020',
    'As of March 2020',
    'As of December 2020',
    NULL,
    ARRAY['Closed-end fund'],
    'Current',
    'Target',
    '6-7 years',
    ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)','Niche Ventures (innovative products/services targeting niche markets with growth ambitions)'],
    ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)','Growth (established business in need of funds for expansion, assets, working capital etc)'],
    ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)','Inventory and working capital requirements'],
    ARRAY['Local pension funds','High Net Worth Individuals (HNWIs)','Development Finance Institutions (DFIs)','Impact investing family offices'],
    'Achieved in most recent reporting period',
    'Targeted',
    'Balanced impact/financial return, Impact investing (positive screening), Impact first investing (impact outcomes intentionally)',
    ARRAY['Gender','Job creation'],
    true,
    'Others',
    'Others',
    'Others',
    ARRAY['Second','Others','First','Others','Third','Others','Others','Others']::text[],
    ARRAY['Others']::text[],
    ARRAY['Female staffing is ≥ 50%','Provide specific reporting on gender related indicators for your investors/funders']::text[],
    'Your investment amount, Total raise by portfolio company',
    'Your investment amount, Total raise by portfolio company',
    ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)'],
    ARRAY['Agriculture / Food supply chain','Distribution / Logistics','Energy / Renewables / Green Mobility','Fast Moving Consumer Goods (FMCG)','Healthcare','Manufacturing'],
    '2-3',
    '3-5',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 4,
      'Fundraising including access to working capital resources', 3,
      'Strategic / organizational planning', 5,
      'Product/services proof of concept /market share / competitor positioning', 5,
      'Human capital management – hiring/retention/training', 3,
      'Technology (CRM, MIS, telecommunications, etc)', 5,
      'Legal / regulatory', 5,
      'Operations/ production / facilities and infrastructure', 5,
      'Management training', 5,
      'Other', 4
    ),
    ARRAY['Dividends','Strategic sale/merger of company','Financial investor take-out'],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 2,
      'Fundraising with access to local LPs', 5,
      'Fundraising with access to warehousing capital', 5,
      'Fundraising with access to grant capital for vehicle OPEX', 5,
      'Fundraising with access to TA support', 5,
      'Fund economics', 5,
      'Fund structuring', 5,
      'Investment process (eg origination, due diligence, structuring, closing)', 5,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 5,
      'Fund staff/Human capital management and development', 5,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 5,
      'Exit/monetization opportunities', 4,
      'Legal/regulatory support', 5,
      'Application of impact metrics', 5,
      'Other', 5
    ),
    'Somewhat positive impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - high impact',
      'Ability to pay staff salaries', 'To date - slight impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - slight impact',
      'Access to supply inputs / raw materials', 'To date - slight impact',
      'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
      'Need to pivot business model', 'To date - slight impact'
    ),
    ARRAY['Yes, government support (financial)','Yes, grant funding (financial)'],
    ARRAY['New pipeline investments through new vehicle'],
    ARRAY['Seek increased access to new LP funds locally','Seek increased access to new LP funds internationally','Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'],
    '1',
    jsonb_build_object(
      'Fund Economics', 1,
      'LP Profiles', 1,
      'Market Data', 3,
      'Purpose Definition', 4,
      'Access to Capital (DfID proposal)', 2
    ),
    'Database of existing portfolio companies, to encourage expertise sharing',
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 2,
      'COVID-19 Response (peer discussion)', 2,
      'Fundraising (presentations from I&P, Capria & DGGF)', 3,
      'Portfolio Support (presentations from 10-Xe and AMI)', 2,
      'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 2,
      'Fundraising 2.0 (peer discussion)', 1,
      'Human Capital (peer discussion)', 1
    ),
    'N/A',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 1,
      'Advocacy for early stage investing ', 1,
      'Raised profile/visibility (individual or collective)', 1,
      'Systems change to drive more capital towards local capital providers', 1
    ),
    true,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 2,
      'TA facility to support early fund economics and activities', 2,
      'Advocacy for the early-stage investing ecosystem', 3,
      'Mentoring program (expert led)', 2,
      'Mentoring program (peer-led)', 2,
      'Webinars with peer-to-peer feedback sessions', 2,
      'Webinars with expert-led feedback sessions', 2,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 1,
      'Fund Manager Portal (ie library of resources, templates etc)', 3,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 3
    ),
    'Yes, as a mentor, Yes, as a mentee',
    ARRAY['Yes, early stage equity']::text[],
    'NA'

  UNION ALL











  -- 3) tony@kinyungu.com
  SELECT
    'tony@kinyungu.com',
    'Kinyungu Ventures',
    'Tony Chen',
    'Managing Director',
    ARRAY['US/Europe','Africa - East Africa'],
    ARRAY['Africa - East Africa'],
    'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)',
    'First investment',
    NULL,
    NULL,
    'As of March 2020',
    'As of December 2020',
    'still TBD on structure',
    ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)','Convertible notes','Senior debt','SAFEs']::text[],
    'Current',
    'TBD',
    'Niche Ventures (innovative products/services targeting niche markets with growth ambitions), High-Growth Ventures (disruptive business models targeting large markets with high growth potential), resilient businesses',
    ARRAY['B2B SaaS','Marketplaces']::text[],
    ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)','Growth (established business in need of funds for expansion, assets, working capital etc)'],
    ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance'],
    ARRAY['High Net Worth Individuals (HNWIs)','Angel network','Impact investing family offices','Donors/philanthropy'],
    ''::text,
    'Targeted',
    'Impact investing (positive screening)',
    ARRAY['N/A']::text[],
    false,
    NULL,
    NULL,
    NULL,
    ARRAY['Investment Consideration']::text[],
    ARRAY['Women ownership/participation interest is ≥ 50%']::text[],
    ARRAY[]::text[],
    'Your investment amount',
    'Your investment amount, Total raise by portfolio company, Total raise by portfolio company',
    ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)','Convertible notes','Senior debt','SAFEs'],
    ARRAY['Sector agnostic'],
    '2-3',
    '< or = 2',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 3,
      'Fundraising including access to working capital resources', 2,
      'Strategic / organizational planning', 3,
      'Product/services proof of concept /market share / competitor positioning', 4,
      'Human capital management – hiring/retention/training', 1,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 2,
      'Operations/ production / facilities and infrastructure', 4,
      'Management training', 2,
      'Other', 2
    ),
    ARRAY['Financial investor take-out'],
    '1-4',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 1,
      'Fundraising with access to warehousing capital', 2,
      'Fundraising with access to grant capital for vehicle OPEX', 3,
      'Fundraising with access to TA support', 3,
      'Fund economics', 1,
      'Fund structuring', 1,
      'Investment process (eg origination, due diligence, structuring, closing)', 1,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
      'Fund staff/Human capital management and development', 3,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 1,
      'Exit/monetization opportunities', 1,
      'Legal/regulatory support', 2,
      'Application of impact metrics', 2,
      'Other', 2
    ),
    'Somewhat negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - high impact',
      'Ability to pay staff salaries', 'To date - high impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact',
      'Ability to pay existing business loans', 'To date - high impact',
      'Access to supply inputs / raw materials', 'To date - high impact',
      'Ability to pay for raw inputs / raw materials', 'To date - high impact',
      'Need to pivot business model', 'To date - high impact'
    ),
    ARRAY['No']::text[],
    ARRAY['New pipeline investments through new vehicle','Technical assistance to support portfolio enterprises'],
    ARRAY['Seek increased access to new LP funds locally','Seek increased access to new LP funds internationally','Increase use of technology in order to lower fund operational costs','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities'],
    '2',
    jsonb_build_object(
      'Fund Economics', 'N/A',
      'LP Profiles', 'N/A',
      'Market Data', 1,
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 1
    ),
    'none',
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 'N/A',
      'COVID-19 Response (peer discussion)', 1,
      'Fundraising (presentations from I&P, Capria & DGGF)', 1,
      'Portfolio Support (presentations from 10-Xe and AMI)', 2
    ),
    'N/A',
    'WhatsApp only',
    jsonb_build_object(
      'Peer connections and peer learning', 1,
      'Advocacy for early stage investing ', 2,
      'Raised profile/visibility (individual or collective)', 2,
      'Systems change to drive more capital towards local capital providers', 3
    ),
    true,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 1,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 3,
      'Mentoring program (peer-led)', 3,
      'Webinars with peer-to-peer feedback sessions', 1,
      'Webinars with expert-led feedback sessions', 1,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 2,
      'Fund Manager Portal (ie library of resources, templates etc)', 2,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2
    ) AS convening_initiatives_ranking,
    'Not sure',
    ARRAY['No']::text[],
    NULL

  UNION ALL











-- 4) william.prothais@uberiscapital.com
SELECT
    'william.prothais@uberiscapital.com',
    'Uberis',
    'William Prothais',
    'Fund Associate',
    ARRAY['Asia - South East Asia'],
    ARRAY['Asia - South East Asia'],
    'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)',
    'First investment',
    NULL,
    NULL,
    'As of March 2020',
    'As of December 2020',
    'Open-ended vehicle / Limited liability company or equivalent',
    ARRAY['Common equity','Convertible notes']::text[],
    'Current',
    'Target',
    '1-3 years',
    'impactful early stage ventures',
    ARRAY['Start-up / pre-seed (pre-revenue, concept and business plan development)','Early stage / seed (early revenue, product/service development, funds needed to expand business model)']::text[],
    ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance','Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)']::text[],
    ARRAY['Fund partners','High Net Worth Individuals (HNWIs)','Angel network','Impact investing family offices','Donors/philanthropy']::text[],
    ''::text,
    'Achieved in most recent reporting period',
    'Targeted',
    'Impact investing (positive screening)',
    ARRAY['Gender','Climate / green ventures']::text[],
    true,
    ARRAY['Good Health and Well-Being','Quality Education','Gender Equality','Clean Water and Sanitation','Affordable and Clean Energy','Decent Work and Economic Growth','Industry Innovation and Infrastructure','Reduced Inequalities','Sustainable Cities and Communities','Responsible Consumption and Production','Climate Action','Peace, Justice, and Strong Institutions','Partnerships for the Goals']::text[],
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce','Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)','Have policies in place that promote gender equality (e.g. equal compensation)','Women are target beneficiaries of the product/service','Enterprise reports on specific gender related indicators to investors','Board member female representation (>33%)','Female CEO']::text[],
    ARRAY['Provide specific reporting on gender related indicators for your investors/funders']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Common equity','Convertible notes']::text[],
    ARRAY['Sector agnostic']::text[],
    '2-3',
    '< or = 2',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 1,
      'Fundraising including access to working capital resources', 1,
      'Strategic / organizational planning', 1,
      'Product/services proof of concept /market share / competitor positioning', 3,
      'Human capital management – hiring/retention/training', 2,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 2,
      'Operations/ production / facilities and infrastructure', 3,
      'Management training', 2,
      'Other', 5
    ),
    ARRAY['Strategic sale/merger of company','Financial investor take-out']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 2,
      'Fundraising with access to local LPs', 1,
      'Fundraising with access to warehousing capital', 3,
      'Fundraising with access to grant capital for vehicle OPEX', 2,
      'Fundraising with access to TA support', 2,
      'Fund economics', 5,
      'Fund structuring', 5,
      'Investment process (eg origination, due diligence, structuring, closing)', 5,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 5,
      'Fund staff/Human capital management and development', 5,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 5,
      'Exit/monetization opportunities', 5,
      'Legal/regulatory support', 5,
      'Application of impact metrics', 5,
      'Other', 5
    ),
    'Somewhat negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - slight impact',
      'Ability to pay staff salaries', 'To date - no impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - slight impact',
      'Access to supply inputs / raw materials', 'To date - slight impact',
      'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
      'Need to pivot business model', 'To date - slight impact'
    ),
    ARRAY['No']::text[],
    ARRAY['Technical assistance to support portfolio enterprises']::text[],
    ARRAY['Seek increased access to new LP funds locally','Increase use of data and technology to facilitate investment decisions','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[],
    '2',
    jsonb_build_object(
      'Fund Economics', 2,
      'LP Profiles', 2,
      'Market Data', 1,
      'Purpose Definition', 4,
      'Access to Capital (DfID proposal)', 4
    ),
    'no',
    jsonb_build_object(
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
    'open discussion with peers were very interesting and insightful',
    'WhatsApp only',
    jsonb_build_object(
      'Peer connections and peer learning', 1,
      'Advocacy for early stage investing ', 1,
      'Raised profile/visibility (individual or collective)', 1,
      'Systems change to drive more capital towards local capital providers', 1
    ),
    false,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 1,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 1,
      'Mentoring program (expert led)', 3,
      'Mentoring program (peer-led)', 3,
      'Webinars with peer-to-peer feedback sessions', 1,
      'Webinars with expert-led feedback sessions', 1,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 3,
      'Fund Manager Portal (ie library of resources, templates etc)', 3,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 3,
      'Joint back office between actively investing fund managers', 3
    ),
    'Yes, as a mentee',
    ARRAY['No']::text[],
    NULL

UNION ALL











-- 5) vfraser@jengacapital.com
SELECT
    'vfraser@jengacapital.com',
    'Jenga Capital',
    'Valerie Frser',
    'Director',
    ARRAY['Africa - East Africa'],
    ARRAY['Africa - East Africa'],
    'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics',
    'Legal entity',
    'Legal entity',
    'First investment',
    'As of March 2020',
    'As of December 2020',
    'Open-ended vehicle / Limited liability company or equivalent',
    ARRAY['Senior debt','Mezzanine debt']::text[],
    'Current',
    'Target',
    '1-3 years',
    'Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth), Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)',
    ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)','Growth (established business in need of funds for expansion, assets, working capital etc)']::text[],
    ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Enterprise growth capital (e.g. staff build-out, sales & marketing, new markets, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['High Net Worth Individuals (HNWIs)']::text[],
    ''::text,
    'Achieved in most recent reporting period',
    'Targeted',
    'Financial return first',
    ARRAY['N/A']::text[],
    false,
    NULL,
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce']::text[],
    ARRAY['Women representation on the board/investment committee is ≥ 50','Female staffing is ≥ 50%']::text[],
    'Your investment amount',
    'Your investment amount',
    ARRAY['Senior debt','Mezzanine debt']::text[],
    ARRAY['Agriculture / Food supply chain']::text[],
    '1',
    '< or = 2',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 2,
      'Fundraising including access to working capital resources', 1,
      'Strategic / organizational planning', 2,
      'Product/services proof of concept /market share / competitor positioning', 4,
      'Human capital management – hiring/retention/training', 3,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 3,
      'Operations/ production / facilities and infrastructure', 2,
      'Management training', 3,
      'Other', 5
    ),
    ARRAY['Interest income/shared revenues and principal repayment']::text[],
    '1-4',
    jsonb_build_object(
      'Fundraising with access to global LPs', 4,
      'Fundraising with access to local LPs', 4,
      'Fundraising with access to warehousing capital', 4,
      'Fundraising with access to grant capital for vehicle OPEX', 4,
      'Fundraising with access to TA support', 5,
      'Fund economics', 1,
      'Fund structuring', 1,
      'Investment process (eg origination, due diligence, structuring, closing)', 2,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 2,
      'Fund staff/Human capital management and development', 1,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 2,
      'Exit/monetization opportunities', 2,
      'Legal/regulatory support', 2,
      'Application of impact metrics', 1,
      'Other', 5
    ),
    'Neither positive nor negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - high impact',
      'Ability to pay staff salaries', 'To date - no impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - no impact',
      'Ability to pay existing business loans', 'To date - no impact',
      'Access to supply inputs / raw materials', 'To date - slight impact',
      'Ability to pay for raw inputs / raw materials', 'To date - no impact',
      'Need to pivot business model', 'To date - no impact'
    ),
    ARRAY['No']::text[],
    ARRAY['N/A - have no plans to raise capital in 2021']::text[],
    ARRAY['Increase application of alternative debt instruments','Increase use of technology to lower fund operational costs','Increase use of data and technology to facilitate investment decisions','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[],
    '2',
    jsonb_build_object(
      'Fund Economics', 5,
      'LP Profiles', 'N/A',
      'Market Data', 'N/A',
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 'N/A'
    ),
    'Legal Support',
    jsonb_build_object(
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
    'n/a',
    'WhatsApp only',
    jsonb_build_object(
      'Peer connections and peer learning', 1,
      'Advocacy for early stage investing ', 4,
      'Raised profile/visibility (individual or collective)', 1,
      'Systems change to drive more capital towards local capital providers', 2
    ),
    false,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 1,
      'TA facility to support early fund economics and activities', 3,
      'Advocacy for the early-stage investing ecosystem', 3,
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
    'Yes, as a mentee',
    ARRAY['No']::text[],
    NULL;

UNION ALL






-- 6) chai@vakayi.com
SELECT
    'chai@vakayi.com',
    'Vakayi Capital',
    'Chai Musoni',
    'CEO/Partner',
    ARRAY['Africa - Southern Africa'],
    ARRAY['Africa - Southern Africa'],
    'Closed ended - fundraising',
    '1st close (or equivalent)',
    NULL,
    NULL,
    NULL,
    'As of December 2020',
    'Closed-end fund',
    ARRAY['Mezzanine debt','Shared revenue/earnings instruments']::text[],
    'Current',
    'Target',
    '4-5 years',
    'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)',
    ARRAY['Growth (established business in need of funds for expansion, assets, working capital etc)']::text[],
    ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['Local pension funds','High Net Worth Individuals (HNWIs)','Development Finance Institutions (DFIs)','Impact investing family offices']::text[],
    ''::text,
    'Achieved in most recent reporting period',
    'Targeted',
    'Financial return first',
    ARRAY['Gender','Youth','Job creation']::text[],
    true,
    ARRAY['No Poverty','Zero Hunger','Good Health and Well-Being','Quality Education','Gender Equality','Clean Water and Sanitation','Affordable and Clean Energy','Decent Work and Economic Growth','Industry Innovation and Infrastructure','Reduced Inequalities','Sustainable Cities and Communities','Responsible Consumption and Production','Climate Action','Peace, Justice, and Strong Institutions','Partnerships for the Goals']::text[],
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce','Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)','Have policies in place that promote gender equality (e.g. equal compensation)','Women are target beneficiaries of the product/service','Enterprise reports on specific gender related indicators to investors','Board member female representation (>33%)','Female CEO']::text[],
    ARRAY['Provide specific reporting on gender related indicators for your investors/funders']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Mezzanine debt','Shared revenue/earnings instruments']::text[],
    ARRAY['Sector agnostic']::text[],
    '2-3',
    '3-5',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 1,
      'Fundraising including access to working capital resources', 1,
      'Strategic / organizational planning', 2,
      'Product/services proof of concept /market share / competitor positioning', 4,
      'Human capital management – hiring/retention/training', 3,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 4,
      'Operations/ production / facilities and infrastructure', 3,
      'Management training', 3,
      'Other', 5
    ),
    ARRAY['Interest income/shared revenues and principal repayment']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 2,
      'Fundraising with access to warehousing capital', 5,
      'Fundraising with access to grant capital for vehicle OPEX', 3,
      'Fundraising with access to TA support', 1,
      'Fund economics', 4,
      'Fund structuring', 3,
      'Investment process (eg origination, due diligence, structuring, closing)', 5,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 4,
      'Fund staff/Human capital management and development', 4,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
      'Exit/monetization opportunities', 5,
      'Legal/regulatory support', 5,
      'Application of impact metrics', 4,
      'Other', 5
    ),
    'Significant negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - no impact',
      'Customer demand', 'To date - slight impact',
      'Ability to pay staff salaries', 'To date - slight impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - high impact',
      'Access to supply inputs / raw materials', 'To date - slight impact',
      'Ability to pay for raw inputs / raw materials', 'To date - high impact',
      'Need to pivot business model', 'To date - no impact'
    ),
    ARRAY['No']::text[],
    ARRAY['Growth capital for existing portfolio to increase market share','New pipeline investments through existing vehicle']::text[],
    ARRAY['Seek increased access to new LP funds locally','Seek increased access to new LP funds internationally']::text[],
    '3',
    jsonb_build_object(
      'Fund Economics', 3,
      'LP Profiles', 3,
      'Market Data', 4,
      'Purpose Definition', 3,
      'Access to Capital (DfID proposal)', 3
    ),
    'no',
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 3,
      'COVID-19 Response (peer discussion)', 2,
      'Fundraising (presentations from I&P, Capria & DGGF)', 3,
      'Portfolio Support (presentations from 10-Xe and AMI)', 3,
      'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 2,
      'Fundraising 2.0 (peer discussion)', 2,
      'Human Capital (peer discussion)', 3,
      'Co-investing workshop with ADAP (peer discussion)', 3,
      'Fundraising 3.0 – local capital (peer discussion)', 2,
      'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 3,
      'Mentoring Pilot Kick-off', 2
    ),
    'No',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 2,
      'Advocacy for early stage investing ', 2,
      'Raised profile/visibility (individual or collective)', 3,
      'Systems change to drive more capital towards local capital providers', 2
    ),
    false,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 3,
      'TA facility to support early fund economics and activities', 2,
      'Advocacy for the early-stage investing ecosystem', 1,
      'Mentoring program (expert led)', 3,
      'Mentoring program (peer-led)', 2,
      'Webinars with peer-to-peer feedback sessions', 1,
      'Webinars with expert-led feedback sessions', 2,
      'Fundraising Readiness Advisory Program for fund managers', 2,
      'Investment readiness for portfolio companies', 2,
      'Fund Manager Portal (ie library of resources, templates etc)', 1,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
      'Joint back office between actively investing fund managers', 1
    ),
    'Yes, as a mentee',
    ARRAY['No']::text[],
    'Capital raising needs to receive much more attention. Without ultimately securing capital everything else becomes redudant.'

UNION ALL











-- 7) jaap-jan@truvalu-group.com
SELECT
    'jaap-jan@truvalu-group.com',
    'Truvalu',
    'Jaap-Jan Verboom',
    'Founder/ Director',
    ARRAY['US/Europe','Asia - South Asia','Africa - East Africa','Latin America'],
    ARRAY['Asia - South Asia','Africa - East Africa','Latin America'],
    'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics',
    '1st close (or equivalent)',
    NULL,
    NULL,
    'Legal entity',
    'First investment',
    'As of March 2020',
    'As of December 2020',
    'Open-ended vehicle / Limited liability company or equivalent',
    ARRAY['Common equity','Convertible notes','Mezzanine debt']::text[],
    'Current',
    'Target',
    '8+ years',
    'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential), Niche Ventures (innovative products/services targeting niche markets with growth ambitions)',
    ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)','Growth (established business in need of funds for expansion, assets, working capital etc)']::text[],
    ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['Fund partners','High Net Worth Individuals (HNWIs)','Crowd funding']::text[],
    ''::text,
    'Achieved in most recent reporting period',
    'Targeted',
    'Balanced impact/financial return',
    ARRAY['N/A']::text[],
    true,
    ARRAY['No Poverty','Zero Hunger','Good Health and Well-Being','Quality Education','Gender Equality','Clean Water and Sanitation','Affordable and Clean Energy','Decent Work and Economic Growth','Industry Innovation and Infrastructure','Reduced Inequalities','Sustainable Cities and Communities','Responsible Consumption and Production','Climate Action','Life Below Water','Life on Land','Peace, Justice, and Strong Institutions','Partnerships for the Goals']::text[],
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce','Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)','Women are target beneficiaries of the product/service','Enterprise reports on specific gender related indicators to investors','Board member female representation (>33%)','Female CEO']::text[],
    ARRAY['Provide specific reporting on gender related indicators for your investors/funders','Require specific reporting on gender related indicators by your investees/borrowers']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Common equity','Convertible notes','Mezzanine debt']::text[],
    ARRAY['Agriculture / Food supply chain']::text[],
    '0',
    '10+',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 1,
      'Fundraising including access to working capital resources', 2,
      'Strategic / organizational planning', 2,
      'Product/services proof of concept /market share / competitor positioning', 4,
      'Human capital management – hiring/retention/training', 2,
      'Technology (CRM, MIS, telecommunications, etc)', 5,
      'Legal / regulatory', 3,
      'Operations/ production / facilities and infrastructure', 2,
      'Management training', 1,
      'Other', 3
    ),
    ARRAY['Interest income/shared revenues and principal repayment','Dividends','Management buyout']::text[],
    '1-4',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 1,
      'Fundraising with access to warehousing capital', 3,
      'Fundraising with access to grant capital for vehicle OPEX', 5,
      'Fundraising with access to TA support', 1,
      'Fund economics', 3,
      'Fund structuring', 5,
      'Investment process (eg origination, due diligence, structuring, closing)', 4,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
      'Fund staff/Human capital management and development', 1,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 4,
      'Exit/monetization opportunities', 1,
      'Legal/regulatory support', 2,
      'Application of impact metrics', 3,
      'Other', 3
    ),
    'Significant negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - high impact, Anticipate future impact',
      'Customer demand', 'To date - high impact, Anticipate future impact',
      'Ability to pay staff salaries', 'To date - high impact, Anticipate future impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact, Anticipate future impact',
      'Ability to pay existing business loans', 'To date - high impact, Anticipate future impact',
      'Access to supply inputs / raw materials', 'To date - high impact, Anticipate future impact',
      'Ability to pay for raw inputs / raw materials', 'To date - high impact, Anticipate future impact',
      'Need to pivot business model', 'To date - slight impact, Anticipate no future impact'
    ),
    ARRAY['Yes, government support (financial)','Yes, non-financial assistance']::text[],
    ARRAY['Growth capital for existing portfolio to increase market share','Growth capital for existing portfolio to enter new markets/expand business line(s)','New pipeline investments through existing vehicle']::text[],
    ARRAY['Seek increased access to new LP funds locally','Seek increased access to new LP funds internationally','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[],
    '3',
    jsonb_build_object(
      'Fund Economics', 'N/A',
      'LP Profiles', 'N/A',
      'Market Data', 'N/A',
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 'N/A'
    ),
    'n/a',
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 'N/A',
      'COVID-19 Response (peer discussion)', 2,
      'Fundraising (presentations from I&P, Capria & DGGF)', 1,
      'Portfolio Support (presentations from 10-Xe and AMI)', 5,
      'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 5,
      'Fundraising 2.0 (peer discussion)', 2,
      'Human Capital (peer discussion)', 'N/A',
      'Co-investing workshop with ADAP (peer discussion)', 2,
      'Fundraising 3.0 – local capital (peer discussion)', 'N/A',
      'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 5,
      'Mentoring Pilot Kick-off', 'N/A'
    ),
    'I don''t know :-(',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 2,
      'Advocacy for early stage investing ', 3,
      'Raised profile/visibility (individual or collective)', 3,
      'Systems change to drive more capital towards local capital providers', 2
    ),
    true,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 3,
      'TA facility to support early fund economics and activities', 2,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 2,
      'Mentoring program (peer-led)', 3,
      'Webinars with peer-to-peer feedback sessions', 2,
      'Webinars with expert-led feedback sessions', 1,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 2,
      'Fund Manager Portal (ie library of resources, templates etc)', 2,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
      'Joint back office between actively investing fund managers', 3
    ),
    'No',
    ARRAY['Yes, open ended vehicles']::text[],
    NULL;

UNION ALL











-- 8) jenny@amamventures.com
SELECT
    'jenny@amamventures.com',
    'Amam Ventures',
    'Jenny Ahlzen',
    'Co-founder and managing partner',
    ARRAY['Middle East'],
    ARRAY['Middle East'],
    'currently in pilot phase, creating a track record and working towards a first close',
    'Legal entity',
    NULL,
    NULL,
    NULL,
    'As of December 2020',
    'Open-ended vehicle / Limited liability company or equivalent',
    ARRAY['Mezzanine debt','Shared revenue/earnings instruments']::text[],
    'Current',
    'Target',
    '4-5 years',
    'Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth), Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)',
    ARRAY['Growth (established business in need of funds for expansion, assets, working capital etc)']::text[],
    ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['High Net Worth Individuals (HNWIs)','Development Finance Institutions (DFIs)','Impact investing family offices','Corporates']::text[],
    ''::text,
    'Targeted',
    'Balanced impact/financial return',
    ARRAY['Gender','Job creation']::text[],
    true,
    ARRAY['No Poverty','Zero Hunger','Good Health and Well-Being','Quality Education','Gender Equality','Clean Water and Sanitation','Affordable and Clean Energy','Decent Work and Economic Growth','Industry Innovation and Infrastructure','Reduced Inequalities','Sustainable Cities and Communities','Responsible Consumption and Production','Climate Action','Life Below Water','Life on Land','Peace, Justice, and Strong Institutions','Partnerships for the Goals']::text[],
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce','Have policies in place that promote gender equality (e.g. equal compensation)','Women are target beneficiaries of the product/service','Enterprise reports on specific gender related indicators to investors','Board member female representation (>33%)','Female CEO']::text[],
    ARRAY['Women ownership/participation interest is ≥ 50%','Women representation on the board/investment committee is ≥ 50','Female staffing is ≥ 50%','Provide specific reporting on gender related indicators for your investors/funders','Require specific reporting on gender related indicators by your investees/borrowers']::text[],
    'Your investment amount',
    'Your investment amount',
    ARRAY['Mezzanine debt','Shared revenue/earnings instruments']::text[],
    ARRAY['Sector agnostic']::text[],
    '2-3',
    '3-5',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 1,
      'Fundraising including access to working capital resources', 3,
      'Strategic / organizational planning', 2,
      'Product/services proof of concept /market share / competitor positioning', 3,
      'Human capital management – hiring/retention/training', 2,
      'Technology (CRM, MIS, telecommunications, etc)', 4,
      'Legal / regulatory', 3,
      'Operations/ production / facilities and infrastructure', 3,
      'Management training', 1,
      'Other', 5
    ),
    ARRAY['Interest income/shared revenues and principal repayment','Other types of self-liquidating repayment structures']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 5,
      'Fundraising with access to warehousing capital', 5,
      'Fundraising with access to grant capital for vehicle OPEX', 2,
      'Fundraising with access to TA support', 1,
      'Fund economics', 2,
      'Fund structuring', 2,
      'Investment process (eg origination, due diligence, structuring, closing)', 4,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 2,
      'Fund staff/Human capital management and development', 4,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
      'Exit/monetization opportunities', 5,
      'Legal/regulatory support', 4,
      'Application of impact metrics', 1,
      'Other', 5
    ),
    'Somewhat positive impact',
    jsonb_build_object(
      'Staff attendance', 'To date - no impact',
      'Customer demand', 'To date - high impact',
      'Ability to pay staff salaries', 'To date - slight impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - slight impact',
      'Access to supply inputs / raw materials', 'To date - high impact',
      'Ability to pay for raw inputs / raw materials', 'To date - slight impact',
      'Need to pivot business model', 'To date - slight impact'
    ),
    ARRAY['No']::text[],
    ARRAY['New pipeline investments through new vehicle','Technical assistance to support portfolio enterprises']::text[],
    ARRAY['Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)','Increase use of technology in order to lower fund operational costs','Increase use of data and technology to facilitate investment decisions']::text[],
    '1',
    jsonb_build_object(
      'Fund Economics', 'N/A',
      'LP Profiles', 'N/A',
      'Market Data', 'N/A',
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 'N/A'
    ),
    'I''m a relatively new member so this will be my first event',
    jsonb_build_object(
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
    'you have done so many already! If possible, would really like to get access to previous webinars',
    'WhatsApp only',
    jsonb_build_object(
      'Peer connections and peer learning', 'N/A',
      'Advocacy for early stage investing ', 'N/A',
      'Raised profile/visibility (individual or collective)', 'N/A',
      'Systems change to drive more capital towards local capital providers', 'N/A'
    ),
    false,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 2,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 3,
      'Mentoring program (expert led)', 1,
      'Mentoring program (peer-led)', 1,
      'Webinars with peer-to-peer feedback sessions', 2,
      'Webinars with expert-led feedback sessions', 2,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 2,
      'Fund Manager Portal (ie library of resources, templates etc)', 2,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
      'Joint back office between actively investing fund managers', 1
    ),
    'Yes, as a mentor, Yes, as a mentee',
    ARRAY['as mentioned above, this will be my first event with the ESCP, so i think it''d make sense to learn from others first? Happy to present though if you are short on presenters :)']::text[],
    'Looking forward to it!'

UNION ALL











-- 9) ali.alsuhail@kapita.iq
SELECT
    'ali.alsuhail@kapita.iq',
    'Kapita',
    'Ali Al Suhail',
    'Investment Manager',
    ARRAY['Middle East'],
    ARRAY['Middle East'],
    'Currently a network but will move to fund next year',
    'Legal entity',
    'First investment',
    NULL,
    'As of March 2020',
    'As of December 2020',
    'Angel network',
    ARRAY['Common equity']::text[],
    'Current',
    'Target',
    '4-5 years',
    'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)',
    ARRAY['Start-up / pre-seed (pre-revenue, concept and business plan development)','Early stage / seed (early revenue, product/service development, funds needed to expand business model)']::text[],
    ARRAY['Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)','Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['Fund partners','Angel network','Development Finance Institutions (DFIs)','Donors/philanthropy','Corporates']::text[],
    ''::text,
    'Targeted',
    'Financial return first',
    ARRAY['Youth','Job creation']::text[],
    false,
    NULL,
    ARRAY[]::text[],
    ARRAY[]::text[],
    ARRAY['none at the moment']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Common equity']::text[],
    ARRAY['Sector agnostic']::text[],
    '2-3',
    '10+',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 1,
      'Fundraising including access to working capital resources', 2,
      'Strategic / organizational planning', 2,
      'Product/services proof of concept /market share / competitor positioning', 2,
      'Human capital management – hiring/retention/training', 3,
      'Technology (CRM, MIS, telecommunications, etc)', 4,
      'Legal / regulatory', 1,
      'Operations/ production / facilities and infrastructure', 3,
      'Management training', 3,
      'Other', 2
    ),
    ARRAY['not clear now']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 5,
      'Fundraising with access to warehousing capital', 4,
      'Fundraising with access to grant capital for vehicle OPEX', 4,
      'Fundraising with access to TA support', 4,
      'Fund economics', 2,
      'Fund structuring', 2,
      'Investment process (eg origination, due diligence, structuring, closing)', 5,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
      'Fund staff/Human capital management and development', 2,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 4,
      'Exit/monetization opportunities', 1,
      'Legal/regulatory support', 2,
      'Application of impact metrics', 2,
      'Other', 5
    ),
    'Neither positive nor negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - slight impact',
      'Ability to pay staff salaries', 'To date - slight impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - slight impact',
      'Access to supply inputs / raw materials', 'To date - high impact',
      'Ability to pay for raw inputs / raw materials', 'To date - high impact',
      'Need to pivot business model', 'To date - slight impact'
    ),
    ARRAY['No']::text[],
    ARRAY['New pipeline investments through new vehicle']::text[],
    ARRAY['Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[],
    '3',
    jsonb_build_object(
      'Fund Economics', 'N/A',
      'LP Profiles', 'N/A',
      'Market Data', 'N/A',
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 'N/A'
    ),
    'n/a',
    jsonb_build_object(
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
    'n/a',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 'N/A',
      'Advocacy for early stage investing ', 'N/A',
      'Raised profile/visibility (individual or collective)', 'N/A',
      'Systems change to drive more capital towards local capital providers', 'N/A'
    ),
    true,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 1,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 1,
      'Mentoring program (expert led)', 2,
      'Mentoring program (peer-led)', 2,
      'Webinars with peer-to-peer feedback sessions', 2,
      'Webinars with expert-led feedback sessions', 1,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 2,
      'Fund Manager Portal (ie library of resources, templates etc)', 1,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
      'Joint back office between actively investing fund managers', 2
    ),
    'Not sure',
    ARRAY['No']::text[],
    NULL;

UNION ALL











-- 10) lavanya@vestedworld.com
SELECT
    'lavanya@vestedworld.com',
    'VestedWorld',
    'Lavanya Anand',
    'Vice President',
    ARRAY['US/Europe','Africa - East Africa'],
    ARRAY['Africa - West Africa','Africa - East Africa'],
    'Closed ended - completed second close, Started fundraising for second fund',
    'Legal entity',
    NULL,
    '1st close (or equivalent)',
    '1st close (or equivalent)',
    'As of March 2020',
    'As of December 2020',
    'Closed-end fund',
    ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)','Convertible notes']::text[],
    'Current',
    'Target',
    '6-7 years',
    'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential), High-Growth Ventures (disruptive business models targeting large markets with high growth potential)',
    ARRAY['Growth (established business in need of funds for expansion, assets, working capital etc)','Pre-Series A / Series A']::text[],
    ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['Local pension funds','High Net Worth Individuals (HNWIs)','Development Finance Institutions (DFIs)','Impact investing family offices','Donors/philanthropy']::text[],
    ''::text,
    'Achieved in most recent reporting period',
    'Targeted',
    'Financial return first, Responsible/ESG investing (negative screening)',
    ARRAY['Job creation']::text[],
    true,
    ARRAY['No Poverty','Zero Hunger','Good Health and Well-Being','Quality Education','Gender Equality','Clean Water and Sanitation','Affordable and Clean Energy','Decent Work and Economic Growth','Industry Innovation and Infrastructure','Reduced Inequalities','Sustainable Cities and Communities','Responsible Consumption and Production','Climate Action','Life Below Water','Life on Land','Peace, Justice, and Strong Institutions','Partnerships for the Goals']::text[],
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce','Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)','Have policies in place that promote gender equality (e.g. equal compensation)','Women are target beneficiaries of the product/service','Enterprise reports on specific gender related indicators to investors','Board member female representation (>33%)','Female CEO']::text[],
    ARRAY['At least 1 woman on IC, at least 1 woman partner']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)','Convertible notes']::text[],
    ARRAY['Agriculture / Food supply chain','Distribution / Logistics','Education','Financial Inclusion / Insurance / Fintech','Fast Moving Consumer Goods (FMCG)','Healthcare','Manufacturing','Technology / ICT / Telecommunications']::text[],
    '4-5',
    '3-5',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 3,
      'Fundraising including access to working capital resources', 1,
      'Strategic / organizational planning', 4,
      'Product/services proof of concept /market share / competitor positioning', 5,
      'Human capital management – hiring/retention/training', 2,
      'Technology (CRM, MIS, telecommunications, etc)', 5,
      'Legal / regulatory', 5,
      'Operations/ production / facilities and infrastructure', 5,
      'Management training', 5,
      'Other', 5
    ),
    ARRAY['Strategic sale/merger of company','Financial investor take-out']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 4,
      'Fundraising with access to warehousing capital', 5,
      'Fundraising with access to grant capital for vehicle OPEX', 2,
      'Fundraising with access to TA support', 2,
      'Fund economics', 2,
      'Fund structuring', 5,
      'Investment process (eg origination, due diligence, structuring, closing)', 5,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 5,
      'Fund staff/Human capital management and development', 5,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 5,
      'Exit/monetization opportunities', 1,
      'Legal/regulatory support', 5,
      'Application of impact metrics', 3,
      'Other', 5
    ),
    'Somewhat negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - no impact',
      'Customer demand', 'To date - slight impact',
      'Ability to pay staff salaries', 'To date - slight impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - high impact',
      'Access to supply inputs / raw materials', 'To date - slight impact',
      'Ability to pay for raw inputs / raw materials', 'To date - no impact',
      'Need to pivot business model', 'To date - slight impact'
    ),
    ARRAY['No']::text[],
    ARRAY['New pipeline investments through new vehicle','Technical assistance to support portfolio enterprises']::text[],
    ARRAY['Increase use of technology in order to lower fund operational costs','Increase use of data and technology to facilitate investment decisions','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[],
    '2',
    jsonb_build_object(
      'Fund Economics', 1,
      'LP Profiles', 'N/A',
      'Market Data', 'N/A',
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 'N/A'
    ),
    'Shared back-office services, Exit landscape, Fund manager database',
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 'N/A',
      'COVID-19 Response (peer discussion)', 2,
      'Fundraising (presentations from I&P, Capria & DGGF)', 1,
      'Portfolio Support (presentations from 10-Xe and AMI)', 'N/A',
      'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 2,
      'Fundraising 2.0 (peer discussion)', 'N/A',
      'Human Capital (peer discussion)', 2,
      'Co-investing workshop with ADAP (peer discussion)', 1,
      'Fundraising 3.0 – local capital (peer discussion)', 'N/A',
      'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 2,
      'Mertoring Pilot Kick-off', 1
    ),
    'Successful exits, technology DD, virtual DD',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 1,
      'Advocacy for early stage investing ', 2,
      'Raised profile/visibility (individual or collective)', 3,
      'Systems change to drive more capital towards local capital providers', 'N/A'
    ),
    false,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 3,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 2,
      'Mentoring program (peer-led)', 2,
      'Webinars with peer-to-peer feedback sessions', 2,
      'Webinars with expert-led feedback sessions', 1,
      'Fundraising Readiness Advisory Program for fund managers', 2,
      'Investment readiness for portfolio companies', 2,
      'Fund Manager Portal (ie library of resources, templates etc)', 1,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
      'Joint back office between actively investing fund managers', 1
    ),
    'Not sure',
    ARRAY['No']::text[],
    NULL

UNION ALL











-- 11) josh@balloonventures.com
SELECT
    'josh@balloonventures.com',
    'Balloon Ventures',
    'Josh Bicknell',
    'CEO',
    ARRAY['Africa - East Africa'],
    ARRAY['Africa - East Africa'],
    'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)',
    'Legal entity',
    NULL,
    '1st close (or equivalent)',
    'First investment',
    'As of March 2020',
    'As of December 2020',
    'Open-ended vehicle / Limited liability company or equivalent',
    ARRAY['Senior debt']::text[],
    'Current',
    'Target',
    '1-3 years',
    'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)',
    ARRAY['Growth (established business in need of funds for expansion, assets, working capital etc)']::text[],
    ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['High Net Worth Individuals (HNWIs)','Development Finance Institutions (DFIs)','Impact investing family offices','Donors/philanthropy']::text[],
    ''::text,
    'Targeted',
    'Impact first investing (impact outcomes intentionally)',
    ARRAY['Youth','Job creation','Decent work']::text[],
    true,
    ARRAY['No Poverty','Zero Hunger','Good Health and Well-Being','Quality Education','Gender Equality','Clean Water and Sanitation','Affordable and Clean Energy','Decent Work and Economic Growth','Industry Innovation and Infrastructure','Reduced Inequalities','Sustainable Cities and Communities','Responsible Consumption and Production','Climate Action','Life Below Water','Life on Land','Peace, Justice, and Strong Institutions','Partnerships for the Goals']::text[],
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce']::text[],
    ARRAY['Women ownership/participation interest is ≥ 50%','Female staffing is ≥ 50%','Provide specific reporting on gender related indicators for your investors/funders']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Senior debt']::text[],
    ARRAY['Agriculture / Food supply chain','Distribution / Logistics','Education','Healthcare','Manufacturing','Hospitality']::text[],
    '0',
    '10+',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 1,
      'Fundraising including access to working capital resources', 4,
      'Strategic / organizational planning', 1,
      'Product/services proof of concept /market share / competitor positioning', 5,
      'Human capital management – hiring/retention/training', 1,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 3,
      'Operations/ production / facilities and infrastructure', 2,
      'Management training', 1,
      'Other', 5
    ),
    ARRAY['Interest income/shared revenues and principal repayment']::text[],
    '15-24',
    jsonb_build_object(
      'Fundraising with access to global LPs', 2,
      'Fundraising with access to local LPs', 2,
      'Fundraising with access to warehousing capital', 5,
      'Fundraising with access to grant capital for vehicle OPEX', 2,
      'Fundraising with access to TA support', 1,
      'Fund economics', 1,
      'Fund structuring', 2,
      'Investment process (eg origination, due diligence, structuring, closing)', 4,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 4,
      'Fund staff/Human capital management and development', 4,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 4,
      'Exit/monetization opportunities', 4,
      'Legal/regulatory support', 4,
      'Application of impact metrics', 2,
      'Other', 5
    ),
    'Significant negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - high impact',
      'Ability to pay staff salaries', 'To date - high impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact',
      'Ability to pay existing business loans', 'To date - high impact',
      'Access to supply inputs / raw materials', 'To date - slight impact',
      'Ability to pay for raw inputs / raw materials', 'To date - high impact',
      'Need to pivot business model', 'To date - no impact'
    ),
    ARRAY['Yes, government support (financial)']::text[],
    ARRAY['Growth capital for existing portfolio to increase market share','New pipeline investments through existing vehicle','Technical assistance to support portfolio enterprises']::text[],
    ARRAY['Seek increased access to new LP funds locally','Seek increased access to new LP funds internationally','Increase use of technology in order to lower fund operational costs','Increase use of data and technology to facilitate investment decisions']::text[],
    '3',
    jsonb_build_object(
      'Fund Economics', 'N/A',
      'LP Profiles', 'N/A',
      'Market Data', 'N/A',
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 'N/A'
    ),
    'TA to portfolio companies',
    jsonb_build_object(
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
    'NA',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 'N/A',
      'Advocacy for early stage investing ', 'N/A',
      'Raised profile/visibility (individual or collective)', 'N/A',
      'Systems change to drive more capital towards local capital providers', 'N/A'
    ),
    true,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 1,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 1,
      'Mentoring program (peer-led)', 2,
      'Webinars with peer-to-peer feedback sessions', 2,
      'Webinars with expert-led feedback sessions', 1,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 3,
      'Fund Manager Portal (ie library of resources, templates etc)', 2,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
      'Joint back office between actively investing fund managers', 3
    ),
    'Yes, as a mentee',
    ARRAY['No']::text[],
    NULL;

UNION ALL











-- 12) oeharmon@gemicap.com
SELECT
    'oeharmon@gemicap.com',
    'Gemini Capital Partners',
    'Owen E Harmon',
    'General Partner',
    ARRAY['Africa - West Africa'],
    ARRAY['Africa - West Africa'],
    'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)',
    'Legal entity',
    'First investment',
    NULL,
    'As of March 2020',
    'As of December 2020',
    'Closed-end fund',
    ARRAY['Common equity','Preferred equity (e.g. certain rights above those available to common equity holders)','Convertible notes','Shared revenue/earnings instruments','a mix of equity & convertible debt to also be considered']::text[],
    'Current',
    'Target',
    '8+ years',
    'Niche Ventures (innovative products/services targeting niche markets with growth ambitions), High-Growth Ventures (disruptive business models targeting large markets with high growth potential)',
    ARRAY['Start-up / pre-seed (pre-revenue, concept and business plan development)','Early stage / seed (early revenue, product/service development, funds needed to expand business model)','Growth (established business in need of funds for expansion, assets, working capital etc)']::text[],
    ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance','Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)','Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['Fund partners','Development Finance Institutions (DFIs)']::text[],
    ''::text,
    'Achieved in most recent reporting period',
    'Targeted',
    'Balanced impact/financial return',
    ARRAY['Gender','Youth','Job creation']::text[],
    true,
    ARRAY['No Poverty','Zero Hunger','Good Health and Well-Being','Quality Education','Gender Equality','Clean Water and Sanitation','Affordable and Clean Energy','Decent Work and Economic Growth','Industry Innovation and Infrastructure','Reduced Inequalities','Sustainable Cities and Communities','Responsible Consumption and Production','Climate Action','Life Below Water','Life on Land','Peace, Justice, and Strong Institutions','Partnerships for the Goals']::text[],
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce','Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)','Have policies in place that promote gender equality (e.g. equal compensation)','Women are target beneficiaries of the product/service','Enterprise reports on specific gender related indicators to investors','Board member female representation (>33%)','Female CEO']::text[],
    ARRAY['Female staffing is ≥ 50%','Provide specific reporting on gender related indicators for your investors/funders']::text[],
    'Total raise by portfolio company',
    'Your investment amount',
    ARRAY['Common equity','Preferred equity (e.g. certain rights above those available to common equity holders)','Convertible notes','Shared revenue/earnings instruments','a mix of equity & convertible debt to also be considered']::text[],
    ARRAY['Sector agnostic']::text[],
    '4-5',
    '6-10',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 4,
      'Fundraising including access to working capital resources', 1,
      'Strategic / organizational planning', 5,
      'Product/services proof of concept /market share / competitor positioning', 5,
      'Human capital management – hiring/retention/training', 2,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 4,
      'Operations/ production / facilities and infrastructure', 1,
      'Management training', 3,
      'Other', 5
    ),
    ARRAY['Interest income/shared revenues and principal repayment','Dividends','Management buyout']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 5,
      'Fundraising with access to warehousing capital', 4,
      'Fundraising with access to grant capital for vehicle OPEX', 3,
      'Fundraising with access to TA support', 1,
      'Fund economics', 4,
      'Fund structuring', 5,
      'Investment process (eg origination, due diligence, structuring, closing)', 3,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 4,
      'Fund staff/Human capital management and development', 3,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 4,
      'Exit/monetization opportunities', 5,
      'Legal/regulatory support', 5,
      'Application of impact metrics', 5,
      'Other', 5
    ),
    'Significant negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - high impact',
      'Customer demand', 'To date - high impact',
      'Ability to pay staff salaries', 'To date - high impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact',
      'Ability to pay existing business loans', 'Anticipate no future impact',
      'Access to supply inputs / raw materials', 'To date - slight impact',
      'Ability to pay for raw inputs / raw materials', 'To date - high impact',
      'Need to pivot business model', 'Anticipate no future impact'
    ),
    ARRAY['No']::text[],
    ARRAY['Stabilize operations of existing portfolio companies','Growth capital for existing portfolio to increase market share','Growth capital for existing portfolio to enter new markets/expand business line(s)','New pipeline investments through existing vehicle','Technical assistance to support portfolio enterprises']::text[],
    ARRAY['Seek increased access to new LP funds internationally','Increase use of technology in order to lower fund operational costs','Increase use of data and technology to facilitate investment decisions','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[],
    '2',
    jsonb_build_object(
      'Fund Economics', 3,
      'LP Profiles', 2,
      'Market Data', 1,
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 3
    ),
    'None at the time',
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 2,
      'COVID-19 Response (peer discussion)', 1,
      'Fundraising (presentations from I&P, Capria & DGGF)', 1,
      'Portfolio Support (presentations from 10-Xe and AMI)', 2,
      'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 1,
      'Fundraising 2.0 (peer discussion)', 2,
      'Human Capital (peer discussion)', 1,
      'Co-investing workshop with ADAP (peer discussion)', 2,
      'Fundraising 3.0 – local capital (peer discussion)', 3,
      'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 'N/A',
      'Mentoring Pilot Kick-off', 'N/A'
    ),
    'None at the time',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 1,
      'Advocacy for early stage investing ', 2,
      'Raised profile/visibility (individual or collective)', 2,
      'Systems change to drive more capital towards local capital providers', 3
    ),
    true,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 2,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 1,
      'Mentoring program (expert led)', 3,
      'Mentoring program (peer-led)', 3,
      'Webinars with peer-to-peer feedback sessions', 2,
      'Webinars with expert-led feedback sessions', 2,
      'Fundraising Readiness Advisory Program for fund managers', 2,
      'Investment readiness for portfolio companies', 1,
      'Fund Manager Portal (ie library of resources, templates etc)', 1,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 3,
      'Joint back office between actively investing fund managers', 1
    ),
    'Not sure',
    ARRAY['Yes, open ended vehicles','Yes, early stage debt vehicles','Yes, early stage equity','Yes, gender lens investing']::text[],
    NULL

UNION ALL











-- 13) jason@viktoria.co.ke
SELECT
    'jason@viktoria.co.ke',
    'ViKtoria Business Angels Network',
    'Jason Musyoka',
    'Manager',
    ARRAY['Africa - East Africa'],
    ARRAY['Africa - East Africa'],
    'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)',
    'Legal entity',
    '1st close (or equivalent)',
    'First investment',
    NULL,
    'As of December 2020',
    'Angel co-investments, Open-ended vehicle / Limited liability company or equivalent',
    ARRAY['Convertible notes','SAFEs']::text[],
    'Current',
    'Target',
    '4-5 years',
    'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential), High-Growth Ventures (disruptive business models targeting large markets with high growth potential)',
    ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)']::text[],
    ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance','Inventory and working capital requirements']::text[],
    ARRAY['High Net Worth Individuals (HNWIs)','Development Finance Institutions (DFIs)']::text[],
    ''::text,
    'Targeted',
    'Financial return first',
    ARRAY['N/A']::text[],
    false,
    NULL,
    ARRAY['Investment Consideration']::text[],
    ARRAY[]::text[],
    ARRAY['None']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Convertible notes','SAFEs']::text[],
    ARRAY['Sector agnostic']::text[],
    '0',
    '< or = 2',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 3,
      'Fundraising including access to working capital resources', 2,
      'Strategic / organizational planning', 3,
      'Product/services proof of concept /market share / competitor positioning', 2,
      'Human capital management – hiring/retention/training', 4,
      'Technology (CRM, MIS, telecommunications, etc)', 4,
      'Legal / regulatory', 4,
      'Operations/ production / facilities and infrastructure', 4,
      'Management training', 4,
      'Other', 5
    ),
    ARRAY['Strategic sale/merger of company']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 1,
      'Fundraising with access to warehousing capital', 2,
      'Fundraising with access to grant capital for vehicle OPEX', 2,
      'Fundraising with access to TA support', 2,
      'Fund economics', 4,
      'Fund structuring', 4,
      'Investment process (eg origination, due diligence, structuring, closing)', 3,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
      'Fund staff/Human capital management and development', 4,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 4,
      'Exit/monetization opportunities', 3,
      'Legal/regulatory support', 4,
      'Application of impact metrics', 4,
      'Other', 5
    ),
    'Somewhat negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - slight impact',
      'Ability to pay staff salaries', 'To date - slight impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - slight impact',
      'Access to supply inputs / raw materials', 'To date - high impact',
      'Ability to pay for raw inputs / raw materials', 'To date - high impact',
      'Need to pivot business model', 'To date - slight impact'
    ),
    ARRAY['No']::text[],
    ARRAY['New pipeline investments through new vehicle']::text[],
    ARRAY['Seek increased access to new LP funds internationally','Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[],
    '4',
    jsonb_build_object(
      'Fund Economics', 5,
      'LP Profiles', 5,
      'Market Data', 4,
      'Purpose Definition', 4,
      'Access to Capital (DfID proposal)', 5
    ),
    'Not at the moment',
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 3,
      'COVID-19 Response (peer discussion)', 3,
      'Fundraising (presentations from I&P, Capria & DGGF)', 4,
      'Portfolio Support (presentations from 10-Xe and AMI)', 3,
      'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 4,
      'Fundraising 2.0 (peer discussion)', 4,
      'Human Capital (peer discussion)', 3,
      'Co-investing workshop with ADAP (peer discussion)', 3,
      'Fundraising 3.0 – local capital (peer discussion)', 4,
      'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 3,
      'Mentoring Pilot Kick-off', 'N/A'
    ),
    'Not at the moment',
    'WhatsApp only',
    jsonb_build_object(
      'Peer connections and peer learning', 5,
      'Advocacy for early stage investing ', 5,
      'Raised profile/visibility (individual or collective)', 3,
      'Systems change to drive more capital towards local capital providers', 3
    ),
    false,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 3,
      'TA facility to support early fund economics and activities', 3,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 2,
      'Mentoring program (peer-led)', 2,
      'Webinars with peer-to-peer feedback sessions', 2,
      'Webinars with expert-led feedback sessions', 3,
      'Fundraising Readiness Advisory Program for fund managers', 2,
      'Investment readiness for portfolio companies', 3,
      'Fund Manager Portal (ie library of resources, templates etc)', 2,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
      'Joint back office between actively investing fund managers', 1
    ),
    'Yes, as a mentee',
    ARRAY['No']::text[],
    'Found the sessions very valuable';

UNION ALL











-- 14) dayo@microtraction.com
SELECT
    'dayo@microtraction.com',
    'Microtraction',
    'Dayo Koleowo',
    'Partner',
    ARRAY['Africa - West Africa'],
    ARRAY['Pan-African'],
    'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics, Second fund/vehicle',
    'Legal entity',
    '1st close (or equivalent)',
    'First investment',
    'As of March 2020',
    'As of December 2020',
    'Open-ended vehicle / Limited liability company or equivalent',
    ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)','SAFEs']::text[],
    'Current',
    'Target',
    '8+ years',
    'High-Growth Ventures (disruptive business models targeting large markets with high growth potential)',
    ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)']::text[],
    ARRAY['Venture launch – invest in initial staff, product/services development and market acceptance','Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)']::text[],
    ARRAY['High Net Worth Individuals (HNWIs)','Angel network','Development Finance Institutions (DFIs)']::text[],
    ''::text,
    NULL,
    NULL,
    'Financial return first, Balanced impact/financial return',
    ARRAY['N/A']::text[],
    false,
    NULL,
    ARRAY[]::text[],
    ARRAY[]::text[],
    ARRAY['Female staffing is ≥ 50%','Provide specific reporting on gender related indicators for your investors/funders']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Preferred equity (e.g. certain rights above those available to common equity holders)','SAFEs']::text[],
    ARRAY['Sector agnostic']::text[],
    '2-3',
    '3-5',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 4,
      'Fundraising including access to working capital resources', 3,
      'Strategic / organizational planning', 5,
      'Product/services proof of concept /market share / competitor positioning', 4,
      'Human capital management – hiring/retention/training', 5,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 5,
      'Operations/ production / facilities and infrastructure', 4,
      'Management training', 3,
      'Other', 5
    ),
    ARRAY['Strategic sale/merger of company']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 2,
      'Fundraising with access to local LPs', 2,
      'Fundraising with access to warehousing capital', 5,
      'Fundraising with access to grant capital for vehicle OPEX', 3,
      'Fundraising with access to TA support', 2,
      'Fund economics', 2,
      'Fund structuring', 3,
      'Investment process (eg origination, due diligence, structuring, closing)', 3,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 3,
      'Fund staff/Human capital management and development', 3,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
      'Exit/monetization opportunities', 3,
      'Legal/regulatory support', 2,
      'Application of impact metrics', 4,
      'Other', 5
    ),
    'Somewhat positive impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - slight impact',
      'Ability to pay staff salaries', 'To date - slight impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - slight impact',
      'Ability to pay existing business loans', 'To date - no impact',
      'Access to supply inputs / raw materials', 'To date - no impact',
      'Ability to pay for raw inputs / raw materials', 'To date - no impact',
      'Need to pivot business model', 'To date - slight impact'
    ),
    ARRAY['No']::text[],
    ARRAY['New pipeline investments through new vehicle']::text[],
    ARRAY['Seek increased access to new LP funds locally','Increase use of technology in order to lower fund operational costs','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities']::text[],
    '2',
    jsonb_build_object(
      'Fund Economics', 'N/A',
      'LP Profiles', 'N/A',
      'Market Data', 'N/A',
      'Purpose Definition', 'N/A',
      'Access to Capital (DfID proposal)', 'N/A'
    ),
    'N/A',
    jsonb_build_object(
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
    'N/A',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 2,
      'Advocacy for early stage investing ', 'N/A',
      'Raised profile/visibility (individual or collective)', 3,
      'Systems change to drive more capital towards local capital providers', 'N/A'
    ),
    false,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 3,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 2,
      'Mentoring program (peer-led)', 2,
      'Webinars with peer-to-peer feedback sessions', 1,
      'Webinars with expert-led feedback sessions', 1,
      'Fundraising Readiness Advisory Program for fund managers', 2,
      'Investment readiness for portfolio companies', 1,
      'Fund Manager Portal (ie library of resources, templates etc)', 1,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 2,
      'Joint back office between actively investing fund managers', 2
    ),
    'Not sure',
    ARRAY['No']::text[],
    NULL

UNION ALL











-- 15) olivier.furdelle@terangacapital.com
SELECT
    'olivier.furdelle@terangacapital.com',
    'Teranga Capital',
    'Olivier Furdelle',
    'Managing Director',
    ARRAY['Africa - West Africa'],
    ARRAY['Africa - West Africa'],
    'Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics',
    'Legal entity',
    '1st close (or equivalent)',
    'First investment',
    'As of March 2020',
    'As of December 2020',
    'Open-ended vehicle / Limited liability company or equivalent',
    ARRAY['Common equity','Preferred equity (e.g. certain rights above those available to common equity holders)','Convertible notes','Shared revenue/earnings instruments','SAFEs','shareholders loans for working capital']::text[],
    'Current',
    'Target',
    '4-5 years',
    'Dynamic Enterprises (proven business models operating in established industries with moderate growth potential), Niche Ventures (innovative products/services targeting niche markets with growth ambitions), High-Growth Ventures (disruptive business models targeting large markets with high growth potential)',
    ARRAY['Early stage / seed (early revenue, product/service development, funds needed to expand business model)','Growth (established business in need of funds for expansion, assets, working capital etc)']::text[],
    ARRAY['Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)','Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)','Inventory and working capital requirements']::text[],
    ARRAY['Fund partners','High Net Worth Individuals (HNWIs)','Impact investing family offices','Donors/philanthropy','Corporates']::text[],
    ''::text,
    'Targeted',
    'Balanced impact/financial return, Impact investing (positive screening)',
    ARRAY['Job creation','N/A']::text[],
    false,
    NULL,
    ARRAY['Investment Consideration']::text[],
    ARRAY['Majority women ownership (>50%)','Greater than 33% of women in senior management','Women represent at least 33% - 50% of direct workforce','Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)','Have policies in place that promote gender equality (e.g. equal compensation)','Women are target beneficiaries of the product/service','Enterprise reports on specific gender related indicators to investors','Board member female representation (>33%)','Female CEO']::text[],
    ARRAY['Women representation on the board/investment committee is ≥ 50','Female staffing is ≥ 50%','Provide specific reporting on gender related indicators for your investors/funders','Board member female representation (>25%) in portfolio companies']::text[],
    'Your investment amount',
    'Total raise by portfolio company',
    ARRAY['Common equity','Preferred equity (e.g. certain rights above those available to common equity holders)','Convertible notes','Shared revenue/earnings instruments','SAFEs','shareholders loans for working capital']::text[],
    ARRAY['Sector agnostic']::text[],
    '4-5',
    '6-10',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 1,
      'Fundraising including access to working capital resources', 1,
      'Strategic / organizational planning', 1,
      'Product/services proof of concept /market share / competitor positioning', 1,
      'Human capital management – hiring/retention/training', 2,
      'Technology (CRM, MIS, telecommunications, etc)', 3,
      'Legal / regulatory', 2,
      'Operations/ production / facilities and infrastructure', 2,
      'Management training', 1,
      'Other', 1
    ),
    ARRAY['Interest income/shared revenues and principal repayment','Other types of self-liquidating repayment structures','Strategic sale/merger of company','Financial investor take-out']::text[],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 3,
      'Fundraising with access to local LPs', 1,
      'Fundraising with access to warehousing capital', 1,
      'Fundraising with access to grant capital for vehicle OPEX', 1,
      'Fundraising with access to TA support', 3,
      'Fund economics', 4,
      'Fund structuring', 3,
      'Investment process (eg origination, due diligence, structuring, closing)', 1,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 2,
      'Fund staff/Human capital management and development', 1,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 4,
      'Exit/monetization opportunities', 3,
      'Legal/regulatory support', 3,
      'Application of impact metrics', 3,
      'Other', 3
    ),
    'Significant negative impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - slight impact',
      'Ability to pay staff salaries', 'To date - high impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - high impact',
      'Ability to pay existing business loans', 'To date - high impact',
      'Access to supply inputs / raw materials', 'To date - high impact',
      'Ability to pay for raw inputs / raw materials', 'To date - high impact',
      'Need to pivot business model', 'To date - high impact'
    ),
    ARRAY['Yes, grant funding (financial)','Yes, non-financial assistance']::text[],
    ARRAY['Stabilize operations of existing portfolio companies','New pipeline investments through existing vehicle','Technical assistance to support portfolio enterprises']::text[],
    ARRAY['Seek increased access to new LP funds locally','Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)','Build new partnerships for joint co-investment opportunities, expand pipeline opportunities','diversification of activities to enhance business model economics']::text[],
    '2',
    jsonb_build_object(
      'Fund Economics', 2,
      'LP Profiles', 3,
      'Market Data', 3,
      'Purpose Definition', 1,
      'Access to Capital (DfID proposal)', 'N/A'
    ),
    'Not at this stage',
    jsonb_build_object(
      'Gender lens investing (facilitated by Suzanne Biegel)', 'N/A',
      'COVID-19 Response (peer discussion)', 1,
      'Fundraising (presentations from I&P, Capria & DGGF)', 2,
      'Portfolio Support (presentations from 10-Xe and AMI)', 2,
      'SGB COVID-19 Capital Bridge Facility (presentation from CFF)', 1,
      'Fundraising 2.0 (peer discussion)', 1,
      'Human Capital (peer discussion)', 2,
      'Co-investing workshop with ADAP (peer discussion)', 1,
      'Fundraising 3.0 – local capital (peer discussion)', 'N/A',
      'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)', 'N/A',
      'Mentoring Pilot Kick-off', 'N/A'
    ),
    'Not at this stage',
    'Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)',
    jsonb_build_object(
      'Peer connections and peer learning', 1,
      'Advocacy for early stage investing ', 3,
      'Raised profile/visibility (individual or collective)', 2,
      'Systems change to drive more capital towards local capital providers', 3
    ),
    true,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 1,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 1,
      'Mentoring program (peer-led)', 1,
      'Webinars with peer-to-peer feedback sessions', 1,
      'Webinars with expert-led feedback sessions', 1,
      'Fundraising Readiness Advisory Program for fund managers', 3,
      'Investment readiness for portfolio companies', 3,
      'Fund Manager Portal (ie library of resources, templates etc)', 2,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 1,
      'Joint back office between actively investing fund managers', 2
    ),
    'Yes, as a mentor, Yes, as a mentee',
    ARRAY['Yes, open ended vehicles','Yes, early stage equity','Yes, angel investing / engaging local co-investors']::text[],
    'not at this stage';

UNION ALL











  -- 43) cathy@fyrefem.com
  SELECT
    'cathy@fyrefem.com',
    'FyreFem Fund Managers',
    'Cathy Goddard',
    'CEO',
    ARRAY['Africa - Southern Africa'],
    ARRAY['South Africa only'],
    'Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics), Doing deals on a deal-by-deal basis',
    'Legal entity',
    NULL,
    'First investment',
    'As of March 2020, As of December 2020',
    'As of March 2020, As of December 2020',
    NULL,
    ARRAY['Open-ended vehicle / Limited liability company or equivalent'],
    'Current',
    'Target',
    '6-7 years',
    ARRAY['Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)','Distressed businesses also = we have a Fix and Build strategy'],
    ARRAY['Growth (established business in need of funds for expansion, assets, working capital etc)','Distressed businesses also'],
    ARRAY['Major capital investments (facilities, production equipment, fleet/logistics, etc.)','Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)','Inventory and working capital requirements','Bolt on acquisitions'],
    ARRAY['Fund partners','Local pension funds','High Net Worth Individuals (HNWIs)','Development Finance Institutions (DFIs)','Impact investing family offices','Donors/philanthropy'],
    'Achieved in most recent reporting period',
    'Targeted',
    'Impact investing (positive screening)',
    ARRAY['Gender','Job creation'],
    true,
    'First',
    NULL,
    NULL,
    ARRAY['First']::text[],
    ARRAY['Women ownership/participation interest is ≥ 50%','Women representation on the board/investment committee is ≥ 50','Female staffing is ≥ 50%','51% Black women owned']::text[],
    ARRAY[]::text[],
    'Your investment amount, Total raise by portfolio company',
    'Total raise by portfolio company, Total raise by portfolio company',
    ARRAY['Common equity','Preferred equity (e.g. certain rights above those available to common equity holders)','Senior debt','Mezzanine debt'],
    ARRAY['Agriculture / Food supply chain','Financial Inclusion / Insurance / Fintech','Healthcare','Manufacturing','Technology / ICT / Telecommunications','General services'],
    '2-3',
    '< or = 2',
    jsonb_build_object(
      'Finance, budgeting, accounting, cash and tax management', 3,
      'Fundraising including access to working capital resources', 1,
      'Strategic / organizational planning', 1,
      'Product/services proof of concept /market share / competitor positioning', 5,
      'Human capital management – hiring/retention/training', 3,
      'Technology (CRM, MIS, telecommunications, etc)', 4,
      'Legal / regulatory', 3,
      'Operations/ production / facilities and infrastructure', 5,
      'Management training', 4,
      'Other', 3
    ),
    ARRAY['Interest income/shared revenues and principal repayment','Dividends','Strategic sale/merger of company','These are planned exits. None yet'],
    '0',
    jsonb_build_object(
      'Fundraising with access to global LPs', 1,
      'Fundraising with access to local LPs', 1,
      'Fundraising with access to warehousing capital', 2,
      'Fundraising with access to grant capital for vehicle OPEX', 3,
      'Fundraising with access to TA support', 2,
      'Fund economics', 1,
      'Fund structuring', 1,
      'Investment process (eg origination, due diligence, structuring, closing)', 2,
      'Post investment process (eg monitoring, reporting, exits, Technical Assistance)', 4,
      'Fund staff/Human capital management and development', 5,
      'Back office (financial/impact reporting, accounting, CFO, software, templates, etc)', 3,
      'Exit/monetization opportunities', 2,
      'Legal/regulatory support', 1,
      'Application of impact metrics', 1,
      'Other', 3
    ),
    'Somewhat positive impact',
    jsonb_build_object(
      'Staff attendance', 'To date - slight impact',
      'Customer demand', 'To date - high impact',
      'Ability to pay staff salaries', 'To date - no impact',
      'Ability to pay fixed operating cost (eg rent, etc.)', 'To date - no impact',
      'Ability to pay existing business loans', 'To date - no impact',
      'Access to supply inputs / raw materials', 'To date - no impact',
      'Ability to pay for raw inputs / raw materials', 'To date - no impact',
      'Need to pivot business model', 'To date - no impact'
    ),
    ARRAY['No']::text[],
    ARRAY['New pipeline investments through existing vehicle','New pipeline investments through new vehicle','Technical assistance to support portfolio enterprises'],
    ARRAY['Seek increased access to new LP funds internationally','Continue dealmaking with another 2 in 2021'],
    '2',
    jsonb_build_object(
      'Fund Economics', 'N/A',
      'LP Profiles', 1,
      'Market Data', 'N/A',
      'Purpose Definition', 1,
      'Access to Capital (DfID proposal)', 1
    ),
    'Hands on workshops on using free resources eg  Impact toolkits eg IRIS+ or FMO ESG toolkit (launched today)',
    'WhatsApp only',
    jsonb_build_object(
      'Peer connections and peer learning', 1,
      'Advocacy for early stage investing ', 1,
      'Raised profile/visibility (individual or collective)', 1,
      'Systems change to drive more capital towards local capital providers', 1
    ),
    true,
    jsonb_build_object(
      'Warehousing/seed funding for fund managers to build track record', 1,
      'TA facility to support early fund economics and activities', 1,
      'Advocacy for the early-stage investing ecosystem', 2,
      'Mentoring program (expert led)', 1,
      'Mentoring program (peer-led)', 1,
      'Webinars with peer-to-peer feedback sessions', 3,
      'Webinars with expert-led feedback sessions', 2,
      'Fundraising Readiness Advisory Program for fund managers', 1,
      'Investment readiness for portfolio companies', 1,
      'Fund Manager Portal (ie library of resources, templates etc)', 1,
      'Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)', 3
    ),
    'Not sure',
    ARRAY['No']::text[],
    'Thanks for all the hard work'
),











users AS (
  SELECT r.*, u.id AS user_id
  FROM raw_rows r
  JOIN auth.users u ON lower(u.email) = lower(r.email)
),

-- Email-based overrides for the five fields you asked to drive for all 43 members
overrides AS (
  SELECT lower(v.email) AS email,
         v.present_connection_session,
         v.participate_mentoring_program,
         v.present_demystifying_session,
         v.additional_comments
  FROM (VALUES
    ('roeland@iungocapital.com', false, 'Yes, as a mentor, Yes, as a mentee', ARRAY['Yes, open ended vehicles','Yes, gender lens investing','Yes, angel investing / engaging local co-investors'], NULL),
    ('brendan@sechacapital.com', true,  'Yes, as a mentor, Yes, as a mentee', ARRAY['Yes, early stage equity'], 'NA'),
    ('tony@kinyungu.com',        true,  'Not sure',                            ARRAY[]::text[],                                                 NULL),
    ('cathy@fyrefem.com',        true,  'Not sure',                            ARRAY[]::text[],                                                 'Thanks for all the hard work'),
    ('william.prothais@uberiscapital.com', false, 'Yes, as a mentee', ARRAY[]::text[], 'open discussion with peers were very interesting and insightful'),
    ('vfraser@jengacapital.com', false, 'Yes, as a mentee', ARRAY[]::text[], 'n/a'),
    ('chai@vakayi.com',          false, 'Yes, as a mentee', ARRAY[]::text[], 'Capital raising needs to receive much more attention. Without ultimately securing capital everything else becomes redudant.'),
    ('jaap-jan@truvalu-group.com', true, 'No', ARRAY['Yes, open ended vehicles'], 'I don''t know :-('),
    ('jenny@amamventures.com',   false, 'Yes, as a mentor, Yes, as a mentee', ARRAY[]::text[], 'you have done so many already! If possible, would really like to get access to previous webinars'),
    ('ali.alsuhail@kapita.iq',   false, 'Not sure', ARRAY[]::text[], NULL),
    ('lavanya@vestedworld.com',  false, 'Not sure', ARRAY[]::text[], NULL),
    ('josh@balloonventures.com', false, 'Yes, as a mentee', ARRAY[]::text[], NULL),
    ('oeharmon@gemicap.com',     false, 'Not sure', ARRAY['Yes, open ended vehicles','Yes, early stage debt vehicles','Yes, early stage equity','Yes, gender lens investing'], NULL),
    ('jason@viktoria.co.ke',     false, 'Yes, as a mentee', ARRAY[]::text[], 'Found the sessions very valuable'),
    ('dayo@microtraction.com',   false, 'Not sure', ARRAY[]::text[], NULL),
    ('olivier.furdelle@terangacapital.com', true, 'Yes, as a mentor, Yes, as a mentee', ARRAY['Yes, open ended vehicles','Yes, early stage equity','Yes, angel investing / engaging local co-investors'], 'not at this stage'),
    ('lsz@nordicimpactfunds.com', false, 'Yes, as a mentee', ARRAY[]::text[], 'Thanks so much for your support!'),
    ('ambar@ibtikarfund.com',    true,  'Yes, as a mentor', ARRAY['Yes, early stage equity'], NULL),
    ('shiva@ankurcapital.com',   true,  'Not sure', ARRAY[]::text[], NULL),
    ('lmramba@gbfund.org',       true,  'No', ARRAY[]::text[], 'I''d love to see something that talks about the climate + gender nexus and how to operationalize it in funds'),
    ('klegesi@ortusafrica.com',  false, 'Yes, as a mentee', ARRAY[]::text[], 'None'),
    ('andylower@adapcapital.com', true, 'Not sure', ARRAY['Yes, gender lens investing'], 'Would love to find more options for exits, both for funds rather than individual deals but aware that is not where the vast majority of the network is at.'),
    ('lkefela@gmail.com',        false, 'Yes, as a mentee', ARRAY[]::text[], NULL),
    ('kenza@outlierz.co',        false, 'Yes, as a mentee', ARRAY[]::text[], 'That was a long survey :) Thank you and great job!'),
    ('shuyin@beaconfund.asia',   false, 'Not sure', ARRAY[]::text[], NULL),
    ('ldavis@renewstrategies.com', false, 'No, for me right now, it''s just a time issue.', ARRAY['Yes, gender lens investing','Yes, angel investing / engaging local co-investors'], 'really appreciate all your work, how you add value every time we can engage. '),
    ('stawia@gmail.com',         false, 'Yes, as a mentee', ARRAY['Yes, angel investing / engaging local co-investors'], NULL),
    ('victor.ndiege@kcv.co.ke',  false, 'No', ARRAY[]::text[], NULL),
    ('fngenyi@sycomore-venture.com', false, 'Yes, as a mentee', ARRAY[]::text[], 'N/A'),
    ('sam@mirepacapital.com',    true,  'Yes, as a mentor, Yes, as a mentee, Only if the mentor can bring relevant support at this stage in our business', ARRAY[]::text[], NULL),
    ('edioh@wic-capital.net',    false, 'Yes, as a mentee', ARRAY[]::text[], 'Looking forward to the convening :)'),
    ('idris.bello@loftyincltd.biz', false, 'Not sure', ARRAY[]::text[], NULL),
    ('annan.anthony@gmail.com',  false, 'Not sure', ARRAY[]::text[], 'N/A'),
    ('arthi.ramasubramanian@opesfund.eu', false, 'Not sure', ARRAY[]::text[], NULL),
    ('e.arthur@wangaracapital.com', false, 'Not sure', ARRAY['Yes, open ended vehicles'], 'None'),
    ('sagar@firstfollowers.co',  true,  'Yes, as a mentor, Yes, as a mentee, Not sure', ARRAY['Yes, early stage debt vehicles','Yes, early stage equity','Yes, angel investing / engaging local co-investors'], 'NA'),
    ('i.sidibe@comoecapital.com', false, 'Yes but just as attendee. I don''t know how it works', ARRAY['Yes, open ended vehicles','Yes, early stage debt vehicles'], NULL),
    ('victoria@gc.fund',         false, 'Not sure', ARRAY[]::text[], 'Well done to the CFF team for the amazing work you do. We are most grateful. Warm regards'),
    ('lkamara@sahelinvest.com',  false, 'No', ARRAY[]::text[], NULL),
    ('alberto@co.org.mx',        false, 'Not sure', ARRAY['Yes, open ended vehicles','Yes, early stage debt vehicles'], 'Nothing else. Thank you.'),
    ('karthik@sangam.vc',        false, 'Yes, as a mentor, Yes, as a mentee', ARRAY[]::text[], 'Too late'),
    ('e.cotsoyannis@miarakap.com', false, 'No', ARRAY[]::text[], 'no'),
    ('klakhani@invest2innovate.com', false, 'Yes, as a mentor', ARRAY[]::text[], NULL)
  ) AS v(email, present_connection_session, participate_mentoring_program, present_demystifying_session, additional_comments)
),

_erase AS (
  DELETE FROM public.survey_responses_2021 s
  USING users u
  WHERE s.user_id = u.user_id
  RETURNING s.user_id
)

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
  u.user_id,
  u.firm_name,
  u.participant_name,
  u.role_title,
  u.team_based,
  u.geographic_focus,
  u.fund_stage,
  u.legal_entity_date,
  u.first_close_date,
  u.first_investment_date,
  u.investments_march_2020,
  u.investments_december_2020,
  u.optional_supplement,
  u.investment_vehicle_type,
  u.current_fund_size,
  u.target_fund_size,
  u.investment_timeframe,
  u.business_model_targeted,
  u.business_stage_targeted,
  u.financing_needs,
  u.target_capital_sources,
  u.target_irr_achieved,
  u.target_irr_targeted,
  u.impact_vs_financial_orientation,
  u.explicit_lens_focus,
  u.report_sustainable_development_goals,
  u.top_sdg_1,
  u.top_sdg_2,
  u.top_sdg_3,
  u.gender_considerations_investment,
  u.gender_considerations_requirement,
  u.gender_fund_vehicle,
  u.investment_size_your_amount,
  u.investment_size_total_raise,
  u.investment_forms,
  u.target_sectors,
  u.carried_interest_principals,
  u.current_ftes,
  u.portfolio_needs_ranking,
  u.investment_monetization,
  u.exits_achieved,
  u.fund_capabilities_ranking,
  u.covid_impact_aggregate,
  u.covid_impact_portfolio,
  u.covid_government_support,
  u.raising_capital_2021,
  u.fund_vehicle_considerations,
  u.network_value_rating,
  u.working_groups_ranking,
  u.new_working_group_suggestions,
  u.webinar_content_ranking,
  u.new_webinar_suggestions,
  u.communication_platform,
  u.network_value_areas,
  COALESCE(o.present_connection_session, false),
  u.convening_initiatives_ranking,
  COALESCE(o.participate_mentoring_program, u.participate_mentoring_program),
  COALESCE(o.present_demystifying_session, u.present_demystifying_session),
  COALESCE(o.additional_comments, u.additional_comments),
  now(),
  now(),
  now()
FROM users u
LEFT JOIN overrides o
  ON lower(u.email) = o.email;

COMMIT;