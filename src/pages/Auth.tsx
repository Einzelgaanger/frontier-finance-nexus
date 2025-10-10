
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle Supabase recovery tokens from URL hash first (e.g. #access_token=...)
    const rawHash = location.hash?.startsWith('#') ? location.hash.slice(1) : '';
    const hashParams = new URLSearchParams(rawHash);
    const hashAccessToken = hashParams.get('access_token');
    const hashRefreshToken = hashParams.get('refresh_token');
    const hashType = hashParams.get('type');

    if (hashAccessToken && hashRefreshToken && hashType === 'recovery') {
      // Redirect to reset-password with tokens as query params
      const qs = `?access_token=${encodeURIComponent(hashAccessToken)}&refresh_token=${encodeURIComponent(hashRefreshToken)}&type=recovery`;
      navigate(`/reset-password${qs}`, { replace: true });
      return; // Prevent rendering AuthForm while redirecting
    }

    // Fallback: Clean up the URL by removing any remaining hash fragments
    if (location.hash) {
      const cleanUrl = location.pathname + location.search;
      window.history.replaceState(null, '', cleanUrl);
    }

    // Also support tokens already in search (edge case)
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    console.log('Auth component - URL params:', { 
      hasAccessToken: !!accessToken, 
      hasRefreshToken: !!refreshToken, 
      type 
    });

    if (accessToken && refreshToken && type === 'recovery') {
      navigate(`/reset-password${location.search}`, { replace: true });
      return;
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
