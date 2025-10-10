import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  CheckCircle,
  Globe,
  Building2,
  ArrowRight,
  Star,
  Shield,
  Target
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const MemberDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="h-screen bg-[#f5f5dc] overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Main Content - Info Page */}
        <div className="flex-1 p-6 pl-4">
          <div className="max-w-4xl">
            {/* Member Status - Top Left */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Active Member</h2>
              <p className="text-gray-600 mb-2">
                You have full access to all member features and network resources.
              </p>
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                ✓ Verified Member
              </span>
            </div>

            {/* Member Information - 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Network Access */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Network Access</h3>
                <p className="text-gray-600 text-sm">
                  Connect with fellow fund managers, share insights, and build meaningful professional relationships within our global network.
                </p>
              </div>

              {/* Survey Participation */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Survey Participation</h3>
                <p className="text-gray-600 text-sm">
                  Complete annual surveys to contribute to industry insights and access aggregated data from our comprehensive research.
                </p>
              </div>

              {/* Member Benefits */}
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Member Benefits</h3>
                <p className="text-gray-600 text-sm">
                  Access exclusive features, industry insights, and professional development opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
