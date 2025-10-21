import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, FileText, Building2, Mail, Calendar } from 'lucide-react';

interface FundManager {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  organization_name: string;
  role_title: string;
}

interface SurveyResponse {
  id: string;
  year: string;
  completed_at: string;
  organisation_name?: string;
  fund_name?: string;
  firm_name?: string;
}

export default function FundManagerProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  
  const [manager, setManager] = useState<FundManager | null>(null);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchManagerData();
    }
  }, [userId]);

  const fetchManagerData = async () => {
    try {
      setLoading(true);

      // Fetch manager profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setManager(profileData);

      // Fetch all survey responses for this manager
      const surveyPromises = [
        supabase.from('survey_2021_responses').select('id, completed_at, firm_name, email_address').eq('user_id', userId).single(),
        supabase.from('survey_2022_responses').select('id, completed_at, organisation, email').eq('user_id', userId).single(),
        supabase.from('survey_2023_responses').select('id, completed_at, organisation_name, fund_name, email_address').eq('user_id', userId).single(),
        supabase.from('survey_2024_responses').select('id, completed_at, organisation_name, fund_name, email_address').eq('user_id', userId).single(),
      ];

      const results = await Promise.allSettled(surveyPromises);
      
      const surveyList: SurveyResponse[] = [];
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.data) {
          const year = ['2021', '2022', '2023', '2024'][index];
          surveyList.push({
            ...result.value.data,
            year,
            organisation_name: result.value.data.organisation_name || result.value.data.organisation || result.value.data.firm_name,
          });
        }
      });

      setSurveys(surveyList);
    } catch (error) {
      console.error('Error fetching manager data:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewSurvey = (year: string) => {
    navigate(`/network/fund-manager/${userId}/survey/${year}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Fund manager not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/network')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Network
      </Button>

      {/* Manager Profile Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                {manager.first_name} {manager.last_name}
              </CardTitle>
              <div className="space-y-2 text-sm text-muted-foreground">
                {manager.role_title && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{manager.role_title}</span>
                  </div>
                )}
                {manager.organization_name && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{manager.organization_name}</span>
                  </div>
                )}
                {userRole === 'admin' && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{manager.email}</span>
                  </div>
                )}
              </div>
            </div>
            <Badge variant="secondary">Member</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Survey Responses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Survey Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {surveys.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No survey responses available
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {surveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {survey.year} Survey
                        </h3>
                        {survey.organisation_name && (
                          <p className="text-sm text-muted-foreground">
                            {survey.organisation_name}
                          </p>
                        )}
                        {survey.fund_name && (
                          <p className="text-sm text-muted-foreground">
                            {survey.fund_name}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">{survey.year}</Badge>
                    </div>
                    
                    {survey.completed_at && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Completed {new Date(survey.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <Button
                      onClick={() => viewSurvey(survey.year)}
                      className="w-full"
                      variant="outline"
                    >
                      View Response
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
