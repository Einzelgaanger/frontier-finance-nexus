BEGIN;

-- Check if user_roles table exists and modify it accordingly
DO $$
BEGIN
    -- If table doesn't exist, create it
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_roles' AND table_schema = 'public') THEN
        CREATE TABLE public.user_roles (
            id SERIAL PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'viewer',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Table exists, add missing columns if they don't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'user_id' AND table_schema = 'public') THEN
            ALTER TABLE public.user_roles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'email' AND table_schema = 'public') THEN
            -- First add the column as nullable
            ALTER TABLE public.user_roles ADD COLUMN email TEXT;
            
            -- Populate email values from auth.users
            UPDATE public.user_roles 
            SET email = auth.users.email 
            FROM auth.users 
            WHERE public.user_roles.user_id = auth.users.id;
            
            -- Now add the NOT NULL and UNIQUE constraints
            ALTER TABLE public.user_roles ALTER COLUMN email SET NOT NULL;
            ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_email_unique UNIQUE (email);
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'role' AND table_schema = 'public') THEN
            ALTER TABLE public.user_roles ADD COLUMN role app_role NOT NULL DEFAULT 'viewer'::app_role;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'created_at' AND table_schema = 'public') THEN
            ALTER TABLE public.user_roles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'updated_at' AND table_schema = 'public') THEN
            ALTER TABLE public.user_roles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        END IF;
    END IF;
END $$;

-- Insert all existing users from auth.users with their roles
INSERT INTO public.user_roles (user_id, email, role) 
SELECT 
    u.id,
    u.email,
    CASE 
        WHEN u.email IN (
            'ambar@amleh.com', 'ali@alsuhail.com', 'cathy@goddard.com', 
            'chai@musoni.com', 'dayo@koleowo.com', 'jaap@verboom.com',
            'jason@musyoka.com', 'jenny@ahlzen.com', 'josh@bicknell.com',
            'lavanya@anand.com', 'lisbeth@zacho.com', 'olivier@furdelle.com',
            'owen@harmon.com', 'shiva@shanker.com', 'tony@kinyungu.com',
            'valerie@fraser.com', 'william@prothais.com'
        ) THEN 'member'::app_role
        ELSE 'viewer'::app_role
    END as role
FROM auth.users u
WHERE u.email IS NOT NULL
ON CONFLICT (email) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    role = EXCLUDED.role,
    updated_at = NOW();

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_email ON public.user_roles(email);

-- Create an index on role for filtering
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Create a function to automatically add new users to user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'viewer'::app_role);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically add new users to user_roles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMIT;
