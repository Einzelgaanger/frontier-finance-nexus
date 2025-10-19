-- =====================================================
-- COMPLETE NEW USER INTEGRATION SYSTEM
-- =====================================================
-- This script ensures new users are properly integrated into all tables
-- and can access all features including network and profile pages
-- =====================================================

-- Step 1: Update the existing handle_new_user function to include all tables
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User')
  );
  
  -- Assign default viewer role
  INSERT INTO public.user_roles (user_id, role, email)
  VALUES (NEW.id, 'viewer', NEW.email);
  
  -- Add to network_users table so they appear in network page
  INSERT INTO public.network_users (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User'),
    'viewer'
  );
  
  -- Create user profile for profile page access
  INSERT INTO public.user_profiles (user_id, email, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)) || ' ' ||
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'User')
  );
  
  -- Log the registration
  INSERT INTO public.activity_logs (user_id, action, details)
  VALUES (NEW.id, 'user_registered', jsonb_build_object('email', NEW.email));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Ensure the trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Create a function to manually integrate existing users
CREATE OR REPLACE FUNCTION public.integrate_existing_users()
RETURNS JSON AS $$
DECLARE
  user_record RECORD;
  integrated_count INTEGER := 0;
  error_count INTEGER := 0;
BEGIN
  -- Loop through all users in auth.users who don't have network_users entries
  FOR user_record IN 
    SELECT au.id, au.email, au.raw_user_meta_data
    FROM auth.users au
    LEFT JOIN public.network_users nu ON au.id = nu.user_id
    WHERE nu.user_id IS NULL
  LOOP
    BEGIN
      -- Add to network_users
      INSERT INTO public.network_users (user_id, email, first_name, last_name, role)
      VALUES (
        user_record.id,
        user_record.email,
        COALESCE(user_record.raw_user_meta_data->>'first_name', split_part(user_record.email, '@', 1)),
        COALESCE(user_record.raw_user_meta_data->>'last_name', 'User'),
        COALESCE((SELECT role FROM public.user_roles WHERE user_id = user_record.id), 'viewer')
      );
      
      -- Add to user_profiles if not exists
      INSERT INTO public.user_profiles (user_id, email, company_name)
      VALUES (
        user_record.id,
        user_record.email,
        COALESCE(user_record.raw_user_meta_data->>'first_name', split_part(user_record.email, '@', 1)) || ' ' ||
        COALESCE(user_record.raw_user_meta_data->>'last_name', 'User')
      )
      ON CONFLICT (user_id) DO NOTHING;
      
      integrated_count := integrated_count + 1;
      
    EXCEPTION WHEN OTHERS THEN
      error_count := error_count + 1;
      RAISE NOTICE 'Error integrating user %: %', user_record.email, SQLERRM;
    END;
  END LOOP;
  
  RETURN json_build_object(
    'success', true,
    'integrated_count', integrated_count,
    'error_count', error_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION public.integrate_existing_users() TO authenticated;

-- Step 5: Run the integration for existing users
SELECT public.integrate_existing_users();

-- Step 6: Verify the integration
SELECT 
  'auth.users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'profiles' as table_name,
  COUNT(*) as count
FROM public.profiles
UNION ALL  
SELECT
  'user_roles' as table_name,
  COUNT(*) as count
FROM public.user_roles
UNION ALL
SELECT 
  'network_users' as table_name,
  COUNT(*) as count
FROM public.network_users
UNION ALL
SELECT 
  'user_profiles' as table_name,
  COUNT(*) as count
FROM public.user_profiles;

-- Step 7: Show sample of integrated users
SELECT 
  'Sample integrated users:' as status,
  nu.email,
  nu.first_name,
  nu.last_name,
  nu.role,
  up.company_name
FROM public.network_users nu
LEFT JOIN public.user_profiles up ON nu.user_id = up.user_id
LIMIT 5;
