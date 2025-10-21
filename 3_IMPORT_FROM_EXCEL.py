"""
EXCEL TO DATABASE IMPORT SCRIPT
================================
This script reads Excel files for each survey year and imports data
into the corresponding database tables with proper column mapping.

Requirements:
- pandas
- openpyxl
- python-dotenv
- supabase

Usage:
    python 3_IMPORT_FROM_EXCEL.py

Excel File Structure Expected:
- 2021_survey_data.xlsx
- 2022_survey_data.xlsx
- 2023_survey_data.xlsx
- 2024_survey_data.xlsx

Each Excel file should have columns matching the survey questions.
"""

import pandas as pd
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import json
from supabase import create_client, Client
from dotenv import load_dotenv
import sys

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: Supabase credentials not found in .env file")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# =====================================================
# CONFIGURATION
# =====================================================

EXCEL_FILES = {
    2021: "2021_survey_data.xlsx",
    2022: "2022_survey_data.xlsx",
    2023: "2023_survey_data.xlsx",
    2024: "2024_survey_data.xlsx"
}

# =====================================================
# COLUMN MAPPING FOR EACH YEAR
# Maps Excel column names to database column names
# =====================================================

COLUMN_MAPPING_2021 = {
    "1. Name of firm": "firm_name",
    "2. Name of participant": "participant_name",
    "3. Role / title of participant": "role_title",
    "Email": "email_address",
    "4. Where is your team based?": "team_based",
    "5. What is the geographic focus of your fund/vehicle?": "geographic_focus",
    "6. What is the stage of your current fund/vehicle's operations?": "fund_stage",
    "7. When did your current fund/investment vehicle achieve each of the following? [Legal entity]": "legal_entity_date",
    "7. When did your current fund/investment vehicle achieve each of the following? [1st close]": "first_close_date",
    "7. When did your current fund/investment vehicle achieve each of the following? [First investment]": "first_investment_date",
    "8. Please specify the number of investments made to date by your current vehicle [As of March 2020]": "investments_march_2020",
    "8. Please specify the number of investments made to date by your current vehicle [As of December 2020]": "investments_december_2020",
    "10. Type of investment vehicle": "investment_vehicle_type",
    "11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [Current]": "current_fund_size",
    "11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [Target]": "target_fund_size",
    "12. Typical investment timeframe": "investment_timeframe",
    "13. Type of business model targeted": "business_model_targeted",
    "14. Stage of business model targeted": "business_stage_targeted",
    "15. Key financing needs of portfolio enterprises (at time of initial investment/funding)": "financing_needs",
    "16. Target sources of capital for your fund": "target_capital_sources",
    "17. What is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [Achieved]": "target_irr_achieved",
    "17. What is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [Targeted]": "target_irr_targeted",
    "18. How would you frame the impact vs financial return orientation of your capital vehicle?": "impact_vs_financial_orientation",
    "20. Does your fund/investment vehicle specifically report any Sustainable Development Goals?": "report_sustainable_development_goals",
    "22. Do any of the following gender considerations apply when making investment/financing considerations?": "gender_considerations_investment",
    "23. Do any of the following apply to your fund/vehicle?": "gender_fund_vehicle",
    "24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [Your investment amount]": "investment_size_your_amount",
    "24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [Total raise by portfolio company]": "investment_size_total_raise",
    "25. What forms of investment do you typically make?": "investment_forms",
    "26. What are your target investment sectors/focus areas?": "target_sectors",
    "27. Number of current carried-interest/equity-interest principals": "carried_interest_principals",
    "28. Number of current Full Time Equivalent staff members (FTEs) including principals": "current_ftes",
    "32. What was the aggregate impact of COVID-19 on your investment vehicle?": "covid_impact_aggregate",
    "35. Did you receive any of the following government support?": "covid_government_support",
    "36. Are you raising capital in 2021?": "raising_capital_2021",
    "38. How would you rate the value of the ESCP Network to your organization?": "network_value_rating",
    "43. Would you be interested in presenting at a Connection/Reconnection Session?": "present_connection_session",
    "45. Would you be interested in participating in a peer mentoring program?": "participate_mentoring_program",
    "Additional Comments": "additional_comments"
}

COLUMN_MAPPING_2022 = {
    "Firm Name": "firm_name",
    "Participant Name": "participant_name",
    "Role/Title": "role_title",
    "Email": "email_address",
    "Fund Stage": "fund_stage",
    "Team Based": "team_based",
    "Geographic Focus": "geographic_focus",
    "Investment Vehicle Type": "investment_vehicle_type",
    "Current Fund Size": "current_fund_size",
    "Target Fund Size": "target_fund_size",
    "Business Model Targeted": "business_model_targeted",
    "Business Stage Targeted": "business_stage_targeted",
    "Target Sectors": "target_sectors",
    "Investment Forms": "investment_forms",
    "Investment Size Range": "investment_size_range",
    "Impact Orientation": "impact_orientation",
    "Report SDGs": "report_sdgs",
    "Gender Lens Investing": "gender_lens_investing",
    "Gender Considerations": "gender_considerations",
    "Team Size": "team_size",
    "Carried Interest Principals": "carried_interest_principals",
    "Number of Investments": "number_of_investments",
    "Exits to Date": "exits_to_date",
    "Target IRR": "target_irr",
    "Network Value Rating": "network_value_rating",
    "Areas of Interest": "areas_of_interest",
    "Willing to Present": "willing_to_present",
    "Mentoring Interest": "mentoring_interest",
    "Additional Comments": "additional_comments"
}

COLUMN_MAPPING_2023 = {
    "Firm Name": "firm_name",
    "Participant Name": "participant_name",
    "Role/Title": "role_title",
    "Email": "email_address",
    "Fund Stage": "fund_stage",
    "Team Location": "team_location",
    "Geographic Focus": "geographic_focus",
    "Investment Vehicle Type": "investment_vehicle_type",
    "Current Fund Size": "current_fund_size",
    "Target Fund Size": "target_fund_size",
    "Fund Vintage Year": "fund_vintage_year",
    "Business Model Targeted": "business_model_targeted",
    "Business Stage Targeted": "business_stage_targeted",
    "Target Sectors": "target_sectors",
    "Investment Forms": "investment_forms",
    "Typical Investment Size": "typical_investment_size",
    "Investment Timeframe": "investment_timeframe",
    "Impact Orientation": "impact_orientation",
    "Report SDGs": "report_sdgs",
    "ESG Framework": "esg_framework",
    "Gender Lens Investing": "gender_lens_investing",
    "Gender Considerations": "gender_considerations",
    "Team Size": "team_size",
    "Carried Interest Principals": "carried_interest_principals",
    "Key Team Capabilities": "key_team_capabilities",
    "Number of Investments": "number_of_investments",
    "Exits to Date": "exits_to_date",
    "Target IRR": "target_irr",
    "Actual IRR": "actual_irr",
    "Key Challenges": "key_challenges",
    "Support Needs": "support_needs",
    "Technical Assistance Areas": "technical_assistance_areas",
    "Network Value Rating": "network_value_rating",
    "Most Valuable Network Aspects": "most_valuable_network_aspects",
    "Willing to Present": "willing_to_present",
    "Presentation Topics": "presentation_topics",
    "Mentoring Interest": "mentoring_interest",
    "Peer Learning Interest": "peer_learning_interest",
    "Market Outlook": "market_outlook",
    "Emerging Trends": "emerging_trends",
    "Additional Comments": "additional_comments"
}

COLUMN_MAPPING_2024 = {
    "Firm Name": "firm_name",
    "Participant Name": "participant_name",
    "Role/Title": "role_title",
    "Email": "email_address",
    "Fund Stage": "fund_stage",
    "Team Location": "team_location",
    "Geographic Focus": "geographic_focus",
    "Markets Operated": "markets_operated",
    "Investment Vehicle Type": "investment_vehicle_type",
    "Current Fund Size": "current_fund_size",
    "Target Fund Size": "target_fund_size",
    "Fund Vintage Year": "fund_vintage_year",
    "Legal Domicile": "legal_domicile",
    "Business Model Targeted": "business_model_targeted",
    "Business Stage Targeted": "business_stage_targeted",
    "Target Sectors": "target_sectors",
    "Investment Forms": "investment_forms",
    "Typical Investment Size": "typical_investment_size",
    "Investment Timeframe": "investment_timeframe",
    "Co-Investment Approach": "co_investment_approach",
    "Impact Orientation": "impact_orientation",
    "Impact Measurement Frameworks": "impact_measurement_frameworks",
    "Report SDGs": "report_sdgs",
    "ESG Framework": "esg_framework",
    "Climate Focus": "climate_focus",
    "Gender Lens Investing": "gender_lens_investing",
    "Gender Considerations": "gender_considerations",
    "Diversity Metrics Tracked": "diversity_metrics_tracked",
    "Team Size": "team_size",
    "Carried Interest Principals": "carried_interest_principals",
    "Key Team Capabilities": "key_team_capabilities",
    "Advisory Board": "advisory_board",
    "Investment Committee Structure": "investment_committee_structure",
    "Number of Investments": "number_of_investments",
    "Active Portfolio Companies": "active_portfolio_companies",
    "Exits to Date": "exits_to_date",
    "Exit Strategies": "exit_strategies",
    "Target IRR": "target_irr",
    "Actual IRR": "actual_irr",
    "DPI": "dpi",
    "TVPI": "tvpi",
    "Currently Fundraising": "currently_fundraising",
    "Fundraising Target": "fundraising_target",
    "Fundraising Progress": "fundraising_progress",
    "Target Investor Types": "target_investor_types",
    "Key Challenges": "key_challenges",
    "Support Needs": "support_needs",
    "Technical Assistance Areas": "technical_assistance_areas",
    "Capacity Building Priorities": "capacity_building_priorities",
    "Network Value Rating": "network_value_rating",
    "Most Valuable Network Aspects": "most_valuable_network_aspects",
    "Willing to Present": "willing_to_present",
    "Presentation Topics": "presentation_topics",
    "Mentoring Interest": "mentoring_interest",
    "Peer Learning Interest": "peer_learning_interest",
    "Working Groups Interest": "working_groups_interest",
    "Market Outlook": "market_outlook",
    "Emerging Trends": "emerging_trends",
    "Technology Adoption": "technology_adoption",
    "Regulatory Concerns": "regulatory_concerns",
    "Digital Tools Used": "digital_tools_used",
    "AI/ML Adoption": "ai_ml_adoption",
    "Blockchain Interest": "blockchain_interest",
    "Success Stories": "success_stories",
    "Lessons Learned": "lessons_learned",
    "Additional Comments": "additional_comments"
}

COLUMN_MAPPINGS = {
    2021: COLUMN_MAPPING_2021,
    2022: COLUMN_MAPPING_2022,
    2023: COLUMN_MAPPING_2023,
    2024: COLUMN_MAPPING_2024
}

# =====================================================
# UTILITY FUNCTIONS
# =====================================================

def clean_value(value: Any) -> Any:
    """Clean and normalize cell values"""
    if pd.isna(value) or value == '' or value == 'nan':
        return None
    
    if isinstance(value, str):
        value = value.strip()
        if value.lower() in ['', 'n/a', 'na', 'none', 'null']:
            return None
    
    return value

def parse_array_field(value: Any) -> Optional[List[str]]:
    """Parse comma-separated or multi-line values into arrays"""
    if not value or pd.isna(value):
        return None
    
    if isinstance(value, list):
        return [str(item).strip() for item in value if item]
    
    value_str = str(value)
    # Split by comma, semicolon, or newline
    items = [item.strip() for item in value_str.replace(';', ',').replace('\n', ',').split(',')]
    items = [item for item in items if item and item.lower() not in ['', 'n/a', 'na', 'none']]
    
    return items if items else None

def parse_boolean(value: Any) -> Optional[bool]:
    """Parse boolean values"""
    if pd.isna(value) or value == '':
        return None
    
    value_str = str(value).lower().strip()
    if value_str in ['yes', 'true', '1', 'y']:
        return True
    elif value_str in ['no', 'false', '0', 'n']:
        return False
    
    return None

def parse_date(value: Any) -> Optional[str]:
    """Parse date values"""
    if pd.isna(value) or value == '':
        return None
    
    try:
        if isinstance(value, datetime):
            return value.strftime('%Y-%m-%d')
        
        # Try parsing as string
        date_obj = pd.to_datetime(value)
        return date_obj.strftime('%Y-%m-%d')
    except:
        return None

def parse_jsonb_field(value: Any) -> Optional[Dict]:
    """Parse JSONB fields"""
    if not value or pd.isna(value):
        return None
    
    if isinstance(value, dict):
        return value
    
    try:
        return json.loads(str(value))
    except:
        return None

def get_or_create_user(company_name: str, email: str, full_name: str = None) -> Optional[str]:
    """
    Get existing user or create new user for a company
    Returns user_id
    """
    try:
        # Check if user exists with this email
        response = supabase.table('user_profiles').select('id, company_id').eq('email', email).execute()
        
        if response.data and len(response.data) > 0:
            print(f"  ✓ Found existing user: {email}")
            return response.data[0]['id']
        
        # Check if company exists (by company_name)
        company_response = supabase.table('user_profiles').select('company_id').eq('company_name', company_name).limit(1).execute()
        
        company_id = None
        if company_response.data and len(company_response.data) > 0:
            company_id = company_response.data[0]['company_id']
            print(f"  ✓ Found existing company: {company_name}")
        
        # Create new user via Supabase Auth
        # Note: In production, you'd use Supabase Admin API to create users
        # For now, we'll create a profile entry with a generated UUID
        import uuid
        user_id = str(uuid.uuid4())
        
        profile_data = {
            'id': user_id,
            'email': email,
            'company_name': company_name,
            'company_id': company_id if company_id else str(uuid.uuid4()),
            'full_name': full_name,
            'user_role': 'member',  # Default role
            'is_active': True
        }
        
        # Insert profile
        supabase.table('user_profiles').insert(profile_data).execute()
        print(f"  ✓ Created new user: {email} for company: {company_name}")
        
        return user_id
        
    except Exception as e:
        print(f"  ✗ Error creating/getting user: {str(e)}")
        return None

def map_row_to_db_columns(row: pd.Series, column_mapping: Dict[str, str], year: int) -> Dict[str, Any]:
    """Map Excel row to database columns"""
    db_row = {}
    
    for excel_col, db_col in column_mapping.items():
        if excel_col not in row.index:
            continue
        
        value = clean_value(row[excel_col])
        
        if value is None:
            db_row[db_col] = None
            continue
        
        # Determine field type and parse accordingly
        if db_col.endswith('_date'):
            db_row[db_col] = parse_date(value)
        elif db_col in ['team_based', 'geographic_focus', 'investment_vehicle_type', 'business_model_targeted',
                        'business_stage_targeted', 'financing_needs', 'target_capital_sources', 'investment_forms',
                        'target_sectors', 'gender_considerations_investment', 'gender_fund_vehicle',
                        'covid_government_support', 'raising_capital_2021', 'gender_considerations',
                        'areas_of_interest', 'key_team_capabilities', 'key_challenges', 'support_needs',
                        'technical_assistance_areas', 'most_valuable_network_aspects', 'presentation_topics',
                        'peer_learning_interest', 'emerging_trends', 'markets_operated', 'impact_measurement_frameworks',
                        'esg_framework', 'diversity_metrics_tracked', 'exit_strategies', 'target_investor_types',
                        'capacity_building_priorities', 'working_groups_interest', 'technology_adoption',
                        'regulatory_concerns', 'digital_tools_used', 'present_demystifying_session']:
            db_row[db_col] = parse_array_field(value)
        elif db_col in ['report_sustainable_development_goals', 'report_sdgs', 'gender_lens_investing',
                        'willing_to_present', 'climate_focus', 'advisory_board', 'currently_fundraising',
                        'blockchain_interest']:
            db_row[db_col] = parse_boolean(value)
        elif db_col in ['top_sdgs', 'portfolio_needs_ranking', 'fund_capabilities_ranking', 'covid_impact_portfolio',
                        'working_groups_ranking', 'webinar_content_ranking', 'network_value_areas',
                        'convening_initiatives_ranking']:
            db_row[db_col] = parse_jsonb_field(value)
        else:
            db_row[db_col] = value
    
    return db_row

def import_survey_year(year: int, excel_file: str) -> bool:
    """Import survey data for a specific year"""
    print(f"\n{'='*60}")
    print(f"IMPORTING {year} SURVEY DATA")
    print(f"{'='*60}")
    
    if not os.path.exists(excel_file):
        print(f"✗ Excel file not found: {excel_file}")
        print(f"  Please place the file in the same directory as this script")
        return False
    
    try:
        # Read Excel file
        print(f"Reading Excel file: {excel_file}")
        df = pd.read_excel(excel_file)
        print(f"✓ Found {len(df)} rows in Excel file")
        
        # Get column mapping for this year
        column_mapping = COLUMN_MAPPINGS[year]
        
        # Process each row
        success_count = 0
        error_count = 0
        
        for idx, row in df.iterrows():
            try:
                print(f"\nProcessing row {idx + 1}/{len(df)}...")
                
                # Extract company name and email
                company_name = clean_value(row.get('Firm Name') or row.get('1. Name of firm'))
                email = clean_value(row.get('Email') or row.get('Email Address'))
                participant_name = clean_value(row.get('Participant Name') or row.get('2. Name of participant'))
                
                if not company_name:
                    print(f"  ⚠ Skipping row {idx + 1}: No company name")
                    continue
                
                if not email:
                    print(f"  ⚠ Skipping row {idx + 1}: No email")
                    continue
                
                # Get or create user
                user_id = get_or_create_user(company_name, email, participant_name)
                
                if not user_id:
                    print(f"  ✗ Failed to get/create user for row {idx + 1}")
                    error_count += 1
                    continue
                
                # Map row to database columns
                db_row = map_row_to_db_columns(row, column_mapping, year)
                db_row['user_id'] = user_id
                db_row['company_name'] = company_name
                db_row['completed_at'] = datetime.now().isoformat()
                
                # Insert into database
                table_name = f'survey_responses_{year}'
                supabase.table(table_name).insert(db_row).execute()
                
                print(f"  ✓ Successfully imported row {idx + 1}")
                success_count += 1
                
            except Exception as e:
                print(f"  ✗ Error processing row {idx + 1}: {str(e)}")
                error_count += 1
                continue
        
        print(f"\n{'='*60}")
        print(f"IMPORT SUMMARY FOR {year}")
        print(f"{'='*60}")
        print(f"✓ Successfully imported: {success_count} rows")
        print(f"✗ Errors: {error_count} rows")
        print(f"{'='*60}\n")
        
        return success_count > 0
        
    except Exception as e:
        print(f"✗ Fatal error importing {year} data: {str(e)}")
        return False

# =====================================================
# MAIN EXECUTION
# =====================================================

def main():
    """Main execution function"""
    print("\n" + "="*60)
    print("EXCEL TO DATABASE IMPORT TOOL")
    print("="*60)
    print(f"Supabase URL: {SUPABASE_URL}")
    print("="*60 + "\n")
    
    # Check for Excel files
    available_files = []
    for year, filename in EXCEL_FILES.items():
        if os.path.exists(filename):
            available_files.append((year, filename))
            print(f"✓ Found: {filename}")
        else:
            print(f"✗ Missing: {filename}")
    
    if not available_files:
        print("\n✗ No Excel files found!")
        print("Please place Excel files in the same directory as this script:")
        for year, filename in EXCEL_FILES.items():
            print(f"  - {filename}")
        return
    
    print(f"\nFound {len(available_files)} Excel file(s) to import")
    
    # Confirm before proceeding
    response = input("\nProceed with import? (yes/no): ").strip().lower()
    if response != 'yes':
        print("Import cancelled")
        return
    
    # Import each year
    results = {}
    for year, filename in available_files:
        results[year] = import_survey_year(year, filename)
    
    # Final summary
    print("\n" + "="*60)
    print("FINAL IMPORT SUMMARY")
    print("="*60)
    for year, success in results.items():
        status = "✓ SUCCESS" if success else "✗ FAILED"
        print(f"{year}: {status}")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
