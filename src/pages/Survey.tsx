
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Save, FileText, Users, Globe, Target, Building2, BarChart3, PieChart, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Survey = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    vehicle_websites: [],
    vehicle_type: '',
    thesis: '',
    team_members: [{ name: '', email: '', phone: '', role: '' }],
    team_size_min: '',
    team_size_max: '',
    team_description: '',
    legal_domicile: [],
    markets_operated: {},
    ticket_size_min: '',
    ticket_size_max: '',
    target_capital: '',
    capital_raised: '',
    capital_in_market: '',
    supporting_document_url: '',
    information_sharing: '',
    expectations: '',
    how_heard_about_network: '',
    fund_stage: [],
    current_status: '',
    legal_entity_date_from: '',
    legal_entity_date_to: '',
    first_close_date_from: '',
    first_close_date_to: '',
    investment_instruments_priority: {},
    sectors_allocation: {},
    target_return_min: '',
    target_return_max: '',
    equity_investments_made: '',
    equity_investments_exited: '',
    self_liquidating_made: '',
    self_liquidating_exited: ''
  });

  const sections = [
    { id: 1, title: 'Basic Vehicle Information', icon: Building2, fields: 3 },
    { id: 2, title: 'Team & Leadership', icon: Users, fields: 4 },
    { id: 3, title: 'Geographic & Market Focus', icon: Globe, fields: 2 },
    { id: 4, title: 'Investment Strategy', icon: Target, fields: 4 },
    { id: 5, title: 'Fund Operations', icon: FileText, fields: 4 },
    { id: 6, title: 'Fund Status & Timeline', icon: BarChart3, fields: 6 },
    { id: 7, title: 'Investment Instruments', icon: PieChart, fields: 1 },
    { id: 8, title: 'Sector Focus & Returns', icon: DollarSign, fields: 6 }
  ];

  const totalFields = sections.reduce((sum, section) => sum + section.fields, 0);
  const completedFields = calculateCompletedFields();
  const progress = (completedFields / totalFields) * 100;

  function calculateCompletedFields() {
    let completed = 0;
    if (formData.vehicle_websites.length > 0) completed++;
    if (formData.vehicle_type) completed++;
    if (formData.thesis) completed++;
    if (formData.team_members.some(member => member.name && member.email)) completed++;
    if (formData.team_size_min) completed++;
    if (formData.team_size_max) completed++;
    if (formData.team_description) completed++;
    return completed;
  }

  const handleSave = async () => {
    try {
      // Convert string values to numbers where needed
      const processedData = {
        ...formData,
        user_id: user?.id,
        team_size_min: formData.team_size_min ? parseInt(formData.team_size_min) : null,
        team_size_max: formData.team_size_max ? parseInt(formData.team_size_max) : null,
        ticket_size_min: formData.ticket_size_min ? parseFloat(formData.ticket_size_min) : null,
        ticket_size_max: formData.ticket_size_max ? parseFloat(formData.ticket_size_max) : null,
        target_capital: formData.target_capital ? parseFloat(formData.target_capital) : null,
        capital_raised: formData.capital_raised ? parseFloat(formData.capital_raised) : null,
        capital_in_market: formData.capital_in_market ? parseFloat(formData.capital_in_market) : null,
        target_return_min: formData.target_return_min ? parseFloat(formData.target_return_min) : null,
        target_return_max: formData.target_return_max ? parseFloat(formData.target_return_max) : null,
        equity_investments_made: formData.equity_investments_made ? parseFloat(formData.equity_investments_made) : null,
        equity_investments_exited: formData.equity_investments_exited ? parseFloat(formData.equity_investments_exited) : null,
        self_liquidating_made: formData.self_liquidating_made ? parseFloat(formData.self_liquidating_made) : null,
        self_liquidating_exited: formData.self_liquidating_exited ? parseFloat(formData.self_liquidating_exited) : null,
        legal_entity_date_from: formData.legal_entity_date_from ? parseInt(formData.legal_entity_date_from) : null,
        legal_entity_date_to: formData.legal_entity_date_to ? parseInt(formData.legal_entity_date_to) : null,
        first_close_date_from: formData.first_close_date_from ? parseInt(formData.first_close_date_from) : null,
        first_close_date_to: formData.first_close_date_to ? parseInt(formData.first_close_date_to) : null,
      };

      const { error } = await supabase
        .from('survey_responses')
        .upsert(processedData);

      if (error) throw error;

      toast({
        title: "Survey Saved",
        description: "Your progress has been saved successfully.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    try {
      // Convert string values to numbers where needed
      const processedData = {
        ...formData,
        user_id: user?.id,
        completed_at: new Date().toISOString(),
        team_size_min: formData.team_size_min ? parseInt(formData.team_size_min) : null,
        team_size_max: formData.team_size_max ? parseInt(formData.team_size_max) : null,
        ticket_size_min: formData.ticket_size_min ? parseFloat(formData.ticket_size_min) : null,
        ticket_size_max: formData.ticket_size_max ? parseFloat(formData.ticket_size_max) : null,
        target_capital: formData.target_capital ? parseFloat(formData.target_capital) : null,
        capital_raised: formData.capital_raised ? parseFloat(formData.capital_raised) : null,
        capital_in_market: formData.capital_in_market ? parseFloat(formData.capital_in_market) : null,
        target_return_min: formData.target_return_min ? parseFloat(formData.target_return_min) : null,
        target_return_max: formData.target_return_max ? parseFloat(formData.target_return_max) : null,
        equity_investments_made: formData.equity_investments_made ? parseFloat(formData.equity_investments_made) : null,
        equity_investments_exited: formData.equity_investments_exited ? parseFloat(formData.equity_investments_exited) : null,
        self_liquidating_made: formData.self_liquidating_made ? parseFloat(formData.self_liquidating_made) : null,
        self_liquidating_exited: formData.self_liquidating_exited ? parseFloat(formData.self_liquidating_exited) : null,
        legal_entity_date_from: formData.legal_entity_date_from ? parseInt(formData.legal_entity_date_from) : null,
        legal_entity_date_to: formData.legal_entity_date_to ? parseInt(formData.legal_entity_date_to) : null,
        first_close_date_from: formData.first_close_date_from ? parseInt(formData.first_close_date_from) : null,
        first_close_date_to: formData.first_close_date_to ? parseInt(formData.first_close_date_to) : null,
      };

      const { error } = await supabase
        .from('survey_responses')
        .upsert(processedData);

      if (error) throw error;

      toast({
        title: "Survey Completed",
        description: "Thank you for completing the survey!",
      });
    } catch (error) {
      console.error('Complete error:', error);
      toast({
        title: "Error",
        description: "Failed to complete survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      team_members: [...prev.team_members, { name: '', email: '', phone: '', role: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      team_members: prev.team_members.filter((_, i) => i !== index)
    }));
  };

  const renderSection = () => {
    const currentSectionData = sections.find(s => s.id === currentSection);
    const Icon = currentSectionData?.icon || FileText;

    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Icon className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-black">Basic Vehicle Information</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="vehicle_websites" className="text-black font-medium">Vehicle Website(s)</Label>
                <Input
                  id="vehicle_websites"
                  placeholder="https://example.com"
                  value={formData.vehicle_websites.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicle_websites: e.target.value.split(', ').filter(Boolean)
                  }))}
                  className="border-gray-300"
                />
              </div>

              <div>
                <Label htmlFor="vehicle_type" className="text-black font-medium">Vehicle Type</Label>
                <Select value={formData.vehicle_type} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_type: value }))}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="thesis" className="text-black font-medium">Investment Thesis</Label>
                <Textarea
                  id="thesis"
                  placeholder="Describe your investment philosophy and approach..."
                  value={formData.thesis}
                  onChange={(e) => setFormData(prev => ({ ...prev, thesis: e.target.value }))}
                  rows={4}
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Icon className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-black">Team &amp; Leadership</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-black font-medium">Team Members</Label>
                {formData.team_members.map((member, index) => (
                  <Card key={index} className="p-4 mt-2 border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => {
                          const newMembers = [...formData.team_members];
                          newMembers[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, team_members: newMembers }));
                        }}
                        className="border-gray-300"
                      />
                      <Input
                        placeholder="Email"
                        type="email"
                        value={member.email}
                        onChange={(e) => {
                          const newMembers = [...formData.team_members];
                          newMembers[index].email = e.target.value;
                          setFormData(prev => ({ ...prev, team_members: newMembers }));
                        }}
                        className="border-gray-300"
                      />
                      <Input
                        placeholder="Phone"
                        value={member.phone}
                        onChange={(e) => {
                          const newMembers = [...formData.team_members];
                          newMembers[index].phone = e.target.value;
                          setFormData(prev => ({ ...prev, team_members: newMembers }));
                        }}
                        className="border-gray-300"
                      />
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Role"
                          value={member.role}
                          onChange={(e) => {
                            const newMembers = [...formData.team_members];
                            newMembers[index].role = e.target.value;
                            setFormData(prev => ({ ...prev, team_members: newMembers }));
                          }}
                          className="border-gray-300"
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeTeamMember(index)}
                            className="border-gray-300"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addTeamMember} className="mt-2 border-gray-300">
                  Add Team Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team_size_min" className="text-black font-medium">Minimum Team Size</Label>
                  <Input
                    id="team_size_min"
                    type="number"
                    value={formData.team_size_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, team_size_min: e.target.value }))}
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <Label htmlFor="team_size_max" className="text-black font-medium">Maximum Team Size</Label>
                  <Input
                    id="team_size_max"
                    type="number"
                    value={formData.team_size_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, team_size_max: e.target.value }))}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="team_description" className="text-black font-medium">Team Description</Label>
                <Textarea
                  id="team_description"
                  placeholder="Describe your team's background and experience..."
                  value={formData.team_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, team_description: e.target.value }))}
                  rows={3}
                  className="border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Section Under Construction</h3>
            <p className="text-gray-600">This section is being developed. Please check back soon.</p>
          </div>
        );
    }
  };

  if (userRole !== 'member' && userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Access Restricted</CardTitle>
              <CardDescription className="text-red-700">
                You need Member access to complete the survey. Please request membership upgrade.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-black">Fund Manager Survey</h1>
            <div className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white border">
              <CardHeader>
                <CardTitle className="text-lg text-black">Survey Sections</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = currentSection === section.id;
                    const isCompleted = section.id < currentSection;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSection(section.id)}
                        className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                            : isCompleted
                            ? 'text-green-600 hover:bg-gray-50'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                        <span className="truncate">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="bg-white border">
              <CardContent className="p-8">
                {renderSection()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
                    disabled={currentSection === 1}
                    className="border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSave} className="border-gray-300">
                      <Save className="w-4 h-4 mr-2" />
                      Save Progress
                    </Button>
                    
                    {currentSection === sections.length ? (
                      <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-white">
                        Complete Survey
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentSection(Math.min(sections.length, currentSection + 1))}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Survey;
