import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  Globe, 
  Users, 
  Calendar, 
  Target, 
  DollarSign, 
  TrendingUp,
  Mail,
  ExternalLink,
  MapPin,
  Briefcase,
  FileText,
  Download,
  Star,
  Award,
  Zap,
  Rocket,
  Shield,
  Heart,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  User,
  MessageSquare,
  Clock,
  AlertTriangle,
  PieChart,
  CheckCircle,
  Phone,
  RefreshCw,
  Eye,
  BarChart3,
  Network,
  Leaf,
  Monitor,
  Factory,
  Truck,
  Store,
  GraduationCap,
  Camera,
  Upload,
  Edit3,
  Save,
  X,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Github,
  Globe2,
  MapPin as LocationIcon,
  Calendar as DateIcon,
  Users as TeamIcon,
  DollarSign as MoneyIcon,
  Target as FocusIcon,
  TrendingUp as GrowthIcon,
  Building2 as CompanyIcon,
  Briefcase as WorkIcon,
  Award as AchievementIcon,
  Star as StarIcon,
  Heart as HeartIcon,
  Zap as EnergyIcon,
  Rocket as LaunchIcon,
  Shield as SecurityIcon,
  Sparkles as MagicIcon,
  MessageSquare as ChatIcon,
  Clock as TimeIcon,
  AlertTriangle as WarningIcon,
  PieChart as ChartIcon,
  CheckCircle as SuccessIcon,
  Phone as PhoneIcon,
  RefreshCw as RefreshIcon,
  Eye as ViewIcon,
  BarChart3 as AnalyticsIcon,
  Network as NetworkIcon,
  Leaf as NatureIcon,
  Monitor as TechIcon,
  Factory as IndustryIcon,
  Truck as LogisticsIcon,
  Store as RetailIcon,
  GraduationCap as EducationIcon,
  Camera as CameraIcon,
  Upload as UploadIcon,
  Edit3 as EditIcon,
  Save as SaveIcon,
  X as CloseIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  ChevronDown as DownIcon,
  ChevronUp as UpIcon
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FundManagerProfile {
  id: string;
  user_id: string;
  fund_name: string;
  firm_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
  profile_picture_url?: string;
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
  has_survey?: boolean;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url?: string;
  };
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    profile_picture_url?: string;
  };
}

const FundManagerDetail = () => {
  const { userId } = useParams();
  const { userRole, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<FundManagerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<FundManagerProfile>>({});
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (userId && (userRole === 'viewer' || userRole === 'member' || userRole === 'admin')) {
      fetchFundManagerData();
    }
  }, [userId, userRole]);

  const fetchFundManagerData = async () => {
    try {
      setLoading(true);
      console.log('Fetching fund manager data for user:', userId);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
        return;
      }

      // Process the data
      const processedProfile: FundManagerProfile = {
        id: profileData.id,
        user_id: profileData.id,
        fund_name: (profileData as any).fund_name || 'Unnamed Fund',
        firm_name: (profileData as any).firm_name,
        participant_name: (profileData as any).participant_name,
        role_title: (profileData as any).role_title,
        email_address: profileData.email,
        phone: (profileData as any).phone,
        website: (profileData as any).website,
        linkedin: (profileData as any).linkedin,
        twitter: (profileData as any).twitter,
        facebook: (profileData as any).facebook,
        instagram: (profileData as any).instagram,
        youtube: (profileData as any).youtube,
        github: (profileData as any).github,
        profile_picture_url: profileData.profile_picture_url,
        team_based: (profileData as any).team_based,
        geographic_focus: (profileData as any).geographic_focus,
        fund_stage: (profileData as any).fund_stage,
        investment_timeframe: (profileData as any).investment_timeframe,
        target_sectors: (profileData as any).target_sectors,
        vehicle_websites: (profileData as any).vehicle_websites,
        vehicle_type: (profileData as any).vehicle_type,
        thesis: (profileData as any).thesis,
        team_size_max: (profileData as any).team_size_max,
        legal_domicile: (profileData as any).legal_domicile,
        ticket_size_min: (profileData as any).ticket_size_min,
        ticket_size_max: (profileData as any).ticket_size_max,
        target_capital: (profileData as any).target_capital,
        sectors_allocation: (profileData as any).sectors_allocation,
        primary_investment_region: (profileData as any).primary_investment_region,
        fund_type: (profileData as any).fund_type,
        year_founded: (profileData as any).year_founded,
        team_size: (profileData as any).team_size,
        typical_check_size: (profileData as any).typical_check_size,
        completed_at: (profileData as any).completed_at,
        aum: (profileData as any).aum,
        investment_thesis: (profileData as any).investment_thesis,
        sector_focus: (profileData as any).sector_focus,
        stage_focus: (profileData as any).stage_focus,
        role_badge: (profileData as any).role_badge,
        has_survey: false,
        profile: {
          first_name: profileData.first_name || 'Unknown',
          last_name: profileData.last_name || 'User',
          email: profileData.email || '',
          profile_picture_url: profileData.profile_picture_url
        }
      };

      setProfile(processedProfile);
    } catch (error) {
      console.error('Error fetching fund manager data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fund manager data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingImage(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        profile_picture_url: publicUrl,
        profile: prev.profile ? { ...prev.profile, profile_picture_url: publicUrl } : undefined
      } : null);

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });

    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      fund_name: profile?.fund_name,
      firm_name: profile?.firm_name,
      participant_name: profile?.participant_name,
      role_title: profile?.role_title,
      email_address: profile?.email_address,
      phone: profile?.phone,
      website: profile?.website,
      linkedin: profile?.linkedin,
      twitter: profile?.twitter,
      facebook: profile?.facebook,
      instagram: profile?.instagram,
      youtube: profile?.youtube,
      github: profile?.github,
      thesis: profile?.thesis,
      investment_thesis: profile?.investment_thesis,
      aum: profile?.aum,
      target_capital: profile?.target_capital,
      typical_check_size: profile?.typical_check_size,
      ticket_size_min: profile?.ticket_size_min,
      ticket_size_max: profile?.ticket_size_max,
      year_founded: profile?.year_founded,
      team_size: profile?.team_size,
      legal_domicile: profile?.legal_domicile,
      primary_investment_region: profile?.primary_investment_region,
      fund_type: profile?.fund_type,
      vehicle_type: profile?.vehicle_type,
      fund_stage: profile?.fund_stage,
      investment_timeframe: profile?.investment_timeframe,
      sector_focus: profile?.sector_focus,
      stage_focus: profile?.stage_focus,
      target_sectors: profile?.target_sectors,
      geographic_focus: profile?.geographic_focus,
      team_based: profile?.team_based,
      sectors_allocation: profile?.sectors_allocation
    });
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(editData)
        .eq('id', userId);

      if (error) {
        throw error;
      }

      setProfile(prev => prev ? { ...prev, ...editData } : null);
      setIsEditing(false);
      setEditData({});

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const getSectorIcon = (sector: string) => {
    const sectorIcons: Record<string, any> = {
      'Technology': Monitor,
      'Healthcare': Heart,
      'Finance': DollarSign,
      'Energy': Zap,
      'Manufacturing': Factory,
      'Retail': Store,
      'Transportation': Truck,
      'Education': GraduationCap,
      'Agriculture': Leaf,
      'Real Estate': Building2,
      'Entertainment': Star,
      'Sports': Award,
      'Food & Beverage': Store,
      'Fashion': Store,
      'Automotive': Truck,
      'Aerospace': Rocket,
      'Telecommunications': Network,
      'Media': Monitor,
      'Consulting': Briefcase,
      'Other': Target
    };
    return sectorIcons[sector] || Target;
  };

  const getStageIcon = (stage: string) => {
    const stageIcons: Record<string, any> = {
      'Pre-Seed': Target,
      'Seed': Target,
      'Series A': TrendingUp,
      'Series B': TrendingUp,
      'Series C': TrendingUp,
      'Growth': Rocket,
      'Late Stage': Award,
      'IPO': Star,
      'Other': Target
    };
    return stageIcons[stage] || Target;
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!profile) {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">The requested profile could not be found.</p>
            <Button onClick={() => navigate('/network')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Network
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const profileName = profile.profile ? 
    `${profile.profile.first_name} ${profile.profile.last_name}` : 
    profile.participant_name || 'Unknown User';

  const profileEmail = profile.profile?.email || profile.email_address || '';

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <Button
                  onClick={() => navigate('/network')}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Network
                </Button>
                <div className="h-8 w-px bg-white/30"></div>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20 ring-4 ring-white/20">
                    <AvatarImage src={profile.profile_picture_url || profile.profile?.profile_picture_url} />
                    <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                      {profileName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold">{profileName}</h1>
                    <p className="text-blue-100 text-lg">{profile.fund_name}</p>
                    <p className="text-blue-200">{profile.role_title || 'Fund Manager'}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {userRole === 'admin' && (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <EditIcon className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
                <Button
                  onClick={fetchFundManagerData}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <RefreshIcon className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Picture Upload */}
              {userRole === 'admin' && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <CameraIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Profile Picture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-100">
                        <AvatarImage src={profile.profile_picture_url || profile.profile?.profile_picture_url} />
                        <AvatarFallback className="text-xl font-bold bg-blue-100 text-blue-600">
                          {profileName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Label htmlFor="profile-picture" className="cursor-pointer">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={uploadingImage}
                          className="w-full"
                        >
                          {uploadingImage ? (
                            <RefreshIcon className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <UploadIcon className="w-4 h-4 mr-2" />
                          )}
                          {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                        </Button>
                      </Label>
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <MessageSquare className="w-5 h-5 mr-2 text-green-600" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileEmail && (
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{profileEmail}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center space-x-3">
                      <PhoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{profile.phone}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center space-x-3">
                      <Globe2 className="w-4 h-4 text-gray-500" />
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                  {profile.linkedin && (
                    <div className="flex items-center space-x-3">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <a 
                        href={profile.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Social Media */}
              {(profile.twitter || profile.facebook || profile.instagram || profile.youtube || profile.github) && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <NetworkIcon className="w-5 h-5 mr-2 text-purple-600" />
                      Social Media
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profile.twitter && (
                      <div className="flex items-center space-x-3">
                        <Twitter className="w-4 h-4 text-blue-400" />
                        <a 
                          href={profile.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Twitter
                        </a>
                      </div>
                    )}
                    {profile.facebook && (
                      <div className="flex items-center space-x-3">
                        <Facebook className="w-4 h-4 text-blue-600" />
                        <a 
                          href={profile.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Facebook
                        </a>
                      </div>
                    )}
                    {profile.instagram && (
                      <div className="flex items-center space-x-3">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <a 
                          href={profile.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                    )}
                    {profile.youtube && (
                      <div className="flex items-center space-x-3">
                        <Youtube className="w-4 h-4 text-red-500" />
                        <a 
                          href={profile.youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          YouTube
                        </a>
                      </div>
                    )}
                    {profile.github && (
                      <div className="flex items-center space-x-3">
                        <Github className="w-4 h-4 text-gray-700" />
                        <a 
                          href={profile.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          GitHub
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.year_founded && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Founded</span>
                      <span className="text-sm font-semibold text-gray-900">{profile.year_founded}</span>
                    </div>
                  )}
                  {profile.team_size && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Team Size</span>
                      <span className="text-sm font-semibold text-gray-900">{profile.team_size}</span>
                    </div>
                  )}
                  {profile.aum && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">AUM</span>
                      <span className="text-sm font-semibold text-gray-900">{profile.aum}</span>
                    </div>
                  )}
                  {profile.target_capital && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target Capital</span>
                      <span className="text-sm font-semibold text-gray-900">{profile.target_capital}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fund Information */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Building2 className="w-6 h-6 mr-3 text-blue-600" />
                    Fund Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Fund Name</Label>
                      {isEditing ? (
                        <Input
                          value={editData.fund_name || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, fund_name: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.fund_name}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Firm Name</Label>
                      {isEditing ? (
                        <Input
                          value={editData.firm_name || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, firm_name: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.firm_name || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Fund Type</Label>
                      {isEditing ? (
                        <Input
                          value={editData.fund_type || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, fund_type: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.fund_type || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Vehicle Type</Label>
                      {isEditing ? (
                        <Input
                          value={editData.vehicle_type || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, vehicle_type: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.vehicle_type || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Legal Domicile</Label>
                      {isEditing ? (
                        <Input
                          value={editData.legal_domicile || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, legal_domicile: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.legal_domicile || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Primary Investment Region</Label>
                      {isEditing ? (
                        <Input
                          value={editData.primary_investment_region || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, primary_investment_region: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.primary_investment_region || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Focus */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Target className="w-6 h-6 mr-3 text-green-600" />
                    Investment Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sector Focus */}
                  {profile.sector_focus && profile.sector_focus.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Sector Focus</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.sector_focus.map((sector, index) => {
                          const IconComponent = getSectorIcon(sector);
                          return (
                            <Badge key={index} variant="secondary" className="flex items-center space-x-1 px-3 py-1">
                              <IconComponent className="w-3 h-3" />
                              <span>{sector}</span>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Stage Focus */}
                  {profile.stage_focus && profile.stage_focus.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Stage Focus</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.stage_focus.map((stage, index) => {
                          const IconComponent = getStageIcon(stage);
                          return (
                            <Badge key={index} variant="outline" className="flex items-center space-x-1 px-3 py-1">
                              <IconComponent className="w-3 h-3" />
                              <span>{stage}</span>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Geographic Focus */}
                  {profile.geographic_focus && profile.geographic_focus.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Geographic Focus</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.geographic_focus.map((region, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Investment Thesis */}
              {(profile.thesis || profile.investment_thesis) && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <FileText className="w-6 h-6 mr-3 text-purple-600" />
                      Investment Thesis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editData.thesis || editData.investment_thesis || ''}
                        onChange={(e) => setEditData(prev => ({ 
                          ...prev, 
                          thesis: e.target.value,
                          investment_thesis: e.target.value 
                        }))}
                        rows={6}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-gray-700 leading-relaxed">
                        {profile.thesis || profile.investment_thesis}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Financial Information */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <DollarSign className="w-6 h-6 mr-3 text-green-600" />
                    Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Assets Under Management</Label>
                      {isEditing ? (
                        <Input
                          value={editData.aum || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, aum: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.aum || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Target Capital</Label>
                      {isEditing ? (
                        <Input
                          value={editData.target_capital || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, target_capital: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.target_capital || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Typical Check Size</Label>
                      {isEditing ? (
                        <Input
                          value={editData.typical_check_size || ''}
                          onChange={(e) => setEditData(prev => ({ ...prev, typical_check_size: e.target.value }))}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">{profile.typical_check_size || 'N/A'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Ticket Size Range</Label>
                      {isEditing ? (
                        <div className="flex space-x-2 mt-1">
                          <Input
                            placeholder="Min"
                            value={editData.ticket_size_min || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, ticket_size_min: e.target.value }))}
                          />
                          <Input
                            placeholder="Max"
                            value={editData.ticket_size_max || ''}
                            onChange={(e) => setEditData(prev => ({ ...prev, ticket_size_max: e.target.value }))}
                          />
                        </div>
                      ) : (
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {profile.ticket_size_min && profile.ticket_size_max 
                            ? `${profile.ticket_size_min} - ${profile.ticket_size_max}`
                            : profile.ticket_size_min || profile.ticket_size_max || 'N/A'
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {isEditing && (
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex space-x-3">
                      <Button onClick={handleSave} className="flex-1">
                        <SaveIcon className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline" className="flex-1">
                        <CloseIcon className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default FundManagerDetail;
