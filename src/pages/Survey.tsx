import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Plus, 
  Calendar, 
  Eye, 
  Users, 
  Building2,
  RefreshCw,
  Clock,
  Award,
  Target,
  Globe,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { VehicleInfoSection } from '@/components/survey/VehicleInfoSection';
import { TeamSection } from '@/components/survey/TeamSection';
import { GeographicSection } from '@/components/survey/GeographicSection';
import { InvestmentStrategySection } from '@/components/survey/InvestmentStrategySection';
import { FundOperationsSection } from '@/components/survey/FundOperationsSection';
import { FundStatusSection } from '@/components/survey/FundStatusSection';
import { InvestmentInstrumentsSection } from '@/components/survey/InvestmentInstrumentsSection';
import { SectorReturnsSection } from '@/components/survey/SectorReturnsSection';
import Header from '@/components/layout/Header';
import type { SurveyFormData, TeamMember } from '@/types/survey';

function mapSupabaseSurveyToFormData(data: Record<string, unknown>): SurveyFormData {
  return {
    ...data,
    team_members: Array.isArray(data.team_members)
      ? data.team_members as TeamMember[]
      : typeof data.team_members === 'string'
        ? JSON.parse(data.team_members)
        : [],
    vehicle_websites: Array.isArray(data.vehicle_websites)
      ? data.vehicle_websites
      : typeof data.vehicle_websites === 'string'
        ? JSON.parse(data.vehicle_websites)
        : [],
    legal_domicile: Array.isArray(data.legal_domicile)
      ? data.legal_domicile
      : typeof data.legal_domicile === 'string'
        ? JSON.parse(data.legal_domicile)
        : [],
    fund_stage: Array.isArray(data.fund_stage)
      ? data.fund_stage
      : typeof data.fund_stage === 'string'
        ? JSON.parse(data.fund_stage)
        : [],
    markets_operated: typeof data.markets_operated === 'object' && data.markets_operated !== null
      ? data.markets_operated
      : typeof data.markets_operated === 'string'
        ? JSON.parse(data.markets_operated)
        : {},
    investment_instruments_priority: typeof data.investment_instruments_priority === 'object' && data.investment_instruments_priority !== null
      ? data.investment_instruments_priority
      : typeof data.investment_instruments_priority === 'string'
        ? JSON.parse(data.investment_instruments_priority)
        : {},
    investment_instruments_data: Array.isArray(data.investment_instruments_data)
      ? data.investment_instruments_data
      : typeof data.investment_instruments_data === 'string'
        ? JSON.parse(data.investment_instruments_data)
        : [],
    sectors_allocation: typeof data.sectors_allocation === 'object' && data.sectors_allocation !== null
      ? data.sectors_allocation
      : typeof data.sectors_allocation === 'string'
        ? JSON.parse(data.sectors_allocation)
        : {},
    legal_entity_date_to: typeof data.legal_entity_date_to === 'number' ? data.legal_entity_date_to : data.legal_entity_date_to === 'present' ? 9999 : undefined,
    first_close_date_to: typeof data.first_close_date_to === 'number' ? data.first_close_date_to : data.first_close_date_to === 'present' ? 9999 : undefined,
  };
}

const surveySchema = z.object({
  // Section 1: Vehicle Information
  vehicle_name: z.string().min(1, 'Fund name is required'),
  vehicle_websites: z.array(z.string()).optional(),
  vehicle_type: z.string().optional(),
  vehicle_type_other: z.string().optional(),
  thesis: z.string().optional(),

  // Section 2: Team & Leadership
  team_members: z.array(z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    role: z.string().optional(),
    experience: z.string().optional(),
  })).optional(),
  team_size_min: z.number().optional(),
  team_size_max: z.number().optional(),
  team_description: z.string().min(1, 'Team description is required'),

  // Section 3: Geographic & Market Focus
  legal_domicile: z.array(z.string()).optional(),
  legal_domicile_other: z.string().optional(),
  markets_operated: z.record(z.number()).optional(),
  markets_operated_other: z.string().optional(),

  // Section 4: Investment Strategy
  ticket_size_min: z.number().optional(),
  ticket_size_max: z.number().optional(),
  ticket_description: z.string().optional(),
  target_capital: z.number().optional().refine((val) => {
    if (val === undefined || val === null || val === 0) return true; // Allow empty/zero for viewers
    return val > 0;
  }, 'Target capital must be greater than 0'),
  capital_raised: z.number().optional(),
  capital_in_market: z.number().optional(),

  // Section 5: Fund Operations
  supporting_document_url: z.string().optional(),
  expectations: z.string().optional().refine((val) => {
    if (val === undefined || val === null || val === '') return true; // Allow empty for viewers
    return val.trim().length > 0;
  }, 'Expectations are required'),
  how_heard_about_network: z.string().optional(),
  how_heard_about_network_other: z.string().optional(),

  // Section 6: Fund Status & Timeline
  fund_stage: z.array(z.string()).optional().refine((data) => {
    if (!data || data.length === 0) return true; // Allow empty for viewers
    return data.length > 0;
  }, 'At least one fund stage is required'),
  current_status: z.string().optional(),
  current_status_other: z.string().optional(),
  legal_entity_date_from: z.number().optional(),
  legal_entity_date_to: z.union([z.number(), z.literal('present')]).optional(),
  legal_entity_month_from: z.number().optional(),
  legal_entity_month_to: z.number().optional(),
  first_close_date_from: z.number().optional(),
  first_close_date_to: z.union([z.number(), z.literal('present')]).optional(),
  first_close_month_from: z.number().optional(),
  first_close_month_to: z.number().optional(),

  // Section 7: Investment Instruments
  investment_instruments_priority: z.record(z.number()).optional(),
  investment_instruments_data: z.array(z.object({
    name: z.string(),
    committed: z.number(),
    committedPercentage: z.number(),
    deployed: z.number(),
    deployedValue: z.number(),
    priority: z.number(),
  })).optional().refine((data) => {
    if (!data || data.length === 0) return true; // Allow empty for viewers
    return data.length > 0;
  }, 'At least one investment instrument is required'),

  // Section 8: Sector Focus & Returns
  sectors_allocation: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data || Object.keys(data).length === 0) return true; // Allow empty for viewers
      return Object.keys(data).length > 0;
    },
    'At least one sector focus is required'
  ),
  target_return_min: z.number().optional(),
  target_return_max: z.number().optional(),
  equity_investments_made: z.number().optional(),
  equity_investments_exited: z.number().optional(),
  self_liquidating_made: z.number().optional(),
  self_liquidating_exited: z.number().optional(),
  
  // Metadata
  id: z.string().optional(),
  year: z.number().optional(),
  created_at: z.string().optional(),
  completed_at: z.string().optional(),
});

const Survey = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingResponse, setExistingResponse] = useState<SurveyFormData | null>(null);
  const [pastSurveys, setPastSurveys] = useState<SurveyFormData[]>([]);
  const [showNewSurvey, setShowNewSurvey] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [customYear, setCustomYear] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState<SurveyFormData | null>(null);
  const [formData, setFormData] = useState<Partial<SurveyFormData>>({});
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { user, userRole, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const totalSections = 8;
  const progress = (currentSection / totalSections) * 100;

  // Initialize form first
  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      vehicle_name: '',
      vehicle_websites: [],
      team_members: [], // Empty array for viewers
      legal_domicile: [],
      fund_stage: [],
      markets_operated: {},
      investment_instruments_priority: {},
      investment_instruments_data: [],
      sectors_allocation: {},
      year: new Date().getFullYear(),
    },
  });

  // Professional section configuration
  const sectionConfig = [
    {
      key: 'vehicle_info',
      title: 'Vehicle Information',
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      key: 'team',
      title: 'Team & Leadership',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      key: 'geography',
      title: 'Geographic & Market Focus',
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      key: 'investment_strategy',
      title: 'Investment Strategy',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      key: 'fund_operations',
      title: 'Fund Operations',
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      key: 'fund_status',
      title: 'Fund Status & Timeline',
      icon: Calendar,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
    },
    {
      key: 'investment_instruments',
      title: 'Investment Instruments',
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      key: 'sector_returns',
      title: 'Sector Focus & Returns',
      icon: Award,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  useEffect(() => {
    if (!authLoading && user) {
      loadExistingResponse();
    }
  }, [user, authLoading]);

  const loadExistingResponse = async () => {
    try {
      setIsLoading(true);
      const { data: responses, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', user?.id)
        .order('year', { ascending: false });

      if (error) throw error;

      const mappedResponses = responses?.map(mapSupabaseSurveyToFormData) || [];
      setPastSurveys(mappedResponses);

      if (mappedResponses.length > 0) {
        setExistingResponse(mappedResponses[0]);
        form.reset(mappedResponses[0]);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading existing response:', error);
      toast({
        title: "Error",
        description: "Failed to load existing survey data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const prepareForDb = (formData: SurveyFormData, userId: string, year: number, completed: boolean = false) => {
    const now = new Date().toISOString();
    const dbData: Record<string, unknown> = {
      ...formData,
      user_id: userId,
      year,
      created_at: formData.created_at || now,
      completed_at: completed ? now : null,
      role_badge: userRole,
    };
    
    // Handle date fields that can be 'present'
    if (formData.legal_entity_date_to === 'present') {
      dbData.legal_entity_date_to = 9999;
    }
    if (formData.first_close_date_to === 'present') {
      dbData.first_close_date_to = 9999;
    }
    
    return dbData;
  };

  const onSubmit = async (data: SurveyFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a survey",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const year = selectedYear || new Date().getFullYear();
      const dbData = prepareForDb(data, user.id, year, true);

      let result;
      if (existingResponse?.id) {
        // Update existing response
        result = await supabase
          .from('survey_responses')
          .update(dbData)
          .eq('id', existingResponse.id);
      } else {
        // Create new response
        result = await supabase
          .from('survey_responses')
          .insert([dbData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "Survey submitted successfully!",
      });

      // Reload data to show updated state
      await loadExistingResponse();
      setShowSubmitConfirmation(true);
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSectionValidationRules = (section: number) => {
    const rules: Record<number, string[]> = {
      1: ['vehicle_name'],
      2: ['team_description'],
      3: ['legal_domicile'],
      4: ['ticket_size_min', 'ticket_size_max'],
      5: ['expectations'],
      6: ['fund_stage'],
      7: ['investment_instruments_data'],
      8: ['sectors_allocation'],
    };
    return rules[section] || [];
  };

  const handleNext = () => {
    const currentSectionRules = getSectionValidationRules(currentSection);
    const isValid = form.trigger(currentSectionRules as any);
    
    isValid.then((valid) => {
      if (valid && currentSection < totalSections) {
        setCurrentSection(currentSection + 1);
      }
    });
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a draft",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = form.getValues();
      const year = selectedYear || new Date().getFullYear();
      const dbData = prepareForDb(formData, user.id, year, false);

      let result;
      if (existingResponse?.id) {
        result = await supabase
          .from('survey_responses')
          .update(dbData)
          .eq('id', existingResponse.id);
      } else {
        result = await supabase
          .from('survey_responses')
          .insert([dbData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "Draft saved successfully!",
      });

      await loadExistingResponse();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return <VehicleInfoSection form={form} />;
      case 2:
        return <TeamSection form={form} />;
      case 3:
        return <GeographicSection form={form} />;
      case 4:
        return <InvestmentStrategySection form={form} />;
      case 5:
        return <FundOperationsSection form={form} />;
      case 6:
        return <FundStatusSection form={form} />;
      case 7:
        return <InvestmentInstrumentsSection form={form} />;
      case 8:
        return <SectorReturnsSection form={form} />;
      default:
        return null;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading survey...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show main survey page if not in survey mode
  if (!showNewSurvey) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Professional Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Fund Manager Survey</h1>
                  <p className="text-gray-600 text-sm">Manage your professional survey responses and network information</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-300 text-gray-600"
                  onClick={loadExistingResponse}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Button>
              </div>
            </div>
          </div>

          {/* Professional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Surveys</p>
                    <p className="text-2xl font-bold text-gray-900">{pastSurveys.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Completed responses</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Latest Survey</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pastSurveys.length > 0 ? pastSurveys[0].year : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Most recent year</p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                    <Badge 
                      variant="default" 
                      className="bg-green-100 text-green-700 border-green-200"
                    >
                      Active
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">Ready for new survey</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* New Survey Button */}
          <Card className="mb-8 shadow-sm border-gray-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Start New Survey</h2>
                <p className="text-gray-600 mb-6">Complete a new fund manager survey for the current year</p>
                
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Select value={selectedYear?.toString() || ''} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Year</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {selectedYear === null && (
                    <Input
                      type="number"
                      placeholder="Enter custom year"
                      value={customYear}
                      onChange={(e) => setCustomYear(e.target.value)}
                      className="w-48"
                    />
                  )}
                </div>
                
                <Button
                  onClick={() => {
                    const year = selectedYear || parseInt(customYear) || new Date().getFullYear();
                    setSelectedYear(year);
                    setShowNewSurvey(true);
                    setCurrentSection(1);
                    form.reset({
                      vehicle_name: '',
                      vehicle_websites: [],
                      team_members: [],
                      legal_domicile: [],
                      fund_stage: [],
                      markets_operated: {},
                      investment_instruments_priority: {},
                      investment_instruments_data: [],
                      sectors_allocation: {},
                      year: year,
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  disabled={!selectedYear && !customYear}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Start New Survey
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Past Surveys */}
          {pastSurveys.length > 0 && (
            <Card className="shadow-sm border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-gray-600" />
                  Past Surveys
                </CardTitle>
                <CardDescription>View and manage your previous survey responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastSurveys.map((survey, index) => (
                    <div
                      key={survey.id || index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Survey {survey.year}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {survey.vehicle_name || 'Fund Manager Survey'}
                          </p>
                          {survey.completed_at && (
                            <p className="text-xs text-gray-400">
                              Completed: {new Date(survey.completed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={survey.completed_at ? "default" : "secondary"}
                          className={survey.completed_at ? "bg-green-100 text-green-700 border-green-200" : "bg-yellow-100 text-yellow-700 border-yellow-200"}
                        >
                          {survey.completed_at ? 'Completed' : 'Draft'}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setExistingResponse(survey);
                            form.reset(survey);
                            setSelectedYear(survey.year);
                            setShowNewSurvey(true);
                            setCurrentSection(1);
                          }}
                          className="border-gray-300"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {pastSurveys.length === 0 && (
            <Card className="text-center py-12 bg-white shadow-sm border-gray-200">
              <CardContent>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No surveys yet</h3>
                <p className="text-gray-500 mb-4">Start your first fund manager survey to begin building your professional profile.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show survey form when in survey mode
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Fund Manager Survey</h1>
                <p className="text-gray-600 text-sm">Complete your professional profile and network information</p>
                {selectedYear && (
                  <p className="text-sm text-blue-600 font-medium">Year: {selectedYear}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-600"
                onClick={() => setShowNewSurvey(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Surveys
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-600"
                onClick={loadExistingResponse}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Button>
            </div>
          </div>
        </div>

        {/* Professional Progress Section */}
        <Card className="mb-8 shadow-sm border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Section {currentSection} of {totalSections}
                  </span>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {sectionConfig[currentSection - 1]?.title}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentSection === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentSection === totalSections}
                  className="flex items-center space-x-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Section Indicators */}
            <div className="flex space-x-2">
              {sectionConfig.map((section, index) => (
                <button
                  key={section.key}
                  onClick={() => setCurrentSection(index + 1)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    index + 1 === currentSection
                      ? `${section.bgColor} ${section.borderColor} border text-gray-900`
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{section.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Survey Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="shadow-sm border-gray-200">
              <CardContent className="p-6">
                {renderCurrentSection()}
              </CardContent>
            </Card>

            {/* Professional Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                  className="border-gray-300"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 1}
                  className="border-gray-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                {currentSection < totalSections ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Survey
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Survey;
