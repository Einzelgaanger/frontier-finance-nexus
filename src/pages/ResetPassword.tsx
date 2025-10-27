
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Get tokens from URL
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');
  const type = searchParams.get('type');

  console.log('ResetPassword component - URL params:', { 
    hasAccessToken: !!accessToken, 
    hasRefreshToken: !!refreshToken, 
    type 
  });

  useEffect(() => {
    const handlePasswordReset = async () => {
      console.log('ResetPassword useEffect - checking tokens:', { 
        hasAccessToken: !!accessToken, 
        hasRefreshToken: !!refreshToken, 
        type 
      });

      if (accessToken && refreshToken && type === 'recovery') {
        try {
          console.log('Setting session with tokens...');
          // Set session with the tokens from the URL
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('Session error:', sessionError);
            setError('Invalid or expired reset link. Please request a new password reset.');
          } else {
            console.log('Session set successfully');
          }
        } catch (error) {
          console.error('Error setting session:', error);
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      } else if (!accessToken || !refreshToken || type !== 'recovery') {
        console.log('Missing required tokens or wrong type');
        setError('Invalid or missing reset token. Please request a new password reset.');
      }
    };

    handlePasswordReset();
  }, [accessToken, refreshToken, type]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push('One uppercase letter');
    if (!hasLowerCase) errors.push('One lowercase letter');
    if (!hasNumbers) errors.push('One number');
    if (!hasSpecialChar) errors.push('One special character');

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`);
      return;
    }

    if (!accessToken || type !== 'recovery') {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated. You can now sign in with your new password.",
      });

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 3000);

    } catch (error: unknown) {
      let message = 'Failed to update password. Please try again.';
      if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
        message = (error as { message?: string }).message!;
      }
      console.error('Error updating password:', error);
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

  if (success) {
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
            <CardTitle className="text-xl sm:text-2xl font-bold text-white">Password Updated!</CardTitle>
            <CardDescription className="text-white/90 text-sm sm:text-base">
              Your password has been successfully updated. Redirecting you to sign in...
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center px-4 sm:px-6 space-y-2">
            <Button 
              onClick={() => navigate('/auth')}
              className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm rounded-full"
            >
              Go to Sign In
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>
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
            Enter your new password below
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
              <Label htmlFor="password" className="text-white font-medium">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="pl-10 pr-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                  disabled={loading || !accessToken || type !== 'recovery'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 hover:text-blue-100"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-white/70">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="pl-10 pr-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                  disabled={loading || !accessToken || type !== 'recovery'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 hover:text-blue-100"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm rounded-full"
              disabled={loading || !accessToken || type !== 'recovery' || !password || !confirmPassword}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating Password...</span>
                </div>
              ) : (
                'Update Password'
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

export default ResetPassword;
