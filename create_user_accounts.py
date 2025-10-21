"""
Create User Accounts from Survey Data
======================================
This script extracts unique email addresses from all survey Excel files
and creates authenticated user accounts in Supabase with a default password.

Author: Data Migration Script
Date: 2025-01-18
"""

import os
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client, Client
import re
from typing import Set, List, Dict
import time

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')  # Need service role key for admin operations

# Default password for all accounts
DEFAULT_PASSWORD = "@ESCPNetwork2025#"

# Excel files to process with their email column names
EXCEL_FILES = [
    {
        'path': 'CFF2021.xlsx',
        'email_columns': ['Email Address']
    },
    {
        'path': 'CFF2022.xlsx',
        'email_columns': ['Email address']
    },
    {
        'path': 'CFF2023.xlsx',
        'email_columns': ['Email address']
    },
    {
        'path': 'CFF2024.xlsx',
        'email_columns': ['Email address (note: all responses are anonymized. We have learned through the years that many respondents\' answers trigger interesting follow-on discussions, which we use to improve the survey and CFF\'s overall understanding of the small business finance marketplace)']
    }
]

def validate_email(email: str) -> bool:
    """Validate email format."""
    if not email or pd.isna(email):
        return False
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(email_pattern, str(email).strip()))

def extract_emails_from_excel(file_path: str, email_columns: List[str]) -> Set[str]:
    """Extract all email addresses from an Excel file using specified column names."""
    print(f"\n📄 Processing: {os.path.basename(file_path)}")
    
    emails = set()
    
    try:
        # Read the Excel file
        df = pd.read_excel(file_path, sheet_name=0)
        
        # Find the actual column names in the file that match our expected columns
        available_columns = df.columns.tolist()
        found_columns = []
        
        # Try to find the best match for each expected email column
        for expected_col in email_columns:
            # First try exact match
            if expected_col in available_columns:
                found_columns.append(expected_col)
            else:
                # Try case-insensitive match
                for col in available_columns:
                    if col.lower() == expected_col.lower():
                        found_columns.append(col)
                        break
                else:
                    # Try partial match (in case of long descriptions)
                    for col in available_columns:
                        if expected_col.lower() in col.lower() or 'email' in col.lower():
                            found_columns.append(col)
                            break
        
        if not found_columns:
            print(f"   ⚠️  No matching email columns found in {os.path.basename(file_path)}. Available columns: {available_columns}")
            return emails
        
        print(f"   Using email column(s): {found_columns}")
        
        # Extract emails from all found email columns
        for col in found_columns:
            if col not in df.columns:
                print(f"   ⚠️  Column '{col}' not found in the Excel file")
                continue
                
            for value in df[col].dropna():
                email = str(value).strip().lower()
                if validate_email(email):
                    emails.add(email)
        
        print(f"   ✅ Extracted {len(emails)} valid email(s)")
        
    except Exception as e:
        print(f"   ❌ Error processing file: {str(e)}")
    
    return emails

def get_all_unique_emails(base_dir: str) -> List[str]:
    """Get all unique emails from all Excel files."""
    print("\n" + "="*70)
    print("EXTRACTING UNIQUE EMAILS FROM SURVEY FILES")
    print("="*70)
    
    all_emails = set()
    
    for file_info in EXCEL_FILES:
        file_path = os.path.join(base_dir, file_info['path'])
        
        if not os.path.exists(file_path):
            # Try to find the file with a case-insensitive match
            found = False
            for f in os.listdir(base_dir):
                if f.lower() == file_info['path'].lower():
                    file_path = os.path.join(base_dir, f)
                    found = True
                    break
            
            if not found:
                print(f"\n⚠️  File not found: {file_info['path']}")
                continue
        
        file_emails = extract_emails_from_excel(file_path, file_info['email_columns'])
        all_emails.update(file_emails)
    
    unique_emails = sorted(list(all_emails))
    
    print("\n" + "="*70)
    print(f"📊 SUMMARY: Found {len(unique_emails)} unique email addresses")
    print("="*70)
    
    return unique_emails

def create_user_account(supabase: Client, email: str, password: str) -> Dict:
    """Create a user account in Supabase Auth."""
    try:
        # Create user with Supabase Admin API
        response = supabase.auth.admin.create_user({
            "email": email,
            "password": password,
            "email_confirm": True  # Auto-confirm email
        })
        
        return {
            "email": email,
            "success": True,
            "user_id": response.user.id if response.user else None,
            "error": None
        }
        
    except Exception as e:
        error_msg = str(e)
        
        # Check if user already exists
        if "already registered" in error_msg.lower() or "duplicate" in error_msg.lower():
            return {
                "email": email,
                "success": False,
                "user_id": None,
                "error": "User already exists"
            }
        
        return {
            "email": email,
            "success": False,
            "user_id": None,
            "error": error_msg
        }

def create_all_accounts(emails: List[str]) -> Dict:
    """Create accounts for all unique emails."""
    print("\n" + "="*70)
    print("CREATING USER ACCOUNTS IN SUPABASE")
    print("="*70)
    
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("\n❌ ERROR: Supabase credentials not found in .env file")
        print("   Required variables:")
        print("   - VITE_SUPABASE_URL")
        print("   - SUPABASE_SERVICE_ROLE_KEY")
        return {"created": 0, "skipped": 0, "failed": 0}
    
    # Initialize Supabase client with service role key
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    results = {
        "created": 0,
        "skipped": 0,
        "failed": 0,
        "details": []
    }
    
    total = len(emails)
    
    for idx, email in enumerate(emails, 1):
        print(f"\n[{idx}/{total}] Creating account for: {email}")
        
        result = create_user_account(supabase, email, DEFAULT_PASSWORD)
        results["details"].append(result)
        
        if result["success"]:
            print(f"   ✅ Account created successfully (User ID: {result['user_id']})")
            results["created"] += 1
        elif result["error"] == "User already exists":
            print(f"   ⏭️  Account already exists, skipping...")
            results["skipped"] += 1
        else:
            print(f"   ❌ Failed: {result['error']}")
            results["failed"] += 1
        
        # Rate limiting: pause briefly between requests
        if idx < total:
            time.sleep(0.5)
    
    return results

def save_results_to_file(emails: List[str], results: Dict):
    """Save the results to a text file."""
    output_file = "user_accounts_created.txt"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("="*70 + "\n")
        f.write("USER ACCOUNTS CREATION REPORT\n")
        f.write("="*70 + "\n\n")
        
        f.write(f"Total Unique Emails: {len(emails)}\n")
        f.write(f"Accounts Created: {results['created']}\n")
        f.write(f"Already Existed (Skipped): {results['skipped']}\n")
        f.write(f"Failed: {results['failed']}\n")
        f.write(f"Default Password: {DEFAULT_PASSWORD}\n\n")
        
        f.write("="*70 + "\n")
        f.write("DETAILED RESULTS\n")
        f.write("="*70 + "\n\n")
        
        for detail in results['details']:
            status = "✅ CREATED" if detail['success'] else "❌ FAILED" if detail['error'] != "User already exists" else "⏭️  SKIPPED"
            f.write(f"{status} | {detail['email']}\n")
            if detail['user_id']:
                f.write(f"         User ID: {detail['user_id']}\n")
            if detail['error'] and detail['error'] != "User already exists":
                f.write(f"         Error: {detail['error']}\n")
            f.write("\n")
    
    print(f"\n📄 Results saved to: {output_file}")

def main():
    """Main execution function."""
    print("\n" + "="*70)
    print("ESCP NETWORK - USER ACCOUNT CREATION SCRIPT")
    print("="*70)
    print(f"\nDefault Password: {DEFAULT_PASSWORD}")
    print("This password will be set for all newly created accounts.")
    
    # Set the directory containing the Excel files to the Downloads folder
    base_dir = os.path.join(os.path.expanduser('~'), 'Downloads')
    
    print(f"\nLooking for Excel files in: {base_dir}")
    
    # List all Excel files in the directory
    try:
        all_excel_files = [f for f in os.listdir(base_dir) if f.lower().endswith(('.xlsx', '.xls'))]
        print(f"Found Excel files: {all_excel_files}")
        
        # Check if any of our target files exist (case-insensitive)
        target_files = [info['path'].lower() for info in EXCEL_FILES]
        found_files = [f for f in all_excel_files if any(t.lower() in f.lower() for t in target_files)]
        
        if not found_files:
            print("\n❌ No matching Excel files found. Please ensure the files are in your Downloads folder.")
            print("Expected files (case insensitive):")
            for info in EXCEL_FILES:
                print(f"- {info['path']}")
            return
            
        print(f"\n✅ Found matching files: {found_files}")
        
    except Exception as e:
        print(f"\n❌ Error accessing directory {base_dir}: {str(e)}")
        return
    
    # Step 1: Extract all unique emails
    unique_emails = get_all_unique_emails(base_dir)
    
    if not unique_emails:
        print("\n❌ No valid emails found. Exiting.")
        return
    
    # Display sample of emails
    print("\n📋 Sample of emails to process:")
    for email in unique_emails[:10]:
        print(f"   • {email}")
    if len(unique_emails) > 10:
        print(f"   ... and {len(unique_emails) - 10} more")
    
    # Confirmation prompt
    print("\n" + "="*70)
    response = input(f"\n⚠️  Proceed with creating {len(unique_emails)} user accounts? (yes/no): ")
    
    if response.lower() not in ['yes', 'y']:
        print("\n❌ Operation cancelled by user.")
        return
    
    # Step 2: Create accounts
    results = create_all_accounts(unique_emails)
    
    # Step 3: Save results
    save_results_to_file(unique_emails, results)
    
    # Final summary
    print("\n" + "="*70)
    print("FINAL SUMMARY")
    print("="*70)
    print(f"✅ Accounts Created: {results['created']}")
    print(f"⏭️  Already Existed: {results['skipped']}")
    print(f"❌ Failed: {results['failed']}")
    print(f"📊 Total Processed: {len(unique_emails)}")
    print("="*70)
    
    if results['created'] > 0:
        print(f"\n🎉 Successfully created {results['created']} new user account(s)!")
        print(f"🔑 Default password for all accounts: {DEFAULT_PASSWORD}")
        print("\n💡 Users can log in with their email and this password.")
        print("   Recommend asking users to change their password after first login.")

if __name__ == "__main__":
    main()
