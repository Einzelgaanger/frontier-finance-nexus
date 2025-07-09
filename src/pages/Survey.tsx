
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { VehicleInfoSection } from '@/components/survey/VehicleInfoSection';
import { TeamSection } from '@/components/survey/TeamSection';
import { GeographicSection } from '@/components/survey/GeographicSection';
import { InvestmentStrategySection } from '@/components/survey/InvestmentStrategySection';
import { FundOperationsSection } from '@/components/survey/FundOperationsSection';
import { FundStatusSection } from '@/components/survey/FundStatusSection';
import { InvestmentInstrumentsSection } from '@/components/survey/InvestmentInstrumentsSection';
import { SectorReturnsSection } from '@/components/survey/SectorReturnsSection';

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
  const { user } = useAuth();
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
    const loadExistingResponse = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', new Date().getFullYear())
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
        };
        form.reset(formData);
      }
    };

    loadExistingResponse();
  }, [user, form]);

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
        year: new Date().getFullYear(),
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
        year: new Date().getFullYear(),
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
        description: "Thank you for completing the survey. You now have full access to the member network.",
      });

      // Redirect to network page after completion
      setTimeout(() => {
        window.location.href = '/network';
      }, 2000);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Member Survey {new Date().getFullYear()}</h1>
            <div className="text-sm text-gray-600">
              Section {currentSection} of {totalSections}
            </div>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-gray-600">
            Complete all sections to gain full access to the member network
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
};

export default Survey;
