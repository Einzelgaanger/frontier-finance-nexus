import React, { useState } from 'react';
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
import { FileText, Upload, Link, Plus, CheckCircle } from 'lucide-react';
import { CountrySelector } from '@/components/survey/CountrySelector';

const ViewerDashboardV2 = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
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
    'Regulatory Updates',
    'Technology Trends',
    'ESG Practices',
    'Risk Management',
    'Fundraising',
    'Exit Strategies',
    'Networking Events'
  ];

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
        if (file.size > 10 * 1024 * 1024) {
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
      setFormData(prev => ({
        ...prev,
        supporting_documents: [...prev.supporting_documents, ...uploadedFiles]
      }));
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLinkUpload = async (link: string) => {
    if (!link.trim()) return;
    
    setUploading(true);
    try {
      const linkData = {
        fileName: link,
        fileSize: 0,
        fileType: 'link',
        data: link,
        uploadedAt: new Date().toISOString()
      };
      
      setFormData(prev => ({
        ...prev,
        supporting_document_links: [...prev.supporting_document_links, JSON.stringify(linkData)]
      }));
      
      toast({
        title: "Link Added Successfully",
        description: "Document link added to your application",
        variant: "default"
      });
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Link Addition Failed",
        description: "Failed to add link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleTopicToggle = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics_of_interest: prev.topics_of_interest.includes(topic)
        ? prev.topics_of_interest.filter(t => t !== topic)
        : [...prev.topics_of_interest, topic]
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

  const handleNext = async () => {
    if (!validateSection(currentSection)) {
      toast({
        title: "Incomplete Section",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
      return;
    }

    if (currentSection === 4) {
      await handleSubmit();
    } else {
      setCurrentSection(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateSection(4)) {
      toast({
        title: "Incomplete Application",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const applicationData = {
        ...formData,
        supporting_documents: formData.supporting_documents,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        user_id: user?.id
      };

      const { error } = await supabase
        .from('membership_requests')
        .insert([applicationData]);

      if (error) {
        throw error;
      }

      setShowSuccessMessage(true);
      toast({
        title: "Application Submitted Successfully!",
        description: "Your application has been submitted for review. We'll get back to you soon.",
        variant: "default"
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
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
              <p className="text-gray-600 mb-6">Tell us about yourself and your organization.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="applicant_name">Full Name *</Label>
                <Input
                  id="applicant_name"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle_name">Vehicle/Organization Name *</Label>
                <Input
                  id="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_name: e.target.value }))}
                  placeholder="Enter vehicle or organization name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization_website">Organization Website *</Label>
                <Input
                  id="organization_website"
                  value={formData.organization_website}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization_website: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Domicile Countries *</Label>
              <CountrySelector
                value={formData.domicile_countries || []}
                onChange={(countries) => setFormData(prev => ({ ...prev, domicile_countries: countries }))}
                placeholder="Select countries where your organization is domiciled"
                label="Domicile Countries"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Information</h3>
              <p className="text-gray-600 mb-6">Tell us about your team and your role.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role_job_title">Your Role/Job Title *</Label>
                <Input
                  id="role_job_title"
                  value={formData.role_job_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, role_job_title: e.target.value }))}
                  placeholder="e.g., Managing Partner, Investment Director"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team_overview">Team Overview *</Label>
                <Textarea
                  id="team_overview"
                  value={formData.team_overview}
                  onChange={(e) => setFormData(prev => ({ ...prev, team_overview: e.target.value }))}
                  placeholder="Describe your team structure, key members, and their backgrounds"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
              <p className="text-gray-600 mb-6">Tell us about your investment vehicle and strategy.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="investment_thesis">Investment Thesis *</Label>
                <Textarea
                  id="investment_thesis"
                  value={formData.investment_thesis}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment_thesis: e.target.value }))}
                  placeholder="Describe your investment strategy, focus areas, and approach"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="typical_check_size">Typical Check Size *</Label>
                  <Select
                    value={formData.typical_check_size}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, typical_check_size: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select check size range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-100k">Under $100K</SelectItem>
                      <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                      <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                      <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                      <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                      <SelectItem value="over-10m">Over $10M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="number_of_investments">Number of Investments *</Label>
                  <Select
                    value={formData.number_of_investments}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, number_of_investments: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of investments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5</SelectItem>
                      <SelectItem value="6-10">6-10</SelectItem>
                      <SelectItem value="11-20">11-20</SelectItem>
                      <SelectItem value="21-50">21-50</SelectItem>
                      <SelectItem value="over-50">Over 50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount_raised_to_date">Amount Raised to Date *</Label>
                <Select
                  value={formData.amount_raised_to_date}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, amount_raised_to_date: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select amount raised" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-10m">Under $10M</SelectItem>
                    <SelectItem value="10m-25m">$10M - $25M</SelectItem>
                    <SelectItem value="25m-50m">$25M - $50M</SelectItem>
                    <SelectItem value="50m-100m">$50M - $100M</SelectItem>
                    <SelectItem value="100m-250m">$100M - $250M</SelectItem>
                    <SelectItem value="over-250m">Over $250M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Supporting Documents */}
              <div className="space-y-4">
                <Label>Supporting Documents</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">
                      Upload supporting documents (pitch decks, financials, etc.)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      aria-label="Upload supporting documents"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      disabled={uploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Files'}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Max 5 files, 10MB each</p>
                  </div>
                  
                  {/* Display uploaded files */}
                  {formData.supporting_documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium">Uploaded Files:</p>
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
                
                {/* Document Links */}
                <div className="space-y-2">
                  <Label>Document Links (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste document links here"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleLinkUpload(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Paste document links here"]') as HTMLInputElement;
                        if (input?.value) {
                          handleLinkUpload(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Display uploaded links */}
                  {formData.supporting_document_links.length > 0 && (
                    <div className="mt-2 space-y-1">
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
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Network Expectations</h3>
              <p className="text-gray-600 mb-6">Tell us about your expectations from the ESCP Network.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expectations_from_network">What do you expect from the ESCP Network? *</Label>
                <Textarea
                  id="expectations_from_network"
                  value={formData.expectations_from_network}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectations_from_network: e.target.value }))}
                  placeholder="Describe how you plan to use the network and what value you hope to gain"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="how_heard_about_network">How did you hear about the ESCP Network? *</Label>
                <Textarea
                  id="how_heard_about_network"
                  value={formData.how_heard_about_network}
                  onChange={(e) => setFormData(prev => ({ ...prev, how_heard_about_network: e.target.value }))}
                  placeholder="Tell us how you discovered the ESCP Network"
                  rows={3}
                />
              </div>
              
              <div className="space-y-4">
                <Label>Topics of Interest (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {topics.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={formData.topics_of_interest.includes(topic)}
                        onCheckedChange={() => handleTopicToggle(topic)}
                      />
                      <Label htmlFor={topic} className="text-sm font-normal">
                        {topic}
                      </Label>
                    </div>
                  ))}
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Thank you for your interest in joining the ESCP Network. Your application has been submitted for review.
              We'll get back to you within 5-7 business days.
            </p>
            <Button
              onClick={() => {
                setShowSuccessMessage(false);
                setShowApplicationForm(false);
                setCurrentSection(1);
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
                  expectations_from_network: '',
                  how_heard_about_network: '',
                  topics_of_interest: [],
                });
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Another Application
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Preview/Landing Page
  if (!showApplicationForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Join the ESCP Network
            </h1>
            <p className="text-2xl text-gray-600 mb-8">
              Connect with the world's leading emerging market fund managers
            </p>
          </div>
        </div>

        {/* Preview Cards */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Network Benefits */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Global Network</h3>
              <p className="text-gray-600 mb-4">
                Connect with 200+ fund managers across 25+ countries in emerging markets.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Access to exclusive investment opportunities</li>
                <li>• Peer-to-peer knowledge sharing</li>
                <li>• Regional market insights</li>
              </ul>
            </div>

            {/* Survey Access */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Intelligence</h3>
              <p className="text-gray-600 mb-4">
                Access comprehensive survey data and market insights from 2021-2024.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Annual industry surveys</li>
                <li>• Investment trend analysis</li>
                <li>• Fund performance benchmarks</li>
              </ul>
            </div>

            {/* Professional Development */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Growth</h3>
              <p className="text-gray-600 mb-4">
                Enhance your expertise through exclusive events and resources.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Exclusive webinars and workshops</li>
                <li>• Best practice sharing</li>
                <li>• Regulatory updates</li>
              </ul>
            </div>
          </div>

          {/* Application Preview */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Complete our simple 4-step application process to become a member
              </p>
            </div>

            {/* Application Steps Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Background Info</h3>
                <p className="text-sm text-gray-600">Tell us about yourself and your organization</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Team Details</h3>
                <p className="text-sm text-gray-600">Share information about your team</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Vehicle Info</h3>
                <p className="text-sm text-gray-600">Describe your investment strategy</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Expectations</h3>
                <p className="text-sm text-gray-600">Tell us about your network goals</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <Button
                onClick={() => setShowApplicationForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold"
                size="lg"
              >
                Start Application
              </Button>
              <p className="text-sm text-gray-500 mt-4">
                Takes approximately 10-15 minutes to complete
              </p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with Back Button */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => setShowApplicationForm(false)}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Overview
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ESCP Network Application
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join the world's leading emerging market fund manager network
          </p>
        </div>
      </div>
      
      {/* Application Form */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
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
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboardV2;
