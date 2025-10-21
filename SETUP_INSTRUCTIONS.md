# Setup Instructions for Data Migration

## Prerequisites

1. **Install psycopg2**:
```bash
pip install psycopg2-binary
```

Or install all requirements:
```bash
pip install -r requirements.txt
```

## Configuration

You need to add your Supabase database password to the `.env` file.

### Step 1: Get Your Database Password

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Project Settings** (gear icon in sidebar)
4. Click on **Database** tab
5. Scroll down to **Connection string** section
6. Click **Reset Database Password** if you don't have it, or use your existing password

### Step 2: Update .env File

Add this line to your `.env` file:

```env
SUPABASE_DB_PASSWORD=your_database_password_here
```

Your complete `.env` file should look like:

```env
SUPABASE_URL=https://qiqxdivyyjcbegdlptuq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_PASSWORD=your_database_password
```

## Running the Migration

Once configured, run:

```bash
python datamigration.py
```

## What the Script Does

1. Connects to PostgreSQL directly (for creating tables)
2. Connects to Supabase (for data queries)
3. Creates master tables (`companies`, `survey_responses`)
4. Processes each Excel file (2021-2024)
5. Creates custom tables for each company's survey responses
6. Generates a timestamped SQL file with all operations

## Output Files

- `migration_output_YYYYMMDD_HHMMSS.sql` - Complete SQL migration script
- `datamigration.log` - Detailed execution log

## Troubleshooting

### Error: "Missing SUPABASE_DB_PASSWORD"
- Make sure you added `SUPABASE_DB_PASSWORD` to your `.env` file
- Verify the password is correct (no quotes needed)

### Error: "connection refused" or "authentication failed"
- Double-check your database password
- Ensure your IP is allowed in Supabase (Database Settings -> Connection Pooling)
- Try resetting your database password in Supabase Dashboard

### Error: "Excel file not found"
- Verify all Excel files exist at:
  - `C:\Users\almul\Downloads\CFF2021.xlsx`
  - `C:\Users\almul\Downloads\CFF2022.xlsx`
  - `C:\Users\almul\Downloads\CFF2023.xlsx`
  - `C:\Users\almul\Downloads\CFF2024.xlsx`
