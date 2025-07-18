
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Eye, Link } from 'lucide-react';
import { useState, useEffect } from 'react';

import type { SurveyFormData } from '@/types/survey';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FundOperationsSectionProps {
  form: UseFormReturn<SurveyFormData>;
}

export function FundOperationsSection({ form }: FundOperationsSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const howHeardValue = form.watch('how_heard_about_network');

  // Helper to convert file to base64 and store in database
  const uploadToDatabase = async (file: File, userId: string) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        const fileData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: base64Data,
          uploadedAt: new Date().toISOString()
        };
        resolve(JSON.stringify(fileData));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit for base64
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        return;
      }

      const userId = user?.id || 'anonymous';
      const fileData = await uploadToDatabase(file, userId);
      
      setUploadedFile(file);
      setPreviewUrl(fileData);
      form.setValue('supporting_document_url', fileData);
      
      toast({
        title: "File Uploaded Successfully",
        description: `${file.name} uploaded to database`,
        variant: "default"
      });
    } catch (err) {
      console.error('Failed to upload file:', err);
      toast({
        title: "Upload Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle link upload (store as text data)
  const handleLinkUpload = async (link: string) => {
    setUploading(true);
    try {
      const linkData = {
        fileName: 'document-link.txt',
        fileSize: link.length,
        fileType: 'text/plain',
        data: `data:text/plain;base64,${btoa(link)}`,
        uploadedAt: new Date().toISOString()
      };
      
      setUploadedFile(null);
      setPreviewUrl(JSON.stringify(linkData));
      form.setValue('supporting_document_url', JSON.stringify(linkData));
      
      toast({
        title: "Link Saved Successfully",
        description: "Link saved to database",
        variant: "default"
      });
    } catch (err) {
      console.error('Failed to upload link:', err);
      toast({
        title: "Upload Error",
        description: "Failed to save link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Update showOtherInput when form value changes
  useEffect(() => {
    setShowOtherInput(howHeardValue === 'other');
  }, [howHeardValue]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supporting Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Upload a one-page fund overview (PDF or Image, max 10MB)
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleFileUpload(file);
                  }
                }}
                className="hidden"
                id="document-upload"
                aria-label="Upload supporting document"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('document-upload')?.click()}
                disabled={uploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </div>
            
            {uploadedFile && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">{uploadedFile.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (previewUrl) {
                      const link = document.createElement('a');
                      link.href = previewUrl;
                      link.download = uploadedFile.name;
                      link.click();
                    }
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Link Input Section */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="supporting_document_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Document Link (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="https://example.com/fund-overview.pdf"
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={uploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          if (field.value) {
                            await handleLinkUpload(field.value);
                          }
                        }}
                        disabled={uploading || !field.value}
                      >
                        {uploading ? 'Uploading...' : 'Save as Document'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Network Expectations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="expectations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What do you expect from the ESCP Network? *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your expectations from the network..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="how_heard_about_network"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How did you hear about the ESCP Network? *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select how you heard about us" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="conference">Industry Conference</SelectItem>
                    <SelectItem value="referral">Referral from Network Member</SelectItem>
                    <SelectItem value="community">Investment Community</SelectItem>
                    <SelectItem value="media">Media/Press</SelectItem>
                    <SelectItem value="outreach">Direct Outreach</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {showOtherInput && (
            <FormField
              control={form.control}
              name="how_heard_about_network_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Please specify how you heard about us</FormLabel>
                  <FormControl>
                    <Input placeholder="Please specify..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
