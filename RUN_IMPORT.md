# 🚀 Ready to Run - Survey Import Instructions

## ✅ Everything is Configured!

Your `.env` file is ready with:
- ✅ Supabase URL: `https://qiqxdivyyjcbegdlptuq.supabase.co`
- ✅ Service Role Key: Configured
- ✅ Excel Files: All 4 files located

---

## 📝 Step-by-Step Instructions

### Step 1: Install Dependencies

Open PowerShell in this directory and run:

```powershell
pip install pandas openpyxl supabase python-dotenv
```

### Step 2: Run the Import

```powershell
python import_surveys_final.py
```

That's it! The script will:
1. ✅ Read all 4 Excel files
2. ✅ Create users automatically (if they don't exist)
3. ✅ Import all survey responses
4. ✅ Handle multi-select questions in separate tables
5. ✅ Skip duplicates
6. ✅ Show progress and summary

---

## 📊 What to Expect

### Console Output:
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
```

---

## 🎯 Data Structure

The script imports data into your exact database schema:

### Main Response Tables:
- `survey_2021_responses` - Stores main response + `form_data` JSONB
- `survey_2022_responses` - Stores main response + `form_data` JSONB
- `survey_2023_responses` - Stores main response + `form_data` JSONB
- `survey_2024_responses` - Stores main response + `form_data` JSONB

### Multi-Select Tables (for each year):
- `survey_2021_team_based`
- `survey_2021_geographic_focus`
- `survey_2022_team_based`
- `survey_2022_geographic_markets`
- `survey_2023_team_based`
- `survey_2023_geographic_markets`
- `survey_2024_team_based`
- `survey_2024_geographic_markets`
- `survey_2024_investment_networks`
- ... and more

### User Tables:
- `profiles` - User profile information
- `user_roles` - User role assignments (all set to 'member')

---

## 🔍 After Import - Verification

### Check in Supabase Dashboard:

1. Go to https://qiqxdivyyjcbegdlptuq.supabase.co
2. Navigate to **Table Editor**
3. Check these tables:
   - `survey_2021_responses` - Should have ~43 rows
   - `survey_2022_responses` - Should have ~51 rows
   - `survey_2023_responses` - Should have ~61 rows
   - `survey_2024_responses` - Should have ~105 rows
   - `profiles` - Should have all unique users

### Run Verification Query:

```sql
-- Check total surveys imported
SELECT 
  'survey_2021_responses' as table_name, 
  COUNT(*) as count 
FROM survey_2021_responses
UNION ALL
SELECT 'survey_2022_responses', COUNT(*) FROM survey_2022_responses
UNION ALL
SELECT 'survey_2023_responses', COUNT(*) FROM survey_2023_responses
UNION ALL
SELECT 'survey_2024_responses', COUNT(*) FROM survey_2024_responses;

-- Check total users created
SELECT COUNT(*) as total_users FROM profiles;
```

---

## ⚠️ Important Notes

### Duplicate Prevention:
- Script checks if survey already exists for each user
- Won't re-import if user already has a response for that year
- Safe to run multiple times

### User Creation:
- Creates users via Supabase Admin API
- Sets email_confirm to true (users don't need to verify)
- All users get 'member' role by default
- Creates entries in both `profiles` and `user_roles` tables

### Data Storage:
- **Main fields** stored in dedicated columns (email, name, org, fund_name)
- **All survey data** also stored in `form_data` JSONB for flexibility
- **Multi-select questions** stored in separate normalized tables

---

## 🐛 Troubleshooting

### Error: "Module not found: supabase"
**Solution:** Run `pip install supabase`

### Error: "User creation failed"
**Solution:** 
- Check that service_role key is correct in `.env`
- Verify Supabase project is active

### Error: "File not found"
**Solution:** 
- Verify Excel files are in `C:\Users\almul\Downloads\`
- Check file names match exactly (CFF2021.xlsx, etc.)

### Import is slow
**Normal!** Creating users and importing 260 responses takes 3-5 minutes.

---

## 🎉 You're All Set!

Just run:
```powershell
python import_surveys_final.py
```

The script will handle everything automatically!
