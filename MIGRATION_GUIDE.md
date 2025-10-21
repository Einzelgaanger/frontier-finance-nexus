# Survey Data Migration Guide

## Overview
This guide helps you migrate existing survey responses from external sources (CSV, Excel, Google Forms, etc.) into your Supabase database.

---

## Migration Approaches

### Approach 1: CSV/Excel Import (Recommended for bulk data)
### Approach 2: Manual SQL INSERT (For small datasets)
### Approach 3: API-based Import (For programmatic migration)

---

## Prerequisites

### 1. Data Preparation Checklist
- [ ] All survey responses exported to CSV/Excel
- [ ] Email addresses are consistent across surveys
- [ ] Date fields are in consistent format (YYYY-MM-DD or ISO format)
- [ ] Array fields (like sectors, markets) are formatted consistently
- [ ] JSONB fields are valid JSON

### 2. User Account Requirements
- [ ] Decide: Create new accounts or use existing?
- [ ] Collect: Email, First Name, Last Name for each respondent
- [ ] Determine: Initial role (viewer/member) for each user

---

## Step-by-Step Migration Process

### Phase 1: Prepare User Accounts

#### Option A: Users Already Exist in Supabase
Skip to Phase 2.

#### Option B: Create Users First
You need to create auth accounts for each email. Use the Supabase Admin API or Edge Functions.

**Important:** You'll need user UUIDs to link survey responses.

---

### Phase 2: Data Format Mapping

#### Understanding Field Types

**Text Fields:**
```csv
"Simple text value"
```

**Array Fields (TEXT[]):**
```csv
"{""Option 1"",""Option 2"",""Option 3""}"
```
Or in some CSV formats:
```csv
"['Option 1','Option 2','Option 3']"
```

**JSONB Fields:**
```csv
"{""key1"": ""value1"", ""key2"": 5}"
```

**Numeric Fields:**
```csv
1000000
```
(No quotes, no commas)

**Boolean Fields:**
```csv
true
false
```

**Date/Timestamp Fields:**
```csv
"2024-01-15"
"2024-01-15 14:30:00+00"
```

---

### Phase 3: Create Mapping Template

I'll create a template for each survey year that shows:
1. Database column name
2. Expected data type
3. Example value
4. Validation rules

---

## Common Data Transformation Issues

### Issue 1: "Other" Fields
**Problem:** Survey has "Other (please specify)" options
**Solution:** Map to both the array field AND the `_other` text field

Example:
- `geographic_markets` = `{Africa, Asia, "Other"}`
- `geographic_markets_other` = `"Southeast Asia specifically"`

### Issue 2: Multi-select Questions
**Problem:** Multiple checkboxes selected
**Solution:** Store as PostgreSQL array

CSV format:
```csv
"{""Agriculture"",""Healthcare"",""Education""}"
```

### Issue 3: Ranking Questions (JSONB)
**Problem:** User ranked options 1-5
**Solution:** Store as JSON object

CSV format:
```csv
"{""Option A"": 1, ""Option B"": 3, ""Option C"": 2}"
```

### Issue 4: Missing User IDs
**Problem:** You have emails but no user_id UUIDs
**Solution:** Use email lookup query

```sql
-- Get user_id from email
SELECT id FROM auth.users WHERE email = 'user@example.com';
```

---

## Migration Scripts

I'll create separate migration scripts for:
1. User account creation
2. 2021 survey import
3. 2022 survey import
4. 2023 survey import
5. 2024 survey import

Each script will include:
- Data validation
- Duplicate detection
- Error handling
- Rollback capability

---

## Data Validation Rules

### Required Fields by Survey

**2021 Survey:**
- email (for user lookup)
- firm_name
- participant_name
- role_title
- team_based (array)
- geographic_focus (array)
- fund_stage
- legal_entity_date
- first_close_date
- first_investment_date

**2022 Survey:**
- email
- name
- role_title
- organisation
- legal_entity_date
- first_close_date
- first_investment_date

**2023 Survey:**
- email_address
- organisation_name
- funds_raising_investing
- fund_name
- geographic_markets (array)
- team_based (array)
- gender_inclusion (array)
- team_experience_investments (jsonb)
- team_experience_exits (jsonb)

**2024 Survey:**
- email_address
- organisation_name
- funds_raising_investing
- fund_name
- geographic_markets (array)
- team_based (array)
- gender_inclusion (array)

---

## Next Steps

Please provide:

1. **Sample of your data** (even just 2-3 rows with headers)
2. **Format** (CSV, Excel, Google Sheets, JSON)
3. **Which survey years** you have data for
4. **Approximate number of responses** per survey

Then I can create:
- Exact column mapping templates
- Custom migration SQL scripts
- Data transformation scripts (if needed)
- Validation queries

---

## Quick Start: Manual Migration Template

If you have a small dataset (< 50 responses), you can use manual SQL inserts.

### Template for 2024 Survey:

```sql
-- Step 1: Get user_id from email
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Find or create user
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'respondent@example.com';
  
  -- If user doesn't exist, you need to create them first via Supabase Admin API
  
  -- Step 2: Insert survey response
  INSERT INTO public.survey_responses_2024 (
    user_id,
    email_address,
    organisation_name,
    funds_raising_investing,
    fund_name,
    geographic_markets,
    team_based,
    -- ... add all other fields
    created_at,
    completed_at
  ) VALUES (
    v_user_id,
    'respondent@example.com',
    'Example Fund',
    'Both',
    'Example Impact Fund I',
    ARRAY['East Africa', 'West Africa'],
    ARRAY['Kenya', 'Nigeria'],
    -- ... add all other values
    NOW(),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    -- Update if already exists
    updated_at = NOW();
END $$;
```

---

## Support

After you provide your data format, I'll create:
1. Custom migration scripts
2. Data validation queries
3. Rollback procedures
4. Testing checklist
