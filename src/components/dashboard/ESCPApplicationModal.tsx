
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
import { FileText, Upload, Building2, Users, Globe, Target, CheckCircle, XCircle } from 'lucide-react';

interface ESCPApplicationModalProps {
  open: boolean;
  onClose: () => void;
}

export function ESCPApplicationModal({ open, onClose }: ESCPApplicationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const uploadDocuments = async (): Promise<string[]> => {
    if (formData.supporting_documents.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    
    for (const file of formData.supporting_documents) {
      try {
        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data, error } = await supabase.storage
          .from('supporting-documents')
          .upload(fileName, file);
        
        if (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Upload Error",
            description: `Failed to upload ${file.name}: ${error.message}`,
            variant: "destructive"
          });
          continue;
        }
        
        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('supporting-documents')
          .getPublicUrl(fileName);
        
        if (urlData?.publicUrl) {
          uploadedUrls.push(urlData.publicUrl);
          console.log('File uploaded successfully:', fileName, urlData.publicUrl);
        } else {
          console.error('Failed to get public URL for:', fileName);
          toast({
            title: "URL Error",
            description: `Failed to generate URL for ${file.name}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        toast({
          title: "Upload Error",
          description: `Failed to upload ${file.name}`,
          variant: "destructive"
        });
      }
    }
    
    return uploadedUrls;
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
        return !!(formData.role_job_title && formData.team_overview);
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
      // Upload documents first
      const documentUrls = await uploadDocuments();
      
      const applicationData = {
        user_id: user.id,
        applicant_name: formData.applicant_name,
        email: formData.email,
        vehicle_name: formData.vehicle_name,
        vehicle_website: formData.organization_website,
        domicile_country: formData.domicile_country,
        role_job_title: formData.role_job_title,
        team_size: formData.team_overview,
        location: formData.domicile_country, // Use domicile_country as location
        thesis: formData.investment_thesis,
        ticket_size: formData.typical_check_size,
        portfolio_investments: formData.number_of_investments,
        capital_raised: formData.amount_raised_to_date,
        supporting_documents: documentUrls.length > 0 ? JSON.stringify(documentUrls) : null,
        information_sharing: {
          topics: formData.information_sharing_topics,
          other: formData.how_heard_other // Include the "other" details
        },
        expectations: formData.expectations_from_network,
        how_heard_about_network: formData.how_heard_about_network === 'Other' && formData.how_heard_other
          ? `Other: ${formData.how_heard_other}` 
          : formData.how_heard_about_network,
        status: 'pending'
      };

      const { error } = await supabase
        .from('membership_requests')
        .insert([applicationData]);

      if (error) throw error;

      // Show success message with animation
      setShowSuccessMessage(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
        setCurrentSection(1);
        setFormData({
          applicant_name: '',
          email: user?.email || '',
          vehicle_name: '',
          organization_website: '',
          domicile_country: '',
          role_job_title: '',
          team_overview: '',
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
      }, 2000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit application. Please try again.";
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
        className: "bg-red-50 border-red-200 text-red-800",
        action: (
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">Error</span>
          </div>
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Background Information</h3>
                <p className="text-xs sm:text-sm text-gray-600">Tell us about yourself and your organization</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="applicant_name" className="text-sm">Full Name *</Label>
                <Input
                  id="applicant_name"
                  value={formData.applicant_name}
                  onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                  placeholder="Your full name"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@company.com"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="vehicle_name" className="text-sm">Vehicle/Fund Name *</Label>
                <Input
                  id="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={(e) => handleInputChange('vehicle_name', e.target.value)}
                  placeholder="e.g., Frontier Capital Fund I"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="organization_website" className="text-sm">Vehicle Website *</Label>
                <Input
                  id="organization_website"
                  type="url"
                  value={formData.organization_website}
                  onChange={(e) => handleInputChange('organization_website', e.target.value)}
                  placeholder="https://www.yourfund.com"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="domicile_country" className="text-sm">Domicile Country *</Label>
                <Input
                  id="domicile_country"
                  value={formData.domicile_country}
                  onChange={(e) => handleInputChange('domicile_country', e.target.value)}
                  placeholder="e.g., United States, United Kingdom, Singapore"
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Team Information</h3>
                <p className="text-xs sm:text-sm text-gray-600">Share details about your team and experience</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="role_job_title" className="text-sm">Role/Job Title & Relevant Experience *</Label>
                <Textarea
                  id="role_job_title"
                  value={formData.role_job_title}
                  onChange={(e) => handleInputChange('role_job_title', e.target.value)}
                  placeholder="Describe your role and relevant investment experience..."
                  rows={3}
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="team_overview" className="text-sm">Team Size & Co-founder Details *</Label>
                <Textarea
                  id="team_overview"
                  value={formData.team_overview}
                  onChange={(e) => handleInputChange('team_overview', e.target.value)}
                  placeholder="Describe your team size, key co-founders, and their backgrounds..."
                  rows={4}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Vehicle Information</h3>
                <p className="text-xs sm:text-sm text-gray-600">Tell us about your investment approach and track record</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="investment_thesis" className="text-sm">Investment Thesis *</Label>
                <Textarea
                  id="investment_thesis"
                  value={formData.investment_thesis}
                  onChange={(e) => handleInputChange('investment_thesis', e.target.value)}
                  placeholder="Describe your investment thesis, focus areas, and strategy..."
                  rows={4}
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="typical_check_size" className="text-sm">Average Ticket Size (USD) *</Label>
                <Input
                  id="typical_check_size"
                  value={formData.typical_check_size}
                  onChange={(e) => handleInputChange('typical_check_size', e.target.value)}
                  placeholder="e.g., $50K - $500K"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="number_of_investments" className="text-sm">Number of Investments Made *</Label>
                <Input
                  id="number_of_investments"
                  value={formData.number_of_investments}
                  onChange={(e) => handleInputChange('number_of_investments', e.target.value)}
                  placeholder="e.g., 12 investments"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="amount_raised_to_date" className="text-sm">Capital Raised (soft + hard commitments; include self-contribution) *</Label>
                <Input
                  id="amount_raised_to_date"
                  value={formData.amount_raised_to_date}
                  onChange={(e) => handleInputChange('amount_raised_to_date', e.target.value)}
                  placeholder="e.g., $2.5M raised"
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="supporting_documents" className="text-sm">Upload Supporting Documents (PDFs, max 5 files, 10MB each)</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm"
                  />
                  {formData.supporting_documents.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {formData.supporting_documents.map((file, index) => (
                        <div key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Network Expectations</h3>
                <p className="text-xs sm:text-sm text-gray-600">Help us understand your goals and how you heard about us</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm">Topics you're willing to share expertise on (select multiple) *</Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {informationSharingOptions.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={formData.information_sharing_topics.includes(topic)}
                        onCheckedChange={() => handleTopicToggle(topic)}
                      />
                      <Label htmlFor={topic} className="text-xs sm:text-sm leading-tight">{topic}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="expectations_from_network" className="text-sm">Expectations from the ESCP Network *</Label>
                <Textarea
                  id="expectations_from_network"
                  value={formData.expectations_from_network}
                  onChange={(e) => handleInputChange('expectations_from_network', e.target.value)}
                  placeholder="What do you hope to gain from joining the ESCP Network?"
                  rows={3}
                  className="text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="how_heard_about_network" className="text-sm">How did you hear about the Network? *</Label>
                <Select 
                  value={formData.how_heard_about_network} 
                  onValueChange={(value) => handleInputChange('how_heard_about_network', value)}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select how you heard about us" />
                  </SelectTrigger>
                  <SelectContent>
                    {howHeardOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.how_heard_about_network === 'Other' && (
                  <div className="mt-2">
                    <Label htmlFor="how_heard_other" className="text-sm">Please specify</Label>
                    <Input
                      id="how_heard_other"
                      value={formData.how_heard_other}
                      onChange={(e) => handleInputChange('how_heard_other', e.target.value)}
                      placeholder="Please tell us how you heard about the network"
                      className="text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
              ESCP Network Application
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Complete this comprehensive application to join the Early Stage Capital Provider Network
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6 px-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  step <= currentSection 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                    step < currentSection ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="min-h-[400px] px-2">
            {renderSection()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between pt-6 border-t gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 1}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {currentSection < 4 ? (
                <Button onClick={handleNext} className="w-full sm:w-auto">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="w-full sm:w-auto">
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-4">
              Your ESCP Network application has been submitted for review. We'll get back to you once the review is completed.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>Successfully submitted</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
