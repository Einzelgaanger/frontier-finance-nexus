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
      supporting_document_url: '',
      expectations: '',
      how_heard_about_network: '',
      how_heard_about_network_other: '',
      vehicle_type: '',
      vehicle_type_other: '',
      thesis: '',
      team_description: '',
      legal_domicile_other: '',
      markets_operated: {},
      markets_operated_other: '',
      ticket_description: '',
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
    }
  });



  const fetchPastSurveys = useCallback(async () => {
    try {
      let query = supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      // If member or viewer, only show their surveys; admins can see all
      if (userRole === 'member' || userRole === 'viewer') {
        query = query.eq('user_id', user.id);
      }
      // Admins can see all surveys (no additional filter needed)

      const { data, error } = await query;
      if (error) throw error;
      setPastSurveys((data || []).map(mapSupabaseSurveyToFormData));
    } catch (error) {
      console.error('Error fetching past surveys:', error);
    }
  }, [userRole, user?.id]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchPastSurveys();
      setIsLoading(false);
    }
  }, [user, authLoading, fetchPastSurveys]);

  // Ensure form data persists between sections
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log('Form field changed:', name, type, value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const loadExistingResponse = async () => {
      if (!user || !showNewSurvey || !selectedYear) return;

      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', selectedYear)
        .maybeSingle();

      if (data && !error) {
        const mapped = mapSupabaseSurveyToFormData(data);
        setExistingResponse(mapped);
        form.reset(mapped);
      } else {
        setExistingResponse(null);
        form.reset();
      }
    };

    loadExistingResponse();
  }, [user, form, showNewSurvey, selectedYear]);



  const prepareForDb = (formData: SurveyFormData, userId: string, year: number, completed: boolean = false) => {
    const dbData: any = {
      user_id: userId,
      year,
      role_badge: userRole || 'viewer',
      completed_at: completed ? new Date().toISOString() : null,
      
      // Section 1: Basic Vehicle Information
      vehicle_name: formData.vehicle_name || null,
      vehicle_websites: formData.vehicle_websites || [],
      vehicle_type: formData.vehicle_type || null,
      thesis: formData.thesis || null,
      
      // Section 2: Team & Leadership
      team_members: userRole === 'viewer' ? [] : (formData.team_members || []),
      team_size_min: formData.team_size_min || null,
      team_size_max: formData.team_size_max || null,
      team_description: formData.team_description || null,
      
      // Section 3: Geographic & Market Focus
      legal_domicile: formData.legal_domicile || [],
      markets_operated: formData.markets_operated || {},
      
      // Section 4: Investment Strategy
      ticket_size_min: formData.ticket_size_min || null,
      ticket_size_max: formData.ticket_size_max || null,
      ticket_description: formData.ticket_description || null,
      target_capital: formData.target_capital || null,
      capital_raised: formData.capital_raised || null,
      capital_in_market: formData.capital_in_market || null,
      
      // Section 5: Fund Operations
      supporting_document_url: formData.supporting_document_url || null,
      expectations: formData.expectations || null,
      how_heard_about_network: formData.how_heard_about_network || null,
      how_heard_about_network_other: formData.how_heard_about_network_other || null,
      
      // Section 6: Fund Status & Timeline
      fund_stage: formData.fund_stage || [],
      current_status: formData.current_status || null,
      legal_entity_date_from: formData.legal_entity_date_from || null,
      legal_entity_date_to: formData.legal_entity_date_to === 9999 ? 'present' : formData.legal_entity_date_to,
      first_close_date_from: formData.first_close_date_from || null,
      first_close_date_to: formData.first_close_date_to === 9999 ? 'present' : formData.first_close_date_to,
      
      // Section 7: Investment Instruments
      investment_instruments_priority: formData.investment_instruments_priority || {},
      investment_instruments_data: formData.investment_instruments_data || [],
      
      // Section 8: Sector Focus & Returns
      sectors_allocation: formData.sectors_allocation || {},
      target_return_min: formData.target_return_min || null,
      target_return_max: formData.target_return_max || null,
      equity_investments_made: formData.equity_investments_made || null,
      equity_investments_exited: formData.equity_investments_exited || null,
      self_liquidating_made: formData.self_liquidating_made || null,
      self_liquidating_exited: formData.self_liquidating_exited || null,
    };
    return dbData;
  };

  const onSubmit = async (data: SurveyFormData) => {
    console.log('=== SURVEY SUBMISSION STARTED ===');
    console.log('Submitting survey with data:', data);
    console.log('Form is valid:', form.formState.isValid);
    console.log('Form errors:', form.formState.errors);
    console.log('User:', user);
    console.log('Selected year:', selectedYear);
    console.log('User role:', userRole);
    
    // Debug form state
    console.log('Form state:', {
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
      errors: form.formState.errors,
      values: form.getValues()
    });
    
    // For viewers, we'll be more lenient with validation
    const isViewer = userRole === 'viewer';
    
    // For viewers, skip schema validation and use custom validation
    if (isViewer) {
      // For viewers, just check basic required fields
      if (!data.vehicle_name || !data.team_description || !data.expectations) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill in Fund Name, Team Description, and Expectations.",
          variant: "destructive"
        });
        return;
      }
      
      // Ensure team_members is treated as optional for viewers
      if (!data.team_members) {
        data.team_members = [];
      }
    } else {
      // For members/admins, use full schema validation
      const validationResult = await form.trigger();
      if (!validationResult) {
        console.log('Final validation failed');
        return;
      }
    }
    
    if (!user) {
      console.log('No user found');
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your survey.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedYear) {
      console.log('No year selected');
      toast({
        title: "Year Required",
        description: "Please select a year for this survey.",
        variant: "destructive"
      });
      return;
    }

    // Validate market allocation doesn't exceed 100% (skip for viewers)
    const totalMarketAllocation = Object.values(data.markets_operated || {}).reduce((sum, val) => sum + val, 0);
    if (!isViewer && totalMarketAllocation > 100) {
      console.log('Market allocation exceeds 100%');
      toast({
        title: "Invalid Market Allocation",
        description: "Total market allocation cannot exceed 100%.",
        variant: "destructive"
      });
      return;
    }

    console.log('All validations passed, starting submission...');
    setIsSubmitting(true);
    setShowSubmitConfirmation(false);
    
    try {
      console.log('Preparing data for database...');
      const surveyData = prepareForDb(data, user.id, selectedYear, true);
      console.log('Survey data prepared:', surveyData);

      // First, save to survey_responses table
      let result;
      if (existingResponse?.id) {
        console.log('Updating existing survey response...');
        result = await supabase
          .from('survey_responses')
          .update(surveyData)
          .eq('id', existingResponse.id)
          .eq('user_id', user.id);
      } else {
        console.log('Creating new survey response...');
        result = await supabase
          .from('survey_responses')
          .insert([surveyData]);
      }

      if (result.error) {
        console.error('Supabase error:', result.error);
        throw result.error;
      }

      console.log('Survey response saved successfully');

      // Then, create/update entry in member_surveys table for network visibility
      const memberSurveyData = {
        user_id: user.id,
        fund_name: data.vehicle_name || 'Unknown Fund',
        website: data.vehicle_websites?.[0] || null,
        fund_type: data.vehicle_type || 'Unknown',
        primary_investment_region: Object.keys(data.markets_operated || {}).join(', ') || null,
        year_founded: data.legal_entity_date_from || null,
        team_size: data.team_size_max || null,
        typical_check_size: data.ticket_size_min && data.ticket_size_max 
          ? `$${data.ticket_size_min.toLocaleString()} - $${data.ticket_size_max.toLocaleString()}`
          : null,
        aum: data.capital_raised ? `$${data.capital_raised.toLocaleString()}` : null,
        investment_thesis: data.thesis || null,
        sector_focus: Object.keys(data.sectors_allocation || {}),
        stage_focus: data.fund_stage || [],
        role_badge: userRole || 'viewer',
        completed_at: new Date().toISOString()
      };

      console.log('Member survey data prepared:', memberSurveyData);

      // Check if member survey already exists
      const { data: existingMemberSurvey } = await supabase
        .from('member_surveys')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingMemberSurvey) {
        console.log('Updating existing member survey...');
        // Update existing member survey
        const { error: memberSurveyError } = await supabase
          .from('member_surveys')
          .update(memberSurveyData)
          .eq('user_id', user.id);

        if (memberSurveyError) {
          console.error('Error updating member survey:', memberSurveyError);
          // Don't throw here as the main survey was saved successfully
        } else {
          console.log('Member survey updated successfully');
        }
      } else {
        console.log('Creating new member survey...');
        // Create new member survey
        const { error: memberSurveyError } = await supabase
          .from('member_surveys')
          .insert([memberSurveyData]);

        if (memberSurveyError) {
          console.error('Error creating member survey:', memberSurveyError);
          // Don't throw here as the main survey was saved successfully
        } else {
          console.log('Member survey created successfully');
        }
      }

      toast({
        title: "Survey Submitted Successfully!",
        description: `Your ${selectedYear} survey has been completed and submitted. You are now visible in the network!`,
      });

      // Refresh past surveys and reset form
      await fetchPastSurveys();
      setShowNewSurvey(false);
      setCurrentSection(1);
      form.reset();

    } catch (error) {
      console.error('Submit error:', error);
      
      // Check if it's a validation error
      if (error?.message?.includes('team_members')) {
        toast({
          title: "Validation Error",
          description: "Please ensure all required fields are filled. Team members are optional for viewers.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Submission Failed",
          description: error?.message || "Failed to submit survey. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section validation rules
  const getSectionValidationRules = (section: number) => {
    const currentValues = form.getValues();
    const isViewer = userRole === 'viewer';
    
    console.log('Section validation for section', section, 'with values:', currentValues);
    
    switch (section) {
      case 1: // Vehicle Information
        const hasVehicleName = currentValues.vehicle_name && currentValues.vehicle_name.trim() !== '';
        console.log('Section 1 validation:', { hasVehicleName, vehicleName: currentValues.vehicle_name });
        return {
          isValid: hasVehicleName,
          missingFields: !hasVehicleName ? ['Fund Name'] : []
        };
      case 2: // Team & Leadership
        const hasTeamDescription = currentValues.team_description && currentValues.team_description.trim() !== '';
        console.log('Section 2 validation:', { hasTeamDescription, teamDescription: currentValues.team_description });
        return {
          isValid: hasTeamDescription,
          missingFields: !hasTeamDescription ? ['Team Description'] : []
        };
      case 3: // Geographic & Market Focus
        // For viewers, allow empty market allocation but if they provide it, validate it
        const totalMarketAllocation = Object.values(currentValues.markets_operated || {}).reduce((sum, val) => sum + val, 0);
        const hasMarketData = Object.keys(currentValues.markets_operated || {}).length > 0;
        return {
          isValid: isViewer ? true : (hasMarketData ? (totalMarketAllocation > 0 && totalMarketAllocation <= 100) : true),
          missingFields: isViewer ? [] : (hasMarketData && totalMarketAllocation === 0 ? ['Market Allocation'] : hasMarketData && totalMarketAllocation > 100 ? ['Market Allocation (exceeds 100%)'] : [])
        };
      case 4: // Investment Strategy
        return {
          isValid: isViewer ? true : (!currentValues.target_capital || currentValues.target_capital > 0),
          missingFields: isViewer ? [] : (currentValues.target_capital && currentValues.target_capital <= 0 ? ['Target Capital'] : [])
        };
      case 5: // Fund Operations
        return {
          isValid: currentValues.expectations && currentValues.expectations.trim() !== '',
          missingFields: !currentValues.expectations || currentValues.expectations.trim() === '' ? ['Expectations'] : []
        };
      case 6: // Fund Status & Timeline
        // For viewers, allow empty fund stage
        return {
          isValid: isViewer ? true : (currentValues.fund_stage && currentValues.fund_stage.length > 0),
          missingFields: isViewer ? [] : (!currentValues.fund_stage || currentValues.fund_stage.length === 0 ? ['Fund Stage'] : [])
        };
      case 7: // Investment Instruments
        // For viewers, allow empty investment instruments
        return {
          isValid: isViewer ? true : (currentValues.investment_instruments_data && currentValues.investment_instruments_data.length > 0),
          missingFields: isViewer ? [] : (!currentValues.investment_instruments_data || currentValues.investment_instruments_data.length === 0 ? ['Investment Instruments'] : [])
        };
      case 8: // Sector Focus & Returns
        // For viewers, allow empty sector allocation
        return {
          isValid: isViewer ? true : (currentValues.sectors_allocation && Object.keys(currentValues.sectors_allocation).length > 0),
          missingFields: isViewer ? [] : (!currentValues.sectors_allocation || Object.keys(currentValues.sectors_allocation).length === 0 ? ['Sector Focus'] : [])
        };
      default:
        return { isValid: true, missingFields: [] };
    }
  };

  const handleNext = () => {
    console.log('handleNext called for section:', currentSection);
    const currentValues = form.getValues();
    console.log('Current form values:', currentValues);
    
    // Force form to update with current values
    form.trigger();
    
    const validation = getSectionValidationRules(currentSection);
    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
      console.log('Section validation FAILED - preventing progression');
      
      // Trigger vibration if available
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      // Show error toast
      toast({
        title: "Section Incomplete",
        description: `Please complete the following required fields: ${validation.missingFields.join(', ')}`,
        variant: "destructive"
      });
      
      // Trigger form validation to show red highlights
      form.trigger();
      return;
    }

    console.log('Section validation PASSED - proceeding to next section');
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    } else if (currentSection === totalSections) {
      // Submit directly without validation - let the form handle it
      console.log('Submitting survey from handleNext...');
      console.log('Form values:', form.getValues());
      
      // For viewers, bypass schema validation
      if (userRole === 'viewer') {
        onSubmit(form.getValues());
      } else {
        form.handleSubmit(onSubmit)();
      }
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
      const surveyData = prepareForDb(formData, user.id, selectedYear || 0, false);

      if (existingResponse) {
        const { error } = await supabase
          .from('survey_responses')
          .update(surveyData);

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

  // Show loading state while auth is loading or user is not available
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                {(() => {
                  const validation = getSectionValidationRules(currentSection);
                  return validation.isValid ? (
                    <span className="ml-2 text-green-600 font-semibold">✓ Complete</span>
                  ) : (
                    <span className="ml-2 text-red-600 font-semibold">⚠ Incomplete - Required fields missing</span>
                  );
                })()}
              </div>
            </div>
            <Progress value={progress} className="w-full" />
            <p className="mt-2 text-gray-600">
              Complete all sections to submit your survey
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={(e) => {
              e.preventDefault();
              
              // For viewers, bypass schema validation
              if (userRole === 'viewer') {
                const formData = form.getValues();
                console.log('Viewer form submission - bypassing schema validation');
                onSubmit(formData);
              } else {
                // For members/admins, use normal form validation
                form.handleSubmit(onSubmit, (errors) => {
                  console.log('Form validation errors:', errors);
                  console.log('Form values:', form.getValues());
                  
                  // Create a more detailed error message
                  const errorMessages = Object.entries(errors).map(([field, error]) => {
                    return `${field}: ${error?.message || 'Required'}`;
                  }).join(', ');
                  
                  toast({
                    title: "Validation Error",
                    description: `Please fix the following issues: ${errorMessages}`,
                    variant: "destructive"
                  });
                  return; // Prevent submission on validation errors
                })(e);
              }
            }} className="space-y-8">
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
                    className={(() => {
                      const validation = getSectionValidationRules(currentSection);
                      return validation.isValid 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-red-600 hover:bg-red-700";
                    })()}
                  >
                    {(() => {
                      const validation = getSectionValidationRules(currentSection);
                      return validation.isValid ? "Next" : "Complete Section First";
                    })()}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Survey'}
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
            {userRole === 'member' || userRole === 'viewer'
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
                  {userRole === 'member' || userRole === 'viewer'
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
                      {userRole === 'member' || userRole === 'viewer'
                        ? 'You haven\'t submitted any surveys yet.'
                        : 'No surveys have been submitted yet.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastSurveys.map((survey) => {
                      const isDraft = !survey.completed_at;
                      return (
                        <div
                          key={survey.id}
                          className={`flex items-center justify-between p-4 border rounded-lg ${isDraft ? 'hover:bg-blue-50 cursor-pointer' : ''}`}
                          onClick={() => {
                            if (!isDraft) return;
                            setSelectedYear(survey.year);
                            setShowNewSurvey(true);
                            setExistingResponse(survey);
                            form.reset(survey);
                            setCurrentSection(1);
                          }}
                        >
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
                          </div>
                        </div>
                      );
                    })}
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
                        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((year) => (
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
                        Or enter a custom year:
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Enter year (e.g., 2020)"
                          value={customYear}
                          onChange={(e) => setCustomYear(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="2020"
                          max="2030"
                        />
                        <Button
                          variant="outline"
                          onClick={() => {
                            const year = parseInt(customYear);
                            if (year >= 2020 && year <= 2030) {
                              setSelectedYear(year);
                              setShowNewSurvey(true);
                              setCustomYear('');
                            }
                          }}
                          disabled={!customYear || parseInt(customYear) < 2020 || parseInt(customYear) > 2030}
                        >
                          Create Survey
                        </Button>
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
