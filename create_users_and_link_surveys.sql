BEGIN;

-- Create users if they don't exist and link survey responses

-- 1. Create Lilian Mramba (Grassroots Business Fund) user if not exists
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) 
SELECT 
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'Lmramba@gbfund.org',
  crypt('temp_password_123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  json_build_object('first_name', 'Lilian', 'last_name', 'Mramba'),
  false
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'Lmramba@gbfund.org');

-- 2. Create Kalsoom Lakhani (i2i Ventures) user if not exists
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin
) 
SELECT 
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'klakhani@Invest2innovate.com',
  crypt('temp_password_123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  json_build_object('first_name', 'Kalsoom', 'last_name', 'Lakhani'),
  false
WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'klakhani@Invest2innovate.com');

-- 3. Add users to user_roles table if not exists
INSERT INTO public.user_roles (user_id, email, role)
SELECT 
  u.id,
  u.email,
  'member'::app_role
FROM auth.users u
WHERE u.email IN ('Lmramba@gbfund.org', 'klakhani@Invest2innovate.com')
AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.email = u.email);

-- 4. Update Grassroots Business Fund survey response with user_id
UPDATE public.survey_responses_2021 
SET user_id = (SELECT id FROM auth.users WHERE email = 'Lmramba@gbfund.org'),
    updated_at = NOW()
WHERE firm_name = 'Grassroots Business Fund' 
  AND participant_name = 'Lilian Mramba'
  AND user_id IS NULL;

-- 5. Update i2i Ventures survey response with user_id
UPDATE public.survey_responses_2021 
SET user_id = (SELECT id FROM auth.users WHERE email = 'klakhani@Invest2innovate.com'),
    updated_at = NOW()
WHERE firm_name = 'i2i Ventures' 
  AND participant_name = 'Kalsoom Lakhani'
  AND user_id IS NULL;

-- 6. Verify the updates
SELECT 
  'Verification' as check_type,
  firm_name,
  participant_name,
  user_id,
  CASE 
    WHEN user_id IS NOT NULL THEN 'LINKED' 
    ELSE 'NOT LINKED' 
  END as status
FROM public.survey_responses_2021 
WHERE firm_name IN ('Grassroots Business Fund', 'i2i Ventures')
ORDER BY firm_name;

COMMIT;
