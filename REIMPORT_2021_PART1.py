"""
PART 1: Mapping Function for 2021 Survey - First 80 columns
This will be imported by the main script
"""

def map_excel_to_db_part1(row, clean_text, parse_array_field, parse_boolean):
    """Map first 80 columns of Excel to database fields"""
    
    data = {}
    
    # Timestamp (Column 1)
    ts = row.get('Timestamp')
    if ts is not None and str(ts) != 'nan':
        try:
            import pandas as pd
            data["timestamp"] = pd.to_datetime(ts).isoformat()
        except:
            data["timestamp"] = None
    
    # Email and Basic Info (Columns 2-5)
    data["email_address"] = clean_text(row.get('Email Address'))
    data["firm_name"] = clean_text(row.get('1. Name of firm'))
    data["participant_name"] = clean_text(row.get('2. Name of participant'))
    data["role_title"] = clean_text(row.get('3. Role / title of participant'))
    
    # Q4-6: Background (Columns 6-8)
    data["team_based"] = parse_array_field(row.get('4. Where is your team based?'))
    data["geographic_focus"] = parse_array_field(row.get('5. What is the geographic focus of your fund/vehicle?'))
    data["fund_stage"] = clean_text(row.get('6. What is the stage of your current fund/vehicle\'s operations?'))
    
    # Q7: Timeline - 14 fields (Columns 9-22)
    data["timeline_na"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [N/A]'))
    data["timeline_prior_2000"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [Prior to 2000]'))
    data["timeline_2000_2010"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2000-2010]'))
    data["timeline_2011"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2011]'))
    data["timeline_2012"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2012]'))
    data["timeline_2013"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2013]'))
    data["timeline_2014"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2014]'))
    data["timeline_2015"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2015]'))
    data["timeline_2016"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2016]'))
    data["timeline_2017"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2017]'))
    data["timeline_2018"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2018]'))
    data["timeline_2019"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2019]'))
    data["timeline_2020"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2020]'))
    data["timeline_2021"] = clean_text(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2021]'))
    
    # Q8: Investments - 6 fields (Columns 23-28)
    data["investments_0"] = clean_text(row.get('8. Please specify the number of investments made to date by your current vehicle [0]'))
    data["investments_1_4"] = clean_text(row.get('8. Please specify the number of investments made to date by your current vehicle [1-4]'))
    data["investments_5_9"] = clean_text(row.get('8. Please specify the number of investments made to date by your current vehicle [5-9]'))
    data["investments_10_14"] = clean_text(row.get('8. Please specify the number of investments made to date by your current vehicle [10-14]'))
    data["investments_15_24"] = clean_text(row.get('8. Please specify the number of investments made to date by your current vehicle [15-24]'))
    data["investments_25_plus"] = clean_text(row.get('8. Please specify the number of investments made to date by your current vehicle [25+]'))
    
    # Q9: Optional Supplement (Column 29)
    data["optional_supplement"] = clean_text(row.get('9. Optional supplement to question above - if no direct investments made to date please specify (eg warehoused investments, facilitated 3rd party investment eg with angel investors etc)'))
    
    # Q10: Vehicle Type (Column 30)
    data["investment_vehicle_type"] = parse_array_field(row.get('10. Type of investment vehicle'))
    
    # Q11: Fund Size - 6 fields (Columns 31-36)
    data["fund_size_under_1m"] = clean_text(row.get('11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [< $1 million]'))
    data["fund_size_1_4m"] = clean_text(row.get('11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$1-4 million]'))
    data["fund_size_5_9m"] = clean_text(row.get('11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$5-9 million]'))
    data["fund_size_10_19m"] = clean_text(row.get('11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$10-19 million]'))
    data["fund_size_20_29m"] = clean_text(row.get('11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$20-29 million]'))
    data["fund_size_30m_plus"] = clean_text(row.get('11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$30 million or more]'))
    
    # Q12-16 (Columns 37-41)
    data["investment_timeframe"] = clean_text(row.get('12. Typical investment timeframe'))
    data["business_model_targeted"] = parse_array_field(row.get('13. Type of business model targeted'))
    data["business_stage_targeted"] = parse_array_field(row.get('14. Stage of business model targeted'))
    data["financing_needs"] = parse_array_field(row.get('15. Key financing needs of portfolio enterprises (at time of initial investment/funding)'))
    data["target_capital_sources"] = parse_array_field(row.get('16.        Target sources of capital for your fund'))
    
    # Q17: IRR - 5 fields (Columns 42-46)
    data["target_irr_under_5"] = clean_text(row.get('17.        What is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [< or = 5%]'))
    data["target_irr_6_9"] = clean_text(row.get('17.        What is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [6-9%]'))
    data["target_irr_10_15"] = clean_text(row.get('17.        What is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [10-15%]'))
    data["target_irr_16_20"] = clean_text(row.get('17.        What is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [16-20%]'))
    data["target_irr_20_plus"] = clean_text(row.get('17.        What is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [20%+]'))
    
    # Q18-20 (Columns 47-49)
    data["impact_vs_financial_orientation"] = clean_text(row.get('18. How would you frame the impact vs financial return orientation of your capital vehicle?'))
    data["explicit_lens_focus"] = parse_array_field(row.get('19.        Does your fund/vehicle have an explicit lens/focus?'))
    data["report_sdgs"] = parse_boolean(row.get('20. Does your fund/investment vehicle specifically report any Sustainable Development Goals?'))
    
    # Q21: SDGs - 17 fields (Columns 50-66)
    data["sdg_no_poverty"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [No Poverty]'))
    data["sdg_zero_hunger"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Zero Hunger]'))
    data["sdg_good_health"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Good Health and Well-Being]'))
    data["sdg_quality_education"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Quality Education]'))
    data["sdg_gender_equality"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Gender Equality]'))
    data["sdg_clean_water"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Clean Water and Sanitation]'))
    data["sdg_clean_energy"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Affordable and Clean Energy]'))
    data["sdg_decent_work"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Decent Work and Economic Growth]'))
    data["sdg_industry_innovation"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Industry Innovation and Infrastructure]'))
    data["sdg_reduced_inequalities"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Reduced Inequalities]'))
    data["sdg_sustainable_cities"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Sustainable Cities and Communities]'))
    data["sdg_responsible_consumption"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Responsible Consumption and Production]'))
    data["sdg_climate_action"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Climate Action]'))
    data["sdg_life_below_water"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Life Below Water]'))
    data["sdg_life_on_land"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Life on Land]'))
    data["sdg_peace_justice"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Peace, Justice, and Strong Institutions]'))
    data["sdg_partnerships"] = clean_text(row.get('21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Partnerships for the Goals]'))
    
    # Q22: Gender - 10 fields (Columns 67-76)
    data["gender_majority_women_ownership"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Majority women ownership (>50%)]'))
    data["gender_women_senior_mgmt"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Greater than 33% of women in senior management]'))
    data["gender_women_direct_workforce"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Women represent at least 33% - 50% of direct workforce]'))
    data["gender_women_indirect_workforce"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)]'))
    data["gender_equality_policies"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Have policies in place that promote gender equality (e.g. equal compensation)]'))
    data["gender_women_beneficiaries"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Women are target beneficiaries of the product/service]'))
    data["gender_reporting_indicators"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Enterprise reports on specific gender related indicators to investors]'))
    data["gender_board_representation"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Board member female representation (>33%)]'))
    data["gender_female_ceo"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Female CEO]'))
    data["gender_other"] = clean_text(row.get('22. Do any of the following gender considerations apply when making investment/financing considerations? [Other]'))
    
    # Q23 (Column 77)
    data["gender_fund_vehicle"] = parse_array_field(row.get('23. Do any of the following apply to your fund/vehicle?'))
    
    return data
