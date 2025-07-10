
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Key, 
  Shield,
  Calendar,
  Download,
  Settings,
  Eye,
  EyeOff,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { userRole, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [invitationCodes, setInvitationCodes] = useState([]);
  const [dataFieldVisibility, setDataFieldVisibility] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [updatingVisibility, setUpdatingVisibility] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    viewers: 0,
    members: 0,
    admins: 0,
    activeUsersToday: 0,
    surveysCompleted: 0,
    newRegistrations: 0
  });

  const createDefaultDataFieldVisibility = useCallback(async () => {
    try {
      const defaultFields = [
        { field_name: 'vehicle_type', visibility_level: 'public' },
        { field_name: 'thesis', visibility_level: 'member' },
        { field_name: 'team_size_min', visibility_level: 'member' },
        { field_name: 'team_size_max', visibility_level: 'member' },
        { field_name: 'legal_domicile', visibility_level: 'public' },
        { field_name: 'target_capital', visibility_level: 'member' },
        { field_name: 'capital_raised', visibility_level: 'member' },
        { field_name: 'fund_stage', visibility_level: 'member' },
        { field_name: 'sectors_allocation', visibility_level: 'member' },
        { field_name: 'target_return_min', visibility_level: 'member' },
        { field_name: 'target_return_max', visibility_level: 'member' },
        { field_name: 'equity_investments_made', visibility_level: 'member' },
        { field_name: 'equity_investments_exited', visibility_level: 'member' },
        { field_name: 'self_liquidating_made', visibility_level: 'member' },
        { field_name: 'self_liquidating_exited', visibility_level: 'member' },
        { field_name: 'ticket_size_min', visibility_level: 'member' },
        { field_name: 'ticket_size_max', visibility_level: 'member' },
        { field_name: 'current_status', visibility_level: 'member' },
        { field_name: 'team_members', visibility_level: 'member' },
        { field_name: 'team_description', visibility_level: 'member' },
        { field_name: 'markets_operated', visibility_level: 'member' },
        { field_name: 'investment_instruments_priority', visibility_level: 'member' },
        { field_name: 'information_sharing', visibility_level: 'member' },
        { field_name: 'expectations', visibility_level: 'member' },
        { field_name: 'how_heard_about_network', visibility_level: 'member' },
        { field_name: 'supporting_document_url', visibility_level: 'admin' },
        { field_name: 'vehicle_websites', visibility_level: 'public' },
        { field_name: 'vehicle_type_other', visibility_level: 'member' },
        { field_name: 'legal_entity_date_from', visibility_level: 'member' },
        { field_name: 'legal_entity_date_to', visibility_level: 'member' },
        { field_name: 'first_close_date_from', visibility_level: 'member' },
        { field_name: 'first_close_date_to', visibility_level: 'member' },
        { field_name: 'legal_entity_month_from', visibility_level: 'member' },
        { field_name: 'legal_entity_month_to', visibility_level: 'member' },
        { field_name: 'first_close_month_from', visibility_level: 'member' },
        { field_name: 'first_close_month_to', visibility_level: 'member' },
        { field_name: 'ticket_description', visibility_level: 'member' },
        { field_name: 'capital_in_market', visibility_level: 'member' }
      ];

      const { error } = await supabase
        .from('data_field_visibility')
        .insert(defaultFields);

      if (error) {
        console.error('Error creating default data field visibility:', error);
        throw error;
      }

      console.log('Default data field visibility entries created successfully');
      
      // Refresh the data
      const { data: newVisibilityData, error: refreshError } = await supabase
        .from('data_field_visibility')
        .select('*')
        .order('field_name');

      if (refreshError) {
        console.error('Error refreshing data field visibility:', refreshError);
      } else {
        setDataFieldVisibility(newVisibilityData || []);
      }
    } catch (error) {
      console.error('Error creating default data field visibility:', error);
      toast({
        title: "Error",
        description: "Failed to create default data field visibility",
        variant: "destructive"
      });
    }
  }, [toast]);

  const fetchUserStats = useCallback(async () => {
    try {
      // Fetch user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role');

      if (rolesError) throw rolesError;

      // Count users by role
      const viewers = userRoles?.filter(ur => ur.role === 'viewer').length || 0;
      const members = userRoles?.filter(ur => ur.role === 'member').length || 0;
      const admins = userRoles?.filter(ur => ur.role === 'admin').length || 0;

      // Fetch completed surveys
      const { data: surveys, error: surveysError } = await supabase
        .from('survey_responses')
        .select('completed_at')
        .not('completed_at', 'is', null);

      if (surveysError) throw surveysError;

      // Fetch profiles created today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: newProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', today.toISOString());

      if (profilesError) throw profilesError;

      setUserStats({
        viewers,
        members,
        admins,
        activeUsersToday: 0, // This would need session tracking
        surveysCompleted: surveys?.length || 0,
        newRegistrations: newProfiles?.length || 0
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching admin data...');
      
      // Fetch membership requests
      const requestsRes = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Membership requests response:', requestsRes);
      
      if (requestsRes.error) {
        console.error('Membership requests error:', requestsRes.error);
        throw requestsRes.error;
      }

      // Fetch invitation codes
      const codesRes = await supabase
        .from('invitation_codes')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Invitation codes response:', codesRes);
      
      if (codesRes.error) {
        console.error('Invitation codes error:', codesRes.error);
        throw codesRes.error;
      }

      // Fetch data field visibility
      const visibilityRes = await supabase
        .from('data_field_visibility')
        .select('*')
        .order('field_name');
      
      console.log('Data field visibility response:', visibilityRes);
      
      if (visibilityRes.error) {
        console.error('Data field visibility error:', visibilityRes.error);
        throw visibilityRes.error;
      }

      // Set the data
      const requestsData = requestsRes.data || [];
      const codesData = codesRes.data || [];
      const visibilityData = visibilityRes.data || [];

      console.log('Setting data:', {
        requests: requestsData.length,
        codes: codesData.length,
        visibility: visibilityData.length
      });

      setMembershipRequests(requestsData);
      setInvitationCodes(codesData);
      setDataFieldVisibility(visibilityData);

      // If no data field visibility entries exist, create them
      if (visibilityData.length === 0) {
        console.log('No data field visibility entries found, creating default entries...');
        await createDefaultDataFieldVisibility();
      }

      // Fetch user stats
      await fetchUserStats();

      // Test query to check if we can access the data
      console.log('Testing data access...');
      const testQuery = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      console.log('Test query result:', testQuery);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, createDefaultDataFieldVisibility, fetchUserStats]);

  useEffect(() => {
    console.log('Admin component mounted, userRole:', userRole, 'user:', user?.id);
    if (userRole === 'admin') {
      console.log('User is admin, fetching data...');
      fetchData();
    } else {
      console.log('User is not admin, role:', userRole);
    }
  }, [userRole, fetchData, user?.id]);

  // Function to create sample data for testing (can be removed in production)
  const createSampleData = async () => {
    try {
      console.log('Creating sample data for testing...');
      
      // Create a sample membership request
      const { error: requestError } = await supabase
        .from('membership_requests')
        .insert({
          user_id: user?.id,
          vehicle_name: 'Sample Fund I',
          email: 'sample@example.com',
          status: 'pending'
        });

      if (requestError) {
        console.error('Error creating sample membership request:', requestError);
      } else {
        console.log('Sample membership request created');
      }

      // Create a sample invitation code
      const { error: codeError } = await supabase
        .from('invitation_codes')
        .insert({
          code: 'SAMPLE123',
          email: 'sample@example.com',
          vehicle_name: 'Sample Fund I',
          created_by: user?.id,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

      if (codeError) {
        console.error('Error creating sample invitation code:', codeError);
      } else {
        console.log('Sample invitation code created');
      }

      // Refresh data after creating samples
      fetchData();

    } catch (error) {
      console.error('Error creating sample data:', error);
    }
  };

  const approveRequest = async (requestId: string, email: string, vehicleName: string) => {
    try {
      // Check if user is authenticated
      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to perform this action",
          variant: "destructive"
        });
        return;
      }

      // Generate invitation code
      const invitationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      console.log('Creating invitation code:', { code: invitationCode, email, vehicleName, created_by: user.id });
      
      const { error: codeError } = await supabase
        .from('invitation_codes')
        .insert({
          code: invitationCode,
          email: email,
          vehicle_name: vehicleName,
          created_by: user.id,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        });

      if (codeError) {
        console.error('Error creating invitation code:', codeError);
        throw codeError;
      }

      // Update membership request status
      const { error: updateError } = await supabase
        .from('membership_requests')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', requestId);

      if (updateError) {
        console.error('Error approving request:', updateError);
        throw updateError;
      }

      toast({
        title: "Request Approved",
        description: `Invitation code ${invitationCode} generated for ${email}`,
      });

      fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive"
      });
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      // Check if user is authenticated
      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to perform this action",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('membership_requests')
        .update({ 
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Rejected",
        description: "Membership request has been rejected",
      });

      fetchData();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive"
      });
    }
  };

  const updateFieldVisibility = async (fieldName: string, visibilityLevel: string) => {
    // Prevent multiple simultaneous updates
    if (updatingVisibility === fieldName) return;
    
    try {
      setUpdatingVisibility(fieldName);
      
      // Check if user is authenticated
      if (!user?.id) {
        toast({
          title: "Authentication Error",
          description: "Please log in again to perform this action",
          variant: "destructive"
        });
        return;
      }

      // Optimistically update the local state first
      setDataFieldVisibility(prev => 
        prev.map(field => 
          field.field_name === fieldName 
            ? { ...field, visibility_level: visibilityLevel }
            : field
        )
      );

      const { error } = await supabase
        .from('data_field_visibility')
        .update({ 
          visibility_level: visibilityLevel,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .eq('field_name', fieldName);

      if (error) {
        // Revert the optimistic update if there's an error
        setDataFieldVisibility(prev => 
          prev.map(field => 
            field.field_name === fieldName 
              ? { ...field, visibility_level: field.visibility_level }
              : field
          )
        );
        throw error;
      }

      toast({
        title: "Visibility Updated",
        description: `${fieldName} visibility set to ${visibilityLevel}`,
      });
    } catch (error) {
      console.error('Error updating field visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update field visibility",
        variant: "destructive"
      });
    } finally {
      setUpdatingVisibility(null);
    }
  };

  const exportData = async () => {
    setExportLoading(true);
    try {
      console.log('Starting data export for period:', selectedDateRange);
      
      // Fetch fund managers data for the selected time period
      let query = supabase
        .from('profiles')
        .select(`
          *,
          survey_responses (
            *,
            year
          )
        `);

      // Apply date filter
      if (selectedDateRange !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (selectedDateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            startDate = null;
        }

        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      const { data, error } = await query;

      console.log('Export query result:', { data: data?.length, error });

      if (error) {
        console.error('Export query error:', error);
        throw error;
      }

      // Prepare data for export
      const exportData = data?.map(profile => ({
        'Fund Manager': `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A',
        'Email': profile.email || 'N/A',
        'Created Date': profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A',
        'Role': 'N/A', // Role is stored in user_roles table
        'Survey Responses': Array.isArray(profile.survey_responses) ? profile.survey_responses.length : 0,
        'Latest Survey Year': Array.isArray(profile.survey_responses) && profile.survey_responses.length > 0 
          ? (profile.survey_responses[0] as any)?.year || 'N/A' 
          : 'N/A'
      })) || [];

      // Create CSV content
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `fund_managers_${selectedDateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Successful",
        description: `Fund managers data exported for ${selectedDateRange}`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Admin Access Required
              </CardTitle>
              <CardDescription className="text-red-700">
                You need Administrator privileges to access this page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingRequests = membershipRequests.filter(req => req.status === 'pending');
  const approvedRequests = membershipRequests.filter(req => req.status === 'approved');
  const activeInvitationCodes = invitationCodes.filter(code => !code.used_at && new Date(code.expires_at) > new Date());

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black flex items-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage membership requests, invitation codes, and data visibility</p>
            </div>
            
            {/* Filters and Export Section */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Filter Toggle Button */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center sm:w-auto border-gray-300 bg-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
              
              {/* Export Button */}
              <Button 
                variant="outline" 
                onClick={exportData} 
                disabled={exportLoading}
                className="flex items-center justify-center sm:w-auto border-gray-300 bg-white"
              >
                <Download className="w-4 h-4 mr-2" />
                {exportLoading ? 'Exporting...' : 'Export Data'}
              </Button>

              {/* Sample Data Button (for testing) */}
              <Button 
                variant="outline" 
                onClick={createSampleData}
                className="flex items-center justify-center sm:w-auto border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Sample Data
              </Button>
            </div>
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Label className="text-sm font-medium text-gray-700">Time Period:</Label>
                <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                  <SelectTrigger className="w-full sm:w-[180px] border-gray-300 bg-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Viewers</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{userStats.viewers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Members</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{userStats.members}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Admins</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{userStats.admins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Surveys</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{userStats.surveysCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{approvedRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Key className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Active Codes</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{activeInvitationCodes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Data Fields</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">{dataFieldVisibility.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info (only show if no data) */}
        {(membershipRequests.length === 0 && invitationCodes.length === 0 && dataFieldVisibility.length === 0) && (
          <Card className="bg-yellow-50 border-yellow-200 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-900 mb-1">No Data Found</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    The admin dashboard is not showing any data. This could be because:
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1 mb-3">
                    <li>• No membership requests have been submitted yet</li>
                    <li>• No invitation codes have been generated</li>
                    <li>• Data field visibility settings haven't been initialized</li>
                    <li>• There might be a database connection issue</li>
                  </ul>
                  <p className="text-sm text-yellow-700">
                    Check the browser console for detailed error messages. You can also use the "Create Sample Data" button to test the functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs defaultValue="requests" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white h-auto p-1">
            <TabsTrigger 
              value="requests" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Membership Requests
            </TabsTrigger>
            <TabsTrigger 
              value="codes" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Invitation Codes
            </TabsTrigger>
            <TabsTrigger 
              value="visibility" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-3"
            >
              Data Visibility
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4 sm:space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black text-lg sm:text-xl">Membership Requests</CardTitle>
                <CardDescription>Review and manage membership applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {membershipRequests.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No membership requests found</p>
                  ) : (
                    membershipRequests.map((request) => (
                      <div key={request.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg space-y-4 lg:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="space-y-1">
                            <p className="font-medium text-black text-sm sm:text-base truncate">{request.email}</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{request.vehicle_name}</p>
                            <p className="text-xs text-gray-400">
                              Requested: {new Date(request.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:flex-shrink-0">
                          <Badge 
                            variant={
                              request.status === 'approved' ? 'default' : 
                              request.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }
                            className="w-fit text-xs"
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                          {request.status === 'pending' && (
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approveRequest(request.id, request.email, request.vehicle_name)}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs whitespace-nowrap"
                              >
                                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectRequest(request.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50 text-xs whitespace-nowrap"
                              >
                                <UserX className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes" className="space-y-4 sm:space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black text-lg sm:text-xl">Invitation Codes</CardTitle>
                <CardDescription>Manage generated invitation codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invitationCodes.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No invitation codes found</p>
                  ) : (
                    invitationCodes.map((code) => (
                      <div key={code.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg space-y-4 lg:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="space-y-1">
                            <p className="font-mono font-bold text-base sm:text-lg text-black break-all">{code.code}</p>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{code.email} - {code.vehicle_name}</p>
                            <p className="text-xs text-gray-400">
                              Created: {new Date(code.created_at).toLocaleDateString()} | 
                              Expires: {new Date(code.expires_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:flex-shrink-0">
                          <Badge 
                            variant={
                              code.used_at ? 'default' : 
                              new Date(code.expires_at) < new Date() ? 'destructive' : 
                              'secondary'
                            }
                            className="w-fit text-xs"
                          >
                            {code.used_at ? 'Used' : new Date(code.expires_at) < new Date() ? 'Expired' : 'Active'}
                          </Badge>
                          {code.used_at && (
                            <p className="text-xs text-gray-500">
                              Used: {new Date(code.used_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visibility" className="space-y-4 sm:space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black text-lg sm:text-xl">Data Field Visibility</CardTitle>
                <CardDescription>Configure visibility permissions for survey data fields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataFieldVisibility.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No data field visibility settings found</p>
                  ) : (
                    dataFieldVisibility.map((field) => (
                      <div key={field.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg space-y-4 lg:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="space-y-1">
                            <p className="font-medium text-black text-sm sm:text-base">{field.field_name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                            <p className="text-xs sm:text-sm text-gray-600">Field: {field.field_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center lg:flex-shrink-0">
                          <Select
                            value={field.visibility_level}
                            onValueChange={(value) => updateFieldVisibility(field.field_name, value)}
                            disabled={updatingVisibility === field.field_name}
                          >
                            <SelectTrigger className={`w-full sm:w-[120px] text-xs sm:text-sm ${
                              updatingVisibility === field.field_name ? 'opacity-50 cursor-not-allowed' : ''
                            }`}>
                              <SelectValue />
                              {updatingVisibility === field.field_name && (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 ml-2" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">
                                <div className="flex items-center">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Public
                                </div>
                              </SelectItem>
                              <SelectItem value="member">
                                <div className="flex items-center">
                                  <Users className="w-4 h-4 mr-2" />
                                  Member
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center">
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Admin
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
