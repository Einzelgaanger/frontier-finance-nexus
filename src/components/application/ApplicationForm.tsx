import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Send, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ApplicationForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [companyName, setCompanyName] = useState('');
  const [applicationText, setApplicationText] = useState('');

  // Check for existing application and get company name
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user?.id) return;
      
      try {
        // Get user profile for company name
        const { data: profileData } = await supabase
          .from('user_profiles' as any)
          .select('company_name')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setCompanyName((profileData as any).company_name || '');
        }

        // Check for existing application
        const { data, error } = await supabase
          .from('applications' as any)
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

  const [formData, setFormData] = useState({
    applicant_name: '',
    email: user?.email || '',
    vehicle_name: '',
    organization_website: '',
    role_job_title: '',
    team_overview: '',
    investment_thesis: '',
    typical_check_size: '',
    number_of_investments: '',
    amount_raised_to_date: '',
    expectations_from_network: '',
    how_heard_about_network: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!companyName || !applicationText || !formData.applicant_name || !formData.vehicle_name || 
        !formData.organization_website || !formData.role_job_title || !formData.team_overview ||
        !formData.investment_thesis || !formData.typical_check_size || !formData.number_of_investments ||
        !formData.amount_raised_to_date || !formData.expectations_from_network || !formData.how_heard_about_network) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            user_id: user?.id,
            email: user?.email,
            company_name: companyName,
            application_text: applicationText,
            status: 'pending',
            ...formData
          },
        ]);

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully. We'll review it soon.",
      });

      // Reload to show the new status
      window.location.reload();
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking application status
  if (checkingApplication) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking application status...</p>
        </div>
      </div>
    );
  }

  // Show pending application status
  if (existingApplication && existingApplication.status === 'pending') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Application Pending Review</CardTitle>
            <CardDescription>
              Your membership application is currently under review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Application Details:</strong>
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Submitted:</strong> {new Date(existingApplication.created_at).toLocaleDateString()}</p>
                <p><strong>Company:</strong> {existingApplication.company_name}</p>
                <p><strong>Status:</strong> <span className="text-orange-600 font-semibold">Pending Review</span></p>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Our team will review your application within 5-7 business days. You'll receive an email notification once a decision has been made.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show approved application status
  if (existingApplication && existingApplication.status === 'approved') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Application Approved!</CardTitle>
            <CardDescription>
              Congratulations! You are now a CFF Network member
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white border border-green-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-3">
                <strong>You now have access to:</strong>
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Complete survey questionnaires</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Full network directory with detailed profiles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Industry analytics and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Member-only resources and events</span>
                </li>
              </ul>
            </div>
            {existingApplication.admin_notes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Message from Admin:</strong>
                </p>
                <p className="text-sm text-gray-700">{existingApplication.admin_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show rejected application status
  if (existingApplication && existingApplication.status === 'rejected') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Application Not Approved</CardTitle>
            <CardDescription>
              Your membership application was not approved at this time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {existingApplication.admin_notes && (
              <div className="bg-white border border-red-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Admin Notes:</strong>
                </p>
                <p className="text-sm text-gray-700">{existingApplication.admin_notes}</p>
              </div>
            )}
            <p className="text-sm text-gray-600 text-center">
              You can still access the network directory as a viewer. If you have any questions, please contact us.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show application form
  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Apply for CFF Network Membership</CardTitle>
          <CardDescription>
            Join our global community of fund managers and emerging market professionals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section A: Background Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">A. Background Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicant_name">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="applicant_name"
                    value={formData.applicant_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicant_name: e.target.value }))}
                    placeholder="Enter your full name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="mt-1 bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="vehicle_name">
                    Vehicle Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="vehicle_name"
                    value={formData.vehicle_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle_name: e.target.value }))}
                    placeholder="Enter vehicle name"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="organization_website">
                    Vehicle Website <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="organization_website"
                    type="url"
                    value={formData.organization_website}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization_website: e.target.value }))}
                    placeholder="https://example.com"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Team Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">B. Team Information</h3>
              
              <div>
                <Label htmlFor="role_job_title">
                  Role/Job Title & Relevant Experience <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="role_job_title"
                  value={formData.role_job_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, role_job_title: e.target.value }))}
                  rows={3}
                  placeholder="Describe your role and relevant experience"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="team_overview">
                  Team Size & Co-founder Details <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="team_overview"
                  value={formData.team_overview}
                  onChange={(e) => setFormData(prev => ({ ...prev, team_overview: e.target.value }))}
                  rows={3}
                  placeholder="Describe your team size, structure, and key co-founders"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Section C: Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">C. Vehicle Information</h3>
              
              <div>
                <Label htmlFor="investment_thesis">
                  Investment Thesis <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="investment_thesis"
                  value={formData.investment_thesis}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment_thesis: e.target.value }))}
                  rows={4}
                  placeholder="Describe your investment strategy and focus"
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typical_check_size">
                    Average Ticket Size (USD) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="typical_check_size"
                    value={formData.typical_check_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, typical_check_size: e.target.value }))}
                    placeholder="e.g., $100K - $500K"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="number_of_investments">
                    Number of Investments Made <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="number_of_investments"
                    value={formData.number_of_investments}
                    onChange={(e) => setFormData(prev => ({ ...prev, number_of_investments: e.target.value }))}
                    placeholder="e.g., 15"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="amount_raised_to_date">
                    Capital Raised (soft + hard commitments; include self-contribution) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount_raised_to_date"
                    value={formData.amount_raised_to_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount_raised_to_date: e.target.value }))}
                    placeholder="e.g., $5M"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Section D: Network Expectations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">D. Network Expectations</h3>
              
              <div>
                <Label htmlFor="expectations_from_network">
                  Expectations from the CFF Network <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="expectations_from_network"
                  value={formData.expectations_from_network}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectations_from_network: e.target.value }))}
                  rows={4}
                  placeholder="What are you hoping to gain from joining the network?"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="how_heard_about_network">
                  How did you hear about the Network? <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="how_heard_about_network"
                  value={formData.how_heard_about_network}
                  onChange={(e) => setFormData(prev => ({ ...prev, how_heard_about_network: e.target.value }))}
                  placeholder="e.g., Referral, Social Media, Conference"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationForm;
