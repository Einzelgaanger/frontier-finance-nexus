# 2021 Survey Data Import Instructions

## Overview

This guide explains how to import the 2021 MSME Financing Survey data from Excel into your Supabase database.

## Prerequisites

### 1. Python Environment
```bash
# Install required packages
pip install pandas openpyxl supabase python-dotenv
```

### 2. Supabase Configuration

You need your Supabase credentials:
- **Supabase URL**: Found in your project settings
- **Service Role Key**: Found in Settings > API (⚠️ Keep this secret!)

### 3. Excel File

Ensure you have the 2021 survey Excel file ready.

## Setup

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key-here
```

### Option 2: Direct Configuration

Edit `import_2021_survey.py` and update these lines:

```python
SUPABASE_URL = "https://your-project.supabase.co"
SUPABASE_SERVICE_KEY = "your-service-role-key-here"
```

## Running the Import

### Basic Usage

```bash
python import_2021_survey.py path/to/2021_survey_data.xlsx
```

### Example

```bash
python import_2021_survey.py "C:\Users\almul\Downloads\2021_survey_complete.xlsx"
```

## What the Script Does

### 1. User Creation
- Creates users with **company name as unique identifier**
- Sets default password: `FrontierFinance2024!`
- Creates user profiles with company information
- Skips users that already exist (based on email)

### 2. Data Transformation
The script handles complex field mappings:

#### Array Fields
- Team locations
- Geographic focus
- Investment vehicle types
- Target sectors
- Gender considerations
- And more...

#### JSONB Rankings
- Portfolio needs (1-5 scale)
- Fund capabilities (1-5 scale)
- COVID-19 impact
- Working group value
- Webinar content value
- Network value areas
- Convening initiatives

#### Timeline Fields
- Legal entity date
- First close date
- First investment date

#### Special Transformations
- Investment counts (0, 1-4, 5-9, etc.)
- Fund sizes (ranges)
- IRR targets (ranges)
- SDG priorities (top 3)
- Investment sizes

### 3. Data Validation
- Checks for required fields (email, company name)
- Cleans NULL values, "N/A", "-", empty strings
- Handles missing data gracefully
- Skips invalid rows

## Output

The script provides detailed progress:

```
================================================================================
2021 MSME SURVEY DATA IMPORT
================================================================================

📂 Reading Excel file: 2021_survey_data.xlsx
  ✓ Loaded 43 rows

🚀 Starting import of 43 survey responses...

[1/43] Processing response...
  ✓ Created new user: roeland@iungocapital.com (Company: iungo capital)
  ✓ Successfully imported survey for iungo capital
    User ID: 123e4567-e89b-12d3-a456-426614174000

[2/43] Processing response...
  ✓ User already exists: brendan@sechacapital.com
  ✓ Successfully imported survey for Secha Capital
    User ID: 123e4567-e89b-12d3-a456-426614174001

...

================================================================================
IMPORT SUMMARY
================================================================================
Total rows processed:     43
✓ Successful imports:     41
✗ Failed imports:         1
⚠ Skipped rows:           1
================================================================================
```

## Column Mapping Reference

### Basic Information
| Excel Column | Database Field |
|-------------|----------------|
| Email Address | Used for user creation |
| 1. Name of firm | firm_name + company_name |
| 2. Name of participant | participant_name + full_name |
| 3. Role / title of participant | role_title |

### Timeline (Question 7)
Multiple columns with years → Parsed into:
- `legal_entity_date`
- `first_close_date`
- `first_investment_date`

### Investment Counts (Question 8)
Multiple range columns → Parsed into:
- `investments_march_2020`
- `investments_december_2020`

### Fund Size (Question 11)
Multiple range columns → Parsed into:
- `current_fund_size`
- `target_fund_size`

### IRR (Question 17)
Multiple range columns → Parsed into:
- `target_irr_achieved`
- `target_irr_targeted`

### SDGs (Question 21)
17 SDG columns with rankings → Parsed into:
- `top_sdg_1`, `top_sdg_2`, `top_sdg_3`

### Gender (Question 22)
Multiple consideration columns → Parsed into:
- `gender_considerations_investment` (array)
- `gender_considerations_requirement` (array)

### Investment Size (Question 24)
Multiple range columns → Parsed into:
- `investment_size_your_amount`
- `investment_size_total_raise`

### Rankings (Questions 29, 32, 34, 39, 41, 44, 46)
Multiple ranking columns → Parsed into JSONB:
- `portfolio_needs_ranking`
- `fund_capabilities_ranking`
- `covid_impact_portfolio`
- `working_groups_ranking`
- `webinar_content_ranking`
- `network_value_areas`
- `convening_initiatives_ranking`

## Troubleshooting

### Error: "Excel file not found"
- Check the file path is correct
- Use absolute paths or ensure you're in the correct directory

### Error: "Invalid credentials"
- Verify your Supabase URL and Service Role Key
- Ensure you're using the **Service Role Key**, not the anon key

### Error: "User creation failed"
- Check that Supabase Auth is enabled
- Verify the `user_profiles` table exists
- Ensure RLS policies allow service role access

### Skipped Rows
- Check that rows have both email and company name
- Review the Excel file for data quality issues

### Failed Imports
- Check the error message for specific issues
- Verify database schema matches the script expectations
- Ensure all required tables exist

## Post-Import Verification

### Check User Count
```sql
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM user_profiles;
```

### Check Survey Responses
```sql
SELECT COUNT(*) FROM survey_responses_2021;
SELECT COUNT(*) FROM survey_responses_2021 WHERE is_draft = false;
```

### View Sample Data
```sql
SELECT 
    firm_name,
    participant_name,
    email_address,
    created_at
FROM survey_responses_2021
ORDER BY created_at DESC
LIMIT 10;
```

### Check User-Survey Relationship
```sql
SELECT 
    up.company_name,
    up.email,
    sr.firm_name,
    sr.created_at
FROM user_profiles up
JOIN survey_responses_2021 sr ON sr.user_id = up.id
ORDER BY sr.created_at DESC;
```

## Default User Credentials

All imported users will have:
- **Password**: `FrontierFinance2024!`
- **Email Verified**: Yes
- **User Role**: member
- **Status**: Active

Users can change their password after first login.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit** `.env` file or hardcoded credentials to git
2. **Service Role Key** bypasses Row Level Security - use carefully
3. **Default password** should be changed by users on first login
4. Consider implementing password reset flow for imported users
5. Store the Service Role Key securely (password manager, secrets vault)

## Next Steps

After successful import:

1. ✅ Verify data in Supabase dashboard
2. ✅ Test user login with default password
3. ✅ Run data quality checks
4. ✅ Send welcome emails to imported users with password reset links
5. ✅ Import 2022, 2023, 2024 survey data (if available)

## Support

If you encounter issues:
1. Check the error messages in the console output
2. Review the Supabase logs in your dashboard
3. Verify the database schema matches expectations
4. Check that all required tables and columns exist

## License

This script is part of the Frontier Finance Nexus project.
