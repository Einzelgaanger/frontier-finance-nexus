import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, UserPlus, Eye, EyeOff, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { VehicleInfoSection } from '@/components/survey/VehicleInfoSection';
import { TeamSection } from '@/components/survey/TeamSection';
import { GeographicSection } from '@/components/survey/GeographicSection';
import { InvestmentStrategySection } from '@/components/survey/InvestmentStrategySection';
import { FundOperationsSection } from '@/components/survey/FundOperationsSection';
import { FundStatusSection } from '@/components/survey/FundStatusSection';
import { InvestmentInstrumentsSection } from '@/components/survey/InvestmentInstrumentsSection';
import { SectorReturnsSection } from '@/components/survey/SectorReturnsSection';
import type { SurveyFormData } from '@/types/survey';

// Use the same schema as the Survey page but more lenient for admin creation
const surveySchema = z.object({
  // Account fields
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  survey_year: z.number().min(2020, 'Year must be 2020 or later').max(2030, 'Year must be 2030 or earlier'),
  
  // Section 1: Vehicle Information
  vehicle_name: z.string().optional().refine((val) => {
    if (val === undefined || val === null || val === '') return true; // Allow empty for admin creation
    return val.trim().length > 0;
  }, 'Fund name is required'),
  vehicle_websites: z.array(z.string()).optional(),
  vehicle_type: z.string().optional(),
  vehicle_type_other: z.string().optional(),
  thesis: z.string().optional(),

  // Section 2: Team & Leadership - Completely optional for admin creation
  team_members: z.any().optional(), // Allow any value for team_members
  team_size_min: z.number().optional(),
  team_size_max: z.number().optional(),
  team_description: z.string().optional(),

  // Section 3: Geographic & Market Focus
  legal_domicile: z.array(z.string()).optional(),
  legal_domicile_other: z.string().optional(),
  markets_operated: z.record(z.number()).optional(),
  markets_operated_other: z.string().optional(),

  // Section 4: Investment Strategy
  ticket_size_min: z.number().optional(),
  ticket_size_max: z.number().optional(),
  ticket_description: z.string().optional(),
  target_capital: z.number().optional(),
  capital_raised: z.number().optional(),
  capital_in_market: z.number().optional(),

  // Section 5: Fund Operations
  supporting_document_url: z.string().optional(),
  expectations: z.string().optional(),
  how_heard_about_network: z.string().optional(),
  how_heard_about_network_other: z.string().optional(),

  // Section 6: Fund Status & Timeline
  fund_stage: z.array(z.string()).optional(),
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
    if (!data || data.length === 0) return true; // Allow empty for admin creation
    return data.length > 0;
  }, 'At least one investment instrument is required'),

  // Section 8: Sector Focus & Returns
  sectors_allocation: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data || Object.keys(data).length === 0) return true; // Allow empty for admin creation
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
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ViewerFormData = z.infer<typeof surveySchema>;

interface CreateViewerModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateViewerModal = ({ open, onClose, onSuccess }: CreateViewerModalProps) => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);

  const totalSections = 9; // 1 for account info + 8 for survey sections
  const progress = (currentSection / totalSections) * 100;

  const form = useForm<ViewerFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      survey_year: new Date().getFullYear(),
      vehicle_name: '',
      vehicle_websites: [],
      vehicle_type: '',
      vehicle_type_other: '',
      thesis: '',
      team_members: [], // Start with empty array
      team_size_min: 1,
      team_size_max: 1,
      team_description: '',
      legal_domicile: [],
      legal_domicile_other: '',
      markets_operated: {},
      markets_operated_other: '',
      ticket_size_min: 0,
      ticket_size_max: 0,
      ticket_description: '',
      target_capital: 0,
      capital_raised: 0,
      capital_in_market: 0,
      supporting_document_url: '',
      expectations: '',
      how_heard_about_network: '',
      how_heard_about_network_other: '',
      fund_stage: [],
      current_status: '',
      current_status_other: '',
      legal_entity_date_from: undefined,
      legal_entity_date_to: undefined,
      legal_entity_month_from: undefined,
      legal_entity_month_to: undefined,
      first_close_date_from: undefined,
      first_close_date_to: undefined,
      first_close_month_from: undefined,
      first_close_month_to: undefined,
      investment_instruments_priority: {},
      investment_instruments_data: [],
      sectors_allocation: {},
      target_return_min: 0,
      target_return_max: 0,
      equity_investments_made: 0,
      equity_investments_exited: 0,
      self_liquidating_made: 0,
      self_liquidating_exited: 0,
    }
  });

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

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return null; // Account information is rendered separately
      case 2:
        return <VehicleInfoSection form={form} />;
      case 3:
        return <TeamSection form={form} />;
      case 4:
        return <GeographicSection form={form} />;
      case 5:
        return <InvestmentStrategySection form={form} />;
      case 6:
        return <FundOperationsSection form={form} />;
      case 7:
        return <FundStatusSection form={form} />;
      case 8:
        return <InvestmentInstrumentsSection form={form} />;
      case 9:
        return <SectorReturnsSection form={form} />;
      default:
        return <VehicleInfoSection form={form} />;
    }
  };

  const sectionTitles = [
    "Account Information",
    "Vehicle Information",
    "Team & Leadership", 
    "Geographic & Market Focus",
    "Investment Strategy",
    "Fund Operations",
    "Fund Status & Timeline",
    "Investment Instruments",
    "Sector Focus & Returns"
  ];

  const onSubmit = async (data: ViewerFormData) => {
    console.log('Form submission started with data:', data);
    setIsCreating(true);

    try {
      // Prepare survey data for the database function
      const surveyData = {
        vehicle_name: data.vehicle_name,
        vehicle_websites: data.vehicle_websites || [],
        vehicle_type: data.vehicle_type,
        vehicle_type_other: data.vehicle_type_other,
        thesis: data.thesis,
        team_members: data.team_members || [],
        team_size_min: data.team_size_min,
        team_size_max: data.team_size_max,
        team_description: data.team_description,
        legal_domicile: data.legal_domicile || [],
        legal_domicile_other: data.legal_domicile_other,
        markets_operated: data.markets_operated || {},
        markets_operated_other: data.markets_operated_other,
        ticket_size_min: data.ticket_size_min,
        ticket_size_max: data.ticket_size_max,
        ticket_description: data.ticket_description,
        target_capital: data.target_capital,
        capital_raised: data.capital_raised,
        capital_in_market: data.capital_in_market,
        supporting_document_url: data.supporting_document_url,
        expectations: data.expectations,
        how_heard_about_network: data.how_heard_about_network,
        how_heard_about_network_other: data.how_heard_about_network_other,
        fund_stage: data.fund_stage || [],
        current_status: data.current_status,
        current_status_other: data.current_status_other,
        legal_entity_date_from: data.legal_entity_date_from,
        legal_entity_date_to: data.legal_entity_date_to,
        legal_entity_month_from: data.legal_entity_month_from,
        legal_entity_month_to: data.legal_entity_month_to,
        first_close_date_from: data.first_close_date_from,
        first_close_date_to: data.first_close_date_to,
        first_close_month_from: data.first_close_month_from,
        first_close_month_to: data.first_close_month_to,
        investment_instruments_priority: data.investment_instruments_priority || {},
        investment_instruments_data: (data.investment_instruments_data || []).map((item: any) => ({
          name: item.name ?? '',
          committed: item.committed ?? 0,
          committedPercentage: item.committedPercentage ?? 0,
          deployed: item.deployed ?? 0,
          deployedValue: item.deployedValue ?? 0,
          priority: item.priority ?? 0,
        })),
        sectors_allocation: data.sectors_allocation || {},
        target_return_min: data.target_return_min,
        target_return_max: data.target_return_max,
        equity_investments_made: data.equity_investments_made,
        equity_investments_exited: data.equity_investments_exited,
        self_liquidating_made: data.self_liquidating_made,
        self_liquidating_exited: data.self_liquidating_exited,
      };

      console.log('Calling database function with survey data:', surveyData);

      // Call the Supabase Edge Function to create the user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session found');
      }

      // First, create the user account
      const userResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          role: 'viewer',
          user_metadata: {
            first_name: data.vehicle_name || 'Viewer',
            last_name: 'User',
            vehicle_name: data.vehicle_name
          }
        })
      });

      const userResult = await userResponse.json();

      if (!userResponse.ok) {
        throw new Error(userResult.error || 'Failed to create user account');
      }

      console.log('User created successfully:', userResult);

      // Now create the survey data for the user
      const { data: result, error: surveyError } = await supabase.rpc('create_viewer_survey_data', {
        p_user_id: userResult.user.id,
        p_survey_data: surveyData,
        p_survey_year: data.survey_year
      });

      if (surveyError) {
        console.error('Error creating survey data:', surveyError);
        toast({
          title: "Error Creating Survey Data",
          description: surveyError.message,
          variant: "destructive"
        });
        return;
      }

      console.log('Survey data created successfully:', result);

      toast({
        title: "Viewer Created Successfully",
        description: `Viewer account created for ${data.email} with complete survey data. They can now log in and access the platform.`,
      });

      form.reset();
      setCurrentSection(1);
      onSuccess();
      onClose();

    } catch (error) {
      console.error('Error creating viewer:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Create Viewer with Complete Survey
          </DialogTitle>
          <DialogDescription>
            Create a new viewer account and complete a full survey for them. All survey sections are included.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Section {currentSection} of {totalSections}
            </div>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="mt-2 text-gray-600">
            Complete all sections to create the viewer account with survey
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Form validation errors:', errors);
            
            // Create a more detailed error message
            const errorMessages = Object.entries(errors).map(([field, error]) => {
              if (field === 'team_members' && Array.isArray(error)) {
                return `team_members: ${error.length} validation errors`;
              }
              return `${field}: ${error?.message || 'Required'}`;
            }).join(', ');
            
            console.log('Detailed error messages:', errorMessages);
            
            toast({
              title: "Validation Error",
              description: `Please fix the following issues: ${errorMessages}`,
              variant: "destructive"
            });
          })} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {currentSection === totalSections && <CheckCircle className="w-5 h-5 mr-2 text-green-600" />}
                  {sectionTitles[currentSection - 1]}
                </CardTitle>
                <CardDescription>
                  {currentSection === 1 
                    ? "Enter account information for the new viewer"
                    : currentSection === totalSections 
                    ? "Final section - Review and create viewer with survey"
                    : `Section ${currentSection} of ${totalSections}`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentSection === 1 ? (
                  // Account Information Section
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address *</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="viewer@example.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter password"
                                  className="pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm password"
                                  className="pr-10"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="survey_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Survey Year *</FormLabel>
                            <FormControl>
                              <Input {...field} type="number" min="2020" max="2030" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  // Survey Sections
                  renderCurrentSection()
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between items-center pt-6">
              {currentSection > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
              )}
              
              {currentSection === 1 ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentSection(totalSections)}
                    className="flex items-center gap-2"
                  >
                    <ArrowRight className="h-4 w-4" />
                    Go to Finish
                  </Button>
                </div>
              ) : currentSection === totalSections ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentSection(1)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Start
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Viewer...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Create Viewer
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateViewerModal; 