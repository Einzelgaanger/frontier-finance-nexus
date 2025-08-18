import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...formData,
          updated_at: new Date().toISOString()
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
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...data,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
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

  return (
    <Form {...form}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">2024 MSME Financing Survey</h1>
        {renderIntroductoryBriefing()}
        
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handlePrevious}
            disabled={currentSection === 1}
            variant="outline"
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button onClick={saveDraft} disabled={saving} variant="outline">
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            
            {currentSection < totalSections ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={form.handleSubmit(handleSubmit)} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Survey'}
              </Button>
            )}
          </div>
        </div>

        <Progress value={(currentSection / totalSections) * 100} className="mb-6" />
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Section {currentSection}: {getSectionTitle(currentSection)}</h2>
          {currentSection === 1 && renderSection1()}
          {/* Other sections will be rendered here - to be implemented */}
          {currentSection > 1 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Section {currentSection} implementation coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
}
