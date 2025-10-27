// @ts-nocheck
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
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Upload, Link, Plus, CheckCircle } from 'lucide-react';
import { CountrySelector } from '@/components/survey/CountrySelector';

const ViewerDashboardV2 = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const surveyYears = [
    { year: '2021', path: '/survey/2021', available: true },
    { year: '2022', path: '/survey/2022', available: true },
    { year: '2023', path: '/survey/2023', available: true },
    { year: '2024', path: '/survey/2024', available: true }
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

  // Prevent body scrolling like the AI page
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Background Information</h3>
              <p className="text-gray-600 mb-6">Tell us about yourself and your organization.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="applicant_name" className="text-gray-700 font-medium">Full Name *</Label>
                <Input
                  id="applicant_name"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicle_name" className="text-gray-700 font-medium">Vehicle/Organization Name *</Label>
                <Input
                  id="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicle_name: e.target.value }))}
                  placeholder="Enter vehicle or organization name"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization_website" className="text-gray-700 font-medium">Organization Website *</Label>
                <Input
                  id="organization_website"
                  value={formData.organization_website}
                  onChange={(e) => setFormData(prev => ({ ...prev, organization_website: e.target.value }))}
                  placeholder="https://example.com"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Domicile Countries *</Label>
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
              <h3 className="text-2xl font-bold text-white mb-4">Team Information</h3>
              <p className="text-white/90 mb-6">Tell us about your team and your role.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role_job_title" className="text-white font-medium">Your Role/Job Title *</Label>
                <Input
                  id="role_job_title"
                  value={formData.role_job_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, role_job_title: e.target.value }))}
                  placeholder="e.g., Managing Partner, Investment Director"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="team_overview" className="text-white font-medium">Team Overview *</Label>
                <Textarea
                  id="team_overview"
                  value={formData.team_overview}
                  onChange={(e) => setFormData(prev => ({ ...prev, team_overview: e.target.value }))}
                  placeholder="Describe your team structure, key members, and their backgrounds"
                  rows={4}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Vehicle Information</h3>
              <p className="text-white/90 mb-6">Tell us about your investment vehicle and strategy.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="investment_thesis" className="text-white font-medium">Investment Thesis *</Label>
                <Textarea
                  id="investment_thesis"
                  value={formData.investment_thesis}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment_thesis: e.target.value }))}
                  placeholder="Describe your investment strategy, focus areas, and approach"
                  rows={4}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="typical_check_size" className="text-white font-medium">Typical Check Size *</Label>
                  <Select
                    value={formData.typical_check_size}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, typical_check_size: value }))}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-blue-400 focus:ring-blue-400/20">
                      <SelectValue placeholder="Select check size range" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="under-100k" className="text-white hover:bg-slate-700">Under $100K</SelectItem>
                      <SelectItem value="100k-500k" className="text-white hover:bg-slate-700">$100K - $500K</SelectItem>
                      <SelectItem value="500k-1m" className="text-white hover:bg-slate-700">$500K - $1M</SelectItem>
                      <SelectItem value="1m-5m" className="text-white hover:bg-slate-700">$1M - $5M</SelectItem>
                      <SelectItem value="5m-10m" className="text-white hover:bg-slate-700">$5M - $10M</SelectItem>
                      <SelectItem value="over-10m" className="text-white hover:bg-slate-700">Over $10M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="number_of_investments" className="text-white font-medium">Number of Investments *</Label>
                  <Select
                    value={formData.number_of_investments}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, number_of_investments: value }))}
                  >
                    <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-blue-400 focus:ring-blue-400/20">
                      <SelectValue placeholder="Select number of investments" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="1-5" className="text-white hover:bg-slate-700">1-5</SelectItem>
                      <SelectItem value="6-10" className="text-white hover:bg-slate-700">6-10</SelectItem>
                      <SelectItem value="11-20" className="text-white hover:bg-slate-700">11-20</SelectItem>
                      <SelectItem value="21-50" className="text-white hover:bg-slate-700">21-50</SelectItem>
                      <SelectItem value="over-50" className="text-white hover:bg-slate-700">Over 50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount_raised_to_date" className="text-white font-medium">Amount Raised to Date *</Label>
                <Select
                  value={formData.amount_raised_to_date}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, amount_raised_to_date: value }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/30 text-white focus:border-blue-400 focus:ring-blue-400/20">
                    <SelectValue placeholder="Select amount raised" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="under-10m" className="text-white hover:bg-slate-700">Under $10M</SelectItem>
                    <SelectItem value="10m-25m" className="text-white hover:bg-slate-700">$10M - $25M</SelectItem>
                    <SelectItem value="25m-50m" className="text-white hover:bg-slate-700">$25M - $50M</SelectItem>
                    <SelectItem value="50m-100m" className="text-white hover:bg-slate-700">$50M - $100M</SelectItem>
                    <SelectItem value="100m-250m" className="text-white hover:bg-slate-700">$100M - $250M</SelectItem>
                    <SelectItem value="over-250m" className="text-white hover:bg-slate-700">Over $250M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Supporting Documents */}
              <div className="space-y-4">
                <Label className="text-white font-medium">Supporting Documents</Label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 bg-white/5">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                    <p className="text-sm text-white/80 mb-4">
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
                      className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-md"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploading ? 'Uploading...' : 'Choose Files'}
                    </Button>
                    <p className="text-xs text-white/60 mt-2">Max 5 files, 10MB each</p>
                  </div>
                  
                  {/* Display uploaded files */}
                  {formData.supporting_documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-white">Uploaded Files:</p>
                      {formData.supporting_documents.map((fileData, index) => {
                        const parsedData = JSON.parse(fileData);
                        return (
                          <div key={index} className="flex items-center text-xs text-white/80">
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
                  <Label className="text-white font-medium">Document Links (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste document links here"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleLinkUpload(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/20"
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
                      className="border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-md"
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
                          <div key={index} className="flex items-center text-xs text-white/80">
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
              <h3 className="text-2xl font-bold text-white mb-4">Network Expectations</h3>
              <p className="text-white/90 mb-6">Tell us about your expectations from the CFF Network.</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expectations_from_network" className="text-white font-medium">What do you expect from the CFF Network? *</Label>
                <Textarea
                  id="expectations_from_network"
                  value={formData.expectations_from_network}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectations_from_network: e.target.value }))}
                  placeholder="Describe how you plan to use the network and what value you hope to gain"
                  rows={4}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="how_heard_about_network" className="text-white font-medium">How did you hear about the CFF Network? *</Label>
                <Textarea
                  id="how_heard_about_network"
                  value={formData.how_heard_about_network}
                  onChange={(e) => setFormData(prev => ({ ...prev, how_heard_about_network: e.target.value }))}
                  placeholder="Tell us how you discovered the CFF Network"
                  rows={3}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-white font-medium">Topics of Interest (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {topics.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={topic}
                        checked={formData.topics_of_interest.includes(topic)}
                        onCheckedChange={() => handleTopicToggle(topic)}
                        className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={topic} className="text-sm font-normal text-white/90">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Application Submitted Successfully!</h1>
            <p className="text-lg text-white/90 mb-8">
              Thank you for your interest in joining the CFF Network. Your application has been submitted for review.
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
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
      <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Preview Cards */}
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* Network Benefits */}
            <div className="group relative overflow-hidden rounded-lg bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer">
              <div className="relative p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Global Network</h3>
                </div>
                <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed mb-2">
                  Connect with 200+ fund managers across 25+ countries in emerging markets.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>200+ Managers</span>
                  <span>25+ Countries</span>
                </div>
              </div>
            </div>

            {/* Survey Access with Year Buttons */}
            <div className="group relative overflow-hidden rounded-lg bg-white border-2 border-green-200 hover:border-green-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-green-600 transition-colors duration-300">Market Intelligence</h3>
                </div>
                <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed mb-3">
                  Access comprehensive survey data and market insights from 2021-2024.
                </p>
                
                {/* Survey Year Buttons */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {surveyYears.map((survey) => (
                    <Button
                      key={survey.year}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(survey.path)}
                      className="h-8 text-xs font-medium bg-white/80 hover:bg-green-50 hover:text-green-700 hover:border-green-400 transition-all"
                    >
                      {survey.year}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <span>4 Years Data</span>
                  <span>Trend Analysis</span>
                </div>
              </div>
            </div>

            {/* Professional Development */}
            <div className="group relative overflow-hidden rounded-lg bg-white border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer">
              <div className="relative p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">Professional Growth</h3>
                </div>
                <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed mb-2">
                  Enhance your expertise through exclusive events and resources.
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Webinars</span>
                  <span>Workshops</span>
                </div>
              </div>
            </div>
          </div>

          {/* Application Preview */}
          <div className="group relative overflow-hidden rounded-lg bg-white border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            <div className="relative p-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Ready to Join?</h2>
                <p className="text-xs text-gray-600 mb-4">
                  Complete our simple 4-step application process to become a member
                </p>
              </div>

              {/* Application Steps Preview */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="text-center group/step">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm group-hover/step:scale-110 transition-all duration-300">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover/step:text-blue-600 transition-colors duration-300 text-xs">Background</h3>
                  <p className="text-xs text-gray-600 group-hover/step:text-gray-700 transition-colors duration-300">Your organization</p>
                </div>
                
                <div className="text-center group/step">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm group-hover/step:scale-110 transition-all duration-300">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover/step:text-green-600 transition-colors duration-300 text-xs">Team</h3>
                  <p className="text-xs text-gray-600 group-hover/step:text-gray-700 transition-colors duration-300">Team details</p>
                </div>
                
                <div className="text-center group/step">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm group-hover/step:scale-110 transition-all duration-300">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover/step:text-purple-600 transition-colors duration-300 text-xs">Strategy</h3>
                  <p className="text-xs text-gray-600 group-hover/step:text-gray-700 transition-colors duration-300">Investment focus</p>
                </div>
                
                <div className="text-center group/step">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-2 shadow-sm group-hover/step:scale-110 transition-all duration-300">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover/step:text-orange-600 transition-colors duration-300 text-xs">Goals</h3>
                  <p className="text-xs text-gray-600 group-hover/step:text-gray-700 transition-colors duration-300">Network expectations</p>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Button
                  onClick={() => navigate('/application')}
                  className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 text-sm font-semibold shadow-md hover:shadow-orange-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  size="sm"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Start Application</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Takes approximately 10-15 minutes to complete
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header with Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => setShowApplicationForm(false)}
            className="flex items-center border-white/30 text-white hover:bg-white/20 bg-white/5 backdrop-blur-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Overview
          </Button>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            Application
          </h1>
          <p className="text-sm text-white/90 mb-4">
            Join the world's leading emerging market fund manager network
          </p>
        </div>
      </div>
      
      {/* Application Form */}
      <div className="h-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-700 font-medium">
                  <span>Step {currentSection} of 4</span>
                  <span>{Math.round((currentSection / 4) * 100)}% Complete</span>
                </div>
                <Progress value={(currentSection / 4) * 100} className="w-full h-3 bg-blue-100" />
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
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white disabled:opacity-50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Previous
                </Button>
                
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  {loading ? 'Submitting...' : currentSection === 4 ? 'Submit Application' : 'Next'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Section - Removed, now available in dedicated PortIQ page */}
      </div>
    </div>
  );
};

export default ViewerDashboardV2;
