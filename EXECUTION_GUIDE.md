# SQL Migration Execution Guide

## Overview
This guide walks you through executing the large SQL migration file directly to your Supabase PostgreSQL database.

## Prerequisites

1. **Python packages installed**:
   ```bash
   pip install psycopg2-binary python-dotenv
   ```

2. **Database password**: Get your Supabase database password
   - Go to: Supabase Dashboard → Project Settings → Database
   - Look for "Database Password" or reset it if needed

3. **Add password to `.env` file**:
   ```env
   SUPABASE_DB_PASSWORD=your-actual-password-here
   ```

## Step-by-Step Execution

### Step 1: Generate Individual SQL Files
```bash
python datamigration.py
```
- Reads Excel files (2021-2024)
- Creates individual SQL files in `C:\Users\almul\Downloads\Migration TXTs\`
- Each response gets its own `.txt` file

### Step 2: Combine SQL Files (Optional - for review)
```bash
python combine_sql_files.py
```
- Combines all `.txt` files into `COMBINED_MIGRATION.sql`
- Useful for reviewing the full migration
- **Note**: File is too large for Supabase SQL Editor (14+ MB)

### Step 3: Execute Migration via Python
```bash
python execute_migration.py
```

**What it does**:
- Connects directly to PostgreSQL database
- Reads `COMBINED_MIGRATION.sql`
- Splits into individual SQL statements
- Executes in batches of 100 statements
- Shows progress and handles errors
- Uses transactions (can rollback on failure)

**Expected output**:
```
================================================================================
SQL MIGRATION EXECUTOR
================================================================================
SQL File: C:\Users\almul\Downloads\Migration TXTs\COMBINED_MIGRATION.sql
Database: db.qiqxdivyyjcbegdlptuq.supabase.co
================================================================================

📁 SQL file size: 14,211,928 bytes (13.55 MB)

📖 Reading SQL file...
🔪 Splitting SQL statements...
✓ Found 15,234 SQL statements to execute

🔌 Connecting to database...
✓ Connected successfully!

🚀 Executing SQL statements...
================================================================================

📦 Batch 1/153 (100 statements)
  ✓ Executed 100/15234 statements
  ✓ Batch 1 committed successfully

📦 Batch 2/153 (100 statements)
  ✓ Executed 200/15234 statements
  ✓ Batch 2 committed successfully

...

================================================================================
✅ MIGRATION COMPLETE!
================================================================================
Total statements: 15234
Successfully executed: 15234
Failed: 0
Success rate: 100.00%
================================================================================
```

## Troubleshooting

### Error: "Access denied" or "Authentication failed"
- Check your database password in `.env`
- Verify it matches your Supabase database password
- Try resetting the password in Supabase Dashboard

### Error: "Connection timeout"
- Check your internet connection
- Verify the database host is correct
- Try again (temporary network issue)

### Error: "Duplicate key" or "Already exists"
- Tables/data already exist
- Option 1: Drop existing tables first
- Option 2: Modify script to use `CREATE TABLE IF NOT EXISTS`

### Error: "Too many errors"
- Script stops after 10 errors
- Review the error messages
- Fix the SQL statements causing issues
- Re-run the script

## Database Schema Created

After successful execution, you'll have:

### Master Tables
- `companies` - Company registry with normalized names
- `survey_responses` - Metadata for all survey responses

### Response Tables
- `survey_response_1_year_2021` - Response 1 from 2021
- `survey_response_2_year_2021` - Response 2 from 2021
- `survey_response_3_year_2022` - Response 3 from 2022
- ... (one table per survey response)

Each response table contains:
- `id` - Primary key
- `question_column` - Sanitized column name
- `original_question` - Original question text
- `response_value` - Answer provided
- `data_type` - Inferred data type
- `created_at` - Timestamp

## Verification

After migration, verify in Supabase:

1. **Check tables created**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name LIKE 'survey_%'
   ORDER BY table_name;
   ```

2. **Count responses**:
   ```sql
   SELECT COUNT(*) FROM survey_responses;
   ```

3. **View sample response**:
   ```sql
   SELECT * FROM survey_response_1_year_2021 LIMIT 10;
   ```

## Next Steps

1. ✅ Execute migration
2. ✅ Verify tables in Supabase
3. ✅ Test Network page to see years → companies
4. 🔜 Create survey response detail page
5. 🔜 Link companies across years
