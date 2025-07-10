
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface GeographicSectionProps {
  form: UseFormReturn<any>;
}

export function GeographicSection({ form }: GeographicSectionProps) {
  const [markets, setMarkets] = useState<Record<string, number>>(
    form.getValues('markets_operated') || {}
  );

  const domicileOptions = [
    'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Somalia', 'Djibouti', 'Eritrea',
    'Ghana', 'Nigeria', 'Senegal', 'Côte d\'Ivoire', 'Burkina Faso', 'Mali', 'Niger',
    'South Africa', 'Namibia', 'Botswana', 'Zimbabwe', 'Zambia', 'Malawi', 'Mozambique',
    'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan', 'South Sudan',
    'Mauritius', 'Seychelles', 'Madagascar', 'Comoros',
    'United States', 'United Kingdom', 'France', 'Germany', 'Netherlands', 'Switzerland',
    'China', 'India', 'Japan', 'Singapore', 'United Arab Emirates', 'Saudi Arabia',
    'Other'
  ];

  const marketOptions = [
    'Africa (Pan-African)', 'East Africa', 'West Africa', 'Southern Africa', 'North Africa',
    'Sub-Saharan Africa', 'MENA', 'East Africa (Kenya, Uganda, Tanzania, Rwanda)', 
    'West Africa (Ghana, Nigeria, Senegal)', 'Southern Africa (South Africa, Namibia)',
    'North Africa (Egypt, Morocco, Tunisia)', 'Global', 'Other'
  ];

  const updateMarketAllocation = (market: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMarkets = { ...markets, [market]: numValue };
    setMarkets(newMarkets);
    form.setValue('markets_operated', newMarkets);
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="legal_domicile"
        render={() => (
          <FormItem>
            <FormLabel>Legal Domicile *</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {domicileOptions.map((domicile) => (
                <FormField
                  key={domicile}
                  control={form.control}
                  name="legal_domicile"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={domicile}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(domicile)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, domicile])
                                : field.onChange(
                                    field.value?.filter((value: string) => value !== domicile)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm">
                          {domicile}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Markets Operated (Allocation %)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketOptions.map((market) => (
              <div key={market} className="flex items-center space-x-2">
                <label className="flex-1 text-sm font-medium">{market}</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={markets[market] || ''}
                  onChange={(e) => updateMarketAllocation(market, e.target.value)}
                  className="w-24"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total allocation: {Object.values(markets).reduce((sum, val) => sum + val, 0)}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
