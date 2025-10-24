-- Update blogs RLS policies to allow all authenticated users
DROP POLICY IF EXISTS "Members can create their own blogs" ON blogs;
DROP POLICY IF EXISTS "Members can view all published blogs" ON blogs;
DROP POLICY IF EXISTS "Users can create their own blogs" ON blogs;
DROP POLICY IF EXISTS "Users can view all published blogs" ON blogs;

-- Allow all authenticated users to create their own blogs
CREATE POLICY "Users can create their own blogs"
ON blogs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow all authenticated users to view published blogs
CREATE POLICY "Users can view all published blogs"
ON blogs FOR SELECT
TO authenticated
USING (is_published = true);