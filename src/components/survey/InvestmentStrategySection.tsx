
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface InvestmentStrategySectionProps {
  form: UseFormReturn<any>;
}

export function InvestmentStrategySection({ form }: InvestmentStrategySectionProps) {
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
                  type="number" 
                  placeholder="100000"
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
          name="ticket_size_max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Ticket Size (USD) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="5000000"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="target_capital"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Capital (USD) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="50000000"
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
          name="capital_raised"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capital Raised (USD) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="25000000"
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
          name="capital_in_market"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capital in Market (USD) *</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="20000000"
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
