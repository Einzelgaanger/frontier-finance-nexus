#!/usr/bin/env python3
"""
Survey Data Upload Script
Uploads survey data to Supabase for all users
"""

import json
import pandas as pd
from supabase import create_client, Client
import os
from typing import Dict, List, Any

# Supabase configuration
SUPABASE_URL = "your-supabase-url"
SUPABASE_KEY = "your-supabase-anon-key"

def create_supabase_client() -> Client:
    """Create Supabase client"""
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_user_id_by_email(supabase: Client, email: str) -> str:
    """Get user ID by email"""
    try:
        result = supabase.auth.admin.list_users()
        for user in result:
            if user.email == email:
                return user.id
        return None
    except Exception as e:
        print(f"Error getting user ID for {email}: {e}")
        return None

def upload_survey_data(supabase: Client, survey_data: List[Dict], survey_year: str):
    """Upload survey data to the appropriate table"""
    table_name = f"survey_{survey_year}_responses"
    
    for data in survey_data:
        try:
            # Get user ID
            user_id = get_user_id_by_email(supabase, data['email'])
            if not user_id:
                print(f"User not found: {data['email']}")
                continue
            
            # Prepare the data for insertion
            insert_data = {
                'user_id': user_id,
                'form_data': data.get('form_data', {}),
                'submission_status': 'completed',
                'completed_at': 'now()'
            }
            
            # Add year-specific fields
            if survey_year == '2024':
                insert_data.update({
                    'email_address': data['email'],
                    'organisation_name': data.get('organisation_name', ''),
                    'funds_raising_investing': data.get('funds_raising_investing', ''),
                    'fund_name': data.get('fund_name', '')
                })
            elif survey_year == '2023':
                insert_data.update({
                    'email_address': data['email'],
                    'organisation_name': data.get('organisation_name', ''),
                    'fund_name': data.get('fund_name', ''),
                    'funds_raising_investing': data.get('funds_raising_investing', '')
                })
            elif survey_year == '2022':
                insert_data.update({
                    'email': data['email'],
                    'name': data.get('name', ''),
                    'role_title': data.get('role_title', ''),
                    'organisation': data.get('organisation', ''),
                    'legal_entity_date': data.get('legal_entity_date', '')
                })
            elif survey_year == '2021':
                insert_data.update({
                    'email_address': data['email'],
                    'firm_name': data.get('firm_name', ''),
                    'participant_name': data.get('participant_name', ''),
                    'role_title': data.get('role_title', ''),
                    'fund_stage': data.get('fund_stage', '')
                })
            
            # Insert or update the data
            result = supabase.table(table_name).upsert(insert_data).execute()
            print(f"✅ Uploaded survey data for {data['email']}")
            
        except Exception as e:
            print(f"❌ Error uploading data for {data['email']}: {e}")

def load_survey_data_from_csv(csv_file: str) -> List[Dict]:
    """Load survey data from CSV file"""
    try:
        df = pd.read_csv(csv_file)
        return df.to_dict('records')
    except Exception as e:
        print(f"Error loading CSV file {csv_file}: {e}")
        return []

def main():
    """Main function to upload survey data"""
    supabase = create_supabase_client()
    
    # Example: Upload 2024 survey data
    survey_2024_data = [
        {
            'email': 'sam@mirepaadvisors.com',
            'organisation_name': 'MIREPA Investment Advisors',
            'funds_raising_investing': 'Fund Manager',
            'fund_name': 'MIREPA Investment Fund',
            'form_data': {
                'participant_name': 'Sam Mirepa',
                'role_title': 'Managing Partner',
                'geographic_focus': ['East Africa', 'West Africa'],
                'investment_vehicle_type': 'Private Equity Fund',
                'fund_stage': 'Active',
                'current_ftes': 8,
                'thesis': 'Focus on growth-stage companies in East and West Africa',
                'ticket_size_min': '$500K',
                'ticket_size_max': '$2M',
                'target_capital': '$50M',
                'sector_focus': ['Technology', 'Healthcare', 'Financial Services'],
                'legal_domicile': 'Mauritius',
                'year_founded': 2020
            }
        },
        # Add more survey data here...
    ]
    
    # Upload 2024 data
    print("Uploading 2024 survey data...")
    upload_survey_data(supabase, survey_2024_data, '2024')
    
    # You can also load from CSV files
    # survey_2023_data = load_survey_data_from_csv('survey_2023_data.csv')
    # upload_survey_data(supabase, survey_2023_data, '2023')
    
    print("✅ Survey data upload completed!")

if __name__ == "__main__":
    main()
