// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, User, Calendar } from 'lucide-react';

interface SurveyResponse {
  id: string;
  user_id: string;
  form_data: any;
  completed_at: string;
  [key: string]: any;
}

const SurveyResponseViewer = () => {
  const { userId, year } = useParams<{ userId: string; year: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchSurveyResponse = async () => {
    try {
      setLoading(true);
      
      const tableName = `survey_${year}_responses`;
      const { data, error } = await supabase
        .from(tableName as any)
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching survey response:', error);
        toast({
          title: "Error",
          description: "Failed to fetch survey response",
          variant: "destructive",
        });
        return;
      }

      setResponse(data);
    } catch (error) {
      console.error('Error fetching survey response:', error);
      toast({
        title: "Error",
        description: "Failed to fetch survey response",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && year) {
      fetchSurveyResponse();
    }
  }, [userId, year]);

  const renderValue = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-400 italic text-sm">No response</span>;
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <span className="text-gray-400 italic text-sm">No response</span>;
      }
      return (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
              {typeof item === 'object' ? JSON.stringify(item) : String(item)}
            </Badge>
          ))}
        </div>
      );
    }

    // Handle objects (like rankings, percentages)
    if (typeof value === 'object') {
      return (
        <div className="space-y-1.5 text-sm">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
              <span className="text-gray-700 font-medium">{formatKey(k)}:</span>
              <span className="text-gray-900">{String(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    // Handle booleans
    if (typeof value === 'boolean') {
      return <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>;
    }

    // Handle numbers
    if (typeof value === 'number') {
      return <span className="font-medium text-gray-900">{value.toLocaleString()}</span>;
    }

    // Handle long text
    if (String(value).length > 200) {
      return <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">{String(value)}</div>;
    }

    return <span className="text-gray-900">{String(value)}</span>;
  };

  const formatKey = (key: string): string => {
    // Convert snake_case to Title Case
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/Ftes/g, 'FTEs')
      .replace(/Gp/g, 'GP')
      .replace(/Lp/g, 'LP')
      .replace(/Irr/g, 'IRR')
      .replace(/Sdg/g, 'SDG')
      .replace(/Sgb/g, 'SGB');
  };

  const shouldShowField = (key: string, value: any): boolean => {
    // Hide internal fields
    if (['id', 'user_id', 'created_at', 'updated_at', 'submission_status'].includes(key)) {
      return false;
    }

    // Show fields with non-empty values
    if (value !== null && value !== undefined && value !== '') {
      // For arrays, show if not empty
      if (Array.isArray(value) && value.length === 0) return false;
      // For objects, show if not empty
      if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) return false;
      return true;
    }

    return false;
  };

  const organizeFields = (formData: any) => {
    if (!formData) return [];

    const sections: { title: string; fields: Array<{ key: string; value: any }> }[] = [];

    // Group fields by common prefixes and themes
    const fieldGroups: { [key: string]: Array<{ key: string; value: any }> } = {
      'Contact & Organization': [],
      'Team & Background': [],
      'Legal & Structure': [],
      'Fundraising & Capital': [],
      'Investment Strategy': [],
      'Portfolio & Operations': [],
      'Performance & Impact': [],
      'Other Information': [],
    };

    Object.entries(formData).forEach(([key, value]) => {
      if (!shouldShowField(key, value)) return;

      const field = { key, value };

      // Categorize fields
      if (key.includes('email') || key.includes('name') || key.includes('organisation') || key.includes('firm') || key.includes('contact')) {
        fieldGroups['Contact & Organization'].push(field);
      } else if (key.includes('team') || key.includes('fte') || key.includes('principal') || key.includes('gender') || key.includes('experience') || key.includes('role')) {
        fieldGroups['Team & Background'].push(field);
      } else if (key.includes('legal') || key.includes('domicile') || key.includes('currency') || key.includes('fund_type') || key.includes('vehicle')) {
        fieldGroups['Legal & Structure'].push(field);
      } else if (key.includes('raised') || key.includes('target_fund') || key.includes('capital') || key.includes('fundraising') || key.includes('commitments') || key.includes('lp_')) {
        fieldGroups['Fundraising & Capital'].push(field);
      } else if (key.includes('investment') || key.includes('thesis') || key.includes('sector') || key.includes('stage') || key.includes('instrument') || key.includes('financing')) {
        fieldGroups['Investment Strategy'].push(field);
      } else if (key.includes('portfolio') || key.includes('pipeline') || key.includes('value_creation') || key.includes('sourcing') || key.includes('exit') || key.includes('monetization')) {
        fieldGroups['Portfolio & Operations'].push(field);
      } else if (key.includes('performance') || key.includes('impact') || key.includes('jobs') || key.includes('revenue') || key.includes('growth') || key.includes('exits_achieved')) {
        fieldGroups['Performance & Impact'].push(field);
      } else {
        fieldGroups['Other Information'].push(field);
      }
    });

    // Convert to sections array, excluding empty sections
    Object.entries(fieldGroups).forEach(([title, fields]) => {
      if (fields.length > 0) {
        sections.push({ title, fields });
      }
    });

    return sections;
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!response || !response.form_data) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-orange-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  {year} Survey Not Completed
                </h1>
                <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  This user has not completed the {year} survey yet. They may have completed other surveys or may still be in the process of filling out this one.
                </p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg p-8 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Survey Years</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['2021', '2022', '2023', '2024'].map((surveyYear) => (
                    <Button
                      key={surveyYear}
                      variant="outline"
                      onClick={() => navigate(`/survey-response/${userId}/${surveyYear}`)}
                      className={`h-16 border-2 transition-all duration-300 ${
                        surveyYear === year
                          ? 'border-orange-300 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold">{surveyYear}</div>
                        <div className="text-xs text-gray-500">
                          {surveyYear === year ? 'Not Completed' : 'Check Response'}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/network')}
                  className="inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Network
                </Button>
                <Button
                  onClick={() => navigate(`/network/fund-manager/${userId}`)}
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const sections = organizeFields(response.form_data);

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/network')}
                  className="inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Network
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {year} Survey Response
                  </h1>
                  <p className="text-lg text-gray-600">
                    Complete survey data for this fund manager
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{year}</span>
                </Badge>
                {response.completed_at && (
                  <Badge variant="default" className="flex items-center space-x-1">
                    Completed: {new Date(response.completed_at).toLocaleDateString()}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Survey Sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {sections.slice(0, 3).map((section, idx) => (
                <TabsTrigger key={idx} value={`section-${idx}`}>
                  {section.title.length > 20 ? section.title.substring(0, 17) + '...' : section.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6">
                {sections.map((section, sectionIdx) => (
                  <Card key={sectionIdx} className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-xl">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span>{section.title}</span>
                        <Badge variant="secondary">{section.fields.length} fields</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {section.fields.slice(0, 6).map((field, fieldIdx) => (
                          <div key={fieldIdx} className="border-b border-gray-100 pb-3">
                            <div className="text-sm font-medium text-gray-600 mb-1">
                              {formatKey(field.key)}
                            </div>
                            <div className="text-sm">
                              {renderValue(field.key, field.value)}
                            </div>
                          </div>
                        ))}
                      </div>
                      {section.fields.length > 6 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-4"
                          onClick={() => setActiveTab(`section-${sectionIdx}`)}
                        >
                          View all {section.fields.length} fields →
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Individual Section Tabs */}
            {sections.map((section, sectionIdx) => (
              <TabsContent key={sectionIdx} value={`section-${sectionIdx}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>{section.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.fields.map((field, fieldIdx) => (
                      <div key={fieldIdx} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex flex-col space-y-2">
                          <label className="text-sm font-semibold text-gray-700">
                            {formatKey(field.key)}
                          </label>
                          <div className="text-sm">
                            {renderValue(field.key, field.value)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SurveyResponseViewer;
