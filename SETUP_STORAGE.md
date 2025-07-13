# Supabase Storage Setup Guide

## Fix for "Bucket not found" Error

The file upload feature requires a Supabase storage bucket to be created. Follow these steps:

### 1. Create the Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **"Create a new bucket"**
4. Set the following:
   - **Name**: `supporting-documents`
   - **Public bucket**: ✅ Check this box
   - **File size limit**: 10MB (or your preferred limit)
5. Click **"Create bucket"**

### 2. Set Storage Policies

After creating the bucket, you need to set up storage policies:

1. Go to **Storage** → **Policies**
2. Click on the `supporting-documents` bucket
3. Add the following policies:

#### Policy 1: Allow authenticated users to upload
- **Name**: `Allow authenticated uploads`
- **Policy definition**:
```sql
(auth.role() = 'authenticated')
```

#### Policy 2: Allow public downloads
- **Name**: `Allow public downloads`
- **Policy definition**:
```sql
(true)
```

### 3. Test the Upload

After setting up the bucket and policies, the file upload should work properly. The application will:

- Accept any file type (images, PDFs, documents, etc.)
- Upload files to the `supporting-documents` bucket
- Generate public URLs for viewing/downloading
- Show files in the admin review interface

### 4. Fallback Method

If the bucket setup fails, the application includes a fallback method that:

- Converts files to base64 data URLs
- Stores them temporarily in the database
- Shows a warning to contact admin for proper setup

### 5. Troubleshooting

If you still get "Bucket not found" errors:

1. Verify the bucket name is exactly `supporting-documents`
2. Check that the bucket is set to public
3. Ensure storage policies are properly configured
4. Check that your Supabase project has storage enabled

### 6. Alternative Bucket Names

If you prefer a different bucket name, update the `getStorageBucketName()` function in `src/utils/setupStorage.js`:

```javascript
export const getStorageBucketName = () => {
  return 'your-preferred-bucket-name';
};
```

Then update all references to use this function instead of hardcoded bucket names. 