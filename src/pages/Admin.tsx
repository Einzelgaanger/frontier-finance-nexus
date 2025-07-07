
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Shield, 
  Settings, 
  Clock, 
  CheckCircle, 
  XCircle, 
  UserPlus,
  BarChart3,
  AlertTriangle,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [membershipRequests, setMembershipRequests] = useState([]);
  const [invitationCodes, setInvitationCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    if (userRole === 'admin') {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch profiles first
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = profilesData?.map(profile => ({
        ...profile,
        role: rolesData?.find(role => role.user_id === profile.id)?.role || 'viewer'
      })) || [];

      // Fetch membership requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch invitation codes
      const { data: codesData, error: codesError } = await supabase
        .from('invitation_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (codesError) throw codesError;

      setUsers(usersWithRoles);
      setMembershipRequests(requestsData || []);
      setInvitationCodes(codesData || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'viewer' | 'member' | 'admin') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole,
          assigned_by: user?.id,
          assigned_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`,
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      });
    }
  };

  const approveMembershipRequest = async (requestId: string, requestEmail: string) => {
    try {
      // Generate invitation code
      const code = Math.random().toString(36).substring(2, 7).toUpperCase();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error: codeError } = await supabase
        .from('invitation_codes')
        .insert({
          code,
          created_by: user?.id,
          expires_at: expiresAt.toISOString()
        });

      if (codeError) throw codeError;

      // Update request status
      const { error: requestError } = await supabase
        .from('membership_requests')
        .update({
          status: 'approved',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      toast({
        title: "Request Approved",
        description: `Invitation code ${code} generated for ${requestEmail}. Valid for 24 hours.`,
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve membership request.",
        variant: "destructive",
      });
    }
  };

  const rejectMembershipRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({
          status: 'rejected',
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Request Rejected",
        description: "Membership request has been rejected.",
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject membership request.",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200 border';
      case 'member': return 'bg-blue-100 text-blue-800 border-blue-200 border';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 border';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200 border';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200 border';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200 border';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const pendingRequestsCount = membershipRequests.filter(r => r.status === 'pending').length;
  const activeCodesCount = invitationCodes.filter(c => !c.used_at && new Date(c.expires_at) > new Date()).length;
  const membersCount = users.filter(u => u.role === 'member' || u.role === 'admin').length;

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black flex items-center">
            <Shield className="w-8 h-8 mr-3 text-red-600" />
            Admin Panel
          </h1>
          <p className="text-gray-600 mt-2">Manage users, requests, and platform settings</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-black">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-black">{pendingRequestsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <UserPlus className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Codes</p>
                  <p className="text-2xl font-bold text-black">{activeCodesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border">
            <CardContent className="p-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Members</p>
                  <p className="text-2xl font-bold text-black">{membersCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">User Management</TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Membership Requests</TabsTrigger>
            <TabsTrigger value="codes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Invitation Codes</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-black">User Management</CardTitle>
                    <CardDescription>Manage user roles and permissions</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="border-gray-300">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300"
                      />
                    </div>
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px] border-gray-300">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold text-black">User</TableHead>
                      <TableHead className="font-semibold text-black">Role</TableHead>
                      <TableHead className="font-semibold text-black">Joined</TableHead>
                      <TableHead className="font-semibold text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-black">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getRoleBadgeColor(user.role)} capitalize`}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(newRole) => updateUserRole(user.id, newRole as 'viewer' | 'member' | 'admin')}
                          >
                            <SelectTrigger className="w-[120px] border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black">Membership Requests</CardTitle>
                <CardDescription>Review and approve membership upgrade requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold text-black">Vehicle Name</TableHead>
                      <TableHead className="font-semibold text-black">Email</TableHead>
                      <TableHead className="font-semibold text-black">Status</TableHead>
                      <TableHead className="font-semibold text-black">Requested</TableHead>
                      <TableHead className="font-semibold text-black">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {membershipRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium text-black">{request.vehicle_name}</TableCell>
                        <TableCell className="text-gray-700">{request.email}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeColor(request.status)} capitalize`}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => approveMembershipRequest(request.id, request.email)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectMembershipRequest(request.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codes" className="space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-black">Invitation Codes</CardTitle>
                <CardDescription>Manage invitation codes for membership upgrades</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold text-black">Code</TableHead>
                      <TableHead className="font-semibold text-black">Status</TableHead>
                      <TableHead className="font-semibold text-black">Expires</TableHead>
                      <TableHead className="font-semibold text-black">Used By</TableHead>
                      <TableHead className="font-semibold text-black">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitationCodes.map((code) => {
                      const isExpired = new Date(code.expires_at) < new Date();
                      const isUsed = !!code.used_at;
                      
                      return (
                        <TableRow key={code.id}>
                          <TableCell className="font-mono font-medium text-black">{code.code}</TableCell>
                          <TableCell>
                            <Badge className={
                              isUsed 
                                ? 'bg-gray-100 text-gray-800 border-gray-200 border'
                                : isExpired 
                                ? 'bg-red-100 text-red-800 border-red-200 border'
                                : 'bg-green-100 text-green-800 border-green-200 border'
                            }>
                              {isUsed ? 'Used' : isExpired ? 'Expired' : 'Active'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(code.expires_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {code.used_by ? 'User ID: ' + code.used_by.substring(0, 8) + '...' : '-'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(code.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="flex items-center text-black">
                  <Settings className="w-5 h-5 mr-2" />
                  Platform Settings
                </CardTitle>
                <CardDescription>Configure platform-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Settings Panel</h3>
                  <p className="text-gray-600">Advanced settings configuration coming soon.</p>
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
