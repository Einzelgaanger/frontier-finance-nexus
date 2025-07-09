
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface SectorReturnsSectionProps {
  form: UseFormReturn<any>;
}

export function SectorReturnsSection({ form }: SectorReturnsSectionProps) {
  const [sectors, setSectors] = useState<Record<string, number>>(
    form.getValues('sectors_allocation') || {}
  );

  const sectorOptions = [
    'Fintech', 'Healthtech', 'Edtech', 'Agtech', 'E-commerce',
    'SaaS', 'Mobility', 'Energy', 'Manufacturing', 'Real Estate',
    'Consumer Goods', 'Media', 'Infrastructure', 'Other'
  ];

  const updateSectorAllocation = (sector: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newSectors = { ...sectors, [sector]: numValue };
    setSectors(newSectors);
    form.setValue('sectors_allocation', newSectors);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sector Allocation (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectorOptions.map((sector) => (
              <div key={sector} className="flex items-center space-x-2">
                <label className="flex-1 text-sm font-medium">{sector}</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={sectors[sector] || ''}
                  onChange={(e) => updateSectorAllocation(sector, e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total allocation: {Object.values(sectors).reduce((sum, val) => sum + val, 0)}%
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="target_return_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Target Return (%) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="15"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_return_max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Target Return (%) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="35"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <FormField
          control={form.control}
          name="equity_investments_made"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equity Investments Made *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="10"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="equity_investments_exited"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equity Investments Exited *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="3"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="self_liquidating_made"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Self-Liquidating Made *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="5"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="self_liquidating_exited"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Self-Liquidating Exited *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="2"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
