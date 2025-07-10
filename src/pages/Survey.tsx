
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ArrowRight, CheckCircle, FileText, Plus, Calendar, Eye, Users, Building2 } from 'lucide-react';
import { VehicleInfoSection } from '@/components/survey/VehicleInfoSection';
import { TeamSection } from '@/components/survey/TeamSection';
import { GeographicSection } from '@/components/survey/GeographicSection';
import { InvestmentStrategySection } from '@/components/survey/InvestmentStrategySection';
import { FundOperationsSection } from '@/components/survey/FundOperationsSection';
import { FundStatusSection } from '@/components/survey/FundStatusSection';
import { InvestmentInstrumentsSection } from '@/components/survey/InvestmentInstrumentsSection';
import { SectorReturnsSection } from '@/components/survey/SectorReturnsSection';
import Header from '@/components/layout/Header';

const surveySchema = z.object({
  // Section 1: Vehicle Information
  vehicle_websites: z.array(z.string()).optional(),
  vehicle_type: z.string().min(1, "Vehicle type is required"),
  vehicle_type_other: z.string().optional(),
  thesis: z.string().min(10, "Thesis must be at least 10 characters"),

  // Section 2: Team & Leadership
  team_members: z.array(z.object({
    name: z.string(),
    role: z.string(),
    experience: z.string()
  })).optional(),
  team_size_min: z.number().min(1, "Minimum team size is required"),
  team_size_max: z.number().min(1, "Maximum team size is required"),
  team_description: z.string().min(10, "Team description is required"),

  // Section 3: Geographic & Market Focus
  legal_domicile: z.array(z.string()).min(1, "At least one legal domicile is required"),
  markets_operated: z.record(z.number()).optional(),

  // Section 4: Investment Strategy
  ticket_size_min: z.number().min(0, "Minimum ticket size is required"),
  ticket_size_max: z.number().min(0, "Maximum ticket size is required"),
  ticket_description: z.string().optional(),
  target_capital: z.number().min(0, "Target capital is required"),
  capital_raised: z.number().min(0, "Capital raised is required"),
  capital_in_market: z.number().min(0, "Capital in market is required"),

  // Section 5: Fund Operations
  supporting_document_url: z.string().optional(),
  information_sharing: z.string().min(1, "Information sharing preference is required"),
  expectations: z.string().min(10, "Expectations are required"),
  how_heard_about_network: z.string().min(1, "How you heard about us is required"),

  // Section 6: Fund Status & Timeline
  fund_stage: z.array(z.string()).min(1, "At least one fund stage is required"),
  current_status: z.string().min(1, "Current status is required"),
  legal_entity_date_from: z.number().optional(),
  legal_entity_date_to: z.number().optional(),
  legal_entity_month_from: z.number().optional(),
  legal_entity_month_to: z.number().optional(),
  first_close_date_from: z.number().optional(),
  first_close_date_to: z.number().optional(),
  first_close_month_from: z.number().optional(),
  first_close_month_to: z.number().optional(),

  // Section 7: Investment Instruments
  investment_instruments_priority: z.record(z.number()).optional(),

  // Section 8: Sector Focus & Returns
  sectors_allocation: z.record(z.number()).optional(),
  target_return_min: z.number().min(0, "Minimum target return is required"),
  target_return_max: z.number().min(0, "Maximum target return is required"),
  equity_investments_made: z.number().min(0, "Equity investments made is required"),
  equity_investments_exited: z.number().min(0, "Equity investments exited is required"),
  self_liquidating_made: z.number().min(0, "Self-liquidating investments made is required"),
  self_liquidating_exited: z.number().min(0, "Self-liquidating investments exited is required"),
});

type SurveyFormData = z.infer<typeof surveySchema>;

const Survey = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingResponse, setExistingResponse] = useState<any>(null);
  const [pastSurveys, setPastSurveys] = useState<any[]>([]);
  const [showNewSurvey, setShowNewSurvey] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  const totalSections = 8;
  const progress = (currentSection / totalSections) * 100;

  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      vehicle_websites: [],
      team_members: [],
      legal_domicile: [],
      fund_stage: [],
      team_size_min: 1,
      team_size_max: 1,
      ticket_size_min: 0,
      ticket_size_max: 0,
      target_capital: 0,
      capital_raised: 0,
      capital_in_market: 0,
      target_return_min: 0,
      target_return_max: 0,
      equity_investments_made: 0,
      equity_investments_exited: 0,
      self_liquidating_made: 0,
      self_liquidating_exited: 0,
    }
  });

  useEffect(() => {
    if (user) {
      fetchPastSurveys();
    }
  }, [user]);

  const fetchPastSurveys = async () => {
    try {
      let query = supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      // If member, only show their surveys
      if (userRole === 'member') {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPastSurveys(data || []);
    } catch (error) {
      console.error('Error fetching past surveys:', error);
    }
  };

  useEffect(() => {
    const loadExistingResponse = async () => {
      if (!user || !showNewSurvey) return;

      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', selectedYear)
        .single();

      if (data && !error) {
        setExistingResponse(data);
        // Reset form with existing data
        const formData = {
          ...data,
          legal_entity_month_from: data.legal_entity_month_from || undefined,
          legal_entity_month_to: data.legal_entity_month_to || undefined,
          first_close_month_from: data.first_close_month_from || undefined,
          first_close_month_to: data.first_close_month_to || undefined,
          team_members: Array.isArray(data.team_members) ? data.team_members as { name?: string; role?: string; experience?: string; }[] : [],
          vehicle_websites: Array.isArray(data.vehicle_websites) ? data.vehicle_websites : [],
          legal_domicile: Array.isArray(data.legal_domicile) ? data.legal_domicile : [],
          fund_stage: Array.isArray(data.fund_stage) ? data.fund_stage : [],
          markets_operated: typeof data.markets_operated === 'object' ? data.markets_operated as { [key: string]: number } : {},
          investment_instruments_priority: typeof data.investment_instruments_priority === 'object' ? data.investment_instruments_priority as { [key: string]: number } : {},
          sectors_allocation: typeof data.sectors_allocation === 'object' ? data.sectors_allocation as { [key: string]: number } : {},
        };
        form.reset(formData);
      } else {
        setExistingResponse(null);
        form.reset();
      }
    };

    loadExistingResponse();
  }, [user, form, showNewSurvey, selectedYear]);

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSaveDraft = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const formData = form.getValues();
      const surveyData = {
        user_id: user.id,
        year: selectedYear,
        ...formData,
        legal_entity_month_from: formData.legal_entity_month_from || null,
        legal_entity_month_to: formData.legal_entity_month_to || null,
        first_close_month_from: formData.first_close_month_from || null,
        first_close_month_to: formData.first_close_month_to || null,
      };

      if (existingResponse) {
        const { error } = await supabase
          .from('survey_responses')
          .update(surveyData)
          .eq('id', existingResponse.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('survey_responses')
          .insert(surveyData);

        if (error) throw error;
      }

      toast({
        title: "Draft Saved",
        description: "Your progress has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: SurveyFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const surveyData = {
        user_id: user.id,
        year: selectedYear,
        completed_at: new Date().toISOString(),
        ...data,
        legal_entity_month_from: data.legal_entity_month_from || null,
        legal_entity_month_to: data.legal_entity_month_to || null,
        first_close_month_from: data.first_close_month_from || null,
        first_close_month_to: data.first_close_month_to || null,
      };

      if (existingResponse) {
        const { error } = await supabase
          .from('survey_responses')
          .update(surveyData)
          .eq('id', existingResponse.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('survey_responses')
          .insert(surveyData);

        if (error) throw error;
      }

      toast({
        title: "Survey Completed!",
        description: "Thank you for completing the survey.",
      });

      // Refresh past surveys and reset form
      fetchPastSurveys();
      setShowNewSurvey(false);
      setCurrentSection(1);

    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit survey. Please try again.",
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
        return <VehicleInfoSection form={form} />;
    }
  };

  const sectionTitles = [
    "Vehicle Information",
    "Team & Leadership", 
    "Geographic & Market Focus",
    "Investment Strategy",
    "Fund Operations",
    "Fund Status & Timeline",
    "Investment Instruments",
    "Sector Focus & Returns"
  ];

  // If showing new survey form
  if (showNewSurvey) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewSurvey(false)}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Surveys
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">Survey {selectedYear}</h1>
              </div>
              <div className="text-sm text-gray-600">
                Section {currentSection} of {totalSections}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="mt-2 text-gray-600">
              Complete all sections to submit your survey
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {currentSection === totalSections && <CheckCircle className="w-5 h-5 mr-2 text-green-600" />}
                    {sectionTitles[currentSection - 1]}
                  </CardTitle>
                  <CardDescription>
                    {currentSection === totalSections 
                      ? "Final section - Review and submit your survey"
                      : `Section ${currentSection} of ${totalSections}`
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderCurrentSection()}
                </CardContent>
              </Card>

              <div className="flex justify-between items-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentSection === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSaveDraft}
                  disabled={isSubmitting}
                >
                  Save Draft
                </Button>

                {currentSection < totalSections ? (
                  <Button 
                    type="button" 
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Complete Survey'}
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  // Main survey management view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Survey Management</h1>
          <p className="text-gray-600">
            {userRole === 'member' 
              ? 'Manage your survey submissions and create new surveys'
              : 'View and manage all survey submissions across the network'
            }
          </p>
        </div>

        <Tabs defaultValue="surveys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="surveys" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Past Surveys</span>
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Survey</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surveys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Survey History
                </CardTitle>
                <CardDescription>
                  {userRole === 'member' 
                    ? 'Your completed and draft surveys'
                    : 'All survey submissions in the network'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pastSurveys.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
                    <p className="text-gray-600 mb-4">
                      {userRole === 'member' 
                        ? 'You haven\'t submitted any surveys yet.'
                        : 'No surveys have been submitted yet.'
                      }
                    </p>
                    {userRole === 'member' && (
                      <Button onClick={() => setShowNewSurvey(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Survey
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastSurveys.map((survey) => (
                      <div key={survey.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Survey {survey.year}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(survey.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={survey.completed_at ? "default" : "secondary"}
                            className={survey.completed_at ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            {survey.completed_at ? "Completed" : "Draft"}
                          </Badge>
                          {userRole === 'member' && !survey.completed_at && (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setSelectedYear(survey.year);
                                setShowNewSurvey(true);
                              }}
                            >
                              Continue
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="new" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Survey
                </CardTitle>
                <CardDescription>
                  Choose a year and start a new survey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Select Survey Year</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose which year this survey data represents. You can create surveys for different years.
                    </p>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map((year) => (
                          <Button
                            key={year}
                            variant="outline"
                            onClick={() => {
                              setSelectedYear(year);
                              setShowNewSurvey(true);
                            }}
                            className="flex items-center space-x-2"
                          >
                            <Calendar className="w-4 h-4" />
                            <span>{year}</span>
                          </Button>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Select the year that best represents your fund's data for this survey period.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Survey;
