// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Globe, 
  Building2, 
  Target, 
  Users, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Phone,
  Briefcase,
  TrendingUp,
  DollarSign,
  FileText,
  Award,
  Star,
  Shield,
  BarChart3,
  ArrowLeft
} from 'lucide-react';

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
  year?: number;
  firm_name?: string;
  vehicle_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  linkedin?: string;
  team_based?: string[];
  geographic_focus?: string[];
  fund_stage?: string;
  investment_timeframe?: string;
  target_sectors?: string[];
  vehicle_websites?: string;
  vehicle_type?: string;
  thesis?: string;
  team_size_max?: number;
  legal_domicile?: string;
  ticket_size_min?: string;
  ticket_size_max?: string;
  target_capital?: string;
  sectors_allocation?: string[];
  website?: string;
  primary_investment_region?: string;
  fund_type?: string;
  year_founded?: number;
  team_size?: number;
  typical_check_size?: string;
  completed_at?: string;
  aum?: string;
  investment_thesis?: string;
  sector_focus?: string[];
  stage_focus?: string[];
  role_badge?: string;
  has_survey?: boolean;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  // Comprehensive survey data
  survey2021?: Record<string, unknown>;
  survey2022?: Record<string, unknown>;
  survey2023?: Record<string, unknown>;
  survey2024?: Record<string, unknown>;
}

interface FundManagerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  fund_name?: string;
  firm_name?: string;
  vehicle_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  phone?: string;
  linkedin?: string;
  team_based?: string[];
  geographic_focus?: string[];
  fund_stage?: string;
  investment_timeframe?: string;
  target_sectors?: string[];
  vehicle_websites?: string;
  vehicle_type?: string;
  thesis?: string;
  team_size_max?: number;
  legal_domicile?: string;
  ticket_size_min?: string;
  ticket_size_max?: string;
  target_capital?: string;
  sectors_allocation?: string[];
  website?: string;
  primary_investment_region?: string;
  fund_type?: string;
  year_founded?: number;
  team_size?: number;
  typical_check_size?: string;
  completed_at?: string;
  aum?: string;
  investment_thesis?: string;
  sector_focus?: string[];
  stage_focus?: string[];
  role_badge?: string;
  has_survey?: boolean;
  profile_picture_url?: string;
}

const FundManagerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const { toast } = useToast();
  
  const [fundManager, setFundManager] = useState<FundManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [surveyStatus, setSurveyStatus] = useState<{[key: string]: boolean}>({});
  const [surveys, setSurveys] = useState<Array<{ year: number; data: any }>>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, { viewer: boolean; member: boolean; admin: boolean }>>({});


  const fetchFundManagerData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching fund manager data for user:', id);

      // Fetch from user_profiles table (same as network page)
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
        return;
      }

      // Process the data
      const processedProfile: FundManagerProfile = {
        id: profileData.id,
        user_id: profileData.id,
        fund_name: profileData.company_name || 'Unnamed Fund',
        firm_name: profileData.company_name,
        participant_name: profileData.company_name,
        role_title: 'Fund Manager',
        email_address: profileData.email,
        phone: profileData.phone || '',
        website: profileData.website || '',
        linkedin: '',
        first_name: profileData.company_name?.split(' ')[0] || '',
        last_name: profileData.company_name?.split(' ').slice(1).join(' ') || '',
        email: profileData.email || '',
        profile_picture_url: profileData.profile_photo_url || '',
        description: profileData.description || ''
      };

        setFundManager(processedProfile as FundManager);
      } catch (error) {
        console.error('Error fetching fund manager data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch fund manager data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, [id, toast]);

    const checkSurveyStatus = async () => {
      const years = ['2021', '2022', '2023', '2024'];
      const status: {[key: string]: boolean} = {};
      for (const year of years) {
        try {
          const { data } = await supabase
            .from(`survey_responses_${year}` as any)
            .select('id')
            .eq('user_id', id)
            .eq('submission_status', 'completed')
            .maybeSingle();
          status[year] = Boolean(data);
        } catch (error) {
          status[year] = false;
        }
      }
      setSurveyStatus(status);
    };

    const fetchFieldVisibility = async () => {
      try {
        const { data, error } = await supabase
          .from('field_visibility')
          .select('field_name, viewer_visible, member_visible, admin_visible, survey_year');
        if (error) throw error;
        const visibilityMap: Record<string, { viewer: boolean; member: boolean; admin: boolean }> = {};
        data?.forEach((field: any) => {
          visibilityMap[`${field.field_name}_${field.survey_year}`] = {
            viewer: field.viewer_visible,
            member: field.member_visible,
            admin: field.admin_visible,
          };
        });
        setFieldVisibility(visibilityMap);
      } catch (error) {
        // noop
      }
    };

    const fetchSurveys = async () => {
      if (!id) return;
      const years = [2021, 2022, 2023, 2024];
      const collected: Array<{ year: number; data: any }> = [];
      for (const year of years) {
        try {
          const { data, error } = await supabase
            .from(`survey_responses_${year}` as any)
            .select('*')
            .eq('user_id', id)
            .eq('submission_status', 'completed')
            .maybeSingle();
          if (data && !error) collected.push({ year, data });
        } catch (e) {
          // continue
        }
      }
      setSurveys(collected);
      if (collected.length > 0) setSelectedYear(collected[0].year);
    };

  useEffect(() => {
    if (id && (userRole === 'viewer' || userRole === 'member' || userRole === 'admin')) {
      fetchFundManagerData();
    }
  }, [id, userRole, fetchFundManagerData]);

  useEffect(() => {
    if (id) {
      checkSurveyStatus();
      fetchFieldVisibility();
      fetchSurveys();
    }
  }, [id]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!fundManager) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Fund Manager Not Found</h1>
            <p className="text-gray-600 mb-6">The requested fund manager could not be found.</p>
            <Button onClick={() => navigate('/network')} className="inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Network
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }


  const isFieldVisible = (fieldName: string, year: number): boolean => {
    const key = `${fieldName}_${year}`;
    const visibility = fieldVisibility[key];
    if (!visibility) return false;
    if (userRole === 'admin') return visibility.admin;
    if (userRole === 'member') return visibility.member;
    if (userRole === 'viewer') return visibility.viewer;
    return false;
  };

  const getSectionData = (surveyData: any, year: number) => {
    if (!surveyData) return [];
    const fieldsByCategory: Record<string, string[]> = {};
    Object.keys(surveyData).forEach(fieldName => {
      if (['id', 'user_id', 'created_at', 'updated_at', 'submission_status', 'completed_at', 'form_data'].includes(fieldName)) {
        return;
      }
      if (!isFieldVisible(fieldName, year)) {
        return;
      }
      let category = 'Other Information';
      if (fieldName.includes('email') || fieldName.includes('name') || fieldName.includes('organisation') || fieldName.includes('firm')) {
        category = 'Contact & Organization';
      } else if (fieldName.includes('fund') || fieldName.includes('capital') || fieldName.includes('raised') || fieldName.includes('target')) {
        category = 'Fund Information';
      } else if (fieldName.includes('investment') || fieldName.includes('sector') || fieldName.includes('stage') || fieldName.includes('instrument')) {
        category = 'Investment Strategy';
      } else if (fieldName.includes('team') || fieldName.includes('fte') || fieldName.includes('principal')) {
        category = 'Team & Operations';
      } else if (fieldName.includes('portfolio') || fieldName.includes('performance') || fieldName.includes('revenue') || fieldName.includes('jobs')) {
        category = 'Performance & Impact';
      }
      if (!fieldsByCategory[category]) fieldsByCategory[category] = [];
      fieldsByCategory[category].push(fieldName);
    });
    const order = [
      'Contact & Organization',
      'Fund Information',
      'Investment Strategy',
      'Team & Operations',
      'Performance & Impact',
      'Other Information'
    ];
    const sections = Object.entries(fieldsByCategory).map(([title, fields]) => ({ title, fields }));
    sections.sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title));
    return sections.map((s, idx) => ({ id: idx + 1, ...s }));
  };

  const isPlainObject = (val: unknown): val is Record<string, unknown> => {
    return Object.prototype.toString.call(val) === '[object Object]';
  };

  const renderArray = (arr: unknown[]) => {
    if (arr.length === 0) return <span className="text-muted-foreground">N/A</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((item, idx) => (
          <Badge key={idx} variant="secondary" className="px-2 py-0.5">
            {String(item)}
          </Badge>
        ))}
      </div>
    );
  };

  const renderObject = (obj: Record<string, unknown>) => {
    const entries = Object.entries(obj).filter(([k]) => k !== '_id');
    if (entries.length === 0) return <span className="text-muted-foreground">N/A</span>;
    return (
      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-start sm:gap-3">
            <span className="text-xs font-medium text-muted-foreground sm:w-1/3">{formatFieldName(key)}</span>
            <div className="text-sm sm:flex-1">
              {val === null || val === undefined ? (
                <span className="text-muted-foreground">N/A</span>
              ) : Array.isArray(val) ? (
                renderArray(val)
              ) : isPlainObject(val) ? (
                <div className="space-y-1">
                  {Object.entries(val as Record<string, unknown>).map(([k2, v2]) => (
                    <div key={k2} className="flex items-start gap-2">
                      <span className="text-xs font-medium text-muted-foreground min-w-[12rem]">{formatFieldName(k2)}</span>
                      <span className="text-sm">
                        {v2 === null || v2 === undefined
                          ? 'N/A'
                          : Array.isArray(v2)
                          ? (renderArray(v2) as unknown as string)
                          : isPlainObject(v2)
                          ? String(v2)
                          : String(v2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span>{String(val)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatFieldValue = (value: any): JSX.Element => {
    if (value === null || value === undefined) return <span className="text-muted-foreground">N/A</span>;
    if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
    if (Array.isArray(value)) return renderArray(value);
    if (isPlainObject(value)) return renderObject(value);
    return <span>{String(value)}</span>;
  };

  const formatFieldName = (field: string): string => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <SidebarLayout>
       <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">

         {/* Main Content - Proper spacing below header */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">

            {/* Company Information Section */}
            <div className="mb-8">
              <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="relative flex items-start justify-between gap-4">
                  {/* Left side - Content */}
                  <div className="flex-1 p-6 max-w-[60%] lg:max-w-[65%]">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Company Information</h2>
                    </div>

                   <div className="space-y-4">
                     {/* Company Name */}
                     <div className="flex items-center space-x-3">
                       <Building2 className="w-5 h-5 text-blue-600" />
                       <div>
                         <p className="text-sm font-medium text-gray-700">Company Name</p>
                         <p className="text-sm text-gray-900 font-semibold">{fundManager.firm_name || 'Not specified'}</p>
                       </div>
                     </div>

                     {/* Email */}
                     <div className="flex items-center space-x-3">
                       <Mail className="w-5 h-5 text-blue-600" />
                       <div>
                         <p className="text-sm font-medium text-gray-700">Email</p>
                         <p className="text-sm text-gray-900">{fundManager.email_address || 'Not specified'}</p>
                       </div>
                     </div>

                     {/* Website */}
                     <div className="flex items-center space-x-3">
                       <Globe className="w-5 h-5 text-blue-600" />
                       <div>
                         <p className="text-sm font-medium text-gray-700">Website</p>
                         {fundManager.website ? (
                           <a 
                             href={fundManager.website.startsWith('http') ? fundManager.website : `https://${fundManager.website}`}
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-sm text-blue-600 hover:underline break-all"
                           >
                             {fundManager.website}
                           </a>
                         ) : (
                           <p className="text-sm text-gray-500">No website provided</p>
                         )}
                       </div>
                     </div>

                     {/* Description */}
                     <div className="flex items-start space-x-3">
                       <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                       <div>
                         <p className="text-sm font-medium text-gray-700">Description</p>
                         <p className="text-sm text-gray-900">{fundManager.description || 'No description provided'}</p>
                       </div>
                     </div>

                     {/* Survey Year Navigation and In-Page Viewer */}
                     <div className="mt-6 pt-4 border-t border-blue-200">
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                           <BarChart3 className="w-3 h-3 text-white" />
                         </div>
                         <h3 className="text-base font-bold text-gray-800">Survey Responses</h3>
                       </div>

                       <div className="flex gap-2 flex-wrap mb-4">
                         {[2021, 2022, 2023, 2024].map((year) => {
                           const isCompleted = surveyStatus[String(year)];
                           return (
                             <Badge
                               key={year}
                               variant={selectedYear === year ? 'default' : 'secondary'}
                               className={`cursor-pointer px-3 py-1 ${isCompleted ? '' : 'opacity-50 cursor-not-allowed'}`}
                               onClick={() => isCompleted && setSelectedYear(year)}
                             >
                               {year}
                             </Badge>
                           );
                         })}
                       </div>

                       {selectedYear && surveys.find(s => s.year === selectedYear) ? (
                         (() => {
                           const sections = getSectionData(surveys.find(s => s.year === selectedYear)?.data, selectedYear);
                           if (sections.length === 0) {
                             return <p className="text-sm text-gray-500">No visible data for your access level.</p>;
                           }
                           return (
                             <Tabs defaultValue={`section-${sections[0].id}`} className="w-full">
                               <TabsList className="w-full flex p-0 rounded-lg overflow-hidden border border-blue-200/60">
                                 {sections.map((section) => (
                                   <TabsTrigger
                                     key={section.id}
                                     value={`section-${section.id}`}
                                     className="flex-1 basis-0 justify-center text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-3 truncate whitespace-nowrap bg-[#f0f0e6] hover:bg-white/80 data-[state=active]:bg-white data-[state=active]:text-gray-900 border-r last:border-r-0 border-blue-200/60"
                                     title={section.title}
                                   >
                                     {section.title}
                                   </TabsTrigger>
                                 ))}
                               </TabsList>
                               {sections.map((section) => {
                                 const surveyData = surveys.find(s => s.year === selectedYear)?.data;
                                 return (
                                   <TabsContent key={section.id} value={`section-${section.id}`}>
                                     <Card className="border-2 border-blue-200/60 shadow-sm bg-[#f5f5dc]">
                                       <CardHeader className="bg-[#f0f0e6] border-b border-blue-200/60 rounded-t-md">
                                         <CardTitle className="flex items-center justify-between text-gray-800">
                                           <span className="text-base font-bold">{section.title}</span>
                                           <Badge className="bg-blue-100 text-blue-700 border-blue-300" variant="outline">{section.fields.length} fields</Badge>
                                         </CardTitle>
                                       </CardHeader>
                                       <CardContent className="pt-4">
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                           {section.fields.map((field: string) => (
                                             <div key={field} className="rounded-lg border border-blue-200/60 bg-white p-4">
                                               <p className="font-semibold text-[11px] uppercase tracking-wide text-gray-600 mb-2">
                                                 {formatFieldName(field)}
                                               </p>
                                               <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-900">
                                                 {formatFieldValue(surveyData?.[field])}
                                               </div>
                                             </div>
                                           ))}
                                         </div>
                                       </CardContent>
                                     </Card>
                                   </TabsContent>
                                 );
                               })}
                             </Tabs>
                           );
                         })()
                       ) : (
                         <p className="text-sm text-gray-500">Select a completed year to view responses.</p>
                       )}
                     </div>
                   </div>
                 </div>

                {/* Right side - Large Profile Picture inside card */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex-none border-4 border-white shadow-lg rounded-xl overflow-hidden ml-auto mr-2 mt-4 mb-6">
                   {fundManager.profile_picture_url ? (
                     <img 
                       src={fundManager.profile_picture_url} 
                       alt="Profile" 
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                       <span className="text-6xl font-bold text-white">
                         {fundManager.participant_name?.charAt(0) || fundManager.first_name?.charAt(0) || 'F'}
                       </span>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default FundManagerDetail;