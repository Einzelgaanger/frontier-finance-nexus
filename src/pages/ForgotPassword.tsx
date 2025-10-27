import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        let message = 'Failed to send reset email. Please try again.';
        if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
          message = (error as { message: string }).message;
        }
        setError(message);
        toast({
          title: "Reset Failed",
          description: message,
          variant: "destructive"
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
      }
    } catch (error: unknown) {
      let message = 'Failed to send reset email. Please try again.';
      if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
        message = (error as { message?: string }).message!;
      }
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-3 sm:p-4 font-rubik" style={{ backgroundImage: 'url(/auth.jpg)' }}>
        <Card className="w-full max-w-md border border-blue-600/40 bg-blue-700/30 backdrop-blur-md relative z-10 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide select-none">
          <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img 
                src="/CFF LOGO.png" 
                alt="CFF Logo" 
                className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-white">Email Sent!</CardTitle>
            <CardDescription className="text-white/90 text-sm sm:text-base">
              We've sent password reset instructions to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center px-4 sm:px-6">
            <div className="bg-blue-50/20 border border-blue-500/50 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm text-white/90">
                Check your email and click the reset link to create a new password. 
                The link will expire in 1 hour for security reasons.
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/auth')}
                className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm rounded-full"
              >
                Back to Sign In
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                  setError('');
                }}
                className="w-full border-blue-600/40 text-blue-100 hover:bg-blue-700/30 hover:text-white rounded-full"
              >
                Send Another Email
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="w-full text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-3 sm:p-4 font-rubik" style={{ backgroundImage: 'url(/auth.jpg)' }}>
      <Card className="w-full max-w-md border border-blue-600/40 bg-blue-700/30 backdrop-blur-md relative z-10 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide select-none">
        <CardHeader className="text-center pb-4 sm:pb-6 pt-6 sm:pt-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <img 
              src="/CFF LOGO.png" 
              alt="CFF Logo" 
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
            />
          </div>
                      <CardTitle className="text-xl sm:text-2xl font-bold text-white">Reset Your Password</CardTitle>
          <CardDescription className="text-white/90 text-sm sm:text-base">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {error && (
            <Alert variant="destructive" className="bg-red-500/20 border-red-500/50">
              <AlertCircle className="h-4 w-4 text-red-300" />
              <AlertDescription className="text-red-100">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm rounded-full"
              disabled={loading || !email.trim()}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Reset Email...</span>
                </div>
              ) : (
                'Send Reset Instructions'
              )}
            </Button>
          </form>

          <div className="space-y-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="w-full text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-full"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-full"
              disabled={loading}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;