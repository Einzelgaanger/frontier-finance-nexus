// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSurveyPersistence } from '@/hooks/useSurveyPersistence';
import { useSurveyStatus } from '@/hooks/useSurveyStatus';
import { useSurveyAutosave } from '@/hooks/useSurveyAutosave';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import ReadOnlySurvey2021 from '@/components/survey/ReadOnlySurvey2021';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Schema for 2021 survey
const survey2021Schema = z.object({
  // Section 1: Background Information
  email_address: z.string().email("Valid email is required"),
  firm_name: z.string().min(1, "Firm name is required"),
  participant_name: z.string().min(1, "Participant name is required"),
  role_title: z.string().min(1, "Role/title is required"),
  team_based: z.array(z.string()).min(1, "Please select at least one team location"),
  team_based_other: z.string().optional(),
  geographic_focus: z.array(z.string()).min(1, "Please select at least one geographic focus"),
  geographic_focus_other: z.string().optional(),
  fund_stage: z.string().min(1, "Fund stage is required"),
  fund_stage_other: z.string().optional(),
  legal_entity_date: z.string().min(1, "Legal entity date is required"),
  first_close_date: z.string().min(1, "First close date is required"),
  first_investment_date: z.string().min(1, "First investment date is required"),
  
  // Section 2: Investment Thesis & Capital Construct
  investments_march_2020: z.string().min(1, "March 2020 investments is required"),
  investments_december_2020: z.string().min(1, "December 2020 investments is required"),
  optional_supplement: z.string().optional(),
  investment_vehicle_type: z.array(z.string()).min(1, "Please select at least one vehicle type"),
  investment_vehicle_type_other: z.string().optional(),
  current_fund_size: z.string().min(1, "Current fund size is required"),
  target_fund_size: z.string().min(1, "Target fund size is required"),
  investment_timeframe: z.string().min(1, "Investment timeframe is required"),
  investment_timeframe_other: z.string().optional(),
  business_model_targeted: z.array(z.string()).min(1, "Please select at least one business model"),
  business_model_targeted_other: z.string().optional(),
  business_stage_targeted: z.array(z.string()).min(1, "Please select at least one business stage"),
  business_stage_targeted_other: z.string().optional(),
  financing_needs: z.array(z.string()).min(1, "Please select at least one financing need"),
  financing_needs_other: z.string().optional(),
  target_capital_sources: z.array(z.string()).min(1, "Please select at least one capital source"),
  target_capital_sources_other: z.string().optional(),
  target_irr_achieved: z.string().min(1, "Achieved IRR is required"),
  target_irr_targeted: z.string().min(1, "Targeted IRR is required"),
  impact_vs_financial_orientation: z.string().min(1, "Impact vs financial orientation is required"),
  impact_vs_financial_orientation_other: z.string().optional(),
  explicit_lens_focus: z.array(z.string()).min(1, "Please select at least one lens focus"),
  explicit_lens_focus_other: z.string().optional(),
  report_sustainable_development_goals: z.boolean(),
  top_sdg_1: z.string().optional(),
  top_sdg_2: z.string().optional(),
  top_sdg_3: z.string().optional(),
  top_sdgs: z.record(z.string(), z.string()).optional(),
  other_sdgs: z.array(z.string()).optional(),
  gender_considerations_investment: z.array(z.string()).min(1, "Please select at least one gender consideration"),
  gender_considerations_investment_other: z.string().optional(),
  gender_considerations_requirement: z.array(z.string()).min(1, "Please select at least one gender requirement"),
  gender_considerations_requirement_other: z.string().optional(),
  gender_considerations_other_enabled: z.boolean().optional(),
  gender_fund_vehicle: z.array(z.string()).min(1, "Please select at least one gender fund vehicle"),
  gender_fund_vehicle_other: z.string().optional(),
  
  // Section 3: Portfolio Construction and Team
  investment_size_your_amount: z.string().min(1, "Your investment amount is required"),
  investment_size_total_raise: z.string().min(1, "Total raise amount is required"),
  investment_forms: z.array(z.string()).min(1, "Please select at least one investment form"),
  investment_forms_other: z.string().optional(),
  target_sectors: z.array(z.string()).min(1, "Please select at least one target sector"),
  target_sectors_other: z.string().optional(),
  carried_interest_principals: z.string().min(1, "Number of principals is required"),
  current_ftes: z.string().min(1, "Current FTEs is required"),
  
  // Section 4: Portfolio Development & Investment Return Monetization
  portfolio_needs_ranking: z.record(z.string(), z.string()),
  portfolio_needs_other: z.string().optional(),
  portfolio_needs_other_enabled: z.boolean().optional(),
  investment_monetization: z.array(z.string()).min(1, "Please select at least one monetization method"),
  investment_monetization_other: z.string().optional(),
  exits_achieved: z.string().min(1, "Number of exits is required"),
  exits_achieved_other: z.string().optional(),
  fund_capabilities_ranking: z.record(z.string(), z.string()),
  fund_capabilities_other: z.string().optional(),
  fund_capabilities_other_enabled: z.boolean().optional(),
  
  // Section 5: Impact of COVID-19 on Vehicle and Portfolio
  covid_impact_aggregate: z.string().min(1, "COVID-19 impact is required"),
  covid_impact_portfolio: z.record(z.string(), z.record(z.string(), z.string())),
  covid_government_support: z.array(z.string()).min(1, "Please select at least one government support"),
  covid_government_support_other: z.string().optional(),
  raising_capital_2021: z.array(z.string()).min(1, "Please select at least one capital raising purpose"),
  raising_capital_2021_other: z.string().optional(),
  fund_vehicle_considerations: z.array(z.string()).min(1, "Please select at least one consideration"),
  fund_vehicle_considerations_other: z.string().optional(),
  
  // Section 6: Feedback on ESCP Network Membership
  network_value_rating: z.string().min(1, "Network value rating is required"),
  working_groups_ranking: z.record(z.string(), z.string()),
  new_working_group_suggestions: z.string().optional(),
  webinar_content_ranking: z.record(z.string(), z.string()),
  new_webinar_suggestions: z.string().optional(),
  communication_platform: z.string().min(1, "Communication platform is required"),
  communication_platform_other: z.string().optional(),
  network_value_areas: z.record(z.string(), z.string()),
  present_connection_session: z.string().min(1, "Please select an option"),
  present_connection_session_other: z.string().optional(),
  convening_initiatives_ranking: z.record(z.string(), z.string()),
  convening_initiatives_other: z.string().optional(),
  convening_initiatives_other_enabled: z.boolean().optional(),
  convening_initiatives_other_ranking: z.string().optional(),
  
  // Section 7: 2021 Convening Objectives & Goals
  participate_mentoring_program: z.string().optional(),
  participate_mentoring_program_other: z.string().optional(),
  present_demystifying_session: z.array(z.string()).min(1, "Please select at least one session topic"),
  present_demystifying_session_other: z.string().optional(),
  present_demystifying_session_other_enabled: z.boolean().optional(),
  additional_comments: z.string().optional(),
});

type Survey2021FormData = z.infer<typeof survey2021Schema>;

const Survey2021: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { isSurveyCompleted } = useSurveyStatus();
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Initialize persistence hook
  const {
    saveCurrentSection,
    saveScrollPosition,
    getLastSection,
    clearSavedData,
    setupAutoSave,
    getSavedFormData,
    saveFormData,
  } = useSurveyPersistence({ surveyKey: 'survey2021' });

  const totalSections = 7;
  const progress = (currentSection / totalSections) * 100;

  const form = useForm<Survey2021FormData>({
    resolver: zodResolver(survey2021Schema),
    defaultValues: {
      email_address: '',
      firm_name: '',
      participant_name: '',
      role_title: '',
      team_based: [],
      team_based_other: '',
      geographic_focus: [],
      geographic_focus_other: '',
      fund_stage: '',
      fund_stage_other: '',
      legal_entity_date: '',
      first_close_date: '',
      first_investment_date: '',
      investments_march_2020: '',
      investments_december_2020: '',
      optional_supplement: '',
      investment_vehicle_type: [],
      investment_vehicle_type_other: '',
      current_fund_size: '',
      target_fund_size: '',
      investment_timeframe: '',
      investment_timeframe_other: '',
      business_model_targeted: [],
      business_model_targeted_other: '',
      business_stage_targeted: [],
      business_stage_targeted_other: '',
      financing_needs: [],
      financing_needs_other: '',
      target_capital_sources: [],
      target_capital_sources_other: '',
      target_irr_achieved: '',
      target_irr_targeted: '',
      impact_vs_financial_orientation: '',
      impact_vs_financial_orientation_other: '',
      explicit_lens_focus: [],
      explicit_lens_focus_other: '',
      report_sustainable_development_goals: false,
      top_sdg_1: undefined,
      top_sdg_2: undefined,
      top_sdg_3: undefined,
      top_sdgs: {},
      other_sdgs: [],
      gender_considerations_investment: [],
      gender_considerations_investment_other: '',
      gender_considerations_requirement: [],
      gender_considerations_requirement_other: '',
      gender_considerations_other_enabled: false,
      gender_fund_vehicle: [],
      gender_fund_vehicle_other: '',
      investment_size_your_amount: '',
      investment_size_total_raise: '',
      investment_forms: [],
      investment_forms_other: '',
      target_sectors: [],
      target_sectors_other: '',
      carried_interest_principals: '',
      current_ftes: '',
      portfolio_needs_ranking: {},
      portfolio_needs_other: '',
      portfolio_needs_other_enabled: false,
      investment_monetization: [],
      investment_monetization_other: '',
      exits_achieved: '',
      exits_achieved_other: '',
      fund_capabilities_ranking: {},
      fund_capabilities_other: '',
      fund_capabilities_other_enabled: false,
      covid_impact_aggregate: '',
      covid_impact_portfolio: {},
      covid_government_support: [],
      covid_government_support_other: '',
      raising_capital_2021: [],
      raising_capital_2021_other: '',
      fund_vehicle_considerations: [],
      fund_vehicle_considerations_other: '',
      network_value_rating: '',
      working_groups_ranking: {},
      new_working_group_suggestions: '',
      webinar_content_ranking: {},
      new_webinar_suggestions: '',
      communication_platform: '',
      communication_platform_other: '',
      network_value_areas: {},
      present_connection_session: '',
      present_connection_session_other: '',
      convening_initiatives_ranking: {},
      convening_initiatives_other: '',
      convening_initiatives_other_enabled: false,
      convening_initiatives_other_ranking: '',
      participate_mentoring_program: '',
      participate_mentoring_program_other: '',
      present_demystifying_session: [],
      present_demystifying_session_other: '',
      present_demystifying_session_other_enabled: false,
      additional_comments: '',
    },
  });

  // Initialize autosave AFTER form is created
  const { saveStatus, saveDraft: autoSaveDraft } = useSurveyAutosave({
    userId: user?.id,
    surveyYear: '2021',
    watch: form.watch,
    enabled: !!user,
  });

  // Load saved section on component mount (no form data restoration)
  useEffect(() => {
    const savedSection = getLastSection();
    
    if (savedSection && savedSection > 1) {
      setCurrentSection(savedSection);
    }
    
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load saved draft on component mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!user) return;
      
      try {
        // Try to load from database first
        const { data: dbDraft } = await supabase
          .from('survey_responses_2021')
          .select('*')
          .eq('user_id', user.id)
          .eq('submission_status', 'draft')
          .maybeSingle();

				if (dbDraft && dbDraft.form_data) {
					// Load from database
					const savedData = dbDraft.form_data;
					Object.keys(savedData).forEach(key => {
						if (savedData[key] !== undefined && savedData[key] !== null) {
							form.setValue(key as any, savedData[key], { shouldDirty: true, shouldTouch: true });
						}
					});
					return;
				}

				// Fallback to localStorage
				const savedData = getSavedFormData();
				if (savedData) {
					Object.keys(savedData).forEach(key => {
						if (savedData[key] !== undefined && savedData[key] !== null) {
							form.setValue(key as any, savedData[key], { shouldDirty: true, shouldTouch: true });
						}
					});
				}
      } catch (error) {
        console.warn('Failed to load draft:', error);
      }
    };

    loadDraft();
  }, [user, form]);

  // Setup auto-save when form data changes
  useEffect(() => {
    const formData = form.watch();
    const cleanup = setupAutoSave(formData);
    
    return cleanup;
  }, [form.watch()]);

  // Watch all form changes and save immediately
  useEffect(() => {
    if (!user) return;
    
    // Watch specific complex fields that might not trigger general form changes
    const watchFields = [
      'top_sdg_1',
      'top_sdg_2', 
      'top_sdg_3',
      'other_sdgs',
      'convening_initiatives_other_ranking'
    ];
    
    // Watch each field individually and save on change
    watchFields.forEach(field => {
      form.watch(field as any);
    });
    
    // General form watching - this will trigger on any form change
    const watchedValues = form.watch();
    
    // Save when any watched value changes
    const timeoutId = setTimeout(() => {
      saveDraft();
    }, 2000); // Save 2 seconds after last change
    
    return () => clearTimeout(timeoutId);
  }, [user, form, form.watch()]);

  // Save section and scroll position when section changes
  useEffect(() => {
    saveCurrentSection(currentSection);
    saveScrollPosition();
  }, [currentSection]);

  // Scroll to top when showing intro
  useEffect(() => {
    if (showIntro) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showIntro]);

  // Scroll to top when section changes
  useEffect(() => {
    if (!showIntro) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentSection, showIntro]);

  // Check if survey is completed and show read-only version
  const surveyCompleted = isSurveyCompleted('2021');
  
  if (surveyCompleted) {
    return <ReadOnlySurvey2021 />;
  }

  const handleNext = () => {
    if (currentSection < totalSections) {
      const nextSection = currentSection + 1;
      setCurrentSection(nextSection);
      saveCurrentSection(nextSection);
      
      // Scroll to top of page for better UX
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      const prevSection = currentSection - 1;
      setCurrentSection(prevSection);
      saveCurrentSection(prevSection);
      
      // Save scroll position before moving to previous section
      setTimeout(() => {
        saveScrollPosition();
      }, 100);
    }
  };

  const saveDraft = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Enhanced form data capture for all field types
      const formData = form.getValues();
      
      // Additional capture for complex nested objects and dynamic fields
      const enhancedFormData = {
        ...formData,
        // Ensure all nested objects are captured
        top_sdg_1: form.getValues('top_sdg_1'),
        top_sdg_2: form.getValues('top_sdg_2'),
        top_sdg_3: form.getValues('top_sdg_3'),
        other_sdgs: form.getValues('other_sdgs') || [],
        convening_initiatives_other_ranking: form.getValues('convening_initiatives_other_ranking'),
        // Capture all form state including touched/dirty fields
        _formState: form.formState,
      };
      
      // Save to localStorage as backup
      saveFormData(enhancedFormData);
      
      // Try to save to database
      try {
        // Check if record exists
        const { data: existingRecord } = await supabase
          .from('survey_responses_2021')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        // Ensure required non-null columns for drafts have values
        const effectiveEmail = formData.email_address || user?.email || `draft+${user.id}@placeholder.local`;
        const effectiveFirm = formData.firm_name || 'Draft';
        const effectiveParticipant = formData.participant_name || 'Draft';
        const effectiveRole = formData.role_title || 'Draft';

        const recordData = {
          user_id: user.id,
          email_address: effectiveEmail,
          firm_name: effectiveFirm,
          participant_name: effectiveParticipant,
          role_title: effectiveRole,
          team_based: formData.team_based || [],
          team_based_other: formData.team_based_other || '',
          geographic_focus: formData.geographic_focus || [],
          geographic_focus_other: formData.geographic_focus_other || '',
          fund_stage: formData.fund_stage || '',
          fund_stage_other: formData.fund_stage_other || '',
          legal_entity_date: formData.legal_entity_date || '',
          first_close_date: formData.first_close_date || '',
          first_investment_date: formData.first_investment_date || '',
          form_data: formData,
          submission_status: 'draft',
          updated_at: new Date().toISOString(),
        };

        let error;
        if (existingRecord) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('survey_responses_2021')
            .update(recordData)
            .eq('user_id', user.id);
          error = updateError;
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('survey_responses_2021')
            .insert(recordData);
          error = insertError;
        }

        if (error) throw error;
      } catch (dbError) {
        console.warn('Database save failed, using localStorage only:', dbError);
        // Database save failed, but localStorage save succeeded
      }
      
      toast({
        title: "Draft Saved",
        description: "Your 2021 survey draft has been saved successfully.",
      });
      
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (data: Survey2021FormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Manual upsert to avoid unique constraint issues on user_id
      const { data: existing } = await supabase
        .from('survey_responses_2021')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const recordData = {
        user_id: user.id,
        // Section 1
        email_address: data.email_address,
        firm_name: data.firm_name,
        participant_name: data.participant_name,
        role_title: data.role_title,
        team_based: data.team_based || [],
        team_based_other: data.team_based_other,
        geographic_focus: data.geographic_focus || [],
        geographic_focus_other: data.geographic_focus_other,
        fund_stage: data.fund_stage,
        fund_stage_other: data.fund_stage_other,
        legal_entity_date: data.legal_entity_date,
        first_close_date: data.first_close_date,
        first_investment_date: data.first_investment_date,
        // Section 2
        investments_march_2020: data.investments_march_2020,
        investments_december_2020: data.investments_december_2020,
        optional_supplement: data.optional_supplement,
        investment_vehicle_type: data.investment_vehicle_type || [],
        investment_vehicle_type_other: data.investment_vehicle_type_other,
        current_fund_size: data.current_fund_size,
        target_fund_size: data.target_fund_size,
        investment_timeframe: data.investment_timeframe,
        investment_timeframe_other: data.investment_timeframe_other,
        business_model_targeted: data.business_model_targeted || [],
        business_model_targeted_other: data.business_model_targeted_other,
        business_stage_targeted: data.business_stage_targeted || [],
        business_stage_targeted_other: data.business_stage_targeted_other,
        financing_needs: data.financing_needs || [],
        financing_needs_other: data.financing_needs_other,
        target_capital_sources: data.target_capital_sources || [],
        target_capital_sources_other: data.target_capital_sources_other,
        target_irr_achieved: data.target_irr_achieved,
        target_irr_targeted: data.target_irr_targeted,
        impact_vs_financial_orientation: data.impact_vs_financial_orientation,
        impact_vs_financial_orientation_other: data.impact_vs_financial_orientation_other,
        explicit_lens_focus: data.explicit_lens_focus || [],
        explicit_lens_focus_other: data.explicit_lens_focus_other,
        report_sustainable_development_goals: data.report_sustainable_development_goals,
        top_sdg_1: data.top_sdg_1,
        top_sdg_2: data.top_sdg_2,
        top_sdg_3: data.top_sdg_3,
        top_sdgs: data.top_sdgs || {},
        other_sdgs: data.other_sdgs || [],
        gender_considerations_investment: data.gender_considerations_investment || [],
        gender_considerations_investment_other: data.gender_considerations_investment_other,
        gender_considerations_requirement: data.gender_considerations_requirement || [],
        gender_considerations_requirement_other: data.gender_considerations_requirement_other,
        gender_fund_vehicle: data.gender_fund_vehicle || [],
        gender_fund_vehicle_other: data.gender_fund_vehicle_other,
        // Section 3
        investment_size_your_amount: data.investment_size_your_amount,
        investment_size_total_raise: data.investment_size_total_raise,
        investment_forms: data.investment_forms || [],
        investment_forms_other: data.investment_forms_other,
        target_sectors: data.target_sectors || [],
        target_sectors_other: data.target_sectors_other,
        carried_interest_principals: data.carried_interest_principals,
        current_ftes: data.current_ftes,
        // Section 4
        portfolio_needs_ranking: data.portfolio_needs_ranking || {},
        portfolio_needs_other: data.portfolio_needs_other,
        investment_monetization: data.investment_monetization || [],
        investment_monetization_other: data.investment_monetization_other,
        exits_achieved: data.exits_achieved,
        exits_achieved_other: data.exits_achieved_other,
        fund_capabilities_ranking: data.fund_capabilities_ranking || {},
        fund_capabilities_other: data.fund_capabilities_other,
        // Section 5
        covid_impact_aggregate: data.covid_impact_aggregate,
        covid_impact_portfolio: data.covid_impact_portfolio || {},
        covid_government_support: data.covid_government_support || [],
        covid_government_support_other: data.covid_government_support_other,
        raising_capital_2021: data.raising_capital_2021 || [],
        raising_capital_2021_other: data.raising_capital_2021_other,
        fund_vehicle_considerations: data.fund_vehicle_considerations || [],
        fund_vehicle_considerations_other: data.fund_vehicle_considerations_other,
        // Section 6
        network_value_rating: data.network_value_rating,
        working_groups_ranking: data.working_groups_ranking || {},
        new_working_group_suggestions: data.new_working_group_suggestions,
        webinar_content_ranking: data.webinar_content_ranking || {},
        new_webinar_suggestions: data.new_webinar_suggestions,
        communication_platform: data.communication_platform,
        communication_platform_other: data.communication_platform_other,
        network_value_areas: data.network_value_areas || {},
        present_connection_session: data.present_connection_session,
        present_connection_session_other: data.present_connection_session_other,
        convening_initiatives_ranking: data.convening_initiatives_ranking || {},
        convening_initiatives_other: data.convening_initiatives_other,
        // Section 7
        participate_mentoring_program: data.participate_mentoring_program,
        participate_mentoring_program_other: data.participate_mentoring_program_other,
        present_demystifying_session: data.present_demystifying_session || [],
        present_demystifying_session_other: data.present_demystifying_session_other,
        additional_comments: data.additional_comments,
        // Full data backup
        form_data: data,
        submission_status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let submitError;
      if (existing) {
        const { error: updateError } = await supabase
          .from('survey_responses_2021')
          .update(recordData)
          .eq('id', existing.id);
        submitError = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('survey_responses_2021')
          .insert(recordData);
        submitError = insertError;
      }

      if (submitError) throw submitError;

      if (error) throw error;
      
      // Clear saved data after successful submission
      clearSavedData();
      
      toast({
        title: "Survey Submitted",
        description: "Thank you for completing the 2021 survey!",
      });
      
      // Reset form and go back to first section
      form.reset();
      setCurrentSection(1);
      
    } catch (error) {
      console.error('Error submitting survey:', error);
      toast({
        title: "Error",
        description: "Failed to submit survey. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSectionTitle = (section: number): string => {
    switch (section) {
      case 1: return "Background Information";
      case 2: return "Investment Thesis & Capital Construct";
      case 3: return "Portfolio Construction and Team";
      case 4: return "Portfolio Development & Investment Return Monetization";
      case 5: return "Impact of COVID-19 on Vehicle and Portfolio";
      case 6: return "Feedback on ESCP Network Membership";
      case 7: return "2021 Convening Objectives & Goals";
      default: return "";
    }
  };

  const renderSectionSidebar = () => (
    <div className="w-64 bg-white border-l border-gray-200 p-4 fixed right-0 top-20 h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Survey Sections</h3>
      <div className="space-y-2 overflow-y-auto flex-1">
        {Array.from({ length: totalSections }, (_, idx) => idx + 1).map((sectionNumber) => {
          const isActive = currentSection === sectionNumber;
          return (
            <button
              key={sectionNumber}
              type="button"
              onClick={() => {
                setCurrentSection(sectionNumber);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
              }}
              className={[
                'w-full text-left px-3 py-2 rounded-md border transition-colors',
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-start gap-2">
                <span className="font-semibold text-xs mt-0.5">{sectionNumber}.</span>
                <span className="text-xs leading-tight">{getSectionTitle(sectionNumber)}</span>
              </div>
            </button>
          );
        })}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/survey')}
        className="mt-4 w-full"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Network
      </Button>
    </div>
  );

  const renderSection1 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="email_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>1. Email address</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="your.email@example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="firm_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>2. Name of firm</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your firm name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="participant_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>3. Name of participant</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter participant name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>4. Role / title of participant</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your role/title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <Label>5. Where is your team based?</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "US/Europe", "Asia - South Asia", "Asia - Central Asia", "Asia - South East Asia",
            "Africa - West Africa", "Africa - East Africa", "Africa - Central Africa", 
            "Africa - Southern Africa", "Africa - North Africa", "Latin America", "Middle East", "Other"
          ].map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`team_based_${location}`}
                checked={form.watch("team_based").includes(location)}
                onCheckedChange={(checked) => {
                  const current = form.watch("team_based");
                  if (checked) {
                    form.setValue("team_based", [...current, location]);
                  } else {
                    form.setValue("team_based", current.filter(item => item !== location));
                  }
                }}
              />
              <Label htmlFor={`team_based_${location}`} className="text-sm font-normal text-gray-800">{location}</Label>
            </div>
          ))}
        </div>
        {form.watch("team_based").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="team_based_other" className="text-sm font-medium text-gray-700">Please specify other location:</Label>
            <Input
              id="team_based_other"
              {...form.register("team_based_other")}
              placeholder="Please specify other location"
              className="mt-1"
            />
          </div>
        )}
        {form.formState.errors.team_based && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.team_based.message}</p>
        )}
      </div>

      <div>
        <Label>6. What is the geographic focus of your fund/vehicle?</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "US/Europe", "Asia - South Asia", "Asia - Central Asia", "Asia - South East Asia",
            "Africa - West Africa", "Africa - East Africa", "Africa - Central Africa", 
            "Africa - Southern Africa", "Africa - North Africa", "Latin America", "Middle East", "Other"
          ].map((region) => (
            <div key={region} className="flex items-center space-x-2">
              <Checkbox
                id={`geographic_focus_${region}`}
                checked={form.watch("geographic_focus").includes(region)}
                onCheckedChange={(checked) => {
                  const current = form.watch("geographic_focus");
                  if (checked) {
                    form.setValue("geographic_focus", [...current, region]);
                  } else {
                    form.setValue("geographic_focus", current.filter(item => item !== region));
                  }
                }}
              />
              <Label htmlFor={`geographic_focus_${region}`} className="text-sm font-normal text-gray-800">{region}</Label>
            </div>
          ))}
        </div>
        {form.watch("geographic_focus").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="geographic_focus_other" className="text-sm font-medium text-gray-700">Please specify other geographic focus:</Label>
            <Input
              id="geographic_focus_other"
              {...form.register("geographic_focus_other")}
              placeholder="Please specify other geographic focus"
              className="mt-1"
            />
          </div>
        )}
        {form.formState.errors.geographic_focus && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.geographic_focus.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="fund_stage" >7. What is the stage of your current fund/vehicle's operations?</Label>
        <Select onValueChange={(value) => {
          form.setValue("fund_stage", value);
          // Clear the "Other" field if not selecting "Other"
          if (value !== "Other") {
            form.setValue("fund_stage_other", "");
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select fund stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Open ended - fundraising and heading towards equivalent of 1st close">Open ended - fundraising and heading towards equivalent of 1st close</SelectItem>
            <SelectItem value="Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics">Open-ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics</SelectItem>
            <SelectItem value="Closed ended - fundraising">Closed ended - fundraising</SelectItem>
            <SelectItem value="Closed ended - completed first close">Closed ended - completed first close</SelectItem>
            <SelectItem value="Closed ended - completed second close">Closed ended - completed second close</SelectItem>
            <SelectItem value="Second fund/vehicle">Second fund/vehicle</SelectItem>
            <SelectItem value="Third or later fund/vehicle">Third or later fund/vehicle</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Only show "Other" input when "Other" is selected */}
        {form.watch("fund_stage") === "Other" && (
          <div className="mt-3">
            <Label htmlFor="fund_stage_other" className="text-sm font-medium text-gray-700">Please specify other fund stage:</Label>
            <Input
              id="fund_stage_other"
              {...form.register("fund_stage_other")}
              placeholder="Enter your custom fund stage"
              className="mt-1"
            />
            {form.formState.errors.fund_stage_other && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.fund_stage_other.message}</p>
            )}
          </div>
        )}
        
        {form.formState.errors.fund_stage && (
          <p className="text-red-500 text-sm mt-1">{form.formState.errors.fund_stage.message}</p>
        )}
      </div>

      {/* Question 8: Timeline */}
      <div className="space-y-4">
        <div>
          <Label >8. When did your current fund/investment vehicle achieve each of the following?</Label>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="legal_entity_date" className="text-sm font-medium text-gray-700">Legal entity</Label>
            <Select onValueChange={(value) => form.setValue("legal_entity_date", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N/A">N/A</SelectItem>
                <SelectItem value="Prior to 2000">Prior to 2000</SelectItem>
                <SelectItem value="2000-2010">2000-2010</SelectItem>
                <SelectItem value="2011">2011</SelectItem>
                <SelectItem value="2012">2012</SelectItem>
                <SelectItem value="2013">2013</SelectItem>
                <SelectItem value="2014">2014</SelectItem>
                <SelectItem value="2015">2015</SelectItem>
                <SelectItem value="2016">2016</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="first_close_date" className="text-sm font-medium text-gray-700">1st close (or equivalent)</Label>
            <Select onValueChange={(value) => form.setValue("first_close_date", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N/A">N/A</SelectItem>
                <SelectItem value="Prior to 2000">Prior to 2000</SelectItem>
                <SelectItem value="2000-2010">2000-2010</SelectItem>
                <SelectItem value="2011">2011</SelectItem>
                <SelectItem value="2012">2012</SelectItem>
                <SelectItem value="2013">2013</SelectItem>
                <SelectItem value="2014">2014</SelectItem>
                <SelectItem value="2015">2015</SelectItem>
                <SelectItem value="2016">2016</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="first_investment_date" className="text-sm font-medium text-gray-700">First investment</Label>
            <Select onValueChange={(value) => form.setValue("first_investment_date", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N/A">N/A</SelectItem>
                <SelectItem value="Prior to 2000">Prior to 2000</SelectItem>
                <SelectItem value="2000-2010">2000-2010</SelectItem>
                <SelectItem value="2011">2011</SelectItem>
                <SelectItem value="2012">2012</SelectItem>
                <SelectItem value="2013">2013</SelectItem>
                <SelectItem value="2014">2014</SelectItem>
                <SelectItem value="2015">2015</SelectItem>
                <SelectItem value="2016">2016</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question 9: Number of investments */}
      <div className="space-y-4">
        <div>
          <Label >9. Please specify the number of investments made to date by your current vehicle</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="investments_march_2020">As of March 2020</Label>
            <Select onValueChange={(value) => form.setValue("investments_march_2020", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1-4">1-4</SelectItem>
                <SelectItem value="5-9">5-9</SelectItem>
                <SelectItem value="10-14">10-14</SelectItem>
                <SelectItem value="15-24">15-24</SelectItem>
                <SelectItem value="25+">25+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="investments_december_2020">As of December 2020</Label>
            <Select onValueChange={(value) => form.setValue("investments_december_2020", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1-4">1-4</SelectItem>
                <SelectItem value="5-9">5-9</SelectItem>
                <SelectItem value="10-14">10-14</SelectItem>
                <SelectItem value="15-24">15-24</SelectItem>
                <SelectItem value="25+">25+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question 10: Optional supplement */}
      <div>
        <Label htmlFor="optional_supplement">10. Optional supplement - if no direct investments made to date</Label>
        <Textarea
          id="optional_supplement"
          {...form.register("optional_supplement")}
          placeholder="e.g., warehoused investments, facilitated 3rd party investment, etc."
          className="mt-2"
        />
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      {/* Question 11: Type of investment vehicle */}
      <div className="space-y-4">
        <div>
          <Label >11. Type of investment vehicle</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Closed-end fund", "Open-ended vehicle / Limited liability company or equivalent",
            "Registered non-bank finance company", "Registered bank / financial institution",
            "Angel network", "Other"
          ].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`vehicle_type_${type}`}
                checked={form.watch("investment_vehicle_type").includes(type)}
                onCheckedChange={(checked) => {
                  const current = form.watch("investment_vehicle_type");
                  if (checked) {
                    form.setValue("investment_vehicle_type", [...current, type]);
                  } else {
                    form.setValue("investment_vehicle_type", current.filter(item => item !== type));
                  }
                }}
              />
              <Label htmlFor={`vehicle_type_${type}`} className="text-sm font-normal text-gray-800">{type}</Label>
            </div>
          ))}
        </div>
        
        {/* Only show "Other" input when "Other" is selected */}
        {form.watch("investment_vehicle_type").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="investment_vehicle_type_other">Other:</Label>
            <Input
              id="investment_vehicle_type_other"
              {...form.register("investment_vehicle_type_other")}
              placeholder="Please specify other vehicle type"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Question 12: Fund size */}
      <div className="space-y-4">
        <div>
          <Label >12. What is the current (hard commitments raised) and target size of your fund / investment vehicle?</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="current_fund_size">Current</Label>
            <Select onValueChange={(value) => form.setValue("current_fund_size", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< $1 million">&lt; $1 million</SelectItem>
                <SelectItem value="$1-4 million">$1-4 million</SelectItem>
                <SelectItem value="$5-9 million">$5-9 million</SelectItem>
                <SelectItem value="$10-19 million">$10-19 million</SelectItem>
                <SelectItem value="$20-29 million">$20-29 million</SelectItem>
                <SelectItem value="$30 million or more">$30 million or more</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="target_fund_size">Target</Label>
            <Select onValueChange={(value) => form.setValue("target_fund_size", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< $1 million">&lt; $1 million</SelectItem>
                <SelectItem value="$1-4 million">$1-4 million</SelectItem>
                <SelectItem value="$5-9 million">$5-9 million</SelectItem>
                <SelectItem value="$10-19 million">$10-19 million</SelectItem>
                <SelectItem value="$20-29 million">$20-29 million</SelectItem>
                <SelectItem value="$30 million or more">$30 million or more</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question 13: Investment timeframe */}
      <div className="space-y-4">
        <div>
          <Label >13. Typical investment timeframe</Label>
        </div>
        
        <Select onValueChange={(value) => {
          form.setValue("investment_timeframe", value);
          if (value !== "Other") {
            form.setValue("investment_timeframe_other", "");
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="<1 year">&lt;1 year</SelectItem>
            <SelectItem value="1-3 years">1-3 years</SelectItem>
            <SelectItem value="4-5 years">4-5 years</SelectItem>
            <SelectItem value="6-7 years">6-7 years</SelectItem>
            <SelectItem value="8+ years">8+ years</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {form.watch("investment_timeframe") === "Other" && (
          <div className="mt-3">
            <Label htmlFor="investment_timeframe_other">Please specify other timeframe:</Label>
            <Input
              id="investment_timeframe_other"
              {...form.register("investment_timeframe_other")}
              placeholder="Enter your custom timeframe"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Question 14: Type of business model targeted */}
      <div className="space-y-4">
        <div>
          <Label >14. Type of business model targeted</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Livelihood Sustaining Enterprises (formal/informal family run businesses targeting incremental growth)",
            "Dynamic Enterprises (proven business models operating in established industries with moderate growth potential)",
            "Niche Ventures (innovative products/services targeting niche markets with growth ambitions)",
            "High-Growth Ventures (disruptive business models targeting large markets with high growth potential)",
            "Real assets / infrastructure",
            "Other"
          ].map((model) => (
            <div key={model} className="flex items-center space-x-2">
              <Checkbox
                id={`business_model_${model}`}
                checked={form.watch("business_model_targeted").includes(model)}
                onCheckedChange={(checked) => {
                  const current = form.watch("business_model_targeted");
                  if (checked) {
                    form.setValue("business_model_targeted", [...current, model]);
                  } else {
                    form.setValue("business_model_targeted", current.filter(item => item !== model));
                  }
                }}
              />
              <Label htmlFor={`business_model_${model}`} className="text-sm font-normal text-gray-800">{model}</Label>
            </div>
          ))}
        </div>
        
        {/* Only show "Other" input when "Other" is selected */}
        {form.watch("business_model_targeted").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="business_model_targeted_other">Other:</Label>
            <Input
              id="business_model_targeted_other"
              {...form.register("business_model_targeted_other")}
              placeholder="Please specify other business model"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Question 15: Stage of business model targeted */}
      <div className="space-y-4">
        <div>
          <Label >15. Stage of business model targeted</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Start-up / pre-seed (pre-revenue, concept and business plan development)",
            "Early stage / seed (early revenue, product/service development, funds needed to expand business model)",
            "Growth (established business in need of funds for expansion, assets, working capital etc)",
            "Other"
          ].map((stage) => (
            <div key={stage} className="flex items-center space-x-2">
              <Checkbox
                id={`business_stage_${stage}`}
                checked={form.watch("business_stage_targeted").includes(stage)}
                onCheckedChange={(checked) => {
                  const current = form.watch("business_stage_targeted");
                  if (checked) {
                    form.setValue("business_stage_targeted", [...current, stage]);
                  } else {
                    form.setValue("business_stage_targeted", current.filter(item => item !== stage));
                  }
                }}
              />
              <Label htmlFor={`business_stage_${stage}`} className="text-sm font-normal text-gray-800">{stage}</Label>
            </div>
          ))}
        </div>
        
        {/* Only show "Other" input when "Other" is selected */}
        {form.watch("business_stage_targeted").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="business_stage_targeted_other">Other:</Label>
            <Input
              id="business_stage_targeted_other"
              {...form.register("business_stage_targeted_other")}
              placeholder="Please specify other business stage"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Question 16: Key financing needs of portfolio enterprises */}
      <div className="space-y-4">
        <div>
          <Label >16. Key financing needs of portfolio enterprises (at time of initial investment/funding)</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Venture launch – invest in initial staff, product/services development and market acceptance",
            "Small ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment, etc.)",
            "Major capital investments (facilities, production equipment, fleet/logistics, etc.)",
            "Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)",
            "Inventory and working capital requirements",
            "Other"
          ].map((need) => (
            <div key={need} className="flex items-center space-x-2">
              <Checkbox
                id={`financing_need_${need}`}
                checked={form.watch("financing_needs").includes(need)}
                onCheckedChange={(checked) => {
                  const current = form.watch("financing_needs");
                  if (checked) {
                    form.setValue("financing_needs", [...current, need]);
                  } else {
                    form.setValue("financing_needs", current.filter(item => item !== need));
                  }
                }}
              />
              <Label htmlFor={`financing_need_${need}`} className="text-sm font-normal text-gray-800">{need}</Label>
            </div>
          ))}
        </div>
        
        {/* Only show "Other" input when "Other" is selected */}
        {form.watch("financing_needs").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="financing_needs_other">Other:</Label>
            <Input
              id="financing_needs_other"
              {...form.register("financing_needs_other")}
              placeholder="Please specify other financing need"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Question 17: Target sources of capital for your fund */}
      <div className="space-y-4">
        <div>
          <Label >17. Target sources of capital for your fund</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Fund partners", "Local pension funds", "High Net Worth Individuals (HNWIs)",
            "Publically listed funds", "Angel network", "Development Finance Institutions (DFIs)",
            "Crowd funding", "Bilateral agencies", "Impact investing family offices",
            "Donors/philanthropy", "Corporates", "Other"
          ].map((source) => (
            <div key={source} className="flex items-center space-x-2">
              <Checkbox
                id={`capital_source_${source}`}
                checked={form.watch("target_capital_sources").includes(source)}
                onCheckedChange={(checked) => {
                  const current = form.watch("target_capital_sources");
                  if (checked) {
                    form.setValue("target_capital_sources", [...current, source]);
                  } else {
                    form.setValue("target_capital_sources", current.filter(item => item !== source));
                  }
                }}
              />
              <Label htmlFor={`capital_source_${source}`} className="text-sm font-normal text-gray-800">{source}</Label>
            </div>
          ))}
        </div>
        
        {/* Only show "Other" input when "Other" is selected */}
        {form.watch("target_capital_sources").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="target_capital_sources_other">Other:</Label>
            <Input
              id="target_capital_sources_other"
              {...form.register("target_capital_sources_other")}
              placeholder="Please specify other capital source"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Question 18: Target IRR */}
      <div className="space-y-4">
        <div>
          <Label >18. What is your target Internal Rate of Return (IRR) for investors (in USD equivalent)?</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="target_irr_achieved">Achieved in most recent reporting period</Label>
            <Select onValueChange={(value) => form.setValue("target_irr_achieved", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select IRR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< or = 5%">&lt; or = 5%</SelectItem>
                <SelectItem value="6-9%">6-9%</SelectItem>
                <SelectItem value="10-15%">10-15%</SelectItem>
                <SelectItem value="16-20%">16-20%</SelectItem>
                <SelectItem value="20%+">20%+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="target_irr_targeted">Targeted</Label>
            <Select onValueChange={(value) => form.setValue("target_irr_targeted", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select IRR" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< or = 5%">&lt; or = 5%</SelectItem>
                <SelectItem value="6-9%">6-9%</SelectItem>
                <SelectItem value="10-15%">10-15%</SelectItem>
                <SelectItem value="16-20%">16-20%</SelectItem>
                <SelectItem value="20%+">20%+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question 19: Impact vs financial return orientation */}
      <div className="space-y-4">
        <div>
          <Label >19. How would you frame the impact vs financial return orientation of your capital vehicle?</Label>
        </div>
        
        <Select onValueChange={(value) => {
          form.setValue("impact_vs_financial_orientation", value);
          if (value !== "Other") {
            form.setValue("impact_vs_financial_orientation_other", "");
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select orientation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Financial return first">Financial return first</SelectItem>
            <SelectItem value="Responsible/ESG investing (negative screening)">Responsible/ESG investing (negative screening)</SelectItem>
            <SelectItem value="Balanced impact/financial return">Balanced impact/financial return</SelectItem>
            <SelectItem value="Impact investing (positive screening)">Impact investing (positive screening)</SelectItem>
            <SelectItem value="Impact first investing (impact outcomes intentionally)">Impact first investing (impact outcomes intentionally)</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {form.watch("impact_vs_financial_orientation") === "Other" && (
          <div className="mt-3">
            <Label htmlFor="impact_vs_financial_orientation_other">Please specify other orientation:</Label>
            <Input
              id="impact_vs_financial_orientation_other"
              {...form.register("impact_vs_financial_orientation_other")}
              placeholder="Enter your custom description"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Question 20: Explicit lens/focus */}
      <div className="space-y-4">
        <div>
          <Label >20. Does your fund/vehicle have an explicit lens/focus?</Label>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Gender", "Youth", "Job creation", "Climate / green ventures", "Other"
          ].map((lens) => (
            <div key={lens} className="flex items-center space-x-2">
              <Checkbox
                id={`lens_${lens}`}
                checked={form.watch("explicit_lens_focus").includes(lens)}
                onCheckedChange={(checked) => {
                  const current = form.watch("explicit_lens_focus");
                  if (checked) {
                    form.setValue("explicit_lens_focus", [...current, lens]);
                  } else {
                    form.setValue("explicit_lens_focus", current.filter(item => item !== lens));
                  }
                }}
              />
              <Label htmlFor={`lens_${lens}`} className="text-sm font-normal text-gray-800">{lens}</Label>
            </div>
          ))}
        </div>
        
        {/* Only show "Other" input when "Other" is selected */}
        {form.watch("explicit_lens_focus").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="explicit_lens_focus_other">Other:</Label>
            <Input
              id="explicit_lens_focus_other"
              {...form.register("explicit_lens_focus_other")}
              placeholder="Please specify other lens/focus"
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Question 21: Report Sustainable Development Goals */}
      <div className="space-y-4">
        <div>
          <Label >21. Does your fund/investment vehicle specifically report any Sustainable Development Goals?</Label>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="sdg_yes"
              name="report_sdg"
              title="Yes"
              checked={form.watch("report_sustainable_development_goals") === true}
              onChange={() => form.setValue("report_sustainable_development_goals", true)}
            />
            <Label htmlFor="sdg_yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="sdg_no"
              name="report_sdg"
              title="No"
              checked={form.watch("report_sustainable_development_goals") === false}
              onChange={() => form.setValue("report_sustainable_development_goals", false)}
            />
            <Label htmlFor="sdg_no">No</Label>
          </div>
        </div>
      </div>

      {/* Question 22: SDGs categorization by rank */}
      {form.watch("report_sustainable_development_goals") && (
        <div className="space-y-6">
          <div>
            <Label >22. If yes, first select your top 3 SDGs in order (1st, 2nd, 3rd), then select additional SDGs that will be classified as "Other":</Label>
          </div>
          
          {/* Step 1: Top 3 SDGs in Order */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">Step 1: Select your top 3 SDGs in order (1st, 2nd, 3rd)</h4>
              <div className="space-y-4">
                {/* 1st Priority */}
                <div className="p-4 border rounded-md bg-white">
                  <Label className="text-sm font-medium text-gray-800 mb-2">1st Priority SDG</Label>
                  <Select
                    value={form.watch("top_sdg_1") || undefined}
                    onValueChange={(value) => {
                      form.setValue("top_sdg_1", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select 1st priority SDG" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "No Poverty", "Zero Hunger", "Good Health and Well-Being", "Quality Education",
                        "Gender Equality", "Clean Water and Sanitation", "Affordable and Clean Energy",
                        "Decent Work and Economic Growth", "Industry Innovation and Infrastructure",
                        "Reduced Inequalities", "Sustainable Cities and Communities", "Responsible Consumption and Production",
                        "Climate Action", "Life Below Water", "Life on Land", "Peace, Justice, and Strong Institutions",
                        "Partnerships for the Goals"
                      ].map((sdg) => (
                        <SelectItem key={sdg} value={sdg}>{sdg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2nd Priority */}
                <div className="p-4 border rounded-md bg-white">
                  <Label className="text-sm font-medium text-gray-800 mb-2">2nd Priority SDG</Label>
                  <Select
                    value={form.watch("top_sdg_2") || undefined}
                    onValueChange={(value) => {
                      form.setValue("top_sdg_2", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select 2nd priority SDG" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "No Poverty", "Zero Hunger", "Good Health and Well-Being", "Quality Education",
                        "Gender Equality", "Clean Water and Sanitation", "Affordable and Clean Energy",
                        "Decent Work and Economic Growth", "Industry Innovation and Infrastructure",
                        "Reduced Inequalities", "Sustainable Cities and Communities", "Responsible Consumption and Production",
                        "Climate Action", "Life Below Water", "Life on Land", "Peace, Justice, and Strong Institutions",
                        "Partnerships for the Goals"
                      ].filter(sdg => sdg !== form.watch("top_sdg_1")).map((sdg) => (
                        <SelectItem key={sdg} value={sdg}>{sdg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 3rd Priority */}
                <div className="p-4 border rounded-md bg-white">
                  <Label className="text-sm font-medium text-gray-800 mb-2">3rd Priority SDG</Label>
                  <Select
                    value={form.watch("top_sdg_3") || undefined}
                    onValueChange={(value) => {
                      form.setValue("top_sdg_3", value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select 3rd priority SDG" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "No Poverty", "Zero Hunger", "Good Health and Well-Being", "Quality Education",
                        "Gender Equality", "Clean Water and Sanitation", "Affordable and Clean Energy",
                        "Decent Work and Economic Growth", "Industry Innovation and Infrastructure",
                        "Reduced Inequalities", "Sustainable Cities and Communities", "Responsible Consumption and Production",
                        "Climate Action", "Life Below Water", "Life on Land", "Peace, Justice, and Strong Institutions",
                        "Partnerships for the Goals"
                      ].filter(sdg => sdg !== form.watch("top_sdg_1") && sdg !== form.watch("top_sdg_2")).map((sdg) => (
                        <SelectItem key={sdg} value={sdg}>{sdg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Additional SDGs as "Other" */}
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">Step 2: Select additional SDGs (these will be classified as "Other")</h4>
              <div className="p-4 border rounded-md bg-white">
                <Label className="text-sm font-medium text-gray-800 mb-2">Additional SDGs</Label>
                <Select
                  value=""
                  onValueChange={(value) => {
                    const current = form.getValues("other_sdgs") || [];
                    if (!current.includes(value)) {
                      form.setValue("other_sdgs", [...current, value], { shouldDirty: true, shouldTouch: true });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select additional SDGs (no specific order)" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "No Poverty", "Zero Hunger", "Good Health and Well-Being", "Quality Education",
                      "Gender Equality", "Clean Water and Sanitation", "Affordable and Clean Energy",
                      "Decent Work and Economic Growth", "Industry Innovation and Infrastructure",
                      "Reduced Inequalities", "Sustainable Cities and Communities", "Responsible Consumption and Production",
                      "Climate Action", "Life Below Water", "Life on Land", "Peace, Justice, and Strong Institutions",
                      "Partnerships for the Goals"
                    ].filter(sdg => 
                      sdg !== form.watch("top_sdg_1") && 
                      sdg !== form.watch("top_sdg_2") && 
                      sdg !== form.watch("top_sdg_3") &&
                      !form.watch("other_sdgs")?.includes(sdg)
                    ).map((sdg) => (
                      <SelectItem key={sdg} value={sdg}>{sdg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Show selected "Other" SDGs */}
                {form.watch("other_sdgs") && form.watch("other_sdgs").length > 0 && (
                  <div className="mt-3">
                    <Label className="text-sm font-medium text-gray-800 mb-2">Selected as "Other":</Label>
                    <div className="flex flex-wrap gap-2">
                      {form.watch("other_sdgs").map((sdg, index) => (
                        <div key={index} className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          <span>{sdg}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const current = form.getValues("other_sdgs") || [];
                              form.setValue("other_sdgs", current.filter(item => item !== sdg), { shouldDirty: true, shouldTouch: true });
                            }}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
              </div>
            ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question 23: Gender considerations - categorize each as Investment Consideration, Investment Requirement, or None */}
      <div className="space-y-4">
        <div>
          <Label >23. Do any of the following gender considerations apply when making investment/financing considerations?</Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {[
            "Majority women ownership (>50%)", "Greater than 33% of women in senior management",
            "Women represent at least 33% - 50% of direct workforce", "Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)",
            "Have policies in place that promote gender equality (e.g. equal compensation)", "Women are target beneficiaries of the product/service",
            "Enterprise reports on specific gender related indicators to investors", "Board member female representation (>33%)",
            "Female CEO", "Other"
          ].map((item) => {
            const investment = form.watch("gender_considerations_investment");
            const requirement = form.watch("gender_considerations_requirement");
            const currentValue = requirement.includes(item) ? 'Requirement' : investment.includes(item) ? 'Consideration' : 'None';
            return (
              <div key={item} className="p-2 border rounded-md bg-white">
                {item !== 'Other' ? (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm pr-3 flex-1">{item}</Label>
                    <Select
                      value={currentValue}
                      onValueChange={(val) => {
                        const inv = [...form.getValues("gender_considerations_investment")];
                        const req = [...form.getValues("gender_considerations_requirement")];
                        const removeFrom = (arr: string[]) => arr.filter(v => v !== item);
                        let nextInv = removeFrom(inv);
                        let nextReq = removeFrom(req);
                        if (val === 'Consideration') nextInv = [...nextInv, item];
                        if (val === 'Requirement') nextReq = [...nextReq, item];
                        if (val === 'None') {
                          // nothing extra
                        }
                        form.setValue("gender_considerations_investment", nextInv, { shouldDirty: true });
                        form.setValue("gender_considerations_requirement", nextReq, { shouldDirty: true });
                      }}
                    >
                      <SelectTrigger className="w-52">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Consideration">Investment Consideration</SelectItem>
                        <SelectItem value="Requirement">Investment Requirement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="gender_other_checkbox"
                        checked={!!form.watch("gender_considerations_other_enabled")}
                        onCheckedChange={(checked) => {
                          const isChecked = Boolean(checked);
                          form.setValue("gender_considerations_other_enabled", isChecked, { shouldDirty: true });
                          if (!isChecked) {
                            // Clear text and remove from arrays when disabled
                            form.setValue("gender_considerations_investment_other", "");
                            form.setValue("gender_considerations_requirement_other", "");
                            const inv = form.getValues("gender_considerations_investment").filter((v: string) => v !== 'Other');
                            const req = form.getValues("gender_considerations_requirement").filter((v: string) => v !== 'Other');
                            form.setValue("gender_considerations_investment", inv, { shouldDirty: true });
                            form.setValue("gender_considerations_requirement", req, { shouldDirty: true });
                          }
                        }}
                      />
                      <Label htmlFor="gender_other_checkbox" className="text-sm font-normal text-gray-800">Other</Label>
                    </div>
                    {form.watch("gender_considerations_other_enabled") && (
                      <div className="mt-3 space-y-3">
                        <div>
                          <Label htmlFor="gender_considerations_other_text">Please describe:</Label>
                          <Input
                            id="gender_considerations_other_text"
                            {...form.register("gender_considerations_investment_other")}
                            placeholder="Describe the other consideration"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Label className="text-sm font-normal text-gray-800">Classify as:</Label>
                          <Select
                            value={currentValue === 'None' ? undefined : currentValue}
                            onValueChange={(val) => {
                              const inv = [...form.getValues("gender_considerations_investment")].filter(v => v !== 'Other');
                              const req = [...form.getValues("gender_considerations_requirement")].filter(v => v !== 'Other');
                              if (val === 'Consideration') {
                                form.setValue("gender_considerations_investment", [...inv, 'Other'], { shouldDirty: true });
                                form.setValue("gender_considerations_requirement", req, { shouldDirty: true });
                              } else if (val === 'Requirement') {
                                form.setValue("gender_considerations_requirement", [...req, 'Other'], { shouldDirty: true });
                                form.setValue("gender_considerations_investment", inv, { shouldDirty: true });
                              }
                            }}
                          >
                            <SelectTrigger className="w-64">
                              <SelectValue placeholder="Select classification" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Consideration">Investment Consideration</SelectItem>
                              <SelectItem value="Requirement">Investment Requirement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
      </div>

      {/* Question 24: Do any of the following apply to your fund/vehicle? */}
      <div className="space-y-4">
        <div>
          <Label >24. Do any of the following apply to your fund/vehicle?</Label>
          <div className="text-sm text-gray-600">Check all that apply.</div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Women ownership/participation interest is ≥ 50%", "Women representation on the board/investment committee is ≥ 50%",
            "Female staffing is ≥ 50%", "Provide specific reporting on gender related indicators for your investors/funders",
            "Require specific reporting on gender related indicators by your investees/borrowers", "Other"
          ].map((vehicle) => (
            <div key={vehicle} className="flex items-center space-x-2">
              <Checkbox
                id={`gender_vehicle_${vehicle}`}
                checked={form.watch("gender_fund_vehicle").includes(vehicle)}
                onCheckedChange={(checked) => {
                  const current = form.watch("gender_fund_vehicle");
                  if (checked) {
                    form.setValue("gender_fund_vehicle", [...current, vehicle]);
                  } else {
                    form.setValue("gender_fund_vehicle", current.filter(item => item !== vehicle));
                  }
                }}
              />
              <Label htmlFor={`gender_vehicle_${vehicle}`} className="text-sm font-normal text-gray-800">{vehicle}</Label>
            </div>
          ))}
        </div>
        {form.watch("gender_fund_vehicle").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="gender_fund_vehicle_other">Other:</Label>
            <Input
              id="gender_fund_vehicle_other"
              {...form.register("gender_fund_vehicle_other")}
              placeholder="Please specify other if applicable"
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <Label >25. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)?</Label>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="investment_size_your_amount">Your investment amount at time of initial investment</Label>
            <Select onValueChange={(value) => form.setValue("investment_size_your_amount", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< $100,000">&lt; $100,000</SelectItem>
                <SelectItem value="$100,000 - $199,000">$100,000 - $199,000</SelectItem>
                <SelectItem value="$200,000 - $499,000">$200,000 - $499,000</SelectItem>
                <SelectItem value="$500,000 - $999,000">$500,000 - $999,000</SelectItem>
                <SelectItem value="$1,000,000 - $1,999,000">$1,000,000 - $1,999,000</SelectItem>
                <SelectItem value="≥ $2,000,000">≥ $2,000,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="investment_size_total_raise">Total raise by portfolio company</Label>
            <Select onValueChange={(value) => form.setValue("investment_size_total_raise", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select amount" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="< $100,000">&lt; $100,000</SelectItem>
                <SelectItem value="$100,000 - $199,000">$100,000 - $199,000</SelectItem>
                <SelectItem value="$200,000 - $499,000">$200,000 - $499,000</SelectItem>
                <SelectItem value="$500,000 - $999,000">$500,000 - $999,000</SelectItem>
                <SelectItem value="$1,000,000 - $1,999,000">$1,000,000 - $1,999,000</SelectItem>
                <SelectItem value="≥ $2,000,000">≥ $2,000,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
        
      <div>
        <Label >26. What forms of investment do you typically make?</Label>
        <div className="text-sm text-gray-600">Check all that apply.</div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Common equity",
            "Preferred equity (e.g. certain rights above those available to common equity holders)",
            "Convertible notes",
            "Senior debt",
            "Mezzanine debt",
            "Shared revenue/earnings instruments",
            "SAFEs",
            "Other"
          ].map((investmentForm) => (
            <div key={investmentForm} className="flex items-center space-x-2">
              <Checkbox
                id={`investment_form_${investmentForm}`}
                checked={form.watch("investment_forms").includes(investmentForm)}
                onCheckedChange={(checked) => {
                  const current = form.watch("investment_forms");
                  if (checked) {
                    form.setValue("investment_forms", [...current, investmentForm]);
                  } else {
                    form.setValue("investment_forms", current.filter(item => item !== investmentForm));
                  }
                  // Clear other input when unchecking Other
                  if (investmentForm === 'Other' && !checked) {
                    form.setValue('investment_forms_other', '');
                  }
                }}
              />
              <Label htmlFor={`investment_form_${investmentForm}`} className="text-sm font-normal text-gray-800">{investmentForm}</Label>
            </div>
          ))}
        </div>
        {form.watch("investment_forms").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="investment_forms_other">Other:</Label>
            <Input
              id="investment_forms_other"
              {...form.register("investment_forms_other")}
              placeholder="Please specify other investment form"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label >27. What are your target investment sectors/focus areas?</Label>
        <div className="text-sm text-gray-600">Check all that apply.</div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Sector agnostic",
            "Agriculture / Food supply chain",
            "Distribution / Logistics",
            "Education",
            "Energy / Renewables / Green Mobility",
            "Financial Inclusion / Insurance / Fintech",
            "Fast Moving Consumer Goods (FMCG)",
            "Healthcare",
            "Manufacturing",
            "Technology / ICT / Telecommunications",
            "Water and Sanitation",
            "Other"
          ].map((sector) => (
            <div key={sector} className="flex items-center space-x-2">
              <Checkbox
                id={`target_sector_${sector}`}
                checked={form.watch("target_sectors").includes(sector)}
                onCheckedChange={(checked) => {
                  const current = form.watch("target_sectors");
                  if (checked) {
                    form.setValue("target_sectors", [...current, sector]);
                  } else {
                    form.setValue("target_sectors", current.filter(item => item !== sector));
                  }
                  if (sector === 'Other' && !checked) {
                    form.setValue('target_sectors_other', '');
                  }
                }}
              />
              <Label htmlFor={`target_sector_${sector}`} className="text-sm font-normal text-gray-800">{sector}</Label>
            </div>
          ))}
        </div>
        {form.watch("target_sectors").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="target_sectors_other">Other:</Label>
            <Input
              id="target_sectors_other"
              {...form.register("target_sectors_other")}
              placeholder="Please specify other target sector"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="carried_interest_principals">28. Number of current carried-interest/equity-interest principals</Label>
        <Select onValueChange={(value) => form.setValue("carried_interest_principals", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2-3">2-3</SelectItem>
            <SelectItem value="4-5">4-5</SelectItem>
            <SelectItem value="5+">5+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="current_ftes">29. Number of current Full Time Equivalent staff members (FTEs) including principals</Label>
        <Select onValueChange={(value) => form.setValue("current_ftes", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="< or = 2">&lt; or = 2</SelectItem>
            <SelectItem value="3-5">3-5</SelectItem>
            <SelectItem value="6-10">6-10</SelectItem>
            <SelectItem value="10+">10+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-6">
      <div>
        <Label >30. During the first 3 years of an investment, what are the key needs of portfolio enterprises? Please provide one ranking per row: 1 = highest need, 5 = lowest need</Label>
        <div className="space-y-4 mt-2">
          {[
            "Finance, budgeting, accounting, cash and tax management",
            "Fundraising including access to working capital resources",
            "Strategic / organizational planning",
            "Product/services proof of concept / market share / competitor positioning",
            "Human capital management – hiring/retention/training",
            "Technology (CRM, MIS, telecommunications, etc)",
            "Legal / regulatory",
            "Operations/ production / facilities and infrastructure",
            "Management training"
          ].map((need) => (
            <div key={need} className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium pr-3">{need}</Label>
                <Select onValueChange={(value) => {
                  const current = form.watch("portfolio_needs_ranking") || {};
                  form.setValue("portfolio_needs_ranking", { ...current, [need]: value });
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          {/* Other: checkbox reveals description + rank */}
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="portfolio_needs_other_checkbox"
                checked={!!form.watch('portfolio_needs_other_enabled')}
                onCheckedChange={(checked) => {
                  const isChecked = Boolean(checked);
                  form.setValue('portfolio_needs_other_enabled', isChecked, { shouldDirty: true });
                  if (!isChecked) {
                    // Clear text and ranking when disabled
                    form.setValue('portfolio_needs_other', '');
                    const current = { ...(form.watch('portfolio_needs_ranking') || {}) };
                    delete (current as any)['Other'];
                    form.setValue('portfolio_needs_ranking', current, { shouldDirty: true });
                  }
                }}
              />
              <Label htmlFor="portfolio_needs_other_checkbox" className="text-sm font-normal text-gray-800">Other</Label>
            </div>
            {form.watch('portfolio_needs_other_enabled') && (
              <div className="mt-3 space-y-3">
                <div>
                  <Label htmlFor="portfolio_needs_other">Please describe:</Label>
                  <Input
                    id="portfolio_needs_other"
                    {...form.register("portfolio_needs_other")}
                    placeholder="Describe the other portfolio need"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Label className="text-sm font-normal text-gray-800">Rank:</Label>
                  <Select onValueChange={(value) => {
                    const current = form.watch('portfolio_needs_ranking') || {};
                    form.setValue('portfolio_needs_ranking', { ...current, ['Other']: value });
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label >31. What is the typical form of investment monetization/exit?</Label>
        <div className="text-sm text-gray-600">Check all that apply.</div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Interest income/shared revenues and principal repayment",
            "Other types of self-liquidating repayment structures",
            "Dividends",
            "Strategic sale/merger of company",
            "Management buyout",
            "Financial investor take-out",
            "Other"
          ].map((exit) => (
            <div key={exit} className="flex items-center space-x-2">
              <Checkbox
                id={`exit_${exit}`}
                checked={form.watch("investment_monetization").includes(exit)}
                onCheckedChange={(checked) => {
                  const current = form.watch("investment_monetization");
                  if (checked) {
                    form.setValue("investment_monetization", [...current, exit]);
                  } else {
                    form.setValue("investment_monetization", current.filter(item => item !== exit));
                  }
                  if (exit === 'Other' && !checked) {
                    form.setValue('investment_monetization_other', '');
                  }
                }}
              />
              <Label htmlFor={`exit_${exit}`} className="text-sm font-normal text-gray-800">{exit}</Label>
            </div>
          ))}
        </div>
        {form.watch("investment_monetization").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="investment_monetization_other">Other:</Label>
            <Input
              id="investment_monetization_other"
              {...form.register("investment_monetization_other")}
              placeholder="Please specify other monetization method"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="exits_achieved" >32. How many exits has your vehicle achieved to date (ie exits/monetizations for equity investments and full repayments for debt investments)?</Label>
        <Select onValueChange={(value) => {
          form.setValue("exits_achieved", value);
          if (value !== 'Other') {
            form.setValue('exits_achieved_other', '');
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="1-4">1-4</SelectItem>
            <SelectItem value="5-9">5-9</SelectItem>
            <SelectItem value="10-14">10-14</SelectItem>
            <SelectItem value="15-24">15-24</SelectItem>
            <SelectItem value="25+">25+</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {form.watch('exits_achieved') === 'Other' && (
          <div className="mt-3">
            <Label htmlFor="exits_achieved_other">Please specify:</Label>
            <Input
              id="exits_achieved_other"
              {...form.register("exits_achieved_other")}
              placeholder="Enter a custom number or description"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label >33. Fund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1 = highest need, 5 = lowest need</Label>
        <div className="space-y-4 mt-2">
          {[
            "Fundraising with access to global LPs",
            "Fundraising with access to local LPs",
            "Fundraising with access to warehousing capital",
            "Fundraising with access to grant capital for vehicle OPEX",
            "Fundraising with access to TA support",
            "Fund economics",
            "Fund structuring",
            "Investment process (eg origination, due diligence, structuring, closing)",
            "Post investment process (eg monitoring, reporting, exits, Technical Assistance)",
            "Fund staff/Human capital management and development",
            "Back office (financial/impact reporting, accounting, CFO, software, templates, etc)",
            "Exit/monetization opportunities",
            "Legal/regulatory support",
            "Application of impact metrics"
          ].map((capability) => (
            <div key={capability} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label className="text-sm font-medium">{capability}</Label>
              <Select onValueChange={(value) => {
                const current = form.watch("fund_capabilities_ranking") || {};
                form.setValue("fund_capabilities_ranking", { ...current, [capability]: value });
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          {/* Other as checkbox + describe + rank */}
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fund_capabilities_other_checkbox"
                checked={!!form.watch('fund_capabilities_other_enabled')}
                onCheckedChange={(checked) => {
                  const isChecked = Boolean(checked);
                  form.setValue('fund_capabilities_other_enabled', isChecked, { shouldDirty: true });
                  if (!isChecked) {
                    form.setValue('fund_capabilities_other', '');
                    const current = { ...(form.watch('fund_capabilities_ranking') || {}) };
                    delete (current as any)['Other'];
                    form.setValue('fund_capabilities_ranking', current, { shouldDirty: true });
                  }
                }}
              />
              <Label htmlFor="fund_capabilities_other_checkbox" className="text-sm font-normal text-gray-800">Other</Label>
            </div>
            {form.watch('fund_capabilities_other_enabled') && (
              <div className="mt-3 space-y-3">
                <div>
                  <Label htmlFor="fund_capabilities_other">Please describe:</Label>
                  <Input
                    id="fund_capabilities_other"
                    {...form.register("fund_capabilities_other")}
                    placeholder="Describe the other fund capability"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Label className="text-sm font-normal text-gray-800">Rank:</Label>
                  <Select onValueChange={(value) => {
                    const current = form.watch('fund_capabilities_ranking') || {};
                    form.setValue('fund_capabilities_ranking', { ...current, ['Other']: value });
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="covid_impact_aggregate" >34. At an aggregate level, please indicate the impact of COVID-19 on your investment vehicle and operations.</Label>
        <Select onValueChange={(value) => form.setValue("covid_impact_aggregate", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select impact level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Significant negative impact">Significant negative impact</SelectItem>
            <SelectItem value="Somewhat negative impact">Somewhat negative impact</SelectItem>
            <SelectItem value="Neither positive nor negative impact">Neither positive nor negative impact</SelectItem>
            <SelectItem value="Somewhat positive impact">Somewhat positive impact</SelectItem>
            <SelectItem value="Significant positive impact">Significant positive impact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label >35. What impact has COVID-19 had on the following aspects of your portfolio companies?</Label>
        <div className="space-y-4 mt-2">
          {[
            "Staff attendance", "Customer demand", "Ability to pay staff salaries",
            "Ability to pay fixed operating cost (eg rent, etc.)", "Ability to pay existing business loans",
            "Access to supply inputs / raw materials", "Ability to pay for raw inputs / raw materials",
            "Need to pivot business model"
          ].map((aspect) => (
            <div key={aspect} className="border border-gray-200 rounded-lg p-4">
              <Label className="text-sm font-medium mb-3 block">{aspect}</Label>
              <Select
                value={(form.watch('covid_impact_portfolio') || {})?.[aspect]?.status}
                onValueChange={(value) => {
                  const current = form.watch('covid_impact_portfolio') || {};
                  form.setValue('covid_impact_portfolio', {
                    ...current,
                    [aspect]: { status: value }
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="to_date_no_impact">To date - no impact</SelectItem>
                  <SelectItem value="to_date_slight_impact">To date - slight impact</SelectItem>
                  <SelectItem value="to_date_high_impact">To date - high impact</SelectItem>
                  <SelectItem value="anticipate_no_future_impact">Anticipate no future impact</SelectItem>
                  <SelectItem value="anticipate_future_impact">Anticipate future impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label >36. Have you received any financial or non-financial support from any government programs or grant funding related to COVID-19?</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Yes, government support (financial)",
            "Yes, grant funding (financial)",
            "Yes, non-financial assistance",
            "No",
            "Other"
          ].map((support) => (
            <div key={support} className="flex items-center space-x-2">
              <Checkbox
                id={`covid_support_${support}`}
                checked={form.watch("covid_government_support").includes(support)}
                onCheckedChange={(checked) => {
                  const current = form.watch("covid_government_support");
                  if (checked) {
                    form.setValue("covid_government_support", [...current, support]);
                  } else {
                    form.setValue("covid_government_support", current.filter(item => item !== support));
                  }
                  if (support === 'Other' && !checked) {
                    form.setValue('covid_government_support_other', '');
                  }
                }}
              />
              <Label htmlFor={`covid_support_${support}`} className="text-sm font-normal text-gray-800">{support}</Label>
            </div>
          ))}
        </div>
        {form.watch("covid_government_support").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="covid_government_support_other">Other:</Label>
            <Input
              id="covid_government_support_other"
              {...form.register("covid_government_support_other")}
              placeholder="Please specify other COVID-19 support"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label >37. Do you anticipate raising new LP/investor funds in 2021? If yes, for what purpose?</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "N/A - have no plans to raise capital in 2021", "Stabilize operations of existing portfolio companies",
            "Growth capital for existing portfolio to increase market share", "Growth capital for existing portfolio to enter new markets/expand business line(s)",
            "New pipeline investments through existing vehicle", "New pipeline investments through new vehicle",
            "Technical assistance to support portfolio enterprises", "Other"
          ].map((purpose) => (
            <div key={purpose} className="flex items-center space-x-2">
              <Checkbox
                id={`raising_capital_${purpose}`}
                checked={form.watch("raising_capital_2021").includes(purpose)}
                onCheckedChange={(checked) => {
                  const current = form.watch("raising_capital_2021");
                  if (checked) {
                    form.setValue("raising_capital_2021", [...current, purpose]);
                  } else {
                    form.setValue("raising_capital_2021", current.filter(item => item !== purpose));
                  }
                  if (purpose === 'Other' && !checked) {
                    form.setValue('raising_capital_2021_other', '');
                  }
                }}
              />
              <Label htmlFor={`raising_capital_${purpose}`} className="text-sm font-normal text-gray-800">{purpose}</Label>
            </div>
          ))}
        </div>
        {form.watch("raising_capital_2021").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="raising_capital_2021_other">Other:</Label>
            <Input
              id="raising_capital_2021_other"
              {...form.register("raising_capital_2021_other")}
              placeholder="Please specify other capital raising purpose"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label >38. Regarding your current fund/investment vehicle, which of the following is under consideration?</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "No change planned",
            "Seek increased access to new LP funds locally",
            "Seek increased access to new LP funds internationally",
            "Increase application of alternative debt instruments (e.g. mezzanine debt, convertible debt, or shared revenue instruments)",
            "Increase use of technology in order to lower fund operational costs",
            "Increase use of data and technology to facilitate investment decisions",
            "Build new partnerships for joint co-investment opportunities, expand pipeline opportunities",
            "Other"
          ].map((consideration) => (
            <div key={consideration} className="flex items-center space-x-2">
              <Checkbox
                id={`vehicle_consideration_${consideration}`}
                checked={form.watch("fund_vehicle_considerations").includes(consideration)}
                onCheckedChange={(checked) => {
                  const current = form.watch("fund_vehicle_considerations");
                  if (checked) {
                    form.setValue("fund_vehicle_considerations", [...current, consideration]);
                  } else {
                    form.setValue("fund_vehicle_considerations", current.filter(item => item !== consideration));
                  }
                  // Clear other input when unchecking Other
                  if (consideration === 'Other' && !checked) {
                    form.setValue('fund_vehicle_considerations_other', '');
                  }
                }}
              />
              <Label htmlFor={`vehicle_consideration_${consideration}`} className="text-sm font-normal text-gray-800">{consideration}</Label>
            </div>
          ))}
        </div>
        {form.watch("fund_vehicle_considerations").includes("Other") && (
          <div className="mt-3">
            <Label htmlFor="fund_vehicle_considerations_other">Other:</Label>
            <Input
              id="fund_vehicle_considerations_other"
              {...form.register("fund_vehicle_considerations_other")}
              placeholder="Please specify other fund vehicle consideration"
              className="mt-1"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderSection6 = () => (
    <div className="space-y-6">
      <div>
        <Label >39. Overall, how valuable have you found your participation in the ESCP network?</Label>
        <Select onValueChange={(value) => form.setValue('network_value_rating', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select rating (1 = Most valuable, 5 = Least valuable)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 (Most valuable)</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5 (Least valuable)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label >40. Please indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1 = most valuable, 5 = least valuable, N/A = not engaged</Label>
        <div className="space-y-4 mt-2">
          {[
            'Fund Economics',
            'LP Profiles',
            'Market Data',
            'Purpose Definition',
            'Access to Capital (DfID proposal)'
          ].map(group => (
            <div key={group} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label className="text-sm font-medium">{group}</Label>
              <Select onValueChange={(value) => {
                const current = form.watch('working_groups_ranking') || {};
                form.setValue('working_groups_ranking', { ...current, [group]: value });
              }}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="NA">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label >41. Do you have suggestions of new working group topics/formats you would like to see?</Label>
        <div className="mt-2">
          <textarea
            id="new_working_group_suggestions"
            {...form.register('new_working_group_suggestions')}
            placeholder="Share suggested topics or formats..."
            className="w-full min-h-[120px] rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <Label >42. Please indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1 = most valuable, 5 = least valuable, N/A = not attended</Label>
        <div className="space-y-4 mt-2">
          {[
            'Gender lens investing (facilitated by Suzanne Biegel)',
            'COVID-19 Response (peer discussion)',
            'Fundraising (presentations from I&P, Capria & DGGF)',
            'Portfolio Support (presentations from 10-Xe and AMI)',
            'SGB COVID-19 Capital Bridge Facility (presentation from CFF)',
            'Fundraising 2.0 (peer discussion)',
            'Human Capital (peer discussion)',
            'Co-investing workshop with ADAP (peer discussion)',
            'Fundraising 3.0 – local capital (peer discussion)',
            'Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)',
            'Mentoring Pilot Kick-off'
          ].map(webinar => (
            <div key={webinar} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label className="text-sm font-medium">{webinar}</Label>
              <Select onValueChange={(value) => {
                const current = form.watch('webinar_content_ranking') || {};
                form.setValue('webinar_content_ranking', { ...current, [webinar]: value });
              }}>
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="NA">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label >43. Do you have suggestions of new webinar topics/formats you would like to see?</Label>
        <div className="mt-2">
          <textarea
            id="new_webinar_suggestions"
            {...form.register('new_webinar_suggestions')}
            placeholder="Share suggested webinar topics or formats..."
            className="w-full min-h-[120px] rounded-md border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <Label >44. Do you prefer Slack or WhatsApp as a communication platform for the network?</Label>
        <Select onValueChange={(value) => {
          form.setValue('communication_platform', value);
          if (value !== 'Other') {
            form.setValue('communication_platform_other', '');
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select preferred platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Slack only">Slack only</SelectItem>
            <SelectItem value="WhatsApp only">WhatsApp only</SelectItem>
            <SelectItem value="Both Slack and WhatsApp">Both Slack (eg for working groups etc) and WhatsApp (eg for more time sensitive communications)</SelectItem>
            <SelectItem value="Neither">Neither</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {form.watch('communication_platform') === 'Other' && (
          <div className="mt-3">
            <Label htmlFor="communication_platform_other">Please specify:</Label>
            <Input
              id="communication_platform_other"
              {...form.register('communication_platform_other')}
              placeholder="Specify preferred platform"
              className="mt-1"
            />
          </div>
        )}
      </div>

    </div>
  );

  const renderSection7 = () => (
    <div className="space-y-6">
      <div>
        <Label >45. What are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1 = most valuable, 5 = least valuable</Label>
        <div className="space-y-4 mt-2">
          {[
            "Peer connections and peer learning", "Advocacy for early stage investing",
            "Raised profile/visibility (individual or collective)", "Systems change to drive more capital towards local capital providers"
          ].map((area) => (
            <div key={area} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label className="text-sm font-medium">{area}</Label>
              <Select onValueChange={(value) => {
                const current = form.watch("network_value_areas") || {};
                form.setValue("network_value_areas", { ...current, [area]: value });
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label >46. Would you like to present in Session 1: "Connection/Reconnection" on Tuesday February 16th to provide a brief (1-2 min update) on your activities/progress (please note you are not required to present in order to attend this session – presenting is optional!)?</Label>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="present_yes"
              name="present_connection"
              title="Yes"
              checked={form.watch("present_connection_session") === "Yes"}
              onChange={() => form.setValue("present_connection_session", "Yes")}
            />
            <Label htmlFor="present_yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="present_no"
              name="present_connection"
              title="No"
              checked={form.watch("present_connection_session") === "No"}
              onChange={() => form.setValue("present_connection_session", "No")}
            />
            <Label htmlFor="present_no">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="present_other"
              name="present_connection"
              title="Other"
              checked={form.watch("present_connection_session") === "Other"}
              onChange={() => form.setValue("present_connection_session", "Other")}
            />
            <Label htmlFor="present_other">Other</Label>
          </div>
        </div>
        {form.watch("present_connection_session") === "Other" && (
          <div className="mt-3">
            <Label htmlFor="present_connection_session_other">Please specify:</Label>
            <Input
              id="present_connection_session_other"
              {...form.register("present_connection_session_other")}
              placeholder="Please describe your preference"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label >47. In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1 = very interested, 2 = possibly interested, 3 = not interested</Label>
        <div className="space-y-4 mt-2">
          {[
            "Warehousing/seed funding for fund managers to build track record",
            "TA facility to support early fund economics and activities",
            "Advocacy for the early-stage investing ecosystem",
            "Mentoring program (expert led)",
            "Mentoring program (peer-led)",
            "Webinars with peer-to-peer feedback sessions",
            "Webinars with expert-led feedback sessions",
            "Fundraising Readiness Advisory Program for fund managers",
            "Investment readiness for portfolio companies",
            "Fund Manager Portal (ie library of resources, templates etc)",
            "Shared financial and impact performance data (eg a 'Bloomberg' for early stage funds)",
            "Joint back office between actively investing fund managers"
          ].map((initiative) => (
            <div key={initiative} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <Label className="text-sm font-medium">{initiative}</Label>
              <Select onValueChange={(value) => {
                const current = form.watch("convening_initiatives_ranking") || {};
                form.setValue("convening_initiatives_ranking", { ...current, [initiative]: value });
              }}>
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="-" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="convening_initiatives_other_enabled"
              checked={form.watch("convening_initiatives_other_enabled")}
              onCheckedChange={(checked) => {
                form.setValue("convening_initiatives_other_enabled", checked);
                if (!checked) {
                  form.setValue("convening_initiatives_other", "");
                  form.setValue("convening_initiatives_other_ranking", "");
                }
              }}
            />
            <Label htmlFor="convening_initiatives_other_enabled">Other:</Label>
          </div>
          {form.watch("convening_initiatives_other_enabled") && (
            <div className="mt-3 space-y-3">
              <div>
                <Label htmlFor="convening_initiatives_other">Please describe the other initiative:</Label>
                <Input
                  id="convening_initiatives_other"
                  {...form.register("convening_initiatives_other")}
                  placeholder="Please specify other initiative"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-3">
                <Label className="text-sm font-normal text-gray-800">Rank:</Label>
                <Select onValueChange={(value) => form.setValue("convening_initiatives_other_ranking", value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <Label >48. Would you be interested in participating in a peer mentoring program?</Label>
        <Select onValueChange={(value) => form.setValue("participate_mentoring_program", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes, as a mentor">Yes, as a mentor</SelectItem>
            <SelectItem value="Yes, as a mentee">Yes, as a mentee</SelectItem>
            <SelectItem value="No">No</SelectItem>
            <SelectItem value="Not sure">Not sure</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        {form.watch("participate_mentoring_program") === "Other" && (
          <div className="mt-3">
            <Label htmlFor="participate_mentoring_program_other">Please specify:</Label>
            <Input
              id="participate_mentoring_program_other"
              {...form.register("participate_mentoring_program_other")}
              placeholder="Please describe your preference"
              className="mt-1"
            />
          </div>
        )}
      </div>

      <div>
        <Label >49. Would you like to present in Session 4: "Demystifying frontier finance" on Thursday February 25th, and if so, please indicate which sub-topic(s) you would be interested in presenting on (please note you are not required to present in order to attend this session – presenting is optional!)?</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            "Yes, open ended vehicles", "Yes, early stage debt vehicles", "Yes, early stage equity",
            "Yes, gender lens investing", "Yes, angel investing / engaging local co-investors", "No"
          ].map((topic) => (
            <div key={topic} className="flex items-center space-x-2">
              <Checkbox
                id={`demystifying_${topic}`}
                checked={form.watch("present_demystifying_session").includes(topic)}
                onCheckedChange={(checked) => {
                  const current = form.watch("present_demystifying_session");
                  if (checked) {
                    form.setValue("present_demystifying_session", [...current, topic]);
                  } else {
                    form.setValue("present_demystifying_session", current.filter(item => item !== topic));
                  }
                }}
              />
              <Label htmlFor={`demystifying_${topic}`} className="text-sm font-normal text-gray-800">{topic}</Label>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="present_demystifying_session_other_enabled"
              checked={form.watch("present_demystifying_session_other_enabled")}
              onCheckedChange={(checked) => {
                form.setValue("present_demystifying_session_other_enabled", checked);
                if (!checked) {
                  form.setValue("present_demystifying_session_other", "");
                }
              }}
            />
            <Label htmlFor="present_demystifying_session_other_enabled">Other:</Label>
          </div>
          {form.watch("present_demystifying_session_other_enabled") && (
            <Input
              id="present_demystifying_session_other"
              {...form.register("present_demystifying_session_other")}
              placeholder="Please specify other session topic"
              className="mt-1"
            />
          )}
        </div>
      </div>

      <div>
        <Label >50. Any other comments / feedback that you would like to share?</Label>
        <Textarea
          id="additional_comments"
          {...form.register("additional_comments")}
          placeholder="Enter any additional comments or feedback..."
          rows={4}
        />
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 1:
        return renderSection1();
      case 2:
        return renderSection2();
      case 3:
        return renderSection3();
      case 4:
        return renderSection4();
      case 5:
        return renderSection5();
      case 6:
        return renderSection6();
      case 7:
        return renderSection7();
      default:
        return (
          <div className="text-center text-gray-500">
            Section {currentSection} will be implemented next...
          </div>
        );
    }
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className={`max-w-6xl mx-auto ${!showIntro ? 'pr-80' : ''}`}>
        {/* Back Button (hidden on intro to reclaim space) */}
        {!showIntro && null}
        
        {/* Enhanced Right Sidebar */}
        {!showIntro && (
          <div 
            className="w-72 bg-white border-l border-gray-200 p-6 fixed right-0 top-20 h-[calc(100vh-5rem)] overflow-hidden flex flex-col shadow-lg"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Survey Progress</h3>
              <div className="bg-gray-100 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Section {currentSection} of {totalSections}
              </p>
            </div>
            
            <div 
              className="space-y-3 overflow-y-auto flex-1 hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Sections</h4>
              {Array.from({ length: totalSections }, (_, idx) => idx + 1).map((sectionNumber) => {
                const isActive = currentSection === sectionNumber;
                const isCompleted = sectionNumber < currentSection;
                
                return (
                  <button
                    key={sectionNumber}
                    onClick={() => {
                      setCurrentSection(sectionNumber);
                      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                    }}
                    className={[
                      'w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 border border-blue-200 text-blue-900'
                        : isCompleted
                        ? 'bg-green-50 border border-green-200 text-green-900 hover:bg-green-100'
                        : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                    ].join(' ')}
                  >
                    <div className={[
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200',
                      isActive
                        ? 'bg-white text-blue-600'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    ].join(' ')}>
                      {isCompleted ? '✓' : sectionNumber}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold leading-tight">{getSectionTitle(sectionNumber)}</div>
                      {isCompleted && (
                        <div className="text-xs text-green-600 mt-1">Completed</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Back to Network Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/network')}
                className="w-full"
              >
                Back to Network
              </Button>
            </div>
          </div>
        )}

        {/* Header */}
        <div>

          {/* Mini Intro Page */}
          {showIntro && (
            <Card className="overflow-hidden shadow-sm border-gray-200 mb-6">
              <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-b border-blue-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-xl font-bold text-blue-900">2021 ESCP Survey</h1>
                    <p className="text-sm text-blue-700">Early Stage Capital Providers (ESCP) 2021 Convening Survey</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center flex-wrap gap-2 text-[10px] justify-end">
                      <span className="px-2 py-0.5 rounded-full bg-white/80 text-blue-700 border border-blue-200">7 sections</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/80 text-blue-700 border border-blue-200">12–15 min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate('/network')}>
                        Back to Network
                      </Button>
                      <Button size="sm" onClick={() => { setShowIntro(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0); }}>
                        Start Survey
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="space-y-3 text-blue-900">
                  <div>
                    <h2 className="text-base font-semibold text-blue-900">Early Stage Capital Providers (ESCP) — 2021 Convening Survey</h2>
                    <p className="text-sm text-blue-800">
                      The Early Stage Capital Providers (ESCP) 2021 Convening Survey has been developed in advance of our planned virtual convening in February 2021 to better understand:
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                      <li>Who is attending and what are the various investment and operational models?</li>
                      <li>What are the key challenges faced by network members and the needs for success?</li>
                      <li>What progress have ESCP network members made in the last 12 months?</li>
                      <li>What impact has COVID-19 had on members and their portfolio companies?</li>
                      <li>How valuable has the ESCP Network been to members to date?</li>
                      <li>How to organize and prioritize the upcoming 2021 convening?</li>
                    </ul>
                  <div className="space-y-2">
                    <p className="font-medium text-blue-900 text-sm">The survey is comprised of 7 sections:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                      <li>Section 1: Background Information</li>
                      <li>Section 2: Investment Thesis & Capital Construct</li>
                      <li>Section 3: Portfolio Construction and Team</li>
                      <li>Section 4: Portfolio Development & Investment Return Monetization</li>
                      <li>Section 5: Impact of COVID-19 on Vehicle and Portfolio</li>
                      <li>Section 6: Feedback on ESCP Network Membership to date</li>
                      <li>Section 7: 2021 Convening Objectives & Goals</li>
                    </ol>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900">
                    <p className="mb-1">Note: while we are asking to provide name of firm, that is for CFF internal purposes only.</p>
                    <p>All data will be aggregated and anonymized.</p>
                  </div>
                  <p className="text-sm text-blue-800">Thank you in advance for your time in completing this survey!</p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Section Tabs - removed, now using sidebar */}

        {/* Survey Form */}
        {!showIntro && (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Enhanced Progress Bar and Section Header */}
          <Card className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                Section {currentSection}: {getSectionTitle(currentSection)}
              </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentSection} of {totalSections} sections
                  </p>
            </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{Math.round(progress)}% Complete</div>
                  <div className="text-xs text-gray-500">Survey Progress</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              {/* Autosave status indicator */}
              <div className="flex items-center justify-end gap-2 text-xs">
                {saveStatus === 'saving' && (
                  <span className="text-gray-500 animate-pulse">Saving...</span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-green-600">✓ Saved</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-600">Error saving</span>
                )}
              </div>
            </div>
          </Card>

            <div className="space-y-6">
              {renderCurrentSection()}
          </div>

          {/* Enhanced Navigation Buttons */}
          <Card className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 1}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                disabled={saving}
                  className="px-6 py-2 border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50"
              >
                  {saving ? 'Saving...' : '💾 Save Draft'}
              </Button>
              {currentSection < totalSections ? (
                <Button
                  type="button"
                  onClick={handleNext}
                    className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    Next &rarr;
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Submitting...' : '🎉 Submit Survey'}
                </Button>
              )}
            </div>
          </div>
          </Card>
        </form>
        </Form>
        )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Survey2021; 