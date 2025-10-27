
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, XCircle, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';


const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    const message = (error as any).message;
    
    // Handle specific error cases
    if (message.includes('500')) {
      return 'Server error (500). This might be a temporary Supabase service issue. Please try again in a few moments.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    if (message.includes('Too many requests')) {
      return 'Too many login attempts. Please wait a few minutes before trying again.';
    }
    
    return message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '',
    firstName: '', 
    lastName: '',
    companyName: ''
  });
  
  const { signIn, signUp } = useAuth();
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
          company_name: signUpForm.companyName,
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
          lastName: '',
          companyName: ''
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

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed flex items-center justify-center p-3 sm:p-4 font-rubik" style={{ backgroundImage: 'url(/auth.jpg)' }}>
      <Card className="w-full max-w-md border border-blue-600/40 bg-blue-700/30 backdrop-blur-md relative z-10 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto scrollbar-hide select-none">
        <CardHeader className="text-center pt-6 sm:pt-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <img 
              src="/CFF LOGO.png" 
              alt="CFF Logo" 
              className="h-14 sm:h-16 md:h-20 w-auto object-contain"
            />
          </div>
          <CardDescription className="text-white/90 text-sm sm:text-base">
            Fund Manager Database Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-700/20 border-blue-600/40 rounded-full">
              <TabsTrigger value="signin" className="text-white data-[state=active]:bg-blue-700/30 data-[state=active]:text-white rounded-full">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:bg-blue-700/30 data-[state=active]:text-white rounded-full">Sign Up</TabsTrigger>
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
                      className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                      value={signInForm.email}
                      onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                      required
                      autoComplete="email"
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
                      className="pl-10 pr-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                      value={signInForm.password}
                      onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                      required
                      autoComplete="current-password"
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
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot password?
                  </button>
                </div>
                
                <Button type="submit" className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm rounded-full" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-white font-medium">Company Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-100/90 w-4 h-4" />
                    <Input
                      id="company-name"
                      placeholder="Enter your company name"
                      className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                      value={signUpForm.companyName}
                      onChange={(e) => setSignUpForm({ ...signUpForm, companyName: e.target.value })}
                      required
                      autoComplete="organization"
                    />
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
                      className="pl-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                      value={signUpForm.email}
                      onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                      required
                      autoComplete="email"
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
                      className="pl-10 pr-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      required
                      autoComplete="new-password"
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
                      className="pl-10 pr-10 bg-blue-700/20 border-blue-600/40 text-white placeholder:text-blue-100/70 focus:bg-blue-700/30 focus:border-blue-500/60 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full select-text autofill:bg-blue-700/20 autofill:text-white"
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      required
                      autoComplete="new-password"
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
                  className="w-full bg-blue-600/80 hover:bg-blue-600 text-white backdrop-blur-sm rounded-full" 
                  disabled={isLoading || passwordStrength.score < 3 || !passwordsMatch}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
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
