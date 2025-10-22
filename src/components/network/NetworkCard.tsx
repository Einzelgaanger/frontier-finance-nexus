import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Building2, 
  Globe, 
  Users, 
  Eye, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Target, 
  Briefcase, 
  Award, 
  TrendingUp, 
  FileText, 
  PieChart, 
  Clock,
  ExternalLink,
  Star,
  Heart,
  Zap,
  Rocket,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Monitor,
  Factory,
  Truck,
  Store,
  GraduationCap,
  Leaf,
  Network,
  Phone,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Github
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NetworkCardProps {
  manager: {
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
    has_survey?: boolean;
    profile_picture_url?: string;
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
  };
  userRole: string;
  showDetails?: boolean;
}

export function NetworkCard({ manager, userRole, showDetails = false }: NetworkCardProps) {
  
  if (!manager || !manager.fund_name || !manager.user_id) {
    console.warn('Invalid manager data:', manager);
    return null;
  }

  const canViewDetails = userRole === 'member' || userRole === 'admin';
  const isAdmin = userRole === 'admin';
  const isViewer = userRole === 'viewer';

  // Create vibrant color schemes for each card
  const colorSchemes = [
    {
      primary: 'from-blue-500 to-cyan-500',
      secondary: 'from-blue-50 to-cyan-50',
      accent: 'blue-500',
      text: 'blue-700',
      bg: 'blue-50',
      border: 'blue-200',
      icon: 'blue-600'
    },
    {
      primary: 'from-purple-500 to-pink-500',
      secondary: 'from-purple-50 to-pink-50',
      accent: 'purple-500',
      text: 'purple-700',
      bg: 'purple-50',
      border: 'purple-200',
      icon: 'purple-600'
    },
    {
      primary: 'from-green-500 to-emerald-500',
      secondary: 'from-green-50 to-emerald-50',
      accent: 'green-500',
      text: 'green-700',
      bg: 'green-50',
      border: 'green-200',
      icon: 'green-600'
    },
    {
      primary: 'from-orange-500 to-red-500',
      secondary: 'from-orange-50 to-red-50',
      accent: 'orange-500',
      text: 'orange-700',
      bg: 'orange-50',
      border: 'orange-200',
      icon: 'orange-600'
    },
    {
      primary: 'from-indigo-500 to-blue-500',
      secondary: 'from-indigo-50 to-blue-50',
      accent: 'indigo-500',
      text: 'indigo-700',
      bg: 'indigo-50',
      border: 'indigo-200',
      icon: 'indigo-600'
    },
    {
      primary: 'from-teal-500 to-cyan-500',
      secondary: 'from-teal-50 to-cyan-50',
      accent: 'teal-500',
      text: 'teal-700',
      bg: 'teal-50',
      border: 'teal-200',
      icon: 'teal-600'
    },
    {
      primary: 'from-rose-500 to-pink-500',
      secondary: 'from-rose-50 to-pink-50',
      accent: 'rose-500',
      text: 'rose-700',
      bg: 'rose-50',
      border: 'rose-200',
      icon: 'rose-600'
    },
    {
      primary: 'from-violet-500 to-purple-500',
      secondary: 'from-violet-50 to-purple-50',
      accent: 'violet-500',
      text: 'violet-700',
      bg: 'violet-50',
      border: 'violet-200',
      icon: 'violet-600'
    },
    {
      primary: 'from-amber-500 to-yellow-500',
      secondary: 'from-amber-50 to-yellow-50',
      accent: 'amber-500',
      text: 'amber-700',
      bg: 'amber-50',
      border: 'amber-200',
      icon: 'amber-600'
    },
    {
      primary: 'from-emerald-500 to-green-500',
      secondary: 'from-emerald-50 to-green-50',
      accent: 'emerald-500',
      text: 'emerald-700',
      bg: 'emerald-50',
      border: 'emerald-200',
      icon: 'emerald-600'
    },
    {
      primary: 'from-cyan-500 to-blue-500',
      secondary: 'from-cyan-50 to-blue-50',
      accent: 'cyan-500',
      text: 'cyan-700',
      bg: 'cyan-50',
      border: 'cyan-200',
      icon: 'cyan-600'
    },
    {
      primary: 'from-fuchsia-500 to-pink-500',
      secondary: 'from-fuchsia-50 to-pink-50',
      accent: 'fuchsia-500',
      text: 'fuchsia-700',
      bg: 'fuchsia-50',
      border: 'fuchsia-200',
      icon: 'fuchsia-600'
    }
  ];
  
  // Simple hash function to get consistent color for each manager
  const hash = manager.id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const colorIndex = Math.abs(hash) % colorSchemes.length;
  const colors = colorSchemes[colorIndex];

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

  const profileName = manager.profile ? 
    `${manager.profile.first_name} ${manager.profile.last_name}` : 
    manager.participant_name || 'Unknown User';

  const profilePicture = manager.profile_picture_url || 
    manager.profile?.profile_picture_url || 
    manager.profiles?.profile_picture_url;

  return (
    <Card className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br ${colors.secondary} border-${colors.border} backdrop-blur-sm min-h-[400px] flex flex-col overflow-hidden`}>
      {/* Header with gradient background */}
      <div className={`bg-gradient-to-r ${colors.primary} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 ring-4 ring-white/30 shadow-lg">
                <AvatarImage src={profilePicture} />
                <AvatarFallback className="text-lg font-bold bg-white/20 text-white">
                  {profileName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold mb-1">{manager.fund_name || 'Unnamed Fund'}</h3>
                <p className="text-white/90 text-sm font-medium">{profileName}</p>
                <p className="text-white/80 text-xs">{manager.role_title || 'Fund Manager'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {manager.role_badge && (
                <Badge className={`
                  ${manager.role_badge === 'admin' ? 'bg-red-500/90 border-red-300' : ''}
                  ${manager.role_badge === 'member' ? 'bg-green-500/90 border-green-300' : ''}
                  ${manager.role_badge === 'viewer' ? 'bg-blue-500/90 border-blue-300' : ''}
                  text-white border-white/30 hover:bg-white/30 capitalize
                `}>
                  <Shield className="w-3 h-3 mr-1" />
                  {manager.role_badge}
                </Badge>
              )}
              {manager.has_survey && (
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Survey
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white hover:bg-white/20 p-2"
                asChild
              >
                <Link to={`/network/fund-manager/${manager.user_id}`}>
                  <Eye className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full"></div>
      </div>

      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Key Information */}
        <div className="space-y-4 mb-6">
          {manager.firm_name && (
            <div className="flex items-center space-x-3">
              <Building2 className={`w-4 h-4 text-${colors.icon}`} />
              <span className="text-sm text-gray-700 font-medium">{manager.firm_name}</span>
            </div>
          )}
          
          {manager.primary_investment_region && (
            <div className="flex items-center space-x-3">
              <MapPin className={`w-4 h-4 text-${colors.icon}`} />
              <span className="text-sm text-gray-700">{manager.primary_investment_region}</span>
            </div>
          )}

          {manager.year_founded && (
            <div className="flex items-center space-x-3">
              <Calendar className={`w-4 h-4 text-${colors.icon}`} />
              <span className="text-sm text-gray-700">Founded {manager.year_founded}</span>
            </div>
          )}

          {manager.team_size && (
            <div className="flex items-center space-x-3">
              <Users className={`w-4 h-4 text-${colors.icon}`} />
              <span className="text-sm text-gray-700">{manager.team_size} team members</span>
            </div>
          )}

          {manager.aum && (
            <div className="flex items-center space-x-3">
              <DollarSign className={`w-4 h-4 text-${colors.icon}`} />
              <span className="text-sm text-gray-700 font-semibold">{manager.aum}</span>
            </div>
          )}
        </div>

        {/* Sector Focus */}
        {manager.sector_focus && manager.sector_focus.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className={`w-4 h-4 text-${colors.icon}`} />
              <span className="text-sm font-medium text-gray-700">Sector Focus</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {manager.sector_focus.slice(0, 3).map((sector, index) => {
                const IconComponent = getSectorIcon(sector);
                return (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className={`text-xs px-2 py-1 bg-${colors.bg} text-${colors.text} border-${colors.border} hover:bg-${colors.accent} hover:text-white transition-colors`}
                  >
                    <IconComponent className="w-3 h-3 mr-1" />
                    {sector}
                  </Badge>
                );
              })}
              {manager.sector_focus.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{manager.sector_focus.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Stage Focus */}
        {manager.stage_focus && manager.stage_focus.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className={`w-4 h-4 text-${colors.icon}`} />
              <span className="text-sm font-medium text-gray-700">Stage Focus</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {manager.stage_focus.slice(0, 2).map((stage, index) => {
                const IconComponent = getStageIcon(stage);
                return (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className={`text-xs px-2 py-1 border-${colors.border} text-${colors.text} hover:bg-${colors.accent} hover:text-white transition-colors`}
                  >
                    <IconComponent className="w-3 h-3 mr-1" />
                    {stage}
                  </Badge>
                );
              })}
              {manager.stage_focus.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-1">
                  +{manager.stage_focus.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Investment Thesis Preview */}
        {(manager.thesis || manager.investment_thesis) && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className={`w-4 h-4 text-${colors.icon}`} />
              <span className="text-sm font-medium text-gray-700">Investment Focus</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {(manager.thesis || manager.investment_thesis)?.substring(0, 120)}...
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {canViewDetails ? (
                <Button 
                  asChild
                  className={`bg-${colors.accent} hover:bg-${colors.accent}/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                >
                  <Link to={`/network/fund-manager/${manager.user_id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              ) : null}
              
              {manager.website && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`border-${colors.border} text-${colors.text} hover:bg-${colors.accent} hover:text-white transition-colors`}
                  asChild
                >
                  <a href={manager.website} target="_blank" rel="noopener noreferrer" title="Visit website">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              {manager.completed_at && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Updated {new Date(manager.completed_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
