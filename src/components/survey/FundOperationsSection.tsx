
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Eye } from 'lucide-react';
import { useState } from 'react';

interface FundOperationsSectionProps {
  form: UseFormReturn<any>;
}

export function FundOperationsSection({ form }: FundOperationsSectionProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Supporting Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Upload a one-page fund overview (PDF or Image)
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadedFile(file);
                  const url = URL.createObjectURL(file);
                  setPreviewUrl(url);
                  form.setValue('supporting_document_url', url);
                }
              }}
              className="hidden"
              id="document-upload"
              aria-label="Upload supporting document"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('document-upload')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
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
                    window.open(previewUrl, '_blank');
                  }
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <FormField
        control={form.control}
        name="information_sharing"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Information Sharing Preference *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select information sharing preference" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="public">Public - All information visible</SelectItem>
                <SelectItem value="members_only">Members Only - Visible to network members</SelectItem>
                <SelectItem value="limited">Limited - Basic information only</SelectItem>
                <SelectItem value="confidential">Confidential - Minimal visibility</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expectations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expectations from the Network *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What do you hope to achieve through this network? What value are you looking for?"
                className="min-h-[120px]"
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
            <FormLabel>How did you hear about this network? *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select how you heard about us" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="referral">Referral from existing member</SelectItem>
                <SelectItem value="conference">Conference/Event</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="website">Website/Online search</SelectItem>
                <SelectItem value="newsletter">Newsletter/Publication</SelectItem>
                <SelectItem value="partner">Partner organization</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
