
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

import type { SurveyFormData } from '@/types/survey';

interface GeographicSectionProps {
  form: UseFormReturn<SurveyFormData>;
}

export function GeographicSection({ form }: GeographicSectionProps) {
  const [markets, setMarkets] = useState<Record<string, number>>(
    form.getValues('markets_operated') || {}
  );
  const [showDomicileOther, setShowDomicileOther] = useState(false);
  const [showMarketOther, setShowMarketOther] = useState(false);

  const domicileOptions = {
    'East Africa': ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'Somalia', 'Djibouti', 'Eritrea'],
    'West Africa': ['Ghana', 'Nigeria', 'Senegal', 'Côte d\'Ivoire', 'Burkina Faso', 'Mali', 'Niger'],
    'Southern Africa': ['South Africa', 'Namibia', 'Botswana', 'Zimbabwe', 'Zambia', 'Malawi', 'Mozambique'],
    'North Africa': ['Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan', 'South Sudan'],
    'Island Nations': ['Mauritius', 'Seychelles', 'Madagascar', 'Comoros'],
    'North America': ['United States', 'Canada'],
    'Europe': ['United Kingdom', 'France', 'Germany', 'Netherlands', 'Switzerland'],
    'Asia': ['China', 'India', 'Japan', 'Singapore'],
    'Middle East': ['United Arab Emirates', 'Saudi Arabia']
  };

  const marketOptions = [
    'Africa (Pan-African)',
    'East Africa',
    'West Africa', 
    'Southern Africa',
    'North Africa',
    'Sub-Saharan Africa',
    'MENA',
    'East Africa (Kenya, Uganda, Tanzania, Rwanda)',
    'West Africa (Ghana, Nigeria, Senegal)',
    'Southern Africa (South Africa, Namibia)',
    'North Africa (Egypt, Morocco, Tunisia)',
    'Global',
    'Other'
  ];

  const updateMarketAllocation = (market: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMarkets = { ...markets };
    
    if (numValue === 0) {
      delete newMarkets[market];
    } else {
      newMarkets[market] = numValue;
    }
    
    setMarkets(newMarkets);
    form.setValue('markets_operated', newMarkets);
  };

  const totalAllocation = Object.values(markets).reduce((sum, val) => sum + val, 0);

  const handleDomicileChange = (country: string, checked: boolean) => {
    const currentValues = form.getValues('legal_domicile') || [];
    if (checked) {
      form.setValue('legal_domicile', [...currentValues, country]);
    } else {
      form.setValue('legal_domicile', currentValues.filter(c => c !== country));
    }
    
    if (country === 'Other') {
      setShowDomicileOther(checked);
    }
  };

  const handleMarketChange = (market: string) => {
    if (market === 'Other') {
      setShowMarketOther(true);
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="legal_domicile"
        render={() => (
          <FormItem>
            <FormLabel>Legal Domicile *</FormLabel>
            <div className="space-y-4">
              {Object.entries(domicileOptions).map(([region, countries]) => (
                <div key={region} className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">{region}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-4">
                    {countries.map((country) => (
                      <FormField
                        key={country}
                        control={form.control}
                        name="legal_domicile"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(country)}
                                onCheckedChange={(checked) => handleDomicileChange(country, !!checked)}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-sm">
                              {country}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex items-center space-x-3">
                <FormField
                  control={form.control}
                  name="legal_domicile"
                  render={({ field }) => (
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('Other')}
                        onCheckedChange={(checked) => handleDomicileChange('Other', !!checked)}
                      />
                    </FormControl>
                  )}
                />
                <FormLabel className="font-normal text-sm">Other</FormLabel>
              </div>
              
              {showDomicileOther && (
                <FormField
                  control={form.control}
                  name="legal_domicile_other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Please specify other domicile</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter other legal domicile" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Markets Operated (Allocation %)</CardTitle>
          <p className="text-sm text-gray-600">Specify what percentage of your portfolio is allocated to each market</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketOptions.map((market) => (
                <div key={market} className="flex items-center space-x-2">
                  <label className="flex-1 text-sm font-medium">{market}</label>
                  <Input
                    type="number"
                    placeholder="0"
                    min="0"
                    max="100"
                    value={markets[market] || ''}
                    onChange={(e) => {
                      updateMarketAllocation(market, e.target.value);
                      if (market === 'Other') {
                        handleMarketChange(market);
                      }
                    }}
                    className="w-24"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              ))}
            </div>
            
            {showMarketOther && (
              <FormField
                control={form.control}
                name="markets_operated_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify other market</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the other market(s) you operate in" 
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            
            <div className={`mt-4 text-sm ${totalAllocation > 100 ? 'text-red-600' : 'text-gray-600'}`}>
              Total allocation: {totalAllocation.toFixed(1)}%
              {totalAllocation > 100 && (
                <span className="block text-red-600 font-medium">
                  Warning: Total allocation cannot exceed 100%
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
