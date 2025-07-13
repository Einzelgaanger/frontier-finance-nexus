// Utility script to set up Supabase storage bucket
// This should be run by an admin to create the storage bucket

import { supabase } from '@/integrations/supabase/client';

export const setupStorageBucket = async () => {
  try {
    console.log('Setting up storage bucket...');
    
    // Note: This requires admin privileges in Supabase
    // The bucket should be created manually in the Supabase dashboard
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'supporting-documents');
    
    if (!bucketExists) {
      console.log('Bucket "supporting-documents" not found. Please create it manually in Supabase dashboard.');
      console.log('Steps to create bucket:');
      console.log('1. Go to Supabase Dashboard');
      console.log('2. Navigate to Storage');
      console.log('3. Click "Create a new bucket"');
      console.log('4. Name it "supporting-documents"');
      console.log('5. Set it as public');
      console.log('6. Save the bucket');
      return false;
    }
    
    console.log('Bucket "supporting-documents" exists!');
    return true;
  } catch (error) {
    console.error('Error setting up storage:', error);
    return false;
  }
};

// Alternative approach: Use a different bucket name or create a fallback
export const getStorageBucketName = () => {
  return 'supporting-documents';
};

// Fallback upload function that tries different approaches
export const uploadFileWithFallback = async (file, bucketName = 'supporting-documents') => {
  try {
    // Try the main bucket first
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      
      // If bucket doesn't exist, try to create a temporary solution
      if (error.message.includes('Bucket not found')) {
        console.log('Bucket not found, trying alternative approach...');
        
        // For now, we'll store the file data in the database as a fallback
        // This is not ideal but will work until the bucket is set up
        const fileData = await file.arrayBuffer();
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(fileData)));
        
        return {
          success: true,
          url: `data:${file.type};base64,${base64Data}`,
          fileName: fileName,
          fallback: true
        };
      }
      
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return {
      success: true,
      url: urlData.publicUrl,
      fileName: fileName,
      fallback: false
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 