# Network Page - Individual Survey Tables Approach

## Problem
The current `ViewerNetworkPage` component tries to query consolidated tables like `survey_responses_2024`, but your database uses individual response tables like `survey_response_1_year_2024`, `survey_response_2_year_2024`, etc.

## Database Structure

Each survey response is stored in its own table with this structure:
```
survey_response_{ID}_year_{YEAR}
```

Each table has 6 columns:
- `id` (integer)
- `question_column` (text) - question identifier
- `original_question` (text) - full question text
- `response_value` (text) - the answer
- `data_type` (text)
- `created_at` (timestamp)

## New Approach Required

### 1. Query Strategy
Instead of querying one consolidated table, you need to:
1. Loop through response IDs (1-200 for each year)
2. Query each `survey_response_{i}_year_{year}` table
3. Pivot the question-answer rows into a single record per company
4. Extract company info from specific questions

### 2. Key Questions to Extract
From the pivoted responses, look for these fields:
- `email_address` or `email` - contact email
- `organisation_name` or `organization_name` or `company_name` - company name
- `participant_name` or `contact_name` or `full_name` - contact person
- `geographic_markets` or `geo_markets` - geographic focus

### 3. Implementation

The new component (`ViewerNetworkPageNew.tsx`) has been created with:

**Key Functions:**
- `querySurveyResponseTable()` - Query a single response table
- `pivotResponses()` - Convert rows to key-value object
- `extractCompanyProfile()` - Extract company info from responses
- `fetchCompanies()` - Loop through all response tables for a year

**Process Flow:**
```
1. User selects year (e.g., 2024)
2. Loop i from 1 to 200
3. For each i, query `survey_response_{i}_year_2024`
4. If table exists and has data:
   a. Pivot rows to {question: answer} object
   b. Extract company info (email, name, etc.)
   c. Add to companies array
5. Display all companies found
```

### 4. Performance Optimization

The component processes tables in batches of 20 to avoid overwhelming the database:
```typescript
const batchSize = 20;
for (let i = 0; i < promises.length; i += batchSize) {
  const batch = promises.slice(i, i + batchSize);
  await Promise.all(batch);
}
```

### 5. RLS Policies Needed

You'll need to create RLS policies for the individual response tables:

```sql
-- Allow viewers, members, and admins to read all survey response tables
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'survey_response_%_year_%'
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "Allow authenticated users to view" ON public.%I;
      CREATE POLICY "Allow authenticated users to view" 
        ON public.%I
        FOR SELECT 
        USING (auth.role() = ''authenticated'');
    ', table_name, table_name);
  END LOOP;
END $$;
```

Or more restrictive (only for specific roles):

```sql
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'survey_response_%_year_%'
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "Allow viewers members admins" ON public.%I;
      CREATE POLICY "Allow viewers members admins" 
        ON public.%I
        FOR SELECT 
        USING (public.get_user_role(auth.uid()) IN (''admin'', ''member'', ''viewer''));
    ', table_name, table_name);
  END LOOP;
END $$;
```

## Next Steps

1. **Apply RLS Policies** - Run the SQL above in Supabase SQL Editor
2. **Replace Component** - Copy `ViewerNetworkPageNew.tsx` content to `ViewerNetworkPage.tsx`
3. **Test** - Refresh browser and check console logs
4. **Adjust Field Names** - Based on actual data, you may need to adjust the field name mappings in `extractCompanyProfile()`

## File Locations

- **New Component**: `src/components/network/ViewerNetworkPageNew.tsx` ✅ Created
- **Old Component**: `src/components/network/ViewerNetworkPage.tsx` (needs replacement)
- **Migration**: `supabase/migrations/20251020000001_allow_viewers_members_see_all_surveys.sql` (for consolidated tables - not needed if using individual tables)

## Testing

After implementation, check console for:
```
Fetching companies for year 2024
Processed batch 1, found X companies so far
Processed batch 2, found X companies so far
...
Found X companies for year 2024
```

If you see "Found 0 companies", check:
1. RLS policies are applied
2. Tables actually exist (`survey_response_*_year_2024`)
3. Tables have data
4. Field name mappings are correct
