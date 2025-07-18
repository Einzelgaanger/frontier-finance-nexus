import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLoadingStore } from '@/store/loading-store';

export const useNavigationLoading = () => {
  const location = useLocation();
  const { setLoading } = useLoadingStore();

  useEffect(() => {
    // Show loading when route changes
    setLoading(true);

    // Hide loading after a short delay to ensure smooth transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800); // 800ms delay for smooth transition

    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  return null;
}; 