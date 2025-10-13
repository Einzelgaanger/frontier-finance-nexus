import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Building2, 
  Globe, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Users,
  Award
} from 'lucide-react';

interface OnboardingData {
  company_name: string;
  website: string;
  description: string;
}

const UserOnboarding = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    company_name: '',
    website: '',
    description: ''
  });

  const steps = [
    {
      title: "Welcome to CFF Network",
      description: "Let's set up your profile to get started",
      icon: User
    },
    {
      title: "Company Information",
      description: "Tell us about your organization",
      icon: Building2
    },
    {
      title: "Complete Your Profile",
      description: "Add your website and description",
      icon: Globe
    },
    {
      title: "You're All Set!",
      description: "Welcome to the CFF Network community",
      icon: CheckCircle
    }
  ];

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (currentStep === 3) {
      // Save profile data
      await handleSaveProfile();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          company_name: formData.company_name,
          website: formData.website,
          description: formData.description,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
      });

      setCurrentStep(4);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to CFF Network!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                You're now part of a global community of fund managers and emerging market professionals.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Global Network</h3>
                <p className="text-sm text-gray-600">
                  Connect with 200+ fund managers across 25+ countries
                </p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Survey Access</h3>
                <p className="text-sm text-gray-600">
                  Complete surveys and access industry insights
                </p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-xl">
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Exclusive Resources</h3>
                <p className="text-sm text-gray-600">
                  Access reports, webinars, and development opportunities
                </p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
              <p className="text-gray-600">Tell us about your organization</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <Label htmlFor="company_name">Company/Fund Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  placeholder="e.g., CFF Network"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
              <p className="text-gray-600">Add your website and description</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="e.g., www.yourcompany.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell us about your company or fund..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                You're All Set!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Welcome to the CFF Network community. You can now access all features.
              </p>
            </div>
            <div className="space-y-4">
              <Badge variant="outline" className="text-lg px-4 py-2">
                ✓ Profile Created
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                ✓ Network Access Granted
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2">
                ✓ Dashboard Ready
              </Badge>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {steps[currentStep - 1].title}
            </CardTitle>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Step {currentStep} of {steps.length}</span>
                <span>{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <Progress value={(currentStep / steps.length) * 100} className="h-2" />
            </div>

            {/* Step Content */}
            {renderStep()}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {currentStep > 1 && currentStep < 4 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
              
              <div className="flex-1" />
              
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={loading || (currentStep === 2 && !formData.company_name)}
                  className="min-w-32"
                >
                  {loading ? (
                    "Saving..."
                  ) : (
                    <>
                      {currentStep === 3 ? "Save & Complete" : "Next"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="min-w-32"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOnboarding;
