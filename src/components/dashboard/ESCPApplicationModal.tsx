
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, Upload, Building2, Users, Globe, Target } from 'lucide-react';

interface ESCPApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ESCPApplicationModal({ open, onClose }: ESCPApplicationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  
  const [formData, setFormData] = useState({
    // Background Information
    applicant_name: '',
    email: user?.email || '',
    vehicle_name: '',
    organization_website: '',
    domicile_country: '',
    
    // Team Information
    role_job_title: '',
    team_overview: '',
    country_of_operation: '',
    
    // Vehicle Information
    investment_thesis: '',
    typical_check_size: '',
    number_of_investments: '',
    amount_raised_to_date: '',
    supporting_documents: [] as File[],
    
    // Network Expectations
    information_sharing_topics: [] as string[],
    expectations_from_network: '',
    how_heard_about_network: '',
    how_heard_other: '',
    
    // Additional fields
    fund_vehicle_type: '',
    fundraising_status: '',
    notable_investments: '',
    additional_comments: ''
  });

  const informationSharingOptions = [
    'Deal Flow Sharing',
    'Market Intelligence',
    'Due Diligence Insights',
    'Exit Strategies',
    'Regulatory Updates',
    'Investment Thesis Development',
    'Portfolio Management',
    'Fund Operations',
    'Limited Partner Relations',
    'ESG Best Practices'
  ];

  const howHeardOptions = [
    'LinkedIn',
    'Industry Conference',
    'Referral from Network Member',
    'Investment Community',
    'Media/Press',
    'Direct Outreach',
    'Other'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 5) {
      toast({
        title: "Too many files",
        description: "Maximum 5 files allowed",
        variant: "destructive"
      });
      return;
    }
    
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        return false;
      }
      return file.type === 'application/pdf';
    });
    
    setFormData(prev => ({ ...prev, supporting_documents: validFiles }));
  };

  const handleTopicToggle = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      information_sharing_topics: prev.information_sharing_topics.includes(topic)
        ? prev.information_sharing_topics.filter(t => t !== topic)
        : [...prev.information_sharing_topics, topic]
    }));
  };

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        return !!(formData.applicant_name && formData.email && formData.vehicle_name && formData.organization_website && formData.domicile_country);
      case 2:
        return !!(formData.role_job_title && formData.team_overview && formData.country_of_operation);
      case 3:
        return !!(formData.investment_thesis && formData.typical_check_size && formData.number_of_investments && formData.amount_raised_to_date);
      case 4:
        return !!(formData.information_sharing_topics.length > 0 && formData.expectations_from_network && formData.how_heard_about_network);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Incomplete Section",
        description: "Please fill in all required fields before proceeding",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentSection(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "Please log in to submit your application",
        variant: "destructive"
      });
      return;
    }

    if (!validateSection(4)) {
      toast({
        title: "Incomplete Application",
        description: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const applicationData = {
        user_id: user.id,
        applicant_name: formData.applicant_name,
        email: formData.email,
        vehicle_name: formData.vehicle_name,
        vehicle_website: formData.organization_website,
        domicile_country: formData.domicile_country,
        role_job_title: formData.role_job_title,
        team_size: formData.team_overview,
        location: formData.country_of_operation,
        thesis: formData.investment_thesis,
        ticket_size: formData.typical_check_size,
        portfolio_investments: formData.number_of_investments,
        capital_raised: formData.amount_raised_to_date,
        supporting_documents: formData.supporting_documents.length > 0 ? 'Documents uploaded' : null,
        information_sharing: {
          topics: formData.information_sharing_topics,
          other: ''
        },
        expectations: formData.expectations_from_network,
        how_heard_about_network: formData.how_heard_about_network,
        status: 'pending'
      };

      const { error } = await supabase
        .from('membership_requests')
        .insert([applicationData]);

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your ESCP Network application has been submitted successfully. You'll receive an email notification once reviewed.",
      });

      onClose();
      setCurrentSection(1);
      setFormData({
        applicant_name: '',
        email: user?.email || '',
        vehicle_name: '',
        organization_website: '',
        role_job_title: '',
        team_overview: '',
        country_of_operation: '',
        investment_thesis: '',
        typical_check_size: '',
        number_of_investments: '',
        amount_raised_to_date: '',
        supporting_documents: [],
        information_sharing_topics: [],
        expectations_from_network: '',
        how_heard_about_network: '',
        how_heard_other: '',
        fund_vehicle_type: '',
        fundraising_status: '',
        notable_investments: '',
        additional_comments: ''
      });

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Background Information</h3>
                <p className="text-sm text-gray-600">Tell us about yourself and your organization</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="applicant_name">Full Name *</Label>
                <Input
                  id="applicant_name"
                  value={formData.applicant_name}
                  onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@company.com"
                />
              </div>
              
              <div>
                <Label htmlFor="vehicle_name">Vehicle/Fund Name *</Label>
                <Input
                  id="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={(e) => handleInputChange('vehicle_name', e.target.value)}
                  placeholder="e.g., Frontier Capital Fund I"
                />
              </div>
              
              <div>
                <Label htmlFor="organization_website">Vehicle Website *</Label>
                <Input
                  id="organization_website"
                  type="url"
                  value={formData.organization_website}
                  onChange={(e) => handleInputChange('organization_website', e.target.value)}
                  placeholder="https://www.yourfund.com"
                />
              </div>
              
              <div>
                <Label htmlFor="domicile_country">Domicile Country *</Label>
                <Input
                  id="domicile_country"
                  value={formData.domicile_country}
                  onChange={(e) => handleInputChange('domicile_country', e.target.value)}
                  placeholder="e.g., United States, United Kingdom, Singapore"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Team Information</h3>
                <p className="text-sm text-gray-600">Share details about your team and experience</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="role_job_title">Role/Job Title & Relevant Experience *</Label>
                <Textarea
                  id="role_job_title"
                  value={formData.role_job_title}
                  onChange={(e) => handleInputChange('role_job_title', e.target.value)}
                  placeholder="Describe your role and relevant investment experience..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="team_overview">Team Size & Co-founder Details *</Label>
                <Textarea
                  id="team_overview"
                  value={formData.team_overview}
                  onChange={(e) => handleInputChange('team_overview', e.target.value)}
                  placeholder="Describe your team size, key co-founders, and their backgrounds..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="country_of_operation">Team Location & Relocation Plans *</Label>
                <Textarea
                  id="country_of_operation"
                  value={formData.country_of_operation}
                  onChange={(e) => handleInputChange('country_of_operation', e.target.value)}
                  placeholder="Where is your team based? Any plans to relocate or expand geographically?"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
                <p className="text-sm text-gray-600">Tell us about your investment approach and track record</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="investment_thesis">Investment Thesis *</Label>
                <Textarea
                  id="investment_thesis"
                  value={formData.investment_thesis}
                  onChange={(e) => handleInputChange('investment_thesis', e.target.value)}
                  placeholder="Describe your investment thesis, focus areas, and strategy..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="typical_check_size">Average Ticket Size (USD) *</Label>
                <Input
                  id="typical_check_size"
                  value={formData.typical_check_size}
                  onChange={(e) => handleInputChange('typical_check_size', e.target.value)}
                  placeholder="e.g., $50K - $500K"
                />
              </div>
              
              <div>
                <Label htmlFor="number_of_investments">Number of Investments Made *</Label>
                <Input
                  id="number_of_investments"
                  value={formData.number_of_investments}
                  onChange={(e) => handleInputChange('number_of_investments', e.target.value)}
                  placeholder="e.g., 12 investments"
                />
              </div>
              
              <div>
                <Label htmlFor="amount_raised_to_date">Capital Raised (soft + hard commitments; include self-contribution) *</Label>
                <Input
                  id="amount_raised_to_date"
                  value={formData.amount_raised_to_date}
                  onChange={(e) => handleInputChange('amount_raised_to_date', e.target.value)}
                  placeholder="e.g., $2.5M raised"
                />
              </div>
              
              <div>
                <Label htmlFor="supporting_documents">Upload Supporting Documents (PDFs, max 5 files, 10MB each)</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {formData.supporting_documents.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.supporting_documents.map((file, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <FileText className="w-4 h-4 mr-2" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Network Expectations</h3>
                <p className="text-sm text-gray-600">Help us understand your goals and how you heard about us</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Topics you're willing to share expertise on (select multiple) *</Label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {informationSharingOptions.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={formData.information_sharing_topics.includes(topic)}
                        onCheckedChange={() => handleTopicToggle(topic)}
                      />
                      <Label htmlFor={topic} className="text-sm">{topic}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="expectations_from_network">Expectations from the ESCP Network *</Label>
                <Textarea
                  id="expectations_from_network"
                  value={formData.expectations_from_network}
                  onChange={(e) => handleInputChange('expectations_from_network', e.target.value)}
                  placeholder="What do you hope to gain from joining the ESCP Network?"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="how_heard_about_network">How did you hear about the Network? *</Label>
                <Select 
                  value={formData.how_heard_about_network} 
                  onValueChange={(value) => handleInputChange('how_heard_about_network', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select how you heard about us" />
                  </SelectTrigger>
                  <SelectContent>
                    {howHeardOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.how_heard_about_network === 'Other' && (
                <div>
                  <Label htmlFor="how_heard_other">Please specify</Label>
                  <Input
                    id="how_heard_other"
                    value={formData.how_heard_other}
                    onChange={(e) => handleInputChange('how_heard_other', e.target.value)}
                    placeholder="Please tell us how you heard about the network"
                  />
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            ESCP Network Application
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete this comprehensive application to join the Early Stage Capital Provider Network
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentSection 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentSection ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="min-h-[400px]">
          {renderSection()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 1}
          >
            Previous
          </Button>
          
          <div className="flex space-x-3">
            {currentSection < 4 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
