// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import AdminFundManagers from '@/components/admin/AdminFundManagers';
import ApplicationManagement from '@/components/admin/ApplicationManagement';
import CreateUserModal from '@/components/admin/CreateUserModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { 
  Shield, 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  Activity, 
  UserPlus, 
  Mail, 
  MapPin, 
  Calendar, 
  XCircle, 
  Eye,
  RefreshCw,
  Search,
  BarChart3
} from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

interface Profile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  updated_at: string;
}

interface MembershipRequest {
  id: string;
  user_id: string;
  applicant_name: string;
  email: string;
  vehicle_name: string;
  vehicle_website?: string | null;
  domicile_country?: string | null;
  organization_name?: string | null;
  country_of_operation?: string | null;
  role_job_title?: string | null;
  team_size?: string | null;
  team_description?: string | null;
  location?: string | null;
  thesis?: string | null;
  ticket_size?: string | null;
  portfolio_investments?: string | null;
  capital_raised?: string | null;
  supporting_documents?: string | null;
  supporting_document_links?: string | null;
  information_sharing?: any;
  expectations?: string | null;
  how_heard_about_network?: string | null;
  status: string;
  created_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

interface ActivityLogDetails {
  applicant_name?: string;
  old_role?: string;
  new_role?: string;
  target_user_id?: string;
  [key: string]: any;
}

interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  details: any;
  created_at: string;
  user_agent: string | null;
}

const AdminV2 = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [requestsResult, profilesResult, logsResult] = await Promise.all([
        supabase.from('membership_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      if (requestsResult.error) throw requestsResult.error;
      if (profilesResult.error) throw profilesResult.error;
      if (logsResult.error) throw logsResult.error;

      setMembershipRequests(requestsResult.data || []);
      setProfiles(profilesResult.data || []);
      setActivityLogs(logsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Computed values
  const stats = useMemo(() => {
    const totalRequests = membershipRequests.length;
    const pendingRequests = membershipRequests.filter(r => r.status === 'pending').length;
    const approvedRequests = membershipRequests.filter(r => r.status === 'approved').length;
    const rejectedRequests = membershipRequests.filter(r => r.status === 'rejected').length;
    const totalProfiles = profiles.length;
    const activeProfiles = profiles.length; // All profiles are considered active

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalProfiles,
      activeProfiles,
      approvalRate: totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0
    };
  }, [membershipRequests, profiles]);

  // Filter data
  const filteredRequests = useMemo(() => {
    let filtered = membershipRequests;
    
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    return filtered;
  }, [membershipRequests, searchTerm, statusFilter]);

  // Handle application review
  const handleReviewApplication = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', requestId);

      if (error) throw error;

      // Log the activity
      await supabase.from('activity_logs').insert({
        user_id: user?.id,
        action: `application_${status}`,
        details: {
          applicant_name: membershipRequests.find(r => r.id === requestId)?.applicant_name,
          target_user_id: membershipRequests.find(r => r.id === requestId)?.user_id
        }
      });

      toast({
        title: "Success",
        description: `Application ${status} successfully.`,
      });

      fetchAllData();
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast({
        title: "Error",
        description: "Failed to review application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewApplication = (request: MembershipRequest) => {
    setSelectedRequest(request);
    setShowApplicationModal(true);
  };

  // Chart data
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayRequests = membershipRequests.filter(r => 
        r.created_at && r.created_at.split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        applications: dayRequests.length,
        approved: dayRequests.filter(r => r.status === 'approved').length,
        rejected: dayRequests.filter(r => r.status === 'rejected').length
      };
    });
  }, [membershipRequests]);

  const statusDistribution = useMemo(() => {
    const statuses = ['pending', 'approved', 'rejected'];
    return statuses.map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: membershipRequests.filter(r => r.status === status).length,
      color: status === 'pending' ? '#F59E0B' : status === 'approved' ? '#10B981' : '#EF4444'
    }));
  }, [membershipRequests]);

  if (userRole !== 'admin') {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Ultra-Professional Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/CFF LOGO.png" 
                  alt="CFF Logo" 
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Admin Control Center</h1>
                  <p className="text-gray-600 mt-1">Comprehensive network management and analytics</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={fetchAllData}
                  disabled={loading}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Administrator</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Applications</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.totalRequests}</p>
                    <p className="text-xs text-blue-600 mt-1">All time</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Pending Review</p>
                    <p className="text-3xl font-bold text-yellow-900">{stats.pendingRequests}</p>
                    <p className="text-xs text-yellow-600 mt-1">Awaiting action</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Approved</p>
                    <p className="text-3xl font-bold text-green-900">{stats.approvedRequests}</p>
                    <p className="text-xs text-green-600 mt-1">{stats.approvalRate}% approval rate</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Total Users</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.activeProfiles}</p>
                    <p className="text-xs text-purple-600 mt-1">Registered users</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 shadow-sm">
              <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Users className="w-4 h-4 mr-2" />
                Members
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Activity className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications Trend Chart */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Applications Trend</CardTitle>
                    <CardDescription>Daily application submissions over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Legend />
                        <Bar dataKey="applications" fill="#3B82F6" name="Total Applications" />
                        <Bar dataKey="approved" fill="#10B981" name="Approved" />
                        <Bar dataKey="rejected" fill="#EF4444" name="Rejected" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Status Distribution</CardTitle>
                    <CardDescription>Current application status breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              <ApplicationManagement />
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">User Profiles</CardTitle>
                  <CardDescription>All registered users in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profiles.map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {profile.first_name && profile.last_name 
                                ? `${profile.first_name} ${profile.last_name}` 
                                : profile.email
                              }
                            </p>
                            <p className="text-sm text-gray-600">{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant="default" 
                            className="bg-green-100 text-green-700"
                          >
                            Active
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
                  <CardDescription>Latest system activities and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {log.details.applicant_name && `Applicant: ${log.details.applicant_name}`}
                            {log.details.old_role && log.details.new_role && 
                              `Role changed from ${log.details.old_role} to ${log.details.new_role}`
                            }
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <CreateUserModal
          open={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          onSuccess={fetchAllData}
        />

        <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review the complete application information
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Applicant Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {selectedRequest.applicant_name}</p>
                      <p><span className="font-medium">Email:</span> {selectedRequest.email}</p>
                      <p><span className="font-medium">Organization:</span> {selectedRequest.organization_name || 'Not provided'}</p>
                      <p><span className="font-medium">Location:</span> {selectedRequest.location || 'Not provided'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Fund Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Vehicle Name:</span> {selectedRequest.vehicle_name}</p>
                      <p><span className="font-medium">Website:</span> {selectedRequest.vehicle_website || 'Not provided'}</p>
                      <p><span className="font-medium">Domicile:</span> {selectedRequest.domicile_country || 'Not provided'}</p>
                      <p><span className="font-medium">Ticket Size:</span> {selectedRequest.ticket_size || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                {selectedRequest.thesis && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Investment Thesis</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedRequest.thesis}</p>
                  </div>
                )}

                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-4 pt-4 border-t">
                    <Button
                      onClick={() => {
                        handleReviewApplication(selectedRequest.id, 'approved');
                        setShowApplicationModal(false);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReviewApplication(selectedRequest.id, 'rejected');
                        setShowApplicationModal(false);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
};

export default AdminV2;