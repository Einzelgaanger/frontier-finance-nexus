
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Globe, Users, Eye, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NetworkCardProps {
  fund: {
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
    profiles?: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  userRole: string;
  showDetails?: boolean;
}

export function NetworkCard({ fund, userRole, showDetails = false }: NetworkCardProps) {
  const canViewDetails = userRole === 'member' || userRole === 'admin';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              {fund.fund_name}
            </CardTitle>
            {fund.profiles && (
              <p className="text-sm text-gray-600 mt-1">
                {fund.profiles.first_name} {fund.profiles.last_name}
              </p>
            )}
          </div>
          {fund.fund_type && (
            <Badge variant="secondary" className="ml-2">
              {fund.fund_type}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Basic Info - Visible to all */}
        {fund.website && (
          <div className="flex items-center text-sm text-gray-600">
            <Globe className="w-4 h-4 mr-2" />
            <a 
              href={fund.website.startsWith('http') ? fund.website : `https://${fund.website}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {fund.website}
            </a>
          </div>
        )}

        {fund.primary_investment_region && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{fund.primary_investment_region}</span>
          </div>
        )}

        {/* Additional Details - Members and Admins only */}
        {canViewDetails && showDetails && (
          <>
            {fund.team_size && (
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{fund.team_size} team members</span>
              </div>
            )}

            {fund.typical_check_size && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Typical Check Size:</span> {fund.typical_check_size}
              </div>
            )}

            {fund.year_founded && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Founded {fund.year_founded}</span>
              </div>
            )}

            {fund.completed_at && (
              <div className="text-xs text-gray-500">
                Profile completed: {new Date(fund.completed_at).toLocaleDateString()}
              </div>
            )}
          </>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {canViewDetails ? (
            <Link to={`/fund-manager/${fund.user_id}`}>
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="w-full" disabled>
              <Eye className="w-4 h-4 mr-2" />
              Member Access Required
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
