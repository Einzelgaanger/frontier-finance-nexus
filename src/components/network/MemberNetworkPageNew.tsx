import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Mail, Globe, Loader2, User, FileText } from 'lucide-react';
import FundManagerDetailModal from './FundManagerDetailModal';
import { useAuth } from '@/hooks/useAuth';

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

export default function MemberNetworkPageNew() {
  const { userRole } = useAuth();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, profiles]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, email, company_name, description, website, profile_picture_url, user_role')
        .not('email', 'like', '%.test@escpnetwork.net')
        .order('company_name');

      if (error) throw error;

      // Check which users have completed surveys
      const profilesWithSurveys = await Promise.all(
        (data || []).map(async (profile) => {
          const hasSurveys = await checkUserHasSurveys(profile.id);
          return { ...profile, has_surveys: hasSurveys };
        })
      );

      setProfiles(profilesWithSurveys);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserHasSurveys = async (userId: string): Promise<boolean> => {
    const years = [2021, 2022, 2023, 2024];
    
    for (const year of years) {
      try {
        const { data } = await supabase
          .from(`survey_responses_${year}` as any)
          .select('id')
          .eq('user_id', userId)
          .eq('submission_status', 'completed')
          .maybeSingle();

        if (data) return true;
      } catch (error) {
        // Continue to next year
      }
    }
    return false;
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
    // Only allow clicking on cards with surveys for members/viewers
    // Admins can see all
    if (profile.has_surveys || userRole === 'admin') {
      setSelectedUser({ id: profile.id, name: profile.company_name });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Network Directory</h1>
          <p className="text-muted-foreground mb-4">
            {userRole === 'admin' 
              ? 'Click on any company to view their survey responses (all sections)' 
              : 'Click on companies with surveys to view their responses (sections based on your access level)'}
          </p>
          
          <Input
            placeholder="Search by company name, email, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => {
            const isClickable = profile.has_surveys || userRole === 'admin';
            
            return (
              <Card 
                key={profile.id} 
                className={`transition-shadow ${
                  isClickable 
                    ? 'hover:shadow-lg cursor-pointer hover:border-primary' 
                    : 'opacity-75'
                }`}
                onClick={() => handleCardClick(profile)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={profile.profile_picture_url || ''} />
                        <AvatarFallback>
                          <Building2 className="w-8 h-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{profile.company_name || 'No Company Name'}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getRoleBadgeColor(profile.user_role)}>
                            {profile.user_role}
                          </Badge>
                          {profile.has_surveys && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                              <FileText className="w-3 h-3 mr-1" />
                              Has Surveys
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {profile.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate">{profile.email}</span>
                    </div>
                    
                    {profile.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
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

      {selectedUser && (
        <FundManagerDetailModal
          userId={selectedUser.id}
          companyName={selectedUser.name}
          open={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
