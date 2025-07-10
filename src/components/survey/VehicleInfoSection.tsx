
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Globe, Building2, FileText, ExternalLink } from 'lucide-react';
import { useState } from 'react';

import type { SurveyFormData } from '@/types/survey';
interface VehicleInfoSectionProps {
  form: UseFormReturn<SurveyFormData>;
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
    <div className="space-y-8">
      {/* Vehicle Websites */}
      <Card className="border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Globe className="w-5 h-5 mr-2" />
            Vehicle Websites
          </CardTitle>
          <CardDescription className="text-blue-700">
            Add any public websites or online presence for your fund vehicle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {websites.map((website, index) => (
            <div key={index} className="flex gap-3">
              <div className="relative flex-1">
                <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="https://example.com"
                  value={website}
                  onChange={(e) => updateWebsite(index, e.target.value)}
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-200"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeWebsite(index)}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button 
            type="button" 
            variant="outline" 
            onClick={addWebsite}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Website
          </Button>
        </CardContent>
      </Card>

      {/* Vehicle Type */}
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-green-900">
            <Building2 className="w-5 h-5 mr-2" />
            Vehicle Type
          </CardTitle>
          <CardDescription className="text-green-700">
            Select the type of fund vehicle you operate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="vehicle_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-green-800 font-medium">Vehicle Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-200">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">Open Fund</SelectItem>
                    <SelectItem value="closed">Closed Fund</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {vehicleTypeValue === 'other' && (
            <div className="mt-4">
              <FormField
                control={form.control}
                name="vehicle_type_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-green-800 font-medium">Specify Other Vehicle Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Please specify your vehicle type" 
                        className="border-green-200 focus:border-green-400 focus:ring-green-200"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Thesis */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-900">
            <FileText className="w-5 h-5 mr-2" />
            Investment Thesis
          </CardTitle>
          <CardDescription className="text-purple-700">
            Describe your investment strategy, focus areas, and approach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="thesis"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-800 font-medium">Investment Thesis *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your investment thesis, focus areas, and strategy..."
                    className="min-h-[120px] border-purple-200 focus:border-purple-400 focus:ring-purple-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
