
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface InvestmentInstrumentsSectionProps {
  form: UseFormReturn<any>;
}

export function InvestmentInstrumentsSection({ form }: InvestmentInstrumentsSectionProps) {
  const [instruments, setInstruments] = useState<Record<string, number>>(
    form.getValues('investment_instruments_priority') || {}
  );

  const instrumentOptions = [
    'Equity', 'Convertible Notes', 'SAFE', 'Debt', 'Revenue-Based Financing',
    'Venture Debt', 'Mezzanine', 'Preferred Equity', 'Warrants', 'Other'
  ];

  const updateInstrumentPriority = (instrument: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newInstruments = { ...instruments, [instrument]: numValue };
    setInstruments(newInstruments);
    form.setValue('investment_instruments_priority', newInstruments);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Instruments Priority (1-10 scale)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instrumentOptions.map((instrument) => (
              <div key={instrument} className="flex items-center space-x-2">
                <label className="flex-1 text-sm font-medium">{instrument}</label>
                <Input
                  type="number"
                  placeholder="1-10"
                  value={instruments[instrument] || ''}
                  onChange={(e) => updateInstrumentPriority(instrument, e.target.value)}
                  className="w-24"
                  min="1"
                  max="10"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Rate each instrument from 1 (lowest priority) to 10 (highest priority)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
