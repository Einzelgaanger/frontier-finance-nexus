
import { useState, useEffect } from 'react';
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
  ChevronUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [invitationCodes, setInvitationCodes] = useState([]);
  const [dataFieldVisibility, setDataFieldVisibility] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [requestsRes, codesRes, visibilityRes] = await Promise.all([
        supabase.from('membership_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('invitation_codes').select('*').order('created_at', { ascending: false }),
        supabase.from('data_field_visibility').select('*').order('field_name')
      ]);

      if (requestsRes.error) throw requestsRes.error;
      if (codesRes.error) throw codesRes.error;
      if (visibilityRes.error) throw visibilityRes.error;

      setMembershipRequests(requestsRes.data || []);
      setInvitationCodes(codesRes.data || []);
      setDataFieldVisibility(visibilityRes.data || []);
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
  };

  const approveRequest = async (requestId: string, email: string, vehicleName: string) => {
    try {
      // Generate invitation code
      const invitationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      console.log('Creating invitation code:', { code: invitationCode, email, vehicleName });
      
      const { error: codeError } = await supabase
        .from('invitation_codes')
        .insert({
          code: invitationCode,
          email: email,
          vehicle_name: vehicleName,
          created_by: (await supabase.auth.getUser()).data.user?.id,
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
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
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
      const { error } = await supabase
        .from('membership_requests')
        .update({ 
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
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
    try {
      const { error } = await supabase
        .from('data_field_visibility')
        .update({ 
          visibility_level: visibilityLevel,
          updated_at: new Date().toISOString(),
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('field_name', fieldName);

      if (error) throw error;

      toast({
        title: "Visibility Updated",
        description: `${fieldName} visibility set to ${visibilityLevel}`,
      });

      fetchData();
    } catch (error) {
      console.error('Error updating field visibility:', error);
      toast({
        title: "Error",
        description: "Failed to update field visibility",
        variant: "destructive"
      });
    }
  };

  const exportData = async () => {
    setExportLoading(true);
    try {
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

      if (error) throw error;

      // Prepare data for export
      const exportData = data?.map(profile => ({
        'Fund Manager': profile.vehicle_name || 'N/A',
        'Email': profile.email || 'N/A',
        'Created Date': profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A',
        'Role': profile.role || 'N/A',
        'Survey Responses': profile.survey_responses?.length || 0,
        'Latest Survey Year': profile.survey_responses?.[0]?.year || 'N/A'
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
                          >
                            <SelectTrigger className="w-full sm:w-[120px] text-xs sm:text-sm">
                              <SelectValue />
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
