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
  target_local_currency_return: z.number().min(0).max(100).optional(),
  fundraising_constraints: z.record(z.string(), z.number()).optional(),
  fundraising_constraints_other: z.string().optional(),
  
  // Section 4: Investment Thesis
  business_stages: z.record(z.string(), z.number()).optional(),
  growth_expectations: z.record(z.string(), z.number()).optional(),
  financing_needs: z.record(z.string(), z.number()).optional(),
  sector_focus: z.record(z.string(), z.number()).optional(),
  sector_focus_other: z.string().optional(),
  financial_instruments: z.record(z.string(), z.number()).optional(),
  sustainable_development_goals: z.array(z.string()).min(1),
  gender_lens_investing: z.record(z.string(), z.string()).optional(),
  gender_lens_investing_other: z.string().optional(),
  
  // Section 5: Pipeline Sourcing and Portfolio Construction
  pipeline_sourcing: z.record(z.string(), z.number()).optional(),
  pipeline_sourcing_other: z.string().optional(),
  average_investment_size: z.string().min(1),
  capital_raise_percentage: z.number().min(0).max(100).optional(),
  
  // Section 6: Portfolio Value Creation and Exits
  portfolio_priorities: z.record(z.string(), z.number()).optional(),
  portfolio_priorities_other: z.string().optional(),
  technical_assistance_funding: z.record(z.string(), z.number()).optional(),
  technical_assistance_funding_other: z.string().optional(),
  business_development_support: z.array(z.string()).min(1),
  business_development_support_other: z.string().optional(),
  investment_timeframe: z.string().min(1),
  exit_form: z.array(z.string()).min(1),
  exit_form_other: z.string().optional(),
  
  // Section 7: Performance to Date and Current Outlook
  equity_investments_count: z.number().int().min(0).optional(),
  debt_investments_count: z.number().int().min(0).optional(),
  equity_exits_count: z.number().int().min(0).optional(),
  debt_exits_count: z.number().int().min(0).optional(),
  equity_exits_anticipated: z.number().int().min(0).optional(),
  debt_exits_anticipated: z.number().int().min(0).optional(),
  other_investments: z.string().optional(),
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
  fund_priorities: z.record(z.string(), z.number()).optional(),
  fund_priorities_other: z.string().optional(),
  concerns_ranking: z.record(z.string(), z.number()).optional(),
  concerns_ranking_other: z.string().optional(),
  
  // Section 8: Future Research
  future_research_data: z.array(z.string()).min(1),
  future_research_data_other: z.string().optional(),
  one_on_one_meeting: z.boolean().default(false),
  receive_survey_results: z.boolean().default(false)
});

type Survey2023FormData = z.infer<typeof survey2023Schema>;

export default function Survey2023() {
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const totalSections = 8;
  const { toast } = useToast();

  const form = useForm<Survey2023FormData>({
    resolver: zodResolver(survey2023Schema),
    defaultValues: {
      // Section 1: Introduction & Context
      email_address: '',
      organisation_name: '',
      funds_raising_investing: '',
      fund_name: '',
      
      // Section 2: Organizational Background and Team
      legal_entity_achieved: undefined,
      first_close_achieved: undefined,
      first_investment_achieved: undefined,
      geographic_markets: [],
      geographic_markets_other: undefined,
      team_based: [],
      team_based_other: undefined,
      fte_staff_2022: undefined,
      fte_staff_current: undefined,
      fte_staff_2024_est: undefined,
      principals_count: undefined,
      gender_inclusion: [],
      gender_inclusion_other: undefined,
      team_experience_investments: {},
      team_experience_exits: {},
      team_experience_other: undefined,
      
      // Section 3: Vehicle Construct
      legal_domicile: [],
      legal_domicile_other: undefined,
      currency_investments: '',
      currency_lp_commitments: '',
      fund_type_status: '',
      fund_type_status_other: undefined,
      current_funds_raised: undefined,
      current_amount_invested: undefined,
      target_fund_size: undefined,
      target_investments_count: undefined,
      follow_on_investment_permitted: '',
      concessionary_capital: [],
      concessionary_capital_other: undefined,
      lp_capital_sources_existing: {},
      lp_capital_sources_target: {},
      gp_financial_commitment: [],
      gp_financial_commitment_other: undefined,
      gp_management_fee: '',
      gp_management_fee_other: undefined,
      hurdle_rate_currency: '',
      hurdle_rate_currency_other: undefined,
      hurdle_rate_percentage: undefined,
      target_local_currency_return: undefined,
      fundraising_constraints: {},
      fundraising_constraints_other: undefined,
      
      // Section 4: Investment Thesis
      business_stages: {},
      growth_expectations: {},
      financing_needs: {},
      sector_focus: {},
      sector_focus_other: undefined,
      financial_instruments: {},
      sustainable_development_goals: [],
      gender_lens_investing: {},
      gender_lens_investing_other: undefined,
      
      // Section 5: Pipeline Sourcing and Portfolio Construction
      pipeline_sourcing: {},
      pipeline_sourcing_other: undefined,
      average_investment_size: '',
      capital_raise_percentage: undefined,
      
      // Section 6: Portfolio Value Creation and Exits
      portfolio_priorities: {},
      portfolio_priorities_other: undefined,
      technical_assistance_funding: {},
      technical_assistance_funding_other: undefined,
      business_development_support: [],
      business_development_support_other: undefined,
      investment_timeframe: '',
      exit_form: [],
      exit_form_other: undefined,
      
      // Section 7: Performance to Date and Current Outlook
      equity_investments_count: undefined,
      debt_investments_count: undefined,
      equity_exits_count: undefined,
      debt_exits_count: undefined,
      equity_exits_anticipated: undefined,
      debt_exits_anticipated: undefined,
      other_investments: undefined,
      revenue_growth_historical: undefined,
      revenue_growth_expected: undefined,
      cash_flow_growth_historical: undefined,
      cash_flow_growth_expected: undefined,
      jobs_impact_historical_direct: undefined,
      jobs_impact_historical_indirect: undefined,
      jobs_impact_historical_other: undefined,
      jobs_impact_expected_direct: undefined,
      jobs_impact_expected_indirect: undefined,
      jobs_impact_expected_other: undefined,
      fund_priorities: {},
      fund_priorities_other: undefined,
      concerns_ranking: {},
      concerns_ranking_other: undefined,
      
      // Section 8: Future Research
      future_research_data: [],
      future_research_data_other: undefined,
      one_on_one_meeting: false,
      receive_survey_results: false
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
      const { error } = await (supabase as any)
        .from('survey_responses_2023')
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

  const handleSubmit = async (data: Survey2023FormData) => {
    setLoading(true);
    try {
      const { error } = await (supabase as any)
        .from('survey_responses_2023')
        .upsert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...data,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast({
        title: "Survey submitted successfully",
        description: "Thank you for completing the 2023 MSME Financing Survey.",
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
      7: "Performance to Date and Current Outlook",
      8: "Future Research"
    };
    return titles[section as keyof typeof titles] || "";
  };

  const renderIntroductoryBriefing = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          2023 MSME Financing Survey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <div className="space-y-3">
          <p>
            <strong>Introduction & Context</strong>
          </p>
          <p>
            Micro, Small and Medium-Sized Enterprises (MSMEs or interchangeably, "small and growing businesses", (SGBs))
            are a key engine for jobs and economic growth in the African and Middle East markets, absorbing up to 70% of the
            labour market and generating 40% GDP. However, despite the role such enterprises play in their local economies,
            there appears to be a lack of capital to finance these businesses. As such, they are often referred to as the
            "missing middle" - too small for traditional commercial finance (e.g. local banks, pension funds and PE funds), and
            too big for micro-finance institutions.
          </p>
          <p>
            The Collaborative for Frontier Finance has developed this survey to assess the "state-of-play" with regards to the
            SGB financing sector in these regions. The following survey is designed to better understand the emerging class of
            Local Capital Providers (LCPs). These LCPs are heterogeneous group of indigenous fund managers that use
            alternative structures to provide capital to SGBs in their local markets.
          </p>
          <p>
            With this survey we will look to better understand the business models of these LCPs, the current environment and
            near-term outlook; and also compare to our 2022 survey. The survey is comprised of seven sections:
          </p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Organizational Background and Team</li>
            <li>Vehicle's Legal Construct</li>
            <li>Investment Thesis</li>
            <li>Pipeline Sourcing and Portfolio Construction</li>
            <li>Portfolio Value Creation and Exits</li>
            <li>Performance-to-Date and Current Environment/Outlook</li>
            <li>Future Research</li>
          </ol>
          <p>
            We appreciate your candor and accuracy. All responses are confidential and results are anonymized. Our request
            for respondent information allows us to follow up with specific questions and further advance CFF's Learning Lab
            agenda and materials including case studies, as well as developing thematic specific mini-surveys targeted to a
            handful of similar organizations. We estimate the survey will take approximately 30 minutes to complete.
          </p>
          <p>
            Note that given the innovative nature of this sector, we refer to the terms "fund" and "investment vehicle"
            interchangeably.
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
            <FormLabel>1. Email address *</FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="Enter your email address" />
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
            <FormLabel>3. How many funds are you currently raising and/or investing? *</FormLabel>
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
            <FormLabel>4. Name of Fund to which this survey applies (that is Fund 1) *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter fund name" />
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
      <h3 className="text-xl font-semibold">Section 2: Organizational Background and Team</h3>
        <p className="text-sm text-gray-600">(Temporarily simplified)</p>
    </div>
  );
  }

  function renderSection3() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 3: Vehicle Construct</h3>
        <p className="text-sm text-gray-600">(Temporarily simplified)</p>
    </div>
  );
  }

  function renderSection4() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 4: Investment Thesis</h3>
        <p className="text-sm text-gray-600">(Temporarily simplified)</p>
    </div>
  );
  }

  function renderSection5() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 5: Pipeline Sourcing and Portfolio Construction</h3>
        <p className="text-sm text-gray-600">(Temporarily simplified)</p>
    </div>
  );
  }

  function renderSection6() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 6: Portfolio Value Creation and Exits</h3>
        <p className="text-sm text-gray-600">(Temporarily simplified)</p>
    </div>
  );
  }

  function renderSection7() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 7: Performance to Date and Current Outlook</h3>
        <p className="text-sm text-gray-600">(Temporarily simplified)</p>
    </div>
  );
  }

  function renderSection8() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 8: Future Research</h3>
        <p className="text-sm text-gray-600">(Temporarily simplified)</p>
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
    <div className="max-w-4xl mx-auto p-6">
      {renderIntroductoryBriefing()}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card className="shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {getSectionTitle(currentSection)}
              </CardTitle>
              <Progress value={(currentSection / totalSections) * 100} className="w-full" />
            </CardHeader>
            <CardContent className="p-6">
              {renderCurrentSection()}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 1}
            >
              Previous
            </Button>
            
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={saveDraft}
                disabled={saving}
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
      </Form>
    </div>
  );
} 