
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface VehicleInfoSectionProps {
  form: UseFormReturn<any>;
}

export function VehicleInfoSection({ form }: VehicleInfoSectionProps) {
  const [websites, setWebsites] = useState<string[]>(form.getValues('vehicle_websites') || []);

  const addWebsite = () => {
    const newWebsites = [...websites, ''];
    setWebsites(newWebsites);
    form.setValue('vehicle_websites', newWebsites);
  };

  const updateWebsite = (index: number, value: string) => {
    const newWebsites = [...websites];
    newWebsites[index] = value;
    setWebsites(newWebsites);
    form.setValue('vehicle_websites', newWebsites);
  };

  const removeWebsite = (index: number) => {
    const newWebsites = websites.filter((_, i) => i !== index);
    setWebsites(newWebsites);
    form.setValue('vehicle_websites', newWebsites);
  };

  const vehicleTypeValue = form.watch('vehicle_type');

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vehicle Websites</h3>
        {websites.map((website, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="https://example.com"
              value={website}
              onChange={(e) => updateWebsite(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeWebsite(index)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addWebsite}>
          <Plus className="w-4 h-4 mr-2" />
          Add Website
        </Button>
      </div>

      <FormField
        control={form.control}
        name="vehicle_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vehicle Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {vehicleTypeValue === 'other' && (
        <FormField
          control={form.control}
          name="vehicle_type_other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specify Other Vehicle Type</FormLabel>
              <FormControl>
                <Input placeholder="Please specify your vehicle type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="thesis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Thesis *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your investment thesis, focus areas, and strategy..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
