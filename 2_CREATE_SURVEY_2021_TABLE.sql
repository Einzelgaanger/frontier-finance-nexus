-- =====================================================
-- 2021 SURVEY TABLE - COMPREHENSIVE SCHEMA
-- Based on actual CFF2021.xlsx structure (167 columns, 43 rows)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.survey_responses_2021 (
    -- Primary Key & Metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    
    -- Timestamps (from Excel)
    timestamp TIMESTAMPTZ,
    
    -- Basic Information (Columns 2-5)
    email_address TEXT NOT NULL,
    firm_name TEXT, -- "1. Name of firm"
    participant_name TEXT, -- "2. Name of participant"
    role_title TEXT, -- "3. Role / title of participant"
    
    -- Section 1: Team & Geography (Columns 6-7)
    team_based TEXT[], -- "4. Where is your team based?" (multiple selection)
    geographic_focus TEXT[], -- "5. What is the geographic focus of your fund/vehicle?" (multiple selection)
    fund_stage TEXT, -- "6. What is the stage of your current fund/vehicle's operations?"
    
    -- Section 2: Fund Timeline (Columns 9-22) - Question 7
    -- "When did your current fund/investment vehicle achieve each of the following?"
    timeline_na TEXT, -- [N/A]
    timeline_prior_2000 TEXT, -- [Prior to 2000]
    timeline_2000_2010 TEXT, -- [2000-2010]
    timeline_2011 TEXT, -- [2011]
    timeline_2012 TEXT, -- [2012]
    timeline_2013 TEXT, -- [2013]
    timeline_2014 TEXT, -- [2014]
    timeline_2015 TEXT, -- [2015]
    timeline_2016 TEXT, -- [2016]
    timeline_2017 TEXT, -- [2017]
    timeline_2018 TEXT, -- [2018]
    timeline_2019 TEXT, -- [2019]
    timeline_2020 TEXT, -- [2020]
    timeline_2021 TEXT, -- [2021]
    
    -- Section 3: Number of Investments (Columns 23-28) - Question 8
    -- "Please specify the number of investments made to date by your current vehicle"
    investments_0 TEXT, -- [0]
    investments_1_4 TEXT, -- [1-4]
    investments_5_9 TEXT, -- [5-9]
    investments_10_14 TEXT, -- [10-14]
    investments_15_24 TEXT, -- [15-24]
    investments_25_plus TEXT, -- [25+]
    
    -- Column 29 - Question 9
    optional_supplement TEXT, -- Optional supplement to question above
    
    -- Section 4: Investment Vehicle (Columns 30-37) - Questions 10-12
    investment_vehicle_type TEXT[], -- "10. Type of investment vehicle" (multiple selection)
    
    -- Question 11: Fund size
    fund_size_under_1m TEXT, -- [< $1 million]
    fund_size_1_4m TEXT, -- [$1-4 million]
    fund_size_5_9m TEXT, -- [$5-9 million]
    fund_size_10_19m TEXT, -- [$10-19 million]
    fund_size_20_29m TEXT, -- [$20-29 million]
    fund_size_30m_plus TEXT, -- [$30 million or more]
    
    investment_timeframe TEXT, -- "12. Typical investment timeframe"
    
    -- Section 5: Business Model & Stage (Columns 38-40) - Questions 13-15
    business_model_targeted TEXT[], -- "13. Type of business model targeted" (multiple selection)
    business_stage_targeted TEXT[], -- "14. Stage of business model targeted" (multiple selection)
    financing_needs TEXT[], -- "15. Key financing needs of portfolio enterprises" (multiple selection)
    
    -- Section 6: Capital Sources & Returns (Columns 41-47) - Questions 16-18
    target_capital_sources TEXT[], -- "16. Target sources of capital for your fund" (multiple selection)
    
    -- Question 17: Target IRR
    target_irr_under_5 TEXT, -- [< or = 5%]
    target_irr_6_9 TEXT, -- [6-9%]
    target_irr_10_15 TEXT, -- [10-15%]
    target_irr_16_20 TEXT, -- [16-20%]
    target_irr_20_plus TEXT, -- [20%+]
    
    impact_vs_financial_orientation TEXT, -- "18. How would you frame the impact vs financial return orientation?"
    
    -- Section 7: Impact & SDGs (Columns 48-66) - Questions 19-21
    explicit_lens_focus TEXT[], -- "19. Does your fund/vehicle have an explicit lens/focus?" (multiple selection)
    report_sdgs BOOLEAN, -- "20. Does your fund/investment vehicle specifically report any SDGs?"
    
    -- Question 21: Top 3 SDGs (each can be ranked: First, Second, Third, Others)
    sdg_no_poverty TEXT, -- [No Poverty]
    sdg_zero_hunger TEXT, -- [Zero Hunger]
    sdg_good_health TEXT, -- [Good Health and Well-Being]
    sdg_quality_education TEXT, -- [Quality Education]
    sdg_gender_equality TEXT, -- [Gender Equality]
    sdg_clean_water TEXT, -- [Clean Water and Sanitation]
    sdg_clean_energy TEXT, -- [Affordable and Clean Energy]
    sdg_decent_work TEXT, -- [Decent Work and Economic Growth]
    sdg_industry_innovation TEXT, -- [Industry Innovation and Infrastructure]
    sdg_reduced_inequalities TEXT, -- [Reduced Inequalities]
    sdg_sustainable_cities TEXT, -- [Sustainable Cities and Communities]
    sdg_responsible_consumption TEXT, -- [Responsible Consumption and Production]
    sdg_climate_action TEXT, -- [Climate Action]
    sdg_life_below_water TEXT, -- [Life Below Water]
    sdg_life_on_land TEXT, -- [Life on Land]
    sdg_peace_justice TEXT, -- [Peace, Justice, and Strong Institutions]
    sdg_partnerships TEXT, -- [Partnerships for the Goals]
    
    -- Section 8: Gender Considerations (Columns 67-77) - Questions 22-23
    -- Question 22: Gender considerations when making investment decisions
    gender_majority_women_ownership TEXT, -- [Majority women ownership (>50%)]
    gender_women_senior_mgmt TEXT, -- [Greater than 33% of women in senior management]
    gender_women_direct_workforce TEXT, -- [Women represent at least 33% - 50% of direct workforce]
    gender_women_indirect_workforce TEXT, -- [Women represent at least 33% - 50% of indirect workforce]
    gender_equality_policies TEXT, -- [Have policies in place that promote gender equality]
    gender_women_beneficiaries TEXT, -- [Women are target beneficiaries of the product/service]
    gender_reporting_indicators TEXT, -- [Enterprise reports on specific gender related indicators]
    gender_board_representation TEXT, -- [Board member female representation (>33%)]
    gender_female_ceo TEXT, -- [Female CEO]
    gender_other TEXT, -- [Other]
    
    gender_fund_vehicle TEXT[], -- "23. Do any of the following apply to your fund/vehicle?" (multiple selection)
    
    -- Section 9: Investment Size (Columns 78-84) - Question 24
    -- "What is the typical size of investment in your portfolio companies?"
    investment_size_under_100k TEXT, -- [<$100,000]
    investment_size_100k_199k TEXT, -- [$100,000 - $199,000]
    investment_size_200k_499k TEXT, -- [$200,000 - $499,000]
    investment_size_500k_999k TEXT, -- [$500,000 - $999,000]
    investment_size_1m_2m TEXT, -- [$1,000,000 - $1,999,000]
    investment_size_2m_plus TEXT, -- [≥$2,000,000]
    
    -- Section 10: Investment Details (Columns 85-87) - Questions 25-28
    investment_forms TEXT[], -- "25. What forms of investment do you typically make?" (multiple selection)
    target_sectors TEXT[], -- "26. What are your target investment sectors/focus areas?" (multiple selection)
    carried_interest_principals TEXT, -- "27. Number of current carried-interest/equity-interest principals"
    current_ftes TEXT, -- "28. Number of current Full Time Equivalent staff members"
    
    -- Section 11: Portfolio Needs (Columns 88-97) - Question 29
    -- "During the first 3 years of an investment, what are the key needs? (1=highest, 5=lowest)"
    portfolio_need_finance_budgeting TEXT, -- [Finance, budgeting, accounting, cash and tax management]
    portfolio_need_fundraising TEXT, -- [Fundraising including access to working capital]
    portfolio_need_strategic_planning TEXT, -- [Strategic / organizational planning]
    portfolio_need_product_market TEXT, -- [Product/services proof of concept / market share]
    portfolio_need_human_capital TEXT, -- [Human capital management]
    portfolio_need_technology TEXT, -- [Technology (CRM, MIS, telecommunications)]
    portfolio_need_legal_regulatory TEXT, -- [Legal / regulatory]
    portfolio_need_operations TEXT, -- [Operations/ production / facilities]
    portfolio_need_management_training TEXT, -- [Management training]
    portfolio_need_other TEXT, -- [Other]
    
    -- Section 12: Exits (Columns 98-99) - Questions 30-31
    investment_monetization TEXT[], -- "30. What is the typical form of investment monetization/exit?" (multiple selection)
    exits_achieved TEXT, -- "31. How many exits has your vehicle achieved to date?"
    
    -- Section 13: Fund Capabilities (Columns 100-114) - Question 32
    -- "Fund capabilities and resources – areas of desired investment/support (1=highest, 5=lowest)"
    fund_capability_global_lps TEXT, -- [Fundraising with access to global LPs]
    fund_capability_local_lps TEXT, -- [Fundraising with access to local LPs]
    fund_capability_warehousing TEXT, -- [Fundraising with access to warehousing capital]
    fund_capability_grant_opex TEXT, -- [Fundraising with access to grant capital for vehicle OPEX]
    fund_capability_ta_support TEXT, -- [Fundraising with access to TA support]
    fund_capability_economics TEXT, -- [Fund economics]
    fund_capability_structuring TEXT, -- [Fund structuring]
    fund_capability_investment_process TEXT, -- [Investment process]
    fund_capability_post_investment TEXT, -- [Post investment process]
    fund_capability_human_capital TEXT, -- [Fund staff/Human capital management]
    fund_capability_back_office TEXT, -- [Back office]
    fund_capability_exit_opportunities TEXT, -- [Exit/monetization opportunities]
    fund_capability_legal_regulatory TEXT, -- [Legal/regulatory support]
    fund_capability_impact_metrics TEXT, -- [Application of impact metrics]
    fund_capability_other TEXT, -- [Other]
    
    -- Section 14: COVID-19 Impact (Columns 115-125) - Questions 33-35
    covid_impact_aggregate TEXT, -- "33. At an aggregate level, indicate the impact of COVID-19"
    
    -- Question 34: COVID-19 impact on portfolio aspects
    covid_impact_staff_attendance TEXT, -- [Staff attendance]
    covid_impact_customer_demand TEXT, -- [Customer demand]
    covid_impact_pay_salaries TEXT, -- [Ability to pay staff salaries]
    covid_impact_fixed_costs TEXT, -- [Ability to pay fixed operating cost]
    covid_impact_business_loans TEXT, -- [Ability to pay existing business loans]
    covid_impact_supply_access TEXT, -- [Access to supply inputs / raw materials]
    covid_impact_pay_inputs TEXT, -- [Ability to pay for raw inputs]
    covid_impact_pivot_model TEXT, -- [Need to pivot business model]
    
    covid_government_support TEXT[], -- "35. Have you received any government support?" (multiple selection)
    
    -- Section 15: Future Plans (Columns 126-127) - Questions 36-37
    raising_capital_2021 TEXT[], -- "36. Do you anticipating raising new LP/investor funds in 2021?" (multiple selection)
    fund_vehicle_considerations TEXT[], -- "37. Regarding your current fund, which is under consideration?" (multiple selection)
    
    -- Section 16: Network Value (Columns 128-147) - Questions 38-44
    network_value_rating TEXT, -- "38. How valuable have you found your participation in the ESCP network?"
    
    -- Question 39: Working groups value (1=most valuable, 5=least valuable)
    working_group_fund_economics TEXT, -- [Fund Economics]
    working_group_lp_profiles TEXT, -- [LP Profiles]
    working_group_market_data TEXT, -- [Market Data]
    working_group_purpose_definition TEXT, -- [Purpose Definition]
    working_group_access_capital TEXT, -- [Access to Capital]
    
    working_group_suggestions TEXT, -- "40. Suggestions of new working group topics?"
    
    -- Question 41: Webinar content value (1=most valuable, 5=least valuable)
    webinar_gender_lens TEXT, -- [Gender lens investing]
    webinar_covid_response TEXT, -- [COVID-19 Response]
    webinar_fundraising TEXT, -- [Fundraising]
    webinar_portfolio_support TEXT, -- [Portfolio Support]
    webinar_sgb_bridge TEXT, -- [SGB COVID-19 Capital Bridge Facility]
    webinar_fundraising_2 TEXT, -- [Fundraising 2.0]
    webinar_human_capital TEXT, -- [Human Capital]
    webinar_coinvesting TEXT, -- [Co-investing workshop with ADAP]
    webinar_fundraising_3 TEXT, -- [Fundraising 3.0 – local capital]
    webinar_ag_food_tech TEXT, -- [Ag/food tech]
    webinar_mentoring_pilot TEXT, -- [Mentoring Pilot Kick-off]
    
    webinar_suggestions TEXT, -- "42. Suggestions of new webinar topics?"
    
    communication_platform TEXT, -- "43. Do you prefer Slack or WhatsApp?"
    
    -- Question 44: Main areas of value (1=most valuable, 5=least valuable)
    network_value_peer_connections TEXT, -- [Peer connections and peer learning]
    network_value_advocacy TEXT, -- [Advocacy for early stage investing]
    network_value_visibility TEXT, -- [Raised profile/visibility]
    network_value_systems_change TEXT, -- [Systems change to drive more capital]
    
    -- Section 17: Convening Sessions (Columns 151-166) - Questions 45-48
    present_connection_session TEXT, -- "45. Would you like to present in Session 1?"
    
    -- Question 46: Interest in initiatives (1=very interested, 2=possibly, 3=not interested)
    initiative_warehousing TEXT, -- [Warehousing/seed funding]
    initiative_ta_facility TEXT, -- [TA facility to support early fund economics]
    initiative_advocacy TEXT, -- [Advocacy for the early-stage investing ecosystem]
    initiative_mentoring_expert TEXT, -- [Mentoring program (expert led)]
    initiative_mentoring_peer TEXT, -- [Mentoring program (peer-led)]
    initiative_webinars_peer TEXT, -- [Webinars with peer-to-peer feedback]
    initiative_webinars_expert TEXT, -- [Webinars with expert-led feedback]
    initiative_fundraising_advisory TEXT, -- [Fundraising Readiness Advisory Program]
    initiative_investment_readiness TEXT, -- [Investment readiness for portfolio companies]
    initiative_fund_manager_portal TEXT, -- [Fund Manager Portal]
    initiative_shared_data TEXT, -- [Shared financial and impact performance data]
    initiative_joint_back_office TEXT, -- [Joint back office]
    initiative_other TEXT, -- [Other]
    
    participate_mentoring_program TEXT, -- "47. Would you be interested in participating in a peer mentoring program?"
    
    present_demystifying_session TEXT[], -- "48. Would you like to present in Session 4?" (multiple selection)
    
    -- Additional Comments (Column 167)
    additional_comments TEXT, -- "49. Any other comments / feedback?"
    
    -- System Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_survey_2021_user_id ON public.survey_responses_2021(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_2021_company_name ON public.survey_responses_2021(company_name);
CREATE INDEX IF NOT EXISTS idx_survey_2021_email ON public.survey_responses_2021(email_address);
CREATE INDEX IF NOT EXISTS idx_survey_2021_firm_name ON public.survey_responses_2021(firm_name);
CREATE INDEX IF NOT EXISTS idx_survey_2021_completed_at ON public.survey_responses_2021(completed_at);
CREATE INDEX IF NOT EXISTS idx_survey_2021_timestamp ON public.survey_responses_2021(timestamp);

-- Enable Row Level Security
ALTER TABLE public.survey_responses_2021 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own 2021 surveys"
    ON public.survey_responses_2021 FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own 2021 surveys"
    ON public.survey_responses_2021 FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own 2021 surveys"
    ON public.survey_responses_2021 FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins and members can view all 2021 surveys"
    ON public.survey_responses_2021 FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND user_role IN ('admin', 'member')
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_survey_2021_updated_at
    BEFORE UPDATE ON public.survey_responses_2021
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE '2021 Survey Table Created Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Table: survey_responses_2021';
    RAISE NOTICE 'Total Columns: 167 data fields + metadata';
    RAISE NOTICE 'Based on: CFF2021.xlsx (43 responses)';
    RAISE NOTICE 'RLS Enabled: Yes';
    RAISE NOTICE 'Indexes Created: 6';
    RAISE NOTICE '========================================';
END $$;
