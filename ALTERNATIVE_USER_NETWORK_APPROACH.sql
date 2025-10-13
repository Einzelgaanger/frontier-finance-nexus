-- =====================================================
-- ALTERNATIVE APPROACH: CREATE NETWORK_USERS TABLE
-- =====================================================
-- Since user_backup contains users not in auth.users,
-- we'll create a separate table for network display
-- =====================================================

-- Option 1: Create a new table for network users (no foreign key constraint)
CREATE TABLE IF NOT EXISTS public.network_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Can be null since these might not be real auth users
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Option 2: Copy all data from user_backup to network_users
INSERT INTO public.network_users (
    user_id,
    email,
    first_name,
    last_name,
    role,
    created_at
)
SELECT 
    ub.id as user_id,
    COALESCE(ub.email, 'no-email@example.com') as email,
    ub.first_name,
    ub.last_name,
    COALESCE(ub.role, 'viewer') as role,
    COALESCE(ub.created_at, NOW()) as created_at
FROM public.user_backup ub
WHERE ub.id IS NOT NULL;

-- Option 3: Enable RLS for network_users
ALTER TABLE public.network_users ENABLE ROW LEVEL SECURITY;

-- Option 4: Create policy for members to view network users
CREATE POLICY "Members can view network users"
ON public.network_users
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() 
        AND role IN ('member', 'admin')
    )
);

-- Option 5: Verify the data transfer
SELECT 
    'user_backup' as source_table,
    COUNT(*) as record_count
FROM public.user_backup
UNION ALL
SELECT 
    'network_users' as target_table,
    COUNT(*) as record_count
FROM public.network_users;

-- Option 6: Show sample of transferred data
SELECT 
    id,
    email,
    first_name,
    last_name,
    role,
    created_at
FROM public.network_users
ORDER BY created_at DESC
LIMIT 10;
