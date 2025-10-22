-- Create 3 test users for testing purposes (one for each role)
-- These are separate from fund managers and are just for authentication testing

DO $$
DECLARE
  viewer_user_id UUID := gen_random_uuid();
  member_user_id UUID := gen_random_uuid();
  admin_user_id UUID := gen_random_uuid();
BEGIN
  -- Delete test users if they already exist
  DELETE FROM auth.users WHERE email IN (
    'viewer.test@escpnetwork.net',
    'member.test@escpnetwork.net', 
    'admin.test@escpnetwork.net'
  );

  -- Create viewer test user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
  ) VALUES (
    viewer_user_id,
    '00000000-0000-0000-0000-000000000000',
    'viewer.test@escpnetwork.net',
    crypt('ViewerTest123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Viewer"}',
    false,
    'authenticated',
    'authenticated'
  );

  -- Create member test user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
  ) VALUES (
    member_user_id,
    '00000000-0000-0000-0000-000000000000',
    'member.test@escpnetwork.net',
    crypt('MemberTest123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Member"}',
    false,
    'authenticated',
    'authenticated'
  );

  -- Create admin test user
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role,
    aud
  ) VALUES (
    admin_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin.test@escpnetwork.net',
    crypt('AdminTest123!', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Test Admin"}',
    false,
    'authenticated',
    'authenticated'
  );

  -- Update user_roles to correct roles (trigger creates them as 'viewer' by default)
  UPDATE public.user_roles SET role = 'viewer' WHERE user_id = viewer_user_id;
  UPDATE public.user_roles SET role = 'member' WHERE user_id = member_user_id;
  UPDATE public.user_roles SET role = 'admin' WHERE user_id = admin_user_id;

  -- Update user_profiles to correct roles
  UPDATE public.user_profiles SET user_role = 'viewer' WHERE id = viewer_user_id;
  UPDATE public.user_profiles SET user_role = 'member' WHERE id = member_user_id;
  UPDATE public.user_profiles SET user_role = 'admin' WHERE id = admin_user_id;

  RAISE NOTICE 'Test users created successfully!';
  RAISE NOTICE 'Viewer: viewer.test@escpnetwork.net / ViewerTest123!';
  RAISE NOTICE 'Member: member.test@escpnetwork.net / MemberTest123!';
  RAISE NOTICE 'Admin: admin.test@escpnetwork.net / AdminTest123!';
END $$;

SELECT 
  'Test users created. Login credentials:' as status,
  'viewer.test@escpnetwork.net / ViewerTest123!' as viewer,
  'member.test@escpnetwork.net / MemberTest123!' as member,
  'admin.test@escpnetwork.net / AdminTest123!' as admin;