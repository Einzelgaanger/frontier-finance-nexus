
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Network,
  FileText,
  CheckCircle,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

const MemberDashboard = () => {
  const [profileCompletion, setProfileCompletion] = useState('...');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check profile completion
  const fetchProfileStatus = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check both regular and 2021 surveys
      const [regularSurveyData, survey2021Data] = await Promise.all([
        supabase
          .from('survey_responses')
          .select('id, completed_at')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .maybeSingle(),
        supabase
          .from('survey_responses_2021')
          .select('id, completed_at')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .maybeSingle()
      ]);
      
      const hasRegularSurvey = regularSurveyData.data && !regularSurveyData.error;
      const has2021Survey = survey2021Data.data && !survey2021Data.error;
      const completion = (hasRegularSurvey || has2021Survey) ? '100%' : '0%';
      
      setProfileCompletion(completion);
      
    } catch (error) {
      console.error('Error fetching profile status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileStatus();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Simple Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome to your member dashboard</p>
        </div>

        {/* Profile Status */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Profile Status</h3>
                  <p className="text-gray-600">Survey completion: {profileCompletion}</p>
                </div>
              </div>
              {profileCompletion === '100%' ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              ) : (
                <Badge variant="outline">Incomplete</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Network className="w-5 h-5 mr-2 text-blue-600" />
                Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Browse and connect with other fund managers</p>
              <Button asChild className="w-full">
                <Link to="/network">Explore Network</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Surveys
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Complete surveys to update your profile</p>
              <Button asChild className="w-full">
                <Link to="/survey">View Surveys</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
