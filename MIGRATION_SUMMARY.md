# Survey Data Migration Summary

## Overview
This document summarizes the changes made to migrate survey data from Excel files to Supabase PostgreSQL database.

## Key Changes

### 1. Python Migration Script (`datamigration.py`)

**Approach**: Independent response tables with no email tracking

**Features**:
- Each Excel row (survey response) gets its own table
- Company names are normalized for future linking
- No email associations (responses are independent)
- Generates individual SQL `.txt` files for each response
- Master tables track companies and survey responses

**Database Schema**:

```sql
-- Master Tables
CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    normalized_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE survey_responses (
    response_id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id),
    company_name TEXT NOT NULL,
    survey_year INTEGER NOT NULL,
    table_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Dynamic Response Tables (one per survey response)
CREATE TABLE survey_response_{response_id}_year_{year} (
    id SERIAL PRIMARY KEY,
    question_column TEXT NOT NULL,
    original_question TEXT NOT NULL,
    response_value TEXT,
    data_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**How it works**:
1. Reads Excel files for years 2021-2024
2. For each row:
   - Normalizes company name
   - Creates/retrieves company_id
   - Creates unique response_id
   - Generates table `survey_response_{response_id}_year_{year}`
   - Stores only non-null questions and answers as key-value pairs
   - Registers response in `survey_responses` metadata table
3. Saves SQL to individual `.txt` files in `C:\Users\almul\Downloads\Migration TXTs`

**Run the script**:
```bash
python datamigration.py
```

### 2. Network Page (`src/pages/Network.tsx`)

**New UI Flow**:
1. **Landing Page**: Shows all survey years as cards (2021, 2022, 2023, 2024)
2. **Year Selection**: Click a year to see all companies that responded that year
3. **Company View**: Click a company to view their survey responses

**Key Features**:
- Year-first navigation (toggle between years)
- Company list within each year
- Stats showing: Total Responses, Survey Years, Companies, Current View
- "Back to All Years" button when viewing a specific year
- Each company card shows:
  - Company name
  - Response ID
  - Company ID
  - Submission date
  - "View Responses" button

**Data Flow**:
```
survey_responses table
  ↓
Group by survey_year
  ↓
Display years → Select year → Display companies for that year
  ↓
Click company → Navigate to /survey-response/{response_id}
  ↓
Query survey_response_{response_id}_year_{year} table
  ↓
Display questions and answers
```

### 3. Future Enhancements

**Phase 1** (Current): ✅ Complete
- Independent response tables
- Year-based navigation
- Company tracking via normalized names

**Phase 2** (Next):
- Link same companies across different years
- Show company history (responses from 2021, 2022, 2023, 2024)
- Company profile page showing all their survey responses

**Phase 3** (Future):
- Email associations
- User authentication for survey respondents
- Edit/update survey responses

## File Structure

```
frontier-finance-nexus/
├── datamigration.py              # Main migration script
├── DATAMIGRATION_README.md       # Detailed documentation
├── MIGRATION_SUMMARY.md          # This file
├── requirements.txt              # Python dependencies
└── src/
    └── pages/
        └── Network.tsx           # Updated network page
```

## Next Steps

1. **Run the Python script** to generate SQL files
2. **Combine SQL files** using R script (or manually)
3. **Execute SQL** in Supabase SQL Editor
4. **Test the Network page** to ensure data displays correctly
5. **Create survey response detail page** at `/survey-response/:id`

## Notes

- Company names are normalized to handle variations (e.g., "ABC Corp" vs "ABC Corporation")
- Each response is independent (no email tracking yet)
- Future linking will connect same companies across years using `company_id`
- SQL files are saved individually for review before execution
