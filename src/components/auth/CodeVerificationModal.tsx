
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2, Mail, Key } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface CodeVerificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CodeVerificationModal({ open, onClose }: CodeVerificationModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    vehicleName: '',
    invitationCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUserRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.vehicleName.trim() || !formData.invitationCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Verify the invitation code with email and vehicle name
      const { data: codeData, error: codeError } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('code', formData.invitationCode.toUpperCase())
        .eq('email', formData.email)
        .eq('vehicle_name', formData.vehicleName)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (codeError || !codeData) {
        toast({
          title: "Invalid Details",
          description: "The invitation code, email, or vehicle name is incorrect, or the code has expired.",
          variant: "destructive",
        });
        return;
      }

      // Mark the code as used
      const { error: updateCodeError } = await supabase
        .from('invitation_codes')
        .update({
          used_at: new Date().toISOString(),
          used_by: user?.id
        })
        .eq('id', codeData.id);

      if (updateCodeError) throw updateCodeError;

      // Update user role to member
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user?.id,
          role: 'member',
          assigned_at: new Date().toISOString(),
          assigned_by: codeData.created_by
        });

      // If the user is already a member (409 duplicate key), treat as success
      if (roleError && roleError.code !== '23505') throw roleError;

      // Wait a moment for the database to update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh the user role in the frontend
      await refreshUserRole();

      toast({
        title: "Verification Successful",
        description: "You have been upgraded to Member access! Redirecting...",
      });
      
      // Redirect to dashboard (role will be updated in the frontend)
      navigate('/dashboard');
      onClose();

    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "Failed to verify code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      vehicleName: '',
      invitationCode: ''
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-md !rounded-2xl !shadow-xl !p-6 !max-w-[95vw] !w-full !border-0"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-blue-600" />
            <span>Verify Invitation Code</span>
          </DialogTitle>
          <DialogDescription>
            Enter your details and invitation code to upgrade to Member access.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verify-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="verify-email"
                  type="email"
                  placeholder="Enter the email used for the request"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verify-vehicle">Fund Vehicle Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="verify-vehicle"
                  placeholder="Enter your fund vehicle name"
                  value={formData.vehicleName}
                  onChange={(e) => handleInputChange('vehicleName', e.target.value)}
                  className="pl-10 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verify-code">Invitation Code</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="verify-code"
                  placeholder="Enter your 6-character invitation code"
                  value={formData.invitationCode}
                  onChange={(e) => handleInputChange('invitationCode', e.target.value.toUpperCase())}
                  className="pl-10 font-mono rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                  maxLength={6}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Important Notes</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use the exact email and vehicle name from your membership request</li>
              <li>• Invitation codes expire 24 hours after generation</li>
              <li>• Each code can only be used once</li>
              <li>• After verification, you'll be redirected to your dashboard</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-xl px-5 py-2">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5 py-2 shadow-md"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
