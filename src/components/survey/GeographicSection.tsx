
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Globe } from 'lucide-react';
import { CountrySelector, MarketSelector } from './CountrySelector';

import type { SurveyFormData } from '@/types/survey';

interface GeographicSectionProps {
  form: UseFormReturn<SurveyFormData>;
}

export function GeographicSection({ form }: GeographicSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Geographic & Market Focus</h3>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="legal_domicile"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <CountrySelector
                  value={field.value || []}
                  onChange={field.onChange}
                  label="Legal Domicile"
                  placeholder="Search and select countries for legal domicile..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="markets_operated"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MarketSelector
                  value={field.value || {}}
                  onChange={field.onChange}
                  label="Market Focus"
                  placeholder="Search countries and set allocation percentages..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
