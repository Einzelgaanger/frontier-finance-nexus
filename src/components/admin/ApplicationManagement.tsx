import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  User,
  Building2,
  Globe,
  FileText,
  Calendar,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Application {
  id: string;
  user_id: string;
  email: string;
  applicant_name: string;
  vehicle_name: string;
  organization_website?: string;
  domicile_countries: string[];
  role_job_title: string;
  team_overview: string;
  investment_thesis: string;
  typical_check_size: string;
  number_of_investments: string;
  amount_raised_to_date: string;
  supporting_documents: string[];
  supporting_document_links: string[];
  expectations_from_network: string;
  how_heard_about_network: string;
  topics_of_interest: string[];
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  created_at: string;
  updated_at: string;
}

const ApplicationManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: newStatus,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          review_notes: reviewNotes
        })
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus, reviewed_by: user?.id, reviewed_at: new Date().toISOString(), review_notes: reviewNotes }
            : app
        )
      );

      // Update user role if approved
      if (newStatus === 'approved') {
        const application = applications.find(app => app.id === applicationId);
        if (application) {
          const { error: roleError } = await supabase
            .from('user_roles')
            .update({ role: 'member' })
            .eq('user_id', application.user_id);

          if (roleError) {
            console.error('Error updating user role:', roleError);
          }
        }
      }

      setSelectedApplication(null);
      setReviewNotes('');
      
      toast({
        title: `Application ${newStatus}`,
        description: `The application has been ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpanded = (applicationId: string) => {
    setExpandedApplications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(applicationId)) {
        newSet.delete(applicationId);
      } else {
        newSet.add(applicationId);
      }
      return newSet;
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-green-500 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="border-red-500 text-red-700"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black">Application Management</h1>
          <p className="text-black/70">Review and manage membership applications</p>
        </div>
        <div className="text-sm text-black/60">
          {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <Card className="border-2 border-black">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 w-4 h-4" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-black focus:ring-black"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-black focus:ring-black">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card className="border-2 border-black">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-black/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">No applications found</h3>
              <p className="text-black/60">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No applications match your current filters.' 
                  : 'No applications have been submitted yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="border-2 border-black">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-black">{application.applicant_name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-black/60">
                        <Building2 className="w-4 h-4" />
                        <span>{application.vehicle_name}</span>
                        <span>•</span>
                        <Mail className="w-4 h-4" />
                        <span>{application.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(application.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpanded(application.id)}
                      className="border-black text-black hover:bg-black/10"
                    >
                      {expandedApplications.has(application.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedApplications.has(application.id) && (
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-black mb-2">Role & Organization</h4>
                        <p className="text-sm text-black/70">{application.role_job_title}</p>
                        {application.organization_website && (
                          <a 
                            href={application.organization_website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline flex items-center mt-1"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {application.organization_website}
                          </a>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-2">Geographic Focus</h4>
                        <div className="flex flex-wrap gap-1">
                          {application.domicile_countries.map((country, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Globe className="w-3 h-3 mr-1" />
                              {country}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Investment Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-black/60">Check Size:</span>
                          <p className="text-black">{application.typical_check_size}</p>
                        </div>
                        <div>
                          <span className="text-black/60">Investments:</span>
                          <p className="text-black">{application.number_of_investments}</p>
                        </div>
                        <div>
                          <span className="text-black/60">Amount Raised:</span>
                          <p className="text-black">{application.amount_raised_to_date}</p>
                        </div>
                      </div>
                    </div>

                    {/* Investment Thesis */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Investment Thesis</h4>
                      <p className="text-sm text-black/70 bg-gray-50 p-3 rounded border">
                        {application.investment_thesis}
                      </p>
                    </div>

                    {/* Team Overview */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Team Overview</h4>
                      <p className="text-sm text-black/70 bg-gray-50 p-3 rounded border">
                        {application.team_overview}
                      </p>
                    </div>

                    {/* Network Expectations */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Network Expectations</h4>
                      <p className="text-sm text-black/70 bg-gray-50 p-3 rounded border">
                        {application.expectations_from_network}
                      </p>
                    </div>

                    {/* Topics of Interest */}
                    <div>
                      <h4 className="font-semibold text-black mb-2">Topics of Interest</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.topics_of_interest.map((topic, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Supporting Documents */}
                    {(application.supporting_documents.length > 0 || application.supporting_document_links.length > 0) && (
                      <div>
                        <h4 className="font-semibold text-black mb-2">Supporting Documents</h4>
                        <div className="space-y-2">
                          {application.supporting_documents.map((doc, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-black/60" />
                              <a 
                                href={doc} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {doc.split('/').pop()}
                              </a>
                            </div>
                          ))}
                          {application.supporting_document_links.map((link, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <ExternalLink className="w-4 h-4 text-black/60" />
                              <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {link}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Application Details */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-black/60">Submitted:</span>
                          <p className="text-black">{formatDate(application.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-black/60">How they heard about us:</span>
                          <p className="text-black">{application.how_heard_about_network}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {application.status === 'pending' && (
                      <div className="border-t pt-4">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-black mb-2">
                              Review Notes (Optional)
                            </label>
                            <Textarea
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              placeholder="Add any notes about this application..."
                              className="border-black focus:ring-black"
                              rows={3}
                            />
                          </div>
                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handleStatusChange(application.id, 'approved')}
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve Application
                            </Button>
                            <Button
                              onClick={() => handleStatusChange(application.id, 'rejected')}
                              variant="destructive"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject Application
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Review Status */}
                    {application.status !== 'pending' && (
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-black/60">Reviewed:</span>
                            <p className="text-black">{formatDate(application.reviewed_at!)}</p>
                          </div>
                          {application.review_notes && (
                            <div>
                              <span className="text-black/60">Review Notes:</span>
                              <p className="text-black">{application.review_notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicationManagement;
