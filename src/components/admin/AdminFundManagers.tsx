import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Calendar, Mail, Search, Eye } from 'lucide-react';
import FundManagerDetailModal from '@/components/network/FundManagerDetailModal';

interface FundManager {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  survey_count: number;
}

const AdminFundManagers: React.FC = () => {
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFundManagers();
  }, []);

  const fetchFundManagers = async () => {
    setLoading(true);
    try {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // For each profile, check how many completed surveys they have
      const managersWithSurveys = await Promise.all(
        (profiles || []).map(async (profile) => {
          let surveyCount = 0;

          // Check 2021 surveys
          const { data: survey2021 } = await supabase
            .from('survey_2021_responses')
            .select('id')
            .eq('user_id', profile.id)
            .eq('submission_status', 'completed')
            .single();
          if (survey2021) surveyCount++;

          // Check 2022 surveys
          const { data: survey2022 } = await supabase
            .from('survey_2022_responses')
            .select('id')
            .eq('user_id', profile.id)
            .eq('submission_status', 'completed')
            .single();
          if (survey2022) surveyCount++;

          // Check 2023 surveys
          const { data: survey2023 } = await supabase
            .from('survey_2023_responses')
            .select('id')
            .eq('user_id', profile.id)
            .eq('submission_status', 'completed')
            .single();
          if (survey2023) surveyCount++;

          // Check 2024 surveys
          const { data: survey2024 } = await supabase
            .from('survey_2024_responses')
            .select('id')
            .eq('user_id', profile.id)
            .eq('submission_status', 'completed')
            .single();
          if (survey2024) surveyCount++;

          return {
            ...profile,
            user_id: profile.id,
            survey_count: surveyCount,
          };
        })
      );

      setFundManagers(managersWithSurveys);
    } catch (error) {
      console.error('Error fetching fund managers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredManagers = fundManagers.filter((manager) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      manager.first_name?.toLowerCase().includes(searchLower) ||
      manager.last_name?.toLowerCase().includes(searchLower) ||
      manager.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewManager = (managerId: string) => {
    setSelectedManager(managerId);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Fund Managers</h2>
          <p className="text-gray-600">View and manage fund manager surveys</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fund Managers Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredManagers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No fund managers found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <Card key={manager.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {manager.first_name} {manager.last_name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{manager.email}</span>
                    </div>
                  </div>
                  <Badge variant={manager.survey_count > 0 ? 'default' : 'secondary'}>
                    {manager.survey_count} {manager.survey_count === 1 ? 'Survey' : 'Surveys'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>Fund Manager</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(manager.created_at).toLocaleDateString()}</span>
                  </div>
                  <Button
                    onClick={() => handleViewManager(manager.user_id)}
                    className="w-full mt-4"
                    variant="outline"
                    disabled={manager.survey_count === 0}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Surveys
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Fund Manager Detail Modal */}
      {selectedManager && (
        <FundManagerDetailModal
          userId={selectedManager}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  );
};

export default AdminFundManagers;
