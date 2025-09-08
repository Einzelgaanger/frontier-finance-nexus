import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useSurveyStatus } from '@/hooks/useSurveyStatus';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Building2, MapPin, Target, DollarSign, Users, TrendingUp, Shield, Heart, Leaf, Zap, Factory, GraduationCap, Wifi, ShoppingBag, Truck, Store, Star, BarChart3, PieChart, Activity, MessageSquare, Video, Phone, Globe2, Handshake, Brain, Rocket, Eye, Clock, AlertTriangle, XCircle, HelpCircle, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';

// Import the same schema from Survey2021
const survey2021Schema = z.object({
  email_address: z.string().email(),
  firm_name: z.string().min(1, "Firm name is required"),
  participant_name: z.string().min(1, "Participant name is required"),
  geographic_focus: z.array(z.string()).min(1, "Please select at least one geographic focus"),
  fund_stage: z.string().min(1, "Please select a fund stage"),
  investment_vehicle: z.array(z.string()).min(1, "Please select at least one investment vehicle"),
  target_sectors: z.array(z.string()).min(1, "Please select at least one target sector"),
  investment_lens: z.array(z.string()).min(1, "Please select at least one investment lens"),
  sdg_reporting: z.string().min(1, "Please select SDG reporting preference"),
  gender_considerations_investment: z.array(z.string()),
  gender_considerations_investment_other: z.string().optional(),
  gender_considerations_requirement: z.array(z.string()),
  gender_considerations_requirement_other: z.string().optional(),
  gender_considerations_other_enabled: z.boolean(),
  gender_fund_vehicle: z.array(z.string()),
  gender_fund_vehicle_other: z.string().optional(),
  investment_size_your_amount: z.string().min(1, "Please select investment size"),
  investment_size_total_raise: z.string().min(1, "Please select total raise amount"),
  investment_forms: z.array(z.string()).min(1, "Please select at least one investment form"),
  investment_forms_other: z.string().optional(),
  carried_interest_principals: z.string().min(1, "Please enter carried interest for principals"),
  current_ftes: z.string().min(1, "Please enter current FTEs"),
  portfolio_needs_ranking: z.record(z.string(), z.number()),
  portfolio_needs_other: z.string().optional(),
  portfolio_needs_other_enabled: z.boolean(),
  investment_monetization: z.array(z.string()).min(1, "Please select at least one monetization method"),
  investment_monetization_other: z.string().optional(),
  exits_achieved: z.string().min(1, "Please enter number of exits achieved"),
  exits_achieved_other: z.string().optional(),
  fund_capabilities_ranking: z.record(z.string(), z.number()),
  fund_capabilities_other: z.string().optional(),
  fund_capabilities_other_enabled: z.boolean(),
  covid_impact_aggregate: z.string().min(1, "Please select COVID impact"),
  covid_impact_portfolio: z.record(z.string(), z.string()),
  covid_government_support: z.array(z.string()),
  covid_government_support_other: z.string().optional(),
  raising_capital_2021: z.array(z.string()),
  raising_capital_2021_other: z.string().optional(),
  fund_vehicle_considerations: z.array(z.string()),
  fund_vehicle_considerations_other: z.string().optional(),
  network_value_rating: z.string().min(1, "Please rate network value"),
  working_groups_ranking: z.record(z.string(), z.number()),
  new_working_group_suggestions: z.string().optional(),
  webinar_content_ranking: z.record(z.string(), z.number()),
  new_webinar_suggestions: z.string().optional(),
  communication_platform: z.string().min(1, "Please select communication platform"),
  communication_platform_other: z.string().optional(),
  network_value_areas: z.record(z.string(), z.number()),
  present_connection_session: z.string().min(1, "Please select connection session preference"),
  present_connection_session_other: z.string().optional(),
  convening_initiatives_ranking: z.record(z.string(), z.number()),
  convening_initiatives_other: z.string().optional(),
  convening_initiatives_other_enabled: z.boolean(),
  participate_mentoring_program: z.string().min(1, "Please select mentoring program participation"),
  participate_mentoring_program_other: z.string().optional(),
  present_demystifying_session: z.array(z.string()),
  present_demystifying_session_other: z.string().optional(),
  present_demystifying_session_other_enabled: z.boolean(),
  additional_comments: z.string().optional(),
});

type Survey2021FormData = z.infer<typeof survey2021Schema>;

const ReadOnlySurvey2021: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getSurveyData } = useSurveyStatus();
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<Survey2021FormData | null>(null);

  const totalSections = 7;
  const progress = (currentSection / totalSections) * 100;

  const form = useForm<Survey2021FormData>({
    resolver: zodResolver(survey2021Schema),
    defaultValues: {
      email_address: '',
      firm_name: '',
      participant_name: '',
      geographic_focus: [],
      fund_stage: '',
      investment_vehicle: [],
      target_sectors: [],
      investment_lens: [],
      sdg_reporting: '',
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
      participate_mentoring_program: '',
      participate_mentoring_program_other: '',
      present_demystifying_session: [],
      present_demystifying_session_other: '',
      present_demystifying_session_other_enabled: false,
      additional_comments: '',
    },
  });

  useEffect(() => {
    if (user) {
      const data = getSurveyData('2021');
      if (data) {
        setSurveyData(data as Survey2021FormData);
        // Pre-fill the form with the data
        form.reset(data as Survey2021FormData);
        setLoading(false);
      } else {
        // Fallback fetch if hook didn't provide it
        const fetchSurvey = async () => {
          const { data: response, error } = await supabase
            .from('survey_responses_2021')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
          if (error) console.error('Error fetching 2021 survey data:', error);
          if (response) {
            setSurveyData(response as Survey2021FormData);
            form.reset(response as Survey2021FormData);
          }
          setLoading(false);
        };
        fetchSurvey();
      }
    }
  }, [user, getSurveyData, form]);

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

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Section 1: Background Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email_address">Email Address</Label>
                  <Input
                    id="email_address"
                    {...form.register("email_address")}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firm_name">Firm Name</Label>
                  <Input
                    id="firm_name"
                    {...form.register("firm_name")}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participant_name">Participant Name</Label>
                  <Input
                    id="participant_name"
                    {...form.register("participant_name")}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Geographic Focus</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Africa - East Africa', 'Africa - West Africa', 'Africa - Southern Africa', 'Africa - North Africa', 'Middle East and North Africa', 'Asia - South Asia', 'Asia - Southeast Asia', 'Global'].map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={`geographic_focus_${region}`}
                        checked={form.watch("geographic_focus").includes(region)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`geographic_focus_${region}`} className="text-sm">
                        {region}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fund_stage">Fund Stage</Label>
                <Select value={form.watch("fund_stage")} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select fund stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-fund">Pre-fund</SelectItem>
                    <SelectItem value="First-time fund">First-time fund</SelectItem>
                    <SelectItem value="Second fund">Second fund</SelectItem>
                    <SelectItem value="Third fund or later">Third fund or later</SelectItem>
                    <SelectItem value="Open-ended fund">Open-ended fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Investment Vehicle</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Equity', 'Debt', 'Grant', 'Blended finance', 'Other'].map((vehicle) => (
                    <div key={vehicle} className="flex items-center space-x-2">
                      <Checkbox
                        id={`investment_vehicle_${vehicle}`}
                        checked={form.watch("investment_vehicle").includes(vehicle)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`investment_vehicle_${vehicle}`} className="text-sm">
                        {vehicle}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Target Sectors</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Sector agnostic', 'Technology/ICT/Telecommunications', 'Agriculture/Agribusiness', 'Financial Services', 'Healthcare', 'Education', 'Energy', 'Manufacturing', 'Other'].map((sector) => (
                    <div key={sector} className="flex items-center space-x-2">
                      <Checkbox
                        id={`target_sectors_${sector}`}
                        checked={form.watch("target_sectors").includes(sector)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`target_sectors_${sector}`} className="text-sm">
                        {sector}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Investment Lens</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Gender', 'Job creation', 'Climate/Environment', 'Financial inclusion', 'Other'].map((lens) => (
                    <div key={lens} className="flex items-center space-x-2">
                      <Checkbox
                        id={`investment_lens_${lens}`}
                        checked={form.watch("investment_lens").includes(lens)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`investment_lens_${lens}`} className="text-sm">
                        {lens}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sdg_reporting">SDG Reporting</Label>
                <Select value={form.watch("sdg_reporting")} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select SDG reporting preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Planning to">Planning to</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Section 2: Gender Considerations</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Gender Considerations in Investment</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Gender lens investing', 'Gender diversity in portfolio companies', 'Gender diversity in investment team', 'Gender-focused fund', 'Other'].map((consideration) => (
                    <div key={consideration} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gender_considerations_investment_${consideration}`}
                        checked={form.watch("gender_considerations_investment").includes(consideration)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`gender_considerations_investment_${consideration}`} className="text-sm">
                        {consideration}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Gender Requirements</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Gender diversity requirements', 'Gender impact measurement', 'Other'].map((requirement) => (
                    <div key={requirement} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gender_considerations_requirement_${requirement}`}
                        checked={form.watch("gender_considerations_requirement").includes(requirement)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`gender_considerations_requirement_${requirement}`} className="text-sm">
                        {requirement}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Gender Fund Vehicle</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Gender-focused fund', 'Gender lens in existing fund', 'Other'].map((vehicle) => (
                    <div key={vehicle} className="flex items-center space-x-2">
                      <Checkbox
                        id={`gender_fund_vehicle_${vehicle}`}
                        checked={form.watch("gender_fund_vehicle").includes(vehicle)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`gender_fund_vehicle_${vehicle}`} className="text-sm">
                        {vehicle}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Section 3: Investment Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investment_size_your_amount">Investment Size (Your Amount)</Label>
                  <Select value={form.watch("investment_size_your_amount")} disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Select investment size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<$100K">&lt;$100K</SelectItem>
                      <SelectItem value="$100K - $500K">$100K - $500K</SelectItem>
                      <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                      <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
                      <SelectItem value="$5M - $10M">$5M - $10M</SelectItem>
                      <SelectItem value=">$10M">&gt;$10M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investment_size_total_raise">Total Raise Amount</Label>
                  <Select value={form.watch("investment_size_total_raise")} disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue placeholder="Select total raise amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="<$1M">&lt;$1M</SelectItem>
                      <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
                      <SelectItem value="$5M - $10M">$5M - $10M</SelectItem>
                      <SelectItem value="$10M - $50M">$10M - $50M</SelectItem>
                      <SelectItem value="$50M - $100M">$50M - $100M</SelectItem>
                      <SelectItem value=">$100M">&gt;$100M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Investment Forms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Equity', 'Debt', 'Convertible', 'Grant', 'Other'].map((form_type) => (
                    <div key={form_type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`investment_forms_${form_type}`}
                        checked={form.watch("investment_forms").includes(form_type)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`investment_forms_${form_type}`} className="text-sm">
                        {form_type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="carried_interest_principals">Carried Interest for Principals</Label>
                  <Input
                    id="carried_interest_principals"
                    {...form.register("carried_interest_principals")}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_ftes">Current FTEs</Label>
                  <Input
                    id="current_ftes"
                    {...form.register("current_ftes")}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Investment Monetization</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Equity sale', 'Debt repayment', 'Dividends', 'Other'].map((monetization) => (
                    <div key={monetization} className="flex items-center space-x-2">
                      <Checkbox
                        id={`investment_monetization_${monetization}`}
                        checked={form.watch("investment_monetization").includes(monetization)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`investment_monetization_${monetization}`} className="text-sm">
                        {monetization}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exits_achieved">Exits Achieved</Label>
                  <Input
                    id="exits_achieved"
                    {...form.register("exits_achieved")}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Section 4: COVID Impact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="covid_impact_aggregate">COVID Impact (Aggregate)</Label>
                <Select value={form.watch("covid_impact_aggregate")} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select COVID impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Very positive">Very positive</SelectItem>
                    <SelectItem value="Somewhat positive">Somewhat positive</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
                    <SelectItem value="Somewhat negative">Somewhat negative</SelectItem>
                    <SelectItem value="Very negative">Very negative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>COVID Government Support</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Government grants', 'Tax incentives', 'Loan guarantees', 'Other'].map((support) => (
                    <div key={support} className="flex items-center space-x-2">
                      <Checkbox
                        id={`covid_government_support_${support}`}
                        checked={form.watch("covid_government_support").includes(support)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`covid_government_support_${support}`} className="text-sm">
                        {support}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Raising Capital in 2021</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Yes, actively raising', 'Yes, planning to raise', 'No, not raising', 'Other'].map((raising) => (
                    <div key={raising} className="flex items-center space-x-2">
                      <Checkbox
                        id={`raising_capital_2021_${raising}`}
                        checked={form.watch("raising_capital_2021").includes(raising)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`raising_capital_2021_${raising}`} className="text-sm">
                        {raising}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe2 className="w-5 h-5" />
                <span>Section 5: Network Value</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="network_value_rating">Network Value Rating</Label>
                <Select value={form.watch("network_value_rating")} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Rate network value" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Not valuable</SelectItem>
                    <SelectItem value="2">2 - Slightly valuable</SelectItem>
                    <SelectItem value="3">3 - Moderately valuable</SelectItem>
                    <SelectItem value="4">4 - Very valuable</SelectItem>
                    <SelectItem value="5">5 - Extremely valuable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication_platform">Communication Platform</Label>
                <Select value={form.watch("communication_platform")} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select communication platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slack">Slack</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="present_connection_session">Present Connection Session</Label>
                <Select value={form.watch("present_connection_session")} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select connection session preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes, as a mentor">Yes, as a mentor</SelectItem>
                    <SelectItem value="Yes, as a mentee">Yes, as a mentee</SelectItem>
                    <SelectItem value="No, not interested">No, not interested</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participate_mentoring_program">Participate in Mentoring Program</Label>
                <Select value={form.watch("participate_mentoring_program")} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select mentoring program participation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes, as a mentor">Yes, as a mentor</SelectItem>
                    <SelectItem value="Yes, as a mentee">Yes, as a mentee</SelectItem>
                    <SelectItem value="No, not interested">No, not interested</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Present Demystifying Session</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Yes, early stage equity', 'Yes, debt financing', 'Yes, blended finance', 'No, not interested', 'Other'].map((session) => (
                    <div key={session} className="flex items-center space-x-2">
                      <Checkbox
                        id={`present_demystifying_session_${session}`}
                        checked={form.watch("present_demystifying_session").includes(session)}
                        disabled
                        className="bg-gray-50"
                      />
                      <Label htmlFor={`present_demystifying_session_${session}`} className="text-sm">
                        {session}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Section 6: Additional Comments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="additional_comments">Additional Comments</Label>
                <Textarea
                  id="additional_comments"
                  {...form.register("additional_comments")}
                  disabled
                  className="bg-gray-50 min-h-[200px]"
                  placeholder="Any additional comments or suggestions..."
                />
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>Survey Completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-green-600">
                <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold">Thank you for completing the 2021 ESCP Survey!</h3>
                <p className="text-gray-600 mt-2">
                  Your responses have been recorded and will help us better understand the landscape of early stage capital providers.
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => navigate('/survey')} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Surveys
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <div className="text-center text-gray-500">
            Section {currentSection} will be implemented next...
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your 2021 survey responses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Survey Data Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find your 2021 survey responses.</p>
            <Button onClick={() => navigate('/survey')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => navigate('/survey')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Surveys
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">2021 ESCP Survey - Read Only</h1>
          <p className="text-gray-600">
            This is a read-only view of your submitted 2021 survey responses.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section {currentSection} of {totalSections}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Section Content */}
        <div className="mb-8">
          {renderSection()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentSection === 1}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-2">
            {Array.from({ length: totalSections }, (_, i) => i + 1).map((section) => (
              <Button
                key={section}
                onClick={() => setCurrentSection(section)}
                variant={currentSection === section ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
              >
                {section}
              </Button>
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentSection === totalSections}
            variant="outline"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReadOnlySurvey2021;