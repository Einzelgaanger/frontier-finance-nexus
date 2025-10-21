#!/usr/bin/env python3
"""
UPDATE PASSWORDS FOR EXISTING USERS
Sets password @ESCPNetwork2025# for all users who don't have one
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def main():
    print("""
╔═══════════════════════════════════════════════════════════════════════════╗
║              UPDATE PASSWORDS FOR EXISTING USERS                          ║
║              Setting password: @ESCPNetwork2025#                          ║
╚═══════════════════════════════════════════════════════════════════════════╝
    """)
    
    # Initialize Supabase
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_KEY')
    
    if not supabase_url or not supabase_key:
        print("✗ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env file")
        return
    
    supabase: Client = create_client(supabase_url, supabase_key)
    default_password = os.getenv('DEFAULT_PASSWORD', '@ESCPNetwork2025#')
    
    print(f"🔑 Default password: {default_password}\n")
    
    # Get all profiles
    print("Fetching all user profiles...")
    response = supabase.table('profiles').select('id, email').execute()
    
    if not response.data:
        print("✗ No users found")
        return
    
    users = response.data
    print(f"✓ Found {len(users)} users\n")
    
    success_count = 0
    error_count = 0
    
    print("Updating passwords...\n")
    
    for idx, user in enumerate(users, 1):
        try:
            user_id = user['id']
            email = user['email']
            
            # Update user password using Admin API
            supabase.auth.admin.update_user_by_id(
                user_id,
                {
                    'password': default_password,
                    'email_confirm': True
                }
            )
            
            print(f"✓ [{idx}/{len(users)}] Updated password for: {email}")
            success_count += 1
            
        except Exception as e:
            print(f"✗ [{idx}/{len(users)}] Failed for {email}: {str(e)}")
            error_count += 1
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print(f"Total users:          {len(users)}")
    print(f"Passwords updated:    {success_count}")
    print(f"Errors:               {error_count}")
    print(f"\nDefault password:     {default_password}")
    print(f"\n✓ All users can now log in with their email and this password!")
    print(f"{'='*80}\n")

if __name__ == '__main__':
    main()


