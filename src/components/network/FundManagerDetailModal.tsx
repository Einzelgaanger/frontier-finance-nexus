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

  useEffect(() => {
    if (open && userId) {
      fetchSurveys();
    }
  }, [open, userId]);

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

  const getSectionData = (surveyData: any, year: number) => {
    // Define sections based on year - show first 4 for members, all for admins
    const allSections = {
      2021: [
        { id: 1, title: 'Background Information', fields: ['email_address', 'firm_name', 'participant_name', 'role_title', 'team_based', 'geographic_focus', 'fund_stage'] },
        { id: 2, title: 'Investment Thesis & Capital', fields: ['investment_vehicle_type', 'current_fund_size', 'target_fund_size', 'investment_timeframe'] },
        { id: 3, title: 'Portfolio & Team', fields: ['investment_forms', 'target_sectors', 'carried_interest_principals', 'current_ftes'] },
        { id: 4, title: 'Portfolio Development', fields: ['investment_monetization', 'exits_achieved'] },
        { id: 5, title: 'COVID-19 Impact', fields: ['covid_impact_aggregate', 'covid_government_support'] },
        { id: 6, title: 'Network Feedback', fields: ['network_value_rating', 'communication_platform'] },
        { id: 7, title: 'Convening Objectives', fields: ['participate_mentoring_program', 'additional_comments'] },
      ],
      2022: [
        { id: 1, title: 'Organization Details', fields: ['name', 'organisation', 'email', 'role_title'] },
        { id: 2, title: 'Fund Information', fields: ['legal_domicile', 'fund_operations', 'current_funds_raised', 'target_fund_size'] },
        { id: 3, title: 'Investment Strategy', fields: ['financial_instruments', 'sector_activities', 'business_stages'] },
        { id: 4, title: 'Team & Operations', fields: ['current_ftes', 'principals_count', 'team_based'] },
        { id: 5, title: 'Portfolio Performance', fields: ['investments_made_to_date', 'equity_exits_achieved', 'revenue_growth_recent_12_months'] },
        { id: 6, title: 'Market Factors', fields: ['domestic_factors_concerns', 'international_factors_concerns'] },
      ],
      2023: [
        { id: 1, title: 'Basic Information', fields: ['email_address', 'organisation_name', 'fund_name', 'funds_raising_investing'] },
        { id: 2, title: 'Fund Structure', fields: ['legal_domicile', 'fund_type_status', 'current_funds_raised', 'target_fund_size'] },
        { id: 3, title: 'Investment Approach', fields: ['financial_instruments', 'sector_focus', 'business_stages'] },
        { id: 4, title: 'Team Composition', fields: ['fte_staff_current', 'principals_count', 'team_based'] },
        { id: 5, title: 'Performance Metrics', fields: ['revenue_growth_historical', 'cash_flow_growth_historical', 'jobs_impact_historical_direct'] },
        { id: 6, title: 'Strategic Priorities', fields: ['fund_priorities', 'concerns_ranking'] },
      ],
      2024: [
        { id: 1, title: 'Organization Profile', fields: ['email_address', 'organisation_name', 'fund_name', 'funds_raising_investing'] },
        { id: 2, title: 'Fund Details', fields: ['legal_domicile', 'fund_type_status', 'hard_commitments_current', 'target_fund_size_current'] },
        { id: 3, title: 'Investment Focus', fields: ['sector_target_allocation', 'business_stages', 'financial_instruments_ranking'] },
        { id: 4, title: 'Operations', fields: ['fte_staff_current', 'principals_total', 'team_based'] },
        { id: 5, title: 'Portfolio Outcomes', fields: ['equity_investments_made', 'portfolio_revenue_growth_12m', 'direct_jobs_current'] },
        { id: 6, title: 'Strategic Focus', fields: ['fund_priorities_next_12m', 'fundraising_barriers'] },
      ],
    };

    const sections = allSections[year as keyof typeof allSections] || [];
    
    // Return first 4 sections for members, all for admins
    return userRole === 'admin' ? sections : sections.slice(0, 4);
  };

  const formatFieldValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (Array.isArray(value)) return value.join(', ') || 'N/A';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="w-6 h-6" />
            {companyName} - Survey Responses
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
                  variant={selectedYear === survey.year ? 'default' : 'outline'}
                  className="cursor-pointer px-4 py-2"
                  onClick={() => setSelectedYear(survey.year)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {survey.year}
                </Badge>
              ))}
            </div>

            {/* Section Tabs */}
            {selectedYear && (
              <Tabs defaultValue="section-1" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  {getSectionData(
                    surveys.find(s => s.year === selectedYear)?.data,
                    selectedYear
                  ).map((section) => (
                    <TabsTrigger key={section.id} value={`section-${section.id}`}>
                      Section {section.id}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {getSectionData(
                  surveys.find(s => s.year === selectedYear)?.data,
                  selectedYear
                ).map((section) => {
                  const surveyData = surveys.find(s => s.year === selectedYear)?.data;
                  return (
                    <TabsContent key={section.id} value={`section-${section.id}`}>
                      <Card>
                        <CardHeader>
                          <CardTitle>{section.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {section.fields.map((field) => (
                              <div key={field} className="border-b pb-3 last:border-b-0">
                                <p className="font-medium text-sm text-muted-foreground mb-1">
                                  {formatFieldName(field)}
                                </p>
                                <p className="text-sm whitespace-pre-wrap">
                                  {formatFieldValue(surveyData?.[field])}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  );
                })}
              </Tabs>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
