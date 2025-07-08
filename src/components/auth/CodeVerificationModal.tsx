
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

interface CodeVerificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CodeVerificationModal({ open, onClose }: CodeVerificationModalProps) {
  const [email, setEmail] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !vehicleName.trim() || !invitationCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Verify the invitation code
      const { data: codeData, error: codeError } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('code', invitationCode.toUpperCase())
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (codeError || !codeData) {
        toast({
          title: "Invalid Code",
          description: "The invitation code is incorrect or has expired.",
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

      if (roleError) throw roleError;

      toast({
        title: "Verification Successful",
        description: "You have been upgraded to Member access! Redirecting to survey...",
      });

      // Close modal and redirect to survey
      onClose();
      setTimeout(() => {
        window.location.href = '/survey';
      }, 2000);

    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setVehicleName('');
    setInvitationCode('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
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
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="pl-10"
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
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                  className="pl-10 font-mono"
                  maxLength={6}
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Next Steps</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Verify your details match the approved request</li>
              <li>• Complete the comprehensive fund manager survey</li>
              <li>• Access the full network of fund managers</li>
              <li>• View member-level data and analytics</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !email.trim() || !vehicleName.trim() || !invitationCode.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
