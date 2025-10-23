// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useSurveyPersistence } from '@/hooks/useSurveyPersistence';
import { Textarea } from '@/components/ui/textarea';
import { useSurveyAutosave } from '@/hooks/useSurveyAutosave';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';

// Comprehensive schema for the complete 2024 MSME Financing Survey
const survey2024Schema = z.object({
	// Section 1: Introduction & Context (Questions 1-5)
	email_address: z.string().email(),
	investment_networks: z.array(z.string()).min(1),
	investment_networks_other: z.string().optional(),
	organisation_name: z.string().min(1),
	funds_raising_investing: z.string().min(1),
	fund_name: z.string().min(1),
	
	// Section 2: Organizational Background and Team (Questions 6-14)
	legal_entity_achieved: z.string().optional(),
	first_close_achieved: z.string().optional(),
	first_investment_achieved: z.string().optional(),
	geographic_markets: z.array(z.string()).min(1),
	geographic_markets_other: z.string().optional(),
	team_based: z.array(z.string()).min(1),
	team_based_other: z.string().optional(),
	fte_staff_2023_actual: z.number().int().min(0).optional(),
	fte_staff_current: z.number().int().min(0).optional(),
	fte_staff_2025_forecast: z.number().int().min(0).optional(),
	investment_approval: z.array(z.string()).min(1),
	investment_approval_other: z.string().optional(),
	principals_total: z.number().int().min(0).optional(),
	principals_women: z.number().int().min(0).optional(),
	gender_inclusion: z.array(z.string()).min(1),
	gender_inclusion_other: z.string().optional(),
	team_experience_investments: z.record(z.string(), z.string()).optional(),
	team_experience_exits: z.record(z.string(), z.string()).optional(),

	// Section 3: Vehicle Construct (Questions 15-32)
	legal_domicile: z.array(z.string()).min(1),
	legal_domicile_other: z.string().optional(),
	domicile_reason: z.array(z.string()).min(1),
	domicile_reason_other: z.string().optional(),
	regulatory_impact: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
	regulatory_impact_other: z.string().optional(),
	currency_investments: z.string().optional(),
	currency_lp_commitments: z.string().optional(),
	currency_hedging_strategy: z.string().optional(),
	currency_hedging_details: z.string().optional(),
	fund_type_status: z.string().optional(),
	fund_type_status_other: z.string().optional(),
	hard_commitments_2022: z.number().optional(),
	hard_commitments_current: z.number().optional(),
	amount_invested_2022: z.number().optional(),
	amount_invested_current: z.number().optional(),
	target_fund_size_2022: z.number().optional(),
	target_fund_size_current: z.number().optional(),
	target_number_investments: z.number().int().optional(),
	follow_on_permitted: z.string().optional(),
	concessionary_capital: z.array(z.string()).optional(),
	concessionary_capital_other: z.string().optional(),
	existing_lp_sources: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
	existing_lp_sources_other_description: z.string().optional(),
	target_lp_sources: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
	target_lp_sources_other_description: z.string().optional(),
	gp_financial_commitment: z.array(z.string()).optional(),
	gp_financial_commitment_other: z.string().optional(),
	gp_management_fee: z.string().optional(),
	gp_management_fee_other: z.string().optional(),
	hurdle_rate_currency: z.string().optional(),
	hurdle_rate_currency_other: z.string().optional(),
	hurdle_rate_percentage: z.number().optional(),
	target_return_above_govt_debt: z.number().optional(),
	fundraising_barriers: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
	fundraising_barriers_other_description: z.string().optional(),

	// Section 4: Investment Thesis (Questions 33-40)
	business_stages: z.record(z.string(), z.number()).optional(),
	revenue_growth_mix: z.record(z.string(), z.number()).optional(),
	financing_needs: z.record(z.string(), z.number()).optional(),
	sector_target_allocation: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
	investment_considerations: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
	investment_considerations_other: z.string().optional(),
	financial_instruments_ranking: z.record(z.string(), z.number()).optional(),
	top_sdgs: z.array(z.string()).optional(),
	additional_sdgs: z.string().optional(),
	gender_lens_investing: z.record(z.string(), z.string()).optional(),

	// Section 5: Pipeline Sourcing and Portfolio Construction (Questions 41-43)
	pipeline_sources_quality: z.record(z.string(), z.number()).optional(),
	pipeline_sources_quality_other_enabled: z.boolean().optional(),
	pipeline_sources_quality_other_description: z.string().optional(),
	pipeline_sources_quality_other_score: z.number().optional(),
	sgb_financing_trends: z.record(z.string(), z.number()).optional(),
	typical_investment_size: z.string().optional(),

	// Section 6: Portfolio Value Creation and Exits (Questions 44-55)
	post_investment_priorities: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
	post_investment_priorities_other_enabled: z.boolean().optional(),
	post_investment_priorities_other_description: z.string().optional(),
	post_investment_priorities_other_score: z.number().optional(),
	technical_assistance_funding: z.record(z.string(), z.number()).optional(),
	business_development_approach: z.array(z.string()).optional(),
	business_development_approach_other_enabled: z.boolean().optional(),
	business_development_approach_other: z.string().optional(),
	unique_offerings: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
	unique_offerings_other_enabled: z.boolean().optional(),
	unique_offerings_other_description: z.string().optional(),
	unique_offerings_other_score: z.number().optional(),
	typical_investment_timeframe: z.string().optional(),
	investment_monetisation_forms: z.array(z.string()).optional(),
	investment_monetisation_other_enabled: z.boolean().optional(),
	investment_monetisation_other: z.string().optional(),
	
	// Section 7: Performance to Date and Current Outlook (Questions 50-58)
	equity_investments_made: z.number().int().optional(),
	debt_investments_made: z.number().int().optional(),
	equity_exits_achieved: z.number().int().optional(),
	debt_repayments_achieved: z.number().int().optional(),
	equity_exits_anticipated: z.number().int().optional(),
	debt_repayments_anticipated: z.number().int().optional(),
	other_investments_supplement: z.string().optional(),
	portfolio_revenue_growth_12m: z.number().optional(),
	portfolio_revenue_growth_next_12m: z.number().optional(),
	portfolio_cashflow_growth_12m: z.number().optional(),
	portfolio_cashflow_growth_next_12m: z.number().optional(),
	portfolio_performance_other_enabled: z.boolean().optional(),
	portfolio_performance_other_description: z.string().optional(),
	portfolio_performance_other_category: z.string().optional(),
	portfolio_performance_other_value: z.number().optional(),
	direct_jobs_current: z.number().int().optional(),
	indirect_jobs_current: z.number().int().optional(),
	direct_jobs_anticipated: z.number().int().optional(),
	indirect_jobs_anticipated: z.number().int().optional(),
	employment_impact_other_enabled: z.boolean().optional(),
	employment_impact_other_description: z.string().optional(),
	employment_impact_other_category: z.string().optional(),
	employment_impact_other_value: z.number().int().optional(),
	fund_priorities_next_12m: z.record(z.string(), z.number()).optional(),
	fund_priorities_other_enabled: z.boolean().optional(),
	fund_priorities_other_description: z.string().optional(),
	fund_priorities_other_category: z.string().optional(),
	data_sharing_willingness: z.array(z.string()).optional(),
	data_sharing_other_enabled: z.boolean().optional(),
	data_sharing_other: z.string().optional(),
	survey_sender: z.string().optional(),
	receive_results: z.boolean().optional(),
});

type Survey2024FormData = z.infer<typeof survey2024Schema>;

export default function Survey2024() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [currentSection, setCurrentSection] = useState(1);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [showIntro, setShowIntro] = useState(true);
	const totalSections = 8;
	const { toast } = useToast();

	// Initialize persistence hook
	const {
		saveCurrentSection,
		saveScrollPosition,
		getLastSection,
		clearSavedData,
		setupAutoSave,
		getSavedFormData,
		saveFormData,
	} = useSurveyPersistence({ surveyKey: 'survey2024' });

	const form = useForm<Survey2024FormData>({
		resolver: zodResolver(survey2024Schema),
		reValidateMode: 'onSubmit',
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
			ye2024_ftes: '',
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
			// Section 7: 2024 Convening Objectives & Goals
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

	// Initialize autosave AFTER form is created
	const { saveStatus, saveDraft: autoSaveDraft } = useSurveyAutosave({
		userId: user?.id,
		surveyYear: '2024',
		watch: form.watch,
		enabled: !!user,
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
			// Try to load from database first
			const { data: dbDraft } = await supabase
				.from('survey_responses_2024')
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

	// Save draft function
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
				pipeline_sources_quality: form.getValues('pipeline_sources_quality') || {},
				sgb_financing_trends: form.getValues('sgb_financing_trends') || {},
				post_investment_priorities: form.getValues('post_investment_priorities') || {},
				technical_assistance_funding: form.getValues('technical_assistance_funding') || {},
				unique_offerings: form.getValues('unique_offerings') || {},
				gender_lens_investing: form.getValues('gender_lens_investing') || {},
				// Capture all form state including touched/dirty fields
				_formState: form.formState,
			};
			
			// Always save to localStorage as fallback
			saveFormData(enhancedFormData);
			
			// Try to save to database
			try {
				// Check if draft already exists
				const { data: existing } = await supabase
					.from('survey_responses_2024')
					.select('id')
					.eq('user_id', user.id)
					.maybeSingle();
				
				// Ensure required non-null columns for drafts have values
				const effectiveEmail = formData.email_address || user?.email || `draft+${user.id}@placeholder.local`;
				const effectiveOrg = formData.organisation_name || 'Draft';
				const effectiveFund = formData.fund_name || 'Draft';
				const effectiveFRI = formData.funds_raising_investing || 'Draft';
				
				const surveyData = {
					user_id: user.id,
					email_address: effectiveEmail,
					organisation_name: effectiveOrg,
					fund_name: effectiveFund,
					funds_raising_investing: effectiveFRI,
					legal_entity_achieved: formData.legal_entity_achieved || '',
					first_close_achieved: formData.first_close_achieved || '',
					first_investment_achieved: formData.first_investment_achieved || '',
					geographic_markets: formData.geographic_markets || [],
					geographic_markets_other: formData.geographic_markets_other || '',
					team_based: formData.team_based || [],
					team_based_other: formData.team_based_other || '',
					form_data: formData,
					submission_status: 'draft',
					updated_at: new Date().toISOString()
				};

				if (existing) {
					// Update existing draft
					const { error } = await supabase
						.from('survey_responses_2024')
						.update(surveyData)
						.eq('id', existing.id);
					
					if (error) throw error;
				} else {
					// Insert new draft
					const { error } = await supabase
						.from('survey_responses_2024')
						.insert(surveyData);
					
					if (error) throw error;
				}
      } catch (dbError) {
        console.warn('Database save failed, using localStorage only:', dbError);
        // Database save failed, but localStorage save succeeded
      }
      
      toast({
        title: "Draft Saved",
        description: "Your 2024 survey draft has been saved.",
      });
      
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

	// Auto-save draft every 5 seconds
	useEffect(() => {
		if (!user) return;
		
		const interval = setInterval(() => {
			saveDraft();
		}, 5000);
		
		return () => clearInterval(interval);
	}, [user]);

	// Watch all form changes and save immediately
	useEffect(() => {
		if (!user) return;
		
		// Watch specific complex fields that might not trigger general form changes
		const watchFields = [
			'pipeline_sources_quality',
			'sgb_financing_trends',
			'post_investment_priorities',
			'technical_assistance_funding',
			'unique_offerings',
			'gender_lens_investing'
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

	// Navigation handlers
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

	// Handle form submission
	const handleSubmit = async (data: any) => {
		if (!user) return;
		
		setLoading(true);
		try {
      // Manual upsert to avoid unique constraint issues on user_id
      const { data: existing } = await supabase
        .from('survey_responses_2024')
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
        form_data: data,
        submission_status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let submitError;
      if (existing) {
        const { error: updateError } = await supabase
          .from('survey_responses_2024')
          .update(recordData)
          .eq('id', existing.id);
        submitError = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('survey_responses_2024')
          .insert(recordData);
        submitError = insertError;
      }

      if (submitError) throw submitError;

			// Clear saved data
			clearSavedData();

			toast({
				title: "Survey Submitted!",
				description: "Thank you for completing the 2024 survey.",
			});

			navigate('/network');
		} catch (error) {
			console.error('Error submitting survey:', error);
			toast({
				title: "Error",
				description: "Failed to submit survey. Please try again.",
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
			8: "Future Research and Contact Information"
		};
		return titles[section as keyof typeof titles] || "Unknown Section";
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

	const renderIntroductoryBriefing = () => (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-center">
					2024 MSME Financing Survey
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 text-sm leading-relaxed">
				<div className="space-y-3">
					<p>
						<strong>Introduction and Context</strong>
					</p>
					<p>
						Micro, Small, and Medium-Sized Enterprises (MSMEs), often called "small and growing businesses" (SGBs), are vital for job creation and economic growth in Africa and the Middle East. They employ up to 70% of the workforce and generate at least 40% of GDP across economies within these regions. Yet, these businesses frequently face a financing gap: they are too large for microfinance but too small for traditional bank loans and private equity, earning them the nickname "missing middle."
					</p>
					<p>
						The Collaborative for Frontier Finance has launched a survey to examine the SGB financing landscape in these regions. We aim to explore the role of Local Capital Providers (LCPs)—local fund managers who use innovative approaches to invest in SGBs. This survey seeks respondents that manage regulated and unregulated firms that prioritize financing or investing in small and growing businesses, including but not limited to venture capital firms, PE, small business growth funds, leasing, fintech, and factoring. Geographic focus is pan-Africa, North Africa and Middle East.
					</p>
					<p>
						This survey will provide insights into the business models of LCPs, the current market conditions, and future trends, while also comparing these findings to our 2023 survey. The survey is comprised of seven sections:
					</p>
					<ol className="list-decimal list-inside space-y-1 ml-4">
						<li>Organizational Background and Team</li>
						<li>Vehicle Construct</li>
						<li>Investment Thesis</li>
						<li>Pipeline Sourcing and Portfolio Construction</li>
						<li>Portfolio Value Creation and Exits</li>
						<li>Performance-to-Date and Current Environment/Outlook</li>
						<li>Future Research</li>
					</ol>
					<p>
						We appreciate your candor and accuracy. We estimate the survey will take approximately 20 minutes to complete.
					</p>
					<p>
						Note that given the innovative nature of this sector, we refer to the terms "fund" and "investment vehicle" interchangeably.
					</p>
					<p>
						Thank you in advance for your participation and sharing your valuable insights.
					</p>
					<p className="font-semibold">
						The Collaborative for Frontier Finance team.
					</p>
				</div>
			</CardContent>
		</Card>
	);

	const renderSection1 = () => (
		<div className="space-y-8">
			
			<FormField
				control={form.control}
				name="email_address"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							1. Email address (note: all responses are anonymized. We have learned through the years that many respondents' answers trigger interesting follow-on discussions, which we use to improve the survey and CFF's overall understanding of the small business finance marketplace)
						</FormLabel>
						<FormControl>
							<Input {...field} type="email" placeholder="Enter your email address" />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="investment_networks"
				render={() => (
					<FormItem>
						<FormLabel>2. Please check all investment networks or associations that you are a part of. If they are not listed, please include them in the textbox.</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'CFF', 'ABAN', 'AVCA', 'AWI', 'Capria Network', 'WAI'
							].map((network) => (
								<FormField
									key={network}
									control={form.control}
									name="investment_networks"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(network)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, network])
															: field.onChange(field.value?.filter((value) => value !== network))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{network}</FormLabel>
										</FormItem>
									)}
								/>
							))}
							{/* Other checkbox */}
							<FormField
								control={form.control}
								name="investment_networks"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={(field.value || []).includes('Other')}
												onCheckedChange={(checked) => {
													const current = field.value || [];
													return checked
														? field.onChange([...current, 'Other'])
														: field.onChange(current.filter((v) => v !== 'Other'))
												}}
											/>
										</FormControl>
										<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
									</FormItem>
								)}
							/>
						</div>

						{(form.watch('investment_networks') || []).includes('Other') && (
						<FormField
							control={form.control}
							name="investment_networks_other"
							render={({ field }) => (
									<FormItem className="mt-2">
									<FormControl>
											<Input {...field} placeholder="Please specify other networks" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						)}

						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="organisation_name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>3. Name of your organization</FormLabel>
						<FormControl>
							<Input {...field} placeholder="Enter organisation name" />
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
						<FormLabel>4. How many funds are you currently raising and/or investing?</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
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
						<FormLabel>5. Name of Fund to which this survey applies (that is Fund 1)</FormLabel>
						<FormControl>
							<Input {...field} placeholder="Enter fund name" />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);

	const renderSection2 = () => (
		<div className="space-y-6">
			
			<FormField
				control={form.control}
				name="legal_entity_achieved"
				render={({ field }) => (
					<FormItem>
						<FormLabel>6. Timeline. When did your fund/investment vehicle achieve each of the following? (Please provide a date for each of three points in your fund's evolution)</FormLabel>
						<div className="space-y-4">
							<div>
								<FormLabel>Legal Entity</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select when legal entity was achieved" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="Not Achieved">Not Achieved</SelectItem>
										<SelectItem value="2019 or earlier">2019 or earlier</SelectItem>
										<SelectItem value="2020-2023">2020-2023</SelectItem>
										<SelectItem value="2024">2024</SelectItem>
										<SelectItem value="Not Applicable">Not Applicable</SelectItem>
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
								<SelectItem value="2019 or earlier">2019 or earlier</SelectItem>
								<SelectItem value="2020-2023">2020-2023</SelectItem>
								<SelectItem value="2024">2024</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
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
								<SelectItem value="2019 or earlier">2019 or earlier</SelectItem>
								<SelectItem value="2020-2023">2020-2023</SelectItem>
								<SelectItem value="2024">2024</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
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
						<FormLabel>7. In what geographic markets do you invest? (Please select as many as apply)</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'US', 'Europe', 'Africa: West Africa', 'Africa: East Africa', 
                        'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa', 'Middle East', 'Other'
							].map((market) => (
								<FormField
									key={market}
									control={form.control}
									name="geographic_markets"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
                                  checked={(field.value || []).includes(market)}
													onCheckedChange={(checked) => {
                                    const current = field.value || [];
														return checked
                                      ? field.onChange([...current, market])
                                      : field.onChange(current.filter((value) => value !== market))
													}}
												/>
											</FormControl>
                              <FormLabel className="text-sm font-normal">{market === 'Other' ? 'Other (please specify)' : market}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
                    {(form.watch('geographic_markets') || []).includes('Other') && (
						<FormField
							control={form.control}
							name="geographic_markets_other"
							render={({ field }) => (
                          <FormItem className="mt-2">
									<FormControl>
                              <Input {...field} placeholder="Please specify other markets" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
                    )}
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="team_based"
				render={() => (
					<FormItem>
						<FormLabel>8. Where is your Team based? (Please select as many as apply)</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'US', 'Europe', 'Africa: West Africa', 'Africa: East Africa', 
                        'Africa: Central Africa', 'Africa: Southern Africa', 'Africa: North Africa', 'Middle East', 'Other'
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
														return checked
                                      ? field.onChange([...current, location])
                                      : field.onChange(current.filter((value) => value !== location))
													}}
												/>
											</FormControl>
                              <FormLabel className="text-sm font-normal">{location === 'Other' ? 'Other (please specify)' : location}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
                    {(form.watch('team_based') || []).includes('Other') && (
						<FormField
							control={form.control}
							name="team_based_other"
							render={({ field }) => (
                          <FormItem className="mt-2">
									<FormControl>
                              <Input {...field} placeholder="Please specify other team locations" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
                    )}
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormItem>
				<FormLabel>9. Number of Full Time Equivalent staff members (FTEs) including principals</FormLabel>
				<div className="space-y-3">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<FormField
							control={form.control}
							name="fte_staff_2023_actual"
							render={({ field }) => (
								<FormItem>
									<FormLabel>December 2023 (actual)</FormLabel>
									<FormControl>
										<Input 
											{...field} 
											type="number" 
											placeholder="Enter number"
											onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
									<FormLabel>Current (actual)</FormLabel>
									<FormControl>
										<Input 
											{...field} 
											type="number" 
											placeholder="Enter number"
											onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="fte_staff_2025_forecast"
							render={({ field }) => (
								<FormItem>
									<FormLabel>December 2025 (forecast)</FormLabel>
									<FormControl>
										<Input 
											{...field} 
											type="number" 
											placeholder="Enter number"
											onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</FormItem>

			<FormField
				control={form.control}
				name="investment_approval"
				render={() => (
					<FormItem>
						<FormLabel>10. Select all that are included in your Fund's Final Investment Approval</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
                        'GPs', 'Internal Investment Team', 'External Investment Committee/Board', 'Other'
							].map((approval) => (
								<FormField
									key={approval}
									control={form.control}
									name="investment_approval"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
                                  checked={(field.value || []).includes(approval)}
													onCheckedChange={(checked) => {
                                    const current = field.value || [];
														return checked
                                      ? field.onChange([...current, approval])
                                      : field.onChange(current.filter((value) => value !== approval))
													}}
												/>
											</FormControl>
                              <FormLabel className="text-sm font-normal">{approval === 'Other' ? 'Other (please specify)' : approval}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
                    {(form.watch('investment_approval') || []).includes('Other') && (
						<FormField
							control={form.control}
							name="investment_approval_other"
							render={({ field }) => (
                          <FormItem className="mt-2">
									<FormControl>
                              <Input {...field} placeholder="Please specify other approval structure" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
                    )}
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormItem>
				<FormLabel>11. Number of carried-interest/equity-interest principals currently in your Fund management team</FormLabel>
				<div className="space-y-3">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="principals_total"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Total</FormLabel>
									<FormControl>
										<Input 
											{...field} 
											type="number" 
											placeholder="Enter total number"
											onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="principals_women"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Women</FormLabel>
									<FormControl>
										<Input 
											{...field} 
											type="number" 
											placeholder="Enter number of women"
											onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			</FormItem>

			<FormField
				control={form.control}
				name="gender_inclusion"
				render={() => (
					<FormItem>
						<FormLabel>12. Gender Inclusion. Do any of the following apply to your fund? (Please select as many as apply)</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'Women ownership/participation interest in the fund is ≥ 50%',
								'Women representation on the board/investment committee is ≥ 50%',
								'Female staffing in fund management team is ≥ 50%',
								'Provide specific reporting on gender related indicators for your investors/funders',
								'Require specific reporting on gender related indicators by your portfolio enterprises',
								'None of the above',
                                'Other'
							].map((inclusion) => (
								<FormField
									key={inclusion}
									control={form.control}
									name="gender_inclusion"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
                                                    checked={(field.value || []).includes(inclusion)}
													onCheckedChange={(checked) => {
                                                        const current = field.value || [];
														return checked
                                                            ? field.onChange([...current, inclusion])
                                                            : field.onChange(current.filter((value) => value !== inclusion))
													}}
												/>
											</FormControl>
                                            <FormLabel className="text-sm font-normal">{inclusion === 'Other' ? 'Other (please specify)' : inclusion}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
                        {(form.watch('gender_inclusion') || []).includes('Other') && (
						<FormField
							control={form.control}
							name="gender_inclusion_other"
							render={({ field }) => (
                                    <FormItem className="mt-2">
									<FormControl>
                                            <Input {...field} placeholder="Please specify other gender inclusion" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
                        )}
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="team_experience_investments"
				render={() => (
					<FormItem>
						<FormLabel>13. What is the prior work experience within the GP leadership team / fund principals, as it relates to fund management? (Please provide a response for each row as to your GP management team / fund principals' experience)</FormLabel>
						<div className="space-y-3">
							{[
								{ key: 'new_to_investment', label: 'New to investment and fund management' },
								{ key: 'adjacent_finance_experience', label: 'Investment/ financial experience in adjacent finance field (e.g. banking, asset management, financial advisory)' },
								{ key: 'relevant_business_experience', label: 'Relevant business management experience (e.g. Entrepreneur/CEO, business CFO, management consultancy)' },
								{ key: 'direct_investment_limited_track', label: 'Direct investment experience. However, lacks well-documented data regarding prior investment performance, track record and exits.' },
								{ key: 'direct_investment_senior_well_documented', label: 'Direct investment experience in senior fund management position. Has well-documented data regarding prior investment performance, track record and exits.' },
								{ key: 'other', label: 'Other (please specify)' }
							].map((opt) => (
								<div key={opt.key} className="flex items-center justify-between space-x-4 py-3 border-b border-gray-100">
									<div className="flex-1">
										{opt.key !== 'other' ? (
											<FormLabel className="text-sm font-normal text-gray-900 leading-tight">{opt.label}</FormLabel>
										) : (
											<div className="flex items-center space-x-3">
												<Checkbox
													checked={(form.watch('team_experience_investments') || {})['other_enabled'] === 'true'}
													onCheckedChange={(checked) => {
														const current = form.getValues('team_experience_investments') || {};
														if (checked) {
															form.setValue('team_experience_investments', { ...current, other_enabled: 'true' });
														} else {
															const { other_enabled, other, other_details, ...rest } = current as any;
															form.setValue('team_experience_investments', rest);
														}
													}}
												/>
												<FormLabel className="text-sm font-normal text-gray-900 leading-tight">Other (please specify)</FormLabel>
											</div>
										)}
										{opt.key === 'other' && (form.watch('team_experience_investments') || {})['other_enabled'] === 'true' && (
											<div className="mt-3 space-y-3">
												<Input
													placeholder="Please specify other experience"
													value={(form.watch('team_experience_investments') || {})['other_details'] || ''}
													onChange={(e) => {
														const current = form.getValues('team_experience_investments') || {};
														form.setValue('team_experience_investments', { ...current, other_details: e.target.value });
													}}
												/>
											</div>
										)}
									</div>
									<div className="flex-shrink-0">
										{opt.key !== 'other' && (
											<Select onValueChange={(value) => {
												const current = form.getValues('team_experience_investments') || {};
												form.setValue('team_experience_investments', { ...current, [opt.key]: value });
											}}>
												<FormControl>
													<SelectTrigger className="w-48">
														<SelectValue placeholder="Select one" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="Not Applicable">Not Applicable</SelectItem>
													<SelectItem value="Applies to 1 Principal">Applies to 1 Principal</SelectItem>
													<SelectItem value="Applies to 2 or more Principals">Applies to 2 or more Principals</SelectItem>
												</SelectContent>
											</Select>
										)}
										{opt.key === 'other' && (form.watch('team_experience_investments') || {})['other_enabled'] === 'true' && (
											<div className="mt-3">
												<Select onValueChange={(value) => {
													const current = form.getValues('team_experience_investments') || {};
													form.setValue('team_experience_investments', { ...current, other: value });
												}}>
													<FormControl>
														<SelectTrigger className="w-48">
															<SelectValue placeholder="Classify other (select one)" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="Not Applicable">Not Applicable</SelectItem>
														<SelectItem value="Applies to 1 Principal">Applies to 1 Principal</SelectItem>
														<SelectItem value="Applies to 2 or more Principals">Applies to 2 or more Principals</SelectItem>
													</SelectContent>
												</Select>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Question 14 */}
			<FormField
				control={form.control}
				name="team_experience_transactions"
				render={() => (
					<FormItem>
						<FormLabel>14. Team Experience. Please specify cumulative number of investment/financing transactions completed by your principal(s) prior to this current fund/vehicle? (Please provide a response for each row)</FormLabel>
						<div className="space-y-3">
							{[
								{ key: 'participated_as_investments_team_member', label: 'Participated as Investments Team Member' },
								{ key: 'principal_in_investments_decisions', label: 'Principal in Investments Decisions' },
								{ key: 'achieved_exits_monetizations', label: 'Achieved Exits/Monetizations' }
							].map((opt) => (
								<div key={opt.key} className="flex items-center justify-between space-x-4 py-3 border-b border-gray-100">
									<div className="flex-1">
										<FormLabel className="text-sm font-normal text-gray-900 leading-tight">{opt.label}</FormLabel>
									</div>
									<div className="flex-shrink-0">
										<Select onValueChange={(value) => {
											const current = form.getValues('team_experience_transactions') || {};
											form.setValue('team_experience_transactions', { ...current, [opt.key]: value });
										}}>
											<FormControl>
												<SelectTrigger className="w-48">
													<SelectValue placeholder="Select one" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="0">0</SelectItem>
												<SelectItem value="1-4">1-4</SelectItem>
												<SelectItem value="5-9">5-9</SelectItem>
												<SelectItem value="10-14">10-14</SelectItem>
												<SelectItem value="15-24">15-24</SelectItem>
												<SelectItem value="≥ 25">≥ 25</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
							))}
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);

	const renderSection3 = () => (
		<div className="space-y-6">
			
			<FormField
				control={form.control}
				name="legal_domicile"
				render={() => (
					<FormItem>
						<FormLabel>15. Where is the legal domicile of your fund? (Please select as many as apply)</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'Mauritius', 'Netherlands', 'Luxembourg', 'Canada', 'Delaware', 
								'Kenya', 'Senegal', 'Nigeria', 'South Africa', 'Ghana',
								'Location pending', 'Location pending – dependent on anchor LP preference', 'Other (please specify)'
							].map((domicile) => (
								<FormField
									key={domicile}
									control={form.control}
									name="legal_domicile"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={(field.value || []).includes(domicile)}
													onCheckedChange={(checked) => {
														const current = field.value || [];
														return checked
															? field.onChange([...current, domicile])
															: field.onChange(current.filter((value) => value !== domicile))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{domicile}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						{(form.watch('legal_domicile') || []).includes('Other (please specify)') && (
						<FormField
							control={form.control}
							name="legal_domicile_other"
							render={({ field }) => (
									<FormItem className="mt-2">
									<FormControl>
											<Input {...field} placeholder="Please specify other domicile" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="domicile_reason"
				render={() => (
					<FormItem>
						<FormLabel>16. What is the reason you chose to domicile there? (Please select as many as apply)</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'LP Preferences', 'Tax Regime', 'Legal and Regulatory Framework', 
								'GP Residence', 'Country where investments are made', 'Other (please specify)'
							].map((reason) => (
								<FormField
									key={reason}
									control={form.control}
									name="domicile_reason"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={(field.value || []).includes(reason)}
													onCheckedChange={(checked) => {
														const current = field.value || [];
														return checked
															? field.onChange([...current, reason])
															: field.onChange(current.filter((value) => value !== reason))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{reason}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						{(form.watch('domicile_reason') || []).includes('Other (please specify)') && (
						<FormField
							control={form.control}
							name="domicile_reason_other"
							render={({ field }) => (
									<FormItem className="mt-2">
									<FormControl>
											<Input {...field} placeholder="Please specify other domicile reason" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 17. Regulatory impact ranking */}
			<FormField
				control={form.control}
				name="regulatory_impact"
				render={() => (
					<FormItem>
						<FormLabel>17. Please rank the level of impact that regulatory requirements have on your fund investment strategies and operations. (Please provide a response for each row: 1 = least impact, 5 = most impact)</FormLabel>
						<div className="space-y-4">
							{[
								{ key: 'financial', label: 'Financial regulations' },
								{ key: 'environmental', label: 'Environmental regulations' },
								{ key: 'labor', label: 'Labor regulations' },
								{ key: 'governance', label: 'Governance' }
							].map((row) => (
								<div key={row.key} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
									<div>
										<FormLabel className="text-sm font-normal">{row.label}</FormLabel>
									</div>
									<div>
										<Select onValueChange={(value) => {
											const current = form.getValues('regulatory_impact') || {};
											form.setValue('regulatory_impact', { ...current, [row.key]: value });
										}}>
							<FormControl>
								<SelectTrigger>
													<SelectValue placeholder="Select one" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
												<SelectItem value="1">1 (least impact)</SelectItem>
												<SelectItem value="2">2</SelectItem>
												<SelectItem value="3">3</SelectItem>
												<SelectItem value="4">4</SelectItem>
												<SelectItem value="5">5 (most impact)</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
							</SelectContent>
						</Select>
									</div>
								</div>
							))}
							{/* Other row */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
								<div>
									<div className="flex items-center space-x-3">
										<Checkbox
											checked={(form.watch('regulatory_impact') || {})['other_enabled'] === 'true'}
											onCheckedChange={(checked) => {
												const current = form.getValues('regulatory_impact') || {};
												if (checked) {
													form.setValue('regulatory_impact', { ...current, other_enabled: 'true' });
												} else {
													const { other_enabled, other_label, other, ...rest } = current as any;
													form.setValue('regulatory_impact', rest);
												}
											}}
										/>
										<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
									</div>
								</div>
								<div>
									{(form.watch('regulatory_impact') || {})['other_enabled'] === 'true' && (
										<div className="space-y-2">
											<Input 
												placeholder="Describe other regulation"
												value={(form.watch('regulatory_impact') || {})['other_label'] || ''}
												onChange={(e) => {
													const current = form.getValues('regulatory_impact') || {};
													form.setValue('regulatory_impact', { ...current, other_label: e.target.value });
												}}
											/>
											<Select onValueChange={(value) => {
												const current = form.getValues('regulatory_impact') || {};
												form.setValue('regulatory_impact', { ...current, other: value });
											}}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select impact level" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="1">1 (least impact)</SelectItem>
													<SelectItem value="2">2</SelectItem>
													<SelectItem value="3">3</SelectItem>
													<SelectItem value="4">4</SelectItem>
													<SelectItem value="5">5 (most impact)</SelectItem>
													<SelectItem value="Not Applicable">Not Applicable</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)}
								</div>
							</div>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 18. Currency Management */}
			<FormField
				control={form.control}
				name="currency_investments"
				render={() => (
					<FormItem>
						<FormLabel>18. Currency Management. What currency do you use to make investments? What currency is your fund LP vehicle? (Please provide a response for each row)</FormLabel>
						<div className="space-y-4">
							{[
								{ key: 'currency_investments', label: 'Currency for Investments' },
								{ key: 'currency_lp_commitments', label: 'Currency for LP Commitments' }
							].map((row) => (
								<div key={row.key} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
									<div>
										<FormLabel className="text-sm font-normal">{row.label}</FormLabel>
									</div>
									<div>
										<Select onValueChange={(value) => {
											form.setValue(row.key as any, value);
										}}>
							<FormControl>
								<SelectTrigger>
													<SelectValue placeholder="Select one" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Local Currency">Local Currency</SelectItem>
								<SelectItem value="Foreign Currency">Foreign Currency</SelectItem>
								<SelectItem value="Multiple Currencies">Multiple Currencies</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
							</SelectContent>
						</Select>
									</div>
								</div>
							))}
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>


			<FormField
				control={form.control}
				name="currency_hedging_strategy"
				render={({ field }) => (
					<FormItem>
						<FormLabel>19. Do you have a currency hedging strategy?</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select hedging strategy" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="No">No</SelectItem>
								<SelectItem value="Yes">Yes</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			{form.watch('currency_hedging_strategy') === 'Yes' && (
			<FormField
				control={form.control}
				name="currency_hedging_details"
				render={({ field }) => (
					<FormItem>
							<FormLabel>Please specify your hedging strategy</FormLabel>
						<FormControl>
							<Textarea {...field} placeholder="Describe your currency hedging strategy" />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
			)}

			<FormField
				control={form.control}
				name="fund_type_status"
				render={({ field }) => (
					<FormItem>
						<FormLabel>20. What is the fund type and current status of your most recent fund vehicle's operations? (Please select appropriate response)</FormLabel>
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
						{form.watch('fund_type_status') === 'Other (please specify)' && (
						<FormField
							control={form.control}
							name="fund_type_status_other"
							render={({ field }) => (
								<FormItem>
										<FormLabel>Please specify other fund type and status</FormLabel>
									<FormControl>
											<Input {...field} placeholder="Please specify other fund type and status" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 21. Hard commitments raised, current amount invested and target size */}
			<FormItem>
				<FormLabel>21. What are your hard commitments raised, current amount invested/outstanding portfolio and target size of your fund vehicle? (USD Equivalent)</FormLabel>
				
				{/* Funds raised section */}
				<div className="space-y-4 mb-6">
					<FormLabel className="text-sm font-normal text-gray-900">Funds raised</FormLabel>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="hard_commitments_2022"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Year-End 2022</FormLabel>
									<FormControl>
										<Input 
											{...field} 
											type="number" 
											placeholder="USD amount"
											onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="hard_commitments_current"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Current (30 June 2024)</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="USD amount"
											onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Amount invested by fund section */}
				<div className="space-y-4 mb-6">
					<FormLabel className="text-sm font-normal text-gray-900">Amount invested by fund</FormLabel>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="amount_invested_2022"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Year-End 2022</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="USD amount"
											onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount_invested_current"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Current (30 June 2024)</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="USD amount"
											onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Target fund size section */}
				<div className="space-y-4">
					<FormLabel className="text-sm font-normal text-gray-900">Target fund size</FormLabel>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="target_fund_size_2022"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Year-End 2022</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="USD amount"
											onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="target_fund_size_current"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Current (30 June 2024)</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="USD amount"
											onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>
			</FormItem>

			<FormField
				control={form.control}
				name="target_number_investments"
				render={({ field }) => (
					<FormItem>
						<FormLabel>22. What is the target number of investments for your current fund?</FormLabel>
						<FormControl>
							<Input 
								{...field} 
								type="number" 
								placeholder="Enter target number of investments"
								onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="follow_on_permitted"
				render={({ field }) => (
					<FormItem>
						<FormLabel>23. Does your LP agreement/governance permit "follow-on" investments?</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
						<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select one" />
								</SelectTrigger>
						</FormControl>
							<SelectContent>
								<SelectItem value="Not Permitted">Not Permitted</SelectItem>
								<SelectItem value="< 25% of Fund">&lt; 25% of Fund</SelectItem>
								<SelectItem value="26%-50% of Fund">26%-50% of Fund</SelectItem>
								<SelectItem value="> 50% of Fund">&gt; 50% of Fund</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="concessionary_capital"
				render={() => (
					<FormItem>
						<FormLabel>24. Has your fund/vehicle received concessionary capital for any of the following needs? (Please select as many as apply)</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'No concessionary capital', 
								'Finance pre-launch set up costs (e.g. legal, GP team salaries, advisors, accountants, etc)', 
								'Finance the fund\'s ongoing operating costs (post 1st close)', 
								'Provide first loss or risk mitigation for LPs',
								'Finance business development costs associated with portfolio enterprises', 
								'Technical assistance for fund manager development',
								'Warehousing Costs',
								'Other (please specify)'
							].map((capital) => (
								<FormField
									key={capital}
									control={form.control}
									name="concessionary_capital"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
												<FormControl>
												<Checkbox
													checked={field.value?.includes(capital)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, capital])
															: field.onChange(field.value?.filter((value) => value !== capital))
													}}
												/>
												</FormControl>
											<FormLabel className="text-sm font-normal">{capital === 'Other (please specify)' ? 'Other (please specify)' : capital}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						{(form.watch('concessionary_capital') || []).includes('Other (please specify)') && (
						<FormField
							control={form.control}
								name="concessionary_capital_other"
							render={({ field }) => (
								<FormItem>
										<FormLabel>Please specify other concessionary capital needs</FormLabel>
									<FormControl>
											<Input {...field} placeholder="Please specify other concessionary capital needs" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 25. Existing LP capital sources (sum to 100%) */}
			<FormItem>
				<FormLabel>25. Existing sources of LP capital. Please indicate the percentage committed investment by each LP category into fund. (Please provide responses summing up to 100%)</FormLabel>
				<div className="space-y-2">
					{[
						'Domestic High net worth individuals/angel networks/family offices',
						'Domestic Institutional capital (e.g. pension funds, asset mgt. firms, banks)',
						'Local Government agencies',
						'International Fund of Fund vehicles',
						'Local Fund of fund vehicles',
						'International Institutional Capital (e.g. pension funds, asset mgt. firms, etc)',
						'Development Finance institutions',
						'International Impact Investors/ High Net Worth/ Family Offices',
						'Donors/Bilateral Agencies/foundations',
						'Local Corporates',
						'Other (please specify)'
					].map((row) => (
						<div key={row} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
							<div>
								{row === 'Other (please specify)' ? (
									<div className="flex items-center space-x-3">
										<Checkbox
											checked={(form.watch('existing_lp_sources') || {})['other_enabled'] === true}
											onCheckedChange={(checked) => {
												const current = form.getValues('existing_lp_sources') || {};
												if (checked) {
													form.setValue('existing_lp_sources', { ...current, other_enabled: true });
												} else {
													const { other_enabled, other_description, other_percentage, ...rest } = current as any;
													form.setValue('existing_lp_sources', rest);
													form.setValue('existing_lp_sources_other_description', '');
												}
											}}
										/>
										<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
									</div>
								) : (
									<FormLabel className="text-sm font-normal">{row}</FormLabel>
								)}
					</div>
							<div>
								{row === 'Other (please specify)' ? (
									<div className="space-y-2">
										{(form.watch('existing_lp_sources') || {})['other_enabled'] && (
											<>
						<FormField
							control={form.control}
													name="existing_lp_sources_other_description"
							render={({ field }) => (
								<FormItem>
									<FormControl>
																<Input {...field} placeholder="Describe other LP capital source" />
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
													name="existing_lp_sources"
													render={() => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
																	placeholder="%"
																	onChange={(e) => {
																		const value = e.target.value ? parseInt(e.target.value) : undefined;
																		const current = form.getValues('existing_lp_sources') || {};
																		form.setValue('existing_lp_sources', { ...current, other_percentage: value ?? 0 });
																	}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
											</>
										)}
					</div>
								) : (
						<FormField
							control={form.control}
										name="existing_lp_sources"
										render={() => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
														placeholder="%"
														onChange={(e) => {
															const value = e.target.value ? parseInt(e.target.value) : undefined;
															const current = form.getValues('existing_lp_sources') || {};
															form.setValue('existing_lp_sources', { ...current, [row]: value ?? 0 });
														}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
								)}
					</div>
						</div>
					))}
					{/* Other description field */}
					{/* moved inline with Other row */}
				</div>
				
				{/* Total percentage validation */}
				<div className="mt-4 p-4 bg-gray-50 rounded-lg border">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-gray-700">Total Percentage:</span>
						<span className={`text-lg font-bold ${(() => {
							const sources = form.watch('existing_lp_sources') || {};
							const total = Object.values(sources).reduce((sum: number, value: any) => {
								if (typeof value === 'number') return sum + value;
								return sum;
							}, 0);
							return total === 100 ? 'text-green-600' : 'text-red-600';
						})()}`}>
							{(() => {
								const sources = form.watch('existing_lp_sources') || {};
								const total = Object.values(sources).reduce((sum: number, value: any) => {
									if (typeof value === 'number') return sum + value;
									return sum;
								}, 0);
								return `${total}%`;
							})()}
						</span>
					</div>
					{(() => {
						const sources = form.watch('existing_lp_sources') || {};
						const total = Object.values(sources).reduce((sum: number, value: any) => {
							if (typeof value === 'number') return sum + value;
							return sum;
						}, 0);
						return total !== 100 && (
							<div className="mt-2 text-sm text-red-600">
								⚠️ Total must equal exactly 100% to proceed
							</div>
						);
					})()}
				</div>
			</FormItem>

			{/* 26. Target LP capital sources (sum to 100%) */}
			<FormItem>
				<FormLabel>26. Target sources of LP capital. Please indicate the percentage targeted investment by each LP category into fund. (Please provide responses summing up to 100%)</FormLabel>
				<div className="space-y-2">
					{[
						'Domestic High net worth individuals/angel networks/family offices',
						'Domestic Institutional capital (e.g. pension funds, asset mgt. firms, banks)',
						'Local Government agencies',
						'International Fund of Fund vehicles',
						'Local Fund of fund vehicles',
						'International Institutional Capital (e.g. pension funds, asset mgt. firms, etc)',
						'Development Finance institutions',
						'International Impact Investors/ High Net Worth/ Family Offices',
						'Donors/Bilateral Agencies/foundations',
						'Local Corporates',
						'Other (please specify)'
					].map((row) => (
						<div key={row} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
							<div>
								{row === 'Other (please specify)' ? (
									<div className="flex items-center space-x-3">
										<Checkbox
											checked={(form.watch('target_lp_sources') || {})['other_enabled'] === true}
											onCheckedChange={(checked) => {
												const current = form.getValues('target_lp_sources') || {};
												if (checked) {
													form.setValue('target_lp_sources', { ...current, other_enabled: true });
												} else {
													const { other_enabled, other_description, other_percentage, ...rest } = current as any;
													form.setValue('target_lp_sources', rest);
													form.setValue('target_lp_sources_other_description', '');
												}
											}}
										/>
										<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
									</div>
								) : (
									<FormLabel className="text-sm font-normal">{row}</FormLabel>
								)}
							</div>
							<div>
								{row === 'Other (please specify)' ? (
									<div className="space-y-2">
										{(form.watch('target_lp_sources') || {})['other_enabled'] && (
											<>
						<FormField
							control={form.control}
													name="target_lp_sources_other_description"
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<Input {...field} placeholder="Describe other LP capital source" />
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="target_lp_sources"
							render={() => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
											placeholder="%"
											onChange={(e) => {
												const value = e.target.value ? parseInt(e.target.value) : undefined;
																		const current = form.getValues('target_lp_sources') || {};
																		form.setValue('target_lp_sources', { ...current, other_percentage: value ?? 0 });
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
											</>
										)}
				</div>
								) : (
						<FormField
							control={form.control}
							name="target_lp_sources"
							render={() => (
								<FormItem>
									<FormControl>
										<Input
											type="number"
											placeholder="%"
											onChange={(e) => {
												const value = e.target.value ? parseInt(e.target.value) : undefined;
												const current = form.getValues('target_lp_sources') || {};
												form.setValue('target_lp_sources', { ...current, [row]: value ?? 0 });
											}}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
								)}
							</div>
						</div>
					))}
				</div>
				
				{/* Total percentage validation */}
				<div className="mt-4 p-4 bg-gray-50 rounded-lg border">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-gray-700">Total Percentage:</span>
						<span className={`text-lg font-bold ${(() => {
							const sources = form.watch('target_lp_sources') || {};
							const total = Object.values(sources).reduce((sum: number, value: any) => {
								if (typeof value === 'number') return sum + value;
								return sum;
							}, 0);
							return total === 100 ? 'text-green-600' : 'text-red-600';
						})()}`}>
							{(() => {
								const sources = form.watch('target_lp_sources') || {};
								const total = Object.values(sources).reduce((sum: number, value: any) => {
									if (typeof value === 'number') return sum + value;
									return sum;
								}, 0);
								return `${total}%`;
							})()}
						</span>
					</div>
					{(() => {
						const sources = form.watch('target_lp_sources') || {};
						const total = Object.values(sources).reduce((sum: number, value: any) => {
							if (typeof value === 'number') return sum + value;
							return sum;
						}, 0);
						return total !== 100 && (
							<div className="mt-2 text-sm text-red-600">
								⚠️ Total must equal exactly 100% to proceed
							</div>
						);
					})()}
				</div>
			</FormItem>

			<FormField
				control={form.control}
				name="gp_financial_commitment"
				render={() => (
					<FormItem>
						<FormLabel>27. In determining the capital contribution by the fund management team into the vehicle, what is the form of GP financial commitment? (Please select as many as apply)</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'"Sweat" equity of contributed work by GP management team to develop and launch fund',
								'Contributed investments (i.e. warehoused assets)',
								'Cash investment by GP management team',
								'No GP financial commitment',
								'Other (please specify)'
							].map((commitment) => (
								<FormField
									key={commitment}
									control={form.control}
									name="gp_financial_commitment"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(commitment)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, commitment])
															: field.onChange(field.value?.filter((value) => value !== commitment))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{commitment === 'Other (please specify)' ? 'Other (please specify)' : commitment}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						{(form.watch('gp_financial_commitment') || []).includes('Other (please specify)') && (
						<FormField
							control={form.control}
							name="gp_financial_commitment_other"
							render={({ field }) => (
								<FormItem>
										<FormLabel>Please specify other GP financial commitment</FormLabel>
									<FormControl>
											<Input {...field} placeholder="Please specify other GP financial commitment" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 28. GP Management Fee */}
			<FormField
				control={form.control}
				name="gp_management_fee"
				render={({ field }) => (
					<FormItem>
						<FormLabel>28. What is the GP Management Fee? (Please select the appropriate description)</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select management fee structure" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="< 2% GP Management Fee">&lt; 2% GP Management Fee</SelectItem>
								<SelectItem value="2% GP Management Fee">2% GP Management Fee</SelectItem>
								<SelectItem value="> 2% GP Management Fee">&gt; 2% GP Management Fee</SelectItem>
								<SelectItem value="% GP Management Fee changes based on Size of AUM">% GP Management Fee changes based on Size of AUM</SelectItem>
								<SelectItem value="Contracted annual budget/salary with performance bonuses">Contracted annual budget/salary with performance bonuses</SelectItem>
								<SelectItem value="Other (please specify)">Other (please specify)</SelectItem>
							</SelectContent>
						</Select>
						{form.watch('gp_management_fee') === 'Other (please specify)' && (
							<FormField
								control={form.control}
								name="gp_management_fee_other"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Please specify other GP management fee structure</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Please specify other GP management fee structure" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="hurdle_rate_currency"
				render={({ field }) => (
					<FormItem>
						<FormLabel>29. In what currency is your hurdle rate determined?</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select one" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Local currency">Local currency</SelectItem>
								<SelectItem value="USD">USD</SelectItem>
								<SelectItem value="Euro">Euro</SelectItem>
								<SelectItem value="Other (please specify)">Other (please specify)</SelectItem>
							</SelectContent>
						</Select>
						{form.watch('hurdle_rate_currency') === 'Other (please specify)' && (
							<FormField
								control={form.control}
								name="hurdle_rate_currency_other"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Please specify other currency</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Please specify other currency" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
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
						<FormLabel>30. For your carried interest, what is your hurdle rate (%)?</FormLabel>
						<FormControl>
							<Input 
								{...field} 
								type="number" 
								placeholder="Enter hurdle rate percentage"
								onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="target_return_above_govt_debt"
				render={({ field }) => (
					<FormItem>
						<FormLabel>31. In your investment thesis, what is your target return above local currency government debt issuances (%) (i.e., above the domestic risk free return rate)?</FormLabel>
						<FormControl>
							<Input 
								{...field} 
								type="number" 
								placeholder="Enter target return percentage"
								onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 32. Fundraising barriers/constraints (1-5 scale) */}
			<FormItem>
				<FormLabel>32. In raising funds for your vehicle, what are the factors that you perceive as the most consequential barriers/constraints in raising funds from potential investors? (Please provide a response for each row: 1 = least constraining, 5 = most constraining)</FormLabel>
				<div className="space-y-4">
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
						'Governance / Risk Management Systems and Capabilities'
					].map((row) => (
						<div key={row} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
							<div>
								<FormLabel className="text-sm font-normal">{row}</FormLabel>
							</div>
							<div>
						<FormField
							control={form.control}
							name="fundraising_barriers"
							render={() => (
								<FormItem>
									<Select
										onValueChange={(value) => {
											const score = value ? parseInt(value) : 0;
											const current = form.getValues('fundraising_barriers') || {};
											form.setValue('fundraising_barriers', { ...current, [row]: score });
										}}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select 1-5 or N/A" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="1">1 (least constraining)</SelectItem>
											<SelectItem value="2">2</SelectItem>
											<SelectItem value="3">3</SelectItem>
											<SelectItem value="4">4</SelectItem>
											<SelectItem value="5">5 (most constraining)</SelectItem>
											<SelectItem value="0">Not Applicable</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
							</div>
						</div>
					))}
					
					{/* Other option with checkbox */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
						<div>
							<div className="flex items-center space-x-3">
								<Checkbox
									checked={(form.watch('fundraising_barriers') || {})['other_enabled'] === true}
									onCheckedChange={(checked) => {
										const current = form.getValues('fundraising_barriers') || {};
										if (checked) {
											form.setValue('fundraising_barriers', { ...current, other_enabled: true });
										} else {
											const { other_enabled, other_description, other_percentage, ...rest } = current as any;
											form.setValue('fundraising_barriers', rest);
											form.setValue('fundraising_barriers_other_description', '');
										}
									}}
								/>
								<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
							</div>
						</div>
						<div>
							{(form.watch('fundraising_barriers') || {})['other_enabled'] && (
								<div className="space-y-2">
									<FormField
										control={form.control}
										name="fundraising_barriers_other_description"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input {...field} placeholder="Describe other barrier" />
												</FormControl>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="fundraising_barriers"
										render={() => (
											<FormItem>
												<Select
													onValueChange={(value) => {
														const score = value ? parseInt(value) : 0;
														const current = form.getValues('fundraising_barriers') || {};
														form.setValue('fundraising_barriers', { ...current, other_percentage: score });
													}}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select 1-5 or N/A" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="1">1 (least constraining)</SelectItem>
														<SelectItem value="2">2</SelectItem>
														<SelectItem value="3">3</SelectItem>
														<SelectItem value="4">4</SelectItem>
														<SelectItem value="5">5 (most constraining)</SelectItem>
														<SelectItem value="0">Not Applicable</SelectItem>
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</FormItem>

		</div>
	);

	const renderSection4 = () => (
		<div className="space-y-6">

			{/* 33. Stage of the businesses financed (sum to 100%) */}
			<FormItem>
				<FormLabel>33. Stage of the businesses that you finance / invest in. (Please provide responses summing up to 100%)</FormLabel>
				<div className="space-y-4">
					{[
						{ key: 'Start-up', label: 'Start-up (prerevenue, concept and business plan development)' },
						{ key: 'Early stage', label: 'Early stage (early revenue, product/service development, funds needed to expand business model)' },
						{ key: 'Growth', label: 'Growth (established business in need of funds for expansion, assets, working capital etc)' }
					].map((stage) => (
						<div key={stage.key} className="flex items-center justify-between space-x-4 py-3 border-b border-gray-100">
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
			</FormItem>

			{/* 34. Revenue growth expectations (sum to 100%) */}
			<FormItem>
				<FormLabel>34. Mix in revenue growth expectations of portfolio enterprises you finance / invest in? (Please provide responses of whole numbers summing up to 100%)</FormLabel>
				<div className="space-y-4">
					{[
						{ key: 'Livelihood Sustaining (<5%)', label: 'Livelihood Sustaining Enterprises (<5% USD revenue growth equivalent pa)' },
						{ key: 'Growth (5-10%)', label: 'Growth Enterprises (5-10% USD revenue growth equivalent pa)' },
						{ key: 'Dynamic (11-20%)', label: 'Dynamic Enterprises (11-20% USD revenue growth equivalent pa)' },
						{ key: 'High-Growth (>20%)', label: 'High-Growth Ventures (>20% USD revenue growth equivalent pa)' }
					].map(({ key, label }) => (
						<div key={key} className="flex items-center justify-between space-x-4 py-3 border-b border-gray-100">
							<div className="flex-1">
								<FormLabel className="text-sm font-normal text-gray-900 leading-tight">{label}</FormLabel>
							</div>
							<div className="flex-shrink-0">
								<FormField
									control={form.control}
									name="revenue_growth_mix"
									render={() => (
										<FormItem>
											<FormControl>
												<Input
													type="number"
													placeholder="%"
													className="w-20"
													onChange={(e) => {
														const value = e.target.value ? parseInt(e.target.value) : undefined;
														const current = form.getValues('revenue_growth_mix') || {};
														form.setValue('revenue_growth_mix', { ...current, [key]: value ?? 0 });
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
								const revenueGrowthMix = form.watch('revenue_growth_mix') || {};
								const total = Object.values(revenueGrowthMix).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
								return `${total}%`;
							})()}</span>
							{(() => {
								const revenueGrowthMix = form.watch('revenue_growth_mix') || {};
								const total = Object.values(revenueGrowthMix).reduce((sum: number, value: any) => sum + (typeof value === 'number' ? value : 0), 0);
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
			</FormItem>

			{/* 35. Financing needs (sum to 100%) */}
			<FormItem>
				<FormLabel>35. Describe the key financing needs of your portfolio enterprises at the time of your initial investment/funding. (Please provide responses summing up to 100%)</FormLabel>
				<div className="space-y-4">
					{[
						'Venture launch (e.g. invest in initial staff, product/ services development and market acceptance)',
						'Inventory and working capital requirements',
						'Small-ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment)',
						'Major capital investments (facilities, production equipment, fleet/ logistics, etc.)',
						'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)'
					].map((row) => (
						<div key={row} className="flex items-center justify-between space-x-4 py-3 border-b border-gray-100">
							<div className="flex-1">
								<FormLabel className="text-sm font-normal text-gray-900 leading-tight">{row}</FormLabel>
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
														form.setValue('financing_needs', { ...current, [row]: value ?? 0 });
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
			</FormItem>

			{/* 36. Sector target allocation */}
			<FormItem>
				<FormLabel>36. Target Investment Activities by Sector. Provide sector mix according to target outlined in investment thesis. (Please list sectors in order from 1st to 5th with their percentages)</FormLabel>
				<div className="space-y-4">
					{Array.from({ length: 5 }, (_, index) => (
						<div key={index} className="flex items-center justify-between space-x-4 py-3 border-b border-gray-100">
							<div className="flex-1 flex items-center space-x-3">
								<span className="text-sm font-medium w-8 flex-shrink-0">{index + 1}.</span>
								<FormField
									control={form.control}
									name="sector_target_allocation"
									render={() => (
										<FormItem className="flex-1">
											<FormControl>
												<Input
													placeholder="Sector name"
													onChange={(e) => {
														const current = form.getValues('sector_target_allocation') || {};
														const updated = { ...current };
														if (e.target.value) {
															updated[`sector_${index + 1}`] = e.target.value;
														} else {
															delete updated[`sector_${index + 1}`];
														}
														form.setValue('sector_target_allocation', updated);
													}}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div className="flex-shrink-0">
								<FormField
									control={form.control}
									name="sector_target_allocation"
									render={() => (
										<FormItem>
											<FormControl>
												<Input
													type="number"
													placeholder="%"
													className="w-20"
													onChange={(e) => {
														const value = e.target.value ? parseInt(e.target.value) : undefined;
														const current = form.getValues('sector_target_allocation') || {};
														const updated = { ...current };
														if (value !== undefined) {
															updated[`percentage_${index + 1}`] = value;
														} else {
															delete updated[`percentage_${index + 1}`];
														}
														form.setValue('sector_target_allocation', updated);
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
								const sectorAllocation = form.watch('sector_target_allocation') || {};
								const total = Object.keys(sectorAllocation)
									.filter(key => key.startsWith('percentage_'))
									.reduce((sum: number, key) => sum + (typeof sectorAllocation[key] === 'number' ? sectorAllocation[key] : 0), 0);
								return `${total}%`;
							})()}</span>
							{(() => {
								const sectorAllocation = form.watch('sector_target_allocation') || {};
								const total = Object.keys(sectorAllocation)
									.filter(key => key.startsWith('percentage_'))
									.reduce((sum: number, key) => sum + (typeof sectorAllocation[key] === 'number' ? sectorAllocation[key] : 0), 0);
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
			</FormItem>

			{/* 37. Considerations when selecting investments (1-5) */}
			<FormItem>
				<FormLabel>37. Please rate the relevance of considerations when selecting investments. (Please provide a response for each row: 1 = least relevant, 5 = most relevant)</FormLabel>
				<div className="space-y-4">
					{[
						'Growth Potential',
						'Social Impact',
						'Market/Consumer Demand',
						'Financial Performance',
						'Exposure to Economic Fluctuations',
						'Operational Risk',
						'Other (please specify)'
					].map((row) => (
						<div key={row} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
							<div>
								{row === 'Other (please specify)' ? (
									<div className="flex items-center space-x-3">
										<Checkbox
											checked={(form.watch('investment_considerations') || {})['other_enabled'] === true}
											onCheckedChange={(checked) => {
												const current = form.getValues('investment_considerations') || {};
												if (checked) {
													form.setValue('investment_considerations', { ...current, other_enabled: true });
												} else {
													const { other_enabled, other_description, other_score, ...rest } = current as any;
													form.setValue('investment_considerations', rest);
													form.setValue('investment_considerations_other', '');
												}
											}}
										/>
										<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
									</div>
								) : (
									<FormLabel className="text-sm font-normal">{row}</FormLabel>
								)}
							</div>
							<div>
								{row === 'Other (please specify)' ? (
									<div className="space-y-2">
										{(form.watch('investment_considerations') || {})['other_enabled'] && (
											<>
												<FormField
													control={form.control}
													name="investment_considerations_other"
													render={({ field }) => (
														<FormItem>
															<FormControl>
																<Input {...field} placeholder="Describe other consideration" />
															</FormControl>
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name="investment_considerations"
													render={() => (
														<FormItem>
															<Select
																onValueChange={(value) => {
																	const score = value ? parseInt(value) : 0;
																	const current = form.getValues('investment_considerations') || {};
																	form.setValue('investment_considerations', { ...current, other_score: score });
																}}
															>
																<FormControl>
																	<SelectTrigger>
																		<SelectValue placeholder="Select 1-5 or N/A" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent>
																	<SelectItem value="1">1 (least relevant)</SelectItem>
																	<SelectItem value="2">2</SelectItem>
																	<SelectItem value="3">3</SelectItem>
																	<SelectItem value="4">4</SelectItem>
																	<SelectItem value="5">5 (most relevant)</SelectItem>
																	<SelectItem value="0">Not Applicable</SelectItem>
																</SelectContent>
															</Select>
														</FormItem>
													)}
												/>
											</>
										)}
									</div>
								) : (
									<FormField
										control={form.control}
										name="investment_considerations"
										render={() => (
											<FormItem>
												<Select
													onValueChange={(value) => {
														const score = value ? parseInt(value) : 0;
														const current = form.getValues('investment_considerations') || {};
														form.setValue('investment_considerations', { ...current, [row]: score });
													}}
												>
													<FormControl>
														<SelectTrigger>
															<SelectValue placeholder="Select 1-5 or N/A" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="1">1 (least relevant)</SelectItem>
														<SelectItem value="2">2</SelectItem>
														<SelectItem value="3">3</SelectItem>
														<SelectItem value="4">4</SelectItem>
														<SelectItem value="5">5 (most relevant)</SelectItem>
														<SelectItem value="0">Not Applicable</SelectItem>
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</FormItem>

			{/* 38. Financial instruments ranking (1-8) */}
			<FormItem>
				<FormLabel>38. Please rank the relevance of financial instruments that are applied in your target portfolio. (Your most used instrument should be ranked #1, your least used instrument should be ranked #8)</FormLabel>
				<div className="space-y-4">
					{[
						'Senior debt secured',
						'Senior debt unsecured',
						'Mezzanine/ subordinated debt',
						'Convertible notes',
						'SAFEs',
						'Shared revenue/ earnings instruments',
						'Preferred equity',
						'Common equity',
					].map((instrument) => (
						<div key={instrument} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
							<div>
								<FormLabel className="text-sm font-normal">{instrument}</FormLabel>
							</div>
							<div>
						<FormField
							control={form.control}
							name="financial_instruments_ranking"
							render={() => (
								<FormItem>
									<Select
										onValueChange={(value) => {
											const rank = value ? parseInt(value) : 0;
											const current = form.getValues('financial_instruments_ranking') || {};
											form.setValue('financial_instruments_ranking', { ...current, [instrument]: rank });
										}}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select rank or N/A" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
														<SelectItem key={n} value={String(n)}>#{n}</SelectItem>
											))}
											<SelectItem value="0">N/A</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
							</div>
						</div>
					))}
				</div>
			</FormItem>

			{/* 39. Top 3 SDGs */}
			<FormItem>
				<FormLabel>39. Please list the top 3 Sustainable Development Goals that you target. (If you target more than 3, please include in the comment box below)</FormLabel>
				<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{[0,1,2].map((idx) => (
						<FormItem key={idx}>
								<FormLabel className="text-sm font-normal">
									{idx === 0 ? 'First' : idx === 1 ? 'Second' : 'Third'}
								</FormLabel>
							<FormControl>
								<Input
									placeholder="e.g., SDG 5: Gender Equality"
									onChange={(e) => {
										const arr = [...(form.getValues('top_sdgs') || [])];
										arr[idx] = e.target.value;
										form.setValue('top_sdgs', arr.filter((s) => s && s.trim().length > 0));
									}}
								/>
							</FormControl>
						</FormItem>
					))}
				</div>
				<FormField
					control={form.control}
					name="additional_sdgs"
					render={({ field }) => (
						<FormItem>
								<FormLabel className="text-sm font-normal">If you target more than 3 SDGs, please list them here.</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder="List any additional SDGs you target" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				</div>
			</FormItem>

			{/* 40. Gender Lens Investing */}
			<FormItem>
				<FormLabel>40. Gender Lens Investing. Are any of the following either considerations or requirements when making investment/financing considerations? (Select one per row)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						'Majority women ownership (\u003e50%)',
						'Greater than 33% of women in senior management',
						'Women represent at least 33% - 50% of direct workforce',
						'Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)',
						'Have policies in place that promote gender equality (e.g. equal compensation)',
						'Women are target beneficiaries of the product/service',
						'Enterprise reports on specific gender related indicators to investors',
						'Board member female representation (\u003e33%)',
						'Female CEO',
						'>30% of portfolio companies meet direct 2x criteria',
					].map((row) => (
						<FormField
							key={row}
							control={form.control}
							name="gender_lens_investing"
							render={() => (
								<FormItem>
										<FormLabel className="text-sm font-normal">{row}</FormLabel>
									<Select
										onValueChange={(value) => {
											const current = form.getValues('gender_lens_investing') || {};
											form.setValue('gender_lens_investing', { ...current, [row]: value });
										}}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select one" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="Not Applicable">Not Applicable</SelectItem>
											<SelectItem value="Investment Consideration">Investment Consideration</SelectItem>
											<SelectItem value="Investment Requirement">Investment Requirement</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					))}
				</div>
			</FormItem>
		</div>
	);

	const renderSection5 = () => (
		<div className="space-y-6">

			{/* 41. Pipeline sources quality rating (1-5) */}
			<FormItem>
				<FormLabel>41. How would you rate your sources of pipeline? (Please rank 1 for low quality, 5 for high quality, and N/A if it is not a source of deal flow)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						'Referral based/Own Network',
						'Our own accelerator/ development program',
						'3rd party accelerator/ development program',
						'On-line submissions/Website applications',
						'Other?',
					].map((source) => (
						<FormField
							key={source}
							control={form.control}
							name="pipeline_sources_quality"
							render={() => (
								<FormItem>
										{source === 'Other?' ? (
											<div className="space-y-3">
												<div className="flex items-center space-x-3">
													<Checkbox
														checked={form.watch('pipeline_sources_quality_other_enabled') === true}
														onCheckedChange={(checked) => {
															form.setValue('pipeline_sources_quality_other_enabled', !!checked);
															if (!checked) {
																form.setValue('pipeline_sources_quality_other_description', '');
																form.setValue('pipeline_sources_quality_other_score', 0);
															}
														}}
													/>
													<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
												</div>
												{form.watch('pipeline_sources_quality_other_enabled') && (
													<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
														<FormField
															control={form.control}
															name="pipeline_sources_quality_other_description"
															render={({ field }) => (
																<FormItem>
																	<FormControl>
																		<Input {...field} placeholder="Describe other pipeline source" />
																	</FormControl>
																</FormItem>
															)}
														/>
														<Select
															onValueChange={(value) => {
																const score = value ? parseInt(value) : 0;
																form.setValue('pipeline_sources_quality_other_score', score);
															}}
														>
															<FormControl>
																<SelectTrigger>
																	<SelectValue placeholder="Select 1-5 or N/A" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																<SelectItem value="1">1 (low quality)</SelectItem>
																<SelectItem value="2">2</SelectItem>
																<SelectItem value="3">3</SelectItem>
																<SelectItem value="4">4</SelectItem>
																<SelectItem value="5">5 (high quality)</SelectItem>
																<SelectItem value="0">N/A</SelectItem>
															</SelectContent>
														</Select>
													</div>
												)}
											</div>
										) : (
											<>
												<FormLabel className="text-sm font-normal">{source}</FormLabel>
									<Select
										onValueChange={(value) => {
											const score = value ? parseInt(value) : 0;
											const current = form.getValues('pipeline_sources_quality') || {};
											form.setValue('pipeline_sources_quality', { ...current, [source]: score });
										}}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select 1-5 or N/A" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="1">1 (low quality)</SelectItem>
											<SelectItem value="2">2</SelectItem>
											<SelectItem value="3">3</SelectItem>
											<SelectItem value="4">4</SelectItem>
											<SelectItem value="5">5 (high quality)</SelectItem>
											<SelectItem value="0">N/A</SelectItem>
										</SelectContent>
									</Select>
											</>
										)}
								</FormItem>
							)}
						/>
					))}
				</div>
			</FormItem>

			{/* 42. SGB financing trends (-5 to +5 scale) */}
			<FormItem>
				<FormLabel>42. What trends are you observing in the SGB financing sector? Please scale these observations from negative to neutral to positive. (-5 = most negative, 0 = neutral, 5 = most positive)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						'Increased funding availability from Development Agencies/Institutions',
						'Increased funding availability from Foundations',
						'Increased funding availability Local Institutional Capital',
						'Increased funding availability Local Government',
						'Impediment of local regulatory environment - due to costs, slow processes, or complexity',
						'Increased interest/prioritization from Local Institutional Investors in Social Impact',
						'Increased interest/prioritization from Local Institutional Investors in Gender',
						'Increased interest prioritization from Local Institutional Investors in Climate',
					].map((trend) => (
						<FormField
							key={trend}
							control={form.control}
							name="sgb_financing_trends"
							render={() => (
								<FormItem>
										<FormLabel className="text-sm font-normal">{trend}</FormLabel>
									<Select
										onValueChange={(value) => {
											const score = value ? parseInt(value) : 0;
											const current = form.getValues('sgb_financing_trends') || {};
											form.setValue('sgb_financing_trends', { ...current, [trend]: score });
										}}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select -5 to +5" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="-5">-5 (most negative)</SelectItem>
											<SelectItem value="-4">-4</SelectItem>
											<SelectItem value="-3">-3</SelectItem>
											<SelectItem value="-2">-2</SelectItem>
											<SelectItem value="-1">-1</SelectItem>
											<SelectItem value="0">0 (neutral)</SelectItem>
											<SelectItem value="1">1</SelectItem>
											<SelectItem value="2">2</SelectItem>
											<SelectItem value="3">3</SelectItem>
											<SelectItem value="4">4</SelectItem>
											<SelectItem value="5">5 (most positive)</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					))}
				</div>
			</FormItem>

			{/* 43. Typical investment size */}
			<FormField
				control={form.control}
				name="typical_investment_size"
				render={({ field }) => (
					<FormItem>
						<FormLabel>43. What is your typical size of investments/financing per Portfolio Company?</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select typical investment size" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="< $50,000">&lt; $50,000</SelectItem>
								<SelectItem value="$51,000 - $100,000">$51,000 - $100,000</SelectItem>
								<SelectItem value="$100,000 - $250,000">$100,000 - $250,000</SelectItem>
								<SelectItem value="$251,000 - $500,000">$251,000 - $500,000</SelectItem>
								<SelectItem value="$501,000 - $750,000">$501,000 - $750,000</SelectItem>
								<SelectItem value="$751,000 - $1,000,000">$751,000 - $1,000,000</SelectItem>
								<SelectItem value="$1,001,000 - $2,000,000">$1,001,000 - $2,000,000</SelectItem>
								<SelectItem value="$2,001,000 - $5,000,000">$2,001,000 - $5,000,000</SelectItem>
								<SelectItem value="$5,001,000 - $10,000,000">$5,001,000 - $10,000,000</SelectItem>
								<SelectItem value="> $10,000,000">&gt; $10,000,000</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);

	const renderSection6 = () => (
		<div className="space-y-6">

			{/* 44. Post-investment priorities (1-5 scale) */}
			<FormItem>
				<FormLabel>44. In the first 12 months after closing on an investment, what are the key areas that you prioritise with regards to your portfolio enterprises? (1 = lowest need, 5 = highest need)</FormLabel>
				<div className="space-y-1">
					{[
						'Senior Management Development',
						'Governance (e.g. putting board structures in place)',
						'Strategic Planning',
						'Financial Management (e.g. budgeting, accounting, MIS)',
						'Fundraising - Accessing additional capital',
						'Optimizing working capital mgt.',
						'Refine Product/Services and Proof of Concept',
						'Operations Mgt./Production Processes',
						'Sales & Marketing, Diversifying Revenue Streams',
						'Digitalization of business model (e.g. web tools, AI, etc.)',
						'Human capital management – hiring/training',
					].map((priority) => (
						<div key={priority} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
							<div className="flex-1">
								<FormLabel className="text-sm font-normal text-gray-900 leading-tight">{priority}</FormLabel>
							</div>
							<div className="flex-shrink-0">
								<FormField
									control={form.control}
									name="post_investment_priorities"
									render={() => (
										<FormItem>
											<FormControl>
												<Select
													onValueChange={(value) => {
														const score = value ? parseInt(value) : 0;
														const current = form.getValues('post_investment_priorities') || {};
														form.setValue('post_investment_priorities', { ...current, [priority]: score });
													}}
												>
													<SelectTrigger className="w-32">
														<SelectValue placeholder="Select 1-5 or N/A" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="1">1 (lowest need)</SelectItem>
														<SelectItem value="2">2</SelectItem>
														<SelectItem value="3">3</SelectItem>
														<SelectItem value="4">4</SelectItem>
														<SelectItem value="5">5 (highest need)</SelectItem>
														<SelectItem value="0">Not Applicable</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
					))}
				</div>
				{/* Other option with checkbox */}
				<div className="mt-4 space-y-2">
					<div className="flex items-center space-x-3">
						<Checkbox
							checked={form.watch('post_investment_priorities_other_enabled') === true}
							onCheckedChange={(checked) => {
								form.setValue('post_investment_priorities_other_enabled', !!checked);
								if (!checked) {
									form.setValue('post_investment_priorities_other_description', '');
									form.setValue('post_investment_priorities_other_score', 0);
								}
							}}
						/>
						<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
					</div>
					{form.watch('post_investment_priorities_other_enabled') && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
							<FormField
								control={form.control}
								name="post_investment_priorities_other_description"
								render={({ field }) => (
									<FormItem>
										<FormControl>
										<Input {...field} placeholder="Describe other priority" />
										</FormControl>
									</FormItem>
								)}
							/>
							<Select
								onValueChange={(value) => {
									const score = value ? parseInt(value) : 0;
									form.setValue('post_investment_priorities_other_score', score);
								}}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select 1-5 or N/A" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="1">1 (lowest need)</SelectItem>
									<SelectItem value="2">2</SelectItem>
									<SelectItem value="3">3</SelectItem>
									<SelectItem value="4">4</SelectItem>
									<SelectItem value="5">5 (highest need)</SelectItem>
									<SelectItem value="0">Not Applicable</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
			</FormItem>

			{/* 45. Technical assistance funding (sum to 100%) */}
			<FormItem>
				<FormLabel>45. How is your pre and post technical assistance to portfolio companies funded? (Please provide responses summing up to 100%)</FormLabel>
				<div className="space-y-1">
					{[
						'Donor',
						'Management fees',
						'Portfolio company',
						'Enterprise Support Organization (ESO) partnership and Post Investment Support Program',
						'Other',
						'N/A'
					].map((source) => (
						<div key={source} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
							<div className="flex-1">
								<FormLabel className="text-sm font-normal text-gray-900 leading-tight">{source}</FormLabel>
							</div>
							<div className="flex-shrink-0">
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
														form.setValue('technical_assistance_funding', { ...current, [source]: value ?? 0 });
													}}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
					))}
				</div>
				
				{/* Total percentage validation */}
				<div className="mt-4 p-4 bg-gray-50 rounded-lg border">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-gray-700">Total Percentage:</span>
						<span className={`text-lg font-bold ${(() => {
							const sources = form.watch('technical_assistance_funding') || {};
							const total = Object.values(sources).reduce((sum: number, value: any) => {
								if (typeof value === 'number') return sum + value;
								return sum;
							}, 0);
							return total === 100 ? 'text-green-600' : 'text-red-600';
						})()}`}>
							{(() => {
								const sources = form.watch('technical_assistance_funding') || {};
								const total = Object.values(sources).reduce((sum: number, value: any) => {
									if (typeof value === 'number') return sum + value;
									return sum;
								}, 0);
								return `${total}%`;
							})()}
						</span>
					</div>
					{(() => {
						const sources = form.watch('technical_assistance_funding') || {};
						const total = Object.values(sources).reduce((sum: number, value: any) => {
							if (typeof value === 'number') return sum + value;
							return sum;
						}, 0);
						return total !== 100 && (
							<div className="mt-2 text-sm text-red-600">
								⚠️ Total must equal exactly 100% to proceed
							</div>
						);
					})()}
				</div>
			</FormItem>

			{/* 46. Business development approach */}
			<FormField
				control={form.control}
				name="business_development_approach"
				render={() => (
					<FormItem>
						<FormLabel>46. Which of the following apply to how you provide business development support to portfolio companies?</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
											checked={
												approach === 'Other (please specify)'
													? (form.watch('business_development_approach_other_enabled') === true)
													: field.value?.includes(approach)
											}
													onCheckedChange={(checked) => {
												if (approach === 'Other (please specify)') {
													form.setValue('business_development_approach_other_enabled', !!checked);
													if (!checked) form.setValue('business_development_approach_other', '');
													return;
												}
														return checked
													? field.onChange([...(field.value || []), approach])
													: field.onChange((field.value || []).filter((value: string) => value !== approach))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{approach}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						{form.watch('business_development_approach_other_enabled') && (
						<FormField
							control={form.control}
							name="business_development_approach_other"
							render={({ field }) => (
									<FormItem className="mt-2">
									<FormControl>
											<Input {...field} placeholder="Describe other approach" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 47. Unique offerings relevance (1-5 scale) */}
			<FormItem>
				<FormLabel>47. Please rank the relevance of your unique offerings to SGBs in comparison to other capital providers. (1 = least relevant, 5 = most relevant)</FormLabel>
				<div className="space-y-1">
					{[
						'Flexible Collateral terms',
						'Competitive Pricing',
						'Flexible repayment terms',
						'Strong local partnerships',
						'Speed and Ease for Decision-Making',
						'Hands-on support and mentoring',
					].map((offering) => (
						<div key={offering} className="flex items-center justify-between space-x-4 py-1 border-b border-gray-100">
							<div className="flex-1">
								<FormLabel className="text-sm font-normal text-gray-900 leading-tight">{offering}</FormLabel>
							</div>
							<div className="flex-shrink-0">
								<FormField
									control={form.control}
									name="unique_offerings"
									render={() => (
										<FormItem>
											<FormControl>
												<Select
													onValueChange={(value) => {
														const score = value ? parseInt(value) : 0;
														const current = form.getValues('unique_offerings') || {};
														form.setValue('unique_offerings', { ...current, [offering]: score });
													}}
												>
													<SelectTrigger className="w-32">
														<SelectValue placeholder="Select 1-5 or N/A" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="1">1 (least relevant)</SelectItem>
														<SelectItem value="2">2</SelectItem>
														<SelectItem value="3">3</SelectItem>
														<SelectItem value="4">4</SelectItem>
														<SelectItem value="5">5 (most relevant)</SelectItem>
														<SelectItem value="0">Not Applicable</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
					))}
				</div>
				{/* Other option with checkbox */}
				<div className="mt-4 space-y-2">
					<div className="flex items-center space-x-3">
						<Checkbox
							checked={form.watch('unique_offerings_other_enabled') === true}
							onCheckedChange={(checked) => {
								form.setValue('unique_offerings_other_enabled', !!checked);
								if (!checked) {
									form.setValue('unique_offerings_other_description', '');
									form.setValue('unique_offerings_other_score', 0);
								}
							}}
						/>
						<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
					</div>
					{form.watch('unique_offerings_other_enabled') && (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
							<FormField
								control={form.control}
								name="unique_offerings_other_description"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input {...field} placeholder="Describe other offering" />
										</FormControl>
									</FormItem>
								)}
							/>
							<Select
								onValueChange={(value) => {
									const score = value ? parseInt(value) : 0;
									form.setValue('unique_offerings_other_score', score);
								}}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Select 1-5 or N/A" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="1">1 (least relevant)</SelectItem>
									<SelectItem value="2">2</SelectItem>
									<SelectItem value="3">3</SelectItem>
									<SelectItem value="4">4</SelectItem>
									<SelectItem value="5">5 (most relevant)</SelectItem>
									<SelectItem value="0">Not Applicable</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
			</FormItem>

			{/* 48. Typical investment timeframe */}
			<FormField
				control={form.control}
				name="typical_investment_timeframe"
				render={({ field }) => (
					<FormItem>
						<FormLabel>48. What is your typical investment timeframe?</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select typical timeframe" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="< 1 year">&lt; 1 year</SelectItem>
								<SelectItem value="1 - 3 years">1 - 3 years</SelectItem>
								<SelectItem value="4 - 5 years">4 - 5 years</SelectItem>
								<SelectItem value="6 - 7 years">6 - 7 years</SelectItem>
								<SelectItem value="8+ years">8+ years</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 49. Investment monetisation forms */}
			<FormField
				control={form.control}
				name="investment_monetisation_forms"
				render={() => (
					<FormItem>
						<FormLabel>49. What is the typical form of investment monetisation/exit?</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'Interest income/shared revenues and principal repayment',
								'Other types of self-liquidating repayment structures',
								'Dividends',
								'Strategic sale/merger of company',
								'Management buyout',
								'Financial investor take-out',
							].map((option) => (
								<FormField
									key={option}
									control={form.control}
									name="investment_monetisation_forms"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(option)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, option])
															: field.onChange(field.value?.filter((value) => value !== option))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{option}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<div className="mt-3 space-y-2">
							<div className="flex items-center space-x-3">
								<Checkbox
									checked={form.watch('investment_monetisation_other_enabled') === true}
									onCheckedChange={(checked) => {
										form.setValue('investment_monetisation_other_enabled', !!checked);
										if (!checked) form.setValue('investment_monetisation_other', '');
									}}
								/>
								<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
							</div>
							{form.watch('investment_monetisation_other_enabled') && (
						<FormField
							control={form.control}
							name="investment_monetisation_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
												<Input {...field} placeholder="Describe other monetisation form" />
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
	);

const renderSection7 = () => (
		<div className="space-y-6">

			{/* 50. Number of investments made */}
			<FormItem>
				<FormLabel>50. Please list the number of investments made to date by your current vehicle</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="equity_investments_made"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-normal">Number of equity investments:</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="number"
										placeholder="Enter number of equity investments"
										onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="debt_investments_made"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-normal">Number of debt/self-liquidating investments:</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="number"
										placeholder="Enter number of debt investments"
										onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</FormItem>

			{/* 51. Number of exits/monetisations achieved */}
			<FormItem>
				<FormLabel>51. Please list the number of exits/monetisations achieved to date in your current vehicle.</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="equity_exits_achieved"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-normal">Number of exits for equity portfolio:</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="number"
										placeholder="Enter number of equity exits"
										onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
								<FormLabel className="text-sm font-normal">Number of full repayments for debt/self-liquidating portfolio:</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="number"
										placeholder="Enter number of debt repayments"
										onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</FormItem>

			{/* 52. Number of exits/monetisations anticipated */}
			<FormItem>
				<FormLabel>52. Please list the number of exits/monetisations anticipated by your current vehicle in the next 12 months.</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="equity_exits_anticipated"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-normal">Number of exits for equity portfolio anticipated:</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="number"
										placeholder="Enter anticipated equity exits"
										onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="debt_repayments_anticipated"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-normal">Number of full repayments for debt/self-liquidating portfolio anticipated:</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="number"
										placeholder="Enter anticipated debt repayments"
										onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</FormItem>

			{/* 53. Optional supplement */}
			<FormField
				control={form.control}
				name="other_investments_supplement"
				render={({ field }) => (
					<FormItem>
						<FormLabel>53. Optional supplement to question above</FormLabel>
						<p className="text-sm text-muted-foreground mb-2">
							If no direct investments made to date from your fund vehicle, please specify if you have made any other type of investment with funds raised that relate to your intended fund (such as warehoused investments). (Please provide form of investment and number of investments):
						</p>
						<FormControl>
							<Textarea {...field} placeholder="Describe other investments..." />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 54. Portfolio performance */}
			<FormItem>
				<FormLabel>54. Please provide, across your portfolio, both the historical and expected average change in revenues and operating cash flow of your portfolio.</FormLabel>
					<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<h4 className="font-medium">Revenue Growth</h4>
						<FormField
							control={form.control}
							name="portfolio_revenue_growth_12m"
							render={({ field }) => (
								<FormItem>
										<FormLabel className="text-sm font-normal">Most recent 12 months leading up to June 30, 2024</FormLabel>
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
										<FormLabel className="text-sm font-normal">Based on current outlook, anticipated performance for next 12 months from July 1, 2024</FormLabel>
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
										<FormLabel className="text-sm font-normal">Most recent 12 months leading up to June 30, 2024</FormLabel>
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
										<FormLabel className="text-sm font-normal">Based on current outlook, anticipated performance for next 12 months from July 1, 2024</FormLabel>
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
			</FormItem>

			{/* 55. Employment impact */}
			<FormItem>
				<FormLabel>55. What is the total impact on employment/jobs associated with your portfolio? What has been the average impact since date of investments and what is the expected impact over the next 12 months on direct and indirect jobs?</FormLabel>
				<div className="space-y-6">
					{/* Direct Jobs Section */}
					<div className="space-y-2">
						<h4 className="font-medium text-sm">Direct Jobs</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="direct_jobs_current"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-normal">Net increase jobs as of June 30, 2024</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												placeholder="Enter number of direct jobs"
												onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="direct_jobs_anticipated"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-normal">Anticipated net increase jobs by June 30, 2025</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												placeholder="Enter anticipated direct jobs"
												onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{/* Indirect Jobs Section */}
					<div className="space-y-2">
						<h4 className="font-medium text-sm">Indirect Jobs</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="indirect_jobs_current"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-normal">Net increase jobs as of June 30, 2024</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												placeholder="Enter number of indirect jobs"
												onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="indirect_jobs_anticipated"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-normal">Anticipated net increase jobs by June 30, 2025</FormLabel>
										<FormControl>
											<Input
												{...field}
												type="number"
												placeholder="Enter anticipated indirect jobs"
												onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
						name="employment_impact_other_enabled"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											if (!checked) {
												// Clear other fields when unchecked
												form.setValue('employment_impact_other_description', '');
												form.setValue('employment_impact_other_current', undefined);
												form.setValue('employment_impact_other_anticipated', undefined);
											}
										}}
									/>
								</FormControl>
								<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
							</FormItem>
						)}
					/>
					{form.watch('employment_impact_other_enabled') && (
						<div className="space-y-4 pl-6 border-l-2 border-gray-200">
							<FormField
								control={form.control}
								name="employment_impact_other_description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-normal">Description</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Describe the other employment impact..." />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="space-y-2">
								<h4 className="font-medium text-sm">Other Employment Impact</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="employment_impact_other_current"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-normal">Net increase jobs as of June 30, 2024</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="number"
														placeholder="Enter number of jobs"
														onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="employment_impact_other_anticipated"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-sm font-normal">Anticipated net increase jobs by June 30, 2025</FormLabel>
												<FormControl>
													<Input
														{...field}
														type="number"
														placeholder="Enter anticipated jobs"
														onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>
					)}
			</FormItem>

			{/* 56. Fund priorities */}
			<FormItem>
				<FormLabel>56. What will be your fund's areas of priority over the next 12 months? (Please provide a response for each row: 1 = lowest need, 5 = highest need)</FormLabel>
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
						'Application of data and impact metrics',
					].map((priority) => (
			<FormField
							key={priority}
				control={form.control}
							name="fund_priorities_next_12m"
				render={({ field }) => (
					<FormItem>
									<div className="flex items-center justify-between">
										<FormLabel className="text-sm font-normal">{priority}</FormLabel>
						<FormControl>
											<Select
												value={field.value?.[priority]?.toString() || ''}
												onValueChange={(value) => {
													const current = field.value || {};
													field.onChange({
														...current,
														[priority]: value ? parseInt(value) : undefined
													});
												}}
											>
												<SelectTrigger className="w-32">
													<SelectValue placeholder="Select" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="1">1 (lowest need)</SelectItem>
													<SelectItem value="2">2</SelectItem>
													<SelectItem value="3">3</SelectItem>
													<SelectItem value="4">4</SelectItem>
													<SelectItem value="5">5 (highest need)</SelectItem>
													<SelectItem value="0">Not Applicable</SelectItem>
												</SelectContent>
											</Select>
						</FormControl>
									</div>
						<FormMessage />
					</FormItem>
				)}
			/>
					))}
			<FormField
				control={form.control}
						name="fund_priorities_other_enabled"
				render={({ field }) => (
					<FormItem className="flex flex-row items-start space-x-3 space-y-0">
						<FormControl>
							<Checkbox
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											if (!checked) {
												// Clear other fields when unchecked
												form.setValue('fund_priorities_other_description', '');
												form.setValue('fund_priorities_other_category', '');
											}
										}}
							/>
						</FormControl>
								<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
					</FormItem>
				)}
			/>
					{form.watch('fund_priorities_other_enabled') && (
						<div className="space-y-4 pl-6 border-l-2 border-gray-200">
							<FormField
								control={form.control}
								name="fund_priorities_other_description"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-normal">Description</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Describe the other priority..." />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="fund_priorities_other_category"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-sm font-normal">Priority Level</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select priority level" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="1">1 (lowest need)</SelectItem>
												<SelectItem value="2">2</SelectItem>
												<SelectItem value="3">3</SelectItem>
												<SelectItem value="4">4</SelectItem>
												<SelectItem value="5">5 (highest need)</SelectItem>
												<SelectItem value="0">Not Applicable</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					)}
				</div>
			</FormItem>


		</div>
	);

	const renderSection8 = () => (
		<div className="space-y-6">

			{/* 57. Data sharing willingness */}
			<FormField
				control={form.control}
				name="data_sharing_willingness"
				render={() => (
					<FormItem>
						<FormLabel>57. CFF is investigating the value, utility and feasibility of tracking financial and impact performance of LCPs over the long term. The desire is to provide sector level data on the performance, and therefore ability to assess risk/reward requirements for institutional and impact investors to invest in this asset class. Data would be anonymised and aggregated for purposes of dissemination.</FormLabel>
						<p className="text-sm text-muted-foreground mb-4">
							Which of the following would you be prepared to make available? [note: we are currently investigating methodologies/tools for compiling such data] (Please select as many as apply)
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							{[
								'Transaction level outputs (e.g., ticket size, instrument, sector, date, etc)',
								'Transaction level terms (e.g., pre-investment valuation/interest rate, tenor, etc)',
								'Transaction level performance (e.g., exit valuation data, IRR/return multiples, principal repayment, write-off/default, etc)',
								'Portfolio enterprise level performance (e.g., revenue growth, EBITDA growth, key financial ratios)',
								'Fund Portfolio level performance (e.g., portfolio level IRR - realised and valuation basis)',
								'Portfolio enterprise level Impact data (e.g., shared metrics on gender and climate, jobs direct, and indirect, pay scale/employee self-satisfaction, etc.)',
								'None of the above',
							].map((opt) => (
								<FormField
									key={opt}
									control={form.control}
									name="data_sharing_willingness"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(opt)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...(field.value || []), opt])
															: field.onChange((field.value || []).filter((v: string) => v !== opt))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{opt}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="data_sharing_other_enabled"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => {
												field.onChange(checked);
												if (!checked) {
													// Clear other field when unchecked
													form.setValue('data_sharing_other', '');
												}
											}}
										/>
									</FormControl>
									<FormLabel className="text-sm font-normal">Other (please specify)</FormLabel>
								</FormItem>
							)}
						/>
						{form.watch('data_sharing_other_enabled') && (
							<div className="pl-6 border-l-2 border-gray-200">
						<FormField
							control={form.control}
							name="data_sharing_other"
							render={({ field }) => (
								<FormItem>
											<FormLabel className="text-sm font-normal">Please specify</FormLabel>
									<FormControl>
												<Input {...field} placeholder="Describe other data you would be willing to share..." />
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

			{/* 58. Who sent you this survey? */}
			<FormField
				control={form.control}
				name="survey_sender"
				render={({ field }) => (
					<FormItem>
						<FormLabel>58. Who sent you this survey? Please write their name.</FormLabel>
						<FormControl>
							<Input {...field} placeholder="If you found it through CFF or LinkedIn, please write that." />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 59. Receive results checkbox */}
			<FormField
				control={form.control}
				name="receive_results"
				render={({ field }) => (
					<FormItem className="flex flex-row items-start space-x-3 space-y-0">
						<FormControl>
							<Checkbox
								checked={!!field.value}
								onCheckedChange={(checked) => field.onChange(Boolean(checked))}
							/>
						</FormControl>
						<div className="space-y-1 leading-none">
							<FormLabel>
								59. If you are interested in receiving the results of this survey, please check the box below.
							</FormLabel>
							<p className="text-sm text-muted-foreground">
								Please note that all responses will be confidential and reported only in aggregate.
							</p>
						</div>
					</FormItem>
				)}
			/>
		</div>
	);

	return (
		<SidebarLayout>
			<div className="min-h-screen bg-gray-50 pb-16">
				<div className={`max-w-6xl mx-auto ${!showIntro ? 'pr-80' : ''}` }>
				{/* Back Button hidden on intro */}
				{!showIntro && null}

				{showIntro && (
					<Card className="overflow-hidden shadow-sm border-gray-200 mb-6">
						<div className="bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-b border-blue-200 p-5">
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<h1 className="text-xl font-bold text-blue-900">2024 MSME Financing Survey</h1>
									<p className="text-sm text-blue-700">Collaborative for Frontier Finance</p>
								</div>
								<div className="flex flex-col items-end gap-2">
									<div className="flex items-center flex-wrap gap-2 text-[10px] justify-end">
										<span className="px-2 py-0.5 rounded-full bg-white/80 text-blue-700 border border-blue-200">7 sections</span>
										<span className="px-2 py-0.5 rounded-full bg-white/80 text-blue-700 border border-blue-200">15–20 min</span>
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
									<h2 className="text-base font-semibold text-blue-900">Introduction and Context</h2>
									<p className="text-sm text-blue-800">
										Micro, Small, and Medium-Sized Enterprises (MSMEs), often called "small and growing businesses" (SGBs), are vital for job creation and economic growth in Africa and the Middle East. They employ up to 70% of the workforce and generate at least 40% of GDP across economies within these regions. Yet, these businesses frequently face a financing gap: they are too large for microfinance but too small for traditional bank loans and private equity, earning them the nickname "missing middle."
									</p>
									<p className="text-sm text-blue-800 mt-3">
										The Collaborative for Frontier Finance has launched a survey to examine the SGB financing landscape in these regions. We aim to explore the role of Local Capital Providers (LCPs)—local fund managers who use innovative approaches to invest in SGBs. This survey seeks respondents that manage regulated and unregulated firms that prioritize financing or investing in small and growing businesses, including but not limited to venture capital firms, PE, small business growth funds, leasing, fintech, and factoring. Geographic focus is pan-Africa, North Africa and Middle East.
									</p>
									<p className="text-sm text-blue-800 mt-3">
										This survey will provide insights into the business models of LCPs, the current market conditions, and future trends, while also comparing these findings to our 2023 survey. The survey is comprised of seven sections:
									</p>
								</div>
								<div className="space-y-2">
									<ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
										<li>Organizational Background and Team</li>
										<li>Vehicle Construct</li>
										<li>Investment Thesis</li>
										<li>Pipeline Sourcing and Portfolio Construction</li>
										<li>Portfolio Value Creation and Exits</li>
										<li>Performance-to-Date and Current Environment/Outlook</li>
										<li>Future Research</li>
									</ol>
								</div>
								<div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-xs text-blue-900">
									<p className="mb-2">We appreciate your candor and accuracy. We estimate the survey will take approximately 20 minutes to complete.</p>
									<p className="mb-2">Note that given the innovative nature of this sector, we refer to the terms "fund" and "investment vehicle" interchangeably.</p>
									<p className="font-medium">Thank you in advance for your participation and sharing your valuable insights.</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Section Tabs - removed, now using sidebar */}

				{!showIntro && (
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
						<div className="space-y-6">
							<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
								<div className="flex items-center justify-between mb-4">
									<div>
										<h2 className="text-xl font-bold text-gray-900">
											Section {currentSection}: {getSectionTitle(currentSection)}
										</h2>
										<p className="text-sm text-gray-600 mt-1">
											Complete this section to continue with the survey
										</p>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold text-blue-600">
											{currentSection}/{totalSections}
										</div>
										{/* Autosave status */}
										<div className="text-xs">
											{saveStatus === 'saving' && (
												<span className="text-gray-500 animate-pulse">Saving...</span>
											)}
											{saveStatus === 'saved' && (
												<span className="text-green-600">✓ Saved</span>
											)}
											{saveStatus === 'error' && (
												<span className="text-red-600">Error saving</span>
											)}
											{saveStatus === 'idle' && (
												<span className="text-gray-500">sections</span>
											)}
										</div>
									</div>
								</div>
								<div className="space-y-2">
									<div className="flex justify-between text-sm text-gray-600">
										<span>Progress</span>
										<span>{Math.round((currentSection / totalSections) * 100)}%</span>
									</div>
									<div className="bg-gray-200 rounded-full h-3 overflow-hidden">
										<div 
											className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
											style={{ width: `${(currentSection / totalSections) * 100}%` }}
										></div>
									</div>
								</div>
							</div>
							<div className="space-y-6">
								{currentSection === 1 && renderSection1()}
								{currentSection === 2 && renderSection2()}
								{currentSection === 3 && renderSection3()}
								{currentSection === 4 && renderSection4()}
								{currentSection === 5 && renderSection5()}
								{currentSection === 6 && renderSection6()}
								{currentSection === 7 && renderSection7()}
								{currentSection === 8 && renderSection8()}
							</div>
						</div>

						{/* Navigation Buttons */}
						<div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
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
								
								<div className="flex items-center space-x-4">
									<Button 
										type="button"
										onClick={saveDraft} 
										disabled={saving} 
										variant="outline"
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
						</div>
					</form>
				</Form>
				)}
				</div>
				
				{/* Right Sidebar with Section Navigation */}
				{!showIntro && renderSectionSidebar()}
			</div>
		</SidebarLayout>
	);
} 
