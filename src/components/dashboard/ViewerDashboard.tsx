
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, UserPlus, Building2, Key, Users, Globe, FileText, Send } from 'lucide-react';
import { ESCPApplicationModal } from './ESCPApplicationModal';

const ViewerDashboard = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-3">Welcome to the ESCP Network</h1>
        <p className="text-lg text-gray-600 mb-6">
          Early Stage Capital Provider Network - Connect with fund managers across emerging markets
        </p>
      </div>

      {/* Main Action Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Action - Application */}
        <Card className="border-green-300 bg-green-50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center text-lg">
              <Send className="w-5 h-5 mr-2 text-green-600" />
              Apply for ESCP Network Membership
            </CardTitle>
            <CardDescription className="text-green-800 text-base">
              Complete our comprehensive application form to join the Early Stage Capital Provider Network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-900 mb-2 text-xl">Application Process:</h4>
                <ul className="space-y-2 text-base text-green-800">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Complete detailed application form (15 questions)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Admin review and approval process
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Account upgrade to member status
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Complete member survey for full access
                  </li>
                </ul>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2"
                onClick={() => setShowApplicationModal(true)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Start Application
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access Level Info */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center text-lg">
              <Eye className="w-5 h-5 mr-2" />
              Current Access Level: Visitor
            </CardTitle>
            <CardDescription className="text-blue-800 text-base">
              Submit an application to join our network of fund managers and gain full access to our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-blue-800 text-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Browse limited fund manager directory
              </div>
              <div className="flex items-center text-blue-800 text-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Submit application for membership
              </div>
              <div className="flex items-center text-blue-800 text-sm">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Access full network after approval
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Browse Directory */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-black flex items-center text-base">
              <Building2 className="w-4 h-4 mr-2 text-blue-600" />
              Browse Network Directory
            </CardTitle>
            <CardDescription className="text-sm">
              View available fund managers (limited information)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
              size="sm"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => window.location.href = '/network'}
            >
              <Globe className="w-4 h-4 mr-2" />
              Browse Directory
            </Button>
          </CardContent>
        </Card>

        {/* Platform Info */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-black flex items-center text-xl">
              <Users className="w-4 h-4 mr-2 text-purple-600" />
              Platform Benefits
            </CardTitle>
            <CardDescription className="text-lg">
              Learn about our network advantages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                Access emerging market funds
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                Network with fund managers
              </div>
              <div className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                Share investment insights
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-black mb-2 text-lg">Fund Directory</h3>
            <p className="text-base text-gray-600">
              Access to emerging market fund managers across different regions and sectors.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-black mb-2 text-lg">Member Benefits</h3>
            <p className="text-base text-gray-600">
              Complete surveys, access detailed analytics, and view comprehensive fund data.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-black mb-2 text-lg">Secure Platform</h3>
            <p className="text-base text-gray-600">
              Application-based access ensures quality membership and platform security.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Modal */}
      <ESCPApplicationModal 
        open={showApplicationModal} 
        onClose={() => setShowApplicationModal(false)} 
      />
    </div>
  );
};

export default ViewerDashboard;
