# Complete Database Rebuild Guide

This guide will walk you through completely rebuilding the database from scratch with proper structure and data import from Excel files.

## 📋 Overview

This rebuild process will:
1. **Delete all existing data** (users, surveys, tables)
2. **Create fresh database schema** with company-centric design
3. **Create proper SQL tables** for each survey year (2021-2024)
4. **Import data from Excel** files with accurate column mapping
5. **Set up proper user management** based on company names

## 🎯 Key Improvements

### Company-Centric Design
- Users are grouped by **company_name** (not just email)
- Multiple users from same company can exist
- One company_id links all users from same organization
- Each user maintains their own email and can sign in independently

### Proper SQL Structure
- **No more JSON fields** for survey responses
- Each survey question = dedicated SQL column
- Easy to query and analyze data
- Proper data types (TEXT[], BOOLEAN, DATE, JSONB only for complex nested data)

### Accurate Column Mapping
- Excel columns mapped 1:1 to database columns
- Automatic data type conversion
- Array fields properly parsed
- Date fields properly formatted

## 📁 Files Created

1. **1_DELETE_ALL.sql** - Deletes everything (USE WITH CAUTION!)
2. **2_CREATE_FRESH_DATABASE.sql** - Creates new schema
3. **3_IMPORT_FROM_EXCEL.py** - Python script to import Excel data

## 🚀 Step-by-Step Instructions

### Step 1: Prepare Excel Files

Place your Excel files in the project root directory with these exact names:
```
2021_survey_data.xlsx
2022_survey_data.xlsx
2023_survey_data.xlsx
2024_survey_data.xlsx
```

**Excel File Requirements:**
- First row should contain column headers
- Column names should match the survey questions
- Each row represents one survey response
- Required columns: "Firm Name" (or "1. Name of firm"), "Email"

### Step 2: Backup Current Data (IMPORTANT!)

Before proceeding, backup your current database:

```bash
# Using Supabase Dashboard:
# 1. Go to Database > Backups
# 2. Create a manual backup
# 3. Download the backup file

# Or use pg_dump if you have direct access:
pg_dump -h your-supabase-host -U postgres -d postgres > backup_$(date +%Y%m%d).sql
```

### Step 3: Delete All Existing Data

⚠️ **WARNING: This cannot be undone!**

1. Open Supabase SQL Editor
2. Copy contents of `1_DELETE_ALL.sql`
3. Review the script carefully
4. Execute the script

```sql
-- This will delete:
-- ✗ All survey response tables
-- ✗ All user profiles
-- ✗ All auth users
-- ✗ All functions and triggers
```

### Step 4: Create Fresh Database Schema

1. Open Supabase SQL Editor
2. Copy contents of `2_CREATE_FRESH_DATABASE.sql`
3. Execute the script

This creates:
- ✓ `user_profiles` table (company-centric)
- ✓ `survey_responses_2021` table
- ✓ `survey_responses_2022` table
- ✓ `survey_responses_2023` table
- ✓ `survey_responses_2024` table
- ✓ All necessary indexes
- ✓ Row Level Security (RLS) policies
- ✓ Triggers for auto-updates
- ✓ Helper functions

### Step 5: Install Python Dependencies

```bash
pip install pandas openpyxl python-dotenv supabase
```

### Step 6: Configure Environment

Ensure your `.env` file has:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 7: Run Import Script

```bash
python 3_IMPORT_FROM_EXCEL.py
```

The script will:
1. Check for Excel files
2. Show you which files were found
3. Ask for confirmation
4. Import data year by year
5. Show progress for each row
6. Display summary at the end

**What the script does:**
- ✓ Reads Excel files
- ✓ Maps columns to database fields
- ✓ Creates/finds users based on company name
- ✓ Converts data types (arrays, booleans, dates)
- ✓ Inserts data into correct tables
- ✓ Handles errors gracefully
- ✓ Shows detailed progress

### Step 8: Verify Import

Check the data in Supabase:

```sql
-- Check user profiles
SELECT company_name, COUNT(*) as user_count
FROM user_profiles
GROUP BY company_name
ORDER BY user_count DESC;

-- Check 2021 surveys
SELECT COUNT(*) FROM survey_responses_2021;

-- Check 2022 surveys
SELECT COUNT(*) FROM survey_responses_2022;

-- Check 2023 surveys
SELECT COUNT(*) FROM survey_responses_2023;

-- Check 2024 surveys
SELECT COUNT(*) FROM survey_responses_2024;

-- Check sample data
SELECT 
    firm_name,
    participant_name,
    email_address,
    fund_stage,
    current_fund_size
FROM survey_responses_2024
LIMIT 5;
```

## 📊 Database Schema Details

### User Profiles Table

```sql
user_profiles
├── id (UUID, primary key)
├── company_name (TEXT, required)
├── company_id (UUID, groups users from same company)
├── email (TEXT, unique)
├── full_name (TEXT)
├── role_title (TEXT)
├── user_role (TEXT: 'admin', 'member', 'viewer')
├── is_active (BOOLEAN)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

### Survey Tables Structure

Each survey year has its own table with dedicated columns:

**2021 Survey** - 17 sections, 100+ fields
- Basic information
- Team & geography
- Fund operations
- Investment strategy
- Impact & SDGs
- Gender considerations
- Portfolio management
- COVID-19 impact
- Network engagement

**2022 Survey** - Simplified structure
- Core fund information
- Investment strategy
- Impact metrics
- Network engagement

**2023 Survey** - Enhanced structure
- Extended fund details
- ESG frameworks
- Market insights
- Peer learning

**2024 Survey** - Most comprehensive
- Digital transformation
- Climate focus
- Advanced metrics (DPI, TVPI)
- Innovation tracking

## 🔍 Column Mapping Examples

### 2021 Survey Mapping

| Excel Column | Database Column |
|-------------|-----------------|
| 1. Name of firm | firm_name |
| 2. Name of participant | participant_name |
| 4. Where is your team based? | team_based (TEXT[]) |
| 10. Type of investment vehicle | investment_vehicle_type (TEXT[]) |
| 20. Does your fund report SDGs? | report_sustainable_development_goals (BOOLEAN) |

### Array Fields (Multiple Selection)

Excel format:
```
Option 1, Option 2, Option 3
```

Database format:
```sql
{'Option 1', 'Option 2', 'Option 3'}
```

### Boolean Fields

Excel format:
```
Yes / No / TRUE / FALSE
```

Database format:
```sql
true / false / NULL
```

### Date Fields

Excel format:
```
2021-03-15 or 03/15/2021
```

Database format:
```sql
'2021-03-15'
```

## 🛠️ Troubleshooting

### Issue: Excel file not found

**Solution:**
```bash
# Check file exists
ls -la *.xlsx

# Ensure correct filename
mv "my_2021_data.xlsx" "2021_survey_data.xlsx"
```

### Issue: Column not found in Excel

**Solution:**
1. Open Excel file
2. Check first row for exact column names
3. Update `COLUMN_MAPPING_20XX` in Python script
4. Re-run import

### Issue: Import fails for specific row

**Solution:**
- Check the error message
- Verify data format in Excel
- Check for special characters
- Ensure required fields are present

### Issue: User creation fails

**Solution:**
```sql
-- Check if user already exists
SELECT * FROM user_profiles WHERE email = 'user@example.com';

-- Check auth.users
SELECT * FROM auth.users WHERE email = 'user@example.com';
```

### Issue: Permission denied

**Solution:**
```sql
-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

## 📈 Next Steps After Import

### 1. Update Survey Forms

Update your React survey forms to match the new database structure:

```typescript
// Example for 2024 survey
const survey2024Fields = {
  firm_name: string,
  fund_stage: string,
  team_location: string[],
  // ... etc
};
```

### 2. Update Analytics Pages

Modify analytics queries to use new column names:

```typescript
// Old (JSON)
const data = survey.form_data['10. Type of investment vehicle'];

// New (SQL column)
const data = survey.investment_vehicle_type;
```

### 3. Test User Authentication

```bash
# Test login for each company
# Verify multiple users from same company can access data
```

### 4. Set Up Admin Users

```sql
-- Make specific users admins
UPDATE user_profiles 
SET user_role = 'admin' 
WHERE email IN ('admin1@example.com', 'admin2@example.com');
```

### 5. Configure Field Visibility (Optional)

If you need field-level permissions, create a visibility table:

```sql
CREATE TABLE field_visibility (
    field_name TEXT PRIMARY KEY,
    visible_to_viewer BOOLEAN DEFAULT false,
    visible_to_member BOOLEAN DEFAULT true,
    visible_to_admin BOOLEAN DEFAULT true
);
```

## 🎉 Success Criteria

Your rebuild is successful when:

- ✅ All Excel data imported without errors
- ✅ Users can sign in with their emails
- ✅ Multiple users from same company can access shared data
- ✅ Survey forms work with new structure
- ✅ Analytics pages display correct data
- ✅ No JSON parsing errors
- ✅ All queries run fast with proper indexes

## 📞 Support

If you encounter issues:

1. Check the error messages carefully
2. Review the SQL execution logs
3. Verify Excel file format
4. Check Supabase dashboard for data
5. Test with a small subset first

## 🔐 Security Notes

- All tables have RLS enabled
- Users can only see their own data (unless admin/member)
- Passwords are managed by Supabase Auth
- API keys should never be committed to git
- Use environment variables for sensitive data

## 📝 Maintenance

### Regular Tasks

1. **Backup database** before major changes
2. **Monitor import logs** for errors
3. **Update column mappings** when survey changes
4. **Review user roles** periodically
5. **Clean up inactive users** as needed

### Adding New Survey Year

1. Create new table in SQL
2. Add column mapping in Python script
3. Add Excel file
4. Run import
5. Update frontend forms

---

**Last Updated:** 2025-10-14
**Version:** 1.0.0
**Author:** Database Rebuild Team
