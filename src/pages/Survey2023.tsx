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
import { ArrowLeft } from 'lucide-react';

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
  const navigate = useNavigate();
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
      
      <FormField
        control={form.control}
        name="legal_entity_achieved"
        render={({ field }) => (
          <FormItem>
            <FormLabel>1. When was the legal entity achieved? (MM/YYYY)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="MM/YYYY" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="first_close_achieved"
        render={({ field }) => (
          <FormItem>
            <FormLabel>2. When was the first close achieved? (MM/YYYY)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="MM/YYYY" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="first_investment_achieved"
        render={({ field }) => (
          <FormItem>
            <FormLabel>3. When was the first investment achieved? (MM/YYYY)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="MM/YYYY" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="geographic_markets"
        render={() => (
          <FormItem>
            <FormLabel>4. Which geographic markets do you focus on? *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['Africa - East Africa', 'Africa - West Africa', 'Africa - Southern Africa', 'Africa - North Africa', 'Middle East and North Africa', 'Asia - South Asia', 'Asia - Southeast Asia', 'Global'].map((market) => (
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
                              return checked
                                ? field.onChange([...field.value, market])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== market
                                    )
                                  )
                            }}
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

      <FormField
        control={form.control}
        name="team_based"
        render={() => (
          <FormItem>
            <FormLabel>5. Where is your team based? *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['Africa - East Africa', 'Africa - West Africa', 'Africa - Southern Africa', 'Africa - North Africa', 'Middle East and North Africa', 'Asia - South Asia', 'Asia - Southeast Asia', 'Global', 'Other'].map((location) => (
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

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="fte_staff_2022"
          render={({ field }) => (
            <FormItem>
              <FormLabel>6a. FTE staff in 2022</FormLabel>
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
              <FormLabel>6b. FTE staff currently</FormLabel>
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
              <FormLabel>6c. FTE staff estimated for 2024</FormLabel>
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

      <FormField
        control={form.control}
        name="principals_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>7. Number of principals</FormLabel>
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
            <FormLabel>8. Gender inclusion in your team *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['Gender diversity in investment team', 'Gender diversity in portfolio companies', 'Gender-focused fund', 'Gender lens investing', 'Other'].map((inclusion) => (
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
    </div>
  );
  }

  function renderSection3() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 3: Vehicle Construct</h3>
      
      <FormField
        control={form.control}
        name="legal_domicile"
        render={() => (
          <FormItem>
            <FormLabel>1. Legal domicile of your fund *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['Mauritius', 'Cayman Islands', 'Luxembourg', 'Netherlands', 'United Kingdom', 'United States', 'South Africa', 'Kenya', 'Nigeria', 'Other'].map((domicile) => (
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="currency_investments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>2a. Currency for investments *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="ZAR">ZAR</SelectItem>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
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
              <FormLabel>2b. Currency for LP commitments *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="ZAR">ZAR</SelectItem>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="fund_type_status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>3. Fund type/status *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select fund type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Closed-end fund">Closed-end fund</SelectItem>
                <SelectItem value="Open-ended vehicle">Open-ended vehicle</SelectItem>
                <SelectItem value="Limited liability company">Limited liability company</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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

      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="current_funds_raised"
          render={({ field }) => (
            <FormItem>
              <FormLabel>4a. Current funds raised (USD)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  placeholder="0" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="current_amount_invested"
          render={({ field }) => (
            <FormItem>
              <FormLabel>4b. Current amount invested (USD)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  placeholder="0" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_fund_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>4c. Target fund size (USD)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  placeholder="0" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="target_investments_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>5. Target number of investments</FormLabel>
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
        name="follow_on_investment_permitted"
        render={({ field }) => (
          <FormItem>
            <FormLabel>6. Are follow-on investments permitted? *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Case by case">Case by case</SelectItem>
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
            <FormLabel>7. Concessionary capital *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['Government grants', 'Tax incentives', 'Loan guarantees', 'Technical assistance', 'Other'].map((capital) => (
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="concessionary_capital_other"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Other concessionary capital (please specify)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Specify other capital" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  }

  function renderSection4() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 4: Investment Thesis</h3>
      
      <FormField
        control={form.control}
        name="sustainable_development_goals"
        render={() => (
          <FormItem>
            <FormLabel>1. Which Sustainable Development Goals (SDGs) does your fund target? *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['No Poverty', 'Zero Hunger', 'Good Health', 'Quality Education', 'Gender Equality', 'Clean Water', 'Affordable Energy', 'Decent Work', 'Industry Innovation', 'Reduced Inequalities', 'Sustainable Cities', 'Responsible Consumption', 'Climate Action', 'Life Below Water', 'Life on Land', 'Peace and Justice', 'Partnerships'].map((sdg) => (
                <FormField
                  key={sdg}
                  control={form.control}
                  name="sustainable_development_goals"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={sdg}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(sdg)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, sdg])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== sdg
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {sdg}
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

      <FormField
        control={form.control}
        name="gender_lens_investing"
        render={() => (
          <FormItem>
            <FormLabel>2. Gender lens investing approach</FormLabel>
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="gender_lens_investing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you have a gender lens investing approach?</FormLabel>
                    <Select onValueChange={(value) => field.onChange({...field.value, approach: value})}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select approach" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Planning to implement">Planning to implement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="gender_lens_investing_other"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional details on gender lens investing</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Provide additional details" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  }

  function renderSection5() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 5: Pipeline Sourcing and Portfolio Construction</h3>
      
      <FormField
        control={form.control}
        name="average_investment_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>1. Average investment size *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select size range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-50k">$0 - $50,000</SelectItem>
                <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                <SelectItem value="250k-500k">$250,000 - $500,000</SelectItem>
                <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                <SelectItem value="1m+">$1,000,000+</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="capital_raise_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>2. What percentage of capital raise do you typically provide? (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                {...field} 
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                placeholder="0" 
                min="0"
                max="100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
  }

  function renderSection6() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 6: Portfolio Value Creation and Exits</h3>
      
      <FormField
        control={form.control}
        name="business_development_support"
        render={() => (
          <FormItem>
            <FormLabel>1. What business development support do you provide? *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['Strategic guidance', 'Financial management', 'Operations support', 'Marketing assistance', 'Technology support', 'Legal support', 'Other'].map((support) => (
                <FormField
                  key={support}
                  control={form.control}
                  name="business_development_support"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={support}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(support)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, support])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== support
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {support}
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

      <FormField
        control={form.control}
        name="investment_timeframe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>2. Typical investment timeframe *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="0-1 years">0-1 years</SelectItem>
                <SelectItem value="1-3 years">1-3 years</SelectItem>
                <SelectItem value="3-5 years">3-5 years</SelectItem>
                <SelectItem value="5-7 years">5-7 years</SelectItem>
                <SelectItem value="7+ years">7+ years</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exit_form"
        render={() => (
          <FormItem>
            <FormLabel>3. Preferred exit forms *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['IPO', 'Strategic acquisition', 'Financial acquisition', 'Management buyout', 'Other'].map((exit) => (
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
    </div>
  );
  }

  function renderSection7() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 7: Performance to Date and Current Outlook</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="equity_investments_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>1a. Number of equity investments made</FormLabel>
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
          name="debt_investments_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>1b. Number of debt investments made</FormLabel>
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="equity_exits_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>2a. Number of equity exits achieved</FormLabel>
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
          name="debt_exits_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>2b. Number of debt exits achieved</FormLabel>
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

      <FormField
        control={form.control}
        name="receive_survey_results"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I would like to receive the survey results
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
  }

  function renderSection8() {
    return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Section 8: Future Research</h3>
      
      <FormField
        control={form.control}
        name="future_research_data"
        render={() => (
          <FormItem>
            <FormLabel>1. What additional data would be most valuable for future research? *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {['Impact measurement', 'Financial performance', 'Portfolio company growth', 'Market analysis', 'Regulatory insights', 'Other'].map((data) => (
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

      <FormField
        control={form.control}
        name="one_on_one_meeting"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I would be interested in a one-on-one meeting to discuss the research
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button onClick={() => navigate('/survey')} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Surveys
          </Button>
        </div>
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
    </div>
  );
} 