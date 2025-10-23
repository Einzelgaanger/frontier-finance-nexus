// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useSurveyPersistence } from '@/hooks/useSurveyPersistence';
import { useAuth } from '@/hooks/useAuth';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';

// Basic schema for the 2023 MSME Financing Survey
const survey2023Schema = z.object({
  // Section 1: Introduction & Context
  email_address: z.string().email(),
  organisation_name: z.string().min(1),
  funds_raising_investing: z.string().min(1),
  fund_name: z.string().min(1),
  
  // Section 2: Organizational Background and Team
  legal_entity_achieved: z.string().optional(),
  first_close_achieved: z.string().optional(),
  first_investment_achieved: z.string().optional(),
  geographic_markets: z.array(z.string()).min(1),
  geographic_markets_other: z.string().optional(),
  team_based: z.array(z.string()).min(1),
  team_based_other: z.string().optional(),
  fte_staff_2022: z.number().int().min(0).optional(),
  fte_staff_current: z.number().int().min(0).optional(),
  fte_staff_2024_est: z.number().int().min(0).optional(),
  principals_count: z.number().int().min(0).optional(),
  gender_inclusion: z.array(z.string()).min(1),
  gender_inclusion_other: z.string().optional(),
  	team_experience_investments: z.record(z.string(), z.string()),
	team_experience_exits: z.record(z.string(), z.string()),
	team_experience_other: z.string().optional(),
	other_experience_selected: z.boolean().optional(),
  
  // Section 3: Vehicle Construct
  legal_domicile: z.array(z.string()).min(1),
  legal_domicile_other: z.string().optional(),
  currency_investments: z.string().min(1),
  currency_lp_commitments: z.string().min(1),
  fund_type_status: z.string().min(1),
  fund_type_status_other: z.string().optional(),
  current_funds_raised: z.number().min(0).optional(),
  current_amount_invested: z.number().min(0).optional(),
  target_fund_size: z.number().min(0).optional(),
  target_investments_count: z.number().int().min(0).optional(),
  follow_on_investment_permitted: z.string().min(1),
  concessionary_capital: z.array(z.string()).min(1),
  concessionary_capital_other: z.string().optional(),
  lp_capital_sources_existing: z.record(z.string(), z.number()).optional(),
  lp_capital_sources_target: z.record(z.string(), z.number()).optional(),
  gp_financial_commitment: z.array(z.string()).min(1),
  gp_financial_commitment_other: z.string().optional(),
  gp_management_fee: z.string().min(1),
  gp_management_fee_other: z.string().optional(),
  hurdle_rate_currency: z.string().min(1),
  hurdle_rate_currency_other: z.string().optional(),
  hurdle_rate_percentage: z.number().min(0).max(100).optional(),
  target_local_currency_return_methods: z.record(z.string(), z.number()).optional(),
  target_local_currency_return: z.number().min(0).max(100).optional(),
  fundraising_constraints: z.record(z.string(), z.number()).optional(),
  fundraising_constraints_other: z.string().optional(),
  other_constraint_selected: z.boolean().optional(),
  
  // Section 4: Investment Thesis
  business_stages: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data) return true;
      const total = Object.values(data).reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
      return Math.abs(total - 100) < 0.1; // Allow small floating point differences
    },
    {
      message: "Business stages percentages must sum to 100%",
    }
  ),
  growth_expectations: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data) return true;
      const total = Object.values(data).reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
      return Math.abs(total - 100) < 0.1; // Allow small floating point differences
    },
    {
      message: "Growth expectations percentages must sum to 100%",
    }
  ),
  financing_needs: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data) return true;
      const total = Object.values(data).reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
      return Math.abs(total - 100) < 0.1; // Allow small floating point differences
    },
    {
      message: "Financing needs percentages must sum to 100%",
    }
  ),
  sector_focus: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data) return true;
      const total = Object.values(data).reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
      return total >= 95 && total <= 100; // Allow 95-100% range for "as close to 100% as possible"
    },
    {
      message: "Sector focus percentages should sum to 95-100%",
    }
  ),
  sector_focus_other: z.string().optional(),
  financial_instruments: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data) return true;
      const total = Object.values(data).reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
      return Math.abs(total - 100) < 0.1; // Allow small floating point differences
    },
    {
      message: "Financial instruments percentages must sum to 100%",
    }
  ),
  sustainable_development_goals: z.array(z.string()).min(1),
  sdg_ranking: z.record(z.string(), z.string()).optional(),
  gender_lens_investing: z.record(z.string(), z.string()).optional(),
  gender_lens_investing_other: z.string().optional(),
  gender_other_selected: z.boolean().optional(),
  
  // Section 5: Pipeline Sourcing and Portfolio Construction
  pipeline_sourcing: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data) return true;
      const total = Object.values(data).reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
      return Math.abs(total - 100) < 0.1; // Allow small floating point differences
    },
    {
      message: "Pipeline sourcing percentages must sum to 100%",
    }
  ),
  pipeline_sourcing_other: z.string().optional(),
  average_investment_size: z.string().min(1),
  average_investment_size_per_company: z.string().optional(),
  capital_raise_percentage: z.number().min(0).max(100).optional(),
  portfolio_funding_mix: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data) return true;
      const total = Object.values(data).reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
      return Math.abs(total - 100) < 0.1; // Allow small floating point differences
    },
    {
      message: "Portfolio funding mix percentages must sum to 100%",
    }
  ),
  portfolio_funding_mix_other: z.string().optional(),
  
  // Section 6: Portfolio Value Creation and Exits
  portfolio_priorities: z.record(z.string(), z.number()).optional(),
  portfolio_priorities_other: z.string().optional(),
  portfolio_value_creation_priorities: z.record(z.string(), z.string()).optional(),
  portfolio_value_creation_other: z.string().optional(),
  portfolio_other_selected: z.boolean().optional(),
  technical_assistance_funding: z.record(z.string(), z.number()).optional().refine(
    (data) => {
      if (!data) return true;
      const total = Object.values(data).reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0);
      return Math.abs(total - 100) < 0.1; // Allow small floating point differences
    },
    {
      message: "Technical assistance funding percentages must sum to 100%",
    }
  ),
  technical_assistance_funding_other: z.string().optional(),
  business_development_approach: z.array(z.string()).optional(),
  business_development_approach_other: z.string().optional(),
  business_development_support: z.array(z.string()).min(1),
  business_development_support_other: z.string().optional(),
  investment_timeframe: z.string().min(1),
  exit_form: z.array(z.string()).min(1),
  exit_form_other: z.string().optional(),
  
  // Section 7: Performance to Date and Current Outlook
  equity_exits_anticipated: z.number().int().min(0).optional(),
  debt_exits_anticipated: z.number().int().min(0).optional(),
  other_investments_description: z.string().optional(),
  other_investments: z.string().optional(),
  portfolio_performance: z.record(z.string(), z.record(z.string(), z.number())).optional(),
  portfolio_performance_other_selected: z.boolean().optional(),
  portfolio_performance_other_description: z.string().optional(),
  jobs_impact: z.record(z.string(), z.record(z.string(), z.number())).optional(),
  jobs_impact_other_selected: z.boolean().optional(),
  jobs_impact_other_description: z.string().optional(),
  fund_priorities: z.record(z.string(), z.string()).optional(),
  fund_priorities_other_selected: z.boolean().optional(),
  fund_priorities_other_description: z.string().optional(),
  revenue_growth_historical: z.number().optional(),
  revenue_growth_expected: z.number().optional(),
  cash_flow_growth_historical: z.number().optional(),
  cash_flow_growth_expected: z.number().optional(),
  jobs_impact_historical_direct: z.number().int().min(0).optional(),
  jobs_impact_historical_indirect: z.number().int().min(0).optional(),
  jobs_impact_historical_other: z.string().optional(),
  jobs_impact_expected_direct: z.number().int().min(0).optional(),
  jobs_impact_expected_indirect: z.number().int().min(0).optional(),
  jobs_impact_expected_other: z.string().optional(),
  concerns_ranking: z.record(z.string(), z.string()).optional(),
  concerns_ranking_other: z.string().optional(),
  concerns_other_selected: z.boolean().optional(),
  
  // Section 8: Future Research
  future_research_data: z.array(z.string()).min(1),
  future_research_data_other: z.string().optional(),
  one_on_one_meeting: z.string().optional(),
  receive_survey_results: z.boolean().default(false)
});

type Survey2023FormData = z.infer<typeof survey2023Schema>;

export default function Survey2023() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const totalSections = 8;
  const { toast } = useToast();
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
  } = useSurveyPersistence({ surveyKey: 'survey2023' });

  const form = useForm<Survey2023FormData>({
    defaultValues: {
      // Section 1: Introduction & Context
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
      // Section 2: Investment Thesis & Capital Construct
      investment_stage: '',
      investment_size: '',
      investment_type: '',
      sector_focus: '',
      geographic_focus: '',
      value_add_services: '',
      // Section 3: Portfolio Construction and Team
      current_ftes: '',
      ye2023_ftes: '',
      principals_count: '',
      gp_experience: {},
      gp_experience_other_selected: false,
      gp_experience_other_description: '',
      gender_orientation: [],
      gender_orientation_other: '',
      investments_experience: '',
      exits_experience: '',
      // Section 4: Portfolio Development & Investment Return Monetization
      legal_domicile: '',
      legal_domicile_other: '',
      currency_investments: '',
      currency_lp_commitments: '',
      fund_operations: '',
      fund_operations_other: '',
      current_funds_raised: '',
      current_amount_invested: '',
      target_fund_size: '',
      target_investments: '',
      follow_on_permitted: '',
      target_irr: '',
      target_irr_other: '',
      concessionary_capital: [],
      concessionary_capital_other: '',
      lp_capital_sources: {},
      lp_capital_sources_other_description: '',
      gp_commitment: '',
      management_fee: '',
      management_fee_other: '',
      carried_interest_hurdle: '',
      carried_interest_hurdle_other: '',
      carried_interest_percentage: '',
      carried_interest_percentage_other: '',
      key_terms_other: '',
      key_terms_other_description: '',
      // Section 5: Impact of COVID-19 on Vehicle and Portfolio
      portfolio_performance: {},
      portfolio_performance_other_selected: false,
      revenue_growth_other: '',
      cash_flow_growth_other: '',
      portfolio_performance_other_description: '',
      direct_jobs_created_cumulative: '',
      direct_jobs_anticipated_change: '',
      indirect_jobs_created_cumulative: '',
      indirect_jobs_anticipated_change: '',
      jobs_impact_other_selected: false,
      other_jobs_created_cumulative: '',
      other_jobs_anticipated_change: '',
      jobs_impact_other_description: '',
      fund_priority_areas: {},
      fund_priority_areas_other_selected: false,
      fund_priority_areas_other_description: '',
      domestic_factors_concerns: {},
      domestic_factors_concerns_other_selected: false,
      domestic_factors_concerns_other_description: '',
      international_factors_concerns: {},
      international_factors_concerns_other_selected: false,
      international_factors_concerns_other_description: '',
      // Section 6: Feedback on ESCP Network Membership to date
      network_value: '',
      network_improvements: '',
      network_events: '',
      network_events_other: '',
      network_communication: '',
      network_communication_other: '',
      network_support: '',
      network_support_other: '',
      network_impact: '',
      network_impact_other: '',
      network_recommendations: '',
      // Section 7: 2021 Convening Objectives & Goals
      convening_objectives: [],
      convening_objectives_other: '',
      convening_format: '',
      convening_format_other: '',
      convening_topics: [],
      convening_topics_other: '',
      convening_speakers: '',
      convening_speakers_other: '',
      convening_networking: '',
      convening_networking_other: '',
      convening_outcomes: '',
      convening_outcomes_other: '',
      convening_follow_up: '',
      convening_follow_up_other: '',
      convening_commitments: '',
      convening_commitments_other: '',
      convening_impact: '',
      convening_impact_other: '',
      convening_success: '',
      convening_success_other: '',
      convening_challenges: '',
      convening_challenges_other: '',
      convening_opportunities: '',
      convening_opportunities_other: '',
      convening_priorities: '',
      convening_priorities_other: '',
      convening_goals: '',
      convening_goals_other: '',
      convening_vision: '',
      convening_vision_other: '',
      convening_mission: '',
      convening_mission_other: '',
      convening_values: '',
      convening_values_other: '',
      convening_principles: '',
      convening_principles_other: '',
      convening_standards: '',
      convening_standards_other: '',
      convening_guidelines: '',
      convening_guidelines_other: '',
      convening_policies: '',
      convening_policies_other: '',
      convening_procedures: '',
      convening_procedures_other: '',
      convening_processes: '',
      convening_processes_other: '',
      convening_systems: '',
      convening_systems_other: '',
      convening_structures: '',
      convening_structures_other: '',
      convening_frameworks: '',
      convening_frameworks_other: '',
      convening_models: '',
      convening_models_other: '',
      convening_approaches: '',
      convening_approaches_other: '',
      convening_methods: '',
      convening_methods_other: '',
      convening_techniques: '',
      convening_techniques_other: '',
      convening_strategies: '',
      convening_strategies_other: '',
      convening_tactics: '',
      convening_tactics_other: '',
      convening_plans: '',
      convening_plans_other: '',
      convening_programs: '',
      convening_programs_other: '',
      convening_initiatives: '',
      convening_initiatives_other: '',
      convening_projects: '',
      convening_projects_other: '',
      convening_activities: '',
      convening_activities_other: '',
      convening_events: '',
      convening_events_other: '',
      convening_meetings: '',
      convening_meetings_other: '',
      convening_sessions: '',
      convening_sessions_other: '',
      convening_workshops: '',
      convening_workshops_other: '',
      convening_seminars: '',
      convening_seminars_other: '',
      convening_conferences: '',
      convening_conferences_other: '',
      convening_symposia: '',
      convening_symposia_other: '',
      convening_forums: '',
      convening_forums_other: '',
      convening_roundtables: '',
      convening_roundtables_other: '',
      convening_panels: '',
      convening_panels_other: '',
      convening_discussions: '',
      convening_discussions_other: '',
      convening_dialogues: '',
      convening_dialogues_other: '',
      convening_conversations: '',
      convening_conversations_other: '',
      convening_exchanges: '',
      convening_exchanges_other: '',
      convening_interactions: '',
      convening_interactions_other: '',
      convening_engagements: '',
      convening_engagements_other: '',
      convening_collaborations: '',
      convening_collaborations_other: '',
      convening_partnerships: '',
      convening_partnerships_other: '',
      convening_alliances: '',
      convening_alliances_other: '',
      convening_coalitions: '',
      convening_coalitions_other: '',
      convening_networks: '',
      convening_networks_other: '',
      convening_communities: '',
      convening_communities_other: '',
      convening_groups: '',
      convening_groups_other: '',
      convening_teams: '',
      convening_teams_other: '',
      convening_organizations: '',
      convening_organizations_other: '',
      convening_institutions: '',
      convening_institutions_other: '',
      convening_entities: '',
      convening_entities_other: '',
      convening_bodies: '',
      convening_bodies_other: '',
      convening_committees: '',
      convening_committees_other: '',
      convening_boards: '',
      convening_boards_other: '',
      convening_councils: '',
      convening_councils_other: '',
      convening_assemblies: '',
      convening_assemblies_other: '',
      convening_gatherings: '',
      convening_gatherings_other: '',
      convening_meetings: '',
      convening_meetings_other: '',
      convening_sessions: '',
      convening_sessions_other: '',
      convening_workshops: '',
      convening_workshops_other: '',
      convening_seminars: '',
      convening_seminars_other: '',
      convening_conferences: '',
      convening_conferences_other: '',
      convening_symposia: '',
      convening_symposia_other: '',
      convening_forums: '',
      convening_forums_other: '',
      convening_roundtables: '',
      convening_roundtables_other: '',
      convening_panels: '',
      convening_panels_other: '',
      convening_discussions: '',
      convening_discussions_other: '',
      convening_dialogues: '',
      convening_dialogues_other: '',
      convening_conversations: '',
      convening_conversations_other: '',
      convening_exchanges: '',
      convening_exchanges_other: '',
      convening_interactions: '',
      convening_interactions_other: '',
      convening_engagements: '',
      convening_engagements_other: '',
      convening_collaborations: '',
      convening_collaborations_other: '',
      convening_partnerships: '',
      convening_partnerships_other: '',
      convening_alliances: '',
      convening_alliances_other: '',
      convening_coalitions: '',
      convening_coalitions_other: '',
      convening_networks: '',
      convening_networks_other: '',
      convening_communities: '',
      convening_communities_other: '',
      convening_groups: '',
      convening_groups_other: '',
      convening_teams: '',
      convening_teams_other: '',
      convening_organizations: '',
      convening_organizations_other: '',
      convening_institutions: '',
      convening_institutions_other: '',
      convening_entities: '',
      convening_entities_other: '',
      convening_bodies: '',
      convening_bodies_other: '',
      convening_committees: '',
      convening_committees_other: '',
      convening_boards: '',
      convening_boards_other: '',
      convening_councils: '',
      convening_councils_other: '',
      convening_assemblies: '',
      convening_assemblies_other: '',
      convening_gatherings: '',
      convening_gatherings_other: '',
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
          .from('survey_responses_2023')
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

  // Check for existing completed response
  useEffect(() => {
    const checkExistingResponse = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('survey_responses_2023')
          .select('*')
          .eq('user_id', user.id)
          .eq('submission_status', 'completed')
          .maybeSingle();

        if (data && !error) {
          setIsCompleted(true);
          // Populate form with existing data
          form.reset(data);
        }
      } catch (error) {
        console.error('Error checking existing response:', error);
      }
    };

    checkExistingResponse();
  }, [form]);

  const handleNext = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
      
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


  const handleSubmit = async (data: Survey2023FormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Manual upsert to avoid unique constraint issues on user_id
      const { data: existing } = await supabase
        .from('survey_responses_2023')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const recordData = {
        user_id: user.id,
        email_address: data.email_address,
        organisation_name: data.organisation_name,
        fund_name: data.fund_name,
        funds_raising_investing: data.funds_raising_investing,
        legal_entity_achieved: data.legal_entity_achieved,
        first_close_achieved: data.first_close_achieved,
        first_investment_achieved: data.first_investment_achieved,
        geographic_markets: data.geographic_markets || [],
        geographic_markets_other: data.geographic_markets_other,
        team_based: data.team_based || [],
        team_based_other: data.team_based_other,
        fte_staff_2022: data.fte_staff_2022,
        fte_staff_current: data.fte_staff_current,
        fte_staff_2024_est: data.fte_staff_2024_est,
        principals_count: data.principals_count,
        gender_inclusion: data.gender_inclusion || [],
        gender_inclusion_other: data.gender_inclusion_other,
        team_experience_investments: data.team_experience_investments || {},
        team_experience_exits: data.team_experience_exits || {},
        team_experience_other: data.team_experience_other,
        legal_domicile: data.legal_domicile || [],
        legal_domicile_other: data.legal_domicile_other,
        currency_investments: data.currency_investments,
        currency_lp_commitments: data.currency_lp_commitments,
        fund_type_status: data.fund_type_status,
        fund_type_status_other: data.fund_type_status_other,
        current_funds_raised: data.current_funds_raised,
        current_amount_invested: data.current_amount_invested,
        target_fund_size: data.target_fund_size,
        target_investments_count: data.target_investments_count,
        follow_on_investment_permitted: data.follow_on_investment_permitted,
        concessionary_capital: data.concessionary_capital || [],
        concessionary_capital_other: data.concessionary_capital_other,
        lp_capital_sources_existing: data.lp_capital_sources_existing || {},
        lp_capital_sources_target: data.lp_capital_sources_target || {},
        gp_financial_commitment: data.gp_financial_commitment || [],
        gp_financial_commitment_other: data.gp_financial_commitment_other,
        gp_management_fee: data.gp_management_fee,
        gp_management_fee_other: data.gp_management_fee_other,
        hurdle_rate_currency: data.hurdle_rate_currency,
        hurdle_rate_currency_other: data.hurdle_rate_currency_other,
        hurdle_rate_percentage: data.hurdle_rate_percentage,
        target_local_currency_return_methods: data.target_local_currency_return_methods || {},
        target_local_currency_return: data.target_local_currency_return,
        fundraising_constraints: data.fundraising_constraints || {},
        fundraising_constraints_other: data.fundraising_constraints_other,
        business_stages: data.business_stages || {},
        growth_expectations: data.growth_expectations || {},
        financing_needs: data.financing_needs || {},
        sector_focus: data.sector_focus || {},
        sector_focus_other: data.sector_focus_other,
        financial_instruments: data.financial_instruments || {},
        sustainable_development_goals: data.sustainable_development_goals || [],
        sdg_ranking: data.sdg_ranking || {},
        gender_lens_investing: data.gender_lens_investing || {},
        gender_lens_investing_other: data.gender_lens_investing_other,
        pipeline_sourcing: data.pipeline_sourcing || {},
        pipeline_sourcing_other: data.pipeline_sourcing_other,
        average_investment_size: data.average_investment_size,
        average_investment_size_per_company: data.average_investment_size_per_company,
        capital_raise_percentage: data.capital_raise_percentage,
        portfolio_funding_mix: data.portfolio_funding_mix || {},
        portfolio_funding_mix_other: data.portfolio_funding_mix_other,
        portfolio_priorities: data.portfolio_priorities || {},
        portfolio_priorities_other: data.portfolio_priorities_other,
        portfolio_value_creation_priorities: data.portfolio_value_creation_priorities || {},
        portfolio_value_creation_other: data.portfolio_value_creation_other,
        technical_assistance_funding: data.technical_assistance_funding || {},
        technical_assistance_funding_other: data.technical_assistance_funding_other,
        business_development_approach: data.business_development_approach || [],
        business_development_approach_other: data.business_development_approach_other,
        business_development_support: data.business_development_support || [],
        business_development_support_other: data.business_development_support_other,
        investment_timeframe: data.investment_timeframe,
        exit_form: data.exit_form || [],
        exit_form_other: data.exit_form_other,
        equity_exits_anticipated: data.equity_exits_anticipated,
        debt_exits_anticipated: data.debt_exits_anticipated,
        other_investments_description: data.other_investments_description,
        other_investments: data.other_investments,
        portfolio_performance: data.portfolio_performance || {},
        portfolio_performance_other_description: data.portfolio_performance_other_description,
        jobs_impact: data.jobs_impact || {},
        jobs_impact_other_description: data.jobs_impact_other_description,
        fund_priorities: data.fund_priorities || {},
        fund_priorities_other_description: data.fund_priorities_other_description,
        revenue_growth_historical: data.revenue_growth_historical,
        revenue_growth_expected: data.revenue_growth_expected,
        cash_flow_growth_historical: data.cash_flow_growth_historical,
        cash_flow_growth_expected: data.cash_flow_growth_expected,
        jobs_impact_historical_direct: data.jobs_impact_historical_direct,
        jobs_impact_historical_indirect: data.jobs_impact_historical_indirect,
        jobs_impact_historical_other: data.jobs_impact_historical_other,
        jobs_impact_expected_direct: data.jobs_impact_expected_direct,
        jobs_impact_expected_indirect: data.jobs_impact_expected_indirect,
        jobs_impact_expected_other: data.jobs_impact_expected_other,
        concerns_ranking: data.concerns_ranking || {},
        concerns_ranking_other: data.concerns_ranking_other,
        future_research_data: data.future_research_data || [],
        future_research_data_other: data.future_research_data_other,
        one_on_one_meeting: data.one_on_one_meeting,
        receive_survey_results: data.receive_survey_results || false,
        form_data: data,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        submission_status: 'completed'
      };

      let submitError;
      if (existing) {
        const { error: updateError } = await supabase
          .from('survey_responses_2023')
          .update(recordData)
          .eq('id', existing.id);
        submitError = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('survey_responses_2023')
          .insert(recordData);
        submitError = insertError;
      }

      if (submitError) throw submitError;

      
      // Mark as completed
      setIsCompleted(true);
      
      toast({
        title: "Survey submitted successfully",
        description: "Thank you for completing the 2023 MSME Financing Survey.",
      });

      // Navigate to home dashboard
      navigate('/');
    } catch (error) {
      toast({
        title: "Error submitting survey",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getSectionTitle = (section: number) => {
    const titles = {
      1: "Introduction & Context",
      2: "Organizational Background and Team",
      3: "Vehicle Construct",
      4: "Investment Thesis",
      5: "Pipeline Sourcing and Portfolio Construction",
      6: "Portfolio Value Creation and Exits",
      7: "Performance to Date and Current Outlook",
      8: "Future Research"
    };
    return titles[section as keyof typeof titles] || "";
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
            style={{ width: `${(currentSection / totalSections) * 100}%` }}
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
                if (!isReadOnly) {
                  setCurrentSection(sectionNumber);
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
                }
              }}
              disabled={isReadOnly}
              className={[
                'w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg transform scale-105'
                  : isCompleted
                  ? 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                  : isReadOnly 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              ].join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-start gap-3">
                <div className={[
                  'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  isActive
                    ? 'bg-white text-blue-600'
                    : isCompleted
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                ].join(' ')}>
                  {isCompleted ? '✓' : sectionNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium leading-tight">
                    {getSectionTitle(sectionNumber)}
                  </div>
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
        className="mt-4 w-full"
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
            <h1 className="text-xl font-bold text-blue-900">2023 MSME Financing Survey</h1>
            <p className="text-sm text-blue-700">Collaborative for Frontier Finance</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center flex-wrap gap-2 text-[10px] justify-end">
              <span className="px-2 py-0.5 rounded-full bg-white/80 text-blue-700 border border-blue-200">8 sections</span>
              <span className="px-2 py-0.5 rounded-full bg-white/80 text-blue-700 border border-blue-200">12–15 min</span>
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
              Micro, Small and Medium-Sized Enterprises (MSMEs or interchangeably, "small and growing businesses", (SGBs) are a key engine for jobs and economic growth in the African and Middle East markets, absorbing up to 70% of the labour market and generating 40% GDP. However, despite the role such enterprises play in their local economies, there appears to be a lack of capital to finance these businesses. As such, they are often referred to as the "missing middle" - too small for traditional commercial finance (e.g. local banks, pension funds and PE funds), and too big for micro-finance institutions.
            </p>
            <p className="text-sm text-blue-800 mt-3">
              The Collaborative for Frontier Finance has developed this survey to assess the "state-of-play" with regards to the SGB financing sector in these regions. The following survey is designed to better understand the emerging class of Local Capital Providers (LCPs). These LCPs are heterogeneous group of indigenous fund managers that use alternative structures to provide capital to SGBs in their local markets.
            </p>
            <p className="text-sm text-blue-800 mt-3">
              With this survey we will look to better understand the business models of these LCPs, the current environment and near-term outlook; and also compare to our 2022 survey. The survey is comprised of seven sections:
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
              <li>Future Research</li>
            </ol>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900">
            <p className="mb-2">We appreciate your candor and accuracy. All responses are confidential and results are anonymized. Our request for respondent information allows us to follow up with specific questions and further advance CFF's Learning Lab agenda and materials including case studies, as well as developing thematic specific mini-surveys targeted to a handful of similar organizations. We estimate the survey will take approximately 30 minutes to complete.</p>
            <p className="mb-2">Note that given the innovative nature of this sector, we refer to the terms "fund" and "investment vehicle" interchangeably.</p>
            <p className="font-medium">Thank you in advance for your participation and sharing your valuable insights.</p>
            <p className="font-medium">The Collaborative for Frontier Finance team.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSection1 = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="email_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>1. Email address *</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter your email address" disabled={isReadOnly} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="organisation_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>2. Name of organisation *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter organisation name" disabled={isReadOnly} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="funds_raising_investing"
        render={({ field }) => (
          <FormItem>
            <FormLabel>3. How many funds are you currently raising and/or investing? *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger disabled={isReadOnly}>
                  <SelectValue placeholder="Select number of funds" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="≥3">≥3</SelectItem>
                <SelectItem value="None of the above">None of the above</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fund_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>4. Name of Fund to which this survey applies (that is Fund 1) *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter fund name" disabled={isReadOnly} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  function renderSection2() {
    return (
    <div className="space-y-6">
      {/* Section 2 Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-700">
          Questions apply to Fund 1
        </p>
      </div>
      
      <FormField
        control={form.control}
        name="legal_entity_achieved"
        render={({ field }) => (
          <FormItem>
            <FormLabel>5. Timeline. When did your fund/investment vehicle achieve each of the following? (Please provide a date for each of three points in your fund's evolution)</FormLabel>
            <div className="space-y-4">
              <div>
                <FormLabel className="text-sm font-medium">Legal Entity</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select when legal entity was achieved" />
                    </SelectTrigger>
            </FormControl>
                  <SelectContent>
                    <SelectItem value="Not Achieved">Not Achieved</SelectItem>
                    <SelectItem value="2017 or earlier">2017 or earlier</SelectItem>
                    <SelectItem value="2018 - 2022">2018 - 2022</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="first_close_achieved"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Close (or equivalent)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select when first close was achieved" />
                </SelectTrigger>
            </FormControl>
              <SelectContent>
                <SelectItem value="Not Achieved">Not Achieved</SelectItem>
                <SelectItem value="2017 or earlier">2017 or earlier</SelectItem>
                <SelectItem value="2018 - 2022">2018 - 2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="first_investment_achieved"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Investment</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select when first investment was made" />
                </SelectTrigger>
            </FormControl>
              <SelectContent>
                <SelectItem value="Not Achieved">Not Achieved</SelectItem>
                <SelectItem value="2017 or earlier">2017 or earlier</SelectItem>
                <SelectItem value="2018 - 2022">2018 - 2022</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="geographic_markets"
        render={() => (
          <FormItem>
            <FormLabel>6. In what geographic markets do you invest? (select as many as applicable)</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['US', 'Europe', 'Africa: West Africa', 'Africa: East Africa', 'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa', 'Middle East', 'Other (please specify)'].map((market) => (
                <FormField
                  key={market}
                  control={form.control}
                  name="geographic_markets"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={market}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(market)}
                            onCheckedChange={(checked) => {
                              if (!isReadOnly) {
                                return checked
                                  ? field.onChange([...field.value, market])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== market
                                      )
                                    )
                              }
                            }}
                            disabled={isReadOnly}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {market}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('geographic_markets')?.includes('Other (please specify)') && (
      <FormField
        control={form.control}
        name="geographic_markets_other"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other geographic markets (please specify)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Specify other markets" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      )}

      <FormField
        control={form.control}
        name="team_based"
        render={() => (
          <FormItem>
            <FormLabel>7. Where is your Team based? (select as many as applicable)</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['US', 'Europe', 'Africa: West Africa', 'Africa: East Africa', 'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa', 'Middle East', 'Other (please specify)'].map((location) => (
                <FormField
                  key={location}
                  control={form.control}
                  name="team_based"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={location}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(location)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, location])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== location
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {location}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('team_based')?.includes('Other (please specify)') && (
      <FormField
        control={form.control}
        name="team_based_other"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other team location (please specify)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Specify other location" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      )}

      <div className="space-y-4">
        <FormLabel>8. Number of current and forecasted Full Time Equivalent staff members (FTEs) including principals</FormLabel>
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="fte_staff_2022"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-normal">Last year 2022</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  placeholder="0" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fte_staff_current"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-normal">Current</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  placeholder="0" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fte_staff_2024_est"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-normal">Year-End 2024 (est.)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  placeholder="0" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
      </div>

      <FormField
        control={form.control}
        name="principals_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>9. Number of carried-interest/equity-interest principals currently in your Fund management team</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="0" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gender_inclusion"
        render={() => (
          <FormItem>
            <FormLabel>10. Gender Inclusion: Do any of the following apply to your fund? (select as many as applicable)</FormLabel>
            <div className="grid grid-cols-1 gap-3">
              {['Women ownership/participation interest in the fund is ≥ 50%', 'Women representation on the board/investment committee is ≥ 50', 'Female staffing in fund management team is ≥ 50%', 'Provide specific reporting on gender related indicators for your investors/funders', 'Require specific reporting on gender related indicators by your portfolio enterprises', 'Other (please specify)'].map((inclusion) => (
                <FormField
                  key={inclusion}
                  control={form.control}
                  name="gender_inclusion"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={inclusion}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(inclusion)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, inclusion])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== inclusion
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {inclusion}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('gender_inclusion')?.includes('Other (please specify)') && (
      <FormField
        control={form.control}
        name="gender_inclusion_other"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other gender inclusion (please specify)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Specify other gender inclusion" />
            </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="space-y-4">
        <FormLabel>11. What is the prior work experience within the GP leadership team / fund principals, as it relates to fund management? (Please provide a response for each row as to your GP management team / fund principals' experience)</FormLabel>
        
        <div className="space-y-1">
          {[
            'New to investment and fund management',
            'Investment/ financial experience in adjacent finance field (e.g. banking, asset management, financial advisory)',
            'Relevant business management experience (e.g. Entrepreneur/CEO, business CFO, management consultancy)',
            'Direct investment experience. However, lacks well-documented data regarding prior investment performance, track record and exits.',
            'Direct investment experience in senior fund management position. Has well-documented data regarding prior investment performance, track record and exits.'
          ].map((experience) => (
            <div key={experience} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
              <div className="flex-1">
                <FormLabel className="text-sm font-normal text-gray-900 leading-tight">{experience}</FormLabel>
              </div>
              <div className="flex-shrink-0">
                <FormField
                  control={form.control}
                  name={`team_experience_investments.${experience}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select applicable category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                            <SelectItem value="Applies to 1 Principal">Applies to 1 Principal</SelectItem>
                            <SelectItem value="Applies to 2 or more principals">Applies to 2 or more principals</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="other_experience_selected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal text-gray-900 leading-tight">
                    Other (please specify)
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className="flex-shrink-0">
            {form.watch('other_experience_selected') && (
              <FormField
                control={form.control}
                name={`team_experience_investments.Other Experience`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select applicable category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                          <SelectItem value="Applies to 1 Principal">Applies to 1 Principal</SelectItem>
                          <SelectItem value="Applies to 2 or more principals">Applies to 2 or more principals</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {form.watch('other_experience_selected') && (
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="team_experience_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Description of other experience</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Describe the other experience type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <div className="space-y-4">
          <FormLabel>12. Team Experience: Please specify cumulative number of investment/financing transactions completed by your principal(s) prior to this current fund/vehicle? (Please provide answer for both columns)</FormLabel>
          
          <div className="space-y-1">
            {[
              '0',
              '1 - 4',
              '5 - 9',
              '10 - 14',
              '15 - 24',
              '≥ 25'
            ].map((range) => (
              <div key={range} className="flex items-center justify-between py-1 border-b border-gray-100">
                <FormLabel className="text-sm font-normal w-32">{range}</FormLabel>
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name={`team_experience_investments.${range}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Investments"
                            className="w-32"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`team_experience_exits.${range}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Exits"
                            className="w-32"
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  }

  function renderSection3() {
    return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="legal_domicile"
        render={() => (
          <FormItem>
            <FormLabel>13. Where is the legal domicile of your fund? Select as many as apply</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['Mauritius', 'Netherlands', 'Luxembourg', 'Canada', 'Delaware', 'Kenya', 'Senegal', 'Nigeria', 'South Africa', 'Ghana', 'Location pending', 'Location pending - dependent on anchor LP preference', 'Other (please specify)'].map((domicile) => (
                <FormField
                  key={domicile}
                  control={form.control}
                  name="legal_domicile"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={domicile}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(domicile)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, domicile])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== domicile
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {domicile}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('legal_domicile')?.includes('Other (please specify)') && (
      <FormField
        control={form.control}
        name="legal_domicile_other"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other legal domicile (please specify)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Specify other domicile" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      )}

      <div className="space-y-4">
        <FormLabel>14. Currency Management. What currency do you make investments? What currency is your fund LP vehicle? (Please answer for both as appropriate)</FormLabel>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <FormLabel className="text-sm font-normal w-48">Currency for Investments</FormLabel>
            <FormField
              control={form.control}
              name="currency_investments"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select currency type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

          <div className="flex items-center justify-between py-1 border-b border-gray-100">
            <FormLabel className="text-sm font-normal w-48">Currency for LP Commitments</FormLabel>
            <FormField
              control={form.control}
              name="currency_lp_commitments"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select currency type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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
        </div>
      </div>

      <FormField
        control={form.control}
        name="fund_type_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>15. What is the fund type and current status of your most recent fund vehicle's operations? (Please select appropriate response)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select fund type and status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Closed ended - fundraising">Closed ended - fundraising</SelectItem>
                <SelectItem value="Closed ended - completed first close">Closed ended - completed first close</SelectItem>
                <SelectItem value="Closed ended - completed second close">Closed ended - completed second close</SelectItem>
                <SelectItem value="Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)">Open ended - fundraising and heading towards equivalent of 1st close (i.e. lack sufficient committed funds to cover fund economics)</SelectItem>
                <SelectItem value="Open ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics">Open ended - achieved equivalent of 1st close with sufficient committed funds to cover fund economics</SelectItem>
                <SelectItem value="Second fund/vehicle - fund raising">Second fund/vehicle - fund raising</SelectItem>
                <SelectItem value="Second fund/vehicle - completed first close or equivalent">Second fund/vehicle - completed first close or equivalent</SelectItem>
                <SelectItem value="Third or later fund/vehicle">Third or later fund/vehicle</SelectItem>
                <SelectItem value="Other (please specify)">Other (please specify)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('fund_type_status') === 'Other (please specify)' && (
      <FormField
        control={form.control}
        name="fund_type_status_other"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other fund type (please specify)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Specify other fund type" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      )}

      <div className="space-y-4">
        <FormLabel>16. What are the current hard commitments raised, current amount invested/outstanding portfolio and target size of your fund vehicle? (USD Equivalent) (Please provide one answer for each row)</FormLabel>

      <div className="space-y-1">
        <div className="flex items-center justify-between py-1 border-b border-gray-100">
          <FormLabel className="text-sm font-normal w-64">Current Funds Raised</FormLabel>
          <FormField
            control={form.control}
            name="current_funds_raised"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    className="w-32"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="0" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between py-1 border-b border-gray-100">
          <FormLabel className="text-sm font-normal w-64">Current amount invested by fund</FormLabel>
          <FormField
            control={form.control}
            name="current_amount_invested"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    className="w-32"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="0" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between py-1 border-b border-gray-100">
          <FormLabel className="text-sm font-normal w-64">Target fund size</FormLabel>
          <FormField
            control={form.control}
            name="target_fund_size"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    className="w-32"
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="0" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="target_investments_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>17. What is target number of investments for your fund?</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                placeholder="0" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>18. Does your LP agreement/governance permit "follow-on" investments?</FormLabel>
        
        <div className="flex items-center gap-6">
          <FormLabel className="text-sm font-normal">Follow-on investment</FormLabel>
          <FormField
            control={form.control}
            name="follow_on_investment_permitted"
            render={({ field }) => (
              <FormItem>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Not Permitted" id="not-permitted" />
                    <label htmlFor="not-permitted" className="text-sm font-normal">Not Permitted</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="< 25% of Fund" id="less-25" />
                    <label htmlFor="less-25" className="text-sm font-normal">&lt; 25% of Fund</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="26% - 50% of Fund" id="26-50" />
                    <label htmlFor="26-50" className="text-sm font-normal">26% - 50% of Fund</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="> 50% of Fund" id="more-50" />
                    <label htmlFor="more-50" className="text-sm font-normal">&gt; 50% of Fund</label>
                  </div>
                </RadioGroup>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="concessionary_capital"
        render={() => (
          <FormItem>
            <FormLabel>19. Has your fund/vehicle received concessionary capital for any of the following needs? (select as many as appropriate)</FormLabel>
            <div className="grid grid-cols-1 gap-3">
              {['No Concessionary Capital', 'Finance pre-launch set up costs (e.g. legal, GP team salaries, advisors, accountants, etc.)', 'Finance the fund\'s ongoing operating costs (post 1st Close)', 'Provide First Loss or Risk Mitigation for LPs', 'Finance business development costs associated with portfolio enterprises', 'Technical assistance for fund manager development', 'Other (please specify)'].map((capital) => (
                <FormField
                  key={capital}
                  control={form.control}
                  name="concessionary_capital"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={capital}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(capital)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, capital])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== capital
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {capital}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            {form.watch('concessionary_capital')?.includes('Other (please specify)') && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="concessionary_capital_other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Please specify other concessionary capital needs</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Describe other concessionary capital needs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>20. Existing sources of LP capital. Please indicate the percentage committed investment by each LP category into fund. (Please provide responses summing up to 100%)</FormLabel>
        
        <div className="space-y-4">
          {[
            'High net worth individuals / Angel Networks / Family offices',
            'Domestic institutional capital (e.g. pension funds, asset mgt. firms, fund of funds etc.)',
            'Local government agencies',
            'International Fund of Funds Vehicles',
            'Local Fund of Fund Vehicles',
            'International institutional capital (e.g. pension funds, asset mgt. firms, etc.)',
            'Development finance institutions (DFIs)',
            'International impact investors',
            'Donors / Bilateral Agencies / Foundations',
            'Corporates'
          ].map((lpCategory) => (
            <div key={lpCategory} className="flex items-center justify-between py-1 border-b border-gray-100">
              <FormLabel className="text-sm font-normal flex-1 mr-4">{lpCategory}</FormLabel>
              <div className="flex items-center space-x-1 w-20">
      <FormField
        control={form.control}
                  name={`lp_capital_sources_existing.${lpCategory}`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="0"
                          className="text-right h-8 w-16"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseFloat(value));
                          }}
                        />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
                <span className="text-sm text-gray-500">%</span>
    </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total:</span>
            <span className={`text-sm font-medium ${
              Math.abs(Object.values(form.watch('lp_capital_sources_existing') || {})
                .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) - 100) < 0.1 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {Object.values(form.watch('lp_capital_sources_existing') || {})
                .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0).toFixed(1)}%
            </span>
          </div>
          {Math.abs(Object.values(form.watch('lp_capital_sources_existing') || {})
            .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) - 100) >= 0.1 && (
            <p className="text-xs text-red-600 mt-1">Please ensure percentages sum to exactly 100%</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>21. Target sources of LP capital. Please indicate the percentage Targeted/Anticipated investment by each LP category into fund at full fund closing. (Please provide responses summing up to 100%)</FormLabel>
        
        <div className="space-y-4">
          {[
            'High net worth individuals / Angel Networks / Family offices',
            'Domestic institutional capital (e.g. pension funds, asset mgt. firms, fund of funds etc.)',
            'Local government agencies',
            'International Fund of Fund Vehicles',
            'Local Fund of Fund Vehicles',
            'International institutional capital (e.g. pension funds, asset mgt. firms, etc.)',
            'Development finance institutions (DFIs)',
            'International impact investors',
            'Corporates',
            'Donors / Bilateral Agencies / Foundations'
          ].map((lpCategory) => (
            <div key={lpCategory} className="flex items-center justify-between py-1 border-b border-gray-100">
              <FormLabel className="text-sm font-normal flex-1 mr-4">{lpCategory}</FormLabel>
              <div className="flex items-center space-x-1 w-20">
      <FormField
        control={form.control}
                  name={`lp_capital_sources_target.${lpCategory}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="0"
                          className="text-right h-8 w-16"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseFloat(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total:</span>
            <span className={`text-sm font-medium ${
              Math.abs(Object.values(form.watch('lp_capital_sources_target') || {})
                .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) - 100) < 0.1 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {Object.values(form.watch('lp_capital_sources_target') || {})
                .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0).toFixed(1)}%
            </span>
          </div>
          {Math.abs(Object.values(form.watch('lp_capital_sources_target') || {})
            .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) - 100) >= 0.1 && (
            <p className="text-xs text-red-600 mt-1">Please ensure percentages sum to exactly 100%</p>
          )}
        </div>
      </div>

      <FormField
        control={form.control}
        name="gp_financial_commitment"
        render={() => (
          <FormItem>
            <FormLabel>22. In determining the capital contribution by the fund management team into the vehicle, what is the form of GP financial commitment? (Please select as many as apply)</FormLabel>
            <div className="grid grid-cols-1 gap-3">
              {['"Sweat" equity of contributed work by GP management team to develop and launch fund', 'Contributed investments i.e. warehoused assets', 'Cash investment by GP management team', 'No GP financial commitment', 'Other (please specify)'].map((commitment) => (
                <FormField
                  key={commitment}
                  control={form.control}
                  name="gp_financial_commitment"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={commitment}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(commitment)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, commitment])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== commitment
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {commitment}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            {form.watch('gp_financial_commitment')?.includes('Other (please specify)') && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="gp_financial_commitment_other"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Please specify other GP financial commitment form</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Describe other GP financial commitment form" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gp_management_fee"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>23. What is the GP Management Fee? (Please select the appropriate description)</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-3"
              >
                {['< 2% GP Management Fee', '2% GP Management Fee', '> 2% GP Management Fee', '% GP Management Fee changes based on Size of AUM', 'Fixed annual budget', 'Other (please specify)'].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-sm font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            {field.value === 'Other (please specify)' && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="gp_management_fee_other"
                  render={({ field: otherField }) => (
          <FormItem>
                      <FormLabel className="text-sm font-normal">Please specify other GP management fee structure</FormLabel>
                      <FormControl>
                        <Input {...otherField} placeholder="Describe other GP management fee structure" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hurdle_rate_currency"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>24. In what currency is your hurdle rate determined?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-3"
              >
                {['Local currency', 'USD', 'Euro', 'Other (please specify)'].map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="text-sm font-normal">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            {field.value === 'Other (please specify)' && (
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="hurdle_rate_currency_other"
                  render={({ field: otherField }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Please specify other currency</FormLabel>
                      <FormControl>
                        <Input {...otherField} placeholder="Enter other currency" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hurdle_rate_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>25. For your carried interest, what is your hurdle rate (%)?</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                min="0"
                max="100"
                step="0.1"
                placeholder="Enter hurdle rate percentage"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === '' ? '' : parseFloat(value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>26. Based on your investment thesis, what is your target local currency return (%) above domestic risk free return rate?</FormLabel>
        
        <div className="space-y-4">
          {[
            'Using local government domestic bond issuance',
            'Using local government Eurobond issuance'
          ].map((method) => (
            <div key={method} className="flex items-center justify-between py-1 border-b border-gray-100">
              <FormLabel className="text-sm font-normal flex-1 mr-4">{method}</FormLabel>
              <div className="flex items-center space-x-1 w-20">
                <FormField
                  control={form.control}
                  name={`target_local_currency_return_methods.${method}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          placeholder="0"
                          className="text-right h-8 w-16"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseFloat(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>27. In raising funds for your vehicle, what are the factors that you perceive as the most consequential barriers/constraints in raising funds from potential investors? (Please provide a response for each row, ranking 1 = least constraining to 5 = most constraining)</FormLabel>
        
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
            'Governance / Risk Management Systems and Capabilities',
            'Other (please specify constraint and 1 - 5 ranking)'
          ].map((constraint) => {
            const isOther = constraint === 'Other (please specify constraint and 1 - 5 ranking)';
            
            return (
              <div key={constraint} className="flex items-center justify-between py-1 border-b border-gray-100">
                <FormLabel className="text-sm font-normal flex-1 mr-4">{constraint}</FormLabel>
                <div className="flex items-center space-x-1 w-32">
                  {isOther ? (
              <FormField
                control={form.control}
                      name="other_constraint_selected"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name={`fundraising_constraints.${constraint}`}
                render={({ field }) => (
                  <FormItem>
                          <Select onValueChange={field.onChange} value={field.value?.toString()}>
                      <FormControl>
                              <SelectTrigger className="h-8 w-16">
                                <SelectValue placeholder="-" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                              <SelectItem value="1">1 - Least Constraining</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5 - Most Constraining</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  )}
            </div>
              </div>
            );
          })}
        </div>

        {form.watch('other_constraint_selected') && (
          <div className="mt-4 border rounded p-4 space-y-4">
            <FormLabel className="text-sm font-normal">Other constraint details:</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fundraising_constraints_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Description of other constraint</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Describe the other fundraising constraint" />
                    </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
                name="fundraising_constraints.Other"
        render={({ field }) => (
          <FormItem>
                    <FormLabel className="text-sm font-normal">Ranking (1-5)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value?.toString()}>
            <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ranking" />
                        </SelectTrigger>
            </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1 - Least Constraining</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5 - Most Constraining</SelectItem>
                      </SelectContent>
                    </Select>
            <FormMessage />
          </FormItem>
        )}
      />
            </div>
          </div>
        )}
      </div>

    </div>
  );
  }

  function renderSection4() {
    return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>28. Stage of the businesses that you finance / invest in. (Please provide responses summing up to 100%)</FormLabel>
        
        <div className="space-y-4">
          {[
            { key: 'Start-up', label: 'Start-up (prerevenue, concept and business plan development)' },
            { key: 'Early stage', label: 'Early stage (early revenue, product/service development, funds needed to expand business model)' },
            { key: 'Growth', label: 'Growth (established business in need of funds for expansion, assets, working capital etc)' }
          ].map((stage) => (
            <div key={stage.key} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
              <div className="flex-1">
                <FormLabel className="text-sm font-normal text-gray-900 leading-tight">{stage.label}</FormLabel>
              </div>
              <div className="flex-shrink-0">
                <FormField
                  control={form.control}
                  name="business_stages"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="%"
                          className="w-20"
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                            const current = form.getValues('business_stages') || {};
                            form.setValue('business_stages', { ...current, [stage.key]: value ?? 0 });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {/* Total validation display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total: {(() => {
                const businessStages = form.watch('business_stages') || {};
                const total = Object.values(businessStages).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
                return `${total}%`;
              })()}</span>
              {(() => {
                const businessStages = form.watch('business_stages') || {};
                const total = Object.values(businessStages).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
                return total !== 100 ? (
                  <span className="text-sm text-red-600 font-medium">
                    {total < 100 ? `Need ${100 - total}% more` : `${total - 100}% over 100%`}
                  </span>
                ) : (
                  <span className="text-sm text-green-600 font-medium">✓ Perfect!</span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>29. Mix in growth expectations of portfolio enterprises you finance / invest in? (Please provide responses summing up to 100%)</FormLabel>
        
        <div className="space-y-4">
          {[
            { key: 'Livelihood Sustaining (<5%)', label: 'Livelihood Sustaining Enterprises <5% USD growth equivalent pa' },
            { key: 'Growth (5-10%)', label: 'Growth Enterprises 5-10% USD growth equivalent pa' },
            { key: 'Dynamic (11-20%)', label: 'Dynamic Enterprises 11-20% USD growth equivalent pa' },
            { key: 'High-Growth (>20%)', label: 'High-Growth Ventures >20% USD growth equivalent pa' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
              <div className="flex-1">
                <FormLabel className="text-sm font-normal text-gray-900 leading-tight">{label}</FormLabel>
              </div>
              <div className="flex-shrink-0">
                <FormField
                  control={form.control}
                  name="growth_expectations"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="%"
                          className="w-20"
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                            const current = form.getValues('growth_expectations') || {};
                            form.setValue('growth_expectations', { ...current, [key]: value ?? 0 });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {/* Total validation display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total: {(() => {
                const growthExpectations = form.watch('growth_expectations') || {};
                const total = Object.values(growthExpectations).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
                return `${total}%`;
              })()}</span>
              {(() => {
                const growthExpectations = form.watch('growth_expectations') || {};
                const total = Object.values(growthExpectations).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
                return total !== 100 ? (
                  <span className="text-sm text-red-600 font-medium">
                    {total < 100 ? `Need ${100 - total}% more` : `${total - 100}% over 100%`}
                  </span>
                ) : (
                  <span className="text-sm text-green-600 font-medium">✓ Perfect!</span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>30. Describe the Key Financing Needs of your Portfolio Enterprises at the time of initial investment/funding. (Please provide responses summing up to 100%)</FormLabel>
        
        <div className="space-y-4">
          {[
            { key: 'Venture launch', label: 'Venture launch (e.g. invest in initial staff, product/ services development and market acceptance)' },
            { key: 'Inventory and working capital', label: 'Inventory and working capital requirements' },
            { key: 'Small-ticket tangible assets', label: 'Small-ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment)' },
            { key: 'Major capital investments', label: 'Major capital investments (facilities, production equipment, fleet/ logistics, etc.)' },
            { key: 'Enterprise growth capital', label: 'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)' }
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
              <div className="flex-1">
                <FormLabel className="text-sm font-normal text-gray-900 leading-tight">{label}</FormLabel>
              </div>
              <div className="flex-shrink-0">
                <FormField
                  control={form.control}
                  name="financing_needs"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="%"
                          className="w-20"
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                            const current = form.getValues('financing_needs') || {};
                            form.setValue('financing_needs', { ...current, [key]: value ?? 0 });
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {/* Total validation display */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total: {(() => {
                const financingNeeds = form.watch('financing_needs') || {};
                const total = Object.values(financingNeeds).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
                return `${total}%`;
              })()}</span>
              {(() => {
                const financingNeeds = form.watch('financing_needs') || {};
                const total = Object.values(financingNeeds).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
                return total !== 100 ? (
                  <span className="text-sm text-red-600 font-medium">
                    {total < 100 ? `Need ${100 - total}% more` : `${total - 100}% over 100%`}
                  </span>
                ) : (
                  <span className="text-sm text-green-600 font-medium">✓ Perfect!</span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>31. Target Investment Activities by Sector. Provide sector mix according to target outlined in investment thesis. (Please provide a response for each row, allocating as close to 100% as possible)</FormLabel>
        
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-2 gap-4 py-2 border-b-2 border-gray-300">
            <div className="font-medium text-sm text-gray-900">Sector Focus</div>
            <div className="font-medium text-sm text-gray-900">Fund Target Percentage Allocation to this Sector</div>
          </div>
          
          {/* Rows */}
          {[
            { key: 'Sector 1', label: '#1 Sector Focus' },
            { key: 'Sector 2', label: '#2 Sector Focus' },
            { key: 'Sector 3', label: '#3 Sector Focus' },
            { key: 'Sector 4', label: '#4 Sector Focus' },
            { key: 'Sector 5', label: '#5 Sector Focus' },
            { key: 'Other', label: 'Other (please specify sector and ranking)', isOther: true }
          ].map(({ key, label, isOther }) => (
            <div key={key} className="grid grid-cols-2 gap-4 py-1 border-b border-gray-100">
              <div className="flex items-center">
                <FormLabel className="text-sm font-normal text-gray-900">{label}</FormLabel>
              </div>
              <div className="flex items-center justify-end">
                {isOther ? (
                  <FormField
                    control={form.control}
                    name="other_sector_selected"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Enable Other</FormLabel>
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="sector_focus"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="%"
                              className="w-20"
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                const current = form.getValues('sector_focus') || {};
                                form.setValue('sector_focus', { ...current, [key]: value ?? 0 });
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Total validation display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total: {(() => {
              const sectorFocus = form.watch('sector_focus') || {};
              const otherPercentage = form.watch('sector_focus_other_percentage') || 0;
              const total = Object.values(sectorFocus).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0) + (typeof otherPercentage === 'number' ? otherPercentage : 0);
              return `${total}%`;
            })()}</span>
            {(() => {
              const sectorFocus = form.watch('sector_focus') || {};
              const otherPercentage = form.watch('sector_focus_other_percentage') || 0;
              const total = Object.values(sectorFocus).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0) + (typeof otherPercentage === 'number' ? otherPercentage : 0);
              return total !== 100 ? (
                <span className="text-sm text-red-600 font-medium">
                  {total < 100 ? `Need ${100 - total}% more` : `${total - 100}% over 100%`}
                </span>
              ) : (
                <span className="text-sm text-green-600 font-medium">✓ Perfect!</span>
              );
            })()}
          </div>
        </div>

        {form.watch('other_sector_selected') && (
          <div className="mt-4 border rounded p-4 space-y-4">
            <FormLabel className="text-sm font-normal">Other sector details:</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sector_focus_other_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Sector description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Describe the other sector" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sector_focus_other_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Percentage allocation</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <FormLabel>32. Financial Instruments to be applied in target portfolio (Please provide responses summing up to 100%)</FormLabel>
        
        <div className="space-y-4">
          {[
            { key: 'Senior debt: Secured', label: 'Senior debt: Secured' },
            { key: 'Senior debt: Unsecured', label: 'Senior debt: Unsecured' },
            { key: 'Mezzanine/ subordinated debt', label: 'Mezzanine/ subordinated debt' },
            { key: 'Convertible notes', label: 'Convertible notes' },
            { key: 'SAFEs', label: 'SAFEs' },
            { key: 'Shared revenue/ earnings instruments', label: 'Shared revenue/ earnings instruments' },
            { key: 'Preferred Equity', label: 'Preferred Equity' },
            { key: 'Common equity', label: 'Common equity' },
            { key: 'Other', label: 'Other' }
          ].map(({ key, label }) => {
            const isOther = key === 'Other';
            
            return (
              <div key={key} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
                <div className="flex-1">
                  <FormLabel className="text-sm font-normal text-gray-900 leading-tight">{label}</FormLabel>
                </div>
                <div className="flex-shrink-0">
                  {isOther ? (
                    <FormField
                      control={form.control}
                      name="other_financial_instrument_selected"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Enable Other</FormLabel>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="financial_instruments"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="%"
                              className="w-20"
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                const current = form.getValues('financial_instruments') || {};
                                form.setValue('financial_instruments', { ...current, [key]: value ?? 0 });
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {form.watch('other_financial_instrument_selected') && (
          <div className="mt-4 border rounded p-4 space-y-4">
            <FormLabel className="text-sm font-normal">Other financial instrument details:</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="financial_instruments_other_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Please specify other financial instrument</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Describe other financial instrument" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="financial_instruments_other_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Percentage allocation</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        
        {/* Total validation display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total: {(() => {
              const financialInstruments = form.watch('financial_instruments') || {};
              const otherPercentage = form.watch('financial_instruments_other_percentage') || 0;
              const total = Object.values(financialInstruments).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0) + (typeof otherPercentage === 'number' ? otherPercentage : 0);
              return `${total}%`;
            })()}</span>
            {(() => {
              const financialInstruments = form.watch('financial_instruments') || {};
              const otherPercentage = form.watch('financial_instruments_other_percentage') || 0;
              const total = Object.values(financialInstruments).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0) + (typeof otherPercentage === 'number' ? otherPercentage : 0);
              return total !== 100 ? (
                <span className="text-sm text-red-600 font-medium">
                  {total < 100 ? `Need ${100 - total}% more` : `${total - 100}% over 100%`}
                </span>
              ) : (
                <span className="text-sm text-green-600 font-medium">✓ Perfect!</span>
              );
            })()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>33. Please list the top 3 Sustainable Development Goals that you target (or as many as apply):</FormLabel>
        
        <div className="space-y-4">
          {[
            'First',
            'Second', 
            'Third'
          ].map((rank) => (
            <div key={rank} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
              <FormLabel className="text-sm font-normal flex-1 mr-4">{rank}</FormLabel>
              <div className="flex items-center space-x-1 w-48">
                <FormField
                  control={form.control}
                  name={`sdg_ranking.${rank}`}
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select SDG" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="No Poverty">No Poverty</SelectItem>
                          <SelectItem value="Zero Hunger">Zero Hunger</SelectItem>
                          <SelectItem value="Good Health">Good Health</SelectItem>
                          <SelectItem value="Quality Education">Quality Education</SelectItem>
                          <SelectItem value="Gender Equality">Gender Equality</SelectItem>
                          <SelectItem value="Clean Water">Clean Water</SelectItem>
                          <SelectItem value="Affordable Energy">Affordable Energy</SelectItem>
                          <SelectItem value="Decent Work">Decent Work</SelectItem>
                          <SelectItem value="Industry Innovation">Industry Innovation</SelectItem>
                          <SelectItem value="Reduced Inequalities">Reduced Inequalities</SelectItem>
                          <SelectItem value="Sustainable Cities">Sustainable Cities</SelectItem>
                          <SelectItem value="Responsible Consumption">Responsible Consumption</SelectItem>
                          <SelectItem value="Climate Action">Climate Action</SelectItem>
                          <SelectItem value="Life Below Water">Life Below Water</SelectItem>
                          <SelectItem value="Life on Land">Life on Land</SelectItem>
                          <SelectItem value="Peace and Justice">Peace and Justice</SelectItem>
                          <SelectItem value="Partnerships">Partnerships</SelectItem>
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

      <div className="space-y-4">
        <FormLabel>34. Gender Lens Investing. Are any of the following either considerations or requirements when making investment/financing considerations? (Please provide a response for each row)</FormLabel>
        
        <div className="space-y-4">
          {[
            'Majority women ownership (>50%)',
            'Greater than 33% of women in senior management',
            'Women represent at least 33% - 50% of direct workforce',
            'Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)',
            'Have policies in place that promote gender equality (e.g. equal compensation)',
            'Women are target beneficiaries of the product/service',
            'Enterprise reports on specific gender related indicators to investors',
            'Board member female representation (>33%)',
            'Female CEO',
            '>30% of portfolio companies meet direct 2x criteria',
            'Other (please specify)'
          ].map((criteria) => {
            const isOther = criteria === 'Other (please specify)';
            
            return (
              <div key={criteria} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
                <FormLabel className="text-sm font-normal flex-1 mr-4">{criteria}</FormLabel>
                <div className="flex items-center space-x-1 w-48">
                  {isOther ? (
                    <FormField
                      control={form.control}
                      name="gender_other_selected"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name={`gender_lens_investing.${criteria}`}
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                              <SelectItem value="Investment Consideration">Investment Consideration</SelectItem>
                              <SelectItem value="Investment Requirement">Investment Requirement</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {form.watch('gender_other_selected') && (
          <div className="mt-4 border rounded p-4 space-y-4">
            <FormLabel className="text-sm font-normal">Other gender lens investing criteria details:</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender_lens_investing_other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Description of other criteria</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Describe other gender lens investing criteria" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender_lens_investing.Other"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Category for other criteria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
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
        )}
      </div>
    </div>
  );
  }

  function renderSection5() {
    return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>35. How do you source your pipeline? (Please provide responses summing up to 100%)</FormLabel>
        
        <div className="space-y-4">
          {[
            { key: 'Referral based', label: 'Referral based' },
            { key: 'Our own accelerator', label: 'Our own accelerator / development program' },
            { key: '3rd Party accelerator', label: '3rd Party accelerator / development program' },
            { key: 'Other', label: 'Other' }
          ].map(({ key, label }) => {
            const isOther = key === 'Other';
            
            return (
              <div key={key} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
                <div className="flex-1">
                  <FormLabel className="text-sm font-normal text-gray-900 leading-tight">{label}</FormLabel>
                </div>
                <div className="flex-shrink-0">
                  {isOther ? (
                    <FormField
                      control={form.control}
                      name="other_pipeline_sourcing_selected"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Enable Other</FormLabel>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="pipeline_sourcing"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="%"
                              className="w-20"
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                const current = form.getValues('pipeline_sourcing') || {};
                                form.setValue('pipeline_sourcing', { ...current, [key]: value ?? 0 });
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {form.watch('other_pipeline_sourcing_selected') && (
          <div className="mt-4 border rounded p-4 space-y-4">
            <FormLabel className="text-sm font-normal">Other pipeline sourcing details:</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pipeline_sourcing_other_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Please specify other pipeline sourcing method</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Describe other pipeline sourcing method" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pipeline_sourcing_other_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Percentage allocation</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Total validation display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total: {(() => {
              const pipelineSourcing = form.watch('pipeline_sourcing') || {};
              const otherPercentage = form.watch('pipeline_sourcing_other_percentage') || 0;
              const total = Object.values(pipelineSourcing).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0) + (typeof otherPercentage === 'number' ? otherPercentage : 0);
              return `${total}%`;
            })()}</span>
            {(() => {
              const pipelineSourcing = form.watch('pipeline_sourcing') || {};
              const otherPercentage = form.watch('pipeline_sourcing_other_percentage') || 0;
              const total = Object.values(pipelineSourcing).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0) + (typeof otherPercentage === 'number' ? otherPercentage : 0);
              return total !== 100 ? (
                <span className="text-sm text-red-600 font-medium">
                  {total < 100 ? `Need ${100 - total}% more` : `${total - 100}% over 100%`}
                </span>
              ) : (
                <span className="text-sm text-green-600 font-medium">✓ Perfect!</span>
              );
            })()}
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="average_investment_size_per_company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>36. What is the average size of investments/financing per portfolio company?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
              >
                {[
                  '< $100,000',
                  '$100,000 - $250,000',
                  '$251,000 - $500,000',
                  '$501,000 - $750,000',
                  '$751,000 - $1,000,000',
                  '$1,001,000 - $2,000,000',
                  '$2,001,000 - $5,000,000',
                  '$5,001,000 - $10,000,000',
                  '> $10,000,000'
                ].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={size} />
                    <Label htmlFor={size} className="text-sm font-normal">
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>37. What percentage of current capital raise are you funding for your portfolio companies (on average)?</FormLabel>
        
        <div className="space-y-4">
          {[
            'Equity',
            'Debt',
            'Other'
          ].map((fundingType) => (
            <div key={fundingType} className="flex items-center justify-between border rounded p-2">
              <FormLabel className="text-sm font-normal flex-1 mr-4">{fundingType}</FormLabel>
              <div className="flex items-center space-x-1 w-20">
                <FormField
                  control={form.control}
                  name={`portfolio_funding_mix.${fundingType}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                min="0"
                max="100"
                          step="0.1"
                          placeholder="0"
                          className="text-right h-8 w-16"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseFloat(value));
                          }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
                <span className="text-sm text-gray-500">%</span>
              </div>
            </div>
          ))}
        </div>

        {form.watch('portfolio_funding_mix')?.Other && (
          <div className="mt-4">
            <FormField
              control={form.control}
              name="portfolio_funding_mix_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Please specify other funding type</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Describe other funding type" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total:</span>
            <span className={`text-sm font-medium ${Object.values(form.watch('portfolio_funding_mix') || {})
              .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) > 100 ? 'text-red-600' : 
              Object.values(form.watch('portfolio_funding_mix') || {})
                .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) === 100 ? 'text-green-600' : 'text-gray-900'}`}>
              {Object.values(form.watch('portfolio_funding_mix') || {})
                .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0).toFixed(1)}%
            </span>
          </div>
          {Object.values(form.watch('portfolio_funding_mix') || {})
            .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) > 100 && (
            <p className="text-xs text-red-600 mt-1">Total exceeds 100%. Please reduce some percentages.</p>
          )}
          {Object.values(form.watch('portfolio_funding_mix') || {})
            .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) < 100 && (
            <p className="text-xs text-orange-600 mt-1">Total is less than 100%. Please ensure percentages sum to 100%.</p>
          )}
          {Object.values(form.watch('portfolio_funding_mix') || {})
            .reduce((sum: number, val: any) => sum + (parseFloat(val) || 0), 0) === 100 && (
            <p className="text-xs text-green-600 mt-1">✓ Perfect! Total equals 100%.</p>
          )}
        </div>
      </div>
    </div>
  );
  }

  function renderSection6() {
    return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>38. In the first 12 months after closing on an investment, what are the key areas that you prioritize with regards to your portfolio enterprises? (Please provide one ranking per row: 1 = lowest need, 5 = highest need)</FormLabel>
        
        <div className="space-y-4">
          {[
            'Senior Management Development',
            'Financial Management (e.g. budgeting, accounting, MIS)',
            'Fundraising, Accessing additional capital',
            'Optimizing working capital mgt.',
            'Strategic Planning',
            'Refine Product/Services Proof of Concept',
            'Sales & Marketing, Diversifying Revenue Streams',
            'Human capital management – hiring/training',
            'Operations Mgt./Production Processes',
            'Digitalization of business model (e.g. web tools, AI, etc.)',
            'Governance (e.g. putting board structures in place)'
          ].map((area) => (
            <div key={area} className="flex items-center justify-between border rounded p-3">
              <FormLabel className="text-sm font-normal flex-1 mr-4">{area}</FormLabel>
              <div className="flex items-center space-x-2">
      <FormField
        control={form.control}
                  name={`portfolio_value_creation_priorities.${area}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="Rank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 (Lowest need)</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 (Highest need)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {/* Other option with checkbox */}
          <div className="flex items-center justify-between border rounded p-3">
            <div className="flex items-center space-x-2 flex-1 mr-4">
              <FormField
                control={form.control}
                name="portfolio_other_selected"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
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
            </div>
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="portfolio_value_creation_priorities.Other"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!form.watch('portfolio_other_selected')}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Rank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 (Lowest need)</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5 (Highest need)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {form.watch('portfolio_other_selected') && (
          <div className="mt-4">
            <FormField
              control={form.control}
              name="portfolio_value_creation_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Please specify other portfolio support area</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Describe other portfolio support area" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <FormLabel>39. How is your pre and post technical assistance to portfolio companies funded? (Please provide responses summing up to 100%)</FormLabel>
        
        <div className="space-y-4">
          {[
            { key: 'Donor', label: 'Donor' },
            { key: 'Management fees', label: 'Management fees' },
            { key: 'Portfolio company', label: 'Portfolio company' },
            { key: 'Other', label: 'Other' },
            { key: 'N/A', label: 'N/A' }
          ].map(({ key, label }) => {
            const isOther = key === 'Other';
            
            return (
              <div key={key} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
                <div className="flex-1">
                  <FormLabel className="text-sm font-normal text-gray-900 leading-tight">{label}</FormLabel>
                </div>
                <div className="flex-shrink-0">
                  {isOther ? (
                    <FormField
                      control={form.control}
                      name="other_technical_assistance_selected"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">Enable Other</FormLabel>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="technical_assistance_funding"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="%"
                              className="w-20"
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                const current = form.getValues('technical_assistance_funding') || {};
                                form.setValue('technical_assistance_funding', { ...current, [key]: value ?? 0 });
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {form.watch('other_technical_assistance_selected') && (
          <div className="mt-4 border rounded p-4 space-y-4">
            <FormLabel className="text-sm font-normal">Other technical assistance funding details:</FormLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="technical_assistance_funding_other_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Please specify other funding source</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Describe other funding source" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="technical_assistance_funding_other_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Percentage allocation</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        placeholder="0"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === '' ? '' : parseFloat(value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
        
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total: {(() => {
              const technicalAssistanceFunding = form.watch('technical_assistance_funding') || {};
              const otherPercentage = form.watch('technical_assistance_funding_other_percentage') || 0;
              const total = Object.values(technicalAssistanceFunding).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0) + (typeof otherPercentage === 'number' ? otherPercentage : 0);
              return `${total}%`;
            })()}</span>
            {(() => {
              const technicalAssistanceFunding = form.watch('technical_assistance_funding') || {};
              const otherPercentage = form.watch('technical_assistance_funding_other_percentage') || 0;
              const total = Object.values(technicalAssistanceFunding).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0) + (typeof otherPercentage === 'number' ? otherPercentage : 0);
              return total !== 100 ? (
                <span className="text-sm text-red-600 font-medium">
                  {total < 100 ? `Need ${100 - total}% more` : `${total - 100}% over 100%`}
                </span>
              ) : (
                <span className="text-sm text-green-600 font-medium">✓ Perfect!</span>
              );
            })()}
          </div>
        </div>
      </div>

      <FormField
        control={form.control}
        name="business_development_approach"
        render={() => (
          <FormItem>
            <FormLabel>40. Which of the following apply to your business development support to portfolio companies? (Select as many as apply)</FormLabel>
            <div className="grid grid-cols-1 gap-3">
              {[
                'Predominantly standardised approach (intervention applies across portfolio)',
                'Predominantly tailored approach (intervention specific to portfolio company)',
                'Pre-investment TA',
                'Post-investment TA',
                'Predominantly outsourced',
                'Predominantly delivered by fund manager',
                'No TA provided',
                'Other (please specify)'
              ].map((approach) => (
                <FormField
                  key={approach}
                  control={form.control}
                  name="business_development_approach"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={approach}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(approach)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, approach])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== approach
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {approach}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('business_development_approach')?.includes('Other (please specify)') && (
        <div className="mt-4">
          <FormField
            control={form.control}
            name="business_development_approach_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal">Please specify other business development approach</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Describe other business development approach" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <FormField
        control={form.control}
        name="investment_timeframe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>41. Typical investment timeframe?</FormLabel>
              <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
              >
                {[
                  '< 1 year',
                  '1 - 3 years',
                  '4 - 5 years',
                  '6 - 7 years',
                  '8+ years'
                ].map((timeframe) => (
                  <div key={timeframe} className="flex items-center space-x-2">
                    <RadioGroupItem value={timeframe} id={timeframe} />
                    <Label htmlFor={timeframe} className="text-sm font-normal">
                      {timeframe}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exit_form"
        render={() => (
          <FormItem>
            <FormLabel>42. What is the typical form of investment monetization/exit? (select as many as applicable)</FormLabel>
            <div className="grid grid-cols-1 gap-3">
              {[
                'Interest income/shared revenues and principal repayment',
                'Other types of self-liquidating repayment structures',
                'Dividends',
                'Strategic sale/merger of company',
                'Management buyout',
                'Financial investor take-out',
                'Other (please specify)'
              ].map((exit) => (
                <FormField
                  key={exit}
                  control={form.control}
                  name="exit_form"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={exit}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(exit)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, exit])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== exit
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {exit}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('exit_form')?.includes('Other (please specify)') && (
        <div className="mt-4">
          <FormField
            control={form.control}
            name="exit_form_other"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal">Please specify other exit form</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Describe other exit form" />
                </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
        </div>
      )}
    </div>
  );
  }

  function renderSection7() {
    return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormLabel>43. List the number of investments made to date by your current vehicle.</FormLabel>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="equity_investments_count"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-normal">Number of equity investments</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                    type="number"
                    min="0"
                  placeholder="0" 
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? '' : parseInt(value));
                    }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="debt_investments_count"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-normal">Number of debt/self liquidating investments</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                    type="number"
                    min="0"
                  placeholder="0" 
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? '' : parseInt(value));
                    }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>44. List number of exits/monetisations achieved to date in current vehicle (Please answer only as applicable)</FormLabel>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="equity_exits_count"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-normal">Number of Exits for Equity Portfolio to date</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                    type="number"
                    min="0"
                  placeholder="0" 
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? '' : parseInt(value));
                    }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="debt_exits_count"
          render={({ field }) => (
            <FormItem>
                <FormLabel className="text-sm font-normal">Number of full repayments for Debt/Self-liquidating Portfolio to date</FormLabel>
              <FormControl>
                <Input 
                    {...field}
                  type="number" 
                    min="0"
                    placeholder="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? '' : parseInt(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>45. List number of exits/monetisations anticipated in next 12 months (Please answer only as applicable)</FormLabel>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="equity_exits_anticipated"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal">Number of Exits for Equity Portfolio anticipated</FormLabel>
                <FormControl>
                  <Input
                  {...field} 
                    type="number"
                    min="0"
                  placeholder="0" 
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? '' : parseInt(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="debt_exits_anticipated"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal">Number of full repayments for Debt/Self-liquidating Portfolio anticipated</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    placeholder="0"
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === '' ? '' : parseInt(value));
                    }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
      </div>

      <FormField
        control={form.control}
        name="other_investments_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>46. Optional supplement to question above: If no direct investments made to date made from your fund vehicle, please specify if you have made any other type of investment with funds raised that relate to your intended fund (such as warehoused investments). (Please provide form of investment and number of investments)</FormLabel>
            <FormControl>
              <textarea
                {...field}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Please describe any warehoused investments or other related investments, including form and number of investments..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>47. Please provide, across your portfolio, both the historical and expected average change in revenues and operating cash flow of your portfolio. (Please assess based on percentage change over the period of time)</FormLabel>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Revenue Growth</h4>
              <FormField
                control={form.control}
                name="portfolio_revenue_growth_12m"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Most recent 12 months leading up to March 30, 2023</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter percentage"
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolio_revenue_growth_next_12m"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Based on current outlook, anticipated performance for next 12 months from April 1, 2023</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter percentage"
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Operating Cash Flow Growth</h4>
              <FormField
                control={form.control}
                name="portfolio_cashflow_growth_12m"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Most recent 12 months leading up to March 30, 2023</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter percentage"
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolio_cashflow_growth_next_12m"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Based on current outlook, anticipated performance for next 12 months from April 1, 2023</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter percentage"
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="portfolio_performance_other_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (!checked) {
                        // Clear other fields when unchecked
                        form.setValue('portfolio_performance_other_description', '');
                        form.setValue('portfolio_performance_other_revenue', undefined);
                        form.setValue('portfolio_performance_other_cashflow', undefined);
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
              </FormItem>
            )}
          />
          {form.watch('portfolio_performance_other_enabled') && (
            <div className="space-y-4 pl-6 border-l-2 border-gray-200">
              <FormField
                control={form.control}
                name="portfolio_performance_other_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal">Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Describe the other performance metric..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="portfolio_performance_other_revenue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Revenue Growth</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter percentage"
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="portfolio_performance_other_cashflow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Operating Cash Flow Growth</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter percentage"
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>48. What is the total impact on employment/jobs associated with your portfolio? What has been the average impact since date of investments and what is the expected impact over the next 12 months on direct and indirect jobs? (Please assess based on percentage change over the period of time)</FormLabel>
        
        <div className="space-y-4">
          {[
            'Direct',
            'Indirect'
          ].map((jobType) => (
            <div key={jobType} className="border rounded p-4">
              <h4 className="font-medium mb-3">{jobType}</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`jobs_impact.${jobType}.Net increase Jobs as of March 30, 2023`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Net increase Jobs as of March 30, 2023</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="0"
                          className="text-right"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseInt(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`jobs_impact.${jobType}.Anticipated net increase Jobs by March 30, 2024`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Anticipated net increase Jobs by March 30, 2024</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          placeholder="0"
                          className="text-right"
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? '' : parseInt(value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {/* Other option with checkbox */}
          <div className="border rounded p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FormField
                control={form.control}
                name="jobs_impact_other_selected"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
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
            </div>
            
            {form.watch('jobs_impact_other_selected') && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="jobs_impact_other_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal">Please specify other job impact type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Describe other job impact type" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jobs_impact.Other.Net increase Jobs as of March 30, 2023"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Net increase Jobs as of March 30, 2023</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="0"
                            className="text-right"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? '' : parseInt(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobs_impact.Other.Anticipated net increase Jobs by March 30, 2024"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal">Anticipated net increase Jobs by March 30, 2024</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="0"
                            placeholder="0"
                            className="text-right"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value === '' ? '' : parseInt(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FormLabel>49. What will be your fund's areas of priority over the next 12 months? (Please answer all rows and provide one ranking per row: 1 = Lowest need, 5 = Highest need)</FormLabel>
        
        <div className="space-y-4">
          {[
            'Capital Raising for Fund Vehicle',
            'Capital raising for second Fund Vehicle',
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
            <div key={priority} className="flex items-center justify-between border rounded p-3">
              <FormLabel className="text-sm font-normal flex-1 mr-4">{priority}</FormLabel>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={`fund_priorities.${priority}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="Rank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 (Lowest need)</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 (Highest need)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {/* Other option with checkbox */}
          <div className="flex items-center justify-between border rounded p-3">
            <div className="flex items-center space-x-2 flex-1 mr-4">
              <FormField
                control={form.control}
                name="fund_priorities_other_selected"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
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
            </div>
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="fund_priorities.Other"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!form.watch('fund_priorities_other_selected')}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Rank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {form.watch('fund_priorities_other_selected') && (
          <div className="mt-4">
            <FormField
              control={form.control}
              name="fund_priorities_other_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Please specify other priority area</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Describe other priority area" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <FormLabel>50. Over the next 12 months, what international and domestic factors are you most concerned that could impact your activities? (Please answer each row, ranking 1 = not a concern, 5 = greatly concerned)</FormLabel>
        
        <div className="space-y-4">
          {[
            'Global financial system uncertainty',
            'Domestic political uncertainty',
            'International trade uncertainty',
            'Currency Risks',
            'Interest Rates fluctuations',
            'Domestic supply chain'
          ].map((concern) => (
            <div key={concern} className="flex items-center justify-between border rounded p-3">
              <FormLabel className="text-sm font-normal flex-1 mr-4">{concern}</FormLabel>
              <div className="flex items-center space-x-2">
                <FormField
                  control={form.control}
                  name={`concerns_ranking.${concern}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="Rank" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 (Not a concern)</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 (Greatly Concern)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
          
          {/* Other option with checkbox */}
          <div className="flex items-center justify-between border rounded p-3">
            <div className="flex items-center space-x-2 flex-1 mr-4">
              <FormField
                control={form.control}
                name="concerns_other_selected"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
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
            </div>
            <div className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="concerns_ranking.Other"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!form.watch('concerns_other_selected')}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Rank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {form.watch('concerns_other_selected') && (
          <div className="mt-4">
            <FormField
              control={form.control}
              name="concerns_ranking_other"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal">Please specify other concern</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Describe other concern" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
  }

  function renderSection8() {
    return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="future_research_data"
        render={() => (
          <FormItem>
            <FormLabel>51. CFF is investigating the value, utility and feasibility of tracking financial and impact performance of LCPs over the long term. The desire is to provide sector level data on the performance, and therefore ability to assess risk/reward requirements for institutional and impact investors to invest in this asset class. Data would be anonymised and aggregated for purposes of dissemination.

Which of the following would you be prepared to make available? [note: we are currently investigating methodologies/tools for compiling such data] (Select all that apply)</FormLabel>
            <div className="space-y-3">
              {[
                'Transaction level outputs (e.g., ticket size, instrument, sector, date etc)',
                'Transaction level terms (e.g., pre-investment valuation/interest rate, tenor, etc)',
                'Transaction level performance (e.g., exit valuation data, IRR/return multiples, principal repayment, writeoff/default etc)',
                'Portfolio enterprise level performance (e.g., revenue growth, EBITDA growth, key financial ratios)',
                'Fund Portfolio level performance (e.g., portfolio level IRR - realised and valuation basis)',
                'Portfolio enterprise level Impact data (e.g., shared metrics on gender and climate, jobs direct, and indirect, pay scale/employee self-satisfaction, etc.)',
                'Other (please specify)',
                'None of the above'
              ].map((data) => (
                <FormField
                  key={data}
                  control={form.control}
                  name="future_research_data"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={data}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(data)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, data])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== data
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {data}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('future_research_data')?.includes('Other (please specify)') && (
      <FormField
        control={form.control}
          name="future_research_data_other"
        render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-normal">Please specify other data type</FormLabel>
            <FormControl>
                <Input {...field} placeholder="Describe other data type you would be prepared to make available" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="one_on_one_meeting"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>52. Would you like a one on one meeting to discuss your insights on tracking performance?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex flex-col space-y-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Yes" />
            </FormControl>
                  <FormLabel className="font-normal">
                    Yes
              </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="No" />
                  </FormControl>
                  <FormLabel className="font-normal">
                    No
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium">Thank you for your valuable input.</h4>
          <h4 className="text-lg font-medium">Survey Results</h4>
        </div>
        
        <FormField
          control={form.control}
          name="receive_survey_results"
          render={({ field }) => (
            <FormItem>
              <FormLabel>53. If you are interested in receiving the results of this survey, please check the box below.</FormLabel>
              <p className="text-sm text-gray-600 mb-3">Please note that all responses will be confidential and reported only in aggregate.</p>
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
                <FormLabel className="text-sm font-normal">
                  Yes, I would like to receive the results of this survey
              </FormLabel>
              </FormItem>
              <FormMessage />
          </FormItem>
        )}
      />
      </div>
    </div>
  );
  }

  function renderCurrentSection() {
    switch (currentSection) {
      case 1: return renderSection1();
      case 2: return renderSection2();
      case 3: return renderSection3();
      case 4: return renderSection4();
      case 5: return renderSection5();
      case 6: return renderSection6();
      case 7: return renderSection7();
      case 8: return renderSection8();
      default: return renderSection1();
    }
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50 pb-16">
        <div className={`max-w-6xl mx-auto ${!showIntro ? 'pr-80' : ''}`}>
        {/* Back Button hidden on intro */}
        {!showIntro && null}
        {showIntro && renderIntroCard()}

        {/* Section Tabs - removed, now using sidebar */}

        {!showIntro && (
        <>
          {/* Mini Header with Section Count */}
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
                  style={{ width: `${(currentSection / totalSections) * 100}%` }}
                ></div>
              </div>
            </div>
          </Card>

          {/* Main Content */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Card className="bg-white p-6 rounded-lg border shadow-sm mb-6">
                <div className="space-y-6">
                  {renderCurrentSection()}
                </div>
              </Card>

            {isReadOnly ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-green-800 font-semibold text-lg mb-2">
                  ✅ Survey Completed Successfully
                </div>
                <p className="text-green-700">
                  Thank you for completing the 2023 MSME Financing Survey. 
                  Your responses have been saved and you can view them here in read-only mode.
                </p>
                <div className="mt-4 text-sm text-green-600">
                  Survey completed on: {new Date().toLocaleDateString()}
                </div>
              </div>
            ) : (
              <Card className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentSection === 1}
                    className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </Button>
                  
                  <div className="flex gap-3">
                    {currentSection < totalSections ? (
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Next →
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
            )}
            </form>
          </Form>
        </>
        )}
        </div>
        
        {/* Right Sidebar with Section Navigation */}
        {!showIntro && renderSectionSidebar()}
      </div>
    </SidebarLayout>
  );
} 
