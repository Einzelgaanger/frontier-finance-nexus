import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export interface FundManagerDetailModalProps {
  userId: string;
  companyName: string;
  open: boolean;
  onClose: () => void;
}

interface SurveyYear {
  year: number;
  data: any;
}

export default function FundManagerDetailModal({ userId, companyName, open, onClose }: FundManagerDetailModalProps) {
  const { userRole } = useAuth();
  const [surveys, setSurveys] = useState<SurveyYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, { viewer: boolean; member: boolean; admin: boolean }>>({});

  useEffect(() => {
    if (open && userId) {
      fetchSurveys();
      fetchFieldVisibility();
    }
  }, [open, userId]);

  const fetchFieldVisibility = async () => {
    try {
      const { data, error } = await supabase
        .from('field_visibility')
        .select('field_name, viewer_visible, member_visible, admin_visible, survey_year');

      if (error) throw error;

      const visibilityMap: Record<string, { viewer: boolean; member: boolean; admin: boolean }> = {};
      data?.forEach((field: any) => {
        visibilityMap[`${field.field_name}_${field.survey_year}`] = {
          viewer: field.viewer_visible,
          member: field.member_visible,
          admin: field.admin_visible,
        };
      });
      
      setFieldVisibility(visibilityMap);
    } catch (error) {
      console.error('Error fetching field visibility:', error);
    }
  };

  const fetchSurveys = async () => {
    setLoading(true);
    const years = [2021, 2022, 2023, 2024];
    const surveyData: SurveyYear[] = [];

    for (const year of years) {
      try {
        const { data, error } = await supabase
          .from(`survey_responses_${year}` as any)
          .select('*')
          .eq('user_id', userId)
          .eq('submission_status', 'completed')
          .maybeSingle();

        if (data && !error) {
          surveyData.push({ year, data });
        }
      } catch (error) {
        console.error(`Error fetching ${year} survey:`, error);
      }
    }

    setSurveys(surveyData);
    if (surveyData.length > 0) {
      setSelectedYear(surveyData[0].year);
    }
    setLoading(false);
  };

  const isFieldVisible = (fieldName: string, year: number): boolean => {
    const key = `${fieldName}_${year}`;
    const visibility = fieldVisibility[key];
    
    if (!visibility) return false;
    
    if (userRole === 'admin') return visibility.admin;
    if (userRole === 'member') return visibility.member;
    if (userRole === 'viewer') return visibility.viewer;
    
    return false;
  };

  const getSectionData = (surveyData: any, year: number) => {
    if (!surveyData) return [];

    // Group visible fields by category
    const fieldsByCategory: Record<string, string[]> = {};
    
    Object.keys(surveyData).forEach(fieldName => {
      // Skip internal fields
      if (['id', 'user_id', 'created_at', 'updated_at', 'submission_status', 'completed_at', 'form_data'].includes(fieldName)) {
        return;
      }

      // Check if field is visible for current user role
      if (!isFieldVisible(fieldName, year)) {
        return;
      }

      // Categorize field
      let category = 'Other Information';
      if (fieldName.includes('email') || fieldName.includes('name') || fieldName.includes('organisation') || fieldName.includes('firm')) {
        category = 'Contact & Organization';
      } else if (fieldName.includes('fund') || fieldName.includes('capital') || fieldName.includes('raised') || fieldName.includes('target')) {
        category = 'Fund Information';
      } else if (fieldName.includes('investment') || fieldName.includes('sector') || fieldName.includes('stage') || fieldName.includes('instrument')) {
        category = 'Investment Strategy';
      } else if (fieldName.includes('team') || fieldName.includes('fte') || fieldName.includes('principal')) {
        category = 'Team & Operations';
      } else if (fieldName.includes('portfolio') || fieldName.includes('performance') || fieldName.includes('revenue') || fieldName.includes('jobs')) {
        category = 'Performance & Impact';
      }

      if (!fieldsByCategory[category]) {
        fieldsByCategory[category] = [];
      }
      fieldsByCategory[category].push(fieldName);
    });

    // Convert to sections array
    const sections = Object.entries(fieldsByCategory).map(([title, fields], idx) => ({
      id: idx + 1,
      title,
      fields
    }));

    return sections;
  };

  const isPlainObject = (val: unknown): val is Record<string, unknown> => {
    return Object.prototype.toString.call(val) === '[object Object]';
  };

  const renderArray = (arr: unknown[]) => {
    if (arr.length === 0) return <span className="text-muted-foreground">N/A</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((item, idx) => (
          <Badge key={idx} variant="secondary" className="px-2 py-0.5">
            {String(item)}
          </Badge>
        ))}
      </div>
    );
  };

  const renderObject = (obj: Record<string, unknown>) => {
    const entries = Object.entries(obj).filter(([k, v]) => k !== '_id');
    if (entries.length === 0) return <span className="text-muted-foreground">N/A</span>;

    return (
      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-start sm:gap-3">
            <span className="text-xs font-medium text-muted-foreground sm:w-1/3">
              {formatFieldName(key)}
            </span>
            <div className="text-sm sm:flex-1">
              {val === null || val === undefined ? (
                <span className="text-muted-foreground">N/A</span>
              ) : Array.isArray(val) ? (
                renderArray(val)
              ) : isPlainObject(val) ? (
                // One level deep rendering
                <div className="space-y-1">
                  {Object.entries(val as Record<string, unknown>).map(([k2, v2]) => (
                    <div key={k2} className="flex items-start gap-2">
                      <span className="text-xs font-medium text-muted-foreground min-w-[12rem]">
                        {formatFieldName(k2)}
                      </span>
                      <span className="text-sm">
                        {v2 === null || v2 === undefined
                          ? 'N/A'
                          : Array.isArray(v2)
                          ? (renderArray(v2) as unknown as string)
                          : isPlainObject(v2)
                          ? String(v2)
                          : String(v2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span>{String(val)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatFieldValue = (value: any): JSX.Element => {
    if (value === null || value === undefined) return <span className="text-muted-foreground">N/A</span>;
    if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
    if (Array.isArray(value)) return renderArray(value);
    if (isPlainObject(value)) return renderObject(value);
    return <span>{String(value)}</span>;
  };

  const formatFieldName = (field: string): string => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <span className="font-semibold">{companyName}</span>
            <span className="text-muted-foreground">Survey Responses</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">User has no surveys</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Year Selection */}
            <div className="flex gap-2 flex-wrap">
              {surveys.map((survey) => (
                <Badge
                  key={survey.year}
                  variant={selectedYear === survey.year ? 'default' : 'secondary'}
                  className={`cursor-pointer px-4 py-2 transition-colors ${selectedYear === survey.year ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  onClick={() => setSelectedYear(survey.year)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {survey.year}
                </Badge>
              ))}
            </div>

            {/* Section Tabs */}
            {selectedYear && (() => {
              const sections = getSectionData(
                surveys.find(s => s.year === selectedYear)?.data,
                selectedYear
              );

              if (sections.length === 0) {
                return (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No visible data for your access level</p>
                  </div>
                );
              }

              return (
                <Tabs defaultValue="section-1" className="w-full">
                  <TabsList className="w-full overflow-x-auto flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
                    {sections.map((section) => (
                      <TabsTrigger
                        key={section.id}
                        value={`section-${section.id}`}
                        className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        title={section.title}
                      >
                        {section.title.length > 22 ? section.title.substring(0, 20) + '…' : section.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {sections.map((section) => {
                    const surveyData = surveys.find(s => s.year === selectedYear)?.data;
                    return (
                      <TabsContent key={section.id} value={`section-${section.id}`}>
                        <Card>
                          <CardHeader className="border-b bg-muted/30">
                            <CardTitle className="flex items-center justify-between">
                              <span>{section.title}</span>
                              <Badge variant="outline">{section.fields.length} fields</Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {section.fields.map((field) => (
                                <div key={field} className="rounded-md border p-3 bg-background">
                                  <p className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">
                                    {formatFieldName(field)}
                                  </p>
                                  <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {formatFieldValue(surveyData?.[field])}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              );
            })()}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
