# Survey2021.tsx Changes Required

## Overview
This document outlines all changes needed to update Survey2021.tsx to match the new 167-column database schema.

---

## PART 1: ZOD SCHEMA CHANGES (Lines 20-115)

### Changes to Make:

#### 1. Remove these fields from schema:
```typescript
// REMOVE:
team_based_other: z.string().optional(),
geographic_focus_other: z.string().optional(),
fund_stage_other: z.string().optional(),
legal_entity_date: z.string().min(1, "Legal entity date is required"),
first_close_date: z.string().min(1, "First close date is required"),
first_investment_date: z.string().min(1, "First investment date is required"),
investments_march_2020: z.string().min(1, "March 2020 investments is required"),
investments_december_2020: z.string().min(1, "December 2020 investments is required"),
investment_vehicle_type_other: z.string().optional(),
current_fund_size: z.string().min(1, "Current fund size is required"),
target_fund_size: z.string().min(1, "Target fund size is required"),
investment_timeframe_other: z.string().optional(),
business_model_targeted_other: z.string().optional(),
business_stage_targeted_other: z.string().optional(),
financing_needs_other: z.string().optional(),
target_capital_sources_other: z.string().optional(),
target_irr_achieved: z.string().min(1, "Achieved IRR is required"),
target_irr_targeted: z.string().min(1, "Targeted IRR is required"),
explicit_lens_focus_other: z.string().optional(),
report_sustainable_development_goals: z.boolean(),
top_sdg_1: z.string().optional(),
top_sdg_2: z.string().optional(),
top_sdg_3: z.string().optional(),
gender_considerations_investment: z.array(z.string()).min(1, "Please select at least one gender consideration"),
gender_considerations_investment_other: z.string().optional(),
gender_considerations_requirement: z.array(z.string()).min(1, "Please select at least one gender requirement"),
gender_considerations_requirement_other: z.string().optional(),
gender_fund_vehicle_other: z.string().optional(),
investment_size_your_amount: z.string().min(1, "Your investment amount is required"),
investment_size_total_raise: z.string().min(1, "Total raise amount is required"),
investment_forms_other: z.string().optional(),
target_sectors_other: z.string().optional(),
portfolio_needs_ranking: z.record(z.string(), z.string()),
portfolio_needs_other: z.string().optional(),
investment_monetization_other: z.string().optional(),
fund_capabilities_ranking: z.record(z.string(), z.string()),
fund_capabilities_other: z.string().optional(),
covid_impact_portfolio: z.record(z.string(), z.record(z.string(), z.string())),
covid_government_support_other: z.string().optional(),
raising_capital_2021_other: z.string().optional(),
fund_vehicle_considerations_other: z.string().optional(),
working_groups_ranking: z.record(z.string(), z.string()),
new_working_group_suggestions: z.string().optional(),
webinar_content_ranking: z.record(z.string(), z.string()),
new_webinar_suggestions: z.string().optional(),
network_value_areas: z.record(z.string(), z.string()),
present_connection_session: z.boolean(),
convening_initiatives_ranking: z.record(z.string(), z.string()),
convening_initiatives_other: z.string().optional(),
present_demystifying_session_other: z.string().optional(),
```

#### 2. Add these NEW fields to schema:

**After `fund_stage` field, add:**
```typescript
// Question 7: Timeline (Columns 9-22) - 14 fields
timeline_na: z.string().optional(),
timeline_prior_2000: z.string().optional(),
timeline_2000_2010: z.string().optional(),
timeline_2011: z.string().optional(),
timeline_2012: z.string().optional(),
timeline_2013: z.string().optional(),
timeline_2014: z.string().optional(),
timeline_2015: z.string().optional(),
timeline_2016: z.string().optional(),
timeline_2017: z.string().optional(),
timeline_2018: z.string().optional(),
timeline_2019: z.string().optional(),
timeline_2020: z.string().optional(),
timeline_2021: z.string().optional(),

// Question 8: Number of Investments (Columns 23-28) - 6 fields
investments_0: z.string().optional(),
investments_1_4: z.string().optional(),
investments_5_9: z.string().optional(),
investments_10_14: z.string().optional(),
investments_15_24: z.string().optional(),
investments_25_plus: z.string().optional(),
```

**After `investment_vehicle_type` field, add:**
```typescript
// Question 11: Fund Size (Columns 31-36) - 6 fields
fund_size_under_1m: z.string().optional(),
fund_size_1_4m: z.string().optional(),
fund_size_5_9m: z.string().optional(),
fund_size_10_19m: z.string().optional(),
fund_size_20_29m: z.string().optional(),
fund_size_30m_plus: z.string().optional(),
```

**Replace IRR fields with:**
```typescript
// Question 17: Target IRR (Columns 42-46) - 5 fields
target_irr_under_5: z.string().optional(),
target_irr_6_9: z.string().optional(),
target_irr_10_15: z.string().optional(),
target_irr_16_20: z.string().optional(),
target_irr_20_plus: z.string().optional(),
```

**Replace `report_sustainable_development_goals` with `report_sdgs` and add 17 SDG fields:**
```typescript
report_sdgs: z.boolean(),

// Question 21: SDGs (Columns 50-66) - 17 fields
sdg_no_poverty: z.string().optional(),
sdg_zero_hunger: z.string().optional(),
sdg_good_health: z.string().optional(),
sdg_quality_education: z.string().optional(),
sdg_gender_equality: z.string().optional(),
sdg_clean_water: z.string().optional(),
sdg_clean_energy: z.string().optional(),
sdg_decent_work: z.string().optional(),
sdg_industry_innovation: z.string().optional(),
sdg_reduced_inequalities: z.string().optional(),
sdg_sustainable_cities: z.string().optional(),
sdg_responsible_consumption: z.string().optional(),
sdg_climate_action: z.string().optional(),
sdg_life_below_water: z.string().optional(),
sdg_life_on_land: z.string().optional(),
sdg_peace_justice: z.string().optional(),
sdg_partnerships: z.string().optional(),
```

**Replace gender fields with 10 individual fields:**
```typescript
// Question 22: Gender Considerations (Columns 67-76) - 10 fields
gender_majority_women_ownership: z.string().optional(),
gender_women_senior_mgmt: z.string().optional(),
gender_women_direct_workforce: z.string().optional(),
gender_women_indirect_workforce: z.string().optional(),
gender_equality_policies: z.string().optional(),
gender_women_beneficiaries: z.string().optional(),
gender_reporting_indicators: z.string().optional(),
gender_board_representation: z.string().optional(),
gender_female_ceo: z.string().optional(),
gender_other: z.string().optional(),
```

**Replace investment size fields with 6 fields:**
```typescript
// Question 24: Investment Size (Columns 78-83) - 6 fields
investment_size_under_100k: z.string().optional(),
investment_size_100k_199k: z.string().optional(),
investment_size_200k_499k: z.string().optional(),
investment_size_500k_999k: z.string().optional(),
investment_size_1m_2m: z.string().optional(),
investment_size_2m_plus: z.string().optional(),
```

**Replace portfolio needs ranking with 10 individual fields:**
```typescript
// Question 29: Portfolio Needs (Columns 88-97) - 10 fields
portfolio_need_finance_budgeting: z.string().optional(),
portfolio_need_fundraising: z.string().optional(),
portfolio_need_strategic_planning: z.string().optional(),
portfolio_need_product_market: z.string().optional(),
portfolio_need_human_capital: z.string().optional(),
portfolio_need_technology: z.string().optional(),
portfolio_need_legal_regulatory: z.string().optional(),
portfolio_need_operations: z.string().optional(),
portfolio_need_management_training: z.string().optional(),
portfolio_need_other: z.string().optional(),
```

**Replace fund capabilities ranking with 15 individual fields:**
```typescript
// Question 32: Fund Capabilities (Columns 100-114) - 15 fields
fund_capability_global_lps: z.string().optional(),
fund_capability_local_lps: z.string().optional(),
fund_capability_warehousing: z.string().optional(),
fund_capability_grant_opex: z.string().optional(),
fund_capability_ta_support: z.string().optional(),
fund_capability_economics: z.string().optional(),
fund_capability_structuring: z.string().optional(),
fund_capability_investment_process: z.string().optional(),
fund_capability_post_investment: z.string().optional(),
fund_capability_human_capital: z.string().optional(),
fund_capability_back_office: z.string().optional(),
fund_capability_exit_opportunities: z.string().optional(),
fund_capability_legal_regulatory: z.string().optional(),
fund_capability_impact_metrics: z.string().optional(),
fund_capability_other: z.string().optional(),
```

**Replace COVID portfolio impact with 8 individual fields:**
```typescript
// Question 34: COVID Portfolio Impact (Columns 116-123) - 8 fields
covid_impact_staff_attendance: z.string().optional(),
covid_impact_customer_demand: z.string().optional(),
covid_impact_pay_salaries: z.string().optional(),
covid_impact_fixed_costs: z.string().optional(),
covid_impact_business_loans: z.string().optional(),
covid_impact_supply_access: z.string().optional(),
covid_impact_pay_inputs: z.string().optional(),
covid_impact_pivot_model: z.string().optional(),
```

**Replace working groups ranking with 5 individual fields:**
```typescript
// Question 39: Working Groups (Columns 128-132) - 5 fields
working_group_fund_economics: z.string().optional(),
working_group_lp_profiles: z.string().optional(),
working_group_market_data: z.string().optional(),
working_group_purpose_definition: z.string().optional(),
working_group_access_capital: z.string().optional(),

// Rename field
working_group_suggestions: z.string().optional(),  // was: new_working_group_suggestions
```

**Replace webinar content ranking with 11 individual fields:**
```typescript
// Question 41: Webinar Content (Columns 134-144) - 11 fields
webinar_gender_lens: z.string().optional(),
webinar_covid_response: z.string().optional(),
webinar_fundraising: z.string().optional(),
webinar_portfolio_support: z.string().optional(),
webinar_sgb_bridge: z.string().optional(),
webinar_fundraising_2: z.string().optional(),
webinar_human_capital: z.string().optional(),
webinar_coinvesting: z.string().optional(),
webinar_fundraising_3: z.string().optional(),
webinar_ag_food_tech: z.string().optional(),
webinar_mentoring_pilot: z.string().optional(),

// Rename field
webinar_suggestions: z.string().optional(),  // was: new_webinar_suggestions
```

**Replace network value areas with 4 individual fields:**
```typescript
// Question 44: Network Value Areas (Columns 147-150) - 4 fields
network_value_peer_connections: z.string().optional(),
network_value_advocacy: z.string().optional(),
network_value_visibility: z.string().optional(),
network_value_systems_change: z.string().optional(),

// Change type
present_connection_session: z.string().optional(),  // was: z.boolean()
```

**Replace convening initiatives ranking with 13 individual fields:**
```typescript
// Question 46: Convening Initiatives (Columns 152-164) - 13 fields
initiative_warehousing: z.string().optional(),
initiative_ta_facility: z.string().optional(),
initiative_advocacy: z.string().optional(),
initiative_mentoring_expert: z.string().optional(),
initiative_mentoring_peer: z.string().optional(),
initiative_webinars_peer: z.string().optional(),
initiative_webinars_expert: z.string().optional(),
initiative_fundraising_advisory: z.string().optional(),
initiative_investment_readiness: z.string().optional(),
initiative_fund_manager_portal: z.string().optional(),
initiative_shared_data: z.string().optional(),
initiative_joint_back_office: z.string().optional(),
initiative_other: z.string().optional(),
```

---

## PART 2: DEFAULT VALUES CHANGES (Lines 142-224)

### Add all new fields to defaultValues with empty strings:

```typescript
defaultValues: {
  firm_name: '',
  participant_name: '',
  role_title: '',
  team_based: [],
  geographic_focus: [],
  fund_stage: '',
  
  // Timeline fields
  timeline_na: '',
  timeline_prior_2000: '',
  timeline_2000_2010: '',
  timeline_2011: '',
  timeline_2012: '',
  timeline_2013: '',
  timeline_2014: '',
  timeline_2015: '',
  timeline_2016: '',
  timeline_2017: '',
  timeline_2018: '',
  timeline_2019: '',
  timeline_2020: '',
  timeline_2021: '',
  
  // Investment count fields
  investments_0: '',
  investments_1_4: '',
  investments_5_9: '',
  investments_10_14: '',
  investments_15_24: '',
  investments_25_plus: '',
  
  optional_supplement: '',
  investment_vehicle_type: [],
  
  // Fund size fields
  fund_size_under_1m: '',
  fund_size_1_4m: '',
  fund_size_5_9m: '',
  fund_size_10_19m: '',
  fund_size_20_29m: '',
  fund_size_30m_plus: '',
  
  investment_timeframe: '',
  business_model_targeted: [],
  business_stage_targeted: [],
  financing_needs: [],
  target_capital_sources: [],
  
  // IRR fields
  target_irr_under_5: '',
  target_irr_6_9: '',
  target_irr_10_15: '',
  target_irr_16_20: '',
  target_irr_20_plus: '',
  
  impact_vs_financial_orientation: '',
  explicit_lens_focus: [],
  report_sdgs: false,
  
  // SDG fields (17 fields)
  sdg_no_poverty: '',
  sdg_zero_hunger: '',
  sdg_good_health: '',
  sdg_quality_education: '',
  sdg_gender_equality: '',
  sdg_clean_water: '',
  sdg_clean_energy: '',
  sdg_decent_work: '',
  sdg_industry_innovation: '',
  sdg_reduced_inequalities: '',
  sdg_sustainable_cities: '',
  sdg_responsible_consumption: '',
  sdg_climate_action: '',
  sdg_life_below_water: '',
  sdg_life_on_land: '',
  sdg_peace_justice: '',
  sdg_partnerships: '',
  
  // Gender fields (10 fields)
  gender_majority_women_ownership: '',
  gender_women_senior_mgmt: '',
  gender_women_direct_workforce: '',
  gender_women_indirect_workforce: '',
  gender_equality_policies: '',
  gender_women_beneficiaries: '',
  gender_reporting_indicators: '',
  gender_board_representation: '',
  gender_female_ceo: '',
  gender_other: '',
  
  gender_fund_vehicle: [],
  
  // Investment size fields (6 fields)
  investment_size_under_100k: '',
  investment_size_100k_199k: '',
  investment_size_200k_499k: '',
  investment_size_500k_999k: '',
  investment_size_1m_2m: '',
  investment_size_2m_plus: '',
  
  investment_forms: [],
  target_sectors: [],
  carried_interest_principals: '',
  current_ftes: '',
  
  // Portfolio needs fields (10 fields)
  portfolio_need_finance_budgeting: '',
  portfolio_need_fundraising: '',
  portfolio_need_strategic_planning: '',
  portfolio_need_product_market: '',
  portfolio_need_human_capital: '',
  portfolio_need_technology: '',
  portfolio_need_legal_regulatory: '',
  portfolio_need_operations: '',
  portfolio_need_management_training: '',
  portfolio_need_other: '',
  
  investment_monetization: [],
  exits_achieved: '',
  
  // Fund capabilities fields (15 fields)
  fund_capability_global_lps: '',
  fund_capability_local_lps: '',
  fund_capability_warehousing: '',
  fund_capability_grant_opex: '',
  fund_capability_ta_support: '',
  fund_capability_economics: '',
  fund_capability_structuring: '',
  fund_capability_investment_process: '',
  fund_capability_post_investment: '',
  fund_capability_human_capital: '',
  fund_capability_back_office: '',
  fund_capability_exit_opportunities: '',
  fund_capability_legal_regulatory: '',
  fund_capability_impact_metrics: '',
  fund_capability_other: '',
  
  covid_impact_aggregate: '',
  
  // COVID impact fields (8 fields)
  covid_impact_staff_attendance: '',
  covid_impact_customer_demand: '',
  covid_impact_pay_salaries: '',
  covid_impact_fixed_costs: '',
  covid_impact_business_loans: '',
  covid_impact_supply_access: '',
  covid_impact_pay_inputs: '',
  covid_impact_pivot_model: '',
  
  covid_government_support: [],
  raising_capital_2021: [],
  fund_vehicle_considerations: [],
  network_value_rating: '',
  
  // Working groups fields (5 fields)
  working_group_fund_economics: '',
  working_group_lp_profiles: '',
  working_group_market_data: '',
  working_group_purpose_definition: '',
  working_group_access_capital: '',
  
  working_group_suggestions: '',
  
  // Webinar fields (11 fields)
  webinar_gender_lens: '',
  webinar_covid_response: '',
  webinar_fundraising: '',
  webinar_portfolio_support: '',
  webinar_sgb_bridge: '',
  webinar_fundraising_2: '',
  webinar_human_capital: '',
  webinar_coinvesting: '',
  webinar_fundraising_3: '',
  webinar_ag_food_tech: '',
  webinar_mentoring_pilot: '',
  
  webinar_suggestions: '',
  communication_platform: '',
  
  // Network value fields (4 fields)
  network_value_peer_connections: '',
  network_value_advocacy: '',
  network_value_visibility: '',
  network_value_systems_change: '',
  
  present_connection_session: '',
  
  // Initiative fields (13 fields)
  initiative_warehousing: '',
  initiative_ta_facility: '',
  initiative_advocacy: '',
  initiative_mentoring_expert: '',
  initiative_mentoring_peer: '',
  initiative_webinars_peer: '',
  initiative_webinars_expert: '',
  initiative_fundraising_advisory: '',
  initiative_investment_readiness: '',
  initiative_fund_manager_portal: '',
  initiative_shared_data: '',
  initiative_joint_back_office: '',
  initiative_other: '',
  
  participate_mentoring_program: '',
  present_demystifying_session: [],
  additional_comments: '',
}
```

---

## PART 3: RENDER FUNCTION CHANGES

This is too complex to document fully here. The key principle is:
- Replace all simplified fields with the expanded versions
- Use tables for multi-column questions (timeline, investments, fund size, IRR, SDGs, gender, investment size)
- Use individual dropdown selects for ranking questions (portfolio needs, capabilities, working groups, webinars, network value, initiatives)

**Would you like me to:**
1. Create a backup of the current file
2. Generate a completely new Survey2021.tsx file with all changes
3. Work through this section by section with your approval at each step

Please advise how you'd like to proceed.
