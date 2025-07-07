
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
import { Building2, Mail, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MembershipRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export function MembershipRequestModal({ open, onClose }: MembershipRequestModalProps) {
  const [vehicleName, setVehicleName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !vehicleName.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('membership_requests')
        .insert({
          user_id: user.id,
          vehicle_name: vehicleName.trim(),
          email: user.email || '',
        });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Your membership request has been submitted for review. You'll be notified when it's processed."
      });

      setVehicleName('');
      onClose();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Request Member Access</span>
          </DialogTitle>
          <DialogDescription>
            To gain full access to our fund manager network, please provide your fund vehicle information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="pl-10 bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle-name">Fund Vehicle Name *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="vehicle-name"
                  placeholder="Enter your fund vehicle name"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your request will be reviewed by our admin team</li>
              <li>• You'll receive an invitation code via email if approved</li>
              <li>• Use the code to upgrade to Member access</li>
              <li>• Complete the comprehensive survey to join the network</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !vehicleName.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
