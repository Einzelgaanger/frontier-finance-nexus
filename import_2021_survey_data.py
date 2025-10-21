"""
2021 Survey Data Import Script
===============================
This script imports 2021 survey data from Excel into Supabase database.
- Creates users in Supabase Auth with default password
- Creates user profiles with company information
- Maps all 167 Excel columns to database fields
- Company name is the unique identifier (multiple users can share same company)
"""

import pandas as pd
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import sys
from datetime import datetime
import time

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')  # Service role key for admin operations
DEFAULT_PASSWORD = os.getenv('DEFAULT_USER_PASSWORD', 'FrontierFinance2021!')

# Initialize Supabase client with service role
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def clean_text(value):
    """Clean text values from Excel"""
    if pd.isna(value) or value == '' or value == 'NULL':
        return None
    return str(value).strip()

def parse_array_field(value):
    """Parse comma-separated values into array"""
    if pd.isna(value) or value == '' or value == 'NULL':
        return []
    # Split by comma and clean each item
    items = [item.strip() for item in str(value).split(',')]
    return [item for item in items if item]

def parse_boolean(value):
    """Parse boolean values"""
    if pd.isna(value) or value == '' or value == 'NULL':
        return False
    value_str = str(value).lower()
    return value_str in ['yes', 'true', '1', 'y']

def create_or_get_user(email: str, company_name: str, full_name: str = None):
    """
    Create a new user in Supabase Auth or get existing user ID
    Returns user_id
    """
    try:
        # Try to create user with service role
        auth_response = supabase.auth.admin.create_user({
            "email": email,
            "password": DEFAULT_PASSWORD,
            "email_confirm": True,
            "user_metadata": {
                "company_name": company_name,
                "full_name": full_name or "",
                "imported_from": "2021_survey",
                "imported_at": datetime.now().isoformat()
            }
        })
        
        user_id = auth_response.user.id
        print(f"  ✓ Created new user: {email}")
        return user_id
        
    except Exception as e:
        error_msg = str(e)
        
        # Check if user already exists
        if "already registered" in error_msg.lower() or "duplicate" in error_msg.lower():
            print(f"  ℹ User already exists: {email}, fetching user ID...")
            
            # Get existing user by email
            try:
                # Use service role to list users and find by email
                users_response = supabase.auth.admin.list_users()
                for user in users_response:
                    if user.email == email:
                        print(f"  ✓ Found existing user: {email}")
                        return user.id
                
                print(f"  ⚠ Could not find existing user: {email}")
                return None
                
            except Exception as fetch_error:
                print(f"  ✗ Error fetching existing user: {fetch_error}")
                return None
        else:
            print(f"  ✗ Error creating user {email}: {e}")
            return None

def create_user_profile(user_id: str, email: str, company_name: str, full_name: str = None, role_title: str = None):
    """Create user profile in user_profiles table"""
    try:
        profile_data = {
            "id": user_id,
            "email": email,
            "company_name": company_name,
            "full_name": full_name,
            "role_title": role_title,
            "user_role": "member",
            "is_active": True
        }
        
        # Upsert profile (insert or update if exists)
        supabase.table('user_profiles').upsert(profile_data).execute()
        print(f"  ✓ Created/updated profile for: {email}")
        return True
        
    except Exception as e:
        print(f"  ✗ Error creating profile for {email}: {e}")
        return False

def map_2021_row_to_database(row, user_id: str, company_name: str):
    """
    Map a single Excel row to database schema
    Returns dictionary ready for database insertion
    """
    
    # Start with system fields
    data = {
        "user_id": user_id,
        "company_name": company_name,
        "email_address": clean_text(row.get('Email Address')),
        "firm_name": clean_text(row.get('1. Name of firm')),
        "participant_name": clean_text(row.get('2. Name of participant')),
        "role_title": clean_text(row.get('3. Role / title of participant')),
    }
    
    # Timestamp
    timestamp_val = row.get('Timestamp')
    if pd.notna(timestamp_val):
        try:
            data["timestamp"] = pd.to_datetime(timestamp_val).isoformat()
        except:
            data["timestamp"] = None
    
    # Section 1: Background Information
    data["team_based"] = parse_array_field(row.get('4. Where is your team based?'))
    data["geographic_focus"] = parse_array_field(row.get('5. What is the geographic focus of your fund/vehicle?'))
    data["fund_stage"] = clean_text(row.get('6. What is the stage of your current fund/vehicle\'s operations?'))
    
    # Question 7: Timeline (14 fields) - These come from multiple columns in Excel
    # The Excel has columns for Legal Entity, First Close, First Investment with year selections
    data["timeline_na"] = clean_text(row.get('Timeline_NA'))
    data["timeline_prior_2000"] = clean_text(row.get('Timeline_Prior_2000'))
    data["timeline_2000_2010"] = clean_text(row.get('Timeline_2000_2010'))
    data["timeline_2011"] = clean_text(row.get('Timeline_2011'))
    data["timeline_2012"] = clean_text(row.get('Timeline_2012'))
    data["timeline_2013"] = clean_text(row.get('Timeline_2013'))
    data["timeline_2014"] = clean_text(row.get('Timeline_2014'))
    data["timeline_2015"] = clean_text(row.get('Timeline_2015'))
    data["timeline_2016"] = clean_text(row.get('Timeline_2016'))
    data["timeline_2017"] = clean_text(row.get('Timeline_2017'))
    data["timeline_2018"] = clean_text(row.get('Timeline_2018'))
    data["timeline_2019"] = clean_text(row.get('Timeline_2019'))
    data["timeline_2020"] = clean_text(row.get('Timeline_2020'))
    data["timeline_2021"] = clean_text(row.get('Timeline_2021'))
    
    # Question 8: Number of Investments (6 fields)
    data["investments_0"] = clean_text(row.get('Investments_0'))
    data["investments_1_4"] = clean_text(row.get('Investments_1_4'))
    data["investments_5_9"] = clean_text(row.get('Investments_5_9'))
    data["investments_10_14"] = clean_text(row.get('Investments_10_14'))
    data["investments_15_24"] = clean_text(row.get('Investments_15_24'))
    data["investments_25_plus"] = clean_text(row.get('Investments_25_plus'))
    
    # Question 9: Optional supplement
    data["optional_supplement"] = clean_text(row.get('Optional supplement'))
    
    # Section 2: Investment Thesis & Capital Construct
    data["investment_vehicle_type"] = parse_array_field(row.get('Type of investment vehicle'))
    
    # Question 11: Fund Size (6 fields)
    data["fund_size_under_1m"] = clean_text(row.get('Fund_Size_Under_1M'))
    data["fund_size_1_4m"] = clean_text(row.get('Fund_Size_1_4M'))
    data["fund_size_5_9m"] = clean_text(row.get('Fund_Size_5_9M'))
    data["fund_size_10_19m"] = clean_text(row.get('Fund_Size_10_19M'))
    data["fund_size_20_29m"] = clean_text(row.get('Fund_Size_20_29M'))
    data["fund_size_30m_plus"] = clean_text(row.get('Fund_Size_30M_Plus'))
    
    data["investment_timeframe"] = clean_text(row.get('Typical investment timeframe?'))
    data["business_model_targeted"] = parse_array_field(row.get('Type of business model targeted'))
    data["business_stage_targeted"] = parse_array_field(row.get('Stage of business model targeted'))
    data["financing_needs"] = parse_array_field(row.get('Key financing needs of portfolio enterprises'))
    data["target_capital_sources"] = parse_array_field(row.get('Target sources of capital for your fund'))
    
    # Question 17: Target IRR (5 fields)
    data["target_irr_under_5"] = clean_text(row.get('IRR_Under_5'))
    data["target_irr_6_9"] = clean_text(row.get('IRR_6_9'))
    data["target_irr_10_15"] = clean_text(row.get('IRR_10_15'))
    data["target_irr_16_20"] = clean_text(row.get('IRR_16_20'))
    data["target_irr_20_plus"] = clean_text(row.get('IRR_20_Plus'))
    
    data["impact_vs_financial_orientation"] = clean_text(row.get('Impact vs financial orientation'))
    data["explicit_lens_focus"] = parse_array_field(row.get('Explicit lens/focus'))
    data["report_sdgs"] = parse_boolean(row.get('Report SDGs'))
    
    # Question 21: SDGs (17 fields)
    data["sdg_no_poverty"] = clean_text(row.get('SDG_No_Poverty'))
    data["sdg_zero_hunger"] = clean_text(row.get('SDG_Zero_Hunger'))
    data["sdg_good_health"] = clean_text(row.get('SDG_Good_Health'))
    data["sdg_quality_education"] = clean_text(row.get('SDG_Quality_Education'))
    data["sdg_gender_equality"] = clean_text(row.get('SDG_Gender_Equality'))
    data["sdg_clean_water"] = clean_text(row.get('SDG_Clean_Water'))
    data["sdg_clean_energy"] = clean_text(row.get('SDG_Clean_Energy'))
    data["sdg_decent_work"] = clean_text(row.get('SDG_Decent_Work'))
    data["sdg_industry_innovation"] = clean_text(row.get('SDG_Industry_Innovation'))
    data["sdg_reduced_inequalities"] = clean_text(row.get('SDG_Reduced_Inequalities'))
    data["sdg_sustainable_cities"] = clean_text(row.get('SDG_Sustainable_Cities'))
    data["sdg_responsible_consumption"] = clean_text(row.get('SDG_Responsible_Consumption'))
    data["sdg_climate_action"] = clean_text(row.get('SDG_Climate_Action'))
    data["sdg_life_below_water"] = clean_text(row.get('SDG_Life_Below_Water'))
    data["sdg_life_on_land"] = clean_text(row.get('SDG_Life_On_Land'))
    data["sdg_peace_justice"] = clean_text(row.get('SDG_Peace_Justice'))
    data["sdg_partnerships"] = clean_text(row.get('SDG_Partnerships'))
    
    # Question 22: Gender Considerations (10 fields)
    data["gender_majority_women_ownership"] = clean_text(row.get('Gender_Majority_Women_Ownership'))
    data["gender_women_senior_mgmt"] = clean_text(row.get('Gender_Women_Senior_Mgmt'))
    data["gender_women_direct_workforce"] = clean_text(row.get('Gender_Women_Direct_Workforce'))
    data["gender_women_indirect_workforce"] = clean_text(row.get('Gender_Women_Indirect_Workforce'))
    data["gender_equality_policies"] = clean_text(row.get('Gender_Equality_Policies'))
    data["gender_women_beneficiaries"] = clean_text(row.get('Gender_Women_Beneficiaries'))
    data["gender_reporting_indicators"] = clean_text(row.get('Gender_Reporting_Indicators'))
    data["gender_board_representation"] = clean_text(row.get('Gender_Board_Representation'))
    data["gender_female_ceo"] = clean_text(row.get('Gender_Female_CEO'))
    data["gender_other"] = clean_text(row.get('Gender_Other'))
    
    data["gender_fund_vehicle"] = parse_array_field(row.get('Gender fund vehicle'))
    
    # Section 3: Portfolio Construction and Team
    # Question 24: Investment Size (6 fields)
    data["investment_size_under_100k"] = clean_text(row.get('Investment_Size_Under_100K'))
    data["investment_size_100k_199k"] = clean_text(row.get('Investment_Size_100K_199K'))
    data["investment_size_200k_499k"] = clean_text(row.get('Investment_Size_200K_499K'))
    data["investment_size_500k_999k"] = clean_text(row.get('Investment_Size_500K_999K'))
    data["investment_size_1m_2m"] = clean_text(row.get('Investment_Size_1M_2M'))
    data["investment_size_2m_plus"] = clean_text(row.get('Investment_Size_2M_Plus'))
    
    data["investment_forms"] = parse_array_field(row.get('Investment forms'))
    data["target_sectors"] = parse_array_field(row.get('Target sectors'))
    data["carried_interest_principals"] = clean_text(row.get('Carried interest principals'))
    data["current_ftes"] = clean_text(row.get('Current FTEs'))
    
    # Section 4: Portfolio Development
    # Question 29: Portfolio Needs (10 fields)
    data["portfolio_need_finance_budgeting"] = clean_text(row.get('Portfolio_Need_Finance_Budgeting'))
    data["portfolio_need_fundraising"] = clean_text(row.get('Portfolio_Need_Fundraising'))
    data["portfolio_need_strategic_planning"] = clean_text(row.get('Portfolio_Need_Strategic_Planning'))
    data["portfolio_need_product_market"] = clean_text(row.get('Portfolio_Need_Product_Market'))
    data["portfolio_need_human_capital"] = clean_text(row.get('Portfolio_Need_Human_Capital'))
    data["portfolio_need_technology"] = clean_text(row.get('Portfolio_Need_Technology'))
    data["portfolio_need_legal_regulatory"] = clean_text(row.get('Portfolio_Need_Legal_Regulatory'))
    data["portfolio_need_operations"] = clean_text(row.get('Portfolio_Need_Operations'))
    data["portfolio_need_management_training"] = clean_text(row.get('Portfolio_Need_Management_Training'))
    data["portfolio_need_other"] = clean_text(row.get('Portfolio_Need_Other'))
    
    data["investment_monetization"] = parse_array_field(row.get('Investment monetization'))
    data["exits_achieved"] = clean_text(row.get('Exits achieved'))
    
    # Question 32: Fund Capabilities (15 fields)
    data["fund_capability_global_lps"] = clean_text(row.get('Fund_Capability_Global_LPs'))
    data["fund_capability_local_lps"] = clean_text(row.get('Fund_Capability_Local_LPs'))
    data["fund_capability_warehousing"] = clean_text(row.get('Fund_Capability_Warehousing'))
    data["fund_capability_grant_opex"] = clean_text(row.get('Fund_Capability_Grant_Opex'))
    data["fund_capability_ta_support"] = clean_text(row.get('Fund_Capability_TA_Support'))
    data["fund_capability_economics"] = clean_text(row.get('Fund_Capability_Economics'))
    data["fund_capability_structuring"] = clean_text(row.get('Fund_Capability_Structuring'))
    data["fund_capability_investment_process"] = clean_text(row.get('Fund_Capability_Investment_Process'))
    data["fund_capability_post_investment"] = clean_text(row.get('Fund_Capability_Post_Investment'))
    data["fund_capability_human_capital"] = clean_text(row.get('Fund_Capability_Human_Capital'))
    data["fund_capability_back_office"] = clean_text(row.get('Fund_Capability_Back_Office'))
    data["fund_capability_exit_opportunities"] = clean_text(row.get('Fund_Capability_Exit_Opportunities'))
    data["fund_capability_legal_regulatory"] = clean_text(row.get('Fund_Capability_Legal_Regulatory'))
    data["fund_capability_impact_metrics"] = clean_text(row.get('Fund_Capability_Impact_Metrics'))
    data["fund_capability_other"] = clean_text(row.get('Fund_Capability_Other'))
    
    # Section 5: COVID-19 Impact
    data["covid_impact_aggregate"] = clean_text(row.get('COVID impact aggregate'))
    
    # Question 34: COVID Portfolio Impact (8 fields)
    data["covid_impact_staff_attendance"] = clean_text(row.get('COVID_Impact_Staff_Attendance'))
    data["covid_impact_customer_demand"] = clean_text(row.get('COVID_Impact_Customer_Demand'))
    data["covid_impact_pay_salaries"] = clean_text(row.get('COVID_Impact_Pay_Salaries'))
    data["covid_impact_fixed_costs"] = clean_text(row.get('COVID_Impact_Fixed_Costs'))
    data["covid_impact_business_loans"] = clean_text(row.get('COVID_Impact_Business_Loans'))
    data["covid_impact_supply_access"] = clean_text(row.get('COVID_Impact_Supply_Access'))
    data["covid_impact_pay_inputs"] = clean_text(row.get('COVID_Impact_Pay_Inputs'))
    data["covid_impact_pivot_model"] = clean_text(row.get('COVID_Impact_Pivot_Model'))
    
    data["covid_government_support"] = parse_array_field(row.get('COVID government support'))
    data["raising_capital_2021"] = parse_array_field(row.get('Raising capital 2021'))
    data["fund_vehicle_considerations"] = parse_array_field(row.get('Fund vehicle considerations'))
    
    # Section 6: Network Membership
    data["network_value_rating"] = clean_text(row.get('Network value rating'))
    
    # Question 39: Working Groups (5 fields)
    data["working_group_fund_economics"] = clean_text(row.get('Working_Group_Fund_Economics'))
    data["working_group_lp_profiles"] = clean_text(row.get('Working_Group_LP_Profiles'))
    data["working_group_market_data"] = clean_text(row.get('Working_Group_Market_Data'))
    data["working_group_purpose_definition"] = clean_text(row.get('Working_Group_Purpose_Definition'))
    data["working_group_access_capital"] = clean_text(row.get('Working_Group_Access_Capital'))
    
    data["working_group_suggestions"] = clean_text(row.get('Working group suggestions'))
    
    # Question 41: Webinar Content (11 fields)
    data["webinar_gender_lens"] = clean_text(row.get('Webinar_Gender_Lens'))
    data["webinar_covid_response"] = clean_text(row.get('Webinar_COVID_Response'))
    data["webinar_fundraising"] = clean_text(row.get('Webinar_Fundraising'))
    data["webinar_portfolio_support"] = clean_text(row.get('Webinar_Portfolio_Support'))
    data["webinar_sgb_bridge"] = clean_text(row.get('Webinar_SGB_Bridge'))
    data["webinar_fundraising_2"] = clean_text(row.get('Webinar_Fundraising_2'))
    data["webinar_human_capital"] = clean_text(row.get('Webinar_Human_Capital'))
    data["webinar_coinvesting"] = clean_text(row.get('Webinar_Coinvesting'))
    data["webinar_fundraising_3"] = clean_text(row.get('Webinar_Fundraising_3'))
    data["webinar_ag_food_tech"] = clean_text(row.get('Webinar_Ag_Food_Tech'))
    data["webinar_mentoring_pilot"] = clean_text(row.get('Webinar_Mentoring_Pilot'))
    
    data["webinar_suggestions"] = clean_text(row.get('Webinar suggestions'))
    data["communication_platform"] = clean_text(row.get('Communication platform'))
    
    # Question 44: Network Value Areas (4 fields)
    data["network_value_peer_connections"] = clean_text(row.get('Network_Value_Peer_Connections'))
    data["network_value_advocacy"] = clean_text(row.get('Network_Value_Advocacy'))
    data["network_value_visibility"] = clean_text(row.get('Network_Value_Visibility'))
    data["network_value_systems_change"] = clean_text(row.get('Network_Value_Systems_Change'))
    
    data["present_connection_session"] = clean_text(row.get('Present connection session'))
    
    # Question 46: Convening Initiatives (13 fields)
    data["initiative_warehousing"] = clean_text(row.get('Initiative_Warehousing'))
    data["initiative_ta_facility"] = clean_text(row.get('Initiative_TA_Facility'))
    data["initiative_advocacy"] = clean_text(row.get('Initiative_Advocacy'))
    data["initiative_mentoring_expert"] = clean_text(row.get('Initiative_Mentoring_Expert'))
    data["initiative_mentoring_peer"] = clean_text(row.get('Initiative_Mentoring_Peer'))
    data["initiative_webinars_peer"] = clean_text(row.get('Initiative_Webinars_Peer'))
    data["initiative_webinars_expert"] = clean_text(row.get('Initiative_Webinars_Expert'))
    data["initiative_fundraising_advisory"] = clean_text(row.get('Initiative_Fundraising_Advisory'))
    data["initiative_investment_readiness"] = clean_text(row.get('Initiative_Investment_Readiness'))
    data["initiative_fund_manager_portal"] = clean_text(row.get('Initiative_Fund_Manager_Portal'))
    data["initiative_shared_data"] = clean_text(row.get('Initiative_Shared_Data'))
    data["initiative_joint_back_office"] = clean_text(row.get('Initiative_Joint_Back_Office'))
    data["initiative_other"] = clean_text(row.get('Initiative_Other'))
    
    # Section 7: Convening Objectives
    data["participate_mentoring_program"] = clean_text(row.get('Participate mentoring program'))
    data["present_demystifying_session"] = parse_array_field(row.get('Present demystifying session'))
    data["additional_comments"] = clean_text(row.get('Additional comments'))
    
    # Set completed_at timestamp
    data["completed_at"] = datetime.now().isoformat()
    
    return data

def import_2021_survey_data(excel_file_path: str):
    """
    Main function to import 2021 survey data
    """
    print("\n" + "="*80)
    print("2021 SURVEY DATA IMPORT")
    print("="*80)
    
    # Read Excel file
    print(f"\n📂 Reading Excel file: {excel_file_path}")
    try:
        df = pd.read_excel(excel_file_path)
        print(f"✓ Loaded {len(df)} rows from Excel")
    except Exception as e:
        print(f"✗ Error reading Excel file: {e}")
        return
    
    # Statistics
    total_rows = len(df)
    successful_imports = 0
    failed_imports = 0
    skipped_rows = 0
    
    print(f"\n🚀 Starting import process...")
    print("-" * 80)
    
    # Process each row
    for index, row in df.iterrows():
        row_num = index + 1
        print(f"\n[Row {row_num}/{total_rows}]")
        
        # Get email and company name (using ACTUAL Excel column names)
        email = clean_text(row.get('Email Address'))
        company_name = clean_text(row.get('1. Name of firm'))
        participant_name = clean_text(row.get('2. Name of participant'))
        role_title = clean_text(row.get('3. Role / title of participant'))
        
        # Validate required fields
        if not email:
            print(f"  ⚠ Skipping row {row_num}: No email address")
            skipped_rows += 1
            continue
        
        if not company_name:
            print(f"  ⚠ Skipping row {row_num}: No company name")
            skipped_rows += 1
            continue
        
        print(f"  📧 Email: {email}")
        print(f"  🏢 Company: {company_name}")
        
        try:
            # Step 1: Create or get user
            user_id = create_or_get_user(email, company_name, participant_name)
            if not user_id:
                print(f"  ✗ Failed to create/get user for {email}")
                failed_imports += 1
                continue
            
            # Step 2: Create user profile
            profile_created = create_user_profile(user_id, email, company_name, participant_name, role_title)
            if not profile_created:
                print(f"  ⚠ Warning: Profile creation failed for {email}")
            
            # Step 3: Map and insert survey data
            survey_data = map_2021_row_to_database(row, user_id, company_name)
            
            # Insert into survey_responses_2021 table
            supabase.table('survey_responses_2021').upsert(survey_data).execute()
            print(f"  ✓ Survey data imported successfully")
            
            successful_imports += 1
            
            # Small delay to avoid rate limiting
            time.sleep(0.1)
            
        except Exception as e:
            print(f"  ✗ Error importing row {row_num}: {e}")
            failed_imports += 1
            continue
    
    # Final summary
    print("\n" + "="*80)
    print("IMPORT SUMMARY")
    print("="*80)
    print(f"Total rows processed: {total_rows}")
    print(f"✓ Successful imports: {successful_imports}")
    print(f"✗ Failed imports: {failed_imports}")
    print(f"⚠ Skipped rows: {skipped_rows}")
    print("="*80)
    
    if successful_imports > 0:
        print(f"\n🎉 Import completed! {successful_imports} survey responses imported.")
        print(f"\n📝 Note: All users created with default password: {DEFAULT_PASSWORD}")
        print(f"   Users should change their password on first login.")

if __name__ == "__main__":
    # Check if Excel file path is provided
    if len(sys.argv) < 2:
        print("Usage: python import_2021_survey_data.py <path_to_excel_file>")
        print("\nExample:")
        print("  python import_2021_survey_data.py ./data/2021_survey.xlsx")
        sys.exit(1)
    
    excel_file = sys.argv[1]
    
    # Check if file exists
    if not os.path.exists(excel_file):
        print(f"Error: File not found: {excel_file}")
        sys.exit(1)
    
    # Run import
    import_2021_survey_data(excel_file)
