# User Account Creation Script

This script automatically creates authenticated user accounts in Supabase for all unique email addresses found in the survey Excel files.

## Overview

The script:
1. Extracts email addresses from all 4 survey Excel files (2021-2024)
2. Identifies unique emails (ignoring duplicates across years)
3. Creates authenticated user accounts in Supabase Auth
4. Sets a default password for all accounts: `@ESCPNetwork2025#`
5. Generates a detailed report of the operation

## Prerequisites

### 1. Install Required Packages

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

You need the **Service Role Key** (not the anon key) to create users programmatically.

Add to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**⚠️ IMPORTANT:** The Service Role Key has admin privileges. Keep it secure and never commit it to version control.

#### Where to find your Service Role Key:

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API**
3. Under **Project API keys**, copy the **service_role** key (not the anon key)

## Usage

### Run the Script

```bash
python create_user_accounts.py
```

### What Happens:

1. **Email Extraction Phase:**
   - Scans all 4 Excel files
   - Identifies columns containing "email"
   - Validates email format
   - Removes duplicates

2. **Confirmation Prompt:**
   - Shows total unique emails found
   - Displays a sample of emails
   - Asks for confirmation before proceeding

3. **Account Creation Phase:**
   - Creates user accounts in Supabase Auth
   - Sets password to: `@ESCPNetwork2025#`
   - Auto-confirms email addresses
   - Skips emails that already have accounts
   - Shows progress for each email

4. **Report Generation:**
   - Creates `user_accounts_created.txt` with detailed results
   - Shows summary statistics

## Output

### Console Output Example:

```
======================================================================
ESCP NETWORK - USER ACCOUNT CREATION SCRIPT
======================================================================

Default Password: @ESCPNetwork2025#

======================================================================
EXTRACTING UNIQUE EMAILS FROM SURVEY FILES
======================================================================

📄 Processing: ESCP Impact Investors Network - Survey 2021 (Responses).xlsx
   Found 1 email column(s): ['Email Address']
   ✅ Extracted 45 valid email(s)

📄 Processing: ESCP Impact Investors Network - Survey 2022 (Responses).xlsx
   Found 1 email column(s): ['Email Address']
   ✅ Extracted 52 valid email(s)

...

======================================================================
📊 SUMMARY: Found 156 unique email addresses
======================================================================

⚠️  Proceed with creating 156 user accounts? (yes/no): yes

======================================================================
CREATING USER ACCOUNTS IN SUPABASE
======================================================================

[1/156] Creating account for: john.doe@example.com
   ✅ Account created successfully (User ID: abc123...)

[2/156] Creating account for: jane.smith@example.com
   ⏭️  Account already exists, skipping...

...

======================================================================
FINAL SUMMARY
======================================================================
✅ Accounts Created: 142
⏭️  Already Existed: 12
❌ Failed: 2
📊 Total Processed: 156
======================================================================
```

### Generated Report File

The script creates `user_accounts_created.txt` with:
- Summary statistics
- Detailed status for each email
- User IDs for successfully created accounts
- Error messages for failed attempts

## Default Credentials

**All accounts are created with:**
- **Email:** The email from the survey data
- **Password:** `@ESCPNetwork2025#`
- **Email Confirmed:** Yes (auto-confirmed)

## Security Recommendations

1. **Change Default Password:**
   - Users should change their password after first login
   - Consider implementing a "force password change" flow

2. **Password Policy:**
   - The default password meets common requirements:
     - Contains uppercase and lowercase letters
     - Contains numbers
     - Contains special characters
     - Minimum 8 characters

3. **Service Role Key:**
   - Never expose the service role key in client-side code
   - Keep it in `.env` file (which is gitignored)
   - Rotate it periodically

## Troubleshooting

### Error: "Supabase credentials not found"
- Ensure `.env` file exists in the project root
- Verify `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Check for typos in variable names

### Error: "User already exists"
- This is normal if you run the script multiple times
- The script will skip existing users automatically

### Error: "Invalid email format"
- The script validates emails before processing
- Invalid emails are automatically filtered out

### Rate Limiting
- The script includes a 0.5-second delay between requests
- If you hit rate limits, increase the delay in the code

## Next Steps After Running

1. **Verify Accounts:**
   - Check Supabase Dashboard → Authentication → Users
   - Confirm the expected number of users were created

2. **Assign Roles:**
   - The accounts are created but don't have roles yet
   - You may need to assign roles (member, viewer, admin) separately

3. **Notify Users:**
   - Send welcome emails with login instructions
   - Include the default password
   - Request password change on first login

4. **Test Login:**
   - Try logging in with a few accounts to verify they work
   - Test the password reset flow

## File Structure

```
frontier-finance-nexus/
├── create_user_accounts.py          # Main script
├── USER_ACCOUNTS_README.md          # This file
├── user_accounts_created.txt        # Generated report (after running)
├── requirements.txt                 # Python dependencies
├── .env                            # Environment variables (not in git)
└── ESCP Impact Investors Network - Survey YYYY (Responses).xlsx
```

## Support

If you encounter issues:
1. Check the console output for specific error messages
2. Review the generated `user_accounts_created.txt` file
3. Verify your Supabase credentials and permissions
4. Ensure all Excel files are in the correct location
