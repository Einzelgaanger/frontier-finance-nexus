
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');
    
    console.log('Auth component - URL params:', { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken, 
      type 
    });
    
    // Handle password reset redirect
    if (accessToken && refreshToken && type === 'recovery') {
      console.log('Redirecting to reset password page...');
      // Use replace to avoid back button issues
      navigate(`/reset-password${location.search}`, { replace: true });
      return; // Don't render AuthForm if we're redirecting
    }
  }, [location, navigate]);

  // Check if we have recovery tokens in the URL
  const params = new URLSearchParams(location.search);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const type = params.get('type');
  
  // If we have recovery tokens, don't render the auth form
  if (accessToken && refreshToken && type === 'recovery') {
    return null; // This will prevent the auth form from showing while redirecting
  }

  return <AuthForm />;
};

export default Auth;
