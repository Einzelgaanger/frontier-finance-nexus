"""
PART 2: Mapping Function for 2021 Survey - Columns 78-167
This will be imported by the main script
"""

def map_excel_to_db_part2(row, clean_text, parse_array_field):
    """Map columns 78-167 of Excel to database fields"""
    
    data = {}
    
    # Q24: Investment Size - 6 fields (Columns 78-83)
    data["investment_size_under_100k"] = clean_text(row.get('24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [<$100,000]'))
    data["investment_size_100k_199k"] = clean_text(row.get('24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [$100,000 - $199,000]'))
    data["investment_size_200k_499k"] = clean_text(row.get('24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [$200,000 - $499,000]'))
    data["investment_size_500k_999k"] = clean_text(row.get('24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [$500,000 - $999,000]'))
    data["investment_size_1m_2m"] = clean_text(row.get('24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [$1,000,000 - $1,999,000]'))
    data["investment_size_2m_plus"] = clean_text(row.get('24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [≥$2,000,000]'))
    
    # Q25-28 (Columns 84-87)
    data["investment_forms"] = parse_array_field(row.get('25.        What forms of investment do you typically make?'))
    data["target_sectors"] = parse_array_field(row.get('26.        What are your target investment sectors/focus areas?'))
    data["carried_interest_principals"] = clean_text(row.get('27.        Number of current carried-interest/equity-interest principals'))
    data["current_ftes"] = clean_text(row.get('28.        Number of current Full Time Equivalent staff members (FTEs) including principals'))
    
    # Q29: Portfolio Needs - 10 fields (Columns 88-97)
    data["portfolio_need_finance_budgeting"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Finance, budgeting, accounting, cash and tax management]'))
    data["portfolio_need_fundraising"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising including access to working capital resources]'))
    data["portfolio_need_strategic_planning"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Strategic / organizational planning]'))
    data["portfolio_need_product_market"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Product/services proof of concept /market share / competitor positioning]'))
    data["portfolio_need_human_capital"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Human capital management – hiring/retention/training]'))
    data["portfolio_need_technology"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Technology (CRM, MIS, telecommunications, etc)]'))
    data["portfolio_need_legal_regulatory"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Legal / regulatory]'))
    data["portfolio_need_operations"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Operations/ production / facilities and infrastructure]'))
    data["portfolio_need_management_training"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Management training]'))
    data["portfolio_need_other"] = clean_text(row.get('29.        During the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Other]'))
    
    # Q30-31 (Columns 98-99)
    data["investment_monetization"] = parse_array_field(row.get('30.        What is the typical form of investment monetization/exit?'))
    data["exits_achieved"] = clean_text(row.get('31.        How many exits has your vehicle achieved to date (ie exits/monetizations for equity investments and full repayments for debt investments)?'))
    
    # Q32: Fund Capabilities - 15 fields (Columns 100-114)
    data["fund_capability_global_lps"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to global LPs]'))
    data["fund_capability_local_lps"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to local LPs]'))
    data["fund_capability_warehousing"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to warehousing capital]'))
    data["fund_capability_grant_opex"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to grant capital for vehicle OPEX]'))
    data["fund_capability_ta_support"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to TA support]'))
    data["fund_capability_economics"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fund economics]'))
    data["fund_capability_structuring"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fund structuring]'))
    data["fund_capability_investment_process"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Investment process (eg origination, due diligence, structuring, closing)]'))
    data["fund_capability_post_investment"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Post investment process (eg monitoring, reporting, exits, Technical Assistance)]'))
    data["fund_capability_human_capital"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fund staff/Human capital management and development]'))
    data["fund_capability_back_office"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Back office (financial/impact reporting, accounting, CFO, software, templates, etc)]'))
    data["fund_capability_exit_opportunities"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Exit/monetization opportunities]'))
    data["fund_capability_legal_regulatory"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Legal/regulatory support]'))
    data["fund_capability_impact_metrics"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Application of impact metrics]'))
    data["fund_capability_other"] = clean_text(row.get('32.        Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Other]'))
    
    # Q33 (Column 115)
    data["covid_impact_aggregate"] = clean_text(row.get('33.        At an aggregate level, please indicate the impact of COVID-19 on your investment vehicle and operations.'))
    
    # Q34: COVID Impact - 8 fields (Columns 116-123)
    data["covid_impact_staff_attendance"] = clean_text(row.get('34.        What impact has COVID-19 had on the following aspects of your portfolio companies? [Staff attendance]'))
    data["covid_impact_customer_demand"] = clean_text(row.get('34.        What impact has COVID-19 had on the following aspects of your portfolio companies? [Customer demand]'))
    data["covid_impact_pay_salaries"] = clean_text(row.get('34.        What impact has COVID-19 had on the following aspects of your portfolio companies? [Ability to pay staff salaries]'))
    data["covid_impact_fixed_costs"] = clean_text(row.get('34.        What impact has COVID-19 had on the following aspects of your portfolio companies? [Ability to pay fixed operating cost (eg rent, etc.)]'))
    data["covid_impact_business_loans"] = clean_text(row.get('34.        What impact has COVID-19 had on the following aspects of your portfolio companies? [Ability to pay existing business loans]'))
    data["covid_impact_supply_access"] = clean_text(row.get('34.        What impact has COVID-19 had on the following aspects of your portfolio companies? [Access to supply inputs / raw materials]'))
    data["covid_impact_pay_inputs"] = clean_text(row.get('34.        What impact has COVID-19 had on the following aspects of your portfolio companies? [Ability to pay for raw inputs / raw materials]'))
    data["covid_impact_pivot_model"] = clean_text(row.get('34.        What impact has COVID-19 had on the following aspects of your portfolio companies? [Need to pivot business model]'))
    
    # Q35-37 (Columns 124-126)
    data["covid_government_support"] = parse_array_field(row.get('35. Have you received any financial or non-financial support from any government programs or grant funding related to COVID-19?'))
    data["raising_capital_2021"] = parse_array_field(row.get('36. Do you anticipating raising new LP/investor funds in 2021? If yes, for what purpose?'))
    data["fund_vehicle_considerations"] = parse_array_field(row.get('37. Regarding your current fund/investment vehicle, which of the following is under consideration?'))
    
    # Q38 (Column 127)
    data["network_value_rating"] = clean_text(row.get('38.        Overall, how valuable have you found your participation in the ESCP network?'))
    
    # Q39: Working Groups - 5 fields (Columns 128-132)
    data["working_group_fund_economics"] = clean_text(row.get('39.        Please indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [Fund Economics]'))
    data["working_group_lp_profiles"] = clean_text(row.get('39.        Please indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [LP Profiles]'))
    data["working_group_market_data"] = clean_text(row.get('39.        Please indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [Market Data]'))
    data["working_group_purpose_definition"] = clean_text(row.get('39.        Please indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [Purpose Definition]'))
    data["working_group_access_capital"] = clean_text(row.get('39.        Please indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [Access to Capital (DfID proposal)]'))
    
    # Q40 (Column 133)
    data["working_group_suggestions"] = clean_text(row.get('40.        Do you have suggestions of new working group topics/formats you would like to see?'))
    
    # Q41: Webinars - 11 fields (Columns 134-144)
    data["webinar_gender_lens"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Gender lens investing (facilitated by Suzanne Biegel)]'))
    data["webinar_covid_response"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [COVID-19 Response (peer discussion)]'))
    data["webinar_fundraising"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Fundraising (presentations from I&P, Capria & DGGF)]'))
    data["webinar_portfolio_support"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Portfolio Support (presentations from 10-Xe and AMI)]'))
    data["webinar_sgb_covid"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [SGB COVID-19 Capital Bridge Facility (presentation from CFF)]'))
    data["webinar_fundraising_2"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Fundraising 2.0 (peer discussion)]'))
    data["webinar_human_capital"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Human Capital (peer discussion)]'))
    data["webinar_coinvesting"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Co-investing workshop with ADAP (peer discussion)]'))
    data["webinar_fundraising_3"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Fundraising 3.0 – local capital (peer discussion)]'))
    data["webinar_ag_food_tech"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)]'))
    data["webinar_mentoring_pilot"] = clean_text(row.get('41.        Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Mentoring Pilot Kick-off]'))
    
    # Q42 (Column 145)
    data["webinar_suggestions"] = clean_text(row.get('42.        Do you have suggestions of new webinar topics/formats you would like to see?'))
    
    # Q43 (Column 146)
    data["communication_platform_preference"] = clean_text(row.get('43.        Do you prefer Slack or WhatsApp as a communication platform for the network?'))
    
    # Q44: Network Value Areas - 4 fields (Columns 147-150)
    data["network_value_peer_connections"] = clean_text(row.get('44.        What are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1=most valuable, 5=least valuable [Peer connections and peer learning]'))
    data["network_value_advocacy"] = clean_text(row.get('44.        What are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1=most valuable, 5=least valuable [Advocacy for early stage investing ]'))
    data["network_value_visibility"] = clean_text(row.get('44.        What are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1=most valuable, 5=least valuable [Raised profile/visibility (individual or collective)]'))
    data["network_value_systems_change"] = clean_text(row.get('44.        What are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1=most valuable, 5=least valuable [Systems change to drive more capital towards local capital providers]'))
    
    # Q45 (Column 151)
    data["session1_present"] = clean_text(row.get('45.        Would you like to present in Session 1: "Connection/Reconnection" on Tuesday February 16th to provide a brief (1-2 min update) on your activities/progress (please note you are not required to present in order to attend this session – presenting is optional!)?'))
    
    # Q46: 2021 Initiatives - 13 fields (Columns 152-164)
    data["initiative_warehousing"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Warehousing/seed funding for fund managers to build track record]'))
    data["initiative_ta_facility"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [TA facility to support early fund economics and activities]'))
    data["initiative_advocacy"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Advocacy for the early-stage investing ecosystem]'))
    data["initiative_mentoring_expert"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Mentoring program (expert led)]'))
    data["initiative_mentoring_peer"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Mentoring program (peer-led)]'))
    data["initiative_webinars_peer"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Webinars with peer-to-peer feedback sessions]'))
    data["initiative_webinars_expert"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Webinars with expert-led feedback sessions]'))
    data["initiative_fundraising_readiness"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Fundraising Readiness Advisory Program for fund managers]'))
    data["initiative_investment_readiness"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Investment readiness for portfolio companies]'))
    data["initiative_fund_manager_portal"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Fund Manager Portal (ie library of resources, templates etc)]'))
    data["initiative_shared_data"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)]'))
    data["initiative_joint_back_office"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Joint back office between actively investing fund managers]'))
    data["initiative_other"] = clean_text(row.get('46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Other]'))
    
    # Q47 (Column 165)
    data["peer_mentoring_interest"] = clean_text(row.get('47.        Would you be interested in participating in a peer mentoring program?'))
    
    # Q48 (Column 166)
    data["session4_present"] = clean_text(row.get('48.        Would you like to present in Session 4: "Demystifying frontier finance" on Thursday February 25th, and if so, please indicate which sub-topic(s) you would be interested in presenting on (please note you are not required to present in order to attend this session – presenting is optional!)?'))
    
    # Q49 (Column 167)
    data["additional_comments"] = clean_text(row.get('49.        Any other comments / feedback that you would like to share?'))
    
    return data
