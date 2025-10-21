#!/usr/bin/env python3
"""
Comprehensive Survey Data Import from Excel Files

This script imports survey data from Excel files (2021-2024) into Supabase.
It handles:
- User creation (if users don't exist)
- Complex column mapping
- Array and JSONB field conversion
- Data validation and error handling

Requirements:
    pip install pandas openpyxl supabase python-dotenv

Setup:
    1. Create a .env file with:
       SUPABASE_URL=your_supabase_url
       SUPABASE_SERVICE_KEY=your_service_role_key
    2. Place Excel files in the same directory or specify paths
    3. Run: python excel_import_surveys.py

Author: Migration Helper
Date: 2024
"""

import pandas as pd
import json
import os
import sys
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import re
from supabase import create_client, Client
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

class SurveyImporter:
    def __init__(self):
        """Initialize Supabase client and setup"""
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        
        # Statistics
        self.stats = {
            'users_created': 0,
            'users_existing': 0,
            'surveys_imported': 0,
            'surveys_skipped': 0,
            'errors': []
        }
    
    def clean_email(self, email: Any) -> Optional[str]:
        """Clean and validate email address"""
        if pd.isna(email) or not email:
            return None
        
        email_str = str(email).strip().lower()
        
        # Basic email validation
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if re.match(pattern, email_str):
            return email_str
        return None
    
    def get_or_create_user(self, email: str, name: str = "", role_title: str = "") -> Optional[str]:
        """
        Get existing user or create new one
        Returns user_id (UUID) or None if failed
        """
        try:
            # Check if user exists
            response = self.supabase.auth.admin.list_users()
            existing_users = response if isinstance(response, list) else []
            
            for user in existing_users:
                if user.email and user.email.lower() == email.lower():
                    self.stats['users_existing'] += 1
                    return user.id
            
            # User doesn't exist, create new one
            # Split name into first and last
            name_parts = name.strip().split(' ', 1)
            first_name = name_parts[0] if name_parts else ''
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Create user with Supabase Admin API
            new_user = self.supabase.auth.admin.create_user({
                'email': email,
                'email_confirm': True,
                'user_metadata': {
                    'first_name': first_name,
                    'last_name': last_name,
                    'role_title': role_title
                }
            })
            
            if new_user and hasattr(new_user, 'user'):
                user_id = new_user.user.id
                self.stats['users_created'] += 1
                print(f"✓ Created user: {email}")
                
                # Create profile and role entries
                self._create_user_profile(user_id, email, first_name, last_name)
                self._create_user_role(user_id, email)
                
                return user_id
            
        except Exception as e:
            error_msg = f"Error creating user {email}: {str(e)}"
            print(f"✗ {error_msg}")
            self.stats['errors'].append(error_msg)
            return None
    
    def _create_user_profile(self, user_id: str, email: str, first_name: str, last_name: str):
        """Create profile entry for user"""
        try:
            self.supabase.table('profiles').insert({
                'id': user_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name
            }).execute()
        except Exception as e:
            print(f"  Warning: Could not create profile for {email}: {str(e)}")
    
    def _create_user_role(self, user_id: str, email: str, role: str = 'member'):
        """Create user role entry"""
        try:
            self.supabase.table('user_roles').insert({
                'user_id': user_id,
                'email': email,
                'role': role
            }).execute()
        except Exception as e:
            print(f"  Warning: Could not create role for {email}: {str(e)}")
    
    def convert_to_array(self, value: Any) -> List[str]:
        """Convert various formats to array"""
        if pd.isna(value) or not value:
            return []
        
        if isinstance(value, list):
            return [str(item).strip() for item in value if item]
        
        # Handle comma-separated values
        if isinstance(value, str):
            items = [item.strip() for item in value.split(',') if item.strip()]
            return items
        
        return [str(value).strip()]
    
    def convert_to_jsonb(self, value: Any) -> Dict:
        """Convert to JSONB format"""
        if pd.isna(value) or not value:
            return {}
        
        if isinstance(value, dict):
            return value
        
        if isinstance(value, str):
            try:
                return json.loads(value)
            except:
                return {}
        
        return {}
    
    def safe_int(self, value: Any) -> Optional[int]:
        """Safely convert to integer"""
        if pd.isna(value) or value == '':
            return None
        try:
            return int(float(value))
        except:
            return None
    
    def safe_float(self, value: Any) -> Optional[float]:
        """Safely convert to float"""
        if pd.isna(value) or value == '':
            return None
        try:
            return float(value)
        except:
            return None
    
    def import_2021_survey(self, file_path: str):
        """Import 2021 survey data"""
        print(f"\n{'='*80}")
        print(f"IMPORTING 2021 SURVEY: {file_path}")
        print(f"{'='*80}\n")
        
        try:
            df = pd.read_excel(file_path)
            print(f"Found {len(df)} rows")
            
            for idx, row in df.iterrows():
                try:
                    # Get email
                    email = self.clean_email(row.get('Email Address'))
                    if not email:
                        print(f"Row {idx+1}: Skipping - no valid email")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Get or create user
                    name = str(row.get('2. Name of participant', '')).strip()
                    role = str(row.get('3. Role / title of participant', '')).strip()
                    user_id = self.get_or_create_user(email, name, role)
                    
                    if not user_id:
                        print(f"Row {idx+1}: Skipping - could not create/find user for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Check if survey already exists
                    existing = self.supabase.table('survey_responses_2021')\
                        .select('id')\
                        .eq('user_id', user_id)\
                        .execute()
                    
                    if existing.data:
                        print(f"Row {idx+1}: Skipping - survey already exists for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Prepare survey data
                    survey_data = {
                        'user_id': user_id,
                        'email_address': email,
                        'firm_name': str(row.get('1. Name of firm', '')).strip(),
                        'participant_name': name,
                        'role_title': role,
                        'fund_stage': str(row.get('6. What is the stage of your current fund/vehicle\'s operations?', '')).strip(),
                        
                        # Add more fields based on your database schema
                        # This is a template - you'll need to map all 167 columns
                        
                        'created_at': datetime.now().isoformat(),
                        'updated_at': datetime.now().isoformat(),
                        'completed_at': datetime.now().isoformat()
                    }
                    
                    # Insert survey
                    self.supabase.table('survey_responses_2021').insert(survey_data).execute()
                    print(f"✓ Row {idx+1}: Imported survey for {email}")
                    self.stats['surveys_imported'] += 1
                    
                except Exception as e:
                    error_msg = f"Row {idx+1}: Error - {str(e)}"
                    print(f"✗ {error_msg}")
                    self.stats['errors'].append(error_msg)
                    continue
        
        except Exception as e:
            print(f"✗ Failed to import 2021 survey: {str(e)}")
            traceback.print_exc()
    
    def import_2022_survey(self, file_path: str):
        """Import 2022 survey data"""
        print(f"\n{'='*80}")
        print(f"IMPORTING 2022 SURVEY: {file_path}")
        print(f"{'='*80}\n")
        
        try:
            df = pd.read_excel(file_path)
            # Skip first row if it's headers
            if df.iloc[0]['Name'] == 'Open-Ended Response':
                df = df.iloc[1:].reset_index(drop=True)
            
            print(f"Found {len(df)} rows")
            
            for idx, row in df.iterrows():
                try:
                    email = self.clean_email(row.get('Email address'))
                    if not email:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    name = str(row.get('Name', '')).strip()
                    role = str(row.get('Role or title', '')).strip()
                    user_id = self.get_or_create_user(email, name, role)
                    
                    if not user_id:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Check existing
                    existing = self.supabase.table('survey_responses_2022')\
                        .select('id')\
                        .eq('user_id', user_id)\
                        .execute()
                    
                    if existing.data:
                        print(f"Row {idx+1}: Skipping - already exists for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    survey_data = {
                        'user_id': user_id,
                        'email': email,
                        'name': name,
                        'role_title': role,
                        'organisation': str(row.get('Name of organisation', '')).strip(),
                        
                        # Map more fields...
                        
                        'created_at': datetime.now().isoformat(),
                        'updated_at': datetime.now().isoformat(),
                        'completed_at': datetime.now().isoformat()
                    }
                    
                    self.supabase.table('survey_responses_2022').insert(survey_data).execute()
                    print(f"✓ Row {idx+1}: Imported survey for {email}")
                    self.stats['surveys_imported'] += 1
                    
                except Exception as e:
                    error_msg = f"Row {idx+1}: Error - {str(e)}"
                    print(f"✗ {error_msg}")
                    self.stats['errors'].append(error_msg)
        
        except Exception as e:
            print(f"✗ Failed to import 2022 survey: {str(e)}")
            traceback.print_exc()
    
    def import_2023_survey(self, file_path: str):
        """Import 2023 survey data"""
        print(f"\n{'='*80}")
        print(f"IMPORTING 2023 SURVEY: {file_path}")
        print(f"{'='*80}\n")
        
        try:
            df = pd.read_excel(file_path)
            if df.iloc[0]['Email address'] == 'Open-Ended Response':
                df = df.iloc[1:].reset_index(drop=True)
            
            print(f"Found {len(df)} rows")
            
            for idx, row in df.iterrows():
                try:
                    email = self.clean_email(row.get('Email address'))
                    if not email:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    user_id = self.get_or_create_user(email)
                    if not user_id:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    existing = self.supabase.table('survey_responses_2023')\
                        .select('id')\
                        .eq('user_id', user_id)\
                        .execute()
                    
                    if existing.data:
                        print(f"Row {idx+1}: Skipping - already exists for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    survey_data = {
                        'user_id': user_id,
                        'email_address': email,
                        'organisation_name': str(row.get('Name of organisation', '')).strip(),
                        'funds_raising_investing': str(row.get('How many funds are you currently raising and/or investing?', '')).strip(),
                        'fund_name': str(row.get('Name of Fund  to which this survey applies (that is Fund 1)', '')).strip(),
                        
                        # Map more fields...
                        
                        'created_at': datetime.now().isoformat(),
                        'updated_at': datetime.now().isoformat(),
                        'completed_at': datetime.now().isoformat()
                    }
                    
                    self.supabase.table('survey_responses_2023').insert(survey_data).execute()
                    print(f"✓ Row {idx+1}: Imported survey for {email}")
                    self.stats['surveys_imported'] += 1
                    
                except Exception as e:
                    error_msg = f"Row {idx+1}: Error - {str(e)}"
                    print(f"✗ {error_msg}")
                    self.stats['errors'].append(error_msg)
        
        except Exception as e:
            print(f"✗ Failed to import 2023 survey: {str(e)}")
            traceback.print_exc()
    
    def import_2024_survey(self, file_path: str):
        """Import 2024 survey data"""
        print(f"\n{'='*80}")
        print(f"IMPORTING 2024 SURVEY: {file_path}")
        print(f"{'='*80}\n")
        
        try:
            df = pd.read_excel(file_path)
            if 'Open-Ended Response' in str(df.iloc[0].values):
                df = df.iloc[1:].reset_index(drop=True)
            
            print(f"Found {len(df)} rows")
            
            for idx, row in df.iterrows():
                try:
                    email_col = 'Email address (note: all responses are anonymized. We have learned through the years that many respondents\' answers trigger interesting follow-on discussions, which we use to improve the survey and CFF\'s overall understanding of the small business finance marketplace)'
                    email = self.clean_email(row.get(email_col))
                    
                    if not email:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    user_id = self.get_or_create_user(email)
                    if not user_id:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    existing = self.supabase.table('survey_responses_2024')\
                        .select('id')\
                        .eq('user_id', user_id)\
                        .execute()
                    
                    if existing.data:
                        print(f"Row {idx+1}: Skipping - already exists for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    survey_data = {
                        'user_id': user_id,
                        'email_address': email,
                        'organisation_name': str(row.get('Name of your organization', '')).strip(),
                        'funds_raising_investing': str(row.get('How many funds are you currently raising and/or investing?', '')).strip(),
                        'fund_name': str(row.get('Name of Fund to which this survey applies (that is Fund 1)', '')).strip(),
                        
                        # Map more fields...
                        
                        'created_at': datetime.now().isoformat(),
                        'updated_at': datetime.now().isoformat(),
                        'completed_at': datetime.now().isoformat()
                    }
                    
                    self.supabase.table('survey_responses_2024').insert(survey_data).execute()
                    print(f"✓ Row {idx+1}: Imported survey for {email}")
                    self.stats['surveys_imported'] += 1
                    
                except Exception as e:
                    error_msg = f"Row {idx+1}: Error - {str(e)}"
                    print(f"✗ {error_msg}")
                    self.stats['errors'].append(error_msg)
        
        except Exception as e:
            print(f"✗ Failed to import 2024 survey: {str(e)}")
            traceback.print_exc()
    
    def print_summary(self):
        """Print import summary"""
        print(f"\n{'='*80}")
        print("IMPORT SUMMARY")
        print(f"{'='*80}")
        print(f"Users created:        {self.stats['users_created']}")
        print(f"Users existing:       {self.stats['users_existing']}")
        print(f"Surveys imported:     {self.stats['surveys_imported']}")
        print(f"Surveys skipped:      {self.stats['surveys_skipped']}")
        print(f"Errors:               {len(self.stats['errors'])}")
        
        if self.stats['errors']:
            print(f"\n{'='*80}")
            print("ERRORS (first 10):")
            print(f"{'='*80}")
            for error in self.stats['errors'][:10]:
                print(f"  - {error}")
            if len(self.stats['errors']) > 10:
                print(f"  ... and {len(self.stats['errors']) - 10} more")
        
        print(f"\n{'='*80}\n")


def main():
    """Main execution"""
    print("""
╔═══════════════════════════════════════════════════════════════════════════╗
║                   SURVEY DATA IMPORT TOOL                                 ║
║                   Excel to Supabase Migration                             ║
╚═══════════════════════════════════════════════════════════════════════════╝
    """)
    
    # File paths
    downloads_path = r"C:\Users\almul\Downloads"
    files = {
        '2021': os.path.join(downloads_path, 'CFF2021.xlsx'),
        '2022': os.path.join(downloads_path, 'CFF2022.xlsx'),
        '2023': os.path.join(downloads_path, 'CFF2023.xlsx'),
        '2024': os.path.join(downloads_path, 'CFF2024.xlsx')
    }
    
    # Check files exist
    for year, path in files.items():
        if not os.path.exists(path):
            print(f"✗ File not found: {path}")
            sys.exit(1)
        print(f"✓ Found {year} survey: {path}")
    
    print("\nInitializing importer...")
    importer = SurveyImporter()
    
    # Import each survey
    try:
        importer.import_2021_survey(files['2021'])
        importer.import_2022_survey(files['2022'])
        importer.import_2023_survey(files['2023'])
        importer.import_2024_survey(files['2024'])
    except KeyboardInterrupt:
        print("\n\n✗ Import cancelled by user")
    except Exception as e:
        print(f"\n\n✗ Fatal error: {str(e)}")
        traceback.print_exc()
    finally:
        importer.print_summary()


if __name__ == '__main__':
    main()
