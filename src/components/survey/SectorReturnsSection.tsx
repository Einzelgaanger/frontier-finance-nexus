
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, AlertCircle } from 'lucide-react';
import { useState } from 'react';

import type { SurveyFormData } from '@/types/survey';
interface SectorReturnsSectionProps {
  form: UseFormReturn<SurveyFormData>;
}

interface SectorAllocation {
  sector: string;
  percentage: number;
}

export function SectorReturnsSection({ form }: SectorReturnsSectionProps) {
  const [sectorAllocations, setSectorAllocations] = useState<SectorAllocation[]>(
    Object.keys(form.getValues('sectors_allocation') || {}).map(sector => ({
      sector,
      percentage: form.getValues('sectors_allocation')[sector] || 0
    }))
  );

  const sectorOptions = [
    'Agri: SME/ Food value chain/ Agritech',
    'Software services/ SaaS',
    'Clean energy/ renewable/ e-mobility',
    'Manufacturing',
    'Agri: Primary Agri',
    'Healthcare/ medical services',
    'Education',
    'Tech/ telecom/ data infrastructure',
    'FMCG',
    'Logistics/ Transport/ Distribution',
    'Merchandising/ Retail/ On-time-retail'
  ];

  const addSectorAllocation = () => {
    setSectorAllocations([...sectorAllocations, { sector: '', percentage: 0 }]);
  };

  const updateSectorAllocation = (index: number, field: keyof SectorAllocation, value: string | number) => {
    const newAllocations = [...sectorAllocations];
    if (field === 'sector') {
      newAllocations[index].sector = value as string;
    } else if (field === 'percentage') {
      newAllocations[index].percentage = value as number;
    }
    setSectorAllocations(newAllocations);
    updateFormValues(newAllocations);
  };

  const removeSectorAllocation = (index: number) => {
    const newAllocations = sectorAllocations.filter((_, i) => i !== index);
    setSectorAllocations(newAllocations);
    updateFormValues(newAllocations);
  };

  const updateFormValues = (allocations: SectorAllocation[]) => {
    const sectorsData: Record<string, number> = {};
    allocations.forEach(allocation => {
      if (allocation.sector && allocation.percentage > 0) {
        sectorsData[allocation.sector] = allocation.percentage;
      }
    });
    form.setValue('sectors_allocation', sectorsData);
  };

  const totalPercentage = sectorAllocations.reduce((sum, allocation) => sum + allocation.percentage, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sector Focus & Allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the sectors you focus on and specify the percentage allocation for each.
            The total of all percentages should equal 100%.
          </p>
          
          {sectorAllocations.map((allocation, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Sector {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSectorAllocation(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <FormLabel>Sector *</FormLabel>
                  <Select 
                    onValueChange={(value) => updateSectorAllocation(index, 'sector', value)}
                    value={allocation.sector}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectorOptions.map((sector) => (
                        <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <FormLabel>Allocation Percentage *</FormLabel>
                  <Input
                    type="number"
                    placeholder="0"
                    value={allocation.percentage || ''}
                    onChange={(e) => updateSectorAllocation(index, 'percentage', parseFloat(e.target.value) || 0)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addSectorAllocation}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Sector
          </Button>
          
          <div className={`p-3 rounded-lg ${
            totalPercentage === 100 
              ? 'bg-green-50 text-green-800' 
              : totalPercentage > 100 
                ? 'bg-red-50 text-red-800'
                : 'bg-yellow-50 text-yellow-800'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span className="font-medium">
                Total Allocation: {totalPercentage}%
              </span>
            </div>
            {totalPercentage === 100 && (
              <p className="text-sm mt-1">Perfect! Total allocation equals 100%.</p>
            )}
            {totalPercentage > 100 && (
              <p className="text-sm mt-1">Total allocation exceeds 100%. Please adjust percentages.</p>
            )}
            {totalPercentage < 100 && (
              <p className="text-sm mt-1">Total allocation is less than 100%. You can add more sectors or adjust percentages.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="target_return_min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Range Minimum (%) *</FormLabel>
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
              <FormLabel>Range Maximum (%) *</FormLabel>
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
              <FormLabel>Number of Equity Investments Made *</FormLabel>
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
              <FormLabel>Number of Equity Investments Exited *</FormLabel>
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
              <FormLabel>Number of Self-Liquidating Made *</FormLabel>
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
              <FormLabel>Number of Self-Liquidating Exited *</FormLabel>
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
