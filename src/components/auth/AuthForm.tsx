
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Google SVG Icon
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message as string;
  }
  return 'An unexpected error occurred';
};

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    firstName: '', 
    lastName: '' 
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score, strength: score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong' };
  };

  const passwordStrength = checkPasswordStrength(signUpForm.password);
  const passwordsMatch = signUpForm.password === signUpForm.confirmPassword;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(signInForm.email, signInForm.password);
      
      if (error) {
        const errorMessage = getErrorMessage(error);
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        // Don't navigate here, let the auth context handle it
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Sign In Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordStrength.score < 3) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      });
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signUp(
        signUpForm.email, 
        signUpForm.password,
        {
          first_name: signUpForm.firstName,
          last_name: signUpForm.lastName,
        }
      );
      
      if (error) {
        const errorMessage = getErrorMessage(error);
        if (errorMessage.includes('already registered')) {
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Account Created Successfully!",
          description: "Please check your email to verify your account before signing in.",
        });
        // Clear the form
        setSignUpForm({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: ''
        });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Sign Up Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        const errorMessage = getErrorMessage(error);
        toast({
          title: "Google Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
      }
      // Don't set loading false on success, redirect will happen
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Google Sign In Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: 'https://cffdatabase.onrender.com/auth?mode=reset',
      });

      if (error) {
        const errorMessage = getErrorMessage(error);
        toast({
          title: "Password Reset Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Password Reset Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show forgot password form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4" style={{ backgroundImage: 'url(/auth.jpg)' }}>
        <Card className="w-full max-w-md border border-blue-600/40 bg-blue-700/30 backdrop-blur-md relative z-10 shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Reset Password
            </CardTitle>
            <CardDescription className="text-white/90">
              Enter your email to receive password reset instructions
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-white font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
              
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-white hover:bg-blue-700/20"
                onClick={() => setShowForgotPassword(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-4" style={{ backgroundImage: 'url(/auth.jpg)' }}>
      <Card className="w-full max-w-md border border-blue-600/40 bg-blue-700/30 backdrop-blur-md relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">
            Collaborative Frontier
          </CardTitle>
          <CardDescription className="text-white/90">
            Fund Manager Database Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-blue-700/20 hover:bg-blue-700/30 text-white border border-blue-600/40 backdrop-blur-sm"
            >
              <GoogleIcon />
              Continue with Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-600/40" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-blue-700/20 backdrop-blur-sm text-white/90">Or continue with email</span>
            </div>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-700/20 border-blue-600/40">
              <TabsTrigger value="signin" className="text-white data-[state=active]:bg-blue-700/30 data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:bg-blue-700/30 data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                    <Input
                      id="signin-password"
                      type={showSignInPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 hover:text-blue-100"
                      onClick={() => setShowSignInPassword(!showSignInPassword)}
                    >
                      {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-100/90 hover:text-blue-100 underline"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-white font-medium">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                      <Input
                        id="first-name"
                        placeholder="First name"
                        className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60"
                        value={signUpForm.firstName}
                        onChange={(e) => setSignUpForm({ ...signUpForm, firstName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-white font-medium">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                      <Input
                        id="last-name"
                        placeholder="Last name"
                        className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60"
                        value={signUpForm.lastName}
                        onChange={(e) => setSignUpForm({ ...signUpForm, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 hover:text-blue-100"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {signUpForm.password && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${passwordStrength.strength === 'weak' ? 'bg-red-400' : passwordStrength.strength === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                        <span className="text-white/80">
                          Password strength: {passwordStrength.strength}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-white/70">
                        {Object.entries(passwordStrength.checks).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-1">
                            {value ? <CheckCircle className="w-3 h-3 text-green-400" /> : <XCircle className="w-3 h-3 text-red-400" />}
                            <span className={value ? 'text-green-400' : 'text-red-400'}>
                              {key === 'length' ? '8+ chars' : 
                               key === 'uppercase' ? 'Uppercase' :
                               key === 'lowercase' ? 'Lowercase' :
                               key === 'number' ? 'Number' : 'Special char'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 hover:text-blue-100"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {signUpForm.confirmPassword && (
                    <div className="flex items-center gap-2 text-xs">
                      {passwordsMatch ? 
                        <><CheckCircle className="w-3 h-3 text-green-400" /><span className="text-green-400">Passwords match</span></> :
                        <><XCircle className="w-3 h-3 text-red-400" /><span className="text-red-400">Passwords don't match</span></>
                      }
                    </div>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm" 
                  disabled={isLoading || passwordStrength.score < 3 || !passwordsMatch}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-blue-700/20 rounded-lg border border-blue-600/40">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-200 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-white/90">
                <p className="font-medium mb-2">Access Information:</p>
                <ul className="space-y-1 text-xs">
                  <li><span className="font-medium">Viewer:</span> Browse the network directory</li>
                  <li><span className="font-medium">Member:</span> Access to member data and survey</li>
                  <li><span className="font-medium">Admin:</span> Full platform management</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
