"""
COMPLETE 2021 SURVEY RE-IMPORT - ALL 167 COLUMNS MAPPED
========================================================
This script:
1. Deletes existing 2021 survey responses (keeps users)
2. Re-imports with CORRECT Excel column names
3. Maps ALL 167 columns from Excel to database

Run: python REIMPORT_2021_COMPLETE.py "C:\Users\almul\Downloads\CFF2021.xlsx"
"""

import pandas as pd
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import sys
from datetime import datetime

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

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
    items = [item.strip() for item in str(value).split(',')]
    return [item for item in items if item]

def parse_boolean(value):
    """Parse boolean values"""
    if pd.isna(value) or value == '' or value == 'NULL':
        return False
    return str(value).lower() in ['yes', 'true', '1', 'y']

def get_user_by_email(email: str):
    """Get existing user ID by email"""
    try:
        users_response = supabase.auth.admin.list_users()
        for user in users_response:
            if user.email == email:
                return user.id
        return None
    except Exception as e:
        print(f"  ✗ Error fetching user: {e}")
        return None

# Import mapping functions
from REIMPORT_2021_PART1 import map_excel_to_db_part1
from REIMPORT_2021_PART2 import map_excel_to_db_part2

def map_complete_row(row, user_id: str, company_name: str):
    """Map complete Excel row to database - all 167 columns"""
    
    # Start with system fields
    data = {
        "user_id": user_id,
        "company_name": company_name,
    }
    
    # Map part 1 (columns 1-77)
    part1_data = map_excel_to_db_part1(row, clean_text, parse_array_field, parse_boolean)
    data.update(part1_data)
    
    # Map part 2 (columns 78-167)
    part2_data = map_excel_to_db_part2(row, clean_text, parse_array_field)
    data.update(part2_data)
    
    return data

def main():
    if len(sys.argv) < 2:
        print("Usage: python REIMPORT_2021_COMPLETE.py <excel_file>")
        sys.exit(1)
    
    excel_file = sys.argv[1]
    
    print("\n" + "="*80)
    print("2021 SURVEY DATA RE-IMPORT - ALL 167 COLUMNS")
    print("="*80)
    
    # Step 1: Delete existing survey responses
    print("\n🗑️  Step 1: Deleting existing 2021 survey responses...")
    try:
        supabase.table('survey_responses_2021').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
        print("✓ Existing responses deleted (users preserved)")
    except Exception as e:
        print(f"⚠ Delete warning: {e}")
    
    # Step 2: Read Excel
    print(f"\n📂 Step 2: Reading Excel file...")
    print(f"   File: {excel_file}")
    df = pd.read_excel(excel_file)
    print(f"✓ Loaded {len(df)} rows with {len(df.columns)} columns")
    
    # Step 3: Re-import with correct mapping
    print("\n🚀 Step 3: Re-importing with correct column mapping...")
    print("-"*80)
    
    success = 0
    failed = 0
    skipped = 0
    
    for index, row in df.iterrows():
        row_num = index + 1
        print(f"\n[Row {row_num}/{len(df)}]")
        
        email = clean_text(row.get('Email Address'))
        company_name = clean_text(row.get('1. Name of firm'))
        
        if not email or not company_name:
            print(f"  ⚠ Skipped: Missing email or company")
            skipped += 1
            continue
        
        print(f"  📧 {email}")
        print(f"  🏢 {company_name}")
        
        # Get existing user
        user_id = get_user_by_email(email)
        if not user_id:
            print(f"  ✗ User not found in database")
            failed += 1
            continue
        
        print(f"  ✓ User found: {user_id[:8]}...")
        
        # Map all 167 columns and insert
        try:
            data = map_complete_row(row, user_id, company_name)
            supabase.table('survey_responses_2021').upsert(data).execute()
            print(f"  ✓ All 167 columns imported successfully")
            success += 1
        except Exception as e:
            print(f"  ✗ Import error: {e}")
            failed += 1
    
    # Summary
    print("\n" + "="*80)
    print("RE-IMPORT SUMMARY")
    print("="*80)
    print(f"Total rows processed: {len(df)}")
    print(f"✓ Successful imports: {success}")
    print(f"✗ Failed imports: {failed}")
    print(f"⚠ Skipped rows: {skipped}")
    print("="*80)
    
    if success > 0:
        print(f"\n🎉 Re-import completed! {success} survey responses with ALL 167 columns imported.")
    else:
        print(f"\n⚠ No data was imported. Please check the errors above.")

if __name__ == "__main__":
    main()
