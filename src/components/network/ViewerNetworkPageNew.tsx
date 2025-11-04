import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Mail, Globe, User, Loader2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import FundManagerDetailModal from './FundManagerDetailModal';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  company_name: string;
  description: string | null;
  website: string | null;
  profile_picture_url: string | null;
  user_role: string;
  has_surveys: boolean;
}

export default function ViewerNetworkPageNew() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, profiles]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles and all survey data in parallel (optimized: only 5 queries total)
      const [profilesResult, survey2021Result, survey2022Result, survey2023Result, survey2024Result] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('id, email, company_name, description, website, profile_picture_url, user_role')
          .not('email', 'like', '%.test@escpnetwork.net')
          .order('company_name'),
        supabase
          .from('survey_responses_2021')
          .select('user_id')
          .eq('submission_status', 'completed'),
        supabase
          .from('survey_responses_2022')
          .select('user_id')
          .eq('submission_status', 'completed'),
        supabase
          .from('survey_responses_2023')
          .select('user_id')
          .eq('submission_status', 'completed'),
        supabase
          .from('survey_responses_2024')
          .select('user_id')
          .eq('submission_status', 'completed')
      ]);

      if (profilesResult.error) throw profilesResult.error;

      // Create a Set of user_ids that have completed surveys (fast lookup)
      const usersWithSurveys = new Set<string>();
      [survey2021Result.data, survey2022Result.data, survey2023Result.data, survey2024Result.data].forEach(surveyData => {
        (surveyData || []).forEach(survey => {
          if (survey.user_id) {
            usersWithSurveys.add(survey.user_id);
          }
        });
      });

      // Map profiles and check survey status in memory (no additional queries)
      const profilesWithSurveys = (profilesResult.data || []).map(profile => ({
        ...profile,
        has_surveys: usersWithSurveys.has(profile.id)
      }));

      setProfiles(profilesWithSurveys);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfiles = () => {
    if (!searchTerm.trim()) {
      setFilteredProfiles(profiles);
      return;
    }

    const filtered = profiles.filter(profile =>
      profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfiles(filtered);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'member': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCardClick = (profile: UserProfile) => {
    if (profile.has_surveys) {
      navigate(`/network/fund-manager/${profile.id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse max-w-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="relative overflow-hidden min-h-[400px] animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"></div>
              <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-4">
                <div className="h-6 bg-gray-500/50 rounded w-3/4"></div>
                <div className="h-4 bg-gray-500/40 rounded w-1/2"></div>
                <div className="h-4 bg-gray-500/40 rounded w-2/3"></div>
                <div className="h-3 bg-gray-500/30 rounded w-full"></div>
                <div className="h-3 bg-gray-500/30 rounded w-5/6"></div>
                <div className="flex gap-2 pt-2">
                  <div className="h-6 bg-gray-500/40 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-500/40 rounded-full w-24"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Input
            placeholder="Search by company name, email, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => {
          const isClickable = profile.has_surveys;
          
          return (
            <Card 
              key={profile.id} 
              className={`transition-shadow relative overflow-hidden min-h-[400px] ${
                isClickable 
                  ? 'hover:shadow-lg cursor-pointer hover:border-primary' 
                  : 'opacity-75'
              }`}
              onClick={() => handleCardClick(profile)}
            >
                {/* Profile Picture as Background */}
                <div className="absolute inset-0">
                  <Avatar className="w-full h-full rounded-lg">
                    <AvatarImage src={profile.profile_picture_url || ''} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <Building2 className="w-24 h-24" />
                    </AvatarFallback>
                  </Avatar>
                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300"></div>
                </div>

                                 {/* Content Overlay - Directly on Image */}
                 <div className="relative z-[1] h-full flex flex-col justify-end p-6 space-y-1">
                   {/* Company Name */}
                   <div className="flex items-center gap-2">
                     <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                     <CardTitle className="text-lg text-white drop-shadow-md">{profile.company_name || 'No Company Name'}</CardTitle>
                   </div>

                   {/* Email */}
                   <div className="flex items-center gap-2 text-sm text-gray-100">
                     <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                     <span className="truncate drop-shadow">{profile.email}</span>
                   </div>

                   {/* Website */}
                   {profile.website && (
                     <div className="flex items-center gap-2 text-sm text-gray-100">
                       <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                       <a
                         href={profile.website}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-blue-300 hover:text-blue-200 hover:underline truncate drop-shadow"
                         onClick={(e) => e.stopPropagation()}
                       >
                         {profile.website}
                       </a>
                     </div>
                   )}

                                       {/* Description */}
                    {profile.description && (
                      <div className="relative">
                        <div 
                          className={`text-sm text-gray-200 drop-shadow transition-all duration-300 ${
                            expandedDescriptions[profile.id] ? 'max-h-32 overflow-y-auto' : 'line-clamp-2'
                          }`}
                          style={{ maxHeight: expandedDescriptions[profile.id] ? '8rem' : 'none' }}
                        >
                          {profile.description}
                        </div>
                        {profile.description.length > 100 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedDescriptions(prev => ({
                                ...prev,
                                [profile.id]: !prev[profile.id]
                              }));
                            }}
                            className="text-blue-400 hover:text-blue-300 text-xs mt-1 flex items-center gap-1"
                          >
                            {expandedDescriptions[profile.id] ? (
                              <>
                                <span>Read Less</span>
                                <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                <span>Read More</span>
                                <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                   {/* Badges */}
                   <div className="flex flex-wrap gap-2 pt-2">
                     <Badge className="bg-black/40 backdrop-blur-sm text-white border-white/20">
                       {profile.user_role}
                     </Badge>
                     {profile.has_surveys && (
                       <Badge className="bg-green-500/30 backdrop-blur-sm text-green-100 border-green-400/30">
                         <FileText className="w-3 h-3 mr-1" />
                         Has Surveys
                       </Badge>
                     )}
                   </div>
                 </div>
          </Card>
          );
        })}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No profiles found matching your search</p>
        </div>
      )}
    </div>

    {/* Modal no longer used for viewers; navigation to detail page instead */}
  </>
  );
}
