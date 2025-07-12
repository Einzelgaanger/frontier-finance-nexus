
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, UserPlus, Building2, Key, Users, Globe, FileText, Send } from 'lucide-react';
import { ESCPApplicationModal } from './ESCPApplicationModal';

const ViewerDashboard = () => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-black mb-4">Welcome to the ESCP Network</h1>
        <p className="text-xl text-gray-600 mb-8">
          Early Stage Capital Provider Network - Connect with fund managers across emerging markets
        </p>
      </div>

      {/* Access Level Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Current Access Level: Visitor
          </CardTitle>
          <CardDescription className="text-blue-800">
            Submit an application to join our network of fund managers and gain full access to our platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-blue-800">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Browse limited fund manager directory
            </div>
            <div className="flex items-center text-blue-800">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Submit application for membership
            </div>
            <div className="flex items-center text-blue-800">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              Access full network after approval
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Primary Action - Application */}
      <Card className="border-green-300 bg-green-50 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center">
            <Send className="w-6 h-6 mr-3 text-green-600" />
            Apply for ESCP Network Membership
          </CardTitle>
          <CardDescription className="text-green-800 text-lg">
            Complete our comprehensive application form to join the Early Stage Capital Provider Network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Application Process:</h4>
              <ul className="space-y-2 text-sm text-green-800">
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
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3"
              onClick={() => setShowApplicationModal(true)}
            >
              <FileText className="w-5 h-5 mr-2" />
              Start Application
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Browse Directory */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-black flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-blue-600" />
              Browse Network Directory
            </CardTitle>
            <CardDescription>
              View available fund managers (limited information)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline"
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
            <CardTitle className="text-black flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              Platform Benefits
            </CardTitle>
            <CardDescription>
              Learn about our network advantages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Access emerging market funds
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Network with fund managers
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Share investment insights
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
