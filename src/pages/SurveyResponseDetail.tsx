// @ts-nocheck
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  FileText,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SurveyResponse {
  response_id: number;
  company_id: number;
  company_name: string;
  survey_year: number;
  table_name: string;
  created_at: string;
}

interface ResponseData {
  id: number;
  question_column: string;
  original_question: string;
  response_value: string;
  data_type: string;
}

const SurveyResponseDetail = () => {
  const { responseId } = useParams<{ responseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [surveyResponse, setSurveyResponse] = useState<SurveyResponse | null>(null);
  const [responseData, setResponseData] = useState<ResponseData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (responseId) {
      fetchSurveyResponse();
    }
  }, [responseId]);

  const fetchSurveyResponse = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch metadata from survey_responses table
      const { data: metadata, error: metadataError } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('response_id', responseId)
        .single();

      if (metadataError) throw metadataError;
      if (!metadata) throw new Error('Survey response not found');

      setSurveyResponse(metadata);

      // Fetch actual response data from the dynamic table
      const { data: responses, error: responsesError } = await supabase
        .from(metadata.table_name)
        .select('*')
        .order('id');

      if (responsesError) throw responsesError;

      setResponseData(responses || []);
    } catch (err: any) {
      console.error('Error fetching survey response:', err);
      setError(err.message || 'Failed to load survey response');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !surveyResponse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <p className="text-red-800">{error || 'Survey response not found'}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/network')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Network
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm"
            className="mb-4"
            onClick={() => navigate('/network')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Network
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                {surveyResponse.company_name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-slate-600">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  Company ID: {surveyResponse.company_id}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Survey Year: {surveyResponse.survey_year}
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Response ID: {surveyResponse.response_id}
                </div>
              </div>
            </div>
            <Badge className="bg-emerald-600 text-white text-lg px-4 py-2">
              {surveyResponse.survey_year}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Total Questions</p>
              <p className="text-2xl font-bold text-slate-800">{responseData.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Submitted</p>
              <p className="text-lg font-semibold text-slate-800">
                {new Date(surveyResponse.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="text-sm text-slate-600 mb-1">Table Name</p>
              <p className="text-sm font-mono text-slate-800">{surveyResponse.table_name}</p>
            </CardContent>
          </Card>
        </div>

        {/* Survey Responses */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Survey Responses</CardTitle>
          </CardHeader>
          <CardContent>
            {responseData.length === 0 ? (
              <p className="text-slate-600 text-center py-8">No responses found</p>
            ) : (
              <div className="space-y-4">
                {responseData.map((item) => (
                  <div 
                    key={item.id}
                    className="border-b border-slate-200 pb-4 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 mb-1">
                          {item.original_question}
                        </p>
                        <p className="text-sm text-slate-500 mb-2">
                          Column: {item.question_column}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        {item.data_type}
                      </Badge>
                    </div>
                    <div className="bg-slate-50 rounded-md p-3">
                      <p className="text-slate-700">
                        {item.response_value || <span className="italic text-slate-400">No response</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurveyResponseDetail;
