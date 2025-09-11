import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
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
  team_based: z.array(z.string()).min(1, 'At least one team location must be selected'),
  current_ftes: z.string().min(1, 'Current FTEs is required'),
  ye2023_ftes: z.string().min(1, 'Year-end 2023 FTEs is required'),
  principals_count: z.string().min(1, 'Number of principals is required'),
  new_to_investment: z.string().min(1, 'Response required'),
  adjacent_finance_experience: z.string().min(1, 'Response required'),
  business_management_experience: z.string().min(1, 'Response required'),
  fund_investment_experience: z.string().min(1, 'Response required'),
  senior_fund_experience: z.string().min(1, 'Response required'),
  investments_experience: z.string().min(1, 'Investment experience is required'),
  exits_experience: z.string().min(1, 'Exit experience is required'),
  legal_domicile: z.string().min(1, 'Legal domicile is required'),
  currency_investments: z.string().min(1, 'Currency for investments is required'),
  currency_lp_commitments: z.string().min(1, 'Currency for LP commitments is required'),
  fund_operations: z.string().min(1, 'Fund operations status is required'),
  current_funds_raised: z.string().min(1, 'Current funds raised is required'),
  current_amount_invested: z.string().min(1, 'Current amount invested is required'),
  target_fund_size: z.string().min(1, 'Target fund size is required'),
  target_investments: z.string().min(1, 'Target number of investments is required'),
  follow_on_permitted: z.string().min(1, 'Follow-on investment permission is required'),
  target_irr: z.string().min(1, 'Target IRR is required'),
  gp_commitment: z.string().min(1, 'GP commitment form is required'),
  management_fee: z.string().min(1, 'Management fee is required'),
  carried_interest_hurdle: z.string().min(1, 'Carried interest hurdle is required'),
  average_investment_size: z.string().min(1, 'Average investment size is required'),
  investment_timeframe: z.string().min(1, 'Investment timeframe is required'),
  investments_made: z.string().min(1, 'Number of investments is required'),
  anticipated_exits: z.string().min(1, 'Anticipated exits is required'),
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
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<Survey2022FormData>({
    resolver: zodResolver(survey2022Schema),
    defaultValues: {
      name: '',
      role_title: '',
      email: '',
      organisation: '',
      legal_entity_date: '',
      first_close_date: '',
      first_investment_date: '',
      geographic_markets: [],
      team_based: [],
      current_ftes: '',
      ye2023_ftes: '',
      principals_count: '',
      new_to_investment: '',
      adjacent_finance_experience: '',
      business_management_experience: '',
      fund_investment_experience: '',
      senior_fund_experience: '',
      investments_experience: '',
      exits_experience: '',
      legal_domicile: '',
      currency_investments: '',
      currency_lp_commitments: '',
      fund_operations: '',
      current_funds_raised: '',
      current_amount_invested: '',
      target_fund_size: '',
      target_investments: '',
      follow_on_permitted: '',
      target_irr: '',
      gp_commitment: '',
      management_fee: '',
      carried_interest_hurdle: '',
      investment_stage: 'seed',
      investment_size: '0_100k',
      investment_type: 'equity',
      sector_focus: 'technology',
      geographic_focus: 'africa',
      value_add_services: 'strategic_guidance',
      average_investment_size: '0_100k',
      investment_timeframe: '2_5_years',
      investments_made: '0',
      anticipated_exits: '0',
      receive_results: false,
    }
  });

  const totalSections = 6;

  useEffect(() => {
    setProgress((currentSection / totalSections) * 100);
  }, [currentSection]);

  const saveDraft = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const formData = form.getValues();
      
      const { error } = await supabase
        .from('survey_responses_2022')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      toast({
        title: "Draft Saved",
        description: "Your survey progress has been saved.",
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

  const handleSubmit = async (data: Survey2022FormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('survey_responses_2022')
        .upsert({
          user_id: user.id,
          ...data,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      toast({
        title: "Survey Submitted",
        description: "Thank you for completing the 2022 survey!",
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

  const renderSection1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">2022 CFF Survey</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Micro, Small and Medium-Sized Enterprises (MSMEs or interchangeably, "small and growing businesses", SGBs)
          are a key engine for jobs and economic growth in the African and MENA markets, absorbing up to 70% of the
          labour market and generating 40% GDP. However, despite the role such enterprises play in their local economies,
          there appears to be a lack of capital to finance these businesses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Please provide your basic contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
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
                <FormLabel>Role or title *</FormLabel>
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
                <FormLabel>Email address *</FormLabel>
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
                <FormLabel>Name of organisation *</FormLabel>
                <FormControl>
                  <Input placeholder="Your organisation name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organizational Background and Team</CardTitle>
          <CardDescription>Information about your fund's timeline and team structure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Timeline</h3>
            <p className="text-sm text-gray-600 mb-4">
              When did your current fund/investment vehicle achieve each of the following?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="legal_entity_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Legal Entity *</FormLabel>
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
                    <FormLabel>First Close (or equivalent) *</FormLabel>
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
                    <FormLabel>First Investment *</FormLabel>
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
            <h3 className="text-lg font-semibold mb-4">Geographic Markets</h3>
            <p className="text-sm text-gray-600 mb-4">
              In what geographic markets do you operate? (select as many as applicable)
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
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Team Location</h3>
            <p className="text-sm text-gray-600 mb-4">
              Where is your Team based? (select as many as applicable)
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
                          checked={field.value?.includes(location)}
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
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Staff Numbers</h3>
            <p className="text-sm text-gray-600 mb-4">
              How many full-time equivalent staff (FTEs) do you currently have? How many do you expect to have at year-end 2023?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="current_ftes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current FTEs *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1 - 2</SelectItem>
                        <SelectItem value="3-5">3 - 5</SelectItem>
                        <SelectItem value="6-10">6 - 10</SelectItem>
                        <SelectItem value="11-20">11 - 20</SelectItem>
                        <SelectItem value="21-50">21 - 50</SelectItem>
                        <SelectItem value="over_50">&gt; 50</SelectItem>
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
                    <FormLabel>Year-end 2023 FTEs *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1 - 2</SelectItem>
                        <SelectItem value="3-5">3 - 5</SelectItem>
                        <SelectItem value="6-10">6 - 10</SelectItem>
                        <SelectItem value="11-20">11 - 20</SelectItem>
                        <SelectItem value="21-50">21 - 50</SelectItem>
                        <SelectItem value="over_50">&gt; 50</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Principals</h3>
            <p className="text-sm text-gray-600 mb-4">
              How many principals do you have?
            </p>
            
            <FormField
              control={form.control}
              name="principals_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of principals *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="over_5">&gt; 5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Prior Experience</h3>
            <p className="text-sm text-gray-600 mb-4">
              Prior to your current role, what was your experience? (Please provide a response for each row)
            </p>
            
            <div className="space-y-4">
              {[
                'New to investment',
                'Adjacent finance experience (e.g. banking, consulting, etc.)',
                'Business management experience',
                'Fund investment experience',
                'Senior fund experience'
              ].map((experience) => (
                <FormField
                  key={experience}
                  control={form.control}
                  name={`${experience.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '').replace(/[.,]/g, '')}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">{experience}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0 years</SelectItem>
                          <SelectItem value="1-2">1 - 2 years</SelectItem>
                          <SelectItem value="3-5">3 - 5 years</SelectItem>
                          <SelectItem value="6-10">6 - 10 years</SelectItem>
                          <SelectItem value="over_10">&gt; 10 years</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Team Experience</h3>
            <p className="text-sm text-gray-600 mb-4">
              How many investments has your team made? How many exits has your team made?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="investments_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment experience *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1-5">1 - 5</SelectItem>
                        <SelectItem value="6-10">6 - 10</SelectItem>
                        <SelectItem value="11-20">11 - 20</SelectItem>
                        <SelectItem value="over_20">&gt; 20</SelectItem>
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
                    <FormLabel>Exit experience *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1-5">1 - 5</SelectItem>
                        <SelectItem value="6-10">6 - 10</SelectItem>
                        <SelectItem value="11-20">11 - 20</SelectItem>
                        <SelectItem value="over_20">&gt; 20</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSection3 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle's Legal Construct</CardTitle>
          <CardDescription>Information about your fund's legal structure and operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="legal_domicile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Where is your legal domicile? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select legal domicile" />
                  </SelectTrigger>
                  <SelectContent>
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="currency_investments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What currency do you manage your investments in? *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                      <SelectItem value="local_currency">Local Currency</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
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
                  <FormLabel>What currency do you manage your LP commitments in? *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="eur">EUR</SelectItem>
                      <SelectItem value="gbp">GBP</SelectItem>
                      <SelectItem value="local_currency">Local Currency</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
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
                <FormLabel>What is the status of your fund operations? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_yet_launched">Not yet launched</SelectItem>
                    <SelectItem value="launched_not_investing">Launched but not yet investing</SelectItem>
                    <SelectItem value="actively_investing">Actively investing</SelectItem>
                    <SelectItem value="fully_invested">Fully invested</SelectItem>
                    <SelectItem value="winding_down">Winding down</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="current_funds_raised"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current funds raised to date (USD) *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0_5m">$0 - $5M</SelectItem>
                      <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                      <SelectItem value="10m_25m">$10M - $25M</SelectItem>
                      <SelectItem value="25m_50m">$25M - $50M</SelectItem>
                      <SelectItem value="50m_100m">$50M - $100M</SelectItem>
                      <SelectItem value="100m_250m">$100M - $250M</SelectItem>
                      <SelectItem value="250m_500m">$250M - $500M</SelectItem>
                      <SelectItem value="500m_1b">$500M - $1B</SelectItem>
                      <SelectItem value="1b_plus">$1B+</SelectItem>
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
                  <FormLabel>Current amount invested to date (USD) *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0_5m">$0 - $5M</SelectItem>
                      <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                      <SelectItem value="10m_25m">$10M - $25M</SelectItem>
                      <SelectItem value="25m_50m">$25M - $50M</SelectItem>
                      <SelectItem value="50m_100m">$50M - $100M</SelectItem>
                      <SelectItem value="100m_250m">$100M - $250M</SelectItem>
                      <SelectItem value="250m_500m">$250M - $500M</SelectItem>
                      <SelectItem value="500m_1b">$500M - $1B</SelectItem>
                      <SelectItem value="1b_plus">$1B+</SelectItem>
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
                  <FormLabel>Target fund size (USD) *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0_5m">$0 - $5M</SelectItem>
                      <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                      <SelectItem value="10m_25m">$10M - $25M</SelectItem>
                      <SelectItem value="25m_50m">$25M - $50M</SelectItem>
                      <SelectItem value="50m_100m">$50M - $100M</SelectItem>
                      <SelectItem value="100m_250m">$100M - $250M</SelectItem>
                      <SelectItem value="250m_500m">$250M - $500M</SelectItem>
                      <SelectItem value="500m_1b">$500M - $1B</SelectItem>
                      <SelectItem value="1b_plus">$1B+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="target_investments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target number of investments *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_5">1 - 5</SelectItem>
                      <SelectItem value="6_10">6 - 10</SelectItem>
                      <SelectItem value="11_15">11 - 15</SelectItem>
                      <SelectItem value="16_20">16 - 20</SelectItem>
                      <SelectItem value="21_30">21 - 30</SelectItem>
                      <SelectItem value="31_50">31 - 50</SelectItem>
                      <SelectItem value="50_plus">50+</SelectItem>
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
                  <FormLabel>Are follow-on investments permitted? *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="case_by_case">Case by case</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_irr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target IRR *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select IRR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15_20">15% - 20%</SelectItem>
                      <SelectItem value="20_25">20% - 25%</SelectItem>
                      <SelectItem value="25_30">25% - 30%</SelectItem>
                      <SelectItem value="30_35">30% - 35%</SelectItem>
                      <SelectItem value="35_40">35% - 40%</SelectItem>
                      <SelectItem value="40_plus">40%+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="gp_commitment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GP commitment form *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="in_kind">In-kind</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="management_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Management fee *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0_1">0% - 1%</SelectItem>
                      <SelectItem value="1_2">1% - 2%</SelectItem>
                      <SelectItem value="2_3">2% - 3%</SelectItem>
                      <SelectItem value="3_4">3% - 4%</SelectItem>
                      <SelectItem value="4_plus">4%+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carried_interest_hurdle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carried interest hurdle *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hurdle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0_5">0% - 5%</SelectItem>
                      <SelectItem value="5_8">5% - 8%</SelectItem>
                      <SelectItem value="8_10">8% - 10%</SelectItem>
                      <SelectItem value="10_12">10% - 12%</SelectItem>
                      <SelectItem value="12_15">12% - 15%</SelectItem>
                      <SelectItem value="15_plus">15%+</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSection4 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Investment Thesis</CardTitle>
          <CardDescription>Your fund's investment strategy and focus areas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="investment_stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What investment stage do you focus on? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="early_stage">Early Stage</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                    <SelectItem value="late_stage">Late Stage</SelectItem>
                    <SelectItem value="buyout">Buyout</SelectItem>
                    <SelectItem value="distressed">Distressed</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investment_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your typical investment size? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0_100k">$0 - $100K</SelectItem>
                    <SelectItem value="100k_500k">$100K - $500K</SelectItem>
                    <SelectItem value="500k_1m">$500K - $1M</SelectItem>
                    <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                    <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                    <SelectItem value="10m_25m">$10M - $25M</SelectItem>
                    <SelectItem value="25m_50m">$25M - $50M</SelectItem>
                    <SelectItem value="50m_plus">$50M+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What type of investments do you make? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="debt">Debt</SelectItem>
                    <SelectItem value="convertible_notes">Convertible Notes</SelectItem>
                    <SelectItem value="preferred_shares">Preferred Shares</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sector_focus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What sectors do you focus on? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="financial_services">Financial Services</SelectItem>
                    <SelectItem value="consumer">Consumer</SelectItem>
                    <SelectItem value="industrial">Industrial</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="real_estate">Real Estate</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="geographic_focus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your geographic focus? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select geographic focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="africa">Africa</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="north_america">North America</SelectItem>
                    <SelectItem value="asia_pacific">Asia Pacific</SelectItem>
                    <SelectItem value="latin_america">Latin America</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value_add_services"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What value-add services do you provide to portfolio companies? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strategic_guidance">Strategic Guidance</SelectItem>
                    <SelectItem value="operational_support">Operational Support</SelectItem>
                    <SelectItem value="network_access">Network Access</SelectItem>
                    <SelectItem value="recruitment">Recruitment</SelectItem>
                    <SelectItem value="financial_planning">Financial Planning</SelectItem>
                    <SelectItem value="go_to_market">Go-to-Market Strategy</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderSection5 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Sourcing and Portfolio Construction</CardTitle>
          <CardDescription>Your fund's deal flow and portfolio management approach</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormField
            control={form.control}
            name="average_investment_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your average investment size? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select average investment size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0_100k">$0 - $100K</SelectItem>
                    <SelectItem value="100k_500k">$100K - $500K</SelectItem>
                    <SelectItem value="500k_1m">$500K - $1M</SelectItem>
                    <SelectItem value="1m_5m">$1M - $5M</SelectItem>
                    <SelectItem value="5m_10m">$5M - $10M</SelectItem>
                    <SelectItem value="10m_25m">$10M - $25M</SelectItem>
                    <SelectItem value="25m_50m">$25M - $50M</SelectItem>
                    <SelectItem value="50m_plus">$50M+</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investment_timeframe"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your typical investment timeframe? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0_2_years">0 - 2 years</SelectItem>
                    <SelectItem value="2_5_years">2 - 5 years</SelectItem>
                    <SelectItem value="5_7_years">5 - 7 years</SelectItem>
                    <SelectItem value="7_10_years">7 - 10 years</SelectItem>
                    <SelectItem value="10_plus_years">10+ years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investments_made"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How many investments have you made to date? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1_5">1 - 5</SelectItem>
                    <SelectItem value="6_10">6 - 10</SelectItem>
                    <SelectItem value="11_20">11 - 20</SelectItem>
                    <SelectItem value="21_50">21 - 50</SelectItem>
                    <SelectItem value="over_50">Over 50</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="anticipated_exits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How many exits do you anticipate in the next 3 years? *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1_2">1 - 2</SelectItem>
                    <SelectItem value="3_5">3 - 5</SelectItem>
                    <SelectItem value="6_10">6 - 10</SelectItem>
                    <SelectItem value="over_10">Over 10</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderSection6 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance to Date and Current Environment/Outlook</CardTitle>
          <CardDescription>Your fund's performance metrics and future outlook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Thank you for completing the 2022 CFF Survey!</h3>
            <p className="text-gray-600 mb-4">
              This survey helps us understand the landscape of capital providers in Africa and MENA markets.
            </p>
            <p className="text-sm text-gray-500">
              Your responses will contribute to our research on MSME financing and help identify opportunities
              for collaboration and investment in the region.
            </p>
          </div>

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
                    I would like to receive the results of this survey when they are available
                  </FormLabel>
                  <p className="text-xs text-gray-500">
                    We will share aggregated insights and findings from the survey with all participants.
                  </p>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
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
      'Performance to Date and Current Environment/Outlook'
    ];
    return titles[section - 1] || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button onClick={() => navigate('/survey')} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Surveys
          </Button>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">2022 CFF Survey</h1>
              <p className="text-gray-600 mt-1">Capital for Frontier Finance - MSME Financing Survey</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={saveDraft}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress: {currentSection} of {totalSections} sections
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {getSectionTitle(currentSection)}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {currentSection === 1 && "Provide your contact information and organization details"}
                {currentSection === 2 && "Share details about your fund's timeline, team structure, and experience"}
                {currentSection === 3 && "Describe your fund's legal structure, operations, and financial metrics"}
                {currentSection === 4 && "Explain your investment strategy, focus areas, and value proposition"}
                {currentSection === 5 && "Detail your deal flow, portfolio construction, and investment approach"}
                {currentSection === 6 && "Complete the survey and opt-in for results"}
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {renderCurrentSection()}
            
            <div className="flex items-center justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-2">
                {currentSection < totalSections ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
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
};

export default Survey2022; 