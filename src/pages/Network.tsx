
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Building2, Globe, Users, TrendingUp, MapPin, DollarSign, Target, Calendar, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FundManager {
  id: string;
  user_id: string;
  year: number;
  vehicle_type: string;
  thesis: string;
  team_size_min: number;
  team_size_max: number;
  legal_domicile: string[];
  markets_operated: Record<string, number>;
  ticket_size_min: number;
  ticket_size_max: number;
  target_capital: number;
  capital_raised: number;
  fund_stage: string[];
  current_status: string;
  sectors_allocation: Record<string, number>;
  target_return_min: number;
  target_return_max: number;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const Network = () => {
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedManager, setSelectedManager] = useState<FundManager | null>(null);
  const [loading, setLoading] = useState(true);
  const { userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchFundManagers = async () => {
      try {
        const { data, error } = await supabase
          .from('survey_responses')
          .select(`
            id,
            user_id,
            year,
            vehicle_type,
            thesis,
            team_size_min,
            team_size_max,
            legal_domicile,
            markets_operated,
            ticket_size_min,
            ticket_size_max,
            target_capital,
            capital_raised,
            fund_stage,
            current_status,
            sectors_allocation,
            target_return_min,
            target_return_max,
            profiles!inner (
              first_name,
              last_name,
              email
            )
          `)
          .not('completed_at', 'is', null)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setFundManagers(data || []);
        setFilteredManagers(data || []);
      } catch (error) {
        console.error('Error fetching fund managers:', error);
        toast({
          title: "Error",
          description: "Failed to load fund managers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFundManagers();
  }, [toast]);

  useEffect(() => {
    const filtered = fundManagers.filter(manager => {
      const searchLower = searchTerm.toLowerCase();
      return (
        manager.profiles.first_name?.toLowerCase().includes(searchLower) ||
        manager.profiles.last_name?.toLowerCase().includes(searchLower) ||
        manager.vehicle_type?.toLowerCase().includes(searchLower) ||
        manager.thesis?.toLowerCase().includes(searchLower) ||
        manager.legal_domicile?.some(d => d.toLowerCase().includes(searchLower))
      );
    });
    setFilteredManagers(filtered);
  }, [searchTerm, fundManagers]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getTopSectors = (sectors: Record<string, number>) => {
    if (!sectors) return [];
    return Object.entries(sectors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([sector, percentage]) => ({ sector, percentage }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Fund Manager Network</h1>
          <p className="text-gray-600 mb-6">
            Connect with {fundManagers.length} fund managers across emerging markets
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search fund managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Fund Managers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map((manager) => (
            <Dialog key={manager.id}>
              <DialogTrigger asChild>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getInitials(manager.profiles.first_name, manager.profiles.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {manager.profiles.first_name} {manager.profiles.last_name}
                        </CardTitle>
                        <CardDescription className="flex items-center">
                          <Building2 className="w-3 h-3 mr-1" />
                          {manager.vehicle_type?.replace('_', ' ').toUpperCase()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {manager.thesis}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {manager.legal_domicile?.slice(0, 2).join(', ')}
                      {manager.legal_domicile?.length > 2 && ` +${manager.legal_domicile.length - 2}`}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-3 h-3 mr-1" />
                      {formatCurrency(manager.ticket_size_min)} - {formatCurrency(manager.ticket_size_max)}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {getTopSectors(manager.sectors_allocation).slice(0, 2).map(({ sector }) => (
                        <Badge key={sector} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-3">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                        {getInitials(manager.profiles.first_name, manager.profiles.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {manager.profiles.first_name} {manager.profiles.last_name}
                      </h2>
                      <p className="text-gray-600">{manager.profiles.email}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Fund Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building2 className="w-5 h-5 mr-2" />
                        Fund Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="font-medium">Type: </span>
                        {manager.vehicle_type?.replace('_', ' ').toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium">Status: </span>
                        {manager.current_status?.replace('_', ' ').toUpperCase()}
                      </div>
                      <div>
                        <span className="font-medium">Team Size: </span>
                        {manager.team_size_min} - {manager.team_size_max} members
                      </div>
                      <div>
                        <span className="font-medium">Thesis: </span>
                        <p className="mt-1 text-sm text-gray-600">{manager.thesis}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Investment Strategy */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-5 h-5 mr-2" />
                        Investment Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="font-medium">Ticket Size: </span>
                        {formatCurrency(manager.ticket_size_min)} - {formatCurrency(manager.ticket_size_max)}
                      </div>
                      {(userRole === 'admin' || userRole === 'member') && (
                        <>
                          <div>
                            <span className="font-medium">Target Capital: </span>
                            {formatCurrency(manager.target_capital)}
                          </div>
                          <div>
                            <span className="font-medium">Capital Raised: </span>
                            {formatCurrency(manager.capital_raised)}
                          </div>
                          <div>
                            <span className="font-medium">Target Returns: </span>
                            {manager.target_return_min}% - {manager.target_return_max}%
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Geographic Focus */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Geographic Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <span className="font-medium">Legal Domicile:</span>
                        <div className="flex flex-wrap gap-1">
                          {manager.legal_domicile?.map((domicile) => (
                            <Badge key={domicile} variant="outline">
                              {domicile}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {manager.markets_operated && Object.keys(manager.markets_operated).length > 0 && (
                        <div className="mt-4 space-y-2">
                          <span className="font-medium">Market Focus:</span>
                          <div className="space-y-1">
                            {Object.entries(manager.markets_operated)
                              .filter(([, percentage]) => percentage > 0)
                              .map(([market, percentage]) => (
                                <div key={market} className="flex justify-between text-sm">
                                  <span>{market}</span>
                                  <span>{percentage}%</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Sector Allocation */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Sector Focus
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {manager.sectors_allocation && Object.keys(manager.sectors_allocation).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(manager.sectors_allocation)
                            .filter(([, percentage]) => percentage > 0)
                            .sort(([,a], [,b]) => b - a)
                            .map(([sector, percentage]) => (
                              <div key={sector} className="flex justify-between items-center">
                                <span className="text-sm font-medium">{sector}</span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full" 
                                      style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">{percentage}%</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No sector allocation data available</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Fund Stage & Timeline */}
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Fund Stage & Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {manager.fund_stage?.map((stage) => (
                          <Badge key={stage} className="bg-green-100 text-green-800">
                            {stage}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        {filteredManagers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fund managers found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'No fund managers have completed their surveys yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Network;
