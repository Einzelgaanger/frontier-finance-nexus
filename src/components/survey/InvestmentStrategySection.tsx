
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

import type { SurveyFormData } from '@/types/survey';

// Helper function to parse comma-separated numbers
const parseNumberWithCommas = (value: string): number => {
  if (!value) return 0;
  // Remove commas and parse as float
  const cleanValue = value.replace(/,/g, '');
  return parseFloat(cleanValue) || 0;
};

interface InvestmentStrategySectionProps {
  form: UseFormReturn<SurveyFormData>;
}

export function InvestmentStrategySection({ form }: InvestmentStrategySectionProps) {
  const [dryPowder, setDryPowder] = useState(0);
  
  const capitalRaised = form.watch('capital_raised') || 0;
  const capitalInMarket = form.watch('capital_in_market') || 0;
  
  useEffect(() => {
    setDryPowder(capitalRaised - capitalInMarket);
  }, [capitalRaised, capitalInMarket]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="ticket_size_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Ticket Size (USD) *</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="100000"
                  value={field.value ? field.value.toLocaleString() : ''}
                  onChange={(e) => {
                    const parsedValue = parseNumberWithCommas(e.target.value);
                    field.onChange(parsedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ticket_size_max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Ticket Size (USD) *</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="5000000"
                  value={field.value ? field.value.toLocaleString() : ''}
                  onChange={(e) => {
                    const parsedValue = parseNumberWithCommas(e.target.value);
                    field.onChange(parsedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="ticket_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ticket Size Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your ticket sizing strategy and flexibility..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Capital Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="target_capital"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desired Capital (USD) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="50,000,000"
                      value={field.value ? field.value.toLocaleString() : ''}
                      onChange={(e) => {
                        const parsedValue = parseNumberWithCommas(e.target.value);
                        field.onChange(parsedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capital_raised"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AUM / Committed Capital (USD) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="25,000,000"
                      value={field.value ? field.value.toLocaleString() : ''}
                      onChange={(e) => {
                        const parsedValue = parseNumberWithCommas(e.target.value);
                        field.onChange(parsedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capital_in_market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deployed Capital (USD) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      placeholder="20,000,000"
                      value={field.value ? field.value.toLocaleString() : ''}
                      onChange={(e) => {
                        const parsedValue = parseNumberWithCommas(e.target.value);
                        field.onChange(parsedValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-900">Available Capital (Dry Powder):</span>
              <span className="text-lg font-bold text-blue-900">
                ${dryPowder.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Calculated as: AUM / Committed Capital - Deployed Capital
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
