import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Clock, Mail, Building2, Calendar, Eye } from 'lucide-react';

interface Application {
  id: string;
  user_id: string;
  company_name: string;
  email: string;
  application_text: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

const ApplicationManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

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
      setApplications((data || []).map((req: any) => ({
        id: req.id,
        user_id: req.user_id,
        company_name: req.company_name || 'Unknown',
        email: req.email,
        application_text: req.application_text || 'No application text provided',
        status: req.status,
        admin_notes: req.admin_notes,
        created_at: req.created_at,
        reviewed_at: req.reviewed_at,
        reviewed_by: req.reviewed_by
      })));
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (app: Application) => {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || '');
    setReviewDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedApp || !user) return;

    try {
      setReviewing(true);

      const { error: appError } = await supabase
        .from('applications')
        .update({
          status: 'approved',
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', selectedApp.id);

      if (appError) throw appError;

      // Update user role to member
      const { error: roleError } = await supabase
        .from('user_roles' as any)
        .update({ role: 'member' })
        .eq('user_id', selectedApp.user_id);

      if (roleError) throw roleError;

      // Send email notification
      await supabase.functions.invoke('send-application-status', {
        body: {
          applicationId: selectedApp.id,
          status: 'approved',
          adminNotes
        }
      });

      toast({
        title: "Application Approved",
        description: "The user has been granted member access and notified via email."
      });

      setReviewDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive"
      });
    } finally {
      setReviewing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp || !user) return;

    try {
      setReviewing(true);

      const { error } = await supabase
        .from('applications')
        .update({
          status: 'rejected',
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', selectedApp.id);

      if (error) throw error;

      // Send email notification
      await supabase.functions.invoke('send-application-status', {
        body: {
          applicationId: selectedApp.id,
          status: 'rejected',
          adminNotes
        }
      });

      toast({
        title: "Application Rejected",
        description: "The applicant has been notified via email."
      });

      setReviewDialogOpen(false);
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive"
      });
    } finally {
      setReviewing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
          <Clock className="w-3 h-3 mr-1" /> Pending
        </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="w-3 h-3 mr-1" /> Rejected
        </Badge>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading applications...</p>
      </div>
    );
  }

  const pendingApps = applications.filter(app => app.status === 'pending');
  const reviewedApps = applications.filter(app => app.status !== 'pending');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Membership Applications</h2>
          <p className="text-gray-600">Review and approve membership requests</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingApps.length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      {pendingApps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pending Review ({pendingApps.length})
          </h3>
          {pendingApps.map((app) => (
            <Card key={app.id} className="border-orange-200 bg-orange-50/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{app.company_name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(app.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Application:</Label>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap bg-white p-3 rounded-md border">
                    {app.application_text}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReview(app)}
                    variant="default"
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review Application
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reviewed Applications */}
      {reviewedApps.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Reviewed Applications ({reviewedApps.length})
          </h3>
          {reviewedApps.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{app.company_name}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {app.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Reviewed: {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </CardDescription>
                  </div>
                  {getStatusBadge(app.status)}
                </div>
              </CardHeader>
              {app.admin_notes && (
                <CardContent>
                  <Label className="text-sm font-semibold text-gray-700">Admin Notes:</Label>
                  <p className="text-sm text-gray-600 mt-1">{app.admin_notes}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {applications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No applications yet</p>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Application - {selectedApp?.company_name}</DialogTitle>
            <DialogDescription>
              Make a decision on this membership application
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">Email:</Label>
                  <p className="font-medium">{selectedApp.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Submitted:</Label>
                  <p className="font-medium">{new Date(selectedApp.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Application Text:</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-md border text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedApp.application_text}
                </div>
              </div>

              <div>
                <Label htmlFor="admin-notes">Admin Notes (optional)</Label>
                <Textarea
                  id="admin-notes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about your decision..."
                  rows={4}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes will be included in the email notification sent to the applicant
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={reviewing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!selectedApp || !user) return;
                try {
                  setReviewing(true);
                  const { error } = await supabase
                    .from('applications')
                    .update({
                      status: 'rejected',
                      admin_notes: adminNotes,
                      reviewed_at: new Date().toISOString(),
                      reviewed_by: user.id
                    })
                    .eq('id', selectedApp.id);
                  if (error) throw error;
                  await supabase.functions.invoke('send-application-status', {
                    body: { applicationId: selectedApp.id, status: 'rejected', adminNotes }
                  });
                  toast({ title: "Application Rejected", description: "The applicant has been notified via email." });
                  setReviewDialogOpen(false);
                  fetchApplications();
                } catch (error) {
                  console.error('Error rejecting application:', error);
                  toast({ title: "Error", description: "Failed to reject application", variant: "destructive" });
                } finally {
                  setReviewing(false);
                }
              }}
              disabled={reviewing}
            >
              {reviewing ? 'Processing...' : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
            <Button
              onClick={async () => {
                if (!selectedApp || !user) return;
                try {
                  setReviewing(true);
                  const { error: appError } = await supabase
                    .from('applications')
                    .update({
                      status: 'approved',
                      admin_notes: adminNotes,
                      reviewed_at: new Date().toISOString(),
                      reviewed_by: user.id
                    })
                    .eq('id', selectedApp.id);
                  if (appError) throw appError;
                  const { error: roleError } = await supabase
                    .from('user_roles' as any)
                    .update({ role: 'member' })
                    .eq('user_id', selectedApp.user_id);
                  if (roleError) throw roleError;
                  await supabase.functions.invoke('send-application-status', {
                    body: { applicationId: selectedApp.id, status: 'approved', adminNotes }
                  });
                  toast({ title: "Application Approved", description: "The user has been granted member access and notified via email." });
                  setReviewDialogOpen(false);
                  fetchApplications();
                } catch (error) {
                  console.error('Error approving application:', error);
                  toast({ title: "Error", description: "Failed to approve application", variant: "destructive" });
                } finally {
                  setReviewing(false);
                }
              }}
              disabled={reviewing}
              className="bg-green-600 hover:bg-green-700"
            >
              {reviewing ? 'Processing...' : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve & Grant Member Access
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Membership Applications</h2>
            <p className="text-gray-600">Review and approve membership requests</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{pendingApps.length}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>

        {/* Pending Applications */}
        {pendingApps.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-700 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Review ({pendingApps.length})
            </h3>
            {pendingApps.map((app) => (
              <Card key={app.id} className="border-orange-200 bg-orange-50/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{app.company_name}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(app.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Application:</Label>
                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap bg-white p-3 rounded-md border max-h-40 overflow-y-auto">
                      {app.application_text}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReview(app)}
                      variant="default"
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Application
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reviewed Applications */}
        {reviewedApps.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Reviewed Applications ({reviewedApps.length})
            </h3>
            {reviewedApps.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{app.company_name}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {app.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Reviewed: {app.reviewed_at ? new Date(app.reviewed_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                {app.admin_notes && (
                  <CardContent>
                    <Label className="text-sm font-semibold text-gray-700">Admin Notes:</Label>
                    <p className="text-sm text-gray-600 mt-1">{app.admin_notes}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {applications.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplicationManagement;
