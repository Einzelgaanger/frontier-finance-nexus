
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Globe, 
  Users, 
  DollarSign, 
  Calendar, 
  ExternalLink, 
  Target, 
  TrendingUp,
  Search,
  Filter,
  Network as NetworkIcon,
  MapPin,
  Award,
  Briefcase,
  PieChart,
  BarChart3,
  Eye,
  Star,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { NetworkCard } from '@/components/network/NetworkCard';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
  year?: number;
  firm_name?: string;
  vehicle_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  team_based?: string[];
  geographic_focus?: string[];
  fund_stage?: string;
  investment_timeframe?: string;
  target_sectors?: string[];
  vehicle_websites?: string;
  vehicle_type?: string;
  thesis?: string;
  team_size_max?: number;
  legal_domicile?: string;
  ticket_size_min?: string;
  ticket_size_max?: string;
  target_capital?: string;
  sectors_allocation?: string[];
  website?: string;
  primary_investment_region?: string;
  fund_type?: string;
  year_founded?: number;
  team_size?: number;
  typical_check_size?: string;
  completed_at?: string;
  aum?: string;
  investment_thesis?: string;
  sector_focus?: string[];
  stage_focus?: string[];
  role_badge?: string;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Network = () => {
  const { userRole } = useAuth();
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');
  // Removed selectedYear state as year filter is not needed
  const [approvedMembers, setApprovedMembers] = useState<any[]>([]);
  const [viewerError, setViewerError] = useState<string | null>(null);
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);
  const [viewerLoading, setViewerLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchFundManagers();
    if (userRole === 'viewer') {
      fetchApprovedMembers();
      fetchMembershipRequests();
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole === 'viewer') {
      setFilteredManagers(fundManagers);
    } else {
      filterManagers();
    }
  }, [fundManagers, searchTerm, filterRegion, filterType]);

  const fetchFundManagers = async () => {
    try {
      setLoading(true);
      console.log('Fetching all users from auth.users...');

      // Fetch ALL users from auth.users, profiles, user_roles, and survey data
      const [profilesResult, userRolesResult, survey2021Result, surveyResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('id, email, first_name, last_name, created_at'),
        supabase
          .from('user_roles')
          .select('user_id, role'),
        supabase
          .from('survey_responses_2021')
          .select(`
            id,
            user_id,
            firm_name,
            participant_name,
            role_title,
            team_based,
            geographic_focus,
            fund_stage,
            investment_timeframe,
            target_sectors,
            completed_at
          `)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false }),
        supabase
          .from('survey_responses')
          .select(`
            id,
            user_id,
            vehicle_name,
            vehicle_websites,
            vehicle_type,
            thesis,
            team_size_max,
            legal_domicile,
            ticket_size_min,
            ticket_size_max,
            target_capital,
            sectors_allocation,
            fund_stage,
            completed_at
          `)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
      ]);

      // Create a comprehensive list of all users from all sources
      let allUsers: any[] = [];
      
      // First, get all users from profiles
      const profileUsers = (profilesResult.data || []).map(profile => ({
        id: profile.id,
        email: profile.email,
        created_at: profile.created_at,
        first_name: profile.first_name,
        last_name: profile.last_name,
        source: 'profiles'
      }));
      
      // Get all users from survey data
      const survey2021Users = (survey2021Result.data || []).map(survey => ({
        id: survey.user_id,
        email: (profilesResult.data || []).find(p => p.id === survey.user_id)?.email || `user-${survey.user_id}@example.com`,
        created_at: (profilesResult.data || []).find(p => p.id === survey.user_id)?.created_at || new Date().toISOString(),
        first_name: (profilesResult.data || []).find(p => p.id === survey.user_id)?.first_name || '',
        last_name: (profilesResult.data || []).find(p => p.id === survey.user_id)?.last_name || '',
        source: 'survey_2021'
      }));
      
      const surveyUsers = (surveyResult.data || []).map(survey => ({
        id: survey.user_id,
        email: (profilesResult.data || []).find(p => p.id === survey.user_id)?.email || `user-${survey.user_id}@example.com`,
        created_at: (profilesResult.data || []).find(p => p.id === survey.user_id)?.created_at || new Date().toISOString(),
        first_name: (profilesResult.data || []).find(p => p.id === survey.user_id)?.first_name || '',
        last_name: (profilesResult.data || []).find(p => p.id === survey.user_id)?.last_name || '',
        source: 'survey_regular'
      }));
      
      // Get all users from user_roles
      const roleUsers = (userRolesResult.data || []).map(role => ({
        id: role.user_id,
        email: (profilesResult.data || []).find(p => p.id === role.user_id)?.email || `user-${role.user_id}@example.com`,
        created_at: (profilesResult.data || []).find(p => p.id === role.user_id)?.created_at || new Date().toISOString(),
        first_name: (profilesResult.data || []).find(p => p.id === role.user_id)?.first_name || '',
        last_name: (profilesResult.data || []).find(p => p.id === role.user_id)?.last_name || '',
        source: 'user_roles'
      }));
      
      // Try to get users from auth.users if possible
      let authUsers: any[] = [];
      try {
        const { data: authUsersData, error: authError } = await supabase
          .from('auth.users')
          .select('id, email, created_at');
        
        if (!authError && authUsersData) {
          authUsers = authUsersData.map(user => ({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            first_name: (profilesResult.data || []).find(p => p.id === user.id)?.first_name || '',
            last_name: (profilesResult.data || []).find(p => p.id === user.id)?.last_name || '',
            source: 'auth_users'
          }));
        }
      } catch (error) {
        console.log('Could not fetch from auth.users directly');
      }
      
      // Combine all users and remove duplicates
      const allUserArrays = [profileUsers, survey2021Users, surveyUsers, roleUsers, authUsers];
      const userMap = new Map();
      
      allUserArrays.forEach(userArray => {
        userArray.forEach(user => {
          if (!userMap.has(user.id)) {
            userMap.set(user.id, user);
          } else {
            // Merge data if user exists in multiple sources
            const existing = userMap.get(user.id);
            userMap.set(user.id, {
              ...existing,
              email: existing.email || user.email,
              first_name: existing.first_name || user.first_name,
              last_name: existing.last_name || user.last_name,
              created_at: existing.created_at || user.created_at,
              source: `${existing.source}, ${user.source}`
            });
          }
        });
      });
      
      allUsers = Array.from(userMap.values());

      if (profilesResult.error) throw profilesResult.error;
      if (userRolesResult.error) throw userRolesResult.error;
      if (survey2021Result.error) throw survey2021Result.error;
      if (surveyResult.error) throw surveyResult.error;
      
      console.log('All users:', allUsers);
      console.log('Profiles:', profilesResult.data);
      console.log('User roles:', userRolesResult.data);
      console.log('Survey 2021:', survey2021Result.data);
      console.log('Survey regular:', surveyResult.data);
      
      // Create maps for quick lookups
      const profilesMap = new Map();
      (profilesResult.data || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      const rolesMap = new Map();
      (userRolesResult.data || []).forEach(userRole => {
        rolesMap.set(userRole.user_id, userRole.role);
      });
      
      // Create maps for survey data
      const survey2021Map = new Map();
      (survey2021Result.data || []).forEach(survey => {
        survey2021Map.set(survey.user_id, survey);
      });
      
      const surveyMap = new Map();
      (surveyResult.data || []).forEach(survey => {
        surveyMap.set(survey.user_id, survey);
      });
      
      // Process ALL users and add profile/survey data if available
      const allManagers = allUsers.map(user => {
        const userRole = rolesMap.get(user.id);
        const roleBadge = userRole || 'viewer';
        const profile = profilesMap.get(user.id);
        
        // Check for 2021 survey first (priority)
        const survey2021 = survey2021Map.get(user.id);
        if (survey2021) {
          return {
            id: survey2021.id,
            user_id: user.id,
            year: 2021,
            fund_name: survey2021.firm_name || (profile ? `${profile.first_name} ${profile.last_name}` : user.email),
            firm_name: survey2021.firm_name,
            participant_name: survey2021.participant_name,
            role_title: survey2021.role_title,
            email_address: user.email,
            team_based: survey2021.team_based,
            geographic_focus: survey2021.geographic_focus,
            fund_stage: survey2021.fund_stage,
            investment_timeframe: survey2021.investment_timeframe,
            target_sectors: survey2021.target_sectors,
            completed_at: survey2021.completed_at,
            role_badge: roleBadge,
            profile: profile || { first_name: user.first_name || '', last_name: user.last_name || '', email: user.email },
            has_survey: true
          };
        }
        
        // Check for regular survey
        const survey = surveyMap.get(user.id);
        if (survey) {
          return {
            id: survey.id,
            user_id: user.id,
            year: survey.year || 2025,
            fund_name: survey.vehicle_name || (profile ? `${profile.first_name} ${profile.last_name}` : user.email),
            vehicle_name: survey.vehicle_name,
            vehicle_websites: survey.vehicle_websites,
            vehicle_type: survey.vehicle_type,
            thesis: survey.thesis,
            team_size_max: survey.team_size_max,
            legal_domicile: survey.legal_domicile,
            ticket_size_min: survey.ticket_size_min,
            ticket_size_max: survey.ticket_size_max,
            target_capital: survey.target_capital,
            sectors_allocation: survey.sectors_allocation,
            fund_stage: survey.fund_stage,
            completed_at: survey.completed_at,
            role_badge: roleBadge,
            profile: profile || { first_name: user.first_name || '', last_name: user.last_name || '', email: user.email },
            has_survey: true
          };
        }
        
        // User without survey - create basic profile
        return {
          id: user.id,
          user_id: user.id,
          fund_name: profile ? `${profile.first_name} ${profile.last_name}` : (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email),
          email_address: user.email,
          completed_at: user.created_at,
          role_badge: roleBadge,
          profile: profile || { first_name: user.first_name || '', last_name: user.last_name || '', email: user.email },
          has_survey: false
        };
      });
      
      // Sort by completion date (users with surveys first, then by creation date)
      const sortedManagers = allManagers.sort((a, b) => {
        if (a.has_survey && !b.has_survey) return -1;
        if (!a.has_survey && b.has_survey) return 1;
        if (a.completed_at && b.completed_at) {
          return new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime();
        }
        return 0;
      });
      
      console.log('All users:', sortedManagers);
      console.log('Sample user data:', sortedManagers[0]);
      setFundManagers(sortedManagers);
      setFilteredManagers(sortedManagers);
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedMembers = async () => {
    setLoading(true);
    setViewerError(null);
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApprovedMembers(data || []);
    } catch (err) {
      setViewerError('Failed to load approved members. Please try again.');
      setApprovedMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembershipRequests = async () => {
    setViewerLoading(true);
    setViewerError(null);
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setMembershipRequests(data || []);
    } catch (err) {
      setViewerError('Failed to load members. Please try again.');
      setMembershipRequests([]);
    } finally {
      setViewerLoading(false);
    }
  };

  // Function to create profile entries for users who don't have them
  const createMissingProfiles = async () => {
    try {
      console.log('Creating missing profile entries...');
      
      // Get all users from all sources
      const [profilesResult, survey2021Result, surveyResult, userRolesResult] = await Promise.all([
        supabase.from('profiles').select('id'),
        supabase.from('survey_responses_2021').select('user_id'),
        supabase.from('survey_responses').select('user_id'),
        supabase.from('user_roles').select('user_id')
      ]);

      // Collect all user IDs
      const existingProfileIds = new Set((profilesResult.data || []).map(p => p.id));
      const surveyUserIds = new Set([
        ...(survey2021Result.data || []).map(s => s.user_id),
        ...(surveyResult.data || []).map(s => s.user_id)
      ]);
      const roleUserIds = new Set((userRolesResult.data || []).map(r => r.user_id));

      // Find users who need profile entries
      const allUserIds = new Set([...surveyUserIds, ...roleUserIds]);
      const missingProfileIds = Array.from(allUserIds).filter(id => !existingProfileIds.has(id));

      console.log('Users missing profiles:', missingProfileIds);

      if (missingProfileIds.length > 0) {
        // Create profile entries for missing users
        const profileInserts = missingProfileIds.map(userId => ({
          id: userId,
          email: `user-${userId}@example.com`, // This will be updated when they have actual data
          first_name: '',
          last_name: '',
          created_at: new Date().toISOString()
        }));

        const { data, error } = await supabase
          .from('profiles')
          .insert(profileInserts);

        if (error) {
          console.error('Error creating profiles:', error);
          toast({
            title: "Error",
            description: "Failed to create missing profile entries",
            variant: "destructive"
          });
        } else {
          console.log('Created profile entries for:', missingProfileIds);
          toast({
            title: "Success",
            description: `Created ${missingProfileIds.length} missing profile entries`,
            variant: "default"
          });
          // Refresh the data
          fetchFundManagers();
        }
      } else {
        toast({
          title: "Info",
          description: "All users already have profile entries",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error creating missing profiles:', error);
      toast({
        title: "Error",
        description: "Failed to create missing profile entries",
        variant: "destructive"
      });
    }
  };

  const filterManagers = () => {
    let filtered = fundManagers;

    if (searchTerm) {
      filtered = filtered.filter(manager =>
        manager.fund_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (manager.profile?.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (manager.profile?.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (manager.email_address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (manager.geographic_focus?.join(', ') || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRegion !== 'all') {
      filtered = filtered.filter(manager =>
        (manager.geographic_focus?.join(', ') || '').toLowerCase().includes(filterRegion.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(manager =>
        (manager.vehicle_type || manager.fund_stage || '').toLowerCase().includes(filterType.toLowerCase())
      );
    }

    setFilteredManagers(filtered);
  };

  const getRegions = () => {
    const regions = [...new Set(fundManagers.flatMap(m => m.geographic_focus || []).filter(Boolean))];
    return regions.sort();
  };

  const getFundTypes = () => {
    const types = [...new Set(fundManagers.map(m => m.vehicle_type || m.fund_stage).filter(Boolean))];
    return types.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading professional network...</p>
          </div>
        </div>
      </div>
    );
  }

  // Viewer-specific network page
  if (userRole === 'viewer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
        <Header />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Professional Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                  <NetworkIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-800">ESCP Network Directory</h1>
                  <p className="text-slate-600 text-sm">Discover approved fund managers and investment opportunities</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-slate-300 text-slate-600 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                  onClick={fetchApprovedMembers}
                  disabled={viewerLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${viewerLoading ? 'animate-spin' : ''}`} />
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </Button>
                <Badge 
                  variant="outline" 
                  className="px-3 py-1 bg-emerald-100/80 text-emerald-700 border-emerald-200"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {userRole === 'admin' ? 'Administrator' : userRole === 'member' ? 'Member' : 'Visitor'} Access
                </Badge>
              </div>
            </div>
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 backdrop-blur-sm border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-700">Approved Members</p>
                    <p className="text-2xl font-bold text-emerald-800">{approvedMembers.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-200/60 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50/80 to-teal-100/80 backdrop-blur-sm border border-teal-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-teal-700">Geographic Reach</p>
                    <p className="text-2xl font-bold text-teal-800">30+</p>
                  </div>
                  <div className="w-10 h-10 bg-teal-200/60 rounded-full flex items-center justify-center">
                    <Globe className="w-5 h-5 text-teal-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50/80 to-cyan-100/80 backdrop-blur-sm border border-cyan-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cyan-700">Investment Focus</p>
                    <p className="text-2xl font-bold text-cyan-800">Frontier</p>
                  </div>
                  <div className="w-10 h-10 bg-cyan-200/60 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-cyan-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-sky-50/80 to-sky-100/80 backdrop-blur-sm border border-sky-200 shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-sky-700">Network Growth</p>
                    <p className="text-2xl font-bold text-sky-800">+12%</p>
                  </div>
                  <div className="w-10 h-10 bg-sky-200/60 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-sky-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {viewerError && (
            <Card className="mb-6 border-rose-200 bg-gradient-to-r from-rose-50/80 to-rose-100/80 backdrop-blur-sm shadow-sm">
              <CardContent className="p-4">
                <p className="text-rose-700 text-sm">{viewerError}</p>
              </CardContent>
            </Card>
          )}

          {viewerLoading ? (
            <Card className="text-center py-12 bg-gradient-to-r from-slate-50/80 to-emerald-50/80 backdrop-blur-sm shadow-sm border border-slate-200">
              <CardContent>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading approved members...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {approvedMembers.length === 0 ? (
                <Card className="text-center py-12 bg-gradient-to-r from-slate-50/80 to-emerald-50/80 backdrop-blur-sm shadow-sm border border-slate-200">
                  <CardContent>
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">No approved members found</h3>
                    <p className="text-base text-slate-600 mb-4">No approved members are available yet. Check back later.</p>
                    <Button 
                      variant="outline" 
                      className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-white/70 backdrop-blur-sm"
                      onClick={fetchApprovedMembers}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {approvedMembers.map((member: any) => {
                    // Convert member data to match NetworkCard interface
                    const managerData = {
                      id: member.id,
                      user_id: member.user_id,
                      fund_name: member.vehicle_name || 'Unknown Fund',
                      website: member.vehicle_website,
                      primary_investment_region: member.legal_domicile,
                      fund_type: member.vehicle_type,
                      year_founded: member.legal_entity_date_from,
                      team_size: member.team_size,
                      typical_check_size: member.ticket_size,
                      completed_at: member.completed_at,
                      aum: member.capital_raised,
                      investment_thesis: member.investment_thesis,
                      sector_focus: member.sectors_allocation ? Object.keys(member.sectors_allocation) : [],
                      stage_focus: member.fund_stage || [],
                      profiles: {
                        first_name: member.applicant_name?.split(' ')[0] || '',
                        last_name: member.applicant_name?.split(' ').slice(1).join(' ') || '',
                        email: member.email || ''
                      }
                    };
                    
                    return (
                      <NetworkCard 
                        key={member.id}
                        manager={managerData}
                        userRole={userRole}
                        showDetails={false}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                <NetworkIcon className="w-6 h-6 text-white" />
              </div>
                               <div>
                   <h1 className="text-2xl font-semibold text-slate-800">Network</h1>
                   <p className="text-slate-600 text-sm">Connect with all users and explore investment opportunities</p>
                 </div>
            </div>
                         <div className="flex items-center space-x-3">
               <Button 
                 variant="outline" 
                 size="sm"
                 className="border-slate-300 text-slate-600 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                 onClick={createMissingProfiles}
                 disabled={loading}
               >
                 <Users className="w-4 h-4 mr-2" />
                 Sync Users
               </Button>
               <Button 
                 variant="outline" 
                 size="sm"
                 className="border-slate-300 text-slate-600 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                 onClick={fetchFundManagers}
                 disabled={loading}
               >
                 <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                 Last updated: {lastUpdated.toLocaleTimeString()}
               </Button>
             </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                     <Input
                     placeholder="Search users..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="pl-10 bg-white/50 backdrop-blur-sm border-slate-200"
                   />
                </div>
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200">
                    <SelectValue placeholder="Filter by region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {getRegions().map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-white/50 backdrop-blur-sm border-slate-200">
                    <SelectValue placeholder="Filter by fund type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Fund Types</SelectItem>
                    {getFundTypes().map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                     <Card className="bg-gradient-to-br from-emerald-50/80 to-emerald-100/80 backdrop-blur-sm border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
             <CardContent className="p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-emerald-700">Total Users</p>
                   <p className="text-2xl font-bold text-emerald-800">
                     {filteredManagers.length}
                   </p>
                 </div>
                 <div className="w-10 h-10 bg-emerald-200/60 rounded-full flex items-center justify-center">
                   <Users className="w-5 h-5 text-emerald-600" />
                 </div>
               </div>
             </CardContent>
           </Card>

                     <Card className="bg-gradient-to-br from-teal-50/80 to-teal-100/80 backdrop-blur-sm border border-teal-200 shadow-sm hover:shadow-md transition-all duration-200">
             <CardContent className="p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-teal-700">With Surveys</p>
                   <p className="text-2xl font-bold text-teal-800">
                     {filteredManagers.filter(m => m.has_survey).length}
                   </p>
                 </div>
                 <div className="w-10 h-10 bg-teal-200/60 rounded-full flex items-center justify-center">
                   <CheckCircle className="w-5 h-5 text-teal-600" />
                 </div>
               </div>
             </CardContent>
           </Card>

                     <Card className="bg-gradient-to-br from-cyan-50/80 to-cyan-100/80 backdrop-blur-sm border border-cyan-200 shadow-sm hover:shadow-md transition-all duration-200">
             <CardContent className="p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-cyan-700">Regions Covered</p>
                   <p className="text-2xl font-bold text-cyan-800">
                     {new Set(filteredManagers.flatMap(m => m.geographic_focus || []).filter(Boolean)).size}
                   </p>
                 </div>
                 <div className="w-10 h-10 bg-cyan-200/60 rounded-full flex items-center justify-center">
                   <Globe className="w-5 h-5 text-cyan-600" />
                 </div>
               </div>
             </CardContent>
           </Card>

           <Card className="bg-gradient-to-br from-sky-50/80 to-sky-100/80 backdrop-blur-sm border border-sky-200 shadow-sm hover:shadow-md transition-all duration-200">
             <CardContent className="p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-sky-700">Fund Types</p>
                   <p className="text-2xl font-bold text-sky-800">
                     {new Set(filteredManagers.map(m => m.vehicle_type || m.fund_stage).filter(Boolean)).size}
                   </p>
                 </div>
                 <div className="w-10 h-10 bg-sky-200/60 rounded-full flex items-center justify-center">
                   <Building2 className="w-5 h-5 text-sky-600" />
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>



                 {/* Professional Users Grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <NetworkCard
              key={manager.id}
              manager={manager}
              userRole={userRole}
              showDetails={userRole === 'admin' || userRole === 'member'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;

