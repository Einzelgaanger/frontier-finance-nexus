#!/usr/bin/env python3
"""
Survey Data Migration Helper Script

This script helps prepare CSV/Excel data for import into Supabase.
It handles:
- Data validation
- Format conversion (arrays, JSONB)
- User email matching
- CSV generation for staging tables

Usage:
    python migration_helper.py --input survey_data.xlsx --output cleaned_data.csv --year 2024
"""

import pandas as pd
import json
import argparse
import sys
from typing import Dict, List, Any
import re

class SurveyMigrationHelper:
    def __init__(self, year: str):
        self.year = year
        self.errors = []
        self.warnings = []
        
    def validate_email(self, email: str) -> bool:
        """Validate email format"""
        if pd.isna(email) or not email:
            return False
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, str(email).strip()))
    
    def clean_text(self, text: Any) -> str:
        """Clean text fields"""
        if pd.isna(text):
            return ''
        return str(text).strip()
    
    def convert_to_array(self, value: Any, delimiter: str = ',') -> str:
        """Convert comma-separated values to PostgreSQL array format"""
        if pd.isna(value) or not value:
            return ''
        
        # If already a list
        if isinstance(value, list):
            items = [str(item).strip() for item in value if item]
        else:
            # Split by delimiter
            items = [item.strip() for item in str(value).split(delimiter) if item.strip()]
        
        # Return comma-separated (will be converted to array in SQL)
        return ','.join(items)
    
    def convert_to_jsonb(self, value: Any) -> str:
        """Convert to JSONB format"""
        if pd.isna(value) or not value:
            return '{}'
        
        # If already a dict
        if isinstance(value, dict):
            return json.dumps(value)
        
        # If string that looks like JSON
        if isinstance(value, str):
            try:
                # Try to parse as JSON
                parsed = json.loads(value)
                return json.dumps(parsed)
            except json.JSONDecodeError:
                self.warnings.append(f"Could not parse JSON: {value[:50]}...")
                return '{}'
        
        return '{}'
    
    def convert_to_integer(self, value: Any) -> str:
        """Convert to integer, return empty string if invalid"""
        if pd.isna(value) or value == '':
            return ''
        try:
            return str(int(float(value)))
        except (ValueError, TypeError):
            self.warnings.append(f"Could not convert to integer: {value}")
            return ''
    
    def convert_to_decimal(self, value: Any) -> str:
        """Convert to decimal, return empty string if invalid"""
        if pd.isna(value) or value == '':
            return ''
        try:
            return str(float(value))
        except (ValueError, TypeError):
            self.warnings.append(f"Could not convert to decimal: {value}")
            return ''
    
    def process_2024_survey(self, df: pd.DataFrame) -> pd.DataFrame:
        """Process 2024 survey data"""
        print(f"Processing {len(df)} rows for 2024 survey...")
        
        # Create output dataframe
        output = pd.DataFrame()
        
        # Map columns (adjust these based on your actual CSV columns)
        column_mapping = {
            'Email Address': 'email_address',
            'Email': 'email_address',
            'Organisation Name': 'organisation_name',
            'Organization Name': 'organisation_name',
            'Fund Name': 'fund_name',
            'Funds Raising/Investing': 'funds_raising_investing',
            # Add more mappings based on your CSV structure
        }
        
        # Required fields
        required_fields = ['email_address', 'organisation_name', 'fund_name']
        
        # Process each row
        for idx, row in df.iterrows():
            # Validate email
            email_col = None
            for col in ['Email Address', 'Email', 'email_address', 'email']:
                if col in df.columns:
                    email_col = col
                    break
            
            if not email_col:
                self.errors.append(f"Row {idx}: No email column found")
                continue
            
            email = row[email_col]
            if not self.validate_email(email):
                self.errors.append(f"Row {idx}: Invalid email: {email}")
                continue
            
            output.at[idx, 'email_address'] = self.clean_text(email)
            
            # Process other fields based on your CSV structure
            # This is a template - customize based on your actual columns
            
            # Text fields
            for csv_col, db_col in column_mapping.items():
                if csv_col in df.columns:
                    output.at[idx, db_col] = self.clean_text(row[csv_col])
            
            # Array fields (example)
            array_fields = [
                'investment_networks', 'geographic_markets', 'team_based',
                'investment_approval', 'gender_inclusion'
            ]
            for field in array_fields:
                if field in df.columns or any(field.replace('_', ' ').title() in col for col in df.columns):
                    # Find the matching column
                    matching_col = None
                    for col in df.columns:
                        if field in col.lower().replace(' ', '_'):
                            matching_col = col
                            break
                    
                    if matching_col:
                        output.at[idx, field] = self.convert_to_array(row[matching_col])
            
            # Integer fields
            integer_fields = [
                'fte_staff_2023_actual', 'fte_staff_current', 'fte_staff_2025_forecast',
                'principals_total', 'principals_women'
            ]
            for field in integer_fields:
                if field in df.columns:
                    output.at[idx, field] = self.convert_to_integer(row[field])
            
            # JSONB fields
            jsonb_fields = ['team_experience_investments', 'team_experience_exits']
            for field in jsonb_fields:
                if field in df.columns:
                    output.at[idx, field] = self.convert_to_jsonb(row[field])
        
        return output
    
    def process_file(self, input_file: str, output_file: str):
        """Process input file and generate cleaned CSV"""
        print(f"Reading input file: {input_file}")
        
        # Read file (supports CSV, Excel)
        if input_file.endswith('.csv'):
            df = pd.read_csv(input_file)
        elif input_file.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(input_file)
        else:
            raise ValueError("Unsupported file format. Use CSV or Excel.")
        
        print(f"Found {len(df)} rows and {len(df.columns)} columns")
        print(f"Columns: {', '.join(df.columns)}")
        
        # Process based on year
        if self.year == '2024':
            output_df = self.process_2024_survey(df)
        elif self.year == '2023':
            # Add 2023 processing logic
            print("2023 survey processing not yet implemented")
            return
        elif self.year == '2022':
            # Add 2022 processing logic
            print("2022 survey processing not yet implemented")
            return
        elif self.year == '2021':
            # Add 2021 processing logic
            print("2021 survey processing not yet implemented")
            return
        else:
            raise ValueError(f"Unsupported year: {self.year}")
        
        # Save output
        output_df.to_csv(output_file, index=False)
        print(f"\nOutput saved to: {output_file}")
        
        # Print summary
        print(f"\n{'='*60}")
        print("MIGRATION SUMMARY")
        print(f"{'='*60}")
        print(f"Total rows processed: {len(df)}")
        print(f"Successful conversions: {len(output_df)}")
        print(f"Errors: {len(self.errors)}")
        print(f"Warnings: {len(self.warnings)}")
        
        if self.errors:
            print(f"\n{'='*60}")
            print("ERRORS:")
            for error in self.errors[:10]:  # Show first 10
                print(f"  - {error}")
            if len(self.errors) > 10:
                print(f"  ... and {len(self.errors) - 10} more")
        
        if self.warnings:
            print(f"\n{'='*60}")
            print("WARNINGS:")
            for warning in self.warnings[:10]:  # Show first 10
                print(f"  - {warning}")
            if len(self.warnings) > 10:
                print(f"  ... and {len(self.warnings) - 10} more")
        
        print(f"\n{'='*60}")
        print("NEXT STEPS:")
        print("1. Review the output CSV file")
        print("2. Import into staging table using Supabase Dashboard or psql")
        print("3. Run migration_2_import_template.sql to import into production tables")
        print(f"{'='*60}\n")

def main():
    parser = argparse.ArgumentParser(description='Survey Data Migration Helper')
    parser.add_argument('--input', '-i', required=True, help='Input file (CSV or Excel)')
    parser.add_argument('--output', '-o', required=True, help='Output CSV file')
    parser.add_argument('--year', '-y', required=True, choices=['2021', '2022', '2023', '2024'],
                       help='Survey year')
    
    args = parser.parse_args()
    
    helper = SurveyMigrationHelper(args.year)
    
    try:
        helper.process_file(args.input, args.output)
    except Exception as e:
        print(f"\nERROR: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
