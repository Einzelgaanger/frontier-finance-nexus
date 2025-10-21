# Survey Data Import Instructions

## Overview
This guide explains how to import historical survey data (2021 and 2022) from Excel files into your Supabase database.

---

## Prerequisites

### 1. Environment Setup

Create a `.env` file in the project root with:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DEFAULT_USER_PASSWORD=YourSecurePassword123!
```

**Important Security Notes:**
- The `SUPABASE_SERVICE_ROLE_KEY` is required for creating users programmatically
- Never commit the `.env` file to version control
- Use a strong default password that users will change on first login

### 2. Install Required Python Packages

```bash
pip install pandas openpyxl supabase python-dotenv
```

### 3. Database Setup

Run the SQL schema files in order:

```sql
-- 1. Delete old 2021 table (if exists)
-- Run: DELETE_2021_SURVEY_ONLY.sql

-- 2. Create 2021 schema
-- Run: 2021_SURVEY_SCHEMA_FINAL.sql

-- 3. Create 2022 schema
-- Run: 2022_SURVEY_SCHEMA_FINAL.sql
```

---

## Import Process

### Importing 2021 Survey Data

**Script:** `import_2021_survey_data.py`
**Excel Columns:** 167 survey fields

#### Excel File Requirements:

Your Excel file must have these key columns:
- `Email address` (required)
- `Name of firm` or `Name of organisation` (required - used as company identifier)
- `Name of participant` (optional)
- `Role / title of participant` (optional)
- All other 167 survey question columns

#### Run the Import:

```bash
python import_2021_survey_data.py path/to/2021_survey.xlsx
```

#### Example:

```bash
python import_2021_survey_data.py ./data/2021_frontier_survey.xlsx
```

#### What It Does:

1. **Creates Users**: For each email in the Excel file
   - Creates new user in Supabase Auth
   - Sets default password from `.env`
   - Marks email as confirmed
   - Adds metadata (company name, import date)

2. **Creates Profiles**: In `user_profiles` table
   - Links to user via `user_id`
   - Stores company name (unique identifier)
   - Multiple users can share same company
   - Sets role as "member"

3. **Imports Survey Data**: Into `survey_responses_2021` table
   - Maps all 167 Excel columns to database fields
   - Handles arrays (comma-separated values)
   - Handles booleans (Yes/No values)
   - Sets timestamps

---

### Importing 2022 Survey Data

**Script:** `import_2022_survey_data.py`
**Excel Columns:** 277 survey fields

#### Excel File Requirements:

Your Excel file must have these columns (in order):
- Column 1: `...1` (row number)
- Column 2: `Name`
- Column 3: `Role or title`
- Column 4: `Email address` (required)
- Column 5: `Name of organisation` (required - company identifier)
- Columns 6-277: Survey questions (many use `...` notation for continuation)

#### Run the Import:

```bash
python import_2022_survey_data.py path/to/2022_survey.xlsx
```

#### Example:

```bash
python import_2022_survey_data.py ./data/2022_frontier_survey.xlsx
```

#### What It Does:

Same process as 2021, but:
- Maps 277 columns instead of 167
- Uses column index for mapping (handles `...` notation)
- Imports into `survey_responses_2022` table

---

## Understanding the Data Structure

### Company as Unique Identifier

**Key Concept:** Company name is the unique identifier, not email.

- ✅ Multiple users can work for the same company
- ✅ Each user gets their own account
- ✅ Survey responses are linked to both user and company
- ✅ Users from same company can collaborate

**Example:**
```
Company: "Acme Fund"
- User 1: john@acmefund.com (CEO)
- User 2: jane@acmefund.com (CFO)
- User 3: bob@acmefund.com (Analyst)

All three users:
- Have separate accounts
- Share company_name: "Acme Fund"
- Can each submit survey responses
- Can view company data (based on RLS policies)
```

### User Creation Logic

The scripts handle existing users gracefully:

1. **New User**: Creates account with default password
2. **Existing User**: Finds existing user ID and uses it
3. **Profile**: Always upserts (creates or updates)
4. **Survey Data**: Always upserts (creates or updates)

---

## Column Mapping Reference

### 2021 Survey (167 Columns)

The script maps Excel columns to database fields. Key mappings:

#### Timeline Fields (14 fields)
Excel columns with year selections → Individual database columns:
- `timeline_na`
- `timeline_prior_2000`
- `timeline_2000_2010`
- `timeline_2011` through `timeline_2021`

#### Investment Count (6 fields)
Excel columns with count ranges → Individual database columns:
- `investments_0`
- `investments_1_4`
- `investments_5_9`
- `investments_10_14`
- `investments_15_24`
- `investments_25_plus`

#### Fund Size (6 fields)
- `fund_size_under_1m`
- `fund_size_1_4m`
- `fund_size_5_9m`
- `fund_size_10_19m`
- `fund_size_20_29m`
- `fund_size_30m_plus`

#### SDGs (17 fields)
One field per SDG goal:
- `sdg_no_poverty`
- `sdg_zero_hunger`
- `sdg_good_health`
- ... (all 17 SDGs)

#### Gender Considerations (10 fields)
- `gender_majority_women_ownership`
- `gender_women_senior_mgmt`
- `gender_women_direct_workforce`
- ... (10 total)

#### Portfolio Needs (10 ranking fields)
- `portfolio_need_finance_budgeting`
- `portfolio_need_fundraising`
- ... (10 total)

#### Fund Capabilities (15 ranking fields)
- `fund_capability_global_lps`
- `fund_capability_local_lps`
- ... (15 total)

#### COVID Impact (8 fields)
- `covid_impact_staff_attendance`
- `covid_impact_customer_demand`
- ... (8 total)

#### Working Groups (5 ranking fields)
- `working_group_fund_economics`
- `working_group_lp_profiles`
- ... (5 total)

#### Webinars (11 ranking fields)
- `webinar_gender_lens`
- `webinar_covid_response`
- ... (11 total)

#### Network Value (4 ranking fields)
- `network_value_peer_connections`
- `network_value_advocacy`
- `network_value_visibility`
- `network_value_systems_change`

#### Initiatives (13 ranking fields)
- `initiative_warehousing`
- `initiative_ta_facility`
- ... (13 total)

### 2022 Survey (277 Columns)

The 2022 survey has significantly more fields. Key sections:

- **Basic Info**: 5 fields
- **Timeline**: 3 fields
- **Geographic Markets**: 9 fields (US, Europe, Africa regions, Middle East)
- **Team Location**: 9 fields (same regions)
- **FTEs & Principals**: 3 fields
- **GP Experience**: 16 fields (experience matrix)
- **Gender Orientation**: 6 fields
- **Team Experience**: 12 fields (investment/exit counts)
- **Legal & Currency**: 4 fields
- **Fund Vehicle**: 2 fields
- **Fund Size**: 18 fields (3 categories × 6 ranges)
- **Investment Details**: 4 fields
- **Concessionary Capital**: 6 fields
- **LP Capital Sources**: 17 fields (existing vs target)
- **GP Commitment & Fees**: 9 fields
- **Fundraising Barriers**: 12 ranking fields
- **Business Stage**: 4 fields
- **Enterprise Types**: 4 fields
- **Financing Needs**: 6 fields
- **Sector Focus**: 16 fields (5 sectors × 3 fields)
- **Financial Instruments**: 9 fields
- **SDGs**: 3 fields (top 3)
- **Gender Lens Investing**: 28 fields (9 categories × 3 options)
- **Technology Role**: 1 field
- **Pipeline Sourcing**: 6 fields
- **Investment Size**: 1 field
- **Portfolio Priorities**: 11 ranking fields
- **Investment Timeframe**: 1 field
- **Exit Forms**: 7 fields
- **Exits Achieved**: 2 fields
- **Investment Count**: 3 fields
- **Portfolio Performance**: 5 fields
- **Employment Impact**: 5 fields
- **Fund Priorities**: 13 ranking fields
- **Domestic Concerns**: 8 ranking fields
- **International Concerns**: 8 ranking fields
- **Survey Interest**: 1 field

---

## Output & Logging

### Console Output

The scripts provide detailed progress:

```
================================================================================
2021 SURVEY DATA IMPORT
================================================================================

📂 Reading Excel file: ./data/2021_survey.xlsx
✓ Loaded 45 rows from Excel

🚀 Starting import process...
--------------------------------------------------------------------------------

[Row 1/45]
  📧 Email: john@example.com
  🏢 Company: Example Fund
  ✓ Created new user: john@example.com
  ✓ Created/updated profile for: john@example.com
  ✓ Survey data imported successfully

[Row 2/45]
  📧 Email: jane@example.com
  🏢 Company: Example Fund
  ℹ User already exists: jane@example.com, fetching user ID...
  ✓ Found existing user: jane@example.com
  ✓ Created/updated profile for: jane@example.com
  ✓ Survey data imported successfully

...

================================================================================
IMPORT SUMMARY
================================================================================
Total rows processed: 45
✓ Successful imports: 43
✗ Failed imports: 1
⚠ Skipped rows: 1
================================================================================

🎉 Import completed! 43 survey responses imported.

📝 Note: All users created with default password: FrontierFinance2021!
   Users should change their password on first login.
```

---

## Troubleshooting

### Common Issues

#### 1. "Error reading Excel file"

**Cause:** File not found or invalid format

**Solution:**
- Check file path is correct
- Ensure file is `.xlsx` format (not `.xls`)
- Make sure file is not open in Excel

#### 2. "Error creating user: already registered"

**Cause:** User email already exists in Supabase

**Solution:** This is handled automatically - the script will fetch the existing user ID and continue

#### 3. "Skipping row: No email address"

**Cause:** Excel row is missing email

**Solution:** 
- Check Excel file for empty email cells
- These rows are skipped automatically
- Review skipped count in summary

#### 4. "Skipping row: No company name"

**Cause:** Excel row is missing company/organization name

**Solution:**
- Check Excel file for empty company cells
- Company name is required as unique identifier
- Add company names to Excel file

#### 5. "Error: SUPABASE_URL not found"

**Cause:** Missing `.env` file or incorrect variable names

**Solution:**
- Create `.env` file in project root
- Add all required variables
- Check variable names match exactly

#### 6. "Permission denied" or "Unauthorized"

**Cause:** Using wrong Supabase key

**Solution:**
- Use `SUPABASE_SERVICE_ROLE_KEY`, not `SUPABASE_ANON_KEY`
- Service role key is required for creating users
- Find it in Supabase Dashboard → Settings → API

#### 7. "Column not found" errors

**Cause:** Excel column names don't match expected format

**Solution:**
- For 2021: Check column names match exactly
- For 2022: Column order matters (uses index)
- Review sample data structure in this document

---

## Data Validation

### After Import, Verify:

1. **User Count**
```sql
SELECT COUNT(*) FROM auth.users 
WHERE raw_user_meta_data->>'imported_from' = '2021_survey';
```

2. **Profile Count**
```sql
SELECT COUNT(*) FROM user_profiles;
```

3. **Survey Response Count**
```sql
SELECT COUNT(*) FROM survey_responses_2021;
SELECT COUNT(*) FROM survey_responses_2022;
```

4. **Companies with Multiple Users**
```sql
SELECT company_name, COUNT(*) as user_count
FROM user_profiles
GROUP BY company_name
HAVING COUNT(*) > 1
ORDER BY user_count DESC;
```

5. **Sample Data Check**
```sql
SELECT 
  u.email,
  up.company_name,
  up.full_name,
  sr.firm_name,
  sr.created_at
FROM auth.users u
JOIN user_profiles up ON u.id = up.id
JOIN survey_responses_2021 sr ON u.id = sr.user_id
LIMIT 10;
```

---

## Security Best Practices

### 1. Default Password Management

- ✅ Use a strong default password
- ✅ Store in `.env` file (never commit)
- ✅ Require users to change on first login
- ✅ Consider password reset flow

### 2. Service Role Key

- ⚠️ **NEVER** expose service role key in client code
- ⚠️ Only use in server-side scripts
- ⚠️ Keep `.env` file in `.gitignore`
- ⚠️ Rotate keys if compromised

### 3. Data Privacy

- Imported data contains sensitive business information
- Ensure RLS policies are properly configured
- Test access controls before production use
- Consider data retention policies

---

## Next Steps

After successful import:

1. **Test User Login**
   - Try logging in with imported email
   - Use default password from `.env`
   - Verify data appears correctly

2. **Update Passwords**
   - Send password reset emails to all imported users
   - Or implement first-login password change flow

3. **Verify RLS Policies**
   - Test that users can only see their own data
   - Test that admins can see all data
   - Test company-level data sharing

4. **Data Quality Check**
   - Review imported data for accuracy
   - Check for any NULL values that shouldn't be
   - Validate array fields parsed correctly

5. **Frontend Integration**
   - Update Survey2021.tsx to match new schema
   - Test form submission
   - Verify data persistence

---

## Support

If you encounter issues:

1. Check console output for specific error messages
2. Review this troubleshooting guide
3. Verify `.env` configuration
4. Check Supabase Dashboard for user creation
5. Review database logs in Supabase

---

## File Reference

- `import_2021_survey_data.py` - 2021 import script (167 columns)
- `import_2022_survey_data.py` - 2022 import script (277 columns)
- `2021_SURVEY_SCHEMA_FINAL.sql` - 2021 database schema
- `2022_SURVEY_SCHEMA_FINAL.sql` - 2022 database schema
- `DELETE_2021_SURVEY_ONLY.sql` - Clean up old 2021 table
- `.env` - Environment variables (create this)
- `DATA_IMPORT_INSTRUCTIONS.md` - This file
