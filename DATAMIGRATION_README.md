# Dynamic Survey Data Migration

## Overview

This migration script creates **independent tables for each survey response** with questions and answers stored as key-value pairs. Each row in the Excel file becomes its own table, making it easy to display unique responses per company per year.

## Key Features

✅ **Smart Company Matching**: Normalizes company names across years (handles "ABC Corp" vs "ABC Corp." vs "abc corporation")  
✅ **Independent Response Tables**: Each survey response gets its own table  
✅ **Null Skipping**: Only stores columns where the respondent provided an answer  
✅ **Data Type Inference**: Automatically detects INTEGER, BOOLEAN, NUMERIC, TIMESTAMP, or TEXT  
✅ **SQL File Generation**: Generates individual SQL files for each response  
✅ **No Email Tracking**: Responses are independent of email addresses  

## Database Schema

### Master Tables

#### `companies`

```sql
company_id          SERIAL PRIMARY KEY
company_name        TEXT NOT NULL
normalized_name     TEXT NOT NULL UNIQUE
created_at          TIMESTAMP
```

#### `survey_responses`

```sql
response_id         SERIAL PRIMARY KEY
company_id          INTEGER REFERENCES companies(company_id)
company_name        TEXT NOT NULL
survey_year         INTEGER NOT NULL
table_name          TEXT NOT NULL
created_at          TIMESTAMP
```

### Dynamic Response Tables

For each survey response, a table is created:

**Table Name**: `survey_response_{response_id}_year_{year}`

**Structure**:

```sql
id                  SERIAL PRIMARY KEY
question_column     TEXT NOT NULL
original_question   TEXT NOT NULL
response_value      TEXT
data_type           TEXT
created_at          TIMESTAMP
```

**Example**: Response ID 42 for 2023 survey → `survey_response_42_year_2023`

## Survey File Configuration

The script processes these Excel files:

| Year | File Path | Company Column |
|------|-----------|----------------|
| 2021 | `C:\Users\almul\Downloads\CFF2021.xlsx` | `1. Name of firm` |
| 2022 | `C:\Users\almul\Downloads\CFF2022.xlsx` | `Name of organisation` |
| 2023 | `C:\Users\almul\Downloads\CFF2023.xlsx` | `Name of organisation` |
| 2024 | `C:\Users\almul\Downloads\CFF2024.xlsx` | `Name of your organization` |

## Installation

1. **Install Dependencies**:
```bash
pip install pandas openpyxl supabase python-dotenv
```

2. **Configure Environment Variables**:

Create/update `.env` file:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

3. **Verify Excel Files**:

Ensure all Excel files exist at the paths specified in `SURVEY_CONFIGS`.

## Usage

### Run Migration

```bash
python datamigration.py
```

### What Happens

1. **Connects to Supabase** using credentials from `.env`
2. **Creates master tables** (`companies`, `survey_responses`)
3. **Processes each survey year** (2021-2024):
   - Reads Excel file
   - For each row:
     - Normalizes company name
     - Gets or creates company record
     - Identifies non-null columns
     - Creates custom table for that company's year
     - Inserts question-answer pairs
     - Registers survey in metadata table
4. **Generates SQL file** with all executed statements
5. **Logs everything** to `datamigration.log`

### Output Files

- **`migration_output_YYYYMMDD_HHMMSS.sql`**: Complete SQL migration script
- **`datamigration.log`**: Detailed execution log

## Example Workflow

### Input (Excel Row)
```
Company: "ABC Corporation"
Email: "john@abc.com"
Question 1: "What is your revenue?" → "$1M"
Question 2: "Number of employees?" → "50"
Question 3: "Industry sector?" → (empty)
Question 4: "Year founded?" → "2010"
```

### What Gets Created

1. **Company Record**:
```sql
INSERT INTO companies (company_name, normalized_name, primary_email)
VALUES ('ABC Corporation', 'abc corporation', 'john@abc.com');
-- Returns company_id = 1
```

2. **Dynamic Table**:
```sql
CREATE TABLE survey_company_1_year_2023 (
    response_id SERIAL PRIMARY KEY,
    company_id INTEGER NOT NULL,
    question_column TEXT NOT NULL,
    original_question TEXT NOT NULL,
    response_value TEXT,
    data_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

3. **Response Data** (Note: Question 3 is skipped because it's empty):
```sql
INSERT INTO survey_company_1_year_2023 (company_id, question_column, original_question, response_value, data_type)
VALUES 
    (1, 'question_1', 'What is your revenue?', '$1M', 'TEXT'),
    (1, 'question_2', 'Number of employees?', '50', 'INTEGER'),
    (1, 'year_founded', 'Year founded?', '2010', 'INTEGER');
```

4. **Metadata Registration**:
```sql
INSERT INTO survey_responses (company_id, survey_year, table_name, submitted_by_email)
VALUES (1, 2023, 'survey_company_1_year_2023', 'john@abc.com');
```

## Frontend Integration

### Get All Companies
```javascript
const { data: companies } = await supabase
  .from('companies')
  .select('*')
  .order('company_name');
```

### Get Company's Survey Years
```javascript
const { data: surveys } = await supabase
  .from('survey_responses')
  .select('*')
  .eq('company_id', companyId)
  .order('survey_year', { ascending: false });
```

### Get Specific Survey Responses
```javascript
// For company_id=1, year=2023, table_name='survey_company_1_year_2023'
const { data: responses } = await supabase
  .from('survey_company_1_year_2023')
  .select('*')
  .eq('company_id', 1);

// Returns:
// [
//   { question_column: 'question_1', original_question: 'What is your revenue?', response_value: '$1M', data_type: 'TEXT' },
//   { question_column: 'question_2', original_question: 'Number of employees?', response_value: '50', data_type: 'INTEGER' },
//   { question_column: 'year_founded', original_question: 'Year founded?', response_value: '2010', data_type: 'INTEGER' }
// ]
```

### Dynamic Query Example
```javascript
async function getSurveyResponses(companyId, year) {
  // Get table name from metadata
  const { data: metadata } = await supabase
    .from('survey_responses')
    .select('table_name')
    .eq('company_id', companyId)
    .eq('survey_year', year)
    .single();
  
  if (!metadata) return null;
  
  // Query the dynamic table
  const { data: responses } = await supabase
    .from(metadata.table_name)
    .select('*')
    .eq('company_id', companyId);
  
  return responses;
}
```

## Company Name Normalization

The script normalizes company names to match across years:

| Original | Normalized |
|----------|------------|
| "ABC Corporation Ltd." | "abc corporation" |
| "ABC Corp" | "abc corporation" |
| "ABC  Corp." | "abc corporation" |
| "Xyz Holdings LLC" | "xyz" |

**Normalization Steps**:
1. Convert to lowercase
2. Remove unicode accents
3. Remove company suffixes (Ltd, Inc, Corp, LLC, PLC, etc.)
4. Remove special characters
5. Trim whitespace

## Data Type Inference

| Value | Inferred Type |
|-------|---------------|
| `50` | INTEGER |
| `3.14` | NUMERIC |
| `true`, `yes`, `Y` | BOOLEAN |
| `2023-01-15` | TIMESTAMP |
| `"Hello"` | TEXT |
| `null`, `""`, `"N/A"` | Skipped |

## Troubleshooting

### Issue: "Company column not found"
**Solution**: Check that Excel files have the correct column names as specified in `SURVEY_CONFIGS`.

### Issue: "Failed to connect to Supabase"
**Solution**: Verify `.env` file has correct `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.

### Issue: "Permission denied on table"
**Solution**: Ensure service role key has admin privileges. Check RLS policies.

### Issue: "Excel file not found"
**Solution**: Update file paths in `SURVEY_CONFIGS` to match your system.

## Logs

Check `datamigration.log` for detailed execution information:
- Companies created/matched
- Tables created
- Rows processed/skipped
- Errors and warnings

## Next Steps

After migration:
1. Review generated SQL file
2. Check `datamigration.log` for any errors
3. Verify data in Supabase dashboard
4. Update frontend to query dynamic tables
5. Implement company/survey browsing UI

## Notes

- **One email per company**: The first email encountered for a company becomes the primary contact
- **Same company, different years**: Creates separate tables (e.g., `survey_company_1_year_2021`, `survey_company_1_year_2022`)
- **No duplicate surveys**: `UNIQUE(company_id, survey_year)` constraint prevents duplicates
- **SQL backup**: All operations are saved to SQL file for audit/rollback

## Support

For issues or questions, check:
1. `datamigration.log` for error details
2. Generated SQL file for executed statements
3. Supabase dashboard for table structure
