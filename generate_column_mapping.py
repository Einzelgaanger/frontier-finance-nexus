"""
Generate Column Mapping for 2021 Import
This creates a mapping file showing Excel columns -> Database columns
"""

# Excel column names from inspection
excel_columns = {
    1: "Timestamp",
    2: "Email Address",
    3: "1. Name of firm",
    4: "2. Name of participant",
    5: "3. Role / title of participant",
    6: "4. Where is your team based?",
    7: "5. What is the geographic focus of your fund/vehicle?",
    8: "6. What is the stage of your current fund/vehicle's operations?",
    9: "7. When did your current fund/investment vehicle achieve each of the following? [N/A]",
    10: "7. When did your current fund/investment vehicle achieve each of the following? [Prior to 2000]",
    11: "7. When did your current fund/investment vehicle achieve each of the following? [2000-2010]",
    12: "7. When did your current fund/investment vehicle achieve each of the following? [2011]",
    13: "7. When did your current fund/investment vehicle achieve each of the following? [2012]",
    14: "7. When did your current fund/investment vehicle achieve each of the following? [2013]",
    15: "7. When did your current fund/investment vehicle achieve each of the following? [2014]",
    16: "7. When did your current fund/investment vehicle achieve each of the following? [2015]",
    17: "7. When did your current fund/investment vehicle achieve each of the following? [2016]",
    18: "7. When did your current fund/investment vehicle achieve each of the following? [2017]",
    19: "7. When did your current fund/investment vehicle achieve each of the following? [2018]",
    20: "7. When did your current fund/investment vehicle achieve each of the following? [2019]",
    21: "7. When did your current fund/investment vehicle achieve each of the following? [2020]",
    22: "7. When did your current fund/investment vehicle achieve each of the following? [2021]",
    23: "8. Please specify the number of investments made to date by your current vehicle [0]",
    24: "8. Please specify the number of investments made to date by your current vehicle [1-4]",
    25: "8. Please specify the number of investments made to date by your current vehicle [5-9]",
    26: "8. Please specify the number of investments made to date by your current vehicle [10-14]",
    27: "8. Please specify the number of investments made to date by your current vehicle [15-24]",
    28: "8. Please specify the number of investments made to date by your current vehicle [25+]",
    29: "9. Optional supplement to question above - if no direct investments made to date please specify (eg warehoused investments, facilitated 3rd party investment eg with angel investors etc)",
    30: "10. Type of investment vehicle",
    31: "11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [< $1 million]",
    32: "11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$1-4 million]",
    33: "11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$5-9 million]",
    34: "11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$10-19 million]",
    35: "11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$20-29 million]",
    36: "11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$30 million or more]",
    37: "12. Typical investment timeframe",
    38: "13. Type of business model targeted",
    39: "14. Stage of business model targeted",
    40: "15. Key financing needs of portfolio enterprises (at time of initial investment/funding)",
    41: "16.        Target sources of capital for your fund",
}

# Database column names (from SQL schema)
db_columns = [
    "timestamp", "email_address", "firm_name", "participant_name", "role_title",
    "team_based", "geographic_focus", "fund_stage",
    "timeline_na", "timeline_prior_2000", "timeline_2000_2010",
    "timeline_2011", "timeline_2012", "timeline_2013", "timeline_2014",
    "timeline_2015", "timeline_2016", "timeline_2017", "timeline_2018",
    "timeline_2019", "timeline_2020", "timeline_2021",
    "investments_0", "investments_1_4", "investments_5_9",
    "investments_10_14", "investments_15_24", "investments_25_plus",
    "optional_supplement", "investment_vehicle_type",
    "fund_size_under_1m", "fund_size_1_4m", "fund_size_5_9m",
    "fund_size_10_19m", "fund_size_20_29m", "fund_size_30m_plus",
    "investment_timeframe", "business_model_targeted",
    "business_stage_targeted", "financing_needs", "target_capital_sources",
]

print("COLUMN MAPPING REFERENCE")
print("=" * 100)
print(f"{'Excel Column':<80} | {'Database Column':<30}")
print("=" * 100)

for i, (excel_col, db_col) in enumerate(zip(excel_columns.values(), db_columns), 1):
    print(f"{excel_col:<80} | {db_col:<30}")

print("\n" + "=" * 100)
print(f"Total mapped: {len(db_columns)} columns")
