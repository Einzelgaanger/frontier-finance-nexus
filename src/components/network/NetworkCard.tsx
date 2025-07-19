
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
  
  // Icon colors that match the card themes
  const iconColors = [
    'text-blue-600',
    'text-green-600',
    'text-yellow-600',
    'text-orange-600',
    'text-purple-600',
    'text-pink-600',
    'text-indigo-600',
    'text-teal-600',
    'text-cyan-600',
    'text-rose-600',
    'text-violet-600',
    'text-amber-600'
  ];
  
  // Simple hash function to get consistent color for each manager
  const hash = manager.id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const colorIndex = Math.abs(hash) % cardColors.length;
  const colorClass = cardColors[colorIndex];
  const iconColor = iconColors[colorIndex];

  return (
    <Card className={`hover:shadow-lg transition-shadow bg-gradient-to-br ${colorClass} backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              <Building2 className={`w-5 h-5 mr-2 ${iconColor}`} />
              {manager.fund_name || 'Unknown Fund'}
            </CardTitle>
            {manager.profiles && (
              <p className="text-sm text-gray-600 mt-1">
                {manager.profiles.first_name} {manager.profiles.last_name}
              </p>
            )}
          </div>
          {manager.fund_type && (
            <Badge variant="secondary" className="ml-2">
              {manager.fund_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Viewer Details - Show for viewers */}
        {isViewer && (
          <>
            {manager.typical_check_size && (
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className={`w-4 h-4 mr-2 ${iconColor}`} />
                <span>Ticket Size: {manager.typical_check_size}</span>
              </div>
            )}

            {manager.aum && (
              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className={`w-4 h-4 mr-2 ${iconColor}`} />
                <span>Capital Raised: {manager.aum}</span>
              </div>
            )}

            {manager.investment_thesis && (
              <div className="text-sm text-gray-600">
                <div className="font-medium mb-1 flex items-center">
                  <Target className={`w-4 h-4 mr-2 ${iconColor}`} />
                  Investment Thesis:
                </div>
                <div className="text-xs text-gray-500 line-clamp-2 ml-6">
                  {manager.investment_thesis}
                </div>
              </div>
            )}

            {manager.completed_at && (
              <div className="text-xs text-gray-500 flex items-center">
                <FileText className={`w-3 h-3 mr-1 ${iconColor}`} />
                Approved: {new Date(manager.completed_at).toLocaleDateString()}
              </div>
            )}
          </>
        )}

        {/* Member Details - Show for members and admins */}
        {canViewDetails && (
          <>
            {/* For members, show only basic info */}
            {userRole === 'member' && (
              <>
                {manager.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className={`w-4 h-4 mr-2 ${iconColor}`} />
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
                    <MapPin className={`w-4 h-4 mr-2 ${iconColor}`} />
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
                    <Users className={`w-4 h-4 mr-2 ${iconColor}`} />
                    <span>{manager.team_size} team members</span>
                  </div>
                )}

                {manager.typical_check_size && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className={`w-4 h-4 mr-2 ${iconColor}`} />
                    <span>Typical Check: {manager.typical_check_size}</span>
                  </div>
                )}

                {manager.year_founded && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className={`w-4 h-4 mr-2 ${iconColor}`} />
                    <span>Founded {manager.year_founded}</span>
                  </div>
                )}

                {/* Survey Data - Show more detailed information */}
                {manager.sector_focus && manager.sector_focus.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1 flex items-center">
                      <PieChart className={`w-4 h-4 mr-2 ${iconColor}`} />
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
                      <Target className={`w-4 h-4 mr-2 ${iconColor}`} />
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
                      <Target className={`w-4 h-4 mr-2 ${iconColor}`} />
                      Investment Thesis:
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-3 ml-6">
                      {manager.investment_thesis}
                    </div>
                  </div>
                )}

                {manager.completed_at && (
                  <div className="text-xs text-gray-500 flex items-center">
                    <FileText className={`w-3 h-3 mr-1 ${iconColor}`} />
                    Profile completed: {new Date(manager.completed_at).toLocaleDateString()}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {canViewDetails ? (
            <Link to={`/network/fund-manager/${manager.user_id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                {userRole === 'admin' ? 'View Full Details' : 'View Profile'}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Eye className="w-4 h-4 mr-2" />
              {isViewer ? 'Viewer Access - Apply to Join' : 'Sign in to view details'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
