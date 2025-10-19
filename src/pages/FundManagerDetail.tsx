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


  const fetchFundManagerData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching fund manager data for user:', id);

      // Fetch from user_profiles table (same as network page)
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', id)
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
        id: profileData.user_id,
        user_id: profileData.user_id,
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
          const { data, error } = await supabase
            .from(`survey_${year}_responses`)
            .select('id')
            .eq('user_id', id)
            .single();
          
          // Check if it's a "not found" error (PGRST116) or permission error (406)
          if (error && (error.code === 'PGRST116' || error.code === 'PGRST301' || error.status === 406)) {
            status[year] = false;
          } else {
            status[year] = !error && data;
          }
        } catch (error) {
          status[year] = false;
        }
      }
      
      setSurveyStatus(status);
    };

  useEffect(() => {
    if (id && (userRole === 'viewer' || userRole === 'member' || userRole === 'admin')) {
      fetchFundManagerData();
    }
  }, [id, userRole, fetchFundManagerData]);

  useEffect(() => {
    if (id) {
      checkSurveyStatus();
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


  return (
    <SidebarLayout>
       <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">

         {/* Main Content - Proper spacing below header */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">

            {/* Company Information Section */}
            <div className="mb-8">
              <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="relative flex">
                  {/* Left side - Content */}
                  <div className="flex-1 p-6">
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

                     {/* Survey Year Navigation */}
                     <div className="mt-6 pt-4 border-t border-blue-200">
                       <div className="flex items-center space-x-3 mb-4">
                         <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                           <BarChart3 className="w-3 h-3 text-white" />
                         </div>
                         <h3 className="text-base font-bold text-gray-800">Survey Responses</h3>
                       </div>
                       
                        <p className="text-xs text-gray-600 mb-4">
                          Click on a year to view their survey responses. 
                          <span className="text-green-600">✓</span> = Completed, 
                          <span className="text-gray-400">○</span> = Not completed
                        </p>
                        
                        {/* Year Selection Buttons */}
                        <div className="flex gap-2">
                          {['2021', '2022', '2023', '2024'].map((year) => {
                            const isCompleted = surveyStatus[year];
                            return (
                              <Button
                                key={year}
                                variant="outline"
                                size="sm"
                                onClick={isCompleted ? () => navigate(`/survey-response/${id}/${year}`) : undefined}
                                disabled={!isCompleted}
                                className={`h-8 px-3 border transition-all duration-300 ${
                                  isCompleted
                                    ? 'border-green-200 text-green-600 hover:bg-green-50 hover:border-green-400 cursor-pointer'
                                    : 'border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                                }`}
                              >
                                <div className="text-center">
                                  <div className="text-xs font-bold">{year}</div>
                                  <div className="text-xs opacity-75">
                                    {isCompleted ? '✓' : '○'}
                                  </div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                     </div>
                   </div>
                 </div>

                 {/* Right side - Large Profile Picture inside card */}
                 <div className="w-96 h-96 border-4 border-white shadow-lg rounded-2xl overflow-hidden m-6">
                   {fundManager.profile_picture_url ? (
                     <img 
                       src={fundManager.profile_picture_url} 
                       alt="Profile" 
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                       <span className="text-8xl font-bold text-white">
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