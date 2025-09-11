import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

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
	regulatory_impact: z.record(z.string(), z.number()).optional(),
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
	existing_lp_sources: z.record(z.string(), z.number()).optional(),
	target_lp_sources: z.record(z.string(), z.number()).optional(),
	gp_financial_commitment: z.array(z.string()).optional(),
	gp_financial_commitment_other: z.string().optional(),
	gp_management_fee: z.string().optional(),
	gp_management_fee_other: z.string().optional(),
	hurdle_rate_currency: z.string().optional(),
	hurdle_rate_percentage: z.number().optional(),
	target_return_above_govt_debt: z.number().optional(),
	fundraising_barriers: z.record(z.string(), z.number()).optional(),

	// Section 4: Investment Thesis (Questions 33-40)
	business_stages: z.record(z.string(), z.number()).optional(),
	revenue_growth_mix: z.record(z.string(), z.number()).optional(),
	financing_needs: z.record(z.string(), z.number()).optional(),
	sector_target_allocation: z.record(z.string(), z.number()).optional(),
	investment_considerations: z.record(z.string(), z.number()).optional(),
	financial_instruments_ranking: z.record(z.string(), z.number()).optional(),
	top_sdgs: z.array(z.string()).optional(),
	additional_sdgs: z.string().optional(),
	gender_lens_investing: z.record(z.string(), z.string()).optional(),

	// Section 5: Pipeline Sourcing and Portfolio Construction (Questions 41-43)
	pipeline_sources_quality: z.record(z.string(), z.number()).optional(),
	sgb_financing_trends: z.record(z.string(), z.number()).optional(),
	typical_investment_size: z.string().optional(),

	// Section 6: Portfolio Value Creation and Exits (Questions 44-55)
	post_investment_priorities: z.record(z.string(), z.number()).optional(),
	technical_assistance_funding: z.record(z.string(), z.number()).optional(),
	business_development_approach: z.array(z.string()).optional(),
	business_development_approach_other: z.string().optional(),
	unique_offerings: z.record(z.string(), z.number()).optional(),
	typical_investment_timeframe: z.string().optional(),
	investment_monetisation_forms: z.array(z.string()).optional(),
	investment_monetisation_other: z.string().optional(),
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
	portfolio_performance_other: z.string().optional(),
	direct_jobs_current: z.number().int().optional(),
	indirect_jobs_current: z.number().int().optional(),
	direct_jobs_anticipated: z.number().int().optional(),
	indirect_jobs_anticipated: z.number().int().optional(),
	employment_impact_other: z.string().optional(),
	fund_priorities_next_12m: z.record(z.string(), z.number()).optional(),

	// Section 7: Future Research (Questions 56-59)
	data_sharing_willingness: z.array(z.string()).optional(),
	data_sharing_other: z.string().optional(),
	survey_sender: z.string().optional(),
	receive_results: z.boolean().optional(),
});

type Survey2024FormData = z.infer<typeof survey2024Schema>;

export default function Survey2024() {
	const navigate = useNavigate();
	const [currentSection, setCurrentSection] = useState(1);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const totalSections = 7;
	const { toast } = useToast();

	const form = useForm<Survey2024FormData>({
		resolver: zodResolver(survey2024Schema),
		defaultValues: {
			// Section 1: Introduction & Context
			email_address: '',
			investment_networks: [],
			investment_networks_other: '',
			organisation_name: '',
			funds_raising_investing: '',
			fund_name: '',
			
			// Section 2: Organizational Background and Team
			legal_entity_achieved: '',
			first_close_achieved: '',
			first_investment_achieved: '',
			geographic_markets: [],
			geographic_markets_other: '',
			team_based: [],
			team_based_other: '',
			fte_staff_2023_actual: undefined,
			fte_staff_current: undefined,
			fte_staff_2025_forecast: undefined,
			investment_approval: [],
			investment_approval_other: '',
			principals_total: undefined,
			principals_women: undefined,
			gender_inclusion: [],
			gender_inclusion_other: '',
			team_experience_investments: {},
			team_experience_exits: {},

			// Section 3: Vehicle Construct
			legal_domicile: [],
			legal_domicile_other: '',
			domicile_reason: [],
			domicile_reason_other: '',
			regulatory_impact: {},
			regulatory_impact_other: '',
			currency_investments: '',
			currency_lp_commitments: '',
			currency_hedging_strategy: '',
			currency_hedging_details: '',
			fund_type_status: '',
			fund_type_status_other: '',
			hard_commitments_2022: undefined,
			hard_commitments_current: undefined,
			amount_invested_2022: undefined,
			amount_invested_current: undefined,
			target_fund_size_2022: undefined,
			target_fund_size_current: undefined,
			target_number_investments: undefined,
			follow_on_permitted: '',
			concessionary_capital: [],
			concessionary_capital_other: '',
			existing_lp_sources: {},
			target_lp_sources: {},
			gp_financial_commitment: [],
			gp_financial_commitment_other: '',
			gp_management_fee: '',
			gp_management_fee_other: '',
			hurdle_rate_currency: '',
			hurdle_rate_percentage: undefined,
			target_return_above_govt_debt: undefined,
			fundraising_barriers: {},

			// Section 4: Investment Thesis
			business_stages: {},
			revenue_growth_mix: {},
			financing_needs: {},
			sector_target_allocation: {},
			investment_considerations: {},
			financial_instruments_ranking: {},
			top_sdgs: [],
			additional_sdgs: '',
			gender_lens_investing: {},

			// Section 5: Pipeline Sourcing and Portfolio Construction
			pipeline_sources_quality: {},
			sgb_financing_trends: {},
			typical_investment_size: '',

			// Section 6: Portfolio Value Creation and Exits
			post_investment_priorities: {},
			technical_assistance_funding: {},
			business_development_approach: [],
			business_development_approach_other: '',
			unique_offerings: {},
			typical_investment_timeframe: '',
			investment_monetisation_forms: [],
			investment_monetisation_other: '',
			equity_investments_made: undefined,
			debt_investments_made: undefined,
			equity_exits_achieved: undefined,
			debt_repayments_achieved: undefined,
			equity_exits_anticipated: undefined,
			debt_repayments_anticipated: undefined,
			other_investments_supplement: '',
			portfolio_revenue_growth_12m: undefined,
			portfolio_revenue_growth_next_12m: undefined,
			portfolio_cashflow_growth_12m: undefined,
			portfolio_cashflow_growth_next_12m: undefined,
			portfolio_performance_other: '',
			direct_jobs_current: undefined,
			indirect_jobs_current: undefined,
			direct_jobs_anticipated: undefined,
			indirect_jobs_anticipated: undefined,
			employment_impact_other: '',
			fund_priorities_next_12m: {},

			// Section 7: Future Research
			data_sharing_willingness: [],
			data_sharing_other: '',
			survey_sender: '',
			receive_results: false,
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

	const saveDraft = async () => {
		setSaving(true);
		try {
			const formData = form.getValues();
			const { error } = await supabase
				.from('survey_responses_2024')
				.upsert({
					...formData,
				});

			if (error) throw error;
			toast({
				title: "Draft saved successfully",
				description: "Your progress has been saved.",
			});
		} catch (error) {
			toast({
				title: "Error saving draft",
				description: "Please try again.",
				variant: "destructive",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleSubmit = async (data: Survey2024FormData) => {
		setLoading(true);
		try {
			const { error } = await supabase
				.from('survey_responses_2024')
				.upsert({
					...data,
				});

			if (error) throw error;
			toast({
				title: "Survey submitted successfully",
				description: "Thank you for completing the 2024 MSME Financing Survey.",
			});
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
			7: "Future Research"
		};
		return titles[section as keyof typeof titles] || "Unknown Section";
	};

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
						<li>Introduction & Context (Questions 1-5)</li>
						<li>Organizational Background and Team (Questions 6-14)</li>
						<li>Vehicle Construct (Questions 15-32)</li>
						<li>Investment Thesis (Questions 33-40)</li>
						<li>Pipeline Sourcing and Portfolio Construction (Questions 41-43)</li>
						<li>Portfolio Value Creation and Exits (Questions 44-55)</li>
						<li>Future Research (Questions 56-59)</li>
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
		<div className="space-y-6">
			<h3 className="text-xl font-semibold">Section 1: Introduction & Context</h3>
			
			<FormField
				control={form.control}
				name="email_address"
				render={({ field }) => (
					<FormItem>
						<FormLabel>1. Email address (note: all responses are anonymized. We have learned through the years that many respondents' answers trigger interesting follow-on discussions, which we use to improve the survey and CFF's overall understanding of the small business finance marketplace) *</FormLabel>
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
						<FormLabel>2. Please check all investment networks or associations that you are a part of. If they are not listed, please include them in the textbox. *</FormLabel>
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
						</div>
						<FormField
							control={form.control}
							name="investment_networks_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="organisation_name"
				render={({ field }) => (
					<FormItem>
						<FormLabel>3. Name of your organization *</FormLabel>
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
						<FormLabel>4. How many funds are you currently raising and/or investing? *</FormLabel>
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
						<FormLabel>5. Name of Fund to which this survey applies (that is Fund 1) *</FormLabel>
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
			<h3 className="text-xl font-semibold">Section 2: Organizational Background and Team</h3>
			
			<FormField
				control={form.control}
				name="legal_entity_achieved"
				render={({ field }) => (
					<FormItem>
						<FormLabel>6. Timeline. When did your fund/investment vehicle achieve each of the following? (Please provide a date for each of three points in your fund's evolution)</FormLabel>
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
						<FormLabel>7. In what geographic markets do you invest? (Please select as many as apply) *</FormLabel>
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
														return checked
															? field.onChange([...field.value, market])
															: field.onChange(field.value?.filter((value) => value !== market))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{market}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="geographic_markets_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="team_based"
				render={() => (
					<FormItem>
						<FormLabel>8. Where is your Team based? (Please select as many as apply) *</FormLabel>
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
													checked={field.value?.includes(location)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, location])
															: field.onChange(field.value?.filter((value) => value !== location))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{location}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="team_based_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="fte_staff_2023_actual"
				render={({ field }) => (
					<FormItem>
						<FormLabel>9. Number of Full Time Equivalent staff members (FTEs) including principals</FormLabel>
						<div className="space-y-4">
							<div>
								<FormLabel className="text-sm font-medium">December 2023 (actual)</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number" 
										placeholder="Enter number of FTEs"
										onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
									/>
								</FormControl>
							</div>
						</div>
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
								placeholder="Enter current number of FTEs"
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
								placeholder="Enter forecasted number of FTEs"
								onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="investment_approval"
				render={() => (
					<FormItem>
						<FormLabel>10. Select all that are included in your Fund's Final Investment Approval *</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'GPs', 'Internal Investment Team', 'External Investment Committee/Board'
							].map((approval) => (
								<FormField
									key={approval}
									control={form.control}
									name="investment_approval"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(approval)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, approval])
															: field.onChange(field.value?.filter((value) => value !== approval))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{approval}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="investment_approval_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="principals_total"
				render={({ field }) => (
					<FormItem>
						<FormLabel>11. Number of carried-interest/equity-interest principals currently in your Fund management team</FormLabel>
						<div className="space-y-4">
							<div>
								<FormLabel className="text-sm font-medium">Total</FormLabel>
								<FormControl>
									<Input 
										{...field} 
										type="number" 
										placeholder="Enter total number of principals"
										onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
									/>
								</FormControl>
							</div>
						</div>
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
								placeholder="Enter number of women principals"
								onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
						<FormLabel>12. Gender Inclusion. Do any of the following apply to your fund? (Please select as many as apply) *</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'Women ownership/participation interest in the fund is ≥ 50%',
								'Women representation on the board/investment committee is ≥ 50%',
								'Female staffing in fund management team is ≥ 50%',
								'Provide specific reporting on gender related indicators for your investors/funders',
								'Require specific reporting on gender related indicators by your portfolio enterprises',
								'None of the above',
								'Not Applicable'
							].map((inclusion) => (
								<FormField
									key={inclusion}
									control={form.control}
									name="gender_inclusion"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(inclusion)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, inclusion])
															: field.onChange(field.value?.filter((value) => value !== inclusion))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{inclusion}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="gender_inclusion_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<FormLabel className="text-sm font-medium">Participated as Investments Team Member</FormLabel>
									<Select onValueChange={(value) => {
										const current = form.getValues('team_experience_investments') || {};
										form.setValue('team_experience_investments', { ...current, 'investments_team_member': value });
									}}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select experience level" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="New to investment and fund management">New to investment and fund management</SelectItem>
											<SelectItem value="Investment/ financial experience in adjacent finance field">Investment/ financial experience in adjacent finance field</SelectItem>
											<SelectItem value="Relevant business management experience">Relevant business management experience</SelectItem>
											<SelectItem value="Direct investment experience. However, lacks well-documented data">Direct investment experience. However, lacks well-documented data</SelectItem>
											<SelectItem value="Direct investment experience in senior fund management position">Direct investment experience in senior fund management position</SelectItem>
											<SelectItem value="Other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<div>
									<FormLabel className="text-sm font-medium">Principal in Investments Decisions</FormLabel>
									<Select onValueChange={(value) => {
										const current = form.getValues('team_experience_investments') || {};
										form.setValue('team_experience_investments', { ...current, 'principal_investments_decisions': value });
									}}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select experience level" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="New to investment and fund management">New to investment and fund management</SelectItem>
											<SelectItem value="Investment/ financial experience in adjacent finance field">Investment/ financial experience in adjacent finance field</SelectItem>
											<SelectItem value="Relevant business management experience">Relevant business management experience</SelectItem>
											<SelectItem value="Direct investment experience. However, lacks well-documented data">Direct investment experience. However, lacks well-documented data</SelectItem>
											<SelectItem value="Direct investment experience in senior fund management position">Direct investment experience in senior fund management position</SelectItem>
											<SelectItem value="Other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="team_experience_exits"
				render={() => (
					<FormItem>
						<FormLabel>14. Team Experience. Please specify cumulative number of investment/financing transactions completed by your principal(s) prior to this current fund/vehicle? (Please provide a response for each row)</FormLabel>
						<div className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<FormLabel className="text-sm font-medium">Achieved Exits/Monetizations</FormLabel>
									<Select onValueChange={(value) => {
										const current = form.getValues('team_experience_exits') || {};
										form.setValue('team_experience_exits', { ...current, 'achieved_exits_monetizations': value });
									}}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select number of exits" />
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
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);

	const renderSection3 = () => (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold">Section 3: Vehicle Construct</h3>
			
			<FormField
				control={form.control}
				name="legal_domicile"
				render={() => (
					<FormItem>
						<FormLabel>15. Where is the legal domicile of your fund? (Please select as many as apply) *</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'Mauritius', 'Netherlands', 'Luxembourg', 'Canada', 'Delaware', 
								'Kenya', 'Senegal', 'Nigeria', 'South Africa', 'Ghana',
								'Location pending', 'Location pending – dependent on anchor LP preference'
							].map((domicile) => (
								<FormField
									key={domicile}
									control={form.control}
									name="legal_domicile"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(domicile)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, domicile])
															: field.onChange(field.value?.filter((value) => value !== domicile))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{domicile}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="legal_domicile_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="domicile_reason"
				render={() => (
					<FormItem>
						<FormLabel>16. What is the reason you chose to domicile there? (Please select as many as apply) *</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'LP Preferences', 'Tax Regime', 'Legal and Regulatory Framework', 
								'GP Residence', 'Country where investments are made'
							].map((reason) => (
								<FormField
									key={reason}
									control={form.control}
									name="domicile_reason"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(reason)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, reason])
															: field.onChange(field.value?.filter((value) => value !== reason))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{reason}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="domicile_reason_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="currency_investments"
				render={({ field }) => (
					<FormItem>
						<FormLabel>18. Currency Management. What currency do you use to make investments?</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select currency for investments" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Local Currency">Local Currency</SelectItem>
								<SelectItem value="Foreign Currency">Foreign Currency</SelectItem>
								<SelectItem value="Multiple Currencies">Multiple Currencies</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
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
						<FormLabel>What currency is your fund LP vehicle?</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select currency for LP commitments" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Local Currency">Local Currency</SelectItem>
								<SelectItem value="Foreign Currency">Foreign Currency</SelectItem>
								<SelectItem value="Multiple Currencies">Multiple Currencies</SelectItem>
								<SelectItem value="Not Applicable">Not Applicable</SelectItem>
							</SelectContent>
						</Select>
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
								<SelectItem value="Yes (please specify)">Yes (please specify)</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="currency_hedging_details"
				render={({ field }) => (
					<FormItem>
						<FormLabel>If yes, please specify your hedging strategy</FormLabel>
						<FormControl>
							<Textarea {...field} placeholder="Describe your currency hedging strategy" />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="fund_type_status"
				render={({ field }) => (
					<FormItem>
						<FormLabel>20. What is the fund type and current status of your most recent fund vehicle's operations?</FormLabel>
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
								<SelectItem value="Open ended - fundraising and heading towards equivalent of 1st close">Open ended - fundraising and heading towards equivalent of 1st close</SelectItem>
								<SelectItem value="Open ended - achieved equivalent of 1st close">Open ended - achieved equivalent of 1st close</SelectItem>
								<SelectItem value="Second fund/vehicle - fund raising">Second fund/vehicle - fund raising</SelectItem>
								<SelectItem value="Second fund/vehicle - completed first close or equivalent">Second fund/vehicle - completed first close or equivalent</SelectItem>
								<SelectItem value="Third or later fund/vehicle">Third or later fund/vehicle</SelectItem>
							</SelectContent>
						</Select>
						<FormField
							control={form.control}
							name="fund_type_status_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

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
									<SelectValue placeholder="Select follow-on permission" />
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
						<FormLabel>24. Has your fund/vehicle received concessionary capital for any of the following needs?</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'No concessionary capital', 'Finance pre-launch set up costs', 
								'Finance the fund\'s ongoing operating costs', 'Provide first loss or risk mitigation for LPs',
								'Finance business development costs', 'Technical assistance for fund manager development',
								'Warehousing Costs'
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
											<FormLabel className="text-sm font-normal">{capital}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="concessionary_capital_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="gp_management_fee"
				render={({ field }) => (
					<FormItem>
						<FormLabel>28. What is the GP Management Fee?</FormLabel>
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
							</SelectContent>
						</Select>
						<FormField
							control={form.control}
							name="gp_management_fee_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
									<SelectValue placeholder="Select hurdle rate currency" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Local currency">Local currency</SelectItem>
								<SelectItem value="USD">USD</SelectItem>
								<SelectItem value="Euro">Euro</SelectItem>
								<SelectItem value="Other">Other</SelectItem>
							</SelectContent>
						</Select>
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

			<FormField
				control={form.control}
				name="regulatory_impact"
				render={() => (
					<FormItem>
						<FormLabel>17. Please rank the level of impact that regulatory requirements have on your fund investment strategies and operations. (Please provide a response for each row: 1 = least impact, 5 = most impact)</FormLabel>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[
								'Financial regulations',
								'Environmental regulations',
								'Labor regulations',
								'Governance',
							].map((regulation) => (
								<FormField
									key={regulation}
									control={form.control}
									name="regulatory_impact"
									render={() => (
										<FormItem>
											<FormLabel className="text-sm font-medium">{regulation}</FormLabel>
											<Select
												onValueChange={(value) => {
													const score = value ? parseInt(value) : 0;
													const current = form.getValues('regulatory_impact') || {};
													form.setValue('regulatory_impact', { ...current, [regulation]: score });
												}}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select 1-5 or N/A" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="1">1 (least impact)</SelectItem>
													<SelectItem value="2">2</SelectItem>
													<SelectItem value="3">3</SelectItem>
													<SelectItem value="4">4</SelectItem>
													<SelectItem value="5">5 (most impact)</SelectItem>
													<SelectItem value="0">Not Applicable</SelectItem>
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="regulatory_impact_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormItem>
				<FormLabel>21. What are your hard commitments raised, current amount invested/outstanding portfolio and target size of your fund vehicle? (USD Equivalent)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-4">
						<FormLabel className="text-sm font-medium">Funds raised</FormLabel>
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
					<div className="space-y-4">
						<FormLabel className="text-sm font-medium">Amount invested by fund</FormLabel>
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
					<div className="space-y-4">
						<FormLabel className="text-sm font-medium">Target fund size</FormLabel>
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

			{/* 25. Existing LP capital sources (sum to 100%) */}
			<FormItem>
				<FormLabel>25. Existing sources of LP capital. Please indicate the percentage committed investment by each LP category into fund. (Please provide responses summing up to 100%)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						<FormField
							key={row}
							control={form.control}
							name="existing_lp_sources"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{row}</FormLabel>
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
					))}
				</div>
			</FormItem>

			{/* 26. Target LP capital sources (sum to 100%) */}
			<FormItem>
				<FormLabel>26. Target sources of LP capital. Please indicate the percentage targeted investment by each LP category into fund. (Please provide responses summing up to 100%)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						<FormField
							key={row}
							control={form.control}
							name="target_lp_sources"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{row}</FormLabel>
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
					))}
				</div>
			</FormItem>

			<FormField
				control={form.control}
				name="gp_financial_commitment"
				render={() => (
					<FormItem>
						<FormLabel>27. What is the GP Financial Commitment?</FormLabel>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
							{[
								'Senior debt secured',
								'Senior debt unsecured',
								'Mezzanine/ subordinated debt',
								'Convertible notes',
								'SAFEs',
								'Shared revenue/ earnings instruments',
								'Preferred equity',
								'Common equity',
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
											<FormLabel className="text-sm font-normal">{commitment}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="gp_financial_commitment_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
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
									<SelectValue placeholder="Select hurdle rate currency" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="Local currency">Local currency</SelectItem>
								<SelectItem value="USD">USD</SelectItem>
								<SelectItem value="Euro">Euro</SelectItem>
								<SelectItem value="Other">Other</SelectItem>
							</SelectContent>
						</Select>
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
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						'Governance / Risk Management',
						'Systems and Capabilities',
						'Other (please specify)'
					].map((row) => (
						<FormField
							key={row}
							control={form.control}
							name="fundraising_barriers"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{row}</FormLabel>
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
					))}
				</div>
			</FormItem>

		</div>
	);

	const renderSection4 = () => (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold">Section 4: Investment Thesis</h3>

			{/* 33. Stage of the businesses financed (sum to 100%) */}
			<FormItem>
				<FormLabel>33. Stage of the businesses that you finance / invest in. (Please provide responses summing up to 100%)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<FormField
						control={form.control}
						name="business_stages"
						render={() => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Start-up (prerevenue, concept and business plan development)</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="%"
										onChange={(e) => {
											const value = e.target.value ? parseInt(e.target.value) : undefined;
											const current = form.getValues('business_stages') || {};
											form.setValue('business_stages', { ...current, 'Start-up': value ?? 0 });
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="business_stages"
						render={() => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Early stage (early revenue, product/service development, funds needed to expand business model)</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="%"
										onChange={(e) => {
											const value = e.target.value ? parseInt(e.target.value) : undefined;
											const current = form.getValues('business_stages') || {};
											form.setValue('business_stages', { ...current, 'Early stage': value ?? 0 });
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="business_stages"
						render={() => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Growth (established business in need of funds for expansion, assets, working capital etc)</FormLabel>
								<FormControl>
									<Input
										type="number"
										placeholder="%"
										onChange={(e) => {
											const value = e.target.value ? parseInt(e.target.value) : undefined;
											const current = form.getValues('business_stages') || {};
											form.setValue('business_stages', { ...current, 'Growth': value ?? 0 });
										}}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</FormItem>

			{/* 34. Revenue growth expectations (sum to 100%) */}
			<FormItem>
				<FormLabel>34. Mix in revenue growth expectations of portfolio enterprises you finance / invest in? (Please provide responses of whole numbers summing up to 100%)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{[
						{ key: 'Livelihood Sustaining (\u003c5%)', label: 'Livelihood Sustaining (\u003c5% USD revenue growth equivalent pa)' },
						{ key: 'Growth (5-10%)', label: 'Growth (5-10% USD revenue growth equivalent pa)' },
						{ key: 'Dynamic (11-20%)', label: 'Dynamic (11-20% USD revenue growth equivalent pa)' },
						{ key: 'High-Growth (\u003e20%)', label: 'High-Growth (\u003e20% USD revenue growth equivalent pa)' },
					].map(({ key, label }) => (
						<FormField
							key={key}
							control={form.control}
							name="revenue_growth_mix"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{label}</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="%"
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
					))}
				</div>
			</FormItem>

			{/* 35. Financing needs (sum to 100%) */}
			<FormItem>
				<FormLabel>35. Describe the key financing needs of your portfolio enterprises at the time of your initial investment/funding. (Please provide responses summing up to 100%)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						'Venture launch (e.g. invest in initial staff, product/ services development and market acceptance)',
						'Inventory and working capital requirements',
						'Small-ticket tangible assets (e.g. computers, routers, mobile and connectivity systems, office equipment)',
						'Major capital investments (facilities, production equipment, fleet/ logistics, etc.)',
						'Enterprise growth capital (e.g. intangible investments such as staff build-out, expanded sales & marketing capabilities, new markets, operational and support systems, etc.)',
					].map((row) => (
						<FormField
							key={row}
							control={form.control}
							name="financing_needs"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{row}</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="%"
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
					))}
				</div>
			</FormItem>

			{/* 36. Sector target allocation */}
			<FormItem>
				<FormLabel>36. Target Investment Activities by Sector. Provide sector mix according to target outlined in investment thesis. (Enter one per line as "Sector - Percent")</FormLabel>
				<FormControl>
					<Textarea
						placeholder={"e.g.\nAgriculture - 20\nHealth - 20\nEducation - 20\nFintech - 20\nEnergy - 20"}
						onChange={(e) => {
							const lines = e.target.value.split('\n');
							const parsed: Record<string, number> = {};
							for (const line of lines) {
								const [name, pct] = line.split('-').map((s) => s.trim());
								if (name && pct) {
									const num = parseInt(pct.replace('%', ''));
									if (!isNaN(num)) parsed[name] = num;
								}
							}
							form.setValue('sector_target_allocation', parsed);
						}}
					/>
				</FormControl>
			</FormItem>

			{/* 37. Considerations when selecting investments (1-5) */}
			<FormItem>
				<FormLabel>37. Please rate the relevance of considerations when selecting investments. (1 = least relevant, 5 = most relevant)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						'Growth Potential',
						'Social Impact',
						'Market/Consumer Demand',
						'Financial Performance',
						'Exposure to Economic Fluctuations',
						'Operational Risk',
					].map((row) => (
						<FormField
							key={row}
							control={form.control}
							name="investment_considerations"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{row}</FormLabel>
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
											<SelectItem value="1">1</SelectItem>
											<SelectItem value="2">2</SelectItem>
											<SelectItem value="3">3</SelectItem>
											<SelectItem value="4">4</SelectItem>
											<SelectItem value="5">5</SelectItem>
											<SelectItem value="0">Not Applicable</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					))}
				</div>
			</FormItem>

			{/* 38. Financial instruments ranking (1-8) */}
			<FormItem>
				<FormLabel>38. Please rank the relevance of financial instruments that are applied in your target portfolio. (1 = most used, 8 = least used, N/A if not used)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
						<FormField
							key={instrument}
							control={form.control}
							name="financial_instruments_ranking"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{instrument}</FormLabel>
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
												<SelectItem key={n} value={String(n)}>{n}</SelectItem>
											))}
											<SelectItem value="0">N/A</SelectItem>
										</SelectContent>
									</Select>
								</FormItem>
							)}
						/>
					))}
				</div>
			</FormItem>

			{/* 39. Top 3 SDGs */}
			<FormItem>
				<FormLabel>39. Please list the top 3 Sustainable Development Goals that you target. (If you target more than 3, please include in the comment box below)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{[0,1,2].map((idx) => (
						<FormItem key={idx}>
							<FormLabel className="text-sm font-medium">SDG #{idx + 1}</FormLabel>
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
							<FormLabel className="text-sm font-medium">If you target more than 3 SDGs, please list them here.</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder="List any additional SDGs you target" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
									<FormLabel className="text-sm font-medium">{row}</FormLabel>
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
			<h3 className="text-xl font-semibold">Section 5: Pipeline Sourcing and Portfolio Construction</h3>

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
									<FormLabel className="text-sm font-medium">{source}</FormLabel>
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
									<FormLabel className="text-sm font-medium">{trend}</FormLabel>
									<Select
										onValueChange={(value) => {
											const score = value ? parseInt(value) : 0;
											const current = form.getValues('sgb_financing_trends') || {};
											form.setValue('sgb_financing_trends', { ...current, [trend]: score });
										}}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select -5 to +5 or N/A" />
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
											<SelectItem value="999">Not Applicable</SelectItem>
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
			<h3 className="text-xl font-semibold">Section 6: Portfolio Value Creation and Exits</h3>

			{/* 44. Post-investment priorities (1-5 scale) */}
			<FormItem>
				<FormLabel>44. In the first 12 months after closing on an investment, what are the key areas that you prioritise with regards to your portfolio enterprises? (1 = lowest need, 5 = highest need)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						'Senior Management Development',
						'Governance (e.g. putting board structures in place)',
						'Strategic Planning',
						'Financial Management (e.g. budgeting, accounting, MIS)',
						'Fundraising - Accessing additional capital',
						'Optimizing working capital mgt.',
						'Refine Product/Services',
						'Proof of Concept',
						'Operations Mgt./Production Processes',
						'Sales & Marketing, Diversifying Revenue Streams',
						'Digitalization of business model (e.g. web tools, AI, etc.)',
						'Human capital management – hiring/training',
					].map((priority) => (
						<FormField
							key={priority}
							control={form.control}
							name="post_investment_priorities"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{priority}</FormLabel>
									<Select
										onValueChange={(value) => {
											const score = value ? parseInt(value) : 0;
											const current = form.getValues('post_investment_priorities') || {};
											form.setValue('post_investment_priorities', { ...current, [priority]: score });
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
								</FormItem>
							)}
						/>
					))}
				</div>
			</FormItem>

			{/* 45. Technical assistance funding (sum to 100%) */}
			<FormItem>
				<FormLabel>45. How is your pre and post technical assistance to portfolio companies funded? (Please provide responses summing up to 100%)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						'Donor',
						'Management fees',
						'Portfolio company',
						'Enterprise Support Organization (ESO) partnership',
						'Post Investment Support Program',
						'Other',
						'N/A',
					].map((source) => (
						<FormField
							key={source}
							control={form.control}
							name="technical_assistance_funding"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{source}</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="%"
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
					))}
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
							].map((approach) => (
								<FormField
									key={approach}
									control={form.control}
									name="business_development_approach"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(approach)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, approach])
															: field.onChange(field.value?.filter((value) => value !== approach))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{approach}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="business_development_approach_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 47. Unique offerings relevance (1-5 scale) */}
			<FormItem>
				<FormLabel>47. Please rank the relevance of your unique offerings to SGBs in comparison to other capital providers. (1 = least relevant, 5 = most relevant)</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[
						'Flexible Collateral terms',
						'Competitive Pricing',
						'Flexible repayment terms',
						'Strong local partnerships',
						'Speed and Ease for Decision-Making',
						'Hands-on support and mentoring',
					].map((offering) => (
						<FormField
							key={offering}
							control={form.control}
							name="unique_offerings"
							render={() => (
								<FormItem>
									<FormLabel className="text-sm font-medium">{offering}</FormLabel>
									<Select
										onValueChange={(value) => {
											const score = value ? parseInt(value) : 0;
											const current = form.getValues('unique_offerings') || {};
											form.setValue('unique_offerings', { ...current, [offering]: score });
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
					))}
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
							].map((form) => (
								<FormField
									key={form}
									control={form.control}
									name="investment_monetisation_forms"
									render={({ field }) => (
										<FormItem className="flex flex-row items-start space-x-3 space-y-0">
											<FormControl>
												<Checkbox
													checked={field.value?.includes(form)}
													onCheckedChange={(checked) => {
														return checked
															? field.onChange([...field.value, form])
															: field.onChange(field.value?.filter((value) => value !== form))
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">{form}</FormLabel>
										</FormItem>
									)}
								/>
							))}
						</div>
						<FormField
							control={form.control}
							name="investment_monetisation_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 50. Number of investments made */}
			<FormItem>
				<FormLabel>50. Please list the number of investments made to date by your current vehicle</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="equity_investments_made"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Number of equity investments:</FormLabel>
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
								<FormLabel className="text-sm font-medium">Number of debt/self-liquidating investments:</FormLabel>
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

			{/* 51. Number of exits/repayments achieved */}
			<FormItem>
				<FormLabel>51. Please list the number of exits/monetisations achieved to date in your current vehicle</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="equity_exits_achieved"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Number of exits for equity portfolio:</FormLabel>
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
								<FormLabel className="text-sm font-medium">Number of full repayments for debt/self-liquidating portfolio:</FormLabel>
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

			{/* 52. Number of exits/repayments anticipated */}
			<FormItem>
				<FormLabel>52. Please list the number of exits/monetisations anticipated by your current vehicle in the next 12 months</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="equity_exits_anticipated"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm font-medium">Number of exits for equity portfolio anticipated:</FormLabel>
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
								<FormLabel className="text-sm font-medium">Number of full repayments for debt/self-liquidating portfolio anticipated:</FormLabel>
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

			{/* 53. Other investments supplement */}
			<FormField
				control={form.control}
				name="other_investments_supplement"
				render={({ field }) => (
					<FormItem>
						<FormLabel>53. Optional supplement to question above. If no direct investments made to date from your fund vehicle, please specify if you have made any other type of investment with funds raised that relate to your intended fund (such as warehoused investments). (Please provide form of investment and number of investments):</FormLabel>
						<FormControl>
							<Textarea {...field} placeholder="Describe form and number of investments made" />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* 54. Portfolio performance metrics */}
			<FormItem>
				<FormLabel>54. Please provide, across your portfolio, both the historical and expected average change in revenues and operating cash flow of your portfolio</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-4">
						<FormLabel className="text-sm font-medium">Revenue Growth</FormLabel>
						<FormField
							control={form.control}
							name="portfolio_revenue_growth_12m"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Most recent 12 months leading up to June 30, 2024</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="Enter % change"
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
									<FormLabel className="text-sm font-medium">Based on current outlook, anticipated performance for next 12 months from July 1, 2024</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="Enter % change"
											onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="space-y-4">
						<FormLabel className="text-sm font-medium">Operating Cash Flow Growth</FormLabel>
						<FormField
							control={form.control}
							name="portfolio_cashflow_growth_12m"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Most recent 12 months leading up to June 30, 2024</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="Enter % change"
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
									<FormLabel className="text-sm font-medium">Based on current outlook, anticipated performance for next 12 months from July 1, 2024</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="Enter % change"
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
					name="portfolio_performance_other"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} placeholder="Other (please specify)" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</FormItem>

			{/* 55. Employment impact */}
			<FormItem>
				<FormLabel>55. What is the total impact on employment/jobs associated with your portfolio? What has been the average impact since date of investments and what is the expected impact over the next 12 months on direct and indirect jobs?</FormLabel>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-4">
						<FormLabel className="text-sm font-medium">Net increase jobs as of June 30, 2024</FormLabel>
						<FormField
							control={form.control}
							name="direct_jobs_current"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Direct</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="Enter direct jobs"
											onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="indirect_jobs_current"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Indirect</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											placeholder="Enter indirect jobs"
											onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="space-y-4">
						<FormLabel className="text-sm font-medium">Anticipated net increase jobs by June 30, 2025</FormLabel>
						<FormField
							control={form.control}
							name="direct_jobs_anticipated"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Direct</FormLabel>
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
						<FormField
							control={form.control}
							name="indirect_jobs_anticipated"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm font-medium">Indirect</FormLabel>
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
				<FormField
					control={form.control}
					name="employment_impact_other"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input {...field} placeholder="Other (please specify)" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</FormItem>
		</div>
	);

	const renderSection7 = () => (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold">Section 7: Future Research</h3>

			{/* 57. Who sent you this survey? */}
			<FormField
				control={form.control}
				name="survey_sender"
				render={({ field }) => (
					<FormItem>
						<FormLabel>58. Who sent you this survey? Please write their name. If you found it through CFF or LinkedIn, please write that.</FormLabel>
						<FormControl>
							<Input {...field} placeholder="Enter name or source (e.g., CFF, LinkedIn)" />
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
								59. Yes, I would like to receive the results of this survey (responses will be confidential and only reported in aggregate).
							</FormLabel>
						</div>
					</FormItem>
				)}
			/>

			{/* 56. Data sharing willingness multi-select */}
			<FormField
				control={form.control}
				name="data_sharing_willingness"
				render={() => (
					<FormItem>
						<FormLabel>57. CFF is investigating the value, utility and feasibility of tracking financial and impact performance of LCPs over the long term. Which of the following would you be prepared to make available? (Select as many as apply)</FormLabel>
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
							name="data_sharing_other"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input {...field} placeholder="Other (please specify)" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50">
			<Form {...form}>
				<div className="container mx-auto p-4">
					{/* Back Button */}
					<div className="mb-6">
						<Button onClick={() => navigate('/survey')} variant="outline" size="sm">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Surveys
						</Button>
					</div>
					<h1 className="text-3xl font-bold mb-4">2024 MSME Financing Survey</h1>
					{renderIntroductoryBriefing()}
					
					<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
						<Card className="shadow-sm border-gray-200">
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									Section {currentSection}: {getSectionTitle(currentSection)}
								</CardTitle>
								<Progress value={(currentSection / totalSections) * 100} className="w-full" />
							</CardHeader>
							<CardContent className="p-6">
								{currentSection === 1 && renderSection1()}
								{currentSection === 2 && renderSection2()}
								{currentSection === 3 && renderSection3()}
								{currentSection === 4 && renderSection4()}
								{currentSection === 5 && renderSection5()}
								{currentSection === 6 && renderSection6()}
								{currentSection === 7 && renderSection7()}
							</CardContent>
						</Card>

						{/* Navigation Buttons */}
						<div className="flex justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={handlePrevious}
								disabled={currentSection === 1}
							>
								Previous
							</Button>
							
							<div className="flex items-center space-x-4">
								<Button 
									type="button"
									onClick={saveDraft} 
									disabled={saving} 
									variant="outline"
								>
									{saving ? 'Saving...' : 'Save Draft'}
								</Button>
								
								{currentSection < totalSections ? (
									<Button type="button" onClick={handleNext}>
										Next
									</Button>
								) : (
									<Button type="submit" disabled={loading}>
										{loading ? 'Submitting...' : 'Submit Survey'}
									</Button>
								)}
							</div>
						</div>
					</form>
				</div>
			</Form>
		</div>
	);
} 