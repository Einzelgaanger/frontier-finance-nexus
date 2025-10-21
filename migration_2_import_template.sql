-- ============================================
-- MIGRATION STEP 2: SURVEY DATA IMPORT TEMPLATE
-- ============================================
-- This is a template for importing survey responses
-- Customize for each survey year (2021, 2022, 2023, 2024)
-- ============================================

-- ============================================
-- PREPARATION: Create temporary staging table
-- ============================================
-- This allows you to import CSV data first, then transform it

CREATE TEMP TABLE IF NOT EXISTS staging_survey_2024 (
  -- Contact/Identification
  email_address TEXT,
  
  -- Basic Information
  organisation_name TEXT,
  funds_raising_investing TEXT,
  fund_name TEXT,
  
  -- Timeline (can be TEXT initially, convert later)
  legal_entity_achieved TEXT,
  first_close_achieved TEXT,
  first_investment_achieved TEXT,
  
  -- Arrays (import as TEXT, convert to array later)
  investment_networks TEXT,
  investment_networks_other TEXT,
  geographic_markets TEXT,
  geographic_markets_other TEXT,
  team_based TEXT,
  team_based_other TEXT,
  investment_approval TEXT,
  investment_approval_other TEXT,
  gender_inclusion TEXT,
  gender_inclusion_other TEXT,
  
  -- Numeric fields
  fte_staff_2023_actual TEXT,  -- Import as TEXT, convert to INTEGER
  fte_staff_current TEXT,
  fte_staff_2025_forecast TEXT,
  principals_total TEXT,
  principals_women TEXT,
  
  -- JSONB fields (import as TEXT, validate and convert)
  team_experience_investments TEXT,
  team_experience_exits TEXT,
  
  -- Add more fields as needed based on your CSV structure
  -- ...
  
  -- Metadata
  completed_at TEXT
);

-- ============================================
-- STEP 1: Import CSV data into staging table
-- ============================================
-- Use Supabase Dashboard or psql to import CSV:
-- 
-- In Supabase Dashboard:
-- 1. Go to Table Editor
-- 2. Select staging_survey_2024
-- 3. Click "Insert" > "Import data from CSV"
-- 4. Upload your CSV file
--
-- Or use psql:
-- \copy staging_survey_2024 FROM 'path/to/your/file.csv' WITH (FORMAT csv, HEADER true, DELIMITER ',');

-- ============================================
-- STEP 2: Data validation and cleanup
-- ============================================

-- Check for missing required fields
SELECT 
  email_address,
  organisation_name,
  fund_name,
  CASE 
    WHEN email_address IS NULL OR email_address = '' THEN 'Missing email'
    WHEN organisation_name IS NULL OR organisation_name = '' THEN 'Missing organisation'
    WHEN fund_name IS NULL OR fund_name = '' THEN 'Missing fund name'
    ELSE 'OK'
  END as validation_status
FROM staging_survey_2024
WHERE email_address IS NULL OR email_address = '' 
   OR organisation_name IS NULL OR organisation_name = ''
   OR fund_name IS NULL OR fund_name = '';

-- Check for emails that don't have user accounts
SELECT DISTINCT s.email_address
FROM staging_survey_2024 s
LEFT JOIN auth.users u ON LOWER(TRIM(s.email_address)) = LOWER(u.email)
WHERE u.id IS NULL;

-- If any emails are missing, you need to create those user accounts first!

-- ============================================
-- STEP 3: Transform and insert data
-- ============================================

DO $$
DECLARE
  staging_record RECORD;
  v_user_id UUID;
  v_array_temp TEXT[];
  v_jsonb_temp JSONB;
BEGIN
  -- Loop through staging records
  FOR staging_record IN SELECT * FROM staging_survey_2024
  LOOP
    -- Get user_id from email
    SELECT id INTO v_user_id 
    FROM auth.users 
    WHERE LOWER(email) = LOWER(TRIM(staging_record.email_address));
    
    IF v_user_id IS NULL THEN
      RAISE WARNING 'User not found for email: %. Skipping.', staging_record.email_address;
      CONTINUE;
    END IF;
    
    -- Check if response already exists
    IF EXISTS (SELECT 1 FROM public.survey_responses_2024 WHERE user_id = v_user_id) THEN
      RAISE NOTICE 'Survey response already exists for: %. Skipping.', staging_record.email_address;
      CONTINUE;
    END IF;
    
    -- Insert survey response
    BEGIN
      INSERT INTO public.survey_responses_2024 (
        user_id,
        email_address,
        organisation_name,
        funds_raising_investing,
        fund_name,
        
        -- Timeline fields
        legal_entity_achieved,
        first_close_achieved,
        first_investment_achieved,
        
        -- Array fields (convert from comma-separated text)
        investment_networks,
        investment_networks_other,
        geographic_markets,
        geographic_markets_other,
        team_based,
        team_based_other,
        investment_approval,
        investment_approval_other,
        gender_inclusion,
        gender_inclusion_other,
        
        -- Numeric fields
        fte_staff_2023_actual,
        fte_staff_current,
        fte_staff_2025_forecast,
        principals_total,
        principals_women,
        
        -- JSONB fields
        team_experience_investments,
        team_experience_exits,
        
        -- Metadata
        created_at,
        updated_at,
        completed_at
      ) VALUES (
        v_user_id,
        TRIM(staging_record.email_address),
        TRIM(staging_record.organisation_name),
        TRIM(staging_record.funds_raising_investing),
        TRIM(staging_record.fund_name),
        
        -- Timeline
        NULLIF(TRIM(staging_record.legal_entity_achieved), ''),
        NULLIF(TRIM(staging_record.first_close_achieved), ''),
        NULLIF(TRIM(staging_record.first_investment_achieved), ''),
        
        -- Arrays: Convert comma-separated text to PostgreSQL array
        -- Format: "Option1,Option2,Option3" -> ARRAY['Option1','Option2','Option3']
        CASE 
          WHEN staging_record.investment_networks IS NOT NULL AND staging_record.investment_networks != '' 
          THEN string_to_array(staging_record.investment_networks, ',')
          ELSE ARRAY[]::TEXT[]
        END,
        NULLIF(TRIM(staging_record.investment_networks_other), ''),
        
        CASE 
          WHEN staging_record.geographic_markets IS NOT NULL AND staging_record.geographic_markets != '' 
          THEN string_to_array(staging_record.geographic_markets, ',')
          ELSE ARRAY[]::TEXT[]
        END,
        NULLIF(TRIM(staging_record.geographic_markets_other), ''),
        
        CASE 
          WHEN staging_record.team_based IS NOT NULL AND staging_record.team_based != '' 
          THEN string_to_array(staging_record.team_based, ',')
          ELSE ARRAY[]::TEXT[]
        END,
        NULLIF(TRIM(staging_record.team_based_other), ''),
        
        CASE 
          WHEN staging_record.investment_approval IS NOT NULL AND staging_record.investment_approval != '' 
          THEN string_to_array(staging_record.investment_approval, ',')
          ELSE ARRAY[]::TEXT[]
        END,
        NULLIF(TRIM(staging_record.investment_approval_other), ''),
        
        CASE 
          WHEN staging_record.gender_inclusion IS NOT NULL AND staging_record.gender_inclusion != '' 
          THEN string_to_array(staging_record.gender_inclusion, ',')
          ELSE ARRAY[]::TEXT[]
        END,
        NULLIF(TRIM(staging_record.gender_inclusion_other), ''),
        
        -- Numeric conversions
        CASE 
          WHEN staging_record.fte_staff_2023_actual ~ '^[0-9]+$' 
          THEN staging_record.fte_staff_2023_actual::INTEGER
          ELSE NULL
        END,
        CASE 
          WHEN staging_record.fte_staff_current ~ '^[0-9]+$' 
          THEN staging_record.fte_staff_current::INTEGER
          ELSE NULL
        END,
        CASE 
          WHEN staging_record.fte_staff_2025_forecast ~ '^[0-9]+$' 
          THEN staging_record.fte_staff_2025_forecast::INTEGER
          ELSE NULL
        END,
        CASE 
          WHEN staging_record.principals_total ~ '^[0-9]+$' 
          THEN staging_record.principals_total::INTEGER
          ELSE NULL
        END,
        CASE 
          WHEN staging_record.principals_women ~ '^[0-9]+$' 
          THEN staging_record.principals_women::INTEGER
          ELSE NULL
        END,
        
        -- JSONB conversions (validate JSON first)
        CASE 
          WHEN staging_record.team_experience_investments IS NOT NULL 
            AND staging_record.team_experience_investments != ''
            AND staging_record.team_experience_investments::TEXT ~ '^\{.*\}$'
          THEN staging_record.team_experience_investments::JSONB
          ELSE '{}'::JSONB
        END,
        CASE 
          WHEN staging_record.team_experience_exits IS NOT NULL 
            AND staging_record.team_experience_exits != ''
            AND staging_record.team_experience_exits::TEXT ~ '^\{.*\}$'
          THEN staging_record.team_experience_exits::JSONB
          ELSE '{}'::JSONB
        END,
        
        -- Metadata
        NOW(),
        NOW(),
        CASE 
          WHEN staging_record.completed_at IS NOT NULL AND staging_record.completed_at != ''
          THEN staging_record.completed_at::TIMESTAMPTZ
          ELSE NOW()
        END
      );
      
      RAISE NOTICE 'Imported survey response for: %', staging_record.email_address;
      
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error importing survey for %: %', staging_record.email_address, SQLERRM;
    END;
    
  END LOOP;
END $$;

-- ============================================
-- STEP 4: Verification
-- ============================================

-- Check imported records
SELECT 
  sr.email_address,
  sr.organisation_name,
  sr.fund_name,
  sr.created_at,
  p.first_name,
  p.last_name
FROM public.survey_responses_2024 sr
JOIN public.profiles p ON sr.user_id = p.id
ORDER BY sr.created_at DESC;

-- Count by completion status
SELECT 
  CASE 
    WHEN completed_at IS NOT NULL THEN 'Completed'
    ELSE 'Draft'
  END as status,
  COUNT(*) as count
FROM public.survey_responses_2024
GROUP BY status;

-- ============================================
-- STEP 5: Cleanup
-- ============================================

-- Drop staging table after successful import
-- DROP TABLE IF EXISTS staging_survey_2024;

-- ============================================
-- ROLLBACK (if needed)
-- ============================================
-- If something went wrong, you can delete imported records:
/*
DELETE FROM public.survey_responses_2024 
WHERE created_at > '2024-01-01'::TIMESTAMPTZ  -- Adjust date to your import time
  AND user_id IN (
    SELECT id FROM auth.users WHERE email IN (
      -- List emails from your import
      'user1@example.com',
      'user2@example.com'
    )
  );
*/
