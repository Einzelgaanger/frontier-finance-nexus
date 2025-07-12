
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, Users, Eye, MapPin, Calendar, DollarSign, Target, Briefcase, Award, TrendingUp, FileText } from 'lucide-react';
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
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
          {manager.fund_type && (
            <Badge variant="secondary" className="ml-2">
              {manager.fund_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Basic Info - Visible to all */}
        {manager.website && (
          <div className="flex items-center text-sm text-gray-600">
            <Globe className="w-4 h-4 mr-2" />
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
            <MapPin className="w-4 h-4 mr-2" />
            <span>{manager.primary_investment_region}</span>
          </div>
        )}

        {/* Member Details - Show for members and admins */}
        {canViewDetails && (
          <>
            {manager.team_size && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{manager.team_size} team members</span>
              </div>
            )}

            {manager.typical_check_size && (
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>Typical Check: {manager.typical_check_size}</span>
              </div>
            )}

            {manager.year_founded && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Founded {manager.year_founded}</span>
              </div>
            )}

            {/* Survey Data - Show more detailed information */}
            {manager.sector_focus && manager.sector_focus.length > 0 && (
              <div className="text-sm text-gray-600">
                <div className="flex items-center mb-1">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="font-medium">Sectors:</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {manager.sector_focus.slice(0, 3).map((sector, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {sector}
                    </Badge>
                  ))}
                  {manager.sector_focus.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{manager.sector_focus.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {manager.stage_focus && manager.stage_focus.length > 0 && (
              <div className="text-sm text-gray-600">
                <div className="flex items-center mb-1">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span className="font-medium">Stages:</span>
                </div>
                <div className="flex flex-wrap gap-1 ml-6">
                  {manager.stage_focus.slice(0, 3).map((stage, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {stage}
                    </Badge>
                  ))}
                  {manager.stage_focus.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{manager.stage_focus.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Admin-only details */}
            {isAdmin && (
              <>
                {manager.aum && (
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>AUM: {manager.aum}</span>
                  </div>
                )}

                {manager.investment_thesis && (
                  <div className="text-sm text-gray-600">
                    <div className="font-medium mb-1 flex items-center">
                      <Award className="w-4 h-4 mr-2" />
                      Investment Thesis:
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2 ml-6">
                      {manager.investment_thesis}
                    </div>
                  </div>
                )}
              </>
            )}

            {manager.completed_at && (
              <div className="text-xs text-gray-500 flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                Profile completed: {new Date(manager.completed_at).toLocaleDateString()}
              </div>
            )}
          </>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {canViewDetails ? (
            <Link to={`/network/fund-manager/${manager.user_id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                {isAdmin ? 'View Full Details' : 'View Profile'}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Eye className="w-4 h-4 mr-2" />
              {isViewer ? 'Member Access Required' : 'Sign in to view details'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
