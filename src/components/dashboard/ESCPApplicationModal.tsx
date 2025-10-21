// @ts-nocheck

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, Eye, Link, X, Plus, Search, CheckCircle } from 'lucide-react';
import { CountrySelector } from '@/components/survey/CountrySelector';

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
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Background Information
    applicant_name: '',
    email: user?.email || '',
    vehicle_name: '',
    organization_website: '',
    domicile_countries: [] as string[],
    
    // Team Information
    role_job_title: '',
    team_overview: '',
    
    // Vehicle Information
    investment_thesis: '',
    typical_check_size: '',
    number_of_investments: '',
    amount_raised_to_date: '',
    supporting_documents: [] as string[],
    supporting_document_links: [] as string[],
    
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

  // Helper to convert file to base64 and store in database
  const uploadToDatabase = async (file: File, userId: string) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        const fileData = {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          data: base64Data,
          uploadedAt: new Date().toISOString()
        };
        resolve(JSON.stringify(fileData));
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Handle file upload
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

    setUploading(true);
    try {
      const uploadedFiles: string[] = [];
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) { // 10MB limit for base64
          toast({
            title: "File too large",
            description: `${file.name} exceeds 10MB limit`,
            variant: "destructive"
          });
          continue;
        }
        const fileData = await uploadToDatabase(file, user?.id || 'anonymous');
        uploadedFiles.push(fileData);
        toast({
          title: "File Uploaded Successfully",
          description: `${file.name} uploaded to database`,
          variant: "default"
        });
      }
      // Store file data in form state
      setFormData(prev => ({
        ...prev,
        supporting_documents: [...prev.supporting_documents, ...uploadedFiles]
      }));
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle link upload (store as text data)
  const handleLinkUpload = async (link: string) => {
    if (!link.trim()) return;
    
    setUploading(true);
    try {
      const linkData = {
        fileName: 'document-link.txt',
        fileSize: link.length,
        fileType: 'text/plain',
        data: `data:text/plain;base64,${btoa(link)}`,
        uploadedAt: new Date().toISOString()
      };
      
      setFormData(prev => ({
        ...prev,
        supporting_document_links: [...prev.supporting_document_links, JSON.stringify(linkData)]
      }));

      toast({
        title: "Link Saved Successfully",
        description: "Link saved to database",
        variant: "default"
      });
    } catch (error) {
      console.error('Error uploading link:', error);
      toast({
        title: "Upload Error",
        description: "Failed to save link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const uploadDocuments = async (): Promise<string[]> => {
    // Just return the file data already in state
    return formData.supporting_documents;
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
        return !!(formData.applicant_name && formData.email && formData.vehicle_name && formData.organization_website && formData.domicile_countries.length > 0);
      case 2:
        return !!(formData.role_job_title && formData.team_overview);
      case 3:
        return !!(formData.investment_thesis && formData.typical_check_size && formData.number_of_investments && formData.amount_raised_to_date);
      case 4:
        return !!(formData.expectations_from_network && formData.how_heard_about_network);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateSection(currentSection)) {
      if (currentSection < 4) {
        setCurrentSection(currentSection + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast({
        title: "Incomplete Section",
        description: "Please complete all required fields before proceeding",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
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
        domicile_country: formData.domicile_countries.join(', '), // Join multiple countries
        role_job_title: formData.role_job_title,
        team_size: formData.team_overview,
        location: formData.domicile_countries.join(', '), // Use domicile countries as location
        thesis: formData.investment_thesis,
        ticket_size: formData.typical_check_size,
        portfolio_investments: formData.number_of_investments,
        capital_raised: formData.amount_raised_to_date,
        supporting_documents: documentUrls.length > 0 ? JSON.stringify(documentUrls) : null, // Attach file URLs as JSON array
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

      setShowSuccessMessage(true);
      setLoading(false);
      
      toast({
        title: "Application Submitted Successfully!",
        description: "Your application has been submitted and is under review.",
      });

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          applicant_name: '',
          email: user?.email || '',
          vehicle_name: '',
          organization_website: '',
          domicile_countries: [],
          role_job_title: '',
          team_overview: '',
          investment_thesis: '',
          typical_check_size: '',
          number_of_investments: '',
          amount_raised_to_date: '',
          supporting_documents: [],
          supporting_document_links: [],
          information_sharing_topics: [],
          expectations_from_network: '',
          how_heard_about_network: '',
          how_heard_other: '',
          fund_vehicle_type: '',
          fundraising_status: '',
          notable_investments: '',
          additional_comments: ''
        });
        setCurrentSection(1);
        setShowSuccessMessage(false);
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const renderSection = (section: number) => {
    switch (section) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Background Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicant_name" className="text-sm">Applicant Name *</Label>
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
                    placeholder="your.email@example.com"
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
                
                <div className="md:col-span-2">
                  <CountrySelector
                    value={formData.domicile_countries}
                    onChange={(countries) => handleInputChange('domicile_countries', countries)}
                    label="Legal Domicile Countries *"
                    placeholder="Search and select countries for legal domicile..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role_job_title" className="text-sm">Your Role/Job Title *</Label>
                  <Input
                    id="role_job_title"
                    value={formData.role_job_title}
                    onChange={(e) => handleInputChange('role_job_title', e.target.value)}
                    placeholder="e.g., Managing Partner, Investment Director"
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <Label htmlFor="team_overview" className="text-sm">Team Overview *</Label>
                  <Textarea
                    id="team_overview"
                    value={formData.team_overview}
                    onChange={(e) => handleInputChange('team_overview', e.target.value)}
                    placeholder="Describe your team structure, key members, and their roles..."
                    rows={4}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="investment_thesis" className="text-sm">Investment Thesis *</Label>
                  <Textarea
                    id="investment_thesis"
                    value={formData.investment_thesis}
                    onChange={(e) => handleInputChange('investment_thesis', e.target.value)}
                    placeholder="Describe your investment strategy, focus areas, and approach..."
                    rows={4}
                    className="text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="typical_check_size" className="text-sm">Typical Check Size *</Label>
                    <Input
                      id="typical_check_size"
                      value={formData.typical_check_size}
                      onChange={(e) => handleInputChange('typical_check_size', e.target.value)}
                      placeholder="e.g., $500K - $2M"
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="number_of_investments" className="text-sm">Number of Investments *</Label>
                    <Input
                      id="number_of_investments"
                      value={formData.number_of_investments}
                      onChange={(e) => handleInputChange('number_of_investments', e.target.value)}
                      placeholder="e.g., 15-20 companies"
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amount_raised_to_date" className="text-sm">Amount Raised to Date *</Label>
                    <Input
                      id="amount_raised_to_date"
                      value={formData.amount_raised_to_date}
                      onChange={(e) => handleInputChange('amount_raised_to_date', e.target.value)}
                      placeholder="e.g., $50M"
                      className="text-sm"
                    />
                  </div>
                </div>

                {/* Supporting Documents Section */}
                <div className="space-y-4">
                  <Label className="text-sm">Supporting Documents</Label>
                  
                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Upload Files (PDF, Images, etc.)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Upload supporting documents (max 5 files, 10MB each)
                        </p>
                                               <input
                         type="file"
                         accept="*/*"
                         multiple
                         onChange={handleFileUpload}
                         className="hidden"
                         id="document-upload"
                         disabled={uploading}
                         aria-label="Upload supporting documents"
                       />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('document-upload')?.click()}
                          disabled={uploading}
                          className="text-sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Choose Files'}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Show uploaded files */}
                    {formData.supporting_documents.length > 0 && (
                      <div className="space-y-1">
                        {formData.supporting_documents.map((fileData, index) => {
                          const parsedData = JSON.parse(fileData);
                          return (
                            <div key={index} className="flex items-center text-xs text-gray-600">
                              <FileText className="w-3 h-3 mr-2" />
                              <span className="truncate">{parsedData.fileName}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Link Input */}
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-600">Or Provide Document Links</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/document.pdf"
                        className="text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const target = e.target as HTMLInputElement;
                            if (target.value.trim()) {
                              handleLinkUpload(target.value.trim());
                              target.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder*="example.com"]') as HTMLInputElement;
                          if (input && input.value.trim()) {
                            handleLinkUpload(input.value.trim());
                            input.value = '';
                          }
                        }}
                        disabled={uploading}
                        className="text-sm"
                      >
                        {uploading ? 'Saving...' : 'Save Link'}
                      </Button>
                    </div>
                    
                    {/* Show saved links */}
                    {formData.supporting_document_links.length > 0 && (
                      <div className="space-y-1">
                        {formData.supporting_document_links.map((linkData, index) => {
                          const parsedData = JSON.parse(linkData);
                          return (
                            <div key={index} className="flex items-center text-xs text-gray-600">
                              <Link className="w-3 h-3 mr-2" />
                              <span className="truncate">{parsedData.fileName}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Network Expectations</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Information Sharing Topics *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {informationSharingOptions.map((topic) => (
                      <div key={topic} className="flex items-center space-x-2">
                        <Checkbox
                          id={topic}
                          checked={formData.information_sharing_topics.includes(topic)}
                          onCheckedChange={() => handleTopicToggle(topic)}
                        />
                        <Label htmlFor={topic} className="text-sm font-normal">{topic}</Label>
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
                        placeholder="Please explain how you discovered this network..."
                        className="text-sm mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showSuccessMessage) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Application Submitted!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">
                Your application has been successfully submitted and is under review. 
                We will contact you once the review process is complete.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>ESCP Network Application</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Step {currentSection} of 4</span>
              <span>{Math.round((currentSection / 4) * 100)}% Complete</span>
            </div>
            <Progress value={(currentSection / 4) * 100} className="w-full" />
          </div>

          {/* Form Content */}
          {renderSection(currentSection)}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 1}
            >
              Previous
            </Button>
            
            <Button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Submitting...' : currentSection === 4 ? 'Submit Application' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
