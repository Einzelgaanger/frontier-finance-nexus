import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Building, Mail, User, ChevronRight } from 'lucide-react';

interface FundManagerDetailModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SurveyResponse {
  year: string;
  form_data: any;
  completed_at: string;
  submission_status: string;
}

const FundManagerDetailModal: React.FC<FundManagerDetailModalProps> = ({
  userId,
  open,
  onOpenChange,
}) => {
  const { userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('2024');

  useEffect(() => {
    if (open && userId) {
      fetchFundManagerData();
    }
  }, [open, userId]);

  const fetchFundManagerData = async () => {
    setLoading(true);
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('user_profiles' as any)
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(profileData as any);

      // Fetch all survey responses for this user
      const surveyData: SurveyResponse[] = [];

      // Fetch 2021 survey
      const { data: survey2021 } = await supabase
        .from('survey_responses_2021' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('submission_status', 'completed')
        .maybeSingle();

      if (survey2021) {
        const data = survey2021 as any;
        surveyData.push({
          year: '2021',
          form_data: data.form_data,
          completed_at: data.completed_at,
          submission_status: data.submission_status,
        });
      }

      // Fetch 2022 survey
      const { data: survey2022 } = await supabase
        .from('survey_responses_2022' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('submission_status', 'completed')
        .maybeSingle();

      if (survey2022) {
        const data = survey2022 as any;
        surveyData.push({
          year: '2022',
          form_data: data.form_data,
          completed_at: data.completed_at,
          submission_status: data.submission_status,
        });
      }

      // Fetch 2023 survey
      const { data: survey2023 } = await supabase
        .from('survey_responses_2023' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('submission_status', 'completed')
        .maybeSingle();

      if (survey2023) {
        const data = survey2023 as any;
        surveyData.push({
          year: '2023',
          form_data: data.form_data,
          completed_at: data.completed_at,
          submission_status: data.submission_status,
        });
      }

      // Fetch 2024 survey
      const { data: survey2024 } = await supabase
        .from('survey_responses_2024' as any)
        .select('*')
        .eq('user_id', userId)
        .eq('submission_status', 'completed')
        .maybeSingle();

      if (survey2024) {
        const data = survey2024 as any;
        surveyData.push({
          year: '2024',
          form_data: data.form_data,
          completed_at: data.completed_at,
          submission_status: data.submission_status,
        });
      }

      setSurveys(surveyData);
      if (surveyData.length > 0) {
        setSelectedYear(surveyData[surveyData.length - 1].year);
      }
    } catch (error) {
      console.error('Error fetching fund manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSurveySection = (formData: any, sectionKey: string, sectionTitle: string) => {
    if (!formData || !formData[sectionKey]) return null;

    const data = formData[sectionKey];
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">{sectionTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(data).map(([key, value]) => {
              if (value === null || value === undefined || value === '') return null;
              
              return (
                <div key={key} className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
                  </span>
                  <span className="text-gray-900">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSurveyData = (survey: SurveyResponse) => {
    const isAdmin = userRole === 'admin';
    const isMember = userRole === 'member';
    const formData = survey.form_data;

    // For members, only show first 4 sections
    const sectionsToShow = isAdmin ? 8 : isMember ? 4 : 0;

    if (!formData) {
      return <div className="text-center py-8 text-gray-500">No survey data available</div>;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">
              Completed: {new Date(survey.completed_at).toLocaleDateString()}
            </span>
          </div>
          <Badge variant="secondary">
            {survey.year}
          </Badge>
        </div>

        {/* Basic Information - Always visible */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {formData.email_address && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{formData.email_address}</span>
              </div>
            )}
            {formData.firm_name && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{formData.firm_name}</span>
              </div>
            )}
            {formData.organisation_name && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{formData.organisation_name}</span>
              </div>
            )}
            {formData.fund_name && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900">{formData.fund_name}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional sections based on role */}
        {sectionsToShow > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              {isAdmin ? 'Full access to all sections' : `Access to first ${sectionsToShow} sections`}
            </div>
            
            {/* Display form data in a readable format */}
            <div className="grid gap-4">
              {Object.entries(formData).slice(0, sectionsToShow * 5).map(([key, value]) => {
                if (value === null || value === undefined || value === '' || key === 'email_address' || key === 'firm_name' || key === 'organisation_name' || key === 'fund_name') return null;
                
                return (
                  <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span className="text-gray-900">
                      {typeof value === 'object' 
                        ? JSON.stringify(value, null, 2).substring(0, 100) + '...'
                        : String(value).substring(0, 100)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {profile?.first_name} {profile?.last_name}
          </DialogTitle>
          <p className="text-gray-600">{profile?.email}</p>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No completed surveys found for this fund manager.</p>
          </div>
        ) : (
          <Tabs value={selectedYear} onValueChange={setSelectedYear} className="w-full">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${surveys.length}, 1fr)` }}>
              {surveys.map((survey) => (
                <TabsTrigger key={survey.year} value={survey.year}>
                  {survey.year}
                </TabsTrigger>
              ))}
            </TabsList>

            {surveys.map((survey) => (
              <TabsContent key={survey.year} value={survey.year} className="mt-6">
                {renderSurveyData(survey)}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FundManagerDetailModal;
