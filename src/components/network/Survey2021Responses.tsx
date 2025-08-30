import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Globe, Calendar, Target, DollarSign, CheckCircle, Building2, Mail, 
  TrendingUp, MapPin, Briefcase, Award, Lightbulb, Shield, Heart, Leaf,
  Zap, Factory, GraduationCap, Wifi, ShoppingBag, Truck, Store, Star,
  BarChart3, PieChart, Activity, Target as TargetIcon, Users2, BookOpen,
  MessageSquare, Video, Phone, Globe2, Handshake, Brain, Rocket, Eye,
  Clock, DollarSign as DollarSignIcon, PieChart as PieChartIcon, BarChart,
  TrendingDown, AlertTriangle, CheckCircle2, XCircle, HelpCircle
} from 'lucide-react';

interface Survey2021Data {
  id: string;
  user_id?: string;
  firm_name: string;
  participant_name: string;
  role_title: string;
  team_based: string[];
  team_based_other?: string;
  geographic_focus: string[];
  geographic_focus_other?: string;
  fund_stage: string;
  fund_stage_other?: string;
  legal_entity_date: string;
  first_close_date: string;
  first_investment_date: string;
  investments_march_2020: string;
  investments_december_2020: string;
  optional_supplement?: string;
  investment_vehicle_type: string[];
  investment_vehicle_type_other?: string;
  current_fund_size: string;
  target_fund_size: string;
  investment_timeframe: string;
  business_model_targeted: string[];
  business_model_targeted_other?: string;
  business_stage_targeted: string[];
  business_stage_targeted_other?: string;
  financing_needs: string[];
  financing_needs_other?: string;
  target_capital_sources: string[];
  target_capital_sources_other?: string;
  target_irr_achieved: string;
  target_irr_targeted: string;
  impact_vs_financial_orientation: string;
  explicit_lens_focus: string[];
  explicit_lens_focus_other?: string;
  report_sustainable_development_goals: boolean;
  top_sdg_1?: string;
  top_sdg_2?: string;
  top_sdg_3?: string;
  gender_considerations_investment: string[];
  gender_considerations_investment_other?: string;
  gender_considerations_requirement?: string[];
  gender_considerations_requirement_other?: string;
  gender_fund_vehicle?: string[];
  gender_fund_vehicle_other?: string;
  investment_size_your_amount: string;
  investment_size_total_raise: string;
  investment_forms: string[];
  investment_forms_other?: string;
  target_sectors: string[];
  target_sectors_other?: string;
  carried_interest_principals: string;
  current_ftes: string;
  portfolio_needs_ranking?: any;
  portfolio_needs_other?: string;
  investment_monetization: string[];
  investment_monetization_other?: string;
  exits_achieved: string;
  fund_capabilities_ranking?: any;
  fund_capabilities_other?: string;
  covid_impact_aggregate: string;
  covid_impact_portfolio?: any;
  covid_government_support: string[];
  covid_government_support_other?: string;
  raising_capital_2021: string[];
  raising_capital_2021_other?: string;
  fund_vehicle_considerations: string[];
  fund_vehicle_considerations_other?: string;
  network_value_rating: string;
  working_groups_ranking?: any;
  new_working_group_suggestions?: string;
  webinar_content_ranking?: any;
  new_webinar_suggestions?: string;
  communication_platform: string;
  network_value_areas?: any;
  present_connection_session: boolean;
  convening_initiatives_ranking?: any;
  convening_initiatives_other?: string;
  participate_mentoring_program: string;
  present_demystifying_session: string[];
  present_demystifying_session_other?: string;
  additional_comments?: string;
  email_address?: string;
  created_at?: string;
}

// Enhanced Section component with better styling
const Section: React.FC<{ 
  title: string; 
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode 
}> = ({ title, icon, color, children }) => (
  <Card className="shadow-lg border-0 overflow-hidden">
    <CardHeader className={`${color} text-white`}>
      <CardTitle className="flex items-center text-xl font-bold">
        {icon}
        <span className="ml-3">{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="p-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children}
      </div>
    </CardContent>
  </Card>
);

// Question mapping for 2021 survey
const questionMapping: Record<string, string> = {
  firm_name: "1. Name of firm",
  participant_name: "2. Name of participant", 
  role_title: "3. Role / title of participant",
  team_based: "4. Where is your team based?",
  geographic_focus: "5. What is the geographic focus of your fund/vehicle?",
  fund_stage: "6. What is the stage of your current fund/vehicle's operations?",
  legal_entity_date: "7. When did your current fund/investment vehicle achieve legal entity status?",
  first_close_date: "7. When did your current fund/investment vehicle achieve first close?",
  first_investment_date: "7. When did your current fund/investment vehicle achieve first investment?",
  investments_march_2020: "8. Please specify the number of investments made to date by your current vehicle",
  investments_december_2020: "8. Please specify the number of investments made to date by your current vehicle",
  optional_supplement: "9. Optional supplement to question above - if no direct investments made to date please specify",
  investment_vehicle_type: "10. Type of investment vehicle",
  current_fund_size: "11. What is the current (hard commitments raised) size of your fund / investment vehicle?",
  target_fund_size: "11. What is the target size of your fund / investment vehicle?",
  investment_timeframe: "12. Typical investment timeframe",
  business_model_targeted: "13. Type of business model targeted",
  business_stage_targeted: "14. Stage of business model targeted",
  financing_needs: "15. Key financing needs of portfolio enterprises (at time of initial investment/funding)",
  target_capital_sources: "16. Target sources of capital for your fund",
  target_irr_achieved: "17. What is your achieved Internal Rate of Return (IRR) for investors?",
  target_irr_targeted: "17. What is your target Internal Rate of Return (IRR) for investors?",
  impact_vs_financial_orientation: "18. How would you frame the impact vs financial return orientation of your capital vehicle?",
  explicit_lens_focus: "19. Does your fund/vehicle have an explicit lens/focus?",
  report_sustainable_development_goals: "20. Does your fund/investment vehicle specifically report any Sustainable Development Goals?",
  top_sdg_1: "21. If yes, please list the top 3 Sustainable Development Goals: #1",
  top_sdg_2: "21. If yes, please list the top 3 Sustainable Development Goals: #2",
  top_sdg_3: "21. If yes, please list the top 3 Sustainable Development Goals: #3",
  gender_considerations_investment: "22. Do any of the following gender considerations apply when making investment/financing considerations?",
  gender_considerations_requirement: "23. Do any of the following apply to your fund/vehicle?",
  investment_size_your_amount: "24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)?",
  investment_size_total_raise: "24. What is the typical size of total raise in your portfolio companies at the time of initial investment (in USD)?",
  investment_forms: "25. What forms of investment do you typically make?",
  target_sectors: "26. What are your target investment sectors/focus areas?",
  carried_interest_principals: "27. Number of current carried-interest/equity-interest principals",
  current_ftes: "28. Number of current Full Time Equivalent staff members (FTEs) including principals",
  portfolio_needs_ranking: "29. During the first 3 years of an investment, what are the key needs of portfolio enterprises? Please provide one ranking per row",
  investment_monetization: "30. What methods do you use to monetize your investments?",
  exits_achieved: "31. How many exits have you achieved?",
  fund_capabilities_ranking: "32. What are your fund's key capabilities? Please provide one ranking per row",
  covid_impact_aggregate: "33. What has been the overall impact of COVID-19 on your vehicle?",
  covid_impact_portfolio: "34. What has been the impact of COVID-19 on your portfolio companies?",
  covid_government_support: "35. What government support have you received during COVID-19?",
  raising_capital_2021: "36. Are you raising capital in 2021?",
  fund_vehicle_considerations: "37. What fund vehicle considerations do you have?",
  network_value_rating: "38. How would you rate the value of the ESCP network to your organization?",
  working_groups_ranking: "39. Which working groups would you prioritize? Please provide one ranking per row",
  new_working_group_suggestions: "40. What new working groups would you suggest?",
  webinar_content_ranking: "41. Which webinar content would you prioritize? Please provide one ranking per row",
  new_webinar_suggestions: "42. What new webinar topics would you suggest?",
  communication_platform: "43. What is your preferred communication platform?",
  network_value_areas: "44. In which areas do you find the network most valuable?",
  present_connection_session: "45. Would you be willing to present a connection session?",
  convening_initiatives_ranking: "46. Which convening initiatives would you prioritize? Please provide one ranking per row",
  participate_mentoring_program: "47. Would you participate in a mentoring program?",
  present_demystifying_session: "48. Would you be willing to present a demystifying session on any of the following topics?",
  additional_comments: "49. Additional comments"
};

// Enhanced Field component with better styling and icons
const Field: React.FC<{ 
  label: string; 
  value?: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  fieldKey?: string;
}> = ({ label, value, icon, color = "blue", fieldKey }) => {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    return null;
  }

  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 hover:bg-blue-100",
    green: "border-green-200 bg-green-50 hover:bg-green-100",
    purple: "border-purple-200 bg-purple-50 hover:bg-purple-100",
    orange: "border-orange-200 bg-orange-50 hover:bg-orange-100",
    red: "border-red-200 bg-red-50 hover:bg-red-100",
    indigo: "border-indigo-200 bg-indigo-50 hover:bg-indigo-100",
    yellow: "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
  };

  const questionText = fieldKey ? questionMapping[fieldKey] : label;

  return (
    <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${colorClasses[color as keyof typeof colorClasses]} group`}>
      <dt className="flex items-center text-sm font-bold text-gray-800 mb-3">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        <div>
          <div className="text-xs text-gray-500 font-normal mb-1">{questionText}</div>
          <div className="text-sm font-bold">{label}</div>
        </div>
      </dt>
      <dd className="text-base text-gray-900 font-medium">
        {Array.isArray(value) ? value.join(', ') : value}
      </dd>
    </div>
  );
};

// Enhanced FieldArray component with better styling
const FieldArray: React.FC<{ 
  label: string; 
  values?: string[];
  icon?: React.ReactNode;
  color?: string;
  fieldKey?: string;
}> = ({ label, values, icon, color = "green", fieldKey }) => {
  if (!values || values.length === 0) return null;
  
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
    red: "border-red-200 bg-red-50",
    indigo: "border-indigo-200 bg-indigo-50",
    yellow: "border-yellow-200 bg-yellow-50"
  };

  const questionText = fieldKey ? questionMapping[fieldKey] : label;

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <dt className="flex items-center text-sm font-bold text-gray-800 mb-3">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        <div>
          <div className="text-xs text-gray-500 font-normal mb-1">{questionText}</div>
          <div className="text-sm font-bold">{label}</div>
        </div>
      </dt>
      <dd className="text-base text-gray-900">
        <div className="space-y-2">
          {values.map((v, i) => (
            <div key={i} className="flex items-center p-2 bg-white rounded-lg border border-gray-200">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">{v}</span>
            </div>
          ))}
        </div>
      </dd>
    </div>
  );
};

// Enhanced FieldRecord component with better styling
const FieldRecord: React.FC<{ 
  label: string; 
  recordObj?: Record<string, string>;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, recordObj, icon, color = "purple" }) => {
  if (!recordObj || Object.keys(recordObj).length === 0) return null;
  
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
    red: "border-red-200 bg-red-50",
    indigo: "border-indigo-200 bg-indigo-50",
    yellow: "border-yellow-200 bg-yellow-50"
  };

  const entries = Object.entries(recordObj);
  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]} lg:col-span-2`}>
      <dt className="flex items-center text-sm font-bold text-gray-800 mb-3">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        {label}
      </dt>
      <dd className="text-base text-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {entries.map(([k, v]) => (
            <div key={k} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700 pr-3">{k}</span>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-semibold">
                {v}
              </Badge>
            </div>
          ))}
        </div>
      </dd>
    </div>
  );
};

// Enhanced FieldNestedRecord component with better styling
const FieldNestedRecord: React.FC<{ 
  label: string; 
  nested?: Record<string, Record<string, string>>;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, nested, icon, color = "indigo" }) => {
  if (!nested || Object.keys(nested).length === 0) return null;
  
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
    red: "border-red-200 bg-red-50",
    indigo: "border-indigo-200 bg-indigo-50",
    yellow: "border-yellow-200 bg-yellow-50"
  };

  const outer = Object.entries(nested);
  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]} lg:col-span-2`}>
      <dt className="flex items-center text-sm font-bold text-gray-800 mb-3">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        {label}
      </dt>
      <dd className="text-base text-gray-900 space-y-3">
        {outer.map(([k, inner]) => (
          <div key={k} className="border border-gray-200 rounded-lg bg-white overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold">
              {k}
            </div>
            <div className="divide-y divide-gray-100">
              {Object.entries(inner).map(([ik, iv]) => (
                <div key={ik} className="flex items-start justify-between p-3">
                  <span className="text-sm font-medium text-gray-700 pr-3">{ik}</span>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                    {iv}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </dd>
    </div>
  );
};

// Enhanced FieldBoolean component with better styling
const FieldBoolean: React.FC<{ 
  label: string; 
  value?: boolean;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, value, icon, color = "green" }) => {
  if (value === undefined || value === null) return null;
  
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    purple: "border-purple-200 bg-purple-50",
    orange: "border-orange-200 bg-orange-50",
    red: "border-red-200 bg-red-50",
    indigo: "border-indigo-200 bg-indigo-50",
    yellow: "border-yellow-200 bg-yellow-50"
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <dt className="flex items-center text-sm font-bold text-gray-800 mb-3">
        {icon && <span className="mr-2 text-gray-600">{icon}</span>}
        {label}
      </dt>
      <dd className="text-base text-gray-900">
        <Badge 
          variant="secondary" 
          className={`${
            value 
              ? 'bg-green-100 text-green-800 border-green-200' 
              : 'bg-red-100 text-red-800 border-red-200'
          } font-semibold px-3 py-1`}
        >
          {value ? (
            <span className="flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Yes
            </span>
          ) : (
            <span className="flex items-center">
              <XCircle className="w-4 h-4 mr-1" />
              No
            </span>
          )}
        </Badge>
      </dd>
    </div>
  );
};

const Survey2021Responses: React.FC<{ data: Survey2021Data; role: string }> = ({ data, role }) => {
  const isMember = role === 'member';
  const showAll = role === 'admin';

  console.log('Survey2021Responses received data:', data);
  console.log('Survey2021Responses role:', role);
  console.log('Survey2021Responses data keys:', Object.keys(data));

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <span className="font-medium">2021 Survey Responses</span>
        <span>/</span>
        <span className="text-blue-600 font-semibold">All Sections</span>
      </div>
      
      {/* Tab Navigation */}
      <Tabs defaultValue="background" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="background" 
            className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
          >
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Background</span>
          </TabsTrigger>
          
          {(showAll || isMember) && (
            <TabsTrigger 
              value="investment" 
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600"
            >
              <TargetIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Investment</span>
            </TabsTrigger>
          )}
          
          {showAll && (
            <TabsTrigger 
              value="portfolio" 
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600"
            >
              <Users2 className="w-4 h-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
          )}
          
          {showAll && (
            <TabsTrigger 
              value="development" 
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Development</span>
            </TabsTrigger>
          )}
          
          {showAll && (
            <TabsTrigger 
              value="covid" 
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">COVID-19</span>
            </TabsTrigger>
          )}
          
          {showAll && (
            <TabsTrigger 
              value="network" 
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600"
            >
              <Handshake className="w-4 h-4" />
              <span className="hidden sm:inline">Network</span>
            </TabsTrigger>
          )}
          
          {showAll && (
            <TabsTrigger 
              value="objectives" 
              className="flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-yellow-600"
            >
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Objectives</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Section 1: Background Information */}
        <TabsContent value="background" className="mt-6">
          <Section title="Background Information" icon={<Building2 className="w-6 h-6" />} color="bg-gradient-to-r from-blue-600 to-blue-700">
            <Field label="Firm Name" value={data.firm_name} icon={<Building2 className="w-4 h-4" />} color="blue" fieldKey="firm_name" />
            <Field label="Participant Name" value={data.participant_name} icon={<Users className="w-4 h-4" />} color="blue" fieldKey="participant_name" />
            <Field label="Email Address" value={data.email_address} icon={<Mail className="w-4 h-4" />} color="blue" />
            <Field label="Role / Title" value={data.role_title} icon={<Briefcase className="w-4 h-4" />} color="blue" fieldKey="role_title" />
            <FieldArray label="Team Based" values={data.team_based} icon={<Users2 className="w-4 h-4" />} color="blue" fieldKey="team_based" />
            <Field label="Team Based (Other)" value={data.team_based_other} icon={<Users className="w-4 h-4" />} color="blue" />
            <FieldArray label="Geographic Focus" values={data.geographic_focus} icon={<MapPin className="w-4 h-4" />} color="blue" fieldKey="geographic_focus" />
            <Field label="Geographic Focus (Other)" value={data.geographic_focus_other} icon={<Globe className="w-4 h-4" />} color="blue" />
            <Field label="Fund Stage" value={data.fund_stage === 'Other' ? `${data.fund_stage} - ${data.fund_stage_other || ''}` : data.fund_stage} icon={<TrendingUp className="w-4 h-4" />} color="blue" fieldKey="fund_stage" />
            <Field label="Legal Entity Date" value={data.legal_entity_date} icon={<Calendar className="w-4 h-4" />} color="blue" fieldKey="legal_entity_date" />
            <Field label="First Close Date" value={data.first_close_date} icon={<Calendar className="w-4 h-4" />} color="blue" fieldKey="first_close_date" />
            <Field label="First Investment Date" value={data.first_investment_date} icon={<Target className="w-4 h-4" />} color="blue" fieldKey="first_investment_date" />
      </Section>
        </TabsContent>

      {/* Section 2: Investment Thesis & Capital Construct */}
      {(showAll || isMember) && (
          <TabsContent value="investment" className="mt-6">
            <Section title="Investment Thesis & Capital Construct" icon={<TargetIcon className="w-6 h-6" />} color="bg-gradient-to-r from-green-600 to-green-700">
              <Field label="Investments (March 2020)" value={data.investments_march_2020} icon={<BarChart3 className="w-4 h-4" />} color="green" fieldKey="investments_march_2020" />
              <Field label="Investments (December 2020)" value={data.investments_december_2020} icon={<BarChart3 className="w-4 h-4" />} color="green" fieldKey="investments_december_2020" />
              <FieldArray label="Investment Vehicle Type" values={data.investment_vehicle_type} icon={<Briefcase className="w-4 h-4" />} color="green" fieldKey="investment_vehicle_type" />
              <Field label="Investment Vehicle Type (Other)" value={data.investment_vehicle_type_other} icon={<Briefcase className="w-4 h-4" />} color="green" />
              <Field label="Current Fund Size" value={data.current_fund_size} icon={<DollarSign className="w-4 h-4" />} color="green" fieldKey="current_fund_size" />
              <Field label="Target Fund Size" value={data.target_fund_size} icon={<DollarSign className="w-4 h-4" />} color="green" fieldKey="target_fund_size" />
              <Field label="Investment Timeframe" value={data.investment_timeframe} icon={<Clock className="w-4 h-4" />} color="green" fieldKey="investment_timeframe" />
              <FieldArray label="Business Models Targeted" values={data.business_model_targeted} icon={<Target className="w-4 h-4" />} color="green" fieldKey="business_model_targeted" />
              <Field label="Business Models Targeted (Other)" value={data.business_model_targeted_other} icon={<Target className="w-4 h-4" />} color="green" />
              <FieldArray label="Business Stage Targeted" values={data.business_stage_targeted} icon={<TrendingUp className="w-4 h-4" />} color="green" fieldKey="business_stage_targeted" />
              <Field label="Business Stage Targeted (Other)" value={data.business_stage_targeted_other} icon={<TrendingUp className="w-4 h-4" />} color="green" />
              <FieldArray label="Financing Needs" values={data.financing_needs} icon={<DollarSignIcon className="w-4 h-4" />} color="green" fieldKey="financing_needs" />
              <Field label="Financing Needs (Other)" value={data.financing_needs_other} icon={<DollarSignIcon className="w-4 h-4" />} color="green" />
              <FieldArray label="Target Capital Sources" values={data.target_capital_sources} icon={<PieChartIcon className="w-4 h-4" />} color="green" fieldKey="target_capital_sources" />
              <Field label="Target Capital Sources (Other)" value={data.target_capital_sources_other} icon={<PieChartIcon className="w-4 h-4" />} color="green" />
              <Field label="IRR Achieved" value={data.target_irr_achieved} icon={<TrendingUp className="w-4 h-4" />} color="green" fieldKey="target_irr_achieved" />
              <Field label="IRR Targeted" value={data.target_irr_targeted} icon={<Target className="w-4 h-4" />} color="green" fieldKey="target_irr_targeted" />
              <Field label="Impact vs Financial Orientation" value={data.impact_vs_financial_orientation} icon={<Heart className="w-4 h-4" />} color="green" fieldKey="impact_vs_financial_orientation" />
              <FieldArray label="Explicit Lens Focus" values={data.explicit_lens_focus} icon={<Eye className="w-4 h-4" />} color="green" fieldKey="explicit_lens_focus" />
              <Field label="Explicit Lens Focus (Other)" value={data.explicit_lens_focus_other} icon={<Eye className="w-4 h-4" />} color="green" />
              <FieldBoolean label="Reports on SDGs" value={data.report_sustainable_development_goals} icon={<Award className="w-4 h-4" />} color="green" />
              <Field label="Top SDG #1" value={data.top_sdg_1} icon={<Star className="w-4 h-4" />} color="green" fieldKey="top_sdg_1" />
              <Field label="Top SDG #2" value={data.top_sdg_2} icon={<Star className="w-4 h-4" />} color="green" fieldKey="top_sdg_2" />
              <Field label="Top SDG #3" value={data.top_sdg_3} icon={<Star className="w-4 h-4" />} color="green" fieldKey="top_sdg_3" />
              <FieldArray label="Gender Considerations in Investment" values={data.gender_considerations_investment} icon={<Heart className="w-4 h-4" />} color="green" fieldKey="gender_considerations_investment" />
              <Field label="Gender Considerations (Other)" value={data.gender_considerations_investment_other} icon={<Heart className="w-4 h-4" />} color="green" />
        </Section>
          </TabsContent>
      )}

      {/* Section 3: Portfolio Construction and Team */}
      {showAll && (
          <TabsContent value="portfolio" className="mt-6">
            <Section title="Portfolio Construction & Team" icon={<Users2 className="w-6 h-6" />} color="bg-gradient-to-r from-purple-600 to-purple-700">
              <Field label="Investment Size (Your Amount)" value={data.investment_size_your_amount} icon={<DollarSign className="w-4 h-4" />} color="purple" fieldKey="investment_size_your_amount" />
              <Field label="Investment Size (Total Raise)" value={data.investment_size_total_raise} icon={<DollarSign className="w-4 h-4" />} color="purple" fieldKey="investment_size_total_raise" />
              <FieldArray label="Investment Forms" values={data.investment_forms} icon={<Briefcase className="w-4 h-4" />} color="purple" fieldKey="investment_forms" />
              <Field label="Investment Forms (Other)" value={data.investment_forms_other} icon={<Briefcase className="w-4 h-4" />} color="purple" />
              <FieldArray label="Target Sectors" values={data.target_sectors} icon={<Target className="w-4 h-4" />} color="purple" fieldKey="target_sectors" />
              <Field label="Target Sectors (Other)" value={data.target_sectors_other} icon={<Target className="w-4 h-4" />} color="purple" />
              <Field label="Carried Interest Principals" value={data.carried_interest_principals} icon={<Users className="w-4 h-4" />} color="purple" fieldKey="carried_interest_principals" />
              <Field label="Current FTEs" value={data.current_ftes} icon={<Users className="w-4 h-4" />} color="purple" fieldKey="current_ftes" />
        </Section>
          </TabsContent>
      )}

      {/* Section 4: Portfolio Development & Investment Return Monetization */}
      {showAll && (
          <TabsContent value="development" className="mt-6">
            <Section title="Portfolio Development & Investment Return Monetization" icon={<TrendingUp className="w-6 h-6" />} color="bg-gradient-to-r from-orange-600 to-orange-700">
              <FieldRecord label="Portfolio Needs Ranking" recordObj={data.portfolio_needs_ranking} icon={<BarChart className="w-4 h-4" />} color="orange" />
              <Field label="Portfolio Needs (Other)" value={data.portfolio_needs_other} icon={<BarChart className="w-4 h-4" />} color="orange" />
              <FieldArray label="Investment Monetization Methods" values={data.investment_monetization} icon={<DollarSign className="w-4 h-4" />} color="orange" fieldKey="investment_monetization" />
              <Field label="Investment Monetization (Other)" value={data.investment_monetization_other} icon={<DollarSign className="w-4 h-4" />} color="orange" />
              <Field label="Exits Achieved" value={data.exits_achieved} icon={<CheckCircle className="w-4 h-4" />} color="orange" fieldKey="exits_achieved" />
              <FieldRecord label="Fund Capabilities Ranking" recordObj={data.fund_capabilities_ranking} icon={<Award className="w-4 h-4" />} color="orange" />
              <Field label="Fund Capabilities (Other)" value={data.fund_capabilities_other} icon={<Award className="w-4 h-4" />} color="orange" />
        </Section>
          </TabsContent>
      )}

      {/* Section 5: Impact of COVID-19 on Vehicle and Portfolio */}
      {showAll && (
          <TabsContent value="covid" className="mt-6">
            <Section title="Impact of COVID-19 on Vehicle and Portfolio" icon={<AlertTriangle className="w-6 h-6" />} color="bg-gradient-to-r from-red-600 to-red-700">
              <Field label="Overall COVID-19 Impact" value={data.covid_impact_aggregate} icon={<TrendingDown className="w-4 h-4" />} color="red" fieldKey="covid_impact_aggregate" />
              <FieldNestedRecord label="Portfolio COVID Impact (by dimension)" nested={data.covid_impact_portfolio} icon={<PieChart className="w-4 h-4" />} color="red" />
              <FieldArray label="Government Support Received" values={data.covid_government_support} icon={<Shield className="w-4 h-4" />} color="red" fieldKey="covid_government_support" />
              <Field label="Government Support (Other)" value={data.covid_government_support_other} icon={<Shield className="w-4 h-4" />} color="red" />
              <FieldArray label="Raising Capital in 2021" values={data.raising_capital_2021} icon={<DollarSign className="w-4 h-4" />} color="red" fieldKey="raising_capital_2021" />
              <Field label="Raising Capital (Other)" value={data.raising_capital_2021_other} icon={<DollarSign className="w-4 h-4" />} color="red" />
              <FieldArray label="Fund Vehicle Considerations" values={data.fund_vehicle_considerations} icon={<Briefcase className="w-4 h-4" />} color="red" fieldKey="fund_vehicle_considerations" />
              <Field label="Fund Vehicle Considerations (Other)" value={data.fund_vehicle_considerations_other} icon={<Briefcase className="w-4 h-4" />} color="red" />
        </Section>
          </TabsContent>
      )}

      {/* Section 6: Feedback on ESCP Network Membership */}
      {showAll && (
          <TabsContent value="network" className="mt-6">
            <Section title="Feedback on ESCP Network Membership" icon={<Handshake className="w-6 h-6" />} color="bg-gradient-to-r from-indigo-600 to-indigo-700">
              <Field label="Network Value Rating" value={data.network_value_rating} icon={<Star className="w-4 h-4" />} color="indigo" fieldKey="network_value_rating" />
              <FieldRecord label="Working Groups Priority" recordObj={data.working_groups_ranking} icon={<Users2 className="w-4 h-4" />} color="indigo" />
              <Field label="New Working Group Suggestions" value={data.new_working_group_suggestions} icon={<Lightbulb className="w-4 h-4" />} color="indigo" fieldKey="new_working_group_suggestions" />
              <FieldRecord label="Webinar Content Priority" recordObj={data.webinar_content_ranking} icon={<Video className="w-4 h-4" />} color="indigo" />
              <Field label="New Webinar Suggestions" value={data.new_webinar_suggestions} icon={<Lightbulb className="w-4 h-4" />} color="indigo" fieldKey="new_webinar_suggestions" />
              <Field label="Preferred Communication Platform" value={data.communication_platform} icon={<MessageSquare className="w-4 h-4" />} color="indigo" fieldKey="communication_platform" />
              <FieldRecord label="Network Value Areas" recordObj={data.network_value_areas} icon={<Globe2 className="w-4 h-4" />} color="indigo" />
              <FieldBoolean label="Willing to Present Connection Session" value={data.present_connection_session} icon={<Video className="w-4 h-4" />} color="indigo" />
              <FieldRecord label="Convening Initiatives Priority" recordObj={data.convening_initiatives_ranking} icon={<Calendar className="w-4 h-4" />} color="indigo" />
              <Field label="Convening Initiatives (Other)" value={data.convening_initiatives_other} icon={<Calendar className="w-4 h-4" />} color="indigo" />
        </Section>
          </TabsContent>
      )}

      {/* Section 7: 2021 Convening Objectives & Goals */}
      {showAll && (
          <TabsContent value="objectives" className="mt-6">
            <Section title="2021 Convening Objectives & Goals" icon={<Rocket className="w-6 h-6" />} color="bg-gradient-to-r from-yellow-600 to-yellow-700">
              <Field label="Participate in Mentoring Program" value={data.participate_mentoring_program} icon={<Users className="w-4 h-4" />} color="yellow" fieldKey="participate_mentoring_program" />
              <FieldArray label="Demystifying Session Topics" values={data.present_demystifying_session} icon={<BookOpen className="w-4 h-4" />} color="yellow" fieldKey="present_demystifying_session" />
              <Field label="Demystifying Session (Other)" value={data.present_demystifying_session_other} icon={<BookOpen className="w-4 h-4" />} color="yellow" />
              <Field label="Additional Comments" value={data.additional_comments} icon={<MessageSquare className="w-4 h-4" />} color="yellow" fieldKey="additional_comments" />
        </Section>
          </TabsContent>
      )}
      </Tabs>
    </div>
  );
};

export default Survey2021Responses;


