
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, Users, Eye, MapPin, Calendar, DollarSign, Target, Briefcase, Award, TrendingUp, FileText, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NetworkCardProps {
  manager: {
    id: string;
    user_id: string;
    fund_name: string;
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
    profiles?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  userRole: string;
  showDetails?: boolean;
}

export function NetworkCard({ manager, userRole, showDetails = false }: NetworkCardProps) {
  // Validate manager data
  if (!manager || !manager.fund_name || !manager.user_id) {
    console.warn('Invalid manager data:', manager);
    return null;
  }

  const canViewDetails = userRole === 'member' || userRole === 'admin';
  const isAdmin = userRole === 'admin';
  const isViewer = userRole === 'viewer';

  // Create different bright colors for each card
  const cardColors = [
    'from-blue-50/80 to-blue-100/80 border-blue-200',
    'from-green-50/80 to-green-100/80 border-green-200',
    'from-yellow-50/80 to-yellow-100/80 border-yellow-200',
    'from-orange-50/80 to-orange-100/80 border-orange-200',
    'from-purple-50/80 to-purple-100/80 border-purple-200',
    'from-pink-50/80 to-pink-100/80 border-pink-200',
    'from-indigo-50/80 to-indigo-100/80 border-indigo-200',
    'from-teal-50/80 to-teal-100/80 border-teal-200',
    'from-cyan-50/80 to-cyan-100/80 border-cyan-200',
    'from-rose-50/80 to-rose-100/80 border-rose-200',
    'from-violet-50/80 to-violet-100/80 border-violet-200',
    'from-amber-50/80 to-amber-100/80 border-amber-200'
  ];
  
  // Icon colors that are consistent across cards but different within each card
  const iconColors = [
    'text-blue-600',    // Building2, Globe
    'text-green-600',   // Users, Target
    'text-purple-600',  // DollarSign, TrendingUp
    'text-orange-600',  // Briefcase, MapPin
    'text-teal-600',    // Calendar, FileText
    'text-pink-600',    // PieChart
    'text-indigo-600',  // Award
    'text-cyan-600'     // Eye
  ];
  
  // Simple hash function to get consistent color for each manager
  const hash = manager.id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const colorIndex = Math.abs(hash) % cardColors.length;
  const colorClass = cardColors[colorIndex];

  return (
    <Card className={`hover:shadow-lg transition-shadow bg-gradient-to-br ${colorClass} backdrop-blur-sm min-h-[320px] flex flex-col`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              {manager.fund_name || 'Unknown Fund'}
            </CardTitle>
            {manager.profiles && (
              <p className="text-sm text-gray-600 mt-1">
                {manager.profiles.first_name} {manager.profiles.last_name}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end space-y-1">
            {manager.role_badge && (
              <Badge 
                variant={manager.role_badge === 'viewer' ? 'secondary' : 'default'}
                className={`text-xs ${
                  manager.role_badge === 'viewer' 
                    ? 'bg-gray-100 text-gray-700 border-gray-300' 
                    : 'bg-blue-100 text-blue-700 border-blue-300'
                }`}
              >
                {manager.role_badge === 'viewer' ? 'Viewer' : 'Member'}
              </Badge>
            )}
            {manager.fund_type && (
              <Badge variant="secondary" className="text-xs">
                {manager.fund_type}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* All cards show colored icons - Show different details based on user role */}
          
          {/* Website */}
          {manager.website && (
            <div className="flex items-center text-sm text-gray-600">
              <Globe className="w-4 h-4 mr-2 text-blue-600" />
              <a 
                href={manager.website.startsWith('http') ? manager.website : `https://${manager.website}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                {manager.website}
              </a>
            </div>
          )}

          {/* Team Size */}
          {manager.team_size && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-green-600" />
              <span>Team Size: {manager.team_size} members</span>
            </div>
          )}

          {/* Ticket Size */}
          {manager.typical_check_size && (
            <div className="flex items-center text-sm text-gray-600">
              <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
              <span>Ticket Size: {manager.typical_check_size}</span>
            </div>
          )}

          {/* Capital Raised */}
          {manager.aum && (
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-600" />
              <span>Capital Raised: {manager.aum}</span>
            </div>
          )}

          {/* Investment Thesis */}
          {manager.investment_thesis && (
            <div className="text-sm text-gray-600">
              <div className="font-medium mb-1 flex items-center">
                <Target className="w-4 h-4 mr-2 text-green-600" />
                Investment Thesis:
              </div>
              <div className="text-xs text-gray-500 line-clamp-2 ml-6">
                {manager.investment_thesis}
              </div>
            </div>
          )}

          {/* Fund Type */}
          {manager.fund_type && (
            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="w-4 h-4 mr-2 text-orange-600" />
              <span>Fund Type: {manager.fund_type}</span>
            </div>
          )}

          {/* Geographic Region */}
          {manager.primary_investment_region && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2 text-orange-600" />
              <span>Region: {manager.primary_investment_region}</span>
            </div>
          )}

          {/* Year Founded */}
          {manager.year_founded && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-teal-600" />
              <span>Founded: {manager.year_founded}</span>
            </div>
          )}

          {/* Completion Date */}
          {manager.completed_at && (
            <div className="text-xs text-gray-500 flex items-center">
              <FileText className="w-3 h-3 mr-1 text-teal-600" />
              Approved: {new Date(manager.completed_at).toLocaleDateString()}
            </div>
          )}

        </div>

        {/* Member Details - Show for members and admins */}
        {canViewDetails && (
          <div className="space-y-3">
            {/* For members, show only basic info */}
            {userRole === 'member' && (
              <>
                {manager.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="w-4 h-4 mr-2 text-blue-600" />
                    <a 
                      href={manager.website.startsWith('http') ? manager.website : `https://${manager.website}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {manager.website}
                    </a>
                  </div>
                )}

                {manager.primary_investment_region && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                    <span>Legal Domicile: {manager.primary_investment_region}</span>
                  </div>
                )}
              </>
            )}

            {/* For admins, show full details */}
            {isAdmin && (
              <>
                {manager.team_size && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    <span>{manager.team_size} team members</span>
                  </div>
                )}

                {manager.typical_check_size && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                    <span>Typical Check: {manager.typical_check_size}</span>
                  </div>
                )}

                {manager.year_founded && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-teal-600" />
                    <span>Founded {manager.year_founded}</span>
                  </div>
                )}

                {/* Survey Data - Show more detailed information */}
                {manager.sector_focus && manager.sector_focus.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1 flex items-center">
                      <PieChart className="w-4 h-4 mr-2 text-pink-600" />
                      Sector Focus:
                    </div>
                    <div className="text-xs text-gray-500 ml-6">
                      {manager.sector_focus.join(', ')}
                    </div>
                  </div>
                )}

                {manager.stage_focus && manager.stage_focus.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      Stage Focus:
                    </div>
                    <div className="text-xs text-gray-500 ml-6">
                      {manager.stage_focus.join(', ')}
                    </div>
                  </div>
                )}

                {manager.investment_thesis && (
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      Investment Thesis:
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-3 ml-6">
                      {manager.investment_thesis}
                    </div>
                  </div>
                )}

                {manager.completed_at && (
                  <div className="text-xs text-gray-500 flex items-center">
                    <FileText className="w-3 h-3 mr-1 text-teal-600" />
                    Profile completed: {new Date(manager.completed_at).toLocaleDateString()}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4 mt-auto">
          {canViewDetails ? (
            <Link to={`/network/fund-manager/${manager.user_id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2 text-cyan-600" />
                {userRole === 'admin' ? 'View Full Details' : 'View Profile'}
              </Button>
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
