
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowUp, ArrowDown, X, Plus, Calculator, DollarSign, Percent } from 'lucide-react';
import { useState, useEffect } from 'react';

import type { SurveyFormData } from '@/types/survey';

// Helper function to parse comma-separated numbers
const parseNumberWithCommas = (value: string): number => {
  if (!value) return 0;
  // Remove commas and parse as float
  const cleanValue = value.replace(/,/g, '');
  return parseFloat(cleanValue) || 0;
};

interface InvestmentInstrument {
  name: string;
  committed: number; // Value in USD
  committedPercentage: number; // Percentage of total capital
  deployed: number; // Percentage of committed amount
  deployedValue: number; // Actual deployed value
  priority: number;
}

interface InvestmentInstrumentsSectionProps {
  form: UseFormReturn<SurveyFormData>;
}

export function InvestmentInstrumentsSection({ form }: InvestmentInstrumentsSectionProps) {
  const [instruments, setInstruments] = useState<InvestmentInstrument[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherInstrumentName, setOtherInstrumentName] = useState('');
  const [otherCommitted, setOtherCommitted] = useState('');
  const [otherDeployed, setOtherDeployed] = useState('');
  const [inputMode, setInputMode] = useState<'percentage' | 'value'>('percentage');

  const capitalRaised = form.watch('capital_raised') || 0;
  const totalCommitted = instruments.reduce((sum, inst) => sum + inst.committed, 0);
  const totalDeployed = instruments.reduce((sum, inst) => sum + inst.deployedValue, 0);
  const dryPowder = totalCommitted - totalDeployed;

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

  // Initialize instruments from form data
  useEffect(() => {
    const existingData = form.getValues('investment_instruments_data') || [];
    if (existingData.length > 0) {
      setInstruments(existingData);
    } else {
      // Fallback to old format
      const existingPriority = form.getValues('investment_instruments_priority') || {};
      const existingInstruments: InvestmentInstrument[] = [];
      
      Object.entries(existingPriority).forEach(([name, priority]) => {
        if (priority > 0) {
          existingInstruments.push({
            name,
            committed: 0,
            committedPercentage: 0,
            deployed: 0,
            deployedValue: 0,
            priority: priority as number
          });
        }
      });
      
      if (existingInstruments.length > 0) {
        setInstruments(existingInstruments);
      }
    }
  }, [form]);

  // Update form values when instruments change
  useEffect(() => {
    const priorityValues: Record<string, number> = {};
    instruments.forEach((instrument, index) => {
      priorityValues[instrument.name] = instruments.length - index;
    });
    form.setValue('investment_instruments_priority', priorityValues);
    form.setValue('investment_instruments_data', instruments);
  }, [instruments, form]);

  const addInstrument = (name: string, committed: number, deployed: number) => {
    const committedValue = inputMode === 'percentage' 
      ? (committed / 100) * capitalRaised 
      : committed;
    
    const deployedValue = (deployed / 100) * committedValue;
    
    const newInstrument: InvestmentInstrument = {
      name,
      committed: committedValue,
      committedPercentage: inputMode === 'percentage' ? committed : (committedValue / capitalRaised) * 100,
      deployed,
      deployedValue,
      priority: instruments.length + 1
    };
    
    setInstruments([...instruments, newInstrument]);
    setShowOtherInput(false);
    setOtherInstrumentName('');
    setOtherCommitted('');
    setOtherDeployed('');
  };

  const updateInstrument = (index: number, field: keyof InvestmentInstrument, value: number) => {
    const updatedInstruments = [...instruments];
    const instrument = updatedInstruments[index];
    
    if (field === 'committed' || field === 'committedPercentage') {
      const committedValue = inputMode === 'percentage' 
        ? (value / 100) * capitalRaised 
        : value;
      
      instrument.committed = committedValue;
      instrument.committedPercentage = inputMode === 'percentage' ? value : (committedValue / capitalRaised) * 100;
    } else if (field === 'deployed') {
      instrument.deployed = value;
      instrument.deployedValue = (value / 100) * instrument.committed;
    }
    
    setInstruments(updatedInstruments);
  };

  const removeInstrument = (index: number) => {
    setInstruments(instruments.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newInstruments = [...instruments];
    [newInstruments[index], newInstruments[index - 1]] = [newInstruments[index - 1], newInstruments[index]];
    setInstruments(newInstruments);
  };

  const moveDown = (index: number) => {
    if (index === instruments.length - 1) return;
    const newInstruments = [...instruments];
    [newInstruments[index], newInstruments[index + 1]] = [newInstruments[index + 1], newInstruments[index]];
    setInstruments(newInstruments);
  };

  const sortedInstruments = [...instruments].sort((a, b) => b.committed - a.committed);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Investment Instruments & Capital Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Capital Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Capital Summary (from Section 4)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700">AUM / Committed Capital:</span>
                <div className="font-bold text-blue-900">${capitalRaised.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-blue-700">Total Committed:</span>
                <div className="font-bold text-blue-900">${totalCommitted.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-blue-700">Total Deployed:</span>
                <div className="font-bold text-blue-900">${totalDeployed.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-blue-700">Available Capital:</span>
                <div className="font-bold text-blue-900">${dryPowder.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Input Mode Selection */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Input Mode:</span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={inputMode === 'percentage' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('percentage')}
              >
                <Percent className="w-4 h-4 mr-1" />
                Percentage
              </Button>
              <Button
                type="button"
                variant={inputMode === 'value' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setInputMode('value')}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Value
              </Button>
            </div>
          </div>

          {/* Add Instrument */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Add Investment Instrument</h4>
            
            {/* Predefined Instruments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {instrumentOptions.map((instrument) => (
                <Button
                  key={instrument}
                  type="button"
                  variant="outline"
                  onClick={() => addInstrument(instrument, 0, 0)}
                  disabled={instruments.some(inst => inst.name === instrument)}
                  className="justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {instrument}
                </Button>
              ))}
            </div>

            {/* Other Instrument */}
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowOtherInput(true)}
                disabled={showOtherInput}
              >
                <Plus className="w-4 h-4 mr-2" />
                Other Instrument
              </Button>

              {showOtherInput && (
                <div className="p-4 border rounded-lg space-y-3">
                  <Input
                    placeholder="Enter instrument name"
                    value={otherInstrumentName}
                    onChange={(e) => setOtherInstrumentName(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder={inputMode === 'percentage' ? 'Committed %' : 'Committed Value'}
                      value={otherCommitted}
                      onChange={(e) => setOtherCommitted(e.target.value)}
                      type="number"
                    />
                    <Input
                      placeholder="Deployed %"
                      value={otherDeployed}
                      onChange={(e) => setOtherDeployed(e.target.value)}
                      type="number"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => {
                        if (otherInstrumentName && otherCommitted && otherDeployed) {
                          addInstrument(
                            otherInstrumentName,
                            parseNumberWithCommas(otherCommitted),
                            parseNumberWithCommas(otherDeployed)
                          );
                        }
                      }}
                      disabled={!otherInstrumentName || !otherCommitted || !otherDeployed}
                    >
                      Add Instrument
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowOtherInput(false);
                        setOtherInstrumentName('');
                        setOtherCommitted('');
                        setOtherDeployed('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instruments List */}
          {instruments.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Investment Instruments (Ordered by Commitment)</h4>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Instrument</th>
                      <th className="text-left p-2">Committed</th>
                      <th className="text-left p-2">Deployed</th>
                      <th className="text-left p-2">Deployed Value</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedInstruments.map((instrument, index) => (
                      <tr key={instrument.name} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </td>
                        <td className="p-2 font-medium">{instrument.name}</td>
                        <td className="p-2">
                          <div className="space-y-1">
                            <Input
                              type="number"
                              value={inputMode === 'percentage' ? instrument.committedPercentage.toFixed(1) : instrument.committed.toLocaleString()}
                              onChange={(e) => updateInstrument(
                                instruments.findIndex(inst => inst.name === instrument.name),
                                inputMode === 'percentage' ? 'committedPercentage' : 'committed',
                                parseNumberWithCommas(e.target.value)
                              )}
                              className="w-20"
                            />
                            <div className="text-xs text-gray-500">
                              {inputMode === 'percentage' ? '%' : '$'}
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="space-y-1">
                            <Input
                              type="number"
                              value={instrument.deployed.toFixed(1)}
                              onChange={(e) => updateInstrument(
                                instruments.findIndex(inst => inst.name === instrument.name),
                                'deployed',
                                parseNumberWithCommas(e.target.value)
                              )}
                              className="w-20"
                            />
                            <div className="text-xs text-gray-500">%</div>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="text-sm">
                            ${instrument.deployedValue.toLocaleString()}
                    </div>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                              onClick={() => moveUp(instruments.findIndex(inst => inst.name === instrument.name))}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                              onClick={() => moveDown(instruments.findIndex(inst => inst.name === instrument.name))}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                              onClick={() => removeInstrument(instruments.findIndex(inst => inst.name === instrument.name))}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                    </div>
                  </div>
          )}

          {/* Validation Summary */}
          {instruments.length > 0 && (
            <div className={`p-4 rounded-lg ${
              Math.abs(totalCommitted - capitalRaised) < 1 
                ? 'bg-green-50 text-green-800' 
                : 'bg-red-50 text-red-800'
            }`}>
              <h4 className="font-medium mb-2">Validation Summary</h4>
              <div className="space-y-1 text-sm">
                <div>Total Committed: ${totalCommitted.toLocaleString()} / ${capitalRaised.toLocaleString()}</div>
                <div>Difference: ${(totalCommitted - capitalRaised).toLocaleString()}</div>
                {Math.abs(totalCommitted - capitalRaised) < 1 ? (
                  <div className="text-green-600">✅ Commitments match capital raised</div>
                ) : (
                  <div className="text-red-600">⚠️ Commitments should equal capital raised</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
