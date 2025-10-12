import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, AlertCircle, CheckCircle } from 'lucide-react';

export default function MagicLinkFallback() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { signInWithMagicLink, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleMagicLink = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await signInWithMagicLink(email);
      
      if (error) {
        setError(error.message || 'Failed to send magic link. Please try again.');
      } else {
        setMagicLinkSent(true);
        setSuccess('Magic link sent! Check your email and click the link to sign in.');
        toast({
          title: "Magic Link Sent",
          description: "Check your email for the magic link to sign in.",
        });
      }
    } catch (err) {
      setError('Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        setError(error.message || 'Failed to send password reset email. Please try again.');
      } else {
        setSuccess('Password reset email sent! Check your email for instructions.');
        toast({
          title: "Password Reset Sent",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (err) {
      setError('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Issue Detected
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Password sign-in is temporarily unavailable. Please use Magic Link instead.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="mr-2 h-5 w-5" />
              Magic Link Sign-In
            </CardTitle>
            <CardDescription>
              We'll send you a secure link to sign in without a password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleMagicLink} 
                className="w-full" 
                disabled={loading || magicLinkSent}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : magicLinkSent ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Magic Link Sent
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Magic Link
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="text-sm"
                >
                  Forgot your password? Reset it here
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Having trouble? Contact support or try again later.
          </p>
        </div>
      </div>
    </div>
  );
}

