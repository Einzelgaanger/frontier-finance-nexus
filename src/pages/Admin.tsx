
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  UserCheck, 
  Building2, 
  TrendingUp, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Mail,
  Calendar,
  Globe,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Award,
  MapPin,
  UserCog
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

const Admin = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);
  
  // Analytics data
  const [analyticsData, setAnalyticsData] = useState({
    totalFunds: 0,
    totalCapital: 0,
    averageTicketSize: 0,
    activeMarkets: 0,
    surveyResponses: []
  });

  // Application management
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Survey management
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // User management
  const [users, setUsers] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

  useEffect(() => {
    if (userRole === 'admin') {
      fetchAllData();
    }
  }, [userRole]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchAnalyticsData(),
        fetchApplications(),
        fetchSurveys(),
        fetchUsers()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const { data: surveyData, error } = await supabase
        .from('survey_responses')
        .select('*')
        .not('completed_at', 'is', null);

      if (error) throw error;

      const metrics = calculateMetrics(surveyData || []);
      setAnalyticsData({
        ...metrics,
        surveyResponses: surveyData || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const calculateMetrics = (surveyData) => {
    if (!surveyData.length) return {
      totalFunds: 0,
      totalCapital: 0,
      averageTicketSize: 0,
      activeMarkets: 0
    };

    const totalFunds = surveyData.length;
    
    // Parse ticket sizes from the ticket_size field
    const ticketSizes = surveyData.map(survey => {
      const ticketSize = survey.ticket_size || '';
      const numbers = ticketSize.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        const min = parseInt(numbers[0]) * (ticketSize.includes('K') ? 1000 : ticketSize.includes('M') ? 1000000 : 1);
        const max = parseInt(numbers[1]) * (ticketSize.includes('K') ? 1000 : ticketSize.includes('M') ? 1000000 : 1);
        return (min + max) / 2;
      }
      return 0;
    }).filter(size => size > 0);

    const averageTicketSize = ticketSizes.length > 0 
      ? ticketSizes.reduce((sum, size) => sum + size, 0) / ticketSizes.length 
      : 0;

    // Count unique locations
    const locations = new Set();
    surveyData.forEach(survey => {
      if (survey.location) {
        locations.add(survey.location);
      }
    });

    return {
      totalFunds,
      totalCapital: totalFunds * 5000000, // Estimated
      averageTicketSize,
      activeMarkets: locations.size
    };
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .not('completed_at', 'is', null);

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setSurveys([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          profiles!inner(first_name, last_name, email)
        `)
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ 
          role: newRole,
          assigned_at: new Date().toISOString(),
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Role Updated",
        description: `User role has been changed to ${newRole}`,
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const handleRejectApplication = async (application) => {
    try {
      const { error } = await supabase
        .from('membership_requests')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: "Application Rejected",
        description: `Application from ${application.email} has been rejected`,
      });

      setRejectionReason('');
      setSelectedApplication(null);
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive"
      });
    }
  };

  const prepareChartData = () => {
    const data = analyticsData.surveyResponses;
    
    // Vehicle types distribution
    const vehicleTypes = {};
    data.forEach(survey => {
      const type = survey.vehicle_name || 'Unknown';
      vehicleTypes[type] = (vehicleTypes[type] || 0) + 1;
    });

    // Geographic distribution
    const locations = {};
    data.forEach(survey => {
      const location = survey.location || 'Unknown';
      locations[location] = (locations[location] || 0) + 1;
    });

    // Year over year growth
    const yearData = {};
    data.forEach(survey => {
      const year = survey.year || new Date().getFullYear();
      yearData[year] = (yearData[year] || 0) + 1;
    });

    return {
      vehicleTypes: Object.entries(vehicleTypes).map(([name, value]) => ({ name, value })),
      locations: Object.entries(locations).map(([name, value]) => ({ name, value })),
      yearData: Object.entries(yearData).map(([name, value]) => ({ name: parseInt(name), value }))
    };
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Access Denied</CardTitle>
              <CardDescription className="text-red-700">
                Admin access required to view this page.
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
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = prepareChartData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage applications, surveys, users, and platform analytics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Advanced Analytics Dashboard */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building2 className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Funds</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsData.totalFunds}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Capital</p>
                      <p className="text-2xl font-bold text-gray-900">${(analyticsData.totalCapital / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Ticket</p>
                      <p className="text-2xl font-bold text-gray-900">${(analyticsData.averageTicketSize / 1000).toFixed(0)}K</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Globe className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Markets</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsData.activeMarkets}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fund Distribution</CardTitle>
                  <CardDescription>Distribution of fund types</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <RechartsPieChart>
                        <Pie
                          data={chartData.vehicleTypes}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.vehicleTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Fund managers by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData.locations}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Fund registration over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData.yearData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Management */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Membership Applications</CardTitle>
                <CardDescription>Review and manage membership requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{app.applicant_name}</h3>
                          <p className="text-sm text-gray-600">{app.email}</p>
                          <p className="text-sm text-gray-600">{app.vehicle_name}</p>
                          <Badge variant={
                            app.status === 'pending' ? 'default' :
                            app.status === 'approved' ? 'default' : 'destructive'
                          }>
                            {app.status}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View Full Application
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Full Application Details</DialogTitle>
                                <DialogDescription>Complete application submission from {app.applicant_name}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="font-semibold">Applicant Name</Label>
                                    <p className="text-sm">{app.applicant_name}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Email</Label>
                                    <p className="text-sm">{app.email}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Vehicle Name</Label>
                                    <p className="text-sm">{app.vehicle_name}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Organization Name</Label>
                                    <p className="text-sm">{app.organization_name || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Website</Label>
                                    <p className="text-sm">{app.organization_website || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Country of Operation</Label>
                                    <p className="text-sm">{app.country_of_operation || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Fund Vehicle Type</Label>
                                    <p className="text-sm">{app.fund_vehicle_type || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">AUM</Label>
                                    <p className="text-sm">{app.aum || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Fundraising Status</Label>
                                    <p className="text-sm">{app.fundraising_status || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">Year Founded</Label>
                                    <p className="text-sm">{app.year_founded || 'Not provided'}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="font-semibold">Investment Focus</Label>
                                  <p className="text-sm whitespace-pre-wrap">{app.investment_focus || 'Not provided'}</p>
                                </div>
                                
                                <div>
                                  <Label className="font-semibold">Team Overview</Label>
                                  <p className="text-sm whitespace-pre-wrap">{app.team_overview || 'Not provided'}</p>
                                </div>
                                
                                <div>
                                  <Label className="font-semibold">Notable Investments</Label>
                                  <p className="text-sm whitespace-pre-wrap">{app.notable_investments || 'Not provided'}</p>
                                </div>
                                
                                <div>
                                  <Label className="font-semibold">Motivation/Expectations</Label>
                                  <p className="text-sm whitespace-pre-wrap">{app.motivation || 'Not provided'}</p>
                                </div>
                                
                                <div>
                                  <Label className="font-semibold">Additional Comments</Label>
                                  <p className="text-sm whitespace-pre-wrap">{app.additional_comments || 'Not provided'}</p>
                                </div>
                                
                                <div>
                                  <Label className="font-semibold">Application Status</Label>
                                  <Badge variant={
                                    app.status === 'pending' ? 'default' :
                                    app.status === 'approved' ? 'default' : 'destructive'
                                  }>
                                    {app.status}
                                  </Badge>
                                </div>
                                
                                {app.rejection_reason && (
                                  <div>
                                    <Label className="font-semibold">Rejection Reason</Label>
                                    <p className="text-sm text-red-600">{app.rejection_reason}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {app.status === 'pending' && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reject Application</DialogTitle>
                                  <DialogDescription>
                                    Please provide a reason for rejection
                                  </DialogDescription>
                                </DialogHeader>
                                <Textarea
                                  value={rejectionReason}
                                  onChange={(e) => setRejectionReason(e.target.value)}
                                  placeholder="Reason for rejection..."
                                />
                                <Button 
                                  onClick={() => handleRejectApplication(app)}
                                  variant="destructive"
                                >
                                  Reject Application
                                </Button>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">
                            {user.profiles?.first_name} {user.profiles?.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{user.profiles?.email}</p>
                          <Badge variant={
                            user.role === 'admin' ? 'default' :
                            user.role === 'member' ? 'secondary' : 'outline'
                          }>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Select 
                            value={user.role} 
                            onValueChange={(newRole) => handleRoleChange(user.user_id, newRole)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">Viewer</SelectItem>
                              <SelectItem value="member">Member</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Surveys Management */}
          <TabsContent value="surveys" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Survey Responses</CardTitle>
                <CardDescription>View and manage completed surveys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {surveys.map((survey) => (
                    <div key={survey.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{survey.name}</h3>
                          <p className="text-sm text-gray-600">{survey.email}</p>
                          <p className="text-sm text-gray-600">{survey.vehicle_name}</p>
                          <p className="text-sm text-gray-600">Year: {survey.year}</p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-2" />
                              View Survey
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Survey Response - {survey.year}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Vehicle Name</Label>
                                <p>{survey.vehicle_name}</p>
                              </div>
                              <div>
                                <Label>Investment Thesis</Label>
                                <p>{survey.thesis}</p>
                              </div>
                              <div>
                                <Label>Ticket Size</Label>
                                <p>{survey.ticket_size}</p>
                              </div>
                              <div>
                                <Label>Location</Label>
                                <p>{survey.location}</p>
                              </div>
                              <div>
                                <Label>Team Size</Label>
                                <p>{survey.team_size_description}</p>
                              </div>
                              <div>
                                <Label>Portfolio Count</Label>
                                <p>{survey.portfolio_count}</p>
                              </div>
                              <div>
                                <Label>Capital Raised</Label>
                                <p>{survey.capital_raised_description}</p>
                              </div>
                              <div>
                                <Label>Expectations</Label>
                                <p>{survey.expectations}</p>
                              </div>
                              <div>
                                <Label>How They Heard About Network</Label>
                                <p>{survey.how_heard_about_network}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Profile */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Manage your admin profile settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCog className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Administrator</h3>
                      <p className="text-gray-600">System Administrator</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Role</Label>
                      <p className="font-medium">Admin</p>
                    </div>
                    <div>
                      <Label>Access Level</Label>
                      <p className="font-medium">Full System Access</p>
                    </div>
                    <div>
                      <Label>Last Login</Label>
                      <p className="font-medium">Current Session</p>
                    </div>
                    <div>
                      <Label>Permissions</Label>
                      <p className="font-medium">All Features</p>
                    </div>
                  </div>
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
