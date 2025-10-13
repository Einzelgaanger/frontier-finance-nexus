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
import { ArrowLeft, FileText, User, Calendar, Building2 } from 'lucide-react';

interface SurveyResponse {
  id: string;
  user_id: string;
  [key: string]: any;
}

interface SurveySection {
  title: string;
  questions: Array<{
    key: string;
    label: string;
    type: 'text' | 'select' | 'multiselect' | 'number' | 'boolean' | 'textarea';
    options?: string[];
  }>;
}

const SurveyResponseViewer = () => {
  const { userId, year } = useParams<{ userId: string; year: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  
  const [response, setResponse] = useState<SurveyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');

  // Define survey sections based on year
  const getSurveySections = (year: string): SurveySection[] => {
    switch (year) {
      case '2021':
        return [
          {
            title: 'Background Information',
            questions: [
              { key: 'organisation_name', label: 'Organization Name', type: 'text' },
              { key: 'contact_name', label: 'Contact Name', type: 'text' },
              { key: 'email_address', label: 'Email Address', type: 'text' },
              { key: 'fund_name', label: 'Fund Name', type: 'text' },
              { key: 'year_founded', label: 'Year Founded', type: 'number' },
              { key: 'team_size', label: 'Team Size', type: 'number' },
            ]
          },
          {
            title: 'Investment Thesis & Capital Construct',
            questions: [
              { key: 'investment_thesis', label: 'Investment Thesis', type: 'textarea' },
              { key: 'target_sectors', label: 'Target Sectors', type: 'multiselect' },
              { key: 'investment_stage', label: 'Investment Stage', type: 'select', options: ['Pre-seed', 'Seed', 'Series A', 'Series B+'] },
              { key: 'typical_check_size', label: 'Typical Check Size', type: 'text' },
            ]
          },
          {
            title: 'Portfolio Construction and Team',
            questions: [
              { key: 'portfolio_companies', label: 'Number of Portfolio Companies', type: 'number' },
              { key: 'team_experience', label: 'Team Experience', type: 'textarea' },
              { key: 'geographic_focus', label: 'Geographic Focus', type: 'multiselect' },
            ]
          },
          {
            title: 'Portfolio Development & Investment Return Monetization',
            questions: [
              { key: 'portfolio_value_creation', label: 'Portfolio Value Creation Strategy', type: 'textarea' },
              { key: 'exit_strategy', label: 'Exit Strategy', type: 'textarea' },
            ]
          }
        ];
      case '2022':
        return [
          {
            title: 'Contact Information',
            questions: [
              { key: 'email_address', label: 'Email Address', type: 'text' },
              { key: 'organisation_name', label: 'Organization Name', type: 'text' },
              { key: 'fund_name', label: 'Fund Name', type: 'text' },
            ]
          },
          {
            title: 'Organizational Background and Team',
            questions: [
              { key: 'legal_entity_achieved', label: 'Legal Entity Achieved', type: 'text' },
              { key: 'geographic_markets', label: 'Geographic Markets', type: 'multiselect' },
              { key: 'team_based', label: 'Team Based', type: 'multiselect' },
              { key: 'fte_staff_current', label: 'Current FTE Staff', type: 'number' },
            ]
          },
          {
            title: "Vehicle's Legal Construct",
            questions: [
              { key: 'legal_domicile', label: 'Legal Domicile', type: 'multiselect' },
              { key: 'currency_investments', label: 'Currency for Investments', type: 'text' },
              { key: 'fund_type_status', label: 'Fund Type Status', type: 'text' },
            ]
          },
          {
            title: 'Investment Thesis',
            questions: [
              { key: 'investment_thesis', label: 'Investment Thesis', type: 'textarea' },
              { key: 'target_sectors', label: 'Target Sectors', type: 'multiselect' },
              { key: 'investment_stage', label: 'Investment Stage', type: 'select' },
            ]
          }
        ];
      case '2023':
        return [
          {
            title: 'Introduction & Context',
            questions: [
              { key: 'email_address', label: 'Email Address', type: 'text' },
              { key: 'organisation_name', label: 'Organization Name', type: 'text' },
              { key: 'fund_name', label: 'Fund Name', type: 'text' },
            ]
          },
          {
            title: 'Organizational Background and Team',
            questions: [
              { key: 'legal_entity_achieved', label: 'Legal Entity Achieved', type: 'text' },
              { key: 'geographic_markets', label: 'Geographic Markets', type: 'multiselect' },
              { key: 'team_based', label: 'Team Based', type: 'multiselect' },
              { key: 'fte_staff_current', label: 'Current FTE Staff', type: 'number' },
            ]
          },
          {
            title: 'Vehicle Construct',
            questions: [
              { key: 'legal_domicile', label: 'Legal Domicile', type: 'multiselect' },
              { key: 'currency_investments', label: 'Currency for Investments', type: 'text' },
              { key: 'fund_type_status', label: 'Fund Type Status', type: 'text' },
            ]
          },
          {
            title: 'Investment Thesis',
            questions: [
              { key: 'investment_thesis', label: 'Investment Thesis', type: 'textarea' },
              { key: 'target_sectors', label: 'Target Sectors', type: 'multiselect' },
              { key: 'investment_stage', label: 'Investment Stage', type: 'select' },
            ]
          }
        ];
      case '2024':
        return [
          {
            title: 'Introduction & Context',
            questions: [
              { key: 'email_address', label: 'Email Address', type: 'text' },
              { key: 'organisation_name', label: 'Organization Name', type: 'text' },
              { key: 'fund_name', label: 'Fund Name', type: 'text' },
            ]
          },
          {
            title: 'Organizational Background and Team',
            questions: [
              { key: 'legal_entity_achieved', label: 'Legal Entity Achieved', type: 'text' },
              { key: 'geographic_markets', label: 'Geographic Markets', type: 'multiselect' },
              { key: 'team_based', label: 'Team Based', type: 'multiselect' },
              { key: 'fte_staff_current', label: 'Current FTE Staff', type: 'number' },
            ]
          },
          {
            title: 'Vehicle Construct',
            questions: [
              { key: 'legal_domicile', label: 'Legal Domicile', type: 'multiselect' },
              { key: 'currency_investments', label: 'Currency for Investments', type: 'text' },
              { key: 'fund_type_status', label: 'Fund Type Status', type: 'text' },
            ]
          },
          {
            title: 'Investment Thesis',
            questions: [
              { key: 'investment_thesis', label: 'Investment Thesis', type: 'textarea' },
              { key: 'target_sectors', label: 'Target Sectors', type: 'multiselect' },
              { key: 'investment_stage', label: 'Investment Stage', type: 'select' },
            ]
          }
        ];
      default:
        return [];
    }
  };

  const fetchSurveyResponse = async () => {
    try {
      setLoading(true);
      
      const tableName = `survey_${year}_responses`;
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116' || error.status === 406) {
          // No rows returned - survey not completed or permission denied
          setResponse(null);
          return;
        }
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

  const renderQuestionValue = (question: any, value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-500 italic">No response provided</span>;
    }

    switch (question.type) {
      case 'multiselect':
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-1">
              {value.map((item, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {item}
                </Badge>
              ))}
            </div>
          );
        }
        return <span>{String(value)}</span>;
      case 'boolean':
        return <span className={value ? 'text-green-600' : 'text-red-600'}>{value ? 'Yes' : 'No'}</span>;
      case 'textarea':
        return <div className="whitespace-pre-wrap">{String(value)}</div>;
      default:
        return <span>{String(value)}</span>;
    }
  };

  const renderSection = (section: SurveySection, sectionIndex: number) => (
    <TabsContent key={sectionIndex} value={String(sectionIndex + 1)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>{section.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {section.questions.map((question, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  {question.label}
                </label>
                <div className="text-sm text-gray-900">
                  {renderQuestionValue(question, response?.[question.key])}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </TabsContent>
  );

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

  if (!response) {
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

  const sections = getSurveySections(year || '');
  const visibleSections = userRole === 'admin' ? sections : sections.slice(0, 4);

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
                    Viewing responses for user ID: {userId}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{year}</span>
                </Badge>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{userRole === 'admin' ? 'All Sections' : 'First 4 Sections'}</span>
                </Badge>
              </div>
            </div>
          </div>

          {/* Survey Response Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
              {visibleSections.map((section, index) => (
                <TabsTrigger key={index} value={String(index + 1)}>
                  Section {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {visibleSections.map((section, index) => renderSection(section, index))}
          </Tabs>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SurveyResponseViewer;
