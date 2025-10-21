#!/usr/bin/env python3
"""
Final Survey Data Import Script
Matches your exact database schema with form_data JSONB and separate multi-select tables
"""

import pandas as pd
import json
import os
import sys
from typing import Dict, List, Any, Optional
from datetime import datetime
import re
from supabase import create_client, Client
from dotenv import load_dotenv
import traceback

# Load environment variables
load_dotenv()

class SurveyImporter:
    def __init__(self):
        """Initialize Supabase client"""
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
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if re.match(pattern, email_str):
            return email_str
        return None
    
    def get_or_create_user(self, email: str, name: str = "", role_title: str = "") -> Optional[str]:
        """Get existing user or create new one"""
        try:
            # Check if user exists in profiles table
            response = self.supabase.table('profiles').select('id').eq('email', email).execute()
            
            if response.data and len(response.data) > 0:
                self.stats['users_existing'] += 1
                return response.data[0]['id']
            
            # User doesn't exist, create new one
            name_parts = name.strip().split(' ', 1) if name else ['', '']
            first_name = name_parts[0] if name_parts else ''
            last_name = name_parts[1] if len(name_parts) > 1 else ''
            
            # Create user with Supabase Admin API
            # Set a default password so users can log in
            default_password = os.getenv('DEFAULT_PASSWORD', '@ESCPNetwork2025#')
            new_user = self.supabase.auth.admin.create_user({
                'email': email,
                'password': default_password,
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
                
                # Create profile
                self.supabase.table('profiles').insert({
                    'id': user_id,
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'role_title': role_title
                }).execute()
                
                # Create user role
                self.supabase.table('user_roles').insert({
                    'user_id': user_id,
                    'email': email,
                    'role': 'member'
                }).execute()
                
                return user_id
            
        except Exception as e:
            error_msg = f"Error with user {email}: {str(e)}"
            print(f"✗ {error_msg}")
            self.stats['errors'].append(error_msg)
            return None
    
    def clean_value(self, value: Any) -> str:
        """Clean text value"""
        if pd.isna(value) or value is None or value == '':
            return ''
        return str(value).strip()
    
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
                    email = self.clean_email(row.get('Email Address'))
                    if not email:
                        print(f"Row {idx+1}: Skipping - no valid email")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    name = self.clean_value(row.get('2. Name of participant'))
                    role = self.clean_value(row.get('3. Role / title of participant'))
                    user_id = self.get_or_create_user(email, name, role)
                    
                    if not user_id:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Check if survey already exists
                    existing = self.supabase.table('survey_2021_responses')\
                        .select('id')\
                        .eq('user_id', user_id)\
                        .execute()
                    
                    if existing.data:
                        print(f"Row {idx+1}: Skipping - already exists for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Build form_data JSONB with all survey fields
                    form_data = {}
                    for col in df.columns:
                        if col not in ['Timestamp', 'Email Address']:
                            val = row.get(col)
                            if not pd.isna(val) and val != '':
                                form_data[col] = str(val)
                    
                    # Insert main survey response
                    survey_data = {
                        'user_id': user_id,
                        'email_address': email,
                        'firm_name': self.clean_value(row.get('1. Name of firm')),
                        'participant_name': name,
                        'role_title': role,
                        'fund_stage': self.clean_value(row.get('6. What is the stage of your current fund/vehicle\'s operations?')),
                        'form_data': json.dumps(form_data),
                        'submission_status': 'completed',
                        'completed_at': datetime.now().isoformat()
                    }
                    
                    result = self.supabase.table('survey_2021_responses').insert(survey_data).execute()
                    response_id = result.data[0]['id'] if result.data else None
                    
                    if response_id:
                        # Insert multi-select data into separate tables
                        self._insert_2021_multiselect(response_id, row)
                        print(f"✓ Row {idx+1}: Imported survey for {email}")
                        self.stats['surveys_imported'] += 1
                    
                except Exception as e:
                    error_msg = f"Row {idx+1}: {str(e)}"
                    print(f"✗ {error_msg}")
                    self.stats['errors'].append(error_msg)
        
        except Exception as e:
            print(f"✗ Failed to import 2021 survey: {str(e)}")
            traceback.print_exc()
    
    def _insert_2021_multiselect(self, response_id: str, row: pd.Series):
        """Insert 2021 multi-select responses into separate tables"""
        try:
            # Team based
            team_based = self.clean_value(row.get('4. Where is your team based?'))
            if team_based:
                for item in team_based.split(','):
                    item = item.strip()
                    if item:
                        self.supabase.table('survey_2021_team_based').insert({
                            'response_id': response_id,
                            'team_based': item
                        }).execute()
            
            # Geographic focus
            geo_focus = self.clean_value(row.get('5. What is the geographic focus of your fund/vehicle?'))
            if geo_focus:
                for item in geo_focus.split(','):
                    item = item.strip()
                    if item:
                        self.supabase.table('survey_2021_geographic_focus').insert({
                            'response_id': response_id,
                            'geographic_focus': item
                        }).execute()
            
            # Add more multi-select fields as needed...
            
        except Exception as e:
            print(f"  Warning: Could not insert multi-select data: {str(e)}")
    
    def import_2022_survey(self, file_path: str):
        """Import 2022 survey data"""
        print(f"\n{'='*80}")
        print(f"IMPORTING 2022 SURVEY: {file_path}")
        print(f"{'='*80}\n")
        
        try:
            df = pd.read_excel(file_path)
            # Skip header row if present
            if df.iloc[0]['Name'] == 'Open-Ended Response':
                df = df.iloc[1:].reset_index(drop=True)
            
            print(f"Found {len(df)} rows")
            
            for idx, row in df.iterrows():
                try:
                    email = self.clean_email(row.get('Email address'))
                    if not email:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    name = self.clean_value(row.get('Name'))
                    role = self.clean_value(row.get('Role or title'))
                    user_id = self.get_or_create_user(email, name, role)
                    
                    if not user_id:
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    existing = self.supabase.table('survey_2022_responses')\
                        .select('id')\
                        .eq('user_id', user_id)\
                        .execute()
                    
                    if existing.data:
                        print(f"Row {idx+1}: Skipping - already exists for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Build form_data
                    form_data = {}
                    for col in df.columns:
                        if col not in ['...1', 'Email address']:
                            val = row.get(col)
                            if not pd.isna(val) and val != '':
                                form_data[col] = str(val)
                    
                    survey_data = {
                        'user_id': user_id,
                        'email': email,
                        'name': name,
                        'role_title': role,
                        'organisation': self.clean_value(row.get('Name of organisation')),
                        'legal_entity_date': self.clean_value(row.get('Timeline. When did your current fund/investment vehicle achieve each of the following? (Please provide a date for each of three points in your fund\'s evolution)')),
                        'form_data': json.dumps(form_data),
                        'submission_status': 'completed',
                        'completed_at': datetime.now().isoformat()
                    }
                    
                    result = self.supabase.table('survey_2022_responses').insert(survey_data).execute()
                    response_id = result.data[0]['id'] if result.data else None
                    
                    if response_id:
                        self._insert_2022_multiselect(response_id, row)
                        print(f"✓ Row {idx+1}: Imported survey for {email}")
                        self.stats['surveys_imported'] += 1
                    
                except Exception as e:
                    error_msg = f"Row {idx+1}: {str(e)}"
                    print(f"✗ {error_msg}")
                    self.stats['errors'].append(error_msg)
        
        except Exception as e:
            print(f"✗ Failed to import 2022 survey: {str(e)}")
            traceback.print_exc()
    
    def _insert_2022_multiselect(self, response_id: str, row: pd.Series):
        """Insert 2022 multi-select responses"""
        try:
            # Team based
            team_based_col = 'Where is your Team based?  (select as many as applicable)'
            team_based = self.clean_value(row.get(team_based_col))
            if team_based:
                for item in team_based.split(','):
                    item = item.strip()
                    if item and item != 'NA':
                        self.supabase.table('survey_2022_team_based').insert({
                            'response_id': response_id,
                            'team_based': item
                        }).execute()
            
            # Geographic markets
            geo_col = 'In what geographic markets do you operate?  (select as many as applicable)'
            geo_markets = self.clean_value(row.get(geo_col))
            if geo_markets:
                for item in geo_markets.split(','):
                    item = item.strip()
                    if item and item != 'NA':
                        self.supabase.table('survey_2022_geographic_markets').insert({
                            'response_id': response_id,
                            'geographic_markets': item
                        }).execute()
            
        except Exception as e:
            print(f"  Warning: Could not insert 2022 multi-select data: {str(e)}")
    
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
                    
                    existing = self.supabase.table('survey_2023_responses')\
                        .select('id')\
                        .eq('user_id', user_id)\
                        .execute()
                    
                    if existing.data:
                        print(f"Row {idx+1}: Skipping - already exists for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Build form_data
                    form_data = {}
                    for col in df.columns:
                        if col not in ['...1', 'Email address']:
                            val = row.get(col)
                            if not pd.isna(val) and val != '':
                                form_data[col] = str(val)
                    
                    survey_data = {
                        'user_id': user_id,
                        'email_address': email,
                        'organisation_name': self.clean_value(row.get('Name of organisation')),
                        'funds_raising_investing': self.clean_value(row.get('How many funds are you currently raising and/or investing?')),
                        'fund_name': self.clean_value(row.get('Name of Fund  to which this survey applies (that is Fund 1)')),
                        'form_data': json.dumps(form_data),
                        'submission_status': 'completed',
                        'completed_at': datetime.now().isoformat()
                    }
                    
                    result = self.supabase.table('survey_2023_responses').insert(survey_data).execute()
                    response_id = result.data[0]['id'] if result.data else None
                    
                    if response_id:
                        self._insert_2023_multiselect(response_id, row)
                        print(f"✓ Row {idx+1}: Imported survey for {email}")
                        self.stats['surveys_imported'] += 1
                    
                except Exception as e:
                    error_msg = f"Row {idx+1}: {str(e)}"
                    print(f"✗ {error_msg}")
                    self.stats['errors'].append(error_msg)
        
        except Exception as e:
            print(f"✗ Failed to import 2023 survey: {str(e)}")
            traceback.print_exc()
    
    def _insert_2023_multiselect(self, response_id: str, row: pd.Series):
        """Insert 2023 multi-select responses"""
        try:
            # Team based
            team_col = 'Where is your Team based?  (select as many as applicable)'
            team_based = self.clean_value(row.get(team_col))
            if team_based:
                for item in team_based.split(','):
                    item = item.strip()
                    if item and item != 'NA':
                        self.supabase.table('survey_2023_team_based').insert({
                            'response_id': response_id,
                            'team_based': item
                        }).execute()
            
            # Geographic markets
            geo_col = 'In what geographic markets do you invest?  (select as many as applicable)'
            geo_markets = self.clean_value(row.get(geo_col))
            if geo_markets:
                for item in geo_markets.split(','):
                    item = item.strip()
                    if item and item != 'NA':
                        self.supabase.table('survey_2023_geographic_markets').insert({
                            'response_id': response_id,
                            'geographic_markets': item
                        }).execute()
            
        except Exception as e:
            print(f"  Warning: Could not insert 2023 multi-select data: {str(e)}")
    
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
                    
                    existing = self.supabase.table('survey_2024_responses')\
                        .select('id')\
                        .eq('user_id', user_id)\
                        .execute()
                    
                    if existing.data:
                        print(f"Row {idx+1}: Skipping - already exists for {email}")
                        self.stats['surveys_skipped'] += 1
                        continue
                    
                    # Build form_data
                    form_data = {}
                    for col in df.columns:
                        if col not in ['...1', email_col]:
                            val = row.get(col)
                            if not pd.isna(val) and val != '':
                                form_data[col] = str(val)
                    
                    survey_data = {
                        'user_id': user_id,
                        'email_address': email,
                        'organisation_name': self.clean_value(row.get('Name of your organization')),
                        'funds_raising_investing': self.clean_value(row.get('How many funds are you currently raising and/or investing?')),
                        'fund_name': self.clean_value(row.get('Name of Fund to which this survey applies (that is Fund 1)')),
                        'form_data': json.dumps(form_data),
                        'submission_status': 'completed',
                        'completed_at': datetime.now().isoformat()
                    }
                    
                    result = self.supabase.table('survey_2024_responses').insert(survey_data).execute()
                    response_id = result.data[0]['id'] if result.data else None
                    
                    if response_id:
                        self._insert_2024_multiselect(response_id, row)
                        print(f"✓ Row {idx+1}: Imported survey for {email}")
                        self.stats['surveys_imported'] += 1
                    
                except Exception as e:
                    error_msg = f"Row {idx+1}: {str(e)}"
                    print(f"✗ {error_msg}")
                    self.stats['errors'].append(error_msg)
        
        except Exception as e:
            print(f"✗ Failed to import 2024 survey: {str(e)}")
            traceback.print_exc()
    
    def _insert_2024_multiselect(self, response_id: str, row: pd.Series):
        """Insert 2024 multi-select responses"""
        try:
            # Team based
            team_col = 'Where is your Team based? (Please select as many as apply)'
            team_based = self.clean_value(row.get(team_col))
            if team_based:
                for item in team_based.split(','):
                    item = item.strip()
                    if item and item != 'NA':
                        self.supabase.table('survey_2024_team_based').insert({
                            'response_id': response_id,
                            'team_based': item
                        }).execute()
            
            # Geographic markets
            geo_col = 'In what geographic markets do you invest? (Please select as many as apply)'
            geo_markets = self.clean_value(row.get(geo_col))
            if geo_markets:
                for item in geo_markets.split(','):
                    item = item.strip()
                    if item and item != 'NA':
                        self.supabase.table('survey_2024_geographic_markets').insert({
                            'response_id': response_id,
                            'geographic_markets': item
                        }).execute()
            
            # Investment networks
            networks_col = 'Please check all investment networks or associations that you are a part of. If they are not listed, please include them in the textbox.'
            networks = self.clean_value(row.get(networks_col))
            if networks:
                for item in networks.split(','):
                    item = item.strip()
                    if item and item != 'NA':
                        self.supabase.table('survey_2024_investment_networks').insert({
                            'response_id': response_id,
                            'investment_networks': item
                        }).execute()
            
        except Exception as e:
            print(f"  Warning: Could not insert 2024 multi-select data: {str(e)}")
    
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
    files = {
        '2021': r"C:\Users\almul\Downloads\CFF2021.xlsx",
        '2022': r"C:\Users\almul\Downloads\CFF2022.xlsx",
        '2023': r"C:\Users\almul\Downloads\CFF2023.xlsx",
        '2024': r"C:\Users\almul\Downloads\CFF2024.xlsx"
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
