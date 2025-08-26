import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SurveyPersistenceOptions {
  surveyKey: string;
  autoSave?: boolean;
  saveInterval?: number;
}

export const useSurveyPersistence = ({ 
  surveyKey, 
  autoSave = true, 
  saveInterval = 30000 
}: SurveyPersistenceOptions) => {
  const location = useLocation();
  const navigate = useNavigate();
  const scrollPositionRef = useRef<number>(0);
  const lastSectionRef = useRef<number>(1);

  // Save scroll position before leaving
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(`${surveyKey}_scroll`, window.scrollY.toString());
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        localStorage.setItem(`${surveyKey}_scroll`, window.scrollY.toString());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [surveyKey]);

  // Restore scroll position when returning
  useEffect(() => {
    const savedScroll = localStorage.getItem(`${surveyKey}_scroll`);
    const savedSection = localStorage.getItem(`${surveyKey}_section`);
    
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll));
      }, 100);
    }
    
    if (savedSection) {
      lastSectionRef.current = parseInt(savedSection);
    }
  }, [surveyKey, location.pathname]);

  // Save current section
  const saveCurrentSection = (section: number) => {
    localStorage.setItem(`${surveyKey}_section`, section.toString());
    lastSectionRef.current = section;
  };

  // Save scroll position
  const saveScrollPosition = () => {
    const currentScroll = window.scrollY;
    localStorage.setItem(`${surveyKey}_scroll`, currentScroll.toString());
    scrollPositionRef.current = currentScroll;
  };

  // Get last known section
  const getLastSection = () => lastSectionRef.current;

  // Clear saved data
  const clearSavedData = () => {
    localStorage.removeItem(`${surveyKey}_scroll`);
    localStorage.removeItem(`${surveyKey}_section`);
    localStorage.removeItem(`${surveyKey}_formData`);
  };

  // Auto-save form data
  const setupAutoSave = (formData: any) => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      try {
        localStorage.setItem(`${surveyKey}_formData`, JSON.stringify(formData));
      } catch (error) {
        console.warn('Failed to auto-save form data:', error);
      }
    }, saveInterval);

    return () => clearInterval(interval);
  };

  // Get saved form data
  const getSavedFormData = () => {
    try {
      const saved = localStorage.getItem(`${surveyKey}_formData`);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load saved form data:', error);
      return null;
    }
  };

  // Save form data manually
  const saveFormData = (formData: any) => {
    try {
      localStorage.setItem(`${surveyKey}_formData`, JSON.stringify(formData));
    } catch (error) {
      console.warn('Failed to save form data:', error);
    }
  };

  return {
    saveCurrentSection,
    saveScrollPosition,
    getLastSection,
    clearSavedData,
    setupAutoSave,
    getSavedFormData,
    saveFormData,
    scrollPositionRef,
  };
}; 