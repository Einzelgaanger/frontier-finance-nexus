import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { logApplicationSubmitted } from '@/utils/activityLogger';
import { FileText, Upload, Link, Plus, CheckCircle, Send, Clock, AlertCircle } from 'lucide-react';
import { CountrySelector } from '@/components/survey/CountrySelector';

const ApplicationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [checkingApplication, setCheckingApplication] = useState(true);
  
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
    expectations_from_network: '',
    how_heard_about_network: '',
    topics_of_interest: [] as string[],
  });

  const topics = [
    'Investment Opportunities',
    'Market Research',
    'Due Diligence',
    'Portfolio Management',
    'Fundraising',
    'Networking',
    'Industry Insights',
    'Technology Trends',
    'Regulatory Updates',
    'ESG Investing'
  ];

  // Check for existing application
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('membership_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          setExistingApplication(data[0]);
        }
      } catch (error) {
        console.error('Error checking existing application:', error);
        toast({
          title: "Error",
          description: "Failed to check application status",
          variant: "destructive"
        });
      } finally {
        setCheckingApplication(false);
      }
    };

    checkExistingApplication();
  }, [user?.id, toast]);

  const checkSizes = [
    'Under $100K',
    '$100K - $500K',
    '$500K - $1M',
    '$1M - $5M',
    '$5M - $10M',
    '$10M - $25M',
    '$25M - $50M',
    'Over $50M'
  ];

  const investmentRanges = [
    '1-5 investments',
    '6-10 investments',
    '11-20 investments',
    '21-50 investments',
    '51-100 investments',
    'Over 100 investments'
  ];

  const howHeardOptions = [
    'ESCP Alumni Network',
    'LinkedIn',
    'Industry Conference',
    'Referral from existing member',
    'Website',
    'Social Media',
    'Other'
  ];

  const sections = [
    { id: 1, title: 'Background Information', description: 'Tell us about yourself and your organization' },
    { id: 2, title: 'Team Information', description: 'Share details about your team' },
    { id: 3, title: 'Vehicle Information', description: 'Describe your investment vehicle' },
    { id: 4, title: 'Network Expectations', description: 'What you hope to gain from the network' }
  ];

  const totalSections = sections.length;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field as keyof typeof prev] as string[], value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `supporting-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      handleInputChange('supporting_documents', [...formData.supporting_documents, data.publicUrl]);
      
      toast({
        title: "File uploaded successfully",
        description: "Your document has been uploaded.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const addDocumentLink = () => {
    const link = prompt('Enter document link:');
    if (link) {
      handleInputChange('supporting_document_links', [...formData.supporting_document_links, link]);
    }
  };

  const removeDocument = (index: number, type: 'documents' | 'links') => {
    if (type === 'documents') {
      const newDocs = formData.supporting_documents.filter((_, i) => i !== index);
      handleInputChange('supporting_documents', newDocs);
    } else {
      const newLinks = formData.supporting_document_links.filter((_, i) => i !== index);
      handleInputChange('supporting_document_links', newLinks);
    }
  };

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        return !!(formData.applicant_name && formData.vehicle_name && formData.domicile_countries.length > 0);
      case 2:
        return !!(formData.role_job_title && formData.team_overview);
      case 3:
        return !!(formData.investment_thesis && formData.typical_check_size && formData.number_of_investments && formData.amount_raised_to_date);
      case 4:
        return !!(formData.expectations_from_network && formData.how_heard_about_network && formData.topics_of_interest.length > 0);
      default:
        return false;
    }
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => Math.min(prev + 1, totalSections));
    } else {
      toast({
        title: "Please complete required fields",
        description: "All required fields in this section must be filled before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevSection = () => {
    setCurrentSection(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateSection(4)) {
      toast({
        title: "Please complete all sections",
        description: "All required fields must be filled before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('membership_requests')
        .insert([{
          user_id: user?.id,
          email: formData.email,
          applicant_name: formData.applicant_name,
          vehicle_name: formData.vehicle_name,
          vehicle_website: formData.organization_website,
          domicile_country: formData.domicile_countries.join(', '),
          role_job_title: formData.role_job_title,
          team_size: formData.team_overview,
          thesis: formData.investment_thesis,
          ticket_size: formData.typical_check_size,
          portfolio_investments: formData.number_of_investments,
          capital_raised: formData.amount_raised_to_date,
          supporting_documents: JSON.stringify(formData.supporting_documents),
          expectations: formData.expectations_from_network,
          how_heard_about_network: formData.how_heard_about_network,
          information_sharing: JSON.stringify(formData.topics_of_interest),
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      // Log the application submission
      if (data && data.length > 0) {
        await logApplicationSubmitted(
          data[0].id,
          formData.applicant_name,
          formData.vehicle_name
        );
      }

      setShowSuccessMessage(true);
      setExistingApplication(data[0]);
      toast({
        title: "Application submitted successfully!",
        description: "Your membership application has been submitted for review.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const progress = (currentSection / totalSections) * 100;

  // Show loading state while checking application status
  if (checkingApplication) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-[#f5f5dc] rounded-lg border-2 border-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-black/70">Checking application status...</p>
        </div>
      </div>
    );
  }

  // Show pending application status
  if (existingApplication && existingApplication.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-[#f5f5dc] rounded-lg border-2 border-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Application Pending</h2>
          <p className="text-black/70 mb-4">
            Your membership application is currently under review. Our team will get back to you within 5-7 business days.
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800">
              <strong>Application Details:</strong><br />
              Submitted on: {new Date(existingApplication.created_at).toLocaleDateString()}<br />
              Vehicle: {existingApplication.vehicle_name}<br />
              Status: Pending Review
            </p>
          </div>
          <p className="text-sm text-black/60">
            You cannot submit another application while this one is pending.
          </p>
        </div>
      </div>
    );
  }

  // Show approved application status
  if (existingApplication && existingApplication.status === 'approved') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-[#f5f5dc] rounded-lg border-2 border-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Application Approved!</h2>
          <p className="text-black/70 mb-4">
            Congratulations! Your membership application has been approved. You are now a member of the ESCP Network.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>Application Details:</strong><br />
              Approved on: {new Date(existingApplication.updated_at || existingApplication.created_at).toLocaleDateString()}<br />
              Vehicle: {existingApplication.vehicle_name}<br />
              Status: Approved
            </p>
          </div>
          <p className="text-sm text-black/60">
            You now have full access to the network features.
          </p>
        </div>
      </div>
    );
  }

  // Show rejected application status - allow resubmission
  if (existingApplication && existingApplication.status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-[#f5f5dc] rounded-lg border-2 border-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Application Not Approved</h2>
          <p className="text-black/70 mb-4">
            Unfortunately, your previous application was not approved. You may submit a new application.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>Previous Application:</strong><br />
              Submitted on: {new Date(existingApplication.created_at).toLocaleDateString()}<br />
              Vehicle: {existingApplication.vehicle_name}<br />
              Status: Rejected
            </p>
          </div>
          <Button 
            onClick={() => setExistingApplication(null)}
            className="bg-black text-[#f5f5dc] hover:bg-black/80"
          >
            Submit New Application
          </Button>
        </div>
      </div>
    );
  }

  if (showSuccessMessage) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-[#f5f5dc] rounded-lg border-2 border-black">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Application Submitted!</h2>
          <p className="text-black/70 mb-6">
            Thank you for submitting your membership application. Our team will review your application and get back to you within 5-7 business days.
          </p>
          <Button 
            onClick={() => setShowSuccessMessage(false)}
            className="bg-black text-[#f5f5dc] hover:bg-black/80"
          >
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#f5f5dc] rounded-lg border-2 border-black">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2">Membership Application</h1>
        <p className="text-black/70">
          Join the ESCP Network as a member and connect with global fund managers.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-black">Progress</span>
          <span className="text-sm text-black/70">{currentSection} of {totalSections} sections</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section Navigation */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black">{sections[currentSection - 1].title}</h2>
          <p className="text-sm text-black/70">{sections[currentSection - 1].description}</p>
        </div>
        <div className="flex space-x-2">
          {currentSection > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={prevSection}
              className="border-black text-black hover:bg-black/10"
            >
              Previous
            </Button>
          )}
          {currentSection < totalSections ? (
            <Button
              type="button"
              onClick={nextSection}
              className="bg-black text-[#f5f5dc] hover:bg-black/80"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </div>

      {/* Section 1: Background Information */}
      {currentSection === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicant_name" className="text-black font-medium">Full Name *</Label>
              <Input
                id="applicant_name"
                value={formData.applicant_name}
                onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                className="border-black focus:ring-black"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-black font-medium">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="border-black focus:ring-black"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_name" className="text-black font-medium">Vehicle/Fund Name *</Label>
              <Input
                id="vehicle_name"
                value={formData.vehicle_name}
                onChange={(e) => handleInputChange('vehicle_name', e.target.value)}
                className="border-black focus:ring-black"
                placeholder="Enter your fund/vehicle name"
              />
            </div>
            <div>
              <Label htmlFor="organization_website" className="text-black font-medium">Organization Website</Label>
              <Input
                id="organization_website"
                value={formData.organization_website}
                onChange={(e) => handleInputChange('organization_website', e.target.value)}
                className="border-black focus:ring-black"
                placeholder="https://your-website.com"
              />
            </div>
          </div>

          <div>
            <Label className="text-black font-medium">Domicile Countries *</Label>
            <CountrySelector
              value={formData.domicile_countries || []}
              onChange={(countries) => handleInputChange('domicile_countries', countries)}
              label=""
            />
          </div>
        </div>
      )}

      {/* Section 2: Team Information */}
      {currentSection === 2 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="role_job_title" className="text-black font-medium">Your Role/Job Title *</Label>
            <Input
              id="role_job_title"
              value={formData.role_job_title}
              onChange={(e) => handleInputChange('role_job_title', e.target.value)}
              className="border-black focus:ring-black"
              placeholder="e.g., Managing Partner, Investment Director"
            />
          </div>

          <div>
            <Label htmlFor="team_overview" className="text-black font-medium">Team Overview *</Label>
            <Textarea
              id="team_overview"
              value={formData.team_overview}
              onChange={(e) => handleInputChange('team_overview', e.target.value)}
              className="border-black focus:ring-black"
              placeholder="Describe your team structure, experience, and background"
              rows={4}
            />
          </div>
        </div>
      )}

      {/* Section 3: Vehicle Information */}
      {currentSection === 3 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="investment_thesis" className="text-black font-medium">Investment Thesis *</Label>
            <Textarea
              id="investment_thesis"
              value={formData.investment_thesis}
              onChange={(e) => handleInputChange('investment_thesis', e.target.value)}
              className="border-black focus:ring-black"
              placeholder="Describe your investment strategy and focus areas"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="typical_check_size" className="text-black font-medium">Typical Check Size *</Label>
              <Select value={formData.typical_check_size} onValueChange={(value) => handleInputChange('typical_check_size', value)}>
                <SelectTrigger className="border-black focus:ring-black">
                  <SelectValue placeholder="Select check size range" />
                </SelectTrigger>
                <SelectContent>
                  {checkSizes.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="number_of_investments" className="text-black font-medium">Number of Investments *</Label>
              <Select value={formData.number_of_investments} onValueChange={(value) => handleInputChange('number_of_investments', value)}>
                <SelectTrigger className="border-black focus:ring-black">
                  <SelectValue placeholder="Select investment range" />
                </SelectTrigger>
                <SelectContent>
                  {investmentRanges.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="amount_raised_to_date" className="text-black font-medium">Amount Raised to Date *</Label>
            <Input
              id="amount_raised_to_date"
              value={formData.amount_raised_to_date}
              onChange={(e) => handleInputChange('amount_raised_to_date', e.target.value)}
              className="border-black focus:ring-black"
              placeholder="e.g., $50M, €30M, £25M"
            />
          </div>

          <div>
            <Label className="text-black font-medium">Supporting Documents</Label>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="file-upload"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  aria-label="Upload supporting documents"
                  title="Upload supporting documents"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={uploading}
                  className="border-black text-black hover:bg-black/10"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addDocumentLink}
                  className="border-black text-black hover:bg-black/10"
                >
                  <Link className="w-4 h-4 mr-2" />
                  Add Link
                </Button>
              </div>

              {formData.supporting_documents.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-black">Uploaded Documents:</p>
                  {formData.supporting_documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded border">
                      <span className="text-sm text-black truncate">{doc.split('/').pop()}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index, 'documents')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {formData.supporting_document_links.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-black">Document Links:</p>
                  {formData.supporting_document_links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded border">
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                        {link}
                      </a>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(index, 'links')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section 4: Network Expectations */}
      {currentSection === 4 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="expectations_from_network" className="text-black font-medium">What do you expect from the network? *</Label>
            <Textarea
              id="expectations_from_network"
              value={formData.expectations_from_network}
              onChange={(e) => handleInputChange('expectations_from_network', e.target.value)}
              className="border-black focus:ring-black"
              placeholder="Describe what you hope to gain from joining the ESCP Network"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="how_heard_about_network" className="text-black font-medium">How did you hear about the network? *</Label>
            <Select value={formData.how_heard_about_network} onValueChange={(value) => handleInputChange('how_heard_about_network', value)}>
              <SelectTrigger className="border-black focus:ring-black">
                <SelectValue placeholder="Select how you heard about us" />
              </SelectTrigger>
              <SelectContent>
                {howHeardOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-black font-medium">Topics of Interest *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {topics.map((topic) => (
                <div key={topic} className="flex items-center space-x-2">
                  <Checkbox
                    id={topic}
                    checked={formData.topics_of_interest.includes(topic)}
                    onCheckedChange={(checked) => handleArrayChange('topics_of_interest', topic, checked as boolean)}
                  />
                  <Label htmlFor={topic} className="text-sm text-black">{topic}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
