"""
2021 MSME Survey Data Import Script
====================================
This script imports 2021 survey data from Excel into Supabase.

Features:
- Creates users with company name as unique identifier
- Sets default password: FrontierFinance2024!
- Maps Excel columns to database schema
- Handles complex field transformations (arrays, JSONB, rankings)
- Creates user profiles with company information
"""

import pandas as pd
import json
import re
from supabase import create_client, Client
from typing import Dict, List, Any, Optional
import os
from datetime import datetime
import uuid

# =====================================================
# CONFIGURATION
# =====================================================
SUPABASE_URL = os.getenv("SUPABASE_URL", "YOUR_SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "YOUR_SERVICE_ROLE_KEY")
DEFAULT_PASSWORD = "FrontierFinance2024!"
EXCEL_FILE_PATH = "2021_survey_data.xlsx"  # Update with actual path

# Initialize Supabase client with service role key (bypasses RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


# =====================================================
# HELPER FUNCTIONS
# =====================================================

def clean_value(value: Any) -> Any:
    """Clean and normalize values from Excel."""
    if pd.isna(value) or value == "NULL" or value == "":
        return None
    if isinstance(value, str):
        value = value.strip()
        if value.lower() in ["null", "n/a", "-", ""]:
            return None
    return value


def parse_array_field(value: Any) -> List[str]:
    """Parse comma-separated or multi-select fields into arrays."""
    if not value or pd.isna(value):
        return []
    
    if isinstance(value, list):
        return [str(v).strip() for v in value if v and str(v).strip()]
    
    # Split by comma or semicolon
    items = re.split(r'[,;]', str(value))
    return [item.strip() for item in items if item.strip()]


def parse_timeline_field(row_data: Dict, year_columns: List[str]) -> str:
    """Parse timeline questions (Question 7) to determine when milestones were achieved."""
    for col in year_columns:
        value = row_data.get(col)
        if value and not pd.isna(value) and str(value).strip():
            # Extract year from column name
            year_match = re.search(r'(\d{4})', col)
            if year_match:
                return year_match.group(1)
            elif 'Prior to 2000' in col:
                return 'Prior to 2000'
            elif '2000-2010' in col:
                return '2000-2010'
            elif 'N/A' in col:
                return 'Not Applicable'
    return None


def parse_investment_count(row_data: Dict, count_columns: List[str]) -> str:
    """Parse investment count fields (Question 8)."""
    for col in count_columns:
        value = row_data.get(col)
        if value and not pd.isna(value) and str(value).strip():
            # Extract range from column name
            if '[0]' in col:
                return '0'
            elif '[1-4]' in col:
                return '1-4'
            elif '[5-9]' in col:
                return '5-9'
            elif '[10-14]' in col:
                return '10-14'
            elif '[15-24]' in col:
                return '15-24'
            elif '[25+]' in col:
                return '25+'
    return None


def parse_fund_size(row_data: Dict, size_columns: List[str], target_type: str) -> str:
    """Parse fund size fields (Question 11)."""
    for col in size_columns:
        value = row_data.get(col)
        if value and not pd.isna(value):
            value_str = str(value).strip()
            if target_type.lower() in value_str.lower():
                # Extract size range from column name
                if '< $1 million' in col:
                    return '< $1 million'
                elif '$1-4 million' in col:
                    return '$1-4 million'
                elif '$5-9 million' in col:
                    return '$5-9 million'
                elif '$10-19 million' in col:
                    return '$10-19 million'
                elif '$20-29 million' in col:
                    return '$20-29 million'
                elif '$30 million or more' in col:
                    return '$30 million or more'
    return None


def parse_irr_range(row_data: Dict, irr_columns: List[str], target_type: str) -> str:
    """Parse IRR range fields (Question 17)."""
    for col in irr_columns:
        value = row_data.get(col)
        if value and not pd.isna(value):
            value_str = str(value).strip()
            if target_type.lower() in value_str.lower():
                # Extract IRR range from column name
                if '< or = 5%' in col:
                    return '<= 5%'
                elif '6-9%' in col:
                    return '6-9%'
                elif '10-15%' in col:
                    return '10-15%'
                elif '16-20%' in col:
                    return '16-20%'
                elif '20%+' in col:
                    return '20%+'
    return None


def parse_sdg_fields(row_data: Dict, sdg_columns: List[str]) -> List[str]:
    """Parse SDG fields (Question 21) into top 3 SDGs."""
    sdgs = []
    
    # Map column names to SDG names
    sdg_mapping = {
        'No Poverty': 'SDG 1: No Poverty',
        'Zero Hunger': 'SDG 2: Zero Hunger',
        'Good Health and Well-Being': 'SDG 3: Good Health and Well-Being',
        'Quality Education': 'SDG 4: Quality Education',
        'Gender Equality': 'SDG 5: Gender Equality',
        'Clean Water and Sanitation': 'SDG 6: Clean Water and Sanitation',
        'Affordable and Clean Energy': 'SDG 7: Affordable and Clean Energy',
        'Decent Work and Economic Growth': 'SDG 8: Decent Work and Economic Growth',
        'Industry Innovation and Infrastructure': 'SDG 9: Industry Innovation and Infrastructure',
        'Reduced Inequalities': 'SDG 10: Reduced Inequalities',
        'Sustainable Cities and Communities': 'SDG 11: Sustainable Cities and Communities',
        'Responsible Consumption and Production': 'SDG 12: Responsible Consumption and Production',
        'Climate Action': 'SDG 13: Climate Action',
        'Life Below Water': 'SDG 14: Life Below Water',
        'Life on Land': 'SDG 15: Life on Land',
        'Peace, Justice, and Strong Institutions': 'SDG 16: Peace, Justice, and Strong Institutions',
        'Partnerships for the Goals': 'SDG 17: Partnerships for the Goals',
    }
    
    # Collect SDGs with their rankings
    sdg_ranks = {}
    for col in sdg_columns:
        value = row_data.get(col)
        if value and not pd.isna(value):
            value_str = str(value).strip().lower()
            if value_str not in ['null', 'n/a', '-', '']:
                # Extract SDG name from column
                for sdg_key, sdg_name in sdg_mapping.items():
                    if sdg_key in col:
                        if 'first' in value_str:
                            sdg_ranks[sdg_name] = 1
                        elif 'second' in value_str:
                            sdg_ranks[sdg_name] = 2
                        elif 'third' in value_str:
                            sdg_ranks[sdg_name] = 3
                        elif 'others' in value_str:
                            sdg_ranks[sdg_name] = 99
                        break
    
    # Sort by rank and return top 3
    sorted_sdgs = sorted(sdg_ranks.items(), key=lambda x: x[1])
    return [sdg for sdg, _ in sorted_sdgs[:3]]


def parse_gender_considerations(row_data: Dict, gender_columns: List[str]) -> tuple:
    """Parse gender consideration fields (Question 22) into two arrays."""
    considerations = []
    requirements = []
    
    for col in gender_columns:
        value = row_data.get(col)
        if value and not pd.isna(value):
            value_str = str(value).strip()
            
            # Extract the consideration from column name
            consideration_text = col.split('[')[1].split(']')[0] if '[' in col else None
            
            if consideration_text:
                if 'Investment Consideration' in value_str:
                    considerations.append(consideration_text)
                elif 'Investment Requirement' in value_str:
                    requirements.append(consideration_text)
    
    return considerations, requirements


def parse_investment_size(row_data: Dict, size_columns: List[str]) -> tuple:
    """Parse investment size fields (Question 24) into two values."""
    your_amount = None
    total_raise = None
    
    for col in size_columns:
        value = row_data.get(col)
        if value and not pd.isna(value):
            value_str = str(value).strip()
            
            # Extract size range from column name
            size_range = None
            if '<$100,000' in col:
                size_range = '<$100,000'
            elif '$100,000 - $199,000' in col:
                size_range = '$100,000 - $199,000'
            elif '$200,000 - $499,000' in col:
                size_range = '$200,000 - $499,000'
            elif '$500,000 - $999,000' in col:
                size_range = '$500,000 - $999,000'
            elif '$1,000,000 - $1,999,000' in col:
                size_range = '$1,000,000 - $1,999,000'
            elif '≥$2,000,000' in col:
                size_range = '≥$2,000,000'
            
            if size_range:
                if 'Your investment amount' in value_str:
                    your_amount = size_range
                if 'Total raise by portfolio company' in value_str:
                    total_raise = size_range
    
    return your_amount, total_raise


def parse_ranking_field(row_data: Dict, ranking_columns: List[str]) -> Dict[str, int]:
    """Parse ranking fields into JSONB format."""
    rankings = {}
    
    for col in ranking_columns:
        value = row_data.get(col)
        if value and not pd.isna(value):
            try:
                # Extract the item name from column
                item_match = re.search(r'\[(.*?)\]', col)
                if item_match:
                    item_name = item_match.group(1)
                    rank_value = float(value)
                    
                    # Skip N/A values
                    if str(value).strip().upper() != 'N/A':
                        rankings[item_name] = int(rank_value)
            except (ValueError, TypeError):
                pass
    
    return rankings


def create_or_get_user(email: str, company_name: str, participant_name: str, role_title: str) -> Optional[str]:
    """Create a new user or get existing user ID."""
    try:
        # Check if user already exists by email
        existing_profile = supabase.table('user_profiles').select('id').eq('email', email).execute()
        
        if existing_profile.data and len(existing_profile.data) > 0:
            print(f"  ✓ User already exists: {email}")
            return existing_profile.data[0]['id']
        
        # Create new user using Supabase Auth Admin API
        user_response = supabase.auth.admin.create_user({
            "email": email,
            "password": DEFAULT_PASSWORD,
            "email_confirm": True,
            "user_metadata": {
                "company_name": company_name,
                "full_name": participant_name,
                "role_title": role_title
            }
        })
        
        user_id = user_response.user.id
        
        # Create user profile
        profile_data = {
            "id": user_id,
            "company_name": company_name,
            "email": email,
            "full_name": participant_name,
            "role_title": role_title,
            "user_role": "member",
            "is_active": True,
            "email_verified": True
        }
        
        supabase.table('user_profiles').insert(profile_data).execute()
        
        print(f"  ✓ Created new user: {email} (Company: {company_name})")
        return user_id
        
    except Exception as e:
        print(f"  ✗ Error creating user {email}: {str(e)}")
        return None


def transform_row_to_survey_2021(row_data: Dict, user_id: str) -> Dict[str, Any]:
    """Transform Excel row data to match survey_responses_2021 schema."""
    
    # Timeline fields (Question 7)
    legal_entity_columns = [col for col in row_data.keys() if '7. When did your current fund/investment vehicle achieve each of the following?' in col]
    legal_entity_date = parse_timeline_field(row_data, legal_entity_columns)
    first_close_date = legal_entity_date  # Same columns
    first_investment_date = legal_entity_date  # Same columns
    
    # Investment count fields (Question 8)
    investment_march_columns = [col for col in row_data.keys() if '8. Please specify the number of investments made to date' in col and 'March 2020' in str(row_data.get(col, ''))]
    investment_december_columns = [col for col in row_data.keys() if '8. Please specify the number of investments made to date' in col and 'December 2020' in str(row_data.get(col, ''))]
    
    investments_march_2020 = parse_investment_count(row_data, investment_march_columns)
    investments_december_2020 = parse_investment_count(row_data, investment_december_columns)
    
    # Fund size fields (Question 11)
    fund_size_columns = [col for col in row_data.keys() if '11. What is the current (hard commitments raised) and target size' in col]
    current_fund_size = parse_fund_size(row_data, fund_size_columns, 'Current')
    target_fund_size = parse_fund_size(row_data, fund_size_columns, 'Target')
    
    # IRR fields (Question 17)
    irr_columns = [col for col in row_data.keys() if '17.' in col and 'Internal Rate of Return' in col]
    target_irr_achieved = parse_irr_range(row_data, irr_columns, 'Achieved')
    target_irr_targeted = parse_irr_range(row_data, irr_columns, 'Targeted')
    
    # SDG fields (Question 21)
    sdg_columns = [col for col in row_data.keys() if '21. If yes, please list the top 3 Sustainable Development Goals' in col]
    top_sdgs = parse_sdg_fields(row_data, sdg_columns)
    
    # Gender consideration fields (Question 22)
    gender_columns = [col for col in row_data.keys() if '22. Do any of the following gender considerations apply' in col]
    gender_considerations_investment, gender_considerations_requirement = parse_gender_considerations(row_data, gender_columns)
    
    # Investment size fields (Question 24)
    investment_size_columns = [col for col in row_data.keys() if '24. What is the typical size of investment' in col]
    investment_size_your, investment_size_total = parse_investment_size(row_data, investment_size_columns)
    
    # Ranking fields
    portfolio_needs_columns = [col for col in row_data.keys() if '29.' in col and 'key needs of portfolio enterprises' in col]
    portfolio_needs_ranking = parse_ranking_field(row_data, portfolio_needs_columns)
    
    fund_capabilities_columns = [col for col in row_data.keys() if '32.' in col and 'Fund capabilities and resources' in col]
    fund_capabilities_ranking = parse_ranking_field(row_data, fund_capabilities_columns)
    
    covid_portfolio_columns = [col for col in row_data.keys() if '34. What impact has COVID-19 had' in col]
    covid_impact_portfolio = parse_ranking_field(row_data, covid_portfolio_columns)
    
    working_groups_columns = [col for col in row_data.keys() if '39.' in col and 'working groups' in col]
    working_groups_ranking = parse_ranking_field(row_data, working_groups_columns)
    
    webinar_columns = [col for col in row_data.keys() if '41.' in col and 'webinar content' in col]
    webinar_content_ranking = parse_ranking_field(row_data, webinar_columns)
    
    network_value_columns = [col for col in row_data.keys() if '44.' in col and 'main areas of value' in col]
    network_value_areas = parse_ranking_field(row_data, network_value_columns)
    
    convening_columns = [col for col in row_data.keys() if '46.' in col and 'In advance of Session 3' in col]
    convening_initiatives_ranking = parse_ranking_field(row_data, convening_columns)
    
    # Build the survey response object
    survey_data = {
        "user_id": user_id,
        "is_draft": False,
        "completed_at": clean_value(row_data.get('Timestamp')),
        
        # Section 1: Basic Information
        "firm_name": clean_value(row_data.get('1. Name of firm')),
        "participant_name": clean_value(row_data.get('2. Name of participant')),
        "role_title": clean_value(row_data.get('3. Role / title of participant')),
        "team_based": parse_array_field(row_data.get('4. Where is your team based?')),
        "team_based_other": None,
        "geographic_focus": parse_array_field(row_data.get('5. What is the geographic focus of your fund/vehicle?')),
        "geographic_focus_other": None,
        "fund_stage": clean_value(row_data.get('6. What is the stage of your current fund/vehicle\'s operations?')),
        "fund_stage_other": None,
        
        # Section 2: Timeline and Investments
        "legal_entity_date": legal_entity_date or 'Not Specified',
        "first_close_date": first_close_date or 'Not Specified',
        "first_investment_date": first_investment_date or 'Not Specified',
        "investments_march_2020": investments_march_2020 or 'Not Specified',
        "investments_december_2020": investments_december_2020 or 'Not Specified',
        "optional_supplement": clean_value(row_data.get('9. Optional supplement to question above')),
        
        # Section 3: Fund Structure
        "investment_vehicle_type": parse_array_field(row_data.get('10. Type of investment vehicle')),
        "investment_vehicle_type_other": None,
        "current_fund_size": current_fund_size or 'Not Specified',
        "target_fund_size": target_fund_size or 'Not Specified',
        "investment_timeframe": clean_value(row_data.get('12. Typical investment timeframe')) or 'Not Specified',
        "investment_timeframe_other": None,
        
        # Section 4: Investment Thesis
        "business_model_targeted": parse_array_field(row_data.get('13. Type of business model targeted')),
        "business_model_targeted_other": None,
        "business_stage_targeted": parse_array_field(row_data.get('14. Stage of business model targeted')),
        "business_stage_targeted_other": None,
        "financing_needs": parse_array_field(row_data.get('15. Key financing needs of portfolio enterprises')),
        "financing_needs_other": None,
        "target_capital_sources": parse_array_field(row_data.get('16.\tTarget sources of capital for your fund')),
        "target_capital_sources_other": None,
        
        # Section 5: Returns and Impact
        "target_irr_achieved": target_irr_achieved or 'Not Specified',
        "target_irr_targeted": target_irr_targeted or 'Not Specified',
        "impact_vs_financial_orientation": clean_value(row_data.get('18. How would you frame the impact vs financial return orientation')) or 'Not Specified',
        "explicit_lens_focus": parse_array_field(row_data.get('19.\tDoes your fund/vehicle have an explicit lens/focus?')),
        "explicit_lens_focus_other": None,
        "report_sustainable_development_goals": clean_value(row_data.get('20. Does your fund/investment vehicle specifically report any Sustainable Development Goals?')) == 'Yes',
        "top_sdg_1": top_sdgs[0] if len(top_sdgs) > 0 else None,
        "top_sdg_2": top_sdgs[1] if len(top_sdgs) > 1 else None,
        "top_sdg_3": top_sdgs[2] if len(top_sdgs) > 2 else None,
        
        # Section 6: Gender
        "gender_considerations_investment": gender_considerations_investment,
        "gender_considerations_investment_other": None,
        "gender_considerations_requirement": gender_considerations_requirement,
        "gender_considerations_requirement_other": None,
        "gender_fund_vehicle": parse_array_field(row_data.get('23. Do any of the following apply to your fund/vehicle?')),
        "gender_fund_vehicle_other": None,
        
        # Section 7: Investment Details
        "investment_size_your_amount": investment_size_your or 'Not Specified',
        "investment_size_total_raise": investment_size_total or 'Not Specified',
        "investment_forms": parse_array_field(row_data.get('25.\tWhat forms of investment do you typically make?')),
        "investment_forms_other": None,
        "target_sectors": parse_array_field(row_data.get('26.\tWhat are your target investment sectors/focus areas?')),
        "target_sectors_other": None,
        
        # Section 8: Team
        "carried_interest_principals": clean_value(row_data.get('27.\tNumber of current carried-interest/equity-interest principals')) or 'Not Specified',
        "current_ftes": clean_value(row_data.get('28.\tNumber of current Full Time Equivalent staff members (FTEs) including principals')) or 'Not Specified',
        
        # Section 9: Rankings and Needs
        "portfolio_needs_ranking": portfolio_needs_ranking,
        "portfolio_needs_other": None,
        "investment_monetization": parse_array_field(row_data.get('30.\tWhat is the typical form of investment monetization/exit?')),
        "investment_monetization_other": None,
        "exits_achieved": clean_value(row_data.get('31.\tHow many exits has your vehicle achieved to date')) or 'Not Specified',
        "fund_capabilities_ranking": fund_capabilities_ranking,
        "fund_capabilities_other": None,
        
        # Section 10: COVID Impact
        "covid_impact_aggregate": clean_value(row_data.get('33.\tAt an aggregate level, please indicate the impact of COVID-19')) or 'Not Specified',
        "covid_impact_portfolio": covid_impact_portfolio,
        "covid_government_support": parse_array_field(row_data.get('35. Have you received any financial or non-financial support')),
        "covid_government_support_other": None,
        
        # Section 11: Future Plans
        "raising_capital_2021": parse_array_field(row_data.get('36. Do you anticipating raising new LP/investor funds in 2021?')),
        "raising_capital_2021_other": None,
        "fund_vehicle_considerations": parse_array_field(row_data.get('37. Regarding your current fund/investment vehicle, which of the following is under consideration?')),
        "fund_vehicle_considerations_other": None,
        
        # Section 12: Network Value
        "network_value_rating": clean_value(row_data.get('38.\tOverall, how valuable have you found your participation in the ESCP network?')) or 'Not Specified',
        "working_groups_ranking": working_groups_ranking,
        "new_working_group_suggestions": clean_value(row_data.get('40.\tDo you have suggestions of new working group topics/formats')),
        "webinar_content_ranking": webinar_content_ranking,
        "new_webinar_suggestions": clean_value(row_data.get('42.\tDo you have suggestions of new webinar topics/formats')),
        "communication_platform": clean_value(row_data.get('43.\tDo you prefer Slack or WhatsApp as a communication platform')) or 'Not Specified',
        "network_value_areas": network_value_areas,
        
        # Section 13: Participation
        "present_connection_session": clean_value(row_data.get('45.\tWould you like to present in Session 1')) == 'Yes',
        "convening_initiatives_ranking": convening_initiatives_ranking,
        "convening_initiatives_other": None,
        "participate_mentoring_program": clean_value(row_data.get('47.\tWould you be interested in participating in a peer mentoring program?')),
        "present_demystifying_session": parse_array_field(row_data.get('48.\tWould you like to present in Session 4')),
        "present_demystifying_session_other": None,
        "additional_comments": clean_value(row_data.get('49.\tAny other comments / feedback')),
    }
    
    return survey_data


def import_survey_data(excel_path: str):
    """Main function to import survey data from Excel."""
    print("\n" + "="*80)
    print("2021 MSME SURVEY DATA IMPORT")
    print("="*80 + "\n")
    
    # Read Excel file
    print(f"📂 Reading Excel file: {excel_path}")
    try:
        df = pd.read_excel(excel_path)
        print(f"  ✓ Loaded {len(df)} rows\n")
    except Exception as e:
        print(f"  ✗ Error reading Excel file: {str(e)}")
        return
    
    # Convert DataFrame to list of dictionaries
    rows = df.to_dict('records')
    
    # Statistics
    total_rows = len(rows)
    successful_imports = 0
    failed_imports = 0
    skipped_rows = 0
    
    print(f"🚀 Starting import of {total_rows} survey responses...\n")
    
    for idx, row in enumerate(rows, 1):
        print(f"[{idx}/{total_rows}] Processing response...")
        
        try:
            # Extract key fields
            email = clean_value(row.get('Email Address'))
            company_name = clean_value(row.get('1. Name of firm'))
            participant_name = clean_value(row.get('2. Name of participant'))
            role_title = clean_value(row.get('3. Role / title of participant'))
            
            # Validate required fields
            if not email or not company_name:
                print(f"  ⚠ Skipping row {idx}: Missing email or company name\n")
                skipped_rows += 1
                continue
            
            # Create or get user
            user_id = create_or_get_user(email, company_name, participant_name, role_title)
            
            if not user_id:
                print(f"  ✗ Failed to create/get user for {email}\n")
                failed_imports += 1
                continue
            
            # Transform row data to survey schema
            survey_data = transform_row_to_survey_2021(row, user_id)
            
            # Insert survey response
            result = supabase.table('survey_responses_2021').insert(survey_data).execute()
            
            print(f"  ✓ Successfully imported survey for {company_name}")
            print(f"    User ID: {user_id}\n")
            successful_imports += 1
            
        except Exception as e:
            print(f"  ✗ Error processing row {idx}: {str(e)}\n")
            failed_imports += 1
            continue
    
    # Print summary
    print("\n" + "="*80)
    print("IMPORT SUMMARY")
    print("="*80)
    print(f"Total rows processed:     {total_rows}")
    print(f"✓ Successful imports:     {successful_imports}")
    print(f"✗ Failed imports:         {failed_imports}")
    print(f"⚠ Skipped rows:           {skipped_rows}")
    print("="*80 + "\n")


# =====================================================
# MAIN EXECUTION
# =====================================================

if __name__ == "__main__":
    import sys
    
    # Check if Excel file path is provided
    if len(sys.argv) > 1:
        excel_file = sys.argv[1]
    else:
        excel_file = EXCEL_FILE_PATH
    
    # Verify file exists
    if not os.path.exists(excel_file):
        print(f"❌ Error: Excel file not found: {excel_file}")
        print(f"\nUsage: python import_2021_survey.py <path_to_excel_file>")
        sys.exit(1)
    
    # Run import
    import_survey_data(excel_file)
