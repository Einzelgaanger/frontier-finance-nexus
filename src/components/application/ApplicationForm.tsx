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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applicationText.trim() || !companyName.trim()) {
      toast({
        title: "Please complete all fields",
        description: "All required fields must be filled before submitting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('applications' as any)
        .insert([{
          user_id: user?.id,
          email: user?.email,
          company_name: companyName,
          application_text: applicationText,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Application submitted successfully!",
        description: "Your membership application has been submitted for review. You'll receive an email notification once it's reviewed.",
      });

      // Refresh to show pending status
      window.location.reload();
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Membership Benefits:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Complete and access survey data</li>
                    <li>View detailed fund manager profiles</li>
                    <li>Access industry analytics and insights</li>
                    <li>Connect with 200+ fund managers across 25+ countries</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="company_name">
                  Company/Fund Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company or fund name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">This is your account email</p>
              </div>

              <div>
                <Label htmlFor="application_text">
                  Why do you want to join CFF Network? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="application_text"
                  value={applicationText}
                  onChange={(e) => setApplicationText(e.target.value)}
                  placeholder="Tell us about your fund/organization, your investment focus, and how you plan to contribute to and benefit from the CFF Network community..."
                  rows={8}
                  required
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 100 characters ({applicationText.length}/100)
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || applicationText.length < 100}
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
