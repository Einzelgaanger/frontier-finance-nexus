import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SurveyResponseRow {
  id: number;
  question_column: string;
  original_question: string;
  response_value: string;
  data_type: string;
  created_at: string;
}

interface CompanyProfile {
  responseId: string; // The table number (e.g., "159" from survey_response_159_year_2024)
  company_name: string;
  contact_name: string;
  email: string;
  geographic_focus: string[];
  responses: Record<string, string>; // All question-answer pairs
  created_at: string;
}

const SURVEY_YEARS = [2021, 2022, 2023, 2024];

const ViewerNetworkPage = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [expandedPreview, setExpandedPreview] = useState<string | null>(null);

  // Get all survey response tables for a given year
  const getSurveyTableNames = async (year: number): Promise<string[]> => {
    try {
      console.log(`Finding survey tables for year ${year}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabaseAny = supabase as any;
      
      // Query information_schema to find all tables matching the pattern
      const { data, error } = await supabaseAny.rpc('get_survey_tables', { year_param: year });
      
      if (error) {
        console.error('Error getting table names:', error);
        // Fallback: try to query a range of table IDs
        const tables: string[] = [];
        for (let i = 1; i <= 200; i++) {
          tables.push(`survey_response_${i}_year_${year}`);
        }
        return tables;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getSurveyTableNames:', error);
      return [];
    }
  };

  // Query a single survey response table
  const querySurveyResponseTable = async (tableName: string): Promise<SurveyResponseRow[] | null> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from(tableName)
        .select('id, question_column, original_question, response_value, data_type, created_at');
      
      if (error) {
        // Table might not exist, that's okay
        return null;
      }
      
      return data as SurveyResponseRow[];
    } catch (error) {
      return null;
    }
  };

  // Convert rows to key-value object
  const pivotResponses = (rows: SurveyResponseRow[]): Record<string, string> => {
    const result: Record<string, string> = {};
    rows.forEach(row => {
      result[row.question_column] = row.response_value || '';
    });
    return result;
  };

  // Extract company profile from responses
  const extractCompanyProfile = (responseId: string, responses: Record<string, string>, year: number): CompanyProfile | null => {
    // Try different field names for email
    const email = responses.email_address || responses.email || responses.Email || responses['Email Address'] || '';
    
    // Try different field names for company
    const company_name = responses.organisation_name || responses.organization_name || 
                        responses.company_name || responses['Organisation Name'] || 
                        responses['Organization Name'] || responses['Company Name'] || 'Unknown Company';
    
    // Try different field names for contact
    const contact_name = responses.participant_name || responses.contact_name || 
                        responses.full_name || responses['Participant Name'] || 
                        responses['Contact Name'] || 'Unknown';
    
    // Try to get geographic markets
    const geoField = responses.geographic_markets || responses.geo_markets || 
                    responses['Geographic Markets'] || '';
    let geographic_focus: string[] = ['Global'];
    
    if (geoField) {
      try {
        // Might be JSON array or comma-separated
        if (geoField.startsWith('[')) {
          geographic_focus = JSON.parse(geoField);
        } else {
          geographic_focus = geoField.split(',').map(s => s.trim()).filter(Boolean);
        }
      } catch {
        geographic_focus = [geoField];
      }
    }
    
    // Get created_at from any response row
    const created_at = responses.created_at || new Date().toISOString();
    
    if (!email && !company_name) {
      return null; // Not enough data
    }
    
    return {
      responseId,
      company_name,
      contact_name,
      email,
      geographic_focus,
      responses,
      created_at
    };
  };

  // Fetch all companies for a given year
  const fetchCompanies = useCallback(async (year: number) => {
    setLoading(true);
    try {
      console.log(`Fetching companies for year ${year}`);
      
      const companyProfiles: CompanyProfile[] = [];
      
      // Try a range of response IDs (we know tables exist from 1 to ~200)
      const promises: Promise<void>[] = [];
      
      for (let i = 1; i <= 200; i++) {
        const tableName = `survey_response_${i}_year_${year}`;
        
        promises.push(
          (async () => {
            const rows = await querySurveyResponseTable(tableName);
            if (rows && rows.length > 0) {
              const responses = pivotResponses(rows);
              const profile = extractCompanyProfile(String(i), responses, year);
              if (profile) {
                companyProfiles.push(profile);
              }
            }
          })()
        );
      }
      
      // Process in batches to avoid overwhelming the database
      const batchSize = 20;
      for (let i = 0; i < promises.length; i += batchSize) {
        const batch = promises.slice(i, i + batchSize);
        await Promise.all(batch);
        console.log(`Processed batch ${i / batchSize + 1}, found ${companyProfiles.length} companies so far`);
      }
      
      console.log(`Found ${companyProfiles.length} companies for year ${year}`);
      setCompanies(companyProfiles);
      
      if (companyProfiles.length === 0) {
        toast({
          title: "No Data",
          description: `No survey responses found for ${year}`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to load company data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Filter companies based on search term
  const filterCompanies = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = companies.filter(company => 
      company.company_name.toLowerCase().includes(term) ||
      company.contact_name.toLowerCase().includes(term) ||
      company.email.toLowerCase().includes(term) ||
      company.geographic_focus.some(region => 
        region.toLowerCase().includes(term)
      )
    );
    setFilteredCompanies(filtered);
  }, [companies, searchTerm]);

  // Toggle preview of survey responses
  const togglePreview = useCallback((responseId: string) => {
    setExpandedPreview(prev => prev === responseId ? null : responseId);
  }, []);

  // useEffect hooks
  useEffect(() => {
    if (selectedYear) {
      fetchCompanies(selectedYear);
    }
  }, [selectedYear, fetchCompanies]);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm, filterCompanies]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5dc] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5dc] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Year Selector */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Network Participants</h1>
              <p className="text-gray-600">View companies that participated in the survey by year</p>
            </div>
            
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200">
              <Calendar className="w-5 h-5 text-gray-500" />
              <Select 
                value={String(selectedYear)}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger className="w-32 border-0 shadow-none focus:ring-0">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {SURVEY_YEARS.map(year => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Viewer Info Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Viewer Access</h3>
            <p className="text-sm text-blue-800">
              You can view company profiles and survey response previews. To access full profiles and detailed survey data, 
              please upgrade to a member account.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by company name, contact, or region..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
        </div>

        {/* Company Cards Grid */}
        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No companies found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : `No survey responses for ${selectedYear}`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.responseId} className="bg-white hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                        {company.company_name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">{company.contact_name}</p>
                      <p className="text-sm text-gray-500 truncate">{company.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {company.geographic_focus.slice(0, 3).map((region, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                      {company.geographic_focus.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{company.geographic_focus.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => togglePreview(company.responseId)}
                  >
                    {expandedPreview === company.responseId ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        View Preview
                      </>
                    )}
                  </Button>

                  {expandedPreview === company.responseId && (
                    <div className="w-full mt-2 p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                      <p className="font-semibold text-gray-700">Survey Response Preview:</p>
                      {Object.entries(company.responses).slice(0, 5).map(([key, value]) => (
                        <div key={key} className="border-b border-gray-200 pb-1">
                          <p className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</p>
                          <p className="text-sm text-gray-800 truncate">{value || 'N/A'}</p>
                        </div>
                      ))}
                      {Object.keys(company.responses).length > 5 && (
                        <p className="text-xs text-gray-500 italic">
                          +{Object.keys(company.responses).length - 5} more responses
                        </p>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewerNetworkPage;
