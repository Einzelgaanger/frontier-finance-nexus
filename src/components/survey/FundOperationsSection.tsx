
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FundOperationsSectionProps {
  form: UseFormReturn<any>;
}

export function FundOperationsSection({ form }: FundOperationsSectionProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="supporting_document_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supporting Document URL</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://example.com/document.pdf"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
