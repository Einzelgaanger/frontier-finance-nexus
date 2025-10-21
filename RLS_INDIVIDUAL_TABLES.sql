-- ============================================================================
-- CREATE RLS POLICIES FOR INDIVIDUAL SURVEY RESPONSE TABLES
-- ============================================================================
-- This allows all authenticated users to view individual survey response tables
-- ============================================================================

-- Create a function to apply policies to all survey response tables
DO $$
DECLARE
  table_record RECORD;
  policy_count INTEGER := 0;
BEGIN
  -- Loop through all tables matching the pattern
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'survey_response_%_year_%'
  LOOP
    -- Enable RLS if not already enabled
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', table_record.tablename);
    
    -- Drop existing policy if it exists
    EXECUTE format('DROP POLICY IF EXISTS "Allow authenticated users to view" ON public.%I;', table_record.tablename);
    
    -- Create new permissive policy
    EXECUTE format('
      CREATE POLICY "Allow authenticated users to view" 
        ON public.%I
        FOR SELECT 
        TO authenticated
        USING (true);
    ', table_record.tablename);
    
    policy_count := policy_count + 1;
  END LOOP;
  
  RAISE NOTICE 'Created policies for % tables', policy_count;
END $$;

-- Verify policies were created
SELECT 
  COUNT(*) as total_policies,
  'Policies created successfully' as status
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename LIKE 'survey_response_%_year_%'
  AND policyname = 'Allow authenticated users to view';
