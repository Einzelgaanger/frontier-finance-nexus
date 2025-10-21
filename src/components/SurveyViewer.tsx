import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Eye, EyeOff, Shield } from 'lucide-react';

interface SurveyData {
  id: string;
  user_id: string;
  email_address?: string;
  email?: string;
  organisation_name?: string;
  organisation?: string;
  firm_name?: string;
  fund_name?: string;
  form_data: Record<string, any>;
  completed_at: string;
  [key: string]: any;
}

interface FieldVisibility {
  field_name: string;
  visibility_level: 'public' | 'member' | 'admin';
}

export default function SurveyViewer() {
  const { userId, year } = useParams<{ userId: string; year: string }>();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [managerName, setManagerName] = useState('');

  useEffect(() => {
    if (userId && year) {
      fetchSurveyData();
      fetchFieldVisibility();
      fetchManagerName();
    }
  }, [userId, year]);

  const fetchManagerName = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();
      
      if (data) {
        setManagerName(`${data.first_name} ${data.last_name}`);
      }
    } catch (error) {
      console.error('Error fetching manager name:', error);
    }
  };

  const fetchFieldVisibility = async () => {
    try {
      const { data, error } = await supabase
        .from('data_field_visibility')
        .select('field_name, visibility_level');

      if (error) throw error;

      const visibilityMap: Record<string, string> = {};
      data?.forEach((item: FieldVisibility) => {
        visibilityMap[item.field_name] = item.visibility_level;
      });
      
      setFieldVisibility(visibilityMap);
    } catch (error) {
      console.error('Error fetching field visibility:', error);
    }
  };

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const tableName = `survey_${year}_responses`;
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setSurveyData(data);
    } catch (error) {
      console.error('Error fetching survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const canViewField = (fieldName: string): boolean => {
    // Check if field has visibility rules
    const visibility = fieldVisibility[fieldName] || fieldVisibility[`${year}_${fieldName}`];
    
    if (!visibility) {
      // Default: members can see if no rule defined
      return userRole === 'admin' || userRole === 'member';
    }

    // Check visibility level
    if (visibility === 'public') return true;
    if (visibility === 'member') return userRole === 'admin' || userRole === 'member';
    if (visibility === 'admin') return userRole === 'admin';
    
    return false;
  };

  const getVisibilityBadge = (fieldName: string) => {
    const visibility = fieldVisibility[fieldName] || fieldVisibility[`${year}_${fieldName}`] || 'member';
    
    const colors = {
      public: 'bg-green-100 text-green-800',
      member: 'bg-blue-100 text-blue-800',
      admin: 'bg-red-100 text-red-800',
    };

    if (userRole !== 'admin') return null;

    return (
      <Badge variant="outline" className={`ml-2 text-xs ${colors[visibility as keyof typeof colors]}`}>
        {visibility}
      </Badge>
    );
  };

  const renderFieldValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted-foreground italic">Not provided</span>;
    }

    if (Array.isArray(value)) {
      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, idx) => (
            <Badge key={idx} variant="secondary">{item}</Badge>
          ))}
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return <span>{String(value)}</span>;
  };

  const renderSurveyFields = () => {
    if (!surveyData) return null;

    const fields = Object.entries(surveyData).filter(([key]) => 
      !['id', 'user_id', 'created_at', 'updated_at', 'submission_status'].includes(key)
    );

    // Group fields by section (basic heuristic)
    const sections: Record<string, [string, any][]> = {
      'Basic Information': [],
      'Organization Details': [],
      'Fund Information': [],
      'Survey Responses': [],
    };

    fields.forEach(([key, value]) => {
      if (['email', 'email_address', 'name', 'participant_name', 'role_title'].includes(key)) {
        sections['Basic Information'].push([key, value]);
      } else if (['organisation', 'organisation_name', 'firm_name'].includes(key)) {
        sections['Organization Details'].push([key, value]);
      } else if (['fund_name', 'funds_raising_investing'].includes(key)) {
        sections['Fund Information'].push([key, value]);
      } else if (key === 'form_data' && value && typeof value === 'object') {
        // Expand form_data fields
        Object.entries(value).forEach(([formKey, formValue]) => {
          sections['Survey Responses'].push([formKey, formValue]);
        });
      } else {
        sections['Survey Responses'].push([key, value]);
      }
    });

    return Object.entries(sections).map(([sectionName, sectionFields]) => {
      if (sectionFields.length === 0) return null;

      // Filter fields based on visibility
      const visibleFields = sectionFields.filter(([key]) => canViewField(key));
      
      if (visibleFields.length === 0) return null;

      return (
        <div key={sectionName} className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {sectionName}
            <span className="text-sm text-muted-foreground font-normal">
              ({visibleFields.length} fields)
            </span>
          </h3>
          <div className="space-y-4">
            {visibleFields.map(([key, value]) => (
              <div key={key} className="border-b pb-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    {getVisibilityBadge(key)}
                  </label>
                </div>
                <div className="text-sm">
                  {renderFieldValue(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(`/network/fund-manager/${userId}`)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <p className="text-center text-muted-foreground">Survey response not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(`/network/fund-manager/${userId}`)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Profile
      </Button>

      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                {year} Survey Response
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {managerName}
                {surveyData.organisation_name && ` • ${surveyData.organisation_name}`}
                {surveyData.fund_name && ` • ${surveyData.fund_name}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{year}</Badge>
              {userRole === 'admin' && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Admin View
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Survey Data */}
      <Card>
        <CardContent className="pt-6">
          {renderSurveyFields()}
          
          {userRole !== 'admin' && (
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                You are viewing this survey as a <strong>{userRole}</strong>. 
                Some fields may be hidden based on visibility settings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
