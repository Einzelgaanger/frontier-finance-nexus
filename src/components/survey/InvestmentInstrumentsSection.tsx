
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import { useState } from 'react';

import type { SurveyFormData } from '@/types/survey';
interface InvestmentInstrumentsSectionProps {
  form: UseFormReturn<SurveyFormData>;
}

export function InvestmentInstrumentsSection({ form }: InvestmentInstrumentsSectionProps) {
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(
    Object.keys(form.getValues('investment_instruments_priority') || {}).filter(key => 
      form.getValues('investment_instruments_priority')[key] > 0
    )
  );
  const [priorityOrder, setPriorityOrder] = useState<string[]>(
    Object.keys(form.getValues('investment_instruments_priority') || {})
      .filter(key => form.getValues('investment_instruments_priority')[key] > 0)
      .sort((a, b) => (form.getValues('investment_instruments_priority')[b] || 0) - (form.getValues('investment_instruments_priority')[a] || 0))
  );

  const instrumentOptions = [
    'Senior debt secured',
    'Senior debt unsecured', 
    'Mezzanine/subordinate debt',
    'Convertible notes',
    'SAFEs',
    'Shared revenue/earning instrument',
    'Preferred equity',
    'Common equity'
  ];

  const toggleInstrument = (instrument: string) => {
    let newSelected = [...selectedInstruments];
    let newPriority = [...priorityOrder];
    
    if (selectedInstruments.includes(instrument)) {
      // Remove from selection
      newSelected = newSelected.filter(item => item !== instrument);
      newPriority = newPriority.filter(item => item !== instrument);
    } else {
      // Add to selection (at the end as lowest priority)
      newSelected.push(instrument);
      newPriority.push(instrument);
    }
    
    setSelectedInstruments(newSelected);
    setPriorityOrder(newPriority);
    updateFormValues(newSelected, newPriority);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newPriority = [...priorityOrder];
    [newPriority[index], newPriority[index - 1]] = [newPriority[index - 1], newPriority[index]];
    setPriorityOrder(newPriority);
    updateFormValues(selectedInstruments, newPriority);
  };

  const moveDown = (index: number) => {
    if (index === priorityOrder.length - 1) return;
    const newPriority = [...priorityOrder];
    [newPriority[index], newPriority[index + 1]] = [newPriority[index + 1], newPriority[index]];
    setPriorityOrder(newPriority);
    updateFormValues(selectedInstruments, newPriority);
  };

  const removeInstrument = (instrument: string) => {
    const newSelected = selectedInstruments.filter(item => item !== instrument);
    const newPriority = priorityOrder.filter(item => item !== instrument);
    setSelectedInstruments(newSelected);
    setPriorityOrder(newPriority);
    updateFormValues(newSelected, newPriority);
  };

  const updateFormValues = (selected: string[], priority: string[]) => {
    const priorityValues: Record<string, number> = {};
    priority.forEach((instrument, index) => {
      priorityValues[instrument] = priority.length - index; // Highest priority gets highest number
    });
    form.setValue('investment_instruments_priority', priorityValues);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investment Instruments (Priority Order)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Select the investment instruments you use and arrange them by priority (most important first).
            You can select one, multiple, or all instruments.
          </p>
          
          {/* Available Instruments */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Available Instruments:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {instrumentOptions.map((instrument) => (
                <div key={instrument} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedInstruments.includes(instrument)}
                    onCheckedChange={() => toggleInstrument(instrument)}
                  />
                  <label className="text-sm">{instrument}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Order */}
          {priorityOrder.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Priority Order (Most Important First):</h4>
              <div className="space-y-2">
                {priorityOrder.map((instrument, index) => (
                  <div key={instrument} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{instrument}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => moveDown(index)}
                        disabled={index === priorityOrder.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstrument(instrument)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
