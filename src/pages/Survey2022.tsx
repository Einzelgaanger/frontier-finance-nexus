/* eslint-disable */
// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useSurveyPersistence } from '@/hooks/useSurveyPersistence';
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import Header from '@/components/layout/Header';

// 2022 Survey Schema
const survey2022Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role_title: z.string().min(1, 'Role or title is required'),
  email: z.string().email('Valid email is required'),
  organisation: z.string().min(1, 'Organisation name is required'),
  legal_entity_date: z.string().min(1, 'Legal entity date is required'),
  first_close_date: z.string().min(1, 'First close date is required'),
  first_investment_date: z.string().min(1, 'First investment date is required'),
  geographic_markets: z.array(z.string()).min(1, 'At least one geographic market must be selected'),
  geographic_markets_other: z.string().optional(),
  team_based: z.array(z.string()).min(1, 'At least one team location must be selected'),
  team_based_other: z.string().optional(),
  current_ftes: z.string().min(1, 'Current FTEs is required'),
  ye2023_ftes: z.string().min(1, 'Year-end 2023 FTEs is required'),
  principals_count: z.string().min(1, 'Number of principals is required'),
  gp_experience: z.record(z.string(), z.string()).optional(),
  gp_experience_other_selected: z.boolean().optional(),
  gp_experience_other_description: z.string().optional(),
  gender_orientation: z.array(z.string()).optional(),
  gender_orientation_other: z.string().optional(),
  investments_experience: z.string().min(1, 'Investment experience is required'),
  exits_experience: z.string().min(1, 'Exit experience is required'),
  legal_domicile: z.string().min(1, 'Legal domicile is required'),
  legal_domicile_other: z.string().optional(),
  currency_investments: z.string().min(1, 'Currency for investments is required'),
  currency_lp_commitments: z.string().min(1, 'Currency for LP commitments is required'),
  fund_operations: z.string().min(1, 'Fund operations status is required'),
  fund_operations_other: z.string().optional(),
  current_funds_raised: z.string().min(1, 'Current funds raised is required'),
  current_amount_invested: z.string().min(1, 'Current amount invested is required'),
  target_fund_size: z.string().min(1, 'Target fund size is required'),
  target_investments: z.string().min(1, 'Target number of investments is required'),
  follow_on_permitted: z.string().min(1, 'Follow-on investment permission is required'),
  target_irr: z.string().min(1, 'Target IRR is required'),
  target_irr_other: z.string().optional(),
  concessionary_capital: z.array(z.string()).optional(),
  concessionary_capital_other: z.string().optional(),
  lp_capital_sources: z.record(z.string(), z.record(z.string(), z.number())).optional(),
  lp_capital_sources_other_description: z.string().optional(),
  gp_commitment: z.string().min(1, 'GP commitment form is required'),
  management_fee: z.string().min(1, 'Management fee is required'),
  management_fee_other: z.string().optional(),
  carried_interest_hurdle: z.string().min(1, 'Carried interest hurdle is required'),
  carried_interest_hurdle_other: z.string().optional(),
  fundraising_constraints: z.record(z.string(), z.string()).optional(),
  fundraising_constraints_other_selected: z.boolean().optional(),
  fundraising_constraints_other_description: z.string().optional(),
  business_stages: z.record(z.string(), z.string()).optional(),
  business_stages_other_selected: z.boolean().optional(),
  business_stages_other_description: z.string().optional(),
  enterprise_types: z.array(z.string()).optional(),
  financing_needs: z.record(z.string(), z.string()).optional(),
  financing_needs_other_selected: z.boolean().optional(),
  financing_needs_other_description: z.string().optional(),
  sector_activities: z.record(z.string(), z.record(z.string(), z.number())).optional(),
  sector_activities_other_selected: z.boolean().optional(),
  sector_activities_other_description: z.string().optional(),
  financial_instruments: z.record(z.string(), z.string()).optional(),
  financial_instruments_other_selected: z.boolean().optional(),
  financial_instruments_other_description: z.string().optional(),
  sdg_targets: z.record(z.string(), z.string()).optional(),
  gender_lens_investing: z.record(z.string(), z.string()).optional(),
  gender_lens_investing_other_selected: z.boolean().optional(),
  gender_lens_investing_other_description: z.string().optional(),
  technology_role_investment_thesis: z.string().optional(),
  pipeline_sourcing: z.record(z.string(), z.string()).optional(),
  pipeline_sourcing_other_selected: z.boolean().optional(),
  pipeline_sourcing_other_description: z.string().optional(),
  average_investment_size_per_company: z.string().optional(),
  portfolio_value_creation_priorities: z.record(z.string(), z.string()).optional(),
  portfolio_value_creation_other_selected: z.boolean().optional(),
  portfolio_value_creation_other_description: z.string().optional(),
  typical_investment_timeframe: z.string().optional(),
  investment_monetization_exit_forms: z.array(z.string()).optional(),
  investment_monetization_exit_forms_other: z.string().optional(),
  equity_exits_achieved: z.union([z.number(), z.string()]).optional(),
  debt_repayments_achieved: z.union([z.number(), z.string()]).optional(),
  investments_made_to_date: z.union([z.number(), z.string()]).optional(),
  other_investments_supplement: z.string().optional(),
  anticipated_exits_12_months: z.string().optional(),
  revenue_growth_recent_12_months: z.union([z.number(), z.string()]).optional(),
  cash_flow_growth_recent_12_months: z.union([z.number(), z.string()]).optional(),
  revenue_growth_next_12_months: z.union([z.number(), z.string()]).optional(),
  cash_flow_growth_next_12_months: z.union([z.number(), z.string()]).optional(),
  portfolio_performance_other_selected: z.boolean().optional(),
  revenue_growth_other: z.union([z.number(), z.string()]).optional(),
  cash_flow_growth_other: z.union([z.number(), z.string()]).optional(),
  portfolio_performance_other_description: z.string().optional(),
  direct_jobs_created_cumulative: z.union([z.number(), z.string()]).optional(),
  direct_jobs_anticipated_change: z.union([z.number(), z.string()]).optional(),
  indirect_jobs_created_cumulative: z.union([z.number(), z.string()]).optional(),
  indirect_jobs_anticipated_change: z.union([z.number(), z.string()]).optional(),
  jobs_impact_other_selected: z.boolean().optional(),
  other_jobs_created_cumulative: z.union([z.number(), z.string()]).optional(),
  other_jobs_anticipated_change: z.union([z.number(), z.string()]).optional(),
  jobs_impact_other_description: z.string().optional(),
  fund_priority_areas: z.record(z.string(), z.string()).optional(),
  fund_priority_areas_other_selected: z.boolean().optional(),
  fund_priority_areas_other_description: z.string().optional(),
  domestic_factors_concerns: z.record(z.string(), z.string()).optional(),
  domestic_factors_concerns_other_selected: z.boolean().optional(),
  domestic_factors_concerns_other_description: z.string().optional(),
  international_factors_concerns: z.record(z.string(), z.string()).optional(),
  international_factors_concerns_other_selected: z.boolean().optional(),
  international_factors_concerns_other_description: z.string().optional(),
  receive_results: z.boolean().optional(),
  investment_stage: z.string().min(1, 'Investment stage is required'),
  investment_size: z.string().min(1, 'Investment size is required'),
  investment_type: z.string().min(1, 'Investment type is required'),
  sector_focus: z.string().min(1, 'Sector focus is required'),
  geographic_focus: z.string().min(1, 'Geographic focus is required'),
  value_add_services: z.string().min(1, 'Value-add services are required'),
});

type Survey2022FormData = z.infer<typeof survey2022Schema>;

const Survey2022 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(1);

  // Initialize persistence hook
  const {
    saveCurrentSection,
    saveScrollPosition,
    getLastSection,
    clearSavedData,
    setupAutoSave,
    getSavedFormData,
    saveFormData,
  } = useSurveyPersistence({ surveyKey: 'survey2022' });

  const form = useForm<Survey2022FormData>({
    shouldUnregister: false,
    defaultValues: {
      name: '',
      role_title: '',
      email: '',
      organisation: '',
      legal_entity_date: '',
      first_close_date: '',
      first_investment_date: '',
      geographic_markets: [],
      geographic_markets_other: '',
      fund_stage: '',
      fund_stage_other: '',
      investment_stage: '',
      investment_size: '',
      investment_type: '',
      sector_focus: '',
      geographic_focus: '',
      value_add_services: '',
      team_based: [],
      team_based_other: '',
      gp_experience: {},
      receive_results: false,
    },
  });


  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load saved draft on component mount
  useEffect(() => {
    const loadDraft = async () => {
      if (!user) return;
      
      try {
        // Load latest submission regardless of status (draft or completed)
        const { data: latestSubmission } = await supabase
          .from('survey_responses_2022')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (latestSubmission && latestSubmission.form_data) {
          // Load from database
          const savedData = latestSubmission.form_data;
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

  // Auto-save form data to localStorage whenever form values change
  useEffect(() => {
    const subscription = form.watch((formData) => {
      // Save to localStorage on every change
      saveFormData(formData);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, saveFormData]);

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const totalSections = 7;
  const [showIntro, setShowIntro] = useState(true);

  

  const calculateProgress = () => {
    return (currentSection / totalSections) * 100;
  };

  useEffect(() => {
    setProgress(calculateProgress());
  }, [currentSection]);


  const handleNext = () => {
    if (currentSection < totalSections) {
      const newSection = currentSection + 1;
      setCurrentSection(newSection);
      
      // Scroll to top of page for better UX
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };


  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async (data: Survey2022FormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Manual upsert to avoid unique constraint issues on user_id
      const { data: existing } = await supabase
        .from('survey_responses_2022')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const recordData = {
        user_id: user.id,
        name: data.name,
        role_title: data.role_title,
        email: data.email,
        organisation: data.organisation,
        legal_entity_date: data.legal_entity_date,
        first_close_date: data.first_close_date,
        first_investment_date: data.first_investment_date,
        geographic_markets: data.geographic_markets || [],
        geographic_markets_other: data.geographic_markets_other,
        team_based: data.team_based || [],
        team_based_other: data.team_based_other,
        current_ftes: data.current_ftes,
        ye2023_ftes: data.ye2023_ftes,
        principals_count: data.principals_count,
        gp_experience: data.gp_experience || {},
        gp_experience_other_description: data.gp_experience_other_description,
        gender_orientation: data.gender_orientation || [],
        gender_orientation_other: data.gender_orientation_other,
        investments_experience: data.investments_experience,
        exits_experience: data.exits_experience,
        legal_domicile: data.legal_domicile,
        legal_domicile_other: data.legal_domicile_other,
        currency_investments: data.currency_investments,
        currency_lp_commitments: data.currency_lp_commitments,
        fund_operations: data.fund_operations,
        fund_operations_other: data.fund_operations_other,
        current_funds_raised: data.current_funds_raised,
        current_amount_invested: data.current_amount_invested,
        target_fund_size: data.target_fund_size,
        target_investments: data.target_investments,
        follow_on_permitted: data.follow_on_permitted,
        target_irr: data.target_irr,
        target_irr_other: data.target_irr_other,
        concessionary_capital: data.concessionary_capital || [],
        concessionary_capital_other: data.concessionary_capital_other,
        lp_capital_sources: data.lp_capital_sources || {},
        lp_capital_sources_other_description: data.lp_capital_sources_other_description,
        gp_commitment: data.gp_commitment,
        management_fee: data.management_fee,
        management_fee_other: data.management_fee_other,
        carried_interest_hurdle: data.carried_interest_hurdle,
        carried_interest_hurdle_other: data.carried_interest_hurdle_other,
        fundraising_constraints: data.fundraising_constraints || {},
        fundraising_constraints_other_description: data.fundraising_constraints_other_description,
        business_stages: data.business_stages || {},
        business_stages_other_description: data.business_stages_other_description,
        enterprise_types: data.enterprise_types || [],
        financing_needs: data.financing_needs || {},
        financing_needs_other_description: data.financing_needs_other_description,
        sector_activities: data.sector_activities || {},
        sector_activities_other_description: data.sector_activities_other_description,
        financial_instruments: data.financial_instruments || {},
        financial_instruments_other_description: data.financial_instruments_other_description,
        sdg_targets: data.sdg_targets || {},
        gender_lens_investing: data.gender_lens_investing || {},
        gender_lens_investing_other_description: data.gender_lens_investing_other_description,
        technology_role_investment_thesis: data.technology_role_investment_thesis,
        pipeline_sourcing: data.pipeline_sourcing || {},
        pipeline_sourcing_other_description: data.pipeline_sourcing_other_description,
        average_investment_size_per_company: data.average_investment_size_per_company,
        portfolio_value_creation_priorities: data.portfolio_value_creation_priorities || {},
        portfolio_value_creation_other_description: data.portfolio_value_creation_other_description,
        typical_investment_timeframe: data.typical_investment_timeframe,
        investment_monetization_exit_forms: data.investment_monetization_exit_forms || [],
        investment_monetization_exit_forms_other: data.investment_monetization_exit_forms_other,
        equity_exits_achieved: data.equity_exits_achieved ? parseInt(data.equity_exits_achieved.toString()) : null,
        debt_repayments_achieved: data.debt_repayments_achieved ? parseInt(data.debt_repayments_achieved.toString()) : null,
        investments_made_to_date: data.investments_made_to_date ? parseInt(data.investments_made_to_date.toString()) : null,
        other_investments_supplement: data.other_investments_supplement,
        anticipated_exits_12_months: data.anticipated_exits_12_months,
        revenue_growth_recent_12_months: data.revenue_growth_recent_12_months ? parseFloat(data.revenue_growth_recent_12_months.toString()) : null,
        cash_flow_growth_recent_12_months: data.cash_flow_growth_recent_12_months ? parseFloat(data.cash_flow_growth_recent_12_months.toString()) : null,
        revenue_growth_next_12_months: data.revenue_growth_next_12_months ? parseFloat(data.revenue_growth_next_12_months.toString()) : null,
        cash_flow_growth_next_12_months: data.cash_flow_growth_next_12_months ? parseFloat(data.cash_flow_growth_next_12_months.toString()) : null,
        portfolio_performance_other_description: data.portfolio_performance_other_description,
        direct_jobs_created_cumulative: data.direct_jobs_created_cumulative ? parseInt(data.direct_jobs_created_cumulative.toString()) : null,
        direct_jobs_anticipated_change: data.direct_jobs_anticipated_change ? parseInt(data.direct_jobs_anticipated_change.toString()) : null,
        indirect_jobs_created_cumulative: data.indirect_jobs_created_cumulative ? parseInt(data.indirect_jobs_created_cumulative.toString()) : null,
        indirect_jobs_anticipated_change: data.indirect_jobs_anticipated_change ? parseInt(data.indirect_jobs_anticipated_change.toString()) : null,
        jobs_impact_other_description: data.jobs_impact_other_description,
        fund_priority_areas: data.fund_priority_areas || {},
        fund_priority_areas_other_description: data.fund_priority_areas_other_description,
        domestic_factors_concerns: data.domestic_factors_concerns || {},
        domestic_factors_concerns_other_description: data.domestic_factors_concerns_other_description,
        international_factors_concerns: data.international_factors_concerns || {},
        international_factors_concerns_other_description: data.international_factors_concerns_other_description,
        investment_stage: data.investment_stage,
        investment_size: data.investment_size,
        investment_type: data.investment_type,
        sector_focus: data.sector_focus,
        geographic_focus: data.geographic_focus,
        value_add_services: data.value_add_services,
        receive_results: data.receive_results || false,
        form_data: data,
        submission_status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      let submitError;
      if (existing) {
        const { error: updateError } = await supabase
          .from('survey_responses_2022')
          .update(recordData)
          .eq('id', existing.id);
        submitError = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('survey_responses_2022')
          .insert(recordData);
        submitError = insertError;
      }

      if (submitError) throw submitError;

      
      toast({
        title: "Survey Submitted",
        description: "Thank you for completing the 2022 survey!",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
      
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

  const renderSection1 = () => (
    <div className="space-y-6">
      {/* Intro moved to intro card */}

      <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>1. Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
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
                <FormLabel>2. Role or title</FormLabel>
                <FormControl>
                  <Input placeholder="Your role or title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>3. Email address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="organisation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>4. Name of organisation</FormLabel>
                <FormControl>
                  <Input placeholder="Your organisation name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
        <div>
          <FormLabel>5. Timeline. When did your current fund/investment vehicle achieve each of the following?</FormLabel>
          <p className="text-sm text-gray-600 mb-4">
            (Please provide a date for each of three points in your fund's evolution)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="legal_entity_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Entity</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_achieved">Not Achieved</SelectItem>
                      <SelectItem value="2015_or_earlier">2015 or earlier</SelectItem>
                      <SelectItem value="2016_2020">2016 - 2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="first_close_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Close (or equivalent)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_achieved">Not Achieved</SelectItem>
                      <SelectItem value="2015_or_earlier">2015 or earlier</SelectItem>
                      <SelectItem value="2016_2020">2016 - 2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="first_investment_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Investment</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_achieved">Not Achieved</SelectItem>
                      <SelectItem value="2015_or_earlier">2015 or earlier</SelectItem>
                      <SelectItem value="2016_2020">2016 - 2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <FormLabel>6. In what geographic markets do you operate?</FormLabel>
          <p className="text-sm text-gray-600 mb-4">
            (select as many as applicable)
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'US', 'Europe', 'Africa: West Africa', 'Africa: East Africa',
              'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa', 'Middle East'
            ].map((market) => (
              <FormField
                key={market}
                control={form.control}
                name="geographic_markets"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(market)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, market]);
                          } else {
                            field.onChange(current.filter((value) => value !== market));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{market}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
            
            <FormField
              control={form.control}
              name="geographic_markets"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Other')}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, 'Other']);
                        } else {
                          field.onChange(current.filter((value) => value !== 'Other'));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          {form.watch('geographic_markets')?.includes('Other') && (
            <div className="mt-4">
              <FormField
                control={form.control}
                name="geographic_markets_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Please specify other geographic market</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Specify other geographic market" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div>
          <FormLabel>7. Where is your Team based?</FormLabel>
          <p className="text-sm text-gray-600 mb-4">
            (select as many as applicable)
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'US', 'Europe', 'Africa: West Africa', 'Africa: East Africa',
              'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa', 'Middle East'
            ].map((location) => (
              <FormField
                key={location}
                control={form.control}
                name="team_based"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={(field.value || []).includes(location)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, location]);
                          } else {
                            field.onChange(current.filter((value) => value !== location));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{location}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
            
            <FormField
              control={form.control}
              name="team_based"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Other')}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, 'Other']);
                        } else {
                          field.onChange(current.filter((value) => value !== 'Other'));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          {form.watch('team_based')?.includes('Other') && (
            <div className="mt-4">
              <FormField
                control={form.control}
                name="team_based_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Please specify other team location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Specify other team location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div>
          <FormLabel>8. Number of current and forecasted Full Time Equivalent staff members (FTEs) including principals</FormLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="current_ftes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lte_2_FTEs">&le; 2 FTEs</SelectItem>
                      <SelectItem value="3_5_FTEs">3 - 5 FTEs</SelectItem>
                      <SelectItem value="6_10_FTEs">6 - 10 FTEs</SelectItem>
                      <SelectItem value="gt_10_FTEs">&gt;10 FTEs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ye2023_ftes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year-End 2023 (est.)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lte_2_FTEs">&le; 2 FTEs</SelectItem>
                      <SelectItem value="3_5_FTEs">3 - 5 FTEs</SelectItem>
                      <SelectItem value="6_10_FTEs">6 - 10 FTEs</SelectItem>
                      <SelectItem value="gt_10_FTEs">&gt;10 FTEs</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div>
          <FormLabel>9. Number of carried-interest/equity-interest principals currently in your Fund management team</FormLabel>
          
          <FormField
            control={form.control}
            name="principals_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select number</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2 - 3">2 - 3</SelectItem>
                    <SelectItem value="4 - 5">4 - 5</SelectItem>
                    <SelectItem value="gt_5">&gt; 5</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormLabel>10. Within the GP leadership team / fund principals, what is their prior work experience as it relates to fund management?</FormLabel>
          <p className="text-sm text-gray-600 mb-4">
            (Please provide a response for each row as to your GP management team / fund principals experience)
          </p>
          
          <div className="space-y-4">
            {[
              'New to investment and fund management',
              'Investment/ financial experience in adjacent finance field (e.g. banking, asset management, financial advisory)',
              'Relevant business management experience (e.g. Entrepreneur/CEO, business CFO, management consultancy)',
              'GP management/ investment team has direct fund investment experience. However, lack well-documented data regarding prior investment performance, track record and exits.',
              'GP management/ investment team has direct investment experience in senior fund management position. Have a well-documented data regarding prior investment performance, track record and exits.'
            ].map((experience) => (
              <div key={experience} className="flex items-center justify-between space-x-4 py-3 border-b border-gray-100">
                <div className="flex-1">
                  <FormLabel className="text-sm font-normal text-gray-900 leading-tight">{experience}</FormLabel>
                </div>
                <div className="flex-shrink-0">
                  <FormField
                    control={form.control}
                    name={`gp_experience.${experience}`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select applicability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                            <SelectItem value="Applies to 1 Principal">Applies to 1 Principal</SelectItem>
                            <SelectItem value="Applies to 2 or more principals">Applies to 2 or more principals</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
            
            <div className="flex items-center justify-between space-x-4 py-3 border-b border-gray-100">
              <div className="flex-1">
                <FormLabel className="text-sm font-normal text-gray-900 leading-tight">Other (please specify)</FormLabel>
              </div>
              <div className="flex-shrink-0">
                <FormField
                  control={form.control}
                  name="gp_experience_other_selected"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Enable Other
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
              
            {form.watch('gp_experience_other_selected') && (
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="gp_experience_other_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Please specify other experience</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Describe other experience" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gp_experience.Other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Applicability</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select applicability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                          <SelectItem value="Applies to 1 Principal">Applies to 1 Principal</SelectItem>
                          <SelectItem value="Applies to 2 or more principals">Applies to 2 or more principals</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <FormLabel>11. Gender orientation. Do any of the following apply to your fund?</FormLabel>
          <p className="text-sm text-gray-600 mb-4">
            (select as many as applicable)
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              'Women ownership/participation interest is greater than or equal to 50%',
              'Women representation on the board/investment committee is greater than or equal to 50',
              'Female staffing is greater than or equal to 50%',
              'Provide specific reporting on gender related indicators for your investors/funders',
              'Require specific reporting on gender related indicators by your investees/borrowers'
            ].map((option) => (
              <FormField
                key={option}
                control={form.control}
                name="gender_orientation"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(option)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, option]);
                          } else {
                            field.onChange(current.filter((value) => value !== option));
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{option}</FormLabel>
                  </FormItem>
                )}
              />
            ))}
            
            <FormField
              control={form.control}
              name="gender_orientation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes('Other')}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        if (checked) {
                          field.onChange([...current, 'Other']);
                        } else {
                          field.onChange(current.filter((value) => value !== 'Other'));
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
                </FormItem>
              )}
            />
          </div>
          
          {form.watch('gender_orientation')?.includes('Other') && (
            <div className="mt-4">
              <FormField
                control={form.control}
                name="gender_orientation_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Please specify other gender orientation aspect</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Specify other gender orientation aspect" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div>
          <FormLabel>12. Team Experience: Please specify cumulative number of investment/financing transactions completed by your principal(s) prior to this current fund/vehicle?</FormLabel>
          <p className="text-sm text-gray-600 mb-4">
            (Please provide answer for both columns)
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="investments_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investments</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1 - 4">1 - 4</SelectItem>
                      <SelectItem value="5 - 9">5 - 9</SelectItem>
                      <SelectItem value="10 - 14">10 - 14</SelectItem>
                      <SelectItem value="15 - 24">15 - 24</SelectItem>
                      <SelectItem value="gte_25">≥ 25</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="exits_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exits & Monetizations</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1 - 4">1 - 4</SelectItem>
                      <SelectItem value="5 - 9">5 - 9</SelectItem>
                      <SelectItem value="10 - 14">10 - 14</SelectItem>
                      <SelectItem value="15 - 24">15 - 24</SelectItem>
                      <SelectItem value="gte_25">≥ 25</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );


  const renderSection3 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
          <FormField
            control={form.control}
            name="legal_domicile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>13. Where is your legal domicile?</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select legal domicile" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                    <SelectItem value="location_pending">Location Pending. Dependent upon Anchor Investor preference</SelectItem>
                    <SelectItem value="mauritius">Mauritius</SelectItem>
                    <SelectItem value="netherlands">Netherlands</SelectItem>
                    <SelectItem value="dutch_antilles">Dutch Antilles</SelectItem>
                    <SelectItem value="luxembourg">Luxembourg</SelectItem>
                    <SelectItem value="ireland">Ireland</SelectItem>
                    <SelectItem value="delaware">Delaware</SelectItem>
                    <SelectItem value="cayman_island">Cayman Island</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="senegal">Senegal</SelectItem>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="south_africa">South Africa</SelectItem>
                    <SelectItem value="ghana">Ghana</SelectItem>
                    <SelectItem value="other">Other (please specify)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional "Other" input field */}
          {form.watch('legal_domicile') === 'other' && (
            <FormField
              control={form.control}
              name="legal_domicile_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Please specify other legal domicile</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Specify other legal domicile" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div>
            <FormLabel>14. Currency Management. What currency do you make investments? What currency is your fund LP vehicle?</FormLabel>
            <p className="text-sm text-gray-600 mb-4">
              (Please answer for both as appropriate)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="currency_investments"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Currency for Investments</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                        <SelectItem value="Local Currency">Local Currency</SelectItem>
                        <SelectItem value="Foreign Currency">Foreign Currency</SelectItem>
                        <SelectItem value="Multiple Currencies">Multiple Currencies</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency_lp_commitments"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Currency for LP Commitments</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                        <SelectItem value="Local Currency">Local Currency</SelectItem>
                        <SelectItem value="Foreign Currency">Foreign Currency</SelectItem>
                        <SelectItem value="Multiple Currencies">Multiple Currencies</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="fund_operations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>15. What is the type (closed vs. open ended) and current status of your fund vehicle's operations?</FormLabel>
                <p className="text-sm text-gray-600 mb-3">(Please select appropriate response)</p>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select fund type and status" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                    <SelectItem value="Closed ended - fundraising">Closed ended - fundraising</SelectItem>
                    <SelectItem value="Closed ended - completed first close">Closed ended - completed first close</SelectItem>
                    <SelectItem value="Closed ended - completed second close">Closed ended - completed second close</SelectItem>
                    <SelectItem value="Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)">Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)</SelectItem>
                    <SelectItem value="Open ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics">Open ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics</SelectItem>
                    <SelectItem value="Second fund/vehicle">Second fund/vehicle</SelectItem>
                    <SelectItem value="Third or later fund/vehicle">Third or later fund/vehicle</SelectItem>
                    <SelectItem value="Other">Other (please specify)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Conditional "Other" input field */}
          {form.watch('fund_operations') === 'Other' && (
            <FormField
              control={form.control}
              name="fund_operations_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Please specify other fund type and status</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Specify other fund type and status" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="space-y-4">
            <div>
              <FormLabel>16. What are the current hard commitments raised, current amount invested/outstanding portfolio and target size of your fund vehicle? (USD Equivalent)</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(Please provide one answer for each column)</p>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="current_funds_raised"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Current Funds Raised</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                        <SelectItem value="< $1 million">&lt; $1 million</SelectItem>
                        <SelectItem value="$1 - 4 million">$1 - 4 million</SelectItem>
                        <SelectItem value="$5 - 9 million">$5 - 9 million</SelectItem>
                        <SelectItem value="$10 - 19 million">$10 - 19 million</SelectItem>
                        <SelectItem value="$20 - 29 million">$20 - 29 million</SelectItem>
                        <SelectItem value="$30 million or more">$30 million or more</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="current_amount_invested"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Current Amount Invested by Fund</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                        <SelectItem value="< $1 million">&lt; $1 million</SelectItem>
                        <SelectItem value="$1 - 4 million">$1 - 4 million</SelectItem>
                        <SelectItem value="$5 - 9 million">$5 - 9 million</SelectItem>
                        <SelectItem value="$10 - 19 million">$10 - 19 million</SelectItem>
                        <SelectItem value="$20 - 29 million">$20 - 29 million</SelectItem>
                        <SelectItem value="$30 million or more">$30 million or more</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_fund_size"
              render={({ field }) => (
                <FormItem>
                    <FormLabel>Target Fund Size</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                        <SelectItem value="< $1 million">&lt; $1 million</SelectItem>
                        <SelectItem value="$1 - 4 million">$1 - 4 million</SelectItem>
                        <SelectItem value="$5 - 9 million">$5 - 9 million</SelectItem>
                        <SelectItem value="$10 - 19 million">$10 - 19 million</SelectItem>
                        <SelectItem value="$20 - 29 million">$20 - 29 million</SelectItem>
                        <SelectItem value="$30 million or more">$30 million or more</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
          </div>

            <FormField
              control={form.control}
              name="target_investments"
              render={({ field }) => (
                <FormItem>
                <FormLabel>17. What is target number of investments / borrowers for your fund?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select number of enterprises" />
                    </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                    <SelectItem value="< 10 Enterprises">&lt; 10 Enterprises</SelectItem>
                    <SelectItem value="11 - 20 Enterprises">11 - 20 Enterprises</SelectItem>
                    <SelectItem value="21 - 30 Enterprises">21 - 30 Enterprises</SelectItem>
                    <SelectItem value="> 30 Enterprises">&gt; 30 Enterprises</SelectItem>

                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="follow_on_permitted"
              render={({ field }) => (
                <FormItem>
                <FormLabel>18. Does your LP agreement/governance permit "follow-on" investments?</FormLabel>
                <p className="text-sm text-gray-600 mb-3">Follow-on investment</p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                    <SelectValue placeholder="Select percentage range" />
                    </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                    <SelectItem value="Not Permitted">Not Permitted</SelectItem>
                    <SelectItem value="lt_25_percent_of_Fund">&lt; 25% of Fund</SelectItem>
                    <SelectItem value="26_50_percent_of_Fund">26% - 50% of Fund</SelectItem>
                    <SelectItem value="gt_50_percent_of_Fund">&gt; 50% of Fund</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">

            <FormField
              control={form.control}
              name="target_irr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>19. What is the target IRR for non-concessionary investors when investing in your capital vehicle (USD equivalent)?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target IRR" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                      <SelectItem value="N/A - 100% of our capital is concessionary">N/A - 100% of our capital is concessionary</SelectItem>
                      <SelectItem value="lte_5_percent">&le; 5%</SelectItem>
                      <SelectItem value="6 - 9%">6 - 9%</SelectItem>
                      <SelectItem value="10 - 14%">10 - 14%</SelectItem>
                      <SelectItem value="15 - 19%">15 - 19%</SelectItem>
                      <SelectItem value="gte_20_percent">&ge; 20%</SelectItem>
                      <SelectItem value="Other">Other (please specify)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional "Other" input field */}
            {form.watch('target_irr') === 'Other' && (
              <FormField
                control={form.control}
                name="target_irr_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify other target IRR</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Specify other target IRR" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="concessionary_capital"
            render={() => (
              <FormItem>
                <FormLabel>20. Has your fund/vehicle received concessionary capital for any of the following needs?</FormLabel>
                <p className="text-sm text-gray-600 mb-3">(select as many as appropriate)</p>
                <div className="space-y-3">
                  {[
                    'No Concessionary Capital',
                    'Finance pre-launch set up costs (e.g. legal, GP team salaries, advisors, accountants, etc.)',
                    'Finance the fund\'s ongoing operating costs (post 1st Close)',
                    'Provide First Loss or Risk Mitigation for LPs',
                    'Finance business development costs associated with portfolio enterprises'
                  ].map((option) => (
                    <FormField
                      key={option}
                      control={form.control}
                      name="concessionary_capital"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value || [], option])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== option
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  
                  {/* Other option with checkbox */}
                  <FormField
                    control={form.control}
                    name="concessionary_capital"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes('Other')}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value || [], 'Other'])
                                : field.onChange(
                                    field.value?.filter(
                                      (value: string) => value !== 'Other'
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Other (please specify)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {/* Conditional "Other" input field */}
                  {form.watch('concessionary_capital')?.includes('Other') && (
                    <FormField
                      control={form.control}
                      name="concessionary_capital_other"
                      render={({ field }) => (
                        <FormItem className="ml-6">
                          <FormControl>
                            <Input {...field} placeholder="Please specify other concessionary capital need" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div>
              <FormLabel>21. Sources of LP capital. Please rank by percentage how much each of these categories represent within the existing and your intended make-up of your LP capital providers.</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(Please provide a response for each row, and look to sum as close to 100% of your fund's sources of LP capital)</p>
            </div>
            
            <div className="space-y-3">
              {[
                'Local High net worth / Angel Networks / Family offices',
                'Domestic institutional capital (e.g. pension funds, asset mgt. firms, etc.)',
                'Local government agencies',
                'International Fund of Fund Vehicles',
                'International institutional capital (e.g. pension funds, asset mgt. firms, etc.)',
                'Development finance institutions (DFIs)',
                'International impact investors',
                'Donors / Bilateral Agencies / Foundations'
              ].map((category) => {
                const existing = form.watch(`lp_capital_sources.${category}.existing`) || 0;
                const targeted = form.watch(`lp_capital_sources.${category}.targeted`) || 0;
                const total = (typeof existing === 'number' ? existing : 0) + (typeof targeted === 'number' ? targeted : 0);
                const isValid = Math.abs(total - 100) < 0.1;
                
                return (
                  <div key={category} className="flex items-center justify-between space-x-4 py-2 border-b border-gray-100">
                    <div className="flex-1">
                      <span className="text-sm font-normal">{category}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <FormField
                        control={form.control}
                        name={`lp_capital_sources.${category}.existing`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-normal">Existing (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value || ''}
                                placeholder="0"
                                className="h-8 w-20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lp_capital_sources.${category}.targeted`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-normal">Targeted (%)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                value={field.value || ''}
                                placeholder="0"
                                className="h-8 w-20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="text-center w-20">
                      <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {total.toFixed(1)}%
                      </span>
                      {!isValid && (
                        <div className="text-xs text-red-600 mt-1">
                          {total < 100 ? `Need ${(100 - total).toFixed(1)}%` : `${(total - 100).toFixed(1)}% over`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* Other category integrated inline */}
              <div className="flex items-center justify-between space-x-4 py-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="lp_capital_sources_other_selected"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <FormField
                    control={form.control}
                    name="lp_capital_sources.Other.existing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-normal">Existing (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            value={field.value || ''}
                            placeholder="0"
                            className="h-8 w-20"
                            disabled={!form.watch('lp_capital_sources_other_selected')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lp_capital_sources.Other.targeted"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-normal">Targeted (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            value={field.value || ''}
                            placeholder="0"
                            className="h-8 w-20"
                            disabled={!form.watch('lp_capital_sources_other_selected')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="text-center w-20">
                  {form.watch('lp_capital_sources_other_selected') && (() => {
                    const existing = form.watch('lp_capital_sources.Other.existing') || 0;
                    const targeted = form.watch('lp_capital_sources.Other.targeted') || 0;
                    const total = (typeof existing === 'number' ? existing : 0) + (typeof targeted === 'number' ? targeted : 0);
                    const isValid = Math.abs(total - 100) < 0.1;
                    
                    return (
                      <>
                        <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {total.toFixed(1)}%
                        </span>
                        {!isValid && (
                          <div className="text-xs text-red-600 mt-1">
                            {total < 100 ? `Need ${(100 - total).toFixed(1)}%` : `${(total - 100).toFixed(1)}% over`}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {/* Description field for Other when selected */}
              {form.watch('lp_capital_sources_other_selected') && (
                <div className="pl-6 border-l-2 border-gray-200">
                  <FormField
                    control={form.control}
                    name="lp_capital_sources_other_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Please specify other LP capital source</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Specify other LP capital source" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Question 22: GP Financial Commitment */}
            <FormField
              control={form.control}
              name="gp_commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>22. In determining the capital contribution by the fund management team into the vehicle, what is the form of GP financial commitment?</FormLabel>
                  <p className="text-sm text-gray-600 mb-3">(Please select appropriate response)</p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GP financial commitment form" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                      <SelectItem value="Sweat equity of contributed work by GP management team to develop and launch fund">"Sweat" equity of contributed work by GP management team to develop and launch fund</SelectItem>
                      <SelectItem value="Cash investment by GP management team">Cash investment by GP management team</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                      <SelectItem value="None of the above">None of the above</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Question 23: GP Management Fee */}
            <FormField
              control={form.control}
              name="management_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>23. What is the GP Management Fee?</FormLabel>
                  <p className="text-sm text-gray-600 mb-3">(Please select the appropriate description)</p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select GP management fee" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                      <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      <SelectItem value="< 2% GP Management Fee">&lt; 2% GP Management Fee</SelectItem>
                      <SelectItem value="2% GP Management Fee">2% GP Management Fee</SelectItem>
                      <SelectItem value="> 2% GP Management Fee">&gt; 2% GP Management Fee</SelectItem>
                      <SelectItem value="Sliding Scale based on Size of AUM">Sliding Scale based on Size of AUM (please describe in Other)</SelectItem>
                      <SelectItem value="Other">Other (please specify)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional "Other" input field for Question 23 */}
            {(form.watch('management_fee') === 'Other' || form.watch('management_fee') === 'Sliding Scale based on Size of AUM') && (
              <FormField
                control={form.control}
                name="management_fee_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify management fee details</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Specify management fee details" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Question 24: Carried Interest Hurdle */}
            <FormField
              control={form.control}
              name="carried_interest_hurdle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>24. Does your carried interest have a hurdle target?</FormLabel>
                  <p className="text-sm text-gray-600 mb-3">(Select the appropriate response)</p>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select carried interest hurdle" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                      <SelectItem value="N/A - No Carried Interest">N/A - No Carried Interest</SelectItem>
                      <SelectItem value="IRR_gt_5_percent">Hurdle Target: IRR Returns &gt; 5% (USD Equivalent)</SelectItem>
                      <SelectItem value="IRR_gt_8_percent">Hurdle Target: IRR Returns &gt; 8% (USD Equivalent)</SelectItem>
                      <SelectItem value="IRR_gt_10_percent">Hurdle Target: IRR Returns &gt; 10% (USD Equivalent)</SelectItem>
                      <SelectItem value="Other">Other (please specify basis for calculation and hurdle rate)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Conditional "Other" input field for Question 24 */}
            {form.watch('carried_interest_hurdle') === 'Other' && (
              <FormField
                control={form.control}
                name="carried_interest_hurdle_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify basis for calculation and hurdle rate</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Specify basis for calculation and hurdle rate" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Question 25: Fundraising Constraints Ranking */}
            <div>
              <FormLabel>25. In raising funds for your vehicle, what are the factors that you perceive as the most consequential barriers/constraints in raising funds from potential investors?</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(Please provide a response for each row, ranking 1 = least constraining to 5 = most constraining)</p>
              
              <div className="space-y-3">
                {[
                  'Geography/ Country Targeted for Investing',
                  'Size of Fund',
                  'Lack of Alignment on Sectors/ Investment Thesis',
                  'Perceived lack of sufficient prior fund management experience',
                  'Target Investment Returns',
                  'Perceived risk associated with underlying investment portfolio',
                  'Fund Economics',
                  'Currency',
                  'Domicile of Vehicle',
                  'Back-office systems/ Capabilities',
                  'Governance / Risk Management Systems and Capabilities'
                ].map((constraint) => (
                  <div key={constraint} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-sm font-normal">{constraint}</span>
          </div>
                    <div className="md:w-64">
                      <FormField
                        control={form.control}
                        name={`fundraising_constraints.${constraint}`}
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ranking" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                <SelectItem value="1 - Least Constraining">1 - Least Constraining</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5 - Most Constraining">5 - Most Constraining</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                
                {/* Other constraint with description and ranking */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="fundraising_constraints_other_selected"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Other (please specify constraint and 1 - 5 ranking)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('fundraising_constraints_other_selected') && (
                    <div className="space-y-3 ml-6">
                      <FormField
                        control={form.control}
                        name="fundraising_constraints_other_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">Please specify the constraint</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the other constraint" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-sm font-normal">Ranking for this constraint</span>
                        </div>
                        <div className="md:w-64">
                          <FormField
                            control={form.control}
                            name="fundraising_constraints.Other"
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select ranking" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                    <SelectItem value="1 - Least Constraining">1 - Least Constraining</SelectItem>
                                    <SelectItem value="2">2</SelectItem>
                                    <SelectItem value="3">3</SelectItem>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="5 - Most Constraining">5 - Most Constraining</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  );

  const renderSection4 = () => (
    <div className="space-y-6">
      {/* Section 4: Investment Thesis */}
      <div className="space-y-6">
        {/* Question 26: Business Stage Investment */}
        <div>
          <FormLabel>26. Stage of the businesses that you finance / invest in.</FormLabel>
          <p className="text-sm text-gray-600 mt-1 mb-4">(Please provide a response for each row, allocating as close to 100% as possible.)</p>
          
          <div className="space-y-3">
                {[
                  'Start-up (pre-revenue, concept and business plan development)',
                  'Early stage (early revenue, product/service development, funds needed to expand business model)',
                  'Growth (established business in need of funds for expansion, assets, working capital etc)'
                ].map((stage) => (
                  <div key={stage} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-sm font-normal">{stage}</span>
                    </div>
                    <div className="md:w-64">
          <FormField
            control={form.control}
                        name={`business_stages.${stage}`}
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                                <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                <SelectItem value="0% Not a target Segment">0% Not a target Segment</SelectItem>
                                <SelectItem value="1 - 24% of target portfolio">1 - 24% of target portfolio</SelectItem>
                                <SelectItem value="25 - 49% of target portfolio">25 - 49% of target portfolio</SelectItem>
                                <SelectItem value="50 - 74% of target portfolio">50 - 74% of target portfolio</SelectItem>
                                <SelectItem value="gte_75_percent_target_portfolio">&ge; 75% of target portfolio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                    </div>
                  </div>
                ))}

                {/* Other stage with description and percentage */}
                <div className="space-y-3">
          <FormField
            control={form.control}
                    name="business_stages_other_selected"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Other (please specify)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('business_stages_other_selected') && (
                    <div className="space-y-3 ml-6">
                      <FormField
                        control={form.control}
                        name="business_stages_other_description"
            render={({ field }) => (
              <FormItem>
                            <FormLabel className="text-sm font-normal">Please specify the business stage</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the other business stage" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-sm font-normal">Percentage for this business stage</span>
                        </div>
                        <div className="md:w-64">
                          <FormField
                            control={form.control}
                            name="business_stages.Other"
                            render={({ field }) => (
                              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                                    <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                    <SelectItem value="0% Not a target Segment">0% Not a target Segment</SelectItem>
                                    <SelectItem value="1 - 24% of target portfolio">1 - 24% of target portfolio</SelectItem>
                                    <SelectItem value="25 - 49% of target portfolio">25 - 49% of target portfolio</SelectItem>
                                    <SelectItem value="50 - 74% of target portfolio">50 - 74% of target portfolio</SelectItem>
                                    <SelectItem value="gte_75_percent_target_portfolio">&ge; 75% of target portfolio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question 27: Type of Enterprises */}
            <div>
              <FormLabel>27. Type of enterprises you finance / invest in?</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(Please select as many as applicable)</p>
              
              <div className="space-y-3">
                {[
                  'Livelihood Sustaining Enterprises (e.g. businesses seeking small, incremental growth, often with family management team)',
                  'Growth Enterprises (e.g. proven business models in established sectors, seeking market share and market expansion growth opportunities)',
                  'Dynamic Enterprises (e.g. proven business model applying tech-enabling to accelerate growth)',
                  'High-Growth Ventures (e.g. tech-based and disruptive business models targeting large markets with high growth potential)'
                ].map((enterpriseType) => (
          <FormField
                    key={enterpriseType}
            control={form.control}
                    name="enterprise_types"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={enterpriseType}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(enterpriseType)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], enterpriseType])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== enterpriseType
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {enterpriseType}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Question 28: Key Financing Needs */}
            <div>
              <FormLabel>28. Describe the Key Financing Needs of your Portfolio Enterprises at the time of initial investment/funding.</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(Please provide a response for each row, allocating as close to 100% as possible)</p>
              
              <div className="space-y-3">
                {[
                  'Venture launch (e.g. invest in initial staff, product/ services development and market acceptance)',
                  'Inventory and working capital requirements',
                  'Small-ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment)',
                  'Major capital investments (facilities, production equipment, fleet/ logistics, etc.)',
                  'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)'
                ].map((financingNeed) => (
                  <div key={financingNeed} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-sm font-normal">{financingNeed}</span>
                    </div>
                    <div className="md:w-64">
                      <FormField
                        control={form.control}
                        name={`financing_needs.${financingNeed}`}
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                                <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                <SelectItem value="0% Not a target investment focus">0% Not a target investment focus</SelectItem>
                                <SelectItem value="1-24% of target portfolio">1-24% of target portfolio</SelectItem>
                                <SelectItem value="25-49% of target portfolio">25-49% of target portfolio</SelectItem>
                                <SelectItem value="50-74% of target portfolio">50-74% of target portfolio</SelectItem>
                                <SelectItem value="gte_75_percent_target_portfolio">&ge; 75% of target portfolio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                    </div>
                  </div>
                ))}

                {/* Other financing need with description and percentage */}
                <div className="space-y-3">
          <FormField
            control={form.control}
                    name="financing_needs_other_selected"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Other (please specify)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('financing_needs_other_selected') && (
                    <div className="space-y-3 ml-6">
                      <FormField
                        control={form.control}
                        name="financing_needs_other_description"
            render={({ field }) => (
              <FormItem>
                            <FormLabel className="text-sm font-normal">Please specify the financing need</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the other financing need" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-sm font-normal">Percentage for this financing need</span>
                        </div>
                        <div className="md:w-64">
                          <FormField
                            control={form.control}
                            name="financing_needs.Other"
                            render={({ field }) => (
                              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                                    <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                    <SelectItem value="0% Not a target investment focus">0% Not a target investment focus</SelectItem>
                                    <SelectItem value="1-24% of target portfolio">1-24% of target portfolio</SelectItem>
                                    <SelectItem value="25-49% of target portfolio">25-49% of target portfolio</SelectItem>
                                    <SelectItem value="50-74% of target portfolio">50-74% of target portfolio</SelectItem>
                                    <SelectItem value="gte_75_percent_target_portfolio">&ge; 75% of target portfolio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question 29: Current and Target Investment Activities by Sector */}
            <div>
              <FormLabel>29. Current and Target Investment Activities by Sector. Based on your targets, please rank the top sectors by priority focus for your fund, current and target percentages of your portfolio.</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(if "other", please indicate in the space provided and target percentage of portfolio)</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm font-medium border-b pb-2">
                  <div>Sector Focus</div>
                  <div>Current Percentage Outstanding to this sector</div>
                  <div>Fund Target Percentage Allocation to this Sector</div>
                  <div className="text-center">Total</div>
                </div>
                
                {[
                  '#1 Sector Focus',
                  '#2 Sector Focus', 
                  '#3 Sector Focus',
                  '#4 Sector Focus',
                  '#5 Sector Focus'
                ].map((sectorRank) => {
                  const current = form.watch(`sector_activities.${sectorRank}.current`) || 0;
                  const target = form.watch(`sector_activities.${sectorRank}.target`) || 0;
                  const total = (typeof current === 'number' ? current : 0) + (typeof target === 'number' ? target : 0);
                  const isValid = Math.abs(total - 100) < 0.1;
                  
                  return (
                    <div key={sectorRank} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="text-sm font-normal">{sectorRank}</div>
                      <div>
                        <FormField
                          control={form.control}
                          name={`sector_activities.${sectorRank}.current`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="%" 
                                  className="h-8"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name={`sector_activities.${sectorRank}.target`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  type="number" 
                                  placeholder="%" 
                                  className="h-8"
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="text-center">
                        <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                          {total}%
                        </span>
                        {!isValid && (
                          <div className="text-xs text-red-600 mt-1">
                            {total < 100 ? `Need ${100 - total}%` : `${total - 100}% over`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Other sector with description and percentages */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="sector_activities_other_selected"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Other (please specify sector and ranking)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('sector_activities_other_selected') && (
                    <div className="space-y-3 ml-6">
                      <FormField
                        control={form.control}
                        name="sector_activities_other_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">Please specify the sector and ranking</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the other sector and its ranking" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="text-sm font-normal">Other Sector</div>
                        <div>
                          <FormField
                            control={form.control}
                            name="sector_activities.Other.current"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    placeholder="%" 
                                    className="h-8"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name="sector_activities.Other.target"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    {...field} 
                                    type="number" 
                                    placeholder="%" 
                                    className="h-8"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="text-center">
                          {(() => {
                            const current = form.watch('sector_activities.Other.current') || 0;
                            const target = form.watch('sector_activities.Other.target') || 0;
                            const total = (typeof current === 'number' ? current : 0) + (typeof target === 'number' ? target : 0);
                            const isValid = Math.abs(total - 100) < 0.1;
                            
                            return (
                              <>
                                <span className={`text-sm font-medium ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                                  {total}%
                                </span>
                                {!isValid && (
                                  <div className="text-xs text-red-600 mt-1">
                                    {total < 100 ? `Need ${100 - total}%` : `${total - 100}% over`}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question 30: Financial Instruments */}
            <div>
              <FormLabel>30. Financial Instruments applied in making financing/investments.</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(Please provide a response for each row, allocating as close to 100% as possible)</p>
              
              <div className="space-y-3">
                {[
                  'Senior debt: Secured',
                  'Senior debt: Unsecured',
                  'Mezzanine/subordinated debt',
                  'Convertible notes',
                  'SAFEs',
                  'Shared revenue/earnings instruments',
                  'Preferred Equity',
                  'Common equity'
                ].map((instrument) => (
                  <div key={instrument} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-sm font-normal">{instrument}</span>
                    </div>
                    <div className="md:w-64">
                      <FormField
                        control={form.control}
                        name={`financial_instruments.${instrument}`}
                        render={({ field }) => (
                          <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                                <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                <SelectItem value="0% - Not a form of investment for us">0% - Not a form of investment for us</SelectItem>
                                <SelectItem value="1 - 24% of invested capital">1 - 24% of invested capital</SelectItem>
                                <SelectItem value="25 - 49% of invested capital">25 - 49% of invested capital</SelectItem>
                                <SelectItem value="50 - 74% of invested capital">50 - 74% of invested capital</SelectItem>
                                <SelectItem value="gte_75_percent_invested_capital">&ge; 75% of invested capital</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                    </div>
                  </div>
                ))}

                {/* Other financial instrument with description and percentage */}
                <div className="space-y-3">
          <FormField
            control={form.control}
                    name="financial_instruments_other_selected"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Other (please specify)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('financial_instruments_other_selected') && (
                    <div className="space-y-3 ml-6">
                      <FormField
                        control={form.control}
                        name="financial_instruments_other_description"
            render={({ field }) => (
              <FormItem>
                            <FormLabel className="text-sm font-normal">Please specify the financial instrument</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the other financial instrument" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-sm font-normal">Percentage for this financial instrument</span>
                        </div>
                        <div className="md:w-64">
                          <FormField
                            control={form.control}
                            name="financial_instruments.Other"
                            render={({ field }) => (
                              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                                    <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                    <SelectItem value="0% - Not a form of investment for us">0% - Not a form of investment for us</SelectItem>
                                    <SelectItem value="1 - 24% of invested capital">1 - 24% of invested capital</SelectItem>
                                    <SelectItem value="25 - 49% of invested capital">25 - 49% of invested capital</SelectItem>
                                    <SelectItem value="50 - 74% of invested capital">50 - 74% of invested capital</SelectItem>
                                    <SelectItem value="gte_75_percent_invested_capital">&ge; 75% of invested capital</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question 31: Top 3 Sustainable Development Goals */}
            <div>
              <FormLabel>31. Please list the top 3 Sustainable Development Goals that you target (or as many as apply):</FormLabel>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium border-b pb-2">
                  <div>SDG</div>
                  <div>Selection</div>
                </div>
                
                {[
                  'First',
                  'Second',
                  'Third'
                ].map((priority) => (
                  <div key={priority} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="text-sm font-normal">{priority}</div>
                    <div>
                      <FormField
                        control={form.control}
                        name={`sdg_targets.${priority}`}
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select SDG" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                <SelectItem value="SDG 1: No Poverty">SDG 1: No Poverty</SelectItem>
                                <SelectItem value="SDG 2: Zero Hunger">SDG 2: Zero Hunger</SelectItem>
                                <SelectItem value="SDG 3: Good Health and Well-being">SDG 3: Good Health and Well-being</SelectItem>
                                <SelectItem value="SDG 4: Quality Education">SDG 4: Quality Education</SelectItem>
                                <SelectItem value="SDG 5: Gender Equality">SDG 5: Gender Equality</SelectItem>
                                <SelectItem value="SDG 6: Clean Water and Sanitation">SDG 6: Clean Water and Sanitation</SelectItem>
                                <SelectItem value="SDG 7: Affordable and Clean Energy">SDG 7: Affordable and Clean Energy</SelectItem>
                                <SelectItem value="SDG 8: Decent Work and Economic Growth">SDG 8: Decent Work and Economic Growth</SelectItem>
                                <SelectItem value="SDG 9: Industry, Innovation and Infrastructure">SDG 9: Industry, Innovation and Infrastructure</SelectItem>
                                <SelectItem value="SDG 10: Reduced Inequalities">SDG 10: Reduced Inequalities</SelectItem>
                                <SelectItem value="SDG 11: Sustainable Cities and Communities">SDG 11: Sustainable Cities and Communities</SelectItem>
                                <SelectItem value="SDG 12: Responsible Consumption and Production">SDG 12: Responsible Consumption and Production</SelectItem>
                                <SelectItem value="SDG 13: Climate Action">SDG 13: Climate Action</SelectItem>
                                <SelectItem value="SDG 14: Life Below Water">SDG 14: Life Below Water</SelectItem>
                                <SelectItem value="SDG 15: Life on Land">SDG 15: Life on Land</SelectItem>
                                <SelectItem value="SDG 16: Peace, Justice and Strong Institutions">SDG 16: Peace, Justice and Strong Institutions</SelectItem>
                                <SelectItem value="SDG 17: Partnerships for the Goals">SDG 17: Partnerships for the Goals</SelectItem>
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question 32: Gender Lens Investing */}
            <div>
              <FormLabel>32. Gender Lens Investing. Are any of the following either considerations or requirements when making investment/financing considerations?</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(Please provide a response for each row)</p>
              
              <div className="space-y-3">
                {[
                  'Majority women ownership (>50%)',
                  'Greater than 33% of women in senior management',
                  'Women represent at least 33% - 50% of direct workforce',
                  'Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)',
                  'Have policies in place that promote gender equality (e.g. equal compensation)',
                  'Women are target beneficiaries of the product/service',
                  'Enterprise reports on specific gender related indicators to investors',
                  'Board member female representation (>33%)',
                  'Female CEO'
                ].map((criterion) => (
                  <div key={criterion} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div className="flex-1">
                      <span className="text-sm font-normal">{criterion}</span>
                    </div>
                    <div className="md:w-64">
                      <FormField
                        control={form.control}
                        name={`gender_lens_investing.${criterion}`}
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                <SelectItem value="Investment Consideration">Investment Consideration</SelectItem>
                                <SelectItem value="Investment Requirement">Investment Requirement</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                
                {/* Other criterion with description and category */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="gender_lens_investing_other_selected"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          Other (please specify)
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('gender_lens_investing_other_selected') && (
                    <div className="space-y-3 ml-6">
                      <FormField
                        control={form.control}
                        name="gender_lens_investing_other_description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-normal">Please specify the gender lens investing criterion</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the other criterion" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex-1">
                          <span className="text-sm font-normal">Category for this criterion</span>
                        </div>
                        <div className="md:w-64">
                          <FormField
                            control={form.control}
                            name="gender_lens_investing.Other"
                            render={({ field }) => (
                              <FormItem>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                    <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                                    <SelectItem value="Investment Consideration">Investment Consideration</SelectItem>
                                    <SelectItem value="Investment Requirement">Investment Requirement</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Question 33: Role of Technology in Investment Thesis */}
            <div>
              <FormLabel>33. How does the role of technology in the business model of your target portfolio enterprises play into your investment thesis?</FormLabel>
              <p className="text-sm text-gray-600 mt-1 mb-4">(Please select the most appropriate answer)</p>
              
              <FormField
                control={form.control}
                name="technology_role_investment_thesis"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Not Relevant / Tech is Not an Investment Criteria/Focus" id="tech-not-relevant" />
                          <Label htmlFor="tech-not-relevant" className="text-sm font-normal">
                            Not Relevant / "Tech" is Not an Investment Criteria/Focus
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Beneficial if technology can accelerate growth, yet tech is not driving investment thesis" id="tech-beneficial" />
                          <Label htmlFor="tech-beneficial" className="text-sm font-normal">
                            Beneficial if technology can accelerate the enterprise's growth, yet tech is not driving investment thesis
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Specifically target business that can accelerate performance via being tech-enabled" id="tech-enabled" />
                          <Label htmlFor="tech-enabled" className="text-sm font-normal">
                            Specifically target business that can accelerate performance via being "tech-enabled"
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="We consider ourselves tech-oriented investors. All investment assessed based on the technology of the investee enterprise." id="tech-oriented" />
                          <Label htmlFor="tech-oriented" className="text-sm font-normal">
                            We consider ourselves tech-oriented investors. All investment assessed based on the technology of the investee enterprise.
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
          {/* Question 34: Pipeline Sourcing */}
          <div>
            <FormLabel>34. How do you source your pipeline?</FormLabel>
            <p className="text-sm text-gray-600 mt-1 mb-4">(Please provide a response for each row, allocating as close to 100% as possible)</p>
            
            <div className="space-y-3">
              {[
                'On-line Submissions',
                'Competition based',
                'Referral based',
                'Our own accelerator / development program',
                '3rd Party accelerator / development program'
              ].map((sourcingMethod) => (
                <div key={sourcingMethod} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-sm font-normal">{sourcingMethod}</span>
                  </div>
                  <div className="md:w-64">
          <FormField
            control={form.control}
                      name={`pipeline_sourcing.${sourcingMethod}`}
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                              <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                              <SelectItem value="0% Not Applicable for Us">0% Not Applicable for Us</SelectItem>
                              <SelectItem value="1% - 25% of target portfolio">1% - 25% of target portfolio</SelectItem>
                              <SelectItem value="26% - 50% of target portfolio">26% - 50% of target portfolio</SelectItem>
                              <SelectItem value="51% - 75% of target portfolio">51% - 75% of target portfolio</SelectItem>
                              <SelectItem value="76% - 100% of target portfolio">76% - 100% of target portfolio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                  </div>
                </div>
              ))}

              {/* Other sourcing method with description and percentage */}
              <div className="space-y-3">
          <FormField
            control={form.control}
                  name="pipeline_sourcing_other_selected"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Other (please specify)
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                {form.watch('pipeline_sourcing_other_selected') && (
                  <div className="space-y-3 ml-6">
                    <FormField
                      control={form.control}
                      name="pipeline_sourcing_other_description"
            render={({ field }) => (
              <FormItem>
                          <FormLabel className="text-sm font-normal">Please specify the pipeline sourcing method</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Describe the other sourcing method" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1">
                        <span className="text-sm font-normal">Percentage for this sourcing method</span>
                      </div>
                      <div className="md:w-64">
                        <FormField
                          control={form.control}
                          name="pipeline_sourcing.Other"
                          render={({ field }) => (
                            <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                                  <SelectValue placeholder="Select percentage" />
                  </SelectTrigger>
                                <SelectContent className="max-h-60 overflow-y-auto" side="bottom" align="start">
                                  <SelectItem value="0% Not Applicable for Us">0% Not Applicable for Us</SelectItem>
                                  <SelectItem value="1% - 25% of target portfolio">1% - 25% of target portfolio</SelectItem>
                                  <SelectItem value="26% - 50% of target portfolio">26% - 50% of target portfolio</SelectItem>
                                  <SelectItem value="51% - 75% of target portfolio">51% - 75% of target portfolio</SelectItem>
                                  <SelectItem value="76% - 100% of target portfolio">76% - 100% of target portfolio</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question 35: Average Investment Size */}
          <div>
            <FormLabel>35. What is the average size of investments/financing per portfolio company?</FormLabel>

          <FormField
            control={form.control}
              name="average_investment_size_per_company"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="< $100,000" id="size-under-100k" />
                        <Label htmlFor="size-under-100k" className="text-sm font-normal">
                        &lt; $100,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="$100,000 - $249,000" id="size-100k-249k" />
                        <Label htmlFor="size-100k-249k" className="text-sm font-normal">
                          $100,000 - $249,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="$250,000 - $499,000" id="size-250k-499k" />
                        <Label htmlFor="size-250k-499k" className="text-sm font-normal">
                          $250,000 - $499,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="$500,000 - $749,000" id="size-500k-749k" />
                        <Label htmlFor="size-500k-749k" className="text-sm font-normal">
                          $500,000 - $749,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="$750,000 - $999,000" id="size-750k-999k" />
                        <Label htmlFor="size-750k-999k" className="text-sm font-normal">
                          $750,000 - $999,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="$1,000,000 - $4,999,000" id="size-1m-4999k" />
                        <Label htmlFor="size-1m-4999k" className="text-sm font-normal">
                          $1,000,000 - $4,999,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="$5,000,000 - $10,000,000" id="size-5m-10m" />
                        <Label htmlFor="size-5m-10m" className="text-sm font-normal">
                          $5,000,000 - $10,000,000
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="> $10,000,000" id="size-over-10m" />
                        <Label htmlFor="size-over-10m" className="text-sm font-normal">
                        &gt; $10,000,000
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

      </div>
    </div>
  );

  const renderSection6 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
          {/* Question 36: Portfolio Value Creation Priorities */}
          <div>
            <FormLabel>36. In the first 12 months after closing on an investment, what are the key areas that you prioritize with regards to your portfolio enterprises? (Please provide one ranking per row: 1 = lowest need, 5 = highest need)</FormLabel>
            
            <div className="mt-4 space-y-4">
              {[
                'Senior Management Development',
                'Financial Management (e.g. budgeting, accounting, MIS)',
                'Fundraising, Accessing additional capital',
                'Optimizing working capital mgt.',
                'Strategic Planning',
                'Refine Product/Services',
                'Proof of Concept',
                'Sales & Marketing, Diversifying Revenue Streams',
                'Human capital management – hiring/training',
                'Operations Mgt./Production Processes',
                'Digitalization of business model (e.g. web tools, AI, etc.)'
              ].map((priority) => (
                <div key={priority} className="flex items-center justify-between">
                  <span className="text-sm font-normal flex-1 pr-4">{priority}</span>
                  <FormField
                    control={form.control}
                    name={`portfolio_value_creation_priorities.${priority}`}
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Rank" />
                  </SelectTrigger>
                          </FormControl>
                  <SelectContent>
                            <SelectItem value="1">1 (Lowest need)</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 (Highest need)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                </div>
              ))}

              {/* Other option with checkbox */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
          <FormField
            control={form.control}
                      name="portfolio_value_creation_other_selected"
            render={({ field }) => (
              <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm font-normal">Other (please specify)</span>
                  </div>
                  
                  {form.watch('portfolio_value_creation_other_selected') && (
                    <FormField
                      control={form.control}
                      name={`portfolio_value_creation_priorities.Other`}
                      render={({ field }) => (
                        <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Rank" />
                  </SelectTrigger>
                            </FormControl>
                  <SelectContent>
                              <SelectItem value="1">1 (Lowest need)</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5 (Highest need)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
                  )}
                </div>
                
                {form.watch('portfolio_value_creation_other_selected') && (
                  <FormField
                    control={form.control}
                    name="portfolio_value_creation_other_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Please specify other priority area"
                            {...field}
                            className="ml-6"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Question 37: Typical Investment Timeframe */}
          <div>
            <FormLabel>37. Typical investment timeframe?</FormLabel>
            
            <FormField
              control={form.control}
              name="typical_investment_timeframe"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="< 1 year" id="timeframe-under-1yr" />
                        <Label htmlFor="timeframe-under-1yr" className="text-sm font-normal">
                        &lt; 1 year
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1 - 3 years" id="timeframe-1-3yr" />
                        <Label htmlFor="timeframe-1-3yr" className="text-sm font-normal">
                          1 - 3 years
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4 - 5 years" id="timeframe-4-5yr" />
                        <Label htmlFor="timeframe-4-5yr" className="text-sm font-normal">
                          4 - 5 years
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="6 - 7 years" id="timeframe-6-7yr" />
                        <Label htmlFor="timeframe-6-7yr" className="text-sm font-normal">
                          6 - 7 years
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="8+ years" id="timeframe-8plus" />
                        <Label htmlFor="timeframe-8plus" className="text-sm font-normal">
                          8+ years
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Question 38: Investment Monetization/Exit Forms */}
          <div>
            <FormLabel>38. What is the typical form of investment monetization/exit?</FormLabel>
            <p className="text-sm text-gray-600 mt-1">(select as many as applicable)</p>
            
            <FormField
              control={form.control}
              name="investment_monetization_exit_forms"
              render={() => (
                <FormItem className="mt-4">
                  <div className="space-y-3">
                    {[
                      'Interest income/shared revenues and principal repayment',
                      'Other types of self-liquidating repayment structures',
                      'Dividends',
                      'Strategic sale/merger of company',
                      'Management buyout',
                      'Financial investor take-out'
                    ].map((option) => (
                      <FormField
                        key={option}
                        control={form.control}
                        name="investment_monetization_exit_forms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value: string) => value !== option
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {option}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    
                    {/* Other option with checkbox and conditional input */}
                    <FormField
                      control={form.control}
                      name="investment_monetization_exit_forms"
                      render={({ field }) => {
                        const isOtherSelected = field.value?.includes('Other');
                        return (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={isOtherSelected}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, 'Other'])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== 'Other'
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              Other (please specify)
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                    
                    {form.watch('investment_monetization_exit_forms')?.includes('Other') && (
                      <FormField
                        control={form.control}
                        name="investment_monetization_exit_forms_other"
                        render={({ field }) => (
                          <FormItem className="ml-6">
                            <FormControl>
                              <Input
                                placeholder="Please specify other form of monetization/exit"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Question 39: Equity Exits and Debt Repayments */}
          <div>
            <FormLabel>39. For equity investments, how many exits/monetizations have been achieved? For debt financings, how many repaid in full? (Please answer only as applicable)</FormLabel>
            
            <div className="mt-4 grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="equity_exits_achieved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Number of Exits for Equity Portfolio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="debt_repayments_achieved"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Number of Repayments for Debt Portfolio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-2">
              <span className="text-xs text-gray-500">Equity Exits / Debt Repayments</span>
            </div>
          </div>
      </div>
    </div>
  );

  const renderSection7 = () => (
    <div className="space-y-6">
      <div className="space-y-6">
          {/* Question 40: Number of Investments Made */}
          <div>
            <FormLabel>40. Please list the number of investments made to date by your current vehicle. *</FormLabel>
            
            <FormField
              control={form.control}
              name="investments_made_to_date"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Question 41: Optional Supplement */}
          <div>
            <FormLabel>41. Optional supplement to question above:</FormLabel>
            <p className="text-sm text-gray-600 mt-1">
              If no direct investments made to date made from your fund vehicle, please specify if you have made any other type of investment with funds raised such as warehoused investments, facilitated 3rd party investments etc. (Please provide form of investment and number of investments)
            </p>
            
            <FormField
              control={form.control}
              name="other_investments_supplement"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormControl>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Please describe other types of investments and their numbers..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Question 42: Anticipated Exits */}
          <div>
            <FormLabel>42. How many exits/monetization events do you anticipate in the next 12 months? *</FormLabel>
            <p className="text-sm text-gray-600 mt-1">(Please select appropriate response)</p>
            
            <FormField
              control={form.control}
              name="anticipated_exits_12_months"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="exits-0" />
                        <Label htmlFor="exits-0" className="text-sm font-normal">
                          0
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-3" id="exits-1-3" />
                        <Label htmlFor="exits-1-3" className="text-sm font-normal">
                          1 - 3
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4-5" id="exits-4-5" />
                        <Label htmlFor="exits-4-5" className="text-sm font-normal">
                          4 - 5
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gt_5" id="exits-over-5" />
                        <Label htmlFor="exits-over-5" className="text-sm font-normal">
                        &gt; 5
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Question 43: Portfolio Performance Matrix */}
          <div>
            <FormLabel>43. Please provide, across your portfolio, both the historical and expected average change in revenues and operating cash flow of your portfolio. (Please assess based on percentage change over the period of time)</FormLabel>
            
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div></div>
                <div className="text-center">
                  <span className="text-sm font-normal">Revenue Growth</span>
                </div>
                <div className="text-center">
                  <span className="text-sm font-normal">Operating Cash Flow Growth</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-sm font-normal">
                  Most recent 12 months leading up to March 30, 2022
                </div>
                <FormField
                  control={form.control}
                  name="revenue_growth_recent_12_months"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cash_flow_growth_recent_12_months"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-sm font-normal">
                  Based on current outlook, anticipated performance for next 12 months from April 1, 2022
                </div>
                <FormField
                  control={form.control}
                  name="revenue_growth_next_12_months"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cash_flow_growth_next_12_months"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Other option with checkbox */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="portfolio_performance_other_selected"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm font-normal">Other (please specify)</span>
                  </div>
                  
                  {form.watch('portfolio_performance_other_selected') && (
                    <>
                      <FormField
                        control={form.control}
                        name="revenue_growth_other"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cash_flow_growth_other"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : '')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
                
                {form.watch('portfolio_performance_other_selected') && (
                  <FormField
                    control={form.control}
                    name="portfolio_performance_other_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Please specify other time period or criteria"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Question 44: Employment/Jobs Impact */}
          <div>
            <FormLabel>44. What is the total impact on employment/jobs associated with your portfolio? What has been the average impact since date of investments and what is the expected impact over the next 12 months on direct and indirect labor? (Please assess based on percentage change over the period of time)</FormLabel>
            
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div></div>
                <div className="text-center">
                  <span className="text-sm font-normal">Cumulative Jobs Created as of March 30, 2022</span>
                </div>
                <div className="text-center">
                  <span className="text-sm font-normal">Anticipated Change to Cumulative Jobs by March 30, 2023</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-sm font-normal">
                  Direct (staff):
                </div>
                <FormField
                  control={form.control}
                  name="direct_jobs_created_cumulative"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="direct_jobs_anticipated_change"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="text-sm font-normal">
                  Indirect (third party workers engaged to perform work related to core business processes):
                </div>
                <FormField
                  control={form.control}
                  name="indirect_jobs_created_cumulative"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="indirect_jobs_anticipated_change"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Other option with checkbox */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="jobs_impact_other_selected"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm font-normal">Other (please specify)</span>
                  </div>
                  
                  {form.watch('jobs_impact_other_selected') && (
                    <>
                      <FormField
                        control={form.control}
                        name="other_jobs_created_cumulative"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="other_jobs_anticipated_change"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
                
                {form.watch('jobs_impact_other_selected') && (
                  <FormField
                    control={form.control}
                    name="jobs_impact_other_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Please specify other type of employment impact"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Question 45: Fund Priority Areas */}
          <div>
            <FormLabel>45. What will be your fund's areas of priority over the next 12 months? (Please answer all rows and provide one ranking per row: 1 = Lowest need, 5 = Highest need) *</FormLabel>
            
            <div className="mt-4 space-y-4">
              {[
                'Capital Raising for Fund Vehicle',
                'Refining your fund economics',
                'Pipeline Development Opportunities',
                'Develop co-investment opportunities',
                'Make New Investments',
                'Pursue follow-on investments',
                'Post-investment support of portfolio enterprises',
                'Talent Management and Development of Fund team',
                'Fund Administration, Back office and Technology',
                'Achieving Exits',
                'Legal/regulatory issues',
                'Application of data and impact metrics'
              ].map((priority) => (
                <div key={priority} className="flex items-center justify-between">
                  <span className="text-sm font-normal flex-1 pr-4">{priority}</span>
                  <FormField
                    control={form.control}
                    name={`fund_priority_areas.${priority}`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Rank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 (Lowest need)</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 (Highest need)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              
              {/* Other option with checkbox */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <FormField
                      control={form.control}
                      name="fund_priority_areas_other_selected"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm font-normal">Other (please specify)</span>
                  </div>
                  
                  {form.watch('fund_priority_areas_other_selected') && (
                    <FormField
                      control={form.control}
                      name={`fund_priority_areas.Other`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Rank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 (Lowest need)</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5 (Highest need)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                {form.watch('fund_priority_areas_other_selected') && (
                  <FormField
                    control={form.control}
                    name="fund_priority_areas_other_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Please specify other priority area"
                            {...field}
                            className="ml-6"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Question 46: Domestic Factors Concerns */}
          <div>
            <FormLabel>46. Over the next 12 months, what domestic factors are you most concerned that could impact your activities? (Please answer each row, ranking 1 = not a concern, 5 = greatly concerned) *</FormLabel>
            
            <div className="mt-4 space-y-4">
              {[
                'Political Uncertainty',
                'Currency Risks',
                'Interest Rates',
                'Regulatory or Legal system changes/ barriers',
                'Confidence in local Financial/ Banking sector',
                'Domestic supply chain',
                'COVID'
              ].map((concern) => (
                <div key={concern} className="flex items-center justify-between">
                  <span className="text-sm font-normal flex-1 pr-4">{concern}</span>
                  <FormField
                    control={form.control}
                    name={`domestic_factors_concerns.${concern}`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Rank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 (Not a concern)</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 (Greatly Concern)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              
              {/* Other option with checkbox */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <FormField
                      control={form.control}
                      name="domestic_factors_concerns_other_selected"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm font-normal">Other (please specify)</span>
                  </div>
                  
                  {form.watch('domestic_factors_concerns_other_selected') && (
                    <FormField
                      control={form.control}
                      name={`domestic_factors_concerns.Other`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Rank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 (Not a concern)</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5 (Greatly Concern)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                {form.watch('domestic_factors_concerns_other_selected') && (
                  <FormField
                    control={form.control}
                    name="domestic_factors_concerns_other_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Please specify other domestic factor concern"
                            {...field}
                            className="ml-6"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Question 47: International Factors Concerns */}
          <div>
            <FormLabel>47. Over the next 12 months, what international factors are you most concerned that could impact your activities? (Please answer each row, ranking 1 = not a concern, 5 = greatly concerned) *</FormLabel>
            
            <div className="mt-4 space-y-4">
              {[
                'Political Uncertainty',
                'Constrained export trade opportunities',
                'Reduced access to imported materials',
                'Regulatory or Legal system changes/ barriers',
                'Global Financial system turbulence',
                'Rising interest rates in G-7 Countries',
                'COVID'
              ].map((concern) => (
                <div key={concern} className="flex items-center justify-between">
                  <span className="text-sm font-normal flex-1 pr-4">{concern}</span>
                  <FormField
                    control={form.control}
                    name={`international_factors_concerns.${concern}`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="Rank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 (Not a concern)</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 (Greatly Concern)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              
              {/* Other option with checkbox */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <FormField
                      control={form.control}
                      name="international_factors_concerns_other_selected"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm font-normal">Other (please specify)</span>
                  </div>
                  
                  {form.watch('international_factors_concerns_other_selected') && (
                    <FormField
                      control={form.control}
                      name={`international_factors_concerns.Other`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Rank" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">1 (Not a concern)</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5 (Greatly Concern)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                {form.watch('international_factors_concerns_other_selected') && (
                  <FormField
                    control={form.control}
                    name="international_factors_concerns_other_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Please specify other international factor concern"
                            {...field}
                            className="ml-6"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Thank you for your valuable input.</h3>
          </div>

          {/* Question 48: Survey Results */}
          <div>
            <FormLabel>Survey Results</FormLabel>
            <p className="text-sm text-gray-600 mt-1 mb-4">
              48. If you are interested in receiving the results of this survey, please check the box below.
              Please note that all responses will be confidential and reported only in aggregate.
            </p>

          <FormField
            control={form.control}
            name="receive_results"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-sm font-normal">
                      Yes, I would like to receive the results of this survey
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          </div>
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
        return renderSection1();
    }
  };

  const getSectionTitle = (section: number) => {
    const titles = [
      'Contact Information',
      'Organizational Background and Team',
      "Vehicle's Legal Construct",
      'Investment Thesis',
      'Pipeline Sourcing and Portfolio Construction',
      'Portfolio Value Creation and Exits',
      'Performance to Date and Current Outlook'
    ];
    return titles[section - 1] || '';
  };

  const renderSectionSidebar = () => (
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
            style={{ width: `${calculateProgress()}%` }}
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
              type="button"
              onClick={() => {
                setCurrentSection(sectionNumber);
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
              }}
              className={[
                'w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg transform scale-105'
                  : isCompleted
                  ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center space-x-3">
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
              </div>
            </button>
          );
        })}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/network')}
        className="mt-6 w-full border-gray-300 hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Network
      </Button>
    </div>
  );

  const renderIntroCard = () => (
    <Card className="overflow-hidden shadow-sm border-gray-200 mb-6">
      <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-b border-blue-200 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-blue-900">2022 CFF Survey</h1>
            <p className="text-sm text-blue-700">Capital for Frontier Finance - MSME Financing Survey</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center flex-wrap gap-2 text-[10px] justify-end">
              <span className="px-2 py-0.5 rounded-full bg-white/80 text-blue-700 border border-blue-200">6 sections</span>
              <span className="px-2 py-0.5 rounded-full bg-white/80 text-blue-700 border border-blue-200">10-12 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/network')}>Back to Network</Button>
              <Button size="sm" onClick={() => { setShowIntro(false); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0); }}>Start Survey</Button>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="space-y-3 text-blue-900">
          <div>
            <h2 className="text-base font-semibold text-blue-900">Introduction & Context</h2>
            <p className="text-sm text-blue-800">
              Micro, Small and Medium-Sized Enterprises (MSMEs or interchangeably, "small and growing businesses", SGBs) are a key engine for jobs and economic growth in the African and MENA markets, absorbing up to 70% of the labour market and generating 40% GDP. However, despite the role such enterprises play in their local economies, there appears to be a lack of capital to finance these businesses. As such, they are often referred to as the "missing middle" - too small for traditional commercial finance (e.g. local banks, pension funds and PE funds), and too big for micro-finance institutions.
            </p>
            <p className="text-sm text-blue-800 mt-3">
              The Collaborative for Frontier Finance has developed this survey to assess the "state-of-play" with regards to the SGB financing sector in Africa and MENA. The following survey is designed to better understand the emerging class of Local Capital Providers (LCPs). These LCPs are heterogeneous group of indigenous capital providers to SGB's that use alternative structures to provide capital to small and growing businesses (SGBs) in their local markets.
            </p>
            <p className="text-sm text-blue-800 mt-3">
              With this survey we will look to better understand the business models of these SGB capital managers, the current environment and near-term outlook; and also compare to our 2020 survey. The survey is comprised of six sections:
            </p>
          </div>
          <div className="space-y-2">
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Organizational Background and Team</li>
              <li>Vehicle's Legal Construct</li>
              <li>Investment Thesis</li>
              <li>Pipeline Sourcing and Portfolio Construction</li>
              <li>Portfolio Value Creation and Exits</li>
              <li>Performance-to-Date and Current Environment/Outlook</li>
            </ol>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900">
            <p className="mb-2">We appreciate your candor and accuracy. All responses are confidential and results are anonymized. Our request for respondent information allows us to follow up with specific questions and further advance CFF's Learning Lab agenda and materials including case studies, as well as developing thematic specific mini-surveys targeted to a handful of similar organizations. We estimate the survey will take approximately 20 minutes to complete.</p>
            <p className="mb-2">Note that given the innovative nature of this sector, we refer to the terms "fund" and "investment vehicle" interchangeably.</p>
            <p className="font-medium">Thank you in advance for your participation and sharing your valuable insights.</p>
            <p className="font-medium">The Collaborative for Frontier Finance team.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className={`max-w-6xl mx-auto ${!showIntro ? 'pr-80' : ''}`}>
        {/* Back Button hidden on intro */}
        {!showIntro && null}

        {showIntro && renderIntroCard()}

        {/* Section Tabs - removed, now using sidebar */}

        {!showIntro && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-6">
              {/* Enhanced Section Header */}
              <Card className="bg-white p-6 rounded-lg border shadow-sm mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Section {currentSection}: {getSectionTitle(currentSection)}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {currentSection} of {totalSections} sections
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentSection}/{totalSections}
                    </div>
                    <div className="text-xs text-gray-500">Progress</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
              
              <div className="space-y-6">
                {renderCurrentSection()}
              </div>
            </div>

            {/* Enhanced Navigation Buttons */}
            <Card className="bg-white p-6 rounded-lg border shadow-sm">
              {currentSection === totalSections && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold text-center">
                    You've reached the final section! Please review your responses and submit below.
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 1}
                  className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &larr; Previous
                </Button>
                
                <div className="flex gap-3">
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
                      className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
        
        {/* Right Sidebar with Section Navigation */}
        {!showIntro && renderSectionSidebar()}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Survey2022; 