
import { useState } from 'react';
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
    ticket_description: '',
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
    // Add more field checks as needed
    return completed;
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('survey_responses')
        .upsert({
          user_id: user?.id,
          ...formData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Survey Saved",
        description: "Your progress has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleComplete = async () => {
    try {
      const { error } = await supabase
        .from('survey_responses')
        .upsert({
          user_id: user?.id,
          ...formData,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Survey Completed",
        description: "Thank you for completing the survey!",
      });
    } catch (error) {
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
                <Label htmlFor="vehicle_websites">Vehicle Website(s)</Label>
                <Input
                  id="vehicle_websites"
                  placeholder="https://example.com"
                  value={formData.vehicle_websites.join(', ')}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    vehicle_websites: e.target.value.split(', ').filter(Boolean)
                  }))}
                />
              </div>

              <div>
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Select value={formData.vehicle_type} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicle_type: value }))}>
                  <SelectTrigger>
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
                <Label htmlFor="thesis">Investment Thesis</Label>
                <Textarea
                  id="thesis"
                  placeholder="Describe your investment philosophy and approach..."
                  value={formData.thesis}
                  onChange={(e) => setFormData(prev => ({ ...prev, thesis: e.target.value }))}
                  rows={4}
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
              <h2 className="text-2xl font-bold text-black">Team & Leadership</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Team Members</Label>
                {formData.team_members.map((member, index) => (
                  <Card key={index} className="p-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => {
                          const newMembers = [...formData.team_members];
                          newMembers[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, team_members: newMembers }));
                        }}
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
                      />
                      <Input
                        placeholder="Phone"
                        value={member.phone}
                        onChange={(e) => {
                          const newMembers = [...formData.team_members];
                          newMembers[index].phone = e.target.value;
                          setFormData(prev => ({ ...prev, team_members: newMembers }));
                        }}
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
                        />
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeTeamMember(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                <Button type="button" variant="outline" onClick={addTeamMember} className="mt-2">
                  Add Team Member
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="team_size_min">Minimum Team Size</Label>
                  <Input
                    id="team_size_min"
                    type="number"
                    value={formData.team_size_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, team_size_min: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="team_size_max">Maximum Team Size</Label>
                  <Input
                    id="team_size_max"
                    type="number"
                    value={formData.team_size_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, team_size_max: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="team_description">Team Description</Label>
                <Textarea
                  id="team_description"
                  placeholder="Describe your team's background and experience..."
                  value={formData.team_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, team_description: e.target.value }))}
                  rows={3}
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
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-red-600">Access Restricted</CardTitle>
              <CardDescription>
                You need Member access to complete the survey. Please request membership upgrade.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Survey Sections</CardTitle>
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
            <Card>
              <CardContent className="p-8">
                {renderSection()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(1, currentSection - 1))}
                    disabled={currentSection === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Progress
                    </Button>
                    
                    {currentSection === sections.length ? (
                      <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                        Complete Survey
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentSection(Math.min(sections.length, currentSection + 1))}
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
