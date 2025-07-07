
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Users, Building2, Globe, TrendingUp } from "lucide-react";
import { useState } from "react";

const Network = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data for fund managers
  const fundManagers = [
    {
      id: 1,
      name: "East Africa Growth Fund",
      vehicle_type: "Closed",
      fund_stage: ["Scale"],
      legal_domicile: ["Kenya"],
      sectors_allocation: { "Agri: SME/Food value chain/Agritech": 40, "Clean energy/renewable/e-mobility": 35, "Manufacturing": 25 },
      team_size_range: "5-10",
      target_capital: 50000000,
      current_status: "Fundraising"
    },
    {
      id: 2,
      name: "Sahara Ventures",
      vehicle_type: "Open",
      fund_stage: ["Implementation", "Scale"],
      legal_domicile: ["Nigeria", "Ghana"],
      sectors_allocation: { "Software services/SaaS": 50, "Healthcare/medical services": 30, "Education": 20 },
      team_size_range: "10-15",
      target_capital: 75000000,
      current_status: "Fundraising"
    },
    {
      id: 3,
      name: "Nile Capital Partners",
      vehicle_type: "Closed",
      fund_stage: ["Pilot", "Scale"],
      legal_domicile: ["Egypt"],
      sectors_allocation: { "Tech/telecom/data infrastructure": 45, "FMCG": 30, "Logistics/Transport/Distribution": 25 },
      team_size_range: "8-12",
      target_capital: 30000000,
      current_status: "Other"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredFunds = fundManagers.filter(fund =>
    fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fund.legal_domicile.some(country => country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Fund Manager Network
            </h1>
            <p className="text-gray-600 mb-6">
              Explore our comprehensive database of emerging market fund managers
            </p>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search funds by name or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Funds</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{filteredFunds.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Avg Target</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(filteredFunds.reduce((acc, fund) => acc + fund.target_capital, 0) / filteredFunds.length)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Countries</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {new Set(filteredFunds.flatMap(fund => fund.legal_domicile)).size}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Fundraising</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">
                  {filteredFunds.filter(fund => fund.current_status === 'Fundraising').length}
                </p>
              </div>
            </div>
          </div>

          {/* Fund Cards */}
          <div className="grid gap-6">
            {filteredFunds.map((fund) => (
              <Card key={fund.id} className="border border-gray-200 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-900">{fund.name}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          {fund.vehicle_type}
                        </Badge>
                        <Badge variant="outline" className={`${
                          fund.current_status === 'Fundraising' 
                            ? 'border-green-200 text-green-700 bg-green-50' 
                            : 'border-gray-200 text-gray-700'
                        }`}>
                          {fund.current_status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(fund.target_capital)}
                      </p>
                      <p className="text-sm text-gray-600">Target Capital</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Geographic Focus */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        Geographic Focus
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {fund.legal_domicile.map((country, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {country}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Fund Stage */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Fund Stage
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {fund.fund_stage.map((stage, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {stage}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Team Size */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Team Size
                      </h4>
                      <p className="text-sm text-gray-600">{fund.team_size_range} members</p>
                    </div>
                  </div>

                  {/* Sector Allocation */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Sector Allocation</h4>
                    <div className="space-y-2">
                      {Object.entries(fund.sectors_allocation).map(([sector, percentage]) => (
                        <div key={sector} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 flex-1">{sector}</span>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFunds.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No funds found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Network;
