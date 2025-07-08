
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, UserPlus, Building2, Key } from 'lucide-react';
import { MembershipRequestModal } from './MembershipRequestModal';
import { CodeVerificationModal } from '@/components/auth/CodeVerificationModal';

const ViewerDashboard = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black mb-4">Welcome to Frontier Finance</h1>
        <p className="text-xl text-gray-600 mb-8">
          You have Viewer access to our fund manager platform. Upgrade to Member access to unlock full features.
        </p>
      </div>

      {/* Access Level Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Current Access Level: Viewer
          </CardTitle>
          <CardDescription className="text-blue-800">
            You can browse public fund manager information and request membership upgrades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-blue-800">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Browse public fund manager directory
            </div>
            <div className="flex items-center text-blue-800">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              View basic fund information
            </div>
            <div className="flex items-center text-blue-800">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Request membership upgrade
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Browse Directory */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Browse Public Directory
            </CardTitle>
            <CardDescription>
              Explore available fund managers and view public information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.location.href = '/network'}
            >
              Browse Directory
            </Button>
          </CardContent>
        </Card>

        {/* Request Membership */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <UserPlus className="w-5 h-5 mr-2 text-green-600" />
              Request Member Access
            </CardTitle>
            <CardDescription>
              Submit your vehicle information for membership approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowRequestModal(true)}
            >
              Request Membership
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Code Verification Section */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900 flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Have an Invitation Code?
          </CardTitle>
          <CardDescription className="text-yellow-800">
            If you've received an invitation code from our admin team, verify it here to upgrade your access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            onClick={() => setShowCodeModal(true)}
          >
            <Key className="w-4 h-4 mr-2" />
            Verify Invitation Code
          </Button>
        </CardContent>
      </Card>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-black mb-2">Fund Directory</h3>
            <p className="text-sm text-gray-600">
              Access to emerging market fund managers across different regions and sectors.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-black mb-2">Member Benefits</h3>
            <p className="text-sm text-gray-600">
              Complete surveys, access detailed analytics, and view comprehensive fund data.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-black mb-2">Secure Platform</h3>
            <p className="text-sm text-gray-600">
              Role-based access ensures appropriate data visibility and platform security.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <MembershipRequestModal 
        open={showRequestModal} 
        onClose={() => setShowRequestModal(false)} 
      />
      <CodeVerificationModal 
        open={showCodeModal} 
        onClose={() => setShowCodeModal(false)} 
      />
    </div>
  );
};

export default ViewerDashboard;
