
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    if (accessToken) {
      navigate(`/reset-password${location.search}`);
    }
  }, [location, navigate]);

  return <AuthForm />;
};

export default Auth;
