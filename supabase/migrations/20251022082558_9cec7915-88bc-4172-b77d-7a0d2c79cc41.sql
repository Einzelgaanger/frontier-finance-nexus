-- Create blog-media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true);

-- Create policies for blog-media bucket
CREATE POLICY "Anyone can view blog media"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-media');

CREATE POLICY "Members can upload blog media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'blog-media' 
  AND auth.uid() = (storage.foldername(name))[1]::uuid
  AND EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role IN ('member', 'admin')
  )
);

CREATE POLICY "Users can update their own blog media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'blog-media' 
  AND auth.uid() = (storage.foldername(name))[1]::uuid
);

CREATE POLICY "Users can delete their own blog media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'blog-media' 
  AND auth.uid() = (storage.foldername(name))[1]::uuid
);