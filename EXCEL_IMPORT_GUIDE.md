# Excel Import Guide - Complete Survey Migration

## Overview
This guide walks you through importing all survey data from Excel files (2021-2024) into your Supabase database.

---

## 📋 Prerequisites

### 1. Install Python Dependencies
```bash
cd c:\Users\almul\Downloads\frontier-finance-nexus
pip install -r requirements_migration.txt
```

### 2. Setup Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

   **Where to find these:**
   - Go to your Supabase Dashboard
   - Click on your project
   - Go to **Settings** > **API**
   - Copy the **Project URL** and **service_role** key (NOT the anon key!)

### 3. Verify Excel Files
Make sure these files are in `C:\Users\almul\Downloads\`:
- ✅ CFF2021.xlsx (43 rows)
- ✅ CFF2022.xlsx (51 rows)
- ✅ CFF2023.xlsx (61 rows)
- ✅ CFF2024.xlsx (105 rows)

---

## 🚀 Running the Import

### Basic Import (All Surveys)
```bash
python excel_import_surveys.py
```

This will:
1. ✅ Read all 4 Excel files
2. ✅ Create user accounts for any new emails
3. ✅ Import survey responses
4. ✅ Skip duplicates automatically
5. ✅ Show progress and errors

---

## 📊 What the Script Does

### Step 1: User Management
For each survey response:
- Extracts the email address
- Checks if user exists in `auth.users`
- If **not exists**: Creates new user with Supabase Admin API
- If **exists**: Uses existing user_id
- Creates entries in `profiles` and `user_roles` tables

### Step 2: Survey Import
- Maps Excel columns to database fields
- Handles complex data types:
  - **Arrays**: Converts comma-separated values to PostgreSQL arrays
  - **JSONB**: Converts JSON strings to JSONB objects
  - **Numbers**: Safely converts to integers/decimals
  - **Dates**: Parses various date formats
- Validates required fields
- Skips if survey already exists for that user

### Step 3: Error Handling
- Logs all errors with row numbers
- Continues processing even if individual rows fail
- Provides detailed summary at the end

---

## 📝 Current Implementation Status

### ⚠️ IMPORTANT: Field Mapping Incomplete

The current script includes **basic field mapping** for demonstration. You need to complete the mapping for all fields.

**What's mapped:**
- ✅ Email, name, organization
- ✅ Basic text fields
- ✅ User creation logic

**What needs mapping:**
- ⏳ All 167 columns for 2021 survey
- ⏳ All 277 columns for 2022 survey
- ⏳ All 297 columns for 2023 survey
- ⏳ All 295 columns for 2024 survey

---

## 🔧 Completing the Field Mapping

### Example: 2021 Survey

The script currently has:
```python
survey_data = {
    'user_id': user_id,
    'email_address': email,
    'firm_name': str(row.get('1. Name of firm', '')).strip(),
    'participant_name': name,
    'role_title': role,
    # ADD MORE FIELDS HERE
}
```

You need to add mappings for fields like:
```python
# Team and geographic info
'team_based': self.convert_to_array(row.get('4. Where is your team based?')),
'geographic_focus': self.convert_to_array(row.get('5. What is the geographic focus of your fund/vehicle?')),

# Timeline fields
'legal_entity_date': str(row.get('7. When did your current fund/investment vehicle achieve each of the following? [2020]', '')).strip(),

# Numeric fields
'current_ftes': self.safe_int(row.get('28. Number of current Full Time Equivalent staff members (FTEs) including principals')),

# JSONB fields (for ranking questions)
'portfolio_needs_ranking': self.convert_to_jsonb(row.get('29. During the first 3 years...')),
```

### Field Mapping Strategy

1. **Open the Excel file** in Excel/LibreOffice
2. **Look at the database schema** (from migration files)
3. **Match Excel column names** to database field names
4. **Add conversion** based on data type:
   - Text → `str(row.get('Column Name', '')).strip()`
   - Array → `self.convert_to_array(row.get('Column Name'))`
   - Integer → `self.safe_int(row.get('Column Name'))`
   - Decimal → `self.safe_float(row.get('Column Name'))`
   - JSONB → `self.convert_to_jsonb(row.get('Column Name'))`

---

## 🎯 Quick Start (Test Run)

### Test with 2024 Survey Only

1. Comment out other surveys in `main()`:
```python
# importer.import_2021_survey(files['2021'])
# importer.import_2022_survey(files['2022'])
# importer.import_2023_survey(files['2023'])
importer.import_2024_survey(files['2024'])  # Only this one
```

2. Run:
```bash
python excel_import_surveys.py
```

3. Check results in Supabase Dashboard:
   - Go to **Table Editor**
   - Select `survey_responses_2024`
   - Verify data imported correctly

---

## 🔍 Troubleshooting

### Error: "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY"
**Solution:** Make sure `.env` file exists and has correct values

### Error: "User creation failed"
**Solution:** 
- Check that you're using the **service_role** key (not anon key)
- Verify your Supabase project allows user creation via API

### Error: "Column not found"
**Solution:** 
- Excel column names might have changed
- Check the exact column name in the Excel file
- Update the script with correct column name

### Import is slow
**Solution:**
- This is normal for large datasets
- 260 total rows across 4 surveys should take 2-5 minutes
- Each user creation requires API call to Supabase

### Duplicate entries
**Solution:**
- Script automatically skips duplicates
- If you need to re-import, delete existing entries first:
  ```sql
  DELETE FROM survey_responses_2024 WHERE created_at > '2024-01-01';
  ```

---

## 📈 Expected Output

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                   SURVEY DATA IMPORT TOOL                                 ║
║                   Excel to Supabase Migration                             ║
╚═══════════════════════════════════════════════════════════════════════════╝

✓ Found 2021 survey: C:\Users\almul\Downloads\CFF2021.xlsx
✓ Found 2022 survey: C:\Users\almul\Downloads\CFF2022.xlsx
✓ Found 2023 survey: C:\Users\almul\Downloads\CFF2023.xlsx
✓ Found 2024 survey: C:\Users\almul\Downloads\CFF2024.xlsx

Initializing importer...

================================================================================
IMPORTING 2021 SURVEY: C:\Users\almul\Downloads\CFF2021.xlsx
================================================================================

Found 43 rows
✓ Created user: roeland@iungocapital.com
✓ Row 1: Imported survey for roeland@iungocapital.com
✓ Created user: brendan@sechacapital.com
✓ Row 2: Imported survey for brendan@sechacapital.com
...

================================================================================
IMPORT SUMMARY
================================================================================
Users created:        87
Users existing:       173
Surveys imported:     260
Surveys skipped:      0
Errors:               0

================================================================================
```

---

## 🎓 Next Steps After Import

1. **Verify Data**
   - Check Supabase Dashboard
   - Run verification queries
   - Spot-check a few survey responses

2. **Complete Field Mapping**
   - Add all missing field mappings
   - Re-run import for complete data

3. **Test Application**
   - Ensure frontend displays survey data correctly
   - Test filtering and visibility rules

4. **Backup**
   - Export database backup after successful import
   - Keep original Excel files as reference

---

## 💡 Tips

- **Start small**: Test with one survey year first
- **Check logs**: Review error messages carefully
- **Incremental**: Import in batches if needed
- **Backup first**: Always backup before bulk operations
- **Test users**: Create a test user manually first to verify process

---

## 🆘 Need Help?

If you encounter issues:
1. Check the error messages in the console
2. Verify your `.env` configuration
3. Check Supabase Dashboard for any RLS policy issues
4. Review the database schema to ensure field names match
5. Test with a single row first

---

## 📚 Additional Resources

- **Supabase Admin API**: https://supabase.com/docs/reference/python/admin-api
- **Pandas Documentation**: https://pandas.pydata.org/docs/
- **Database Schema**: See migration files in `supabase/migrations/`
