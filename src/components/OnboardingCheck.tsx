import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingCheckProps {
  children: React.ReactNode;
}

const OnboardingCheck: React.FC<OnboardingCheckProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }

      try {
        // Check if user has a complete profile
        const { data: profile, error } = await supabase
          .from('user_profiles' as any)
          .select('company_name, full_name')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          // No profile found (shouldn't happen with trigger, but handle gracefully)
          navigate('/onboarding');
          return;
        }

        // Check if profile needs completion (company_name is required)
        if (profile) {
          const needsOnboarding = 
            !(profile as any).company_name || 
            (profile as any).company_name.trim() === '' ||
            (profile as any).company_name === 'Not provided';
          
          if (needsOnboarding) {
            navigate('/onboarding');
            return;
          }
        }

        // User has complete profile, allow access
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, allow access to prevent blocking users
        setIsChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [user, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingCheck;
