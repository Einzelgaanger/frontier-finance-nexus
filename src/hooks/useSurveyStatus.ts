// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SurveyStatus {
  year: string;
  completed: boolean;
  completedAt?: string;
  data?: any;
}

// Global state manager for survey status
class SurveyStatusManager {
  private cache = new Map<string, { data: SurveyStatus[]; timestamp: number }>();
  private pendingRequests = new Set<string>();
  private subscribers = new Set<(userId: string, data: SurveyStatus[]) => void>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  subscribe(callback: (userId: string, data: SurveyStatus[]) => void) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notify(userId: string, data: SurveyStatus[]) {
    this.subscribers.forEach(callback => callback(userId, data));
  }

  async fetchSurveyStatus(userId: string): Promise<SurveyStatus[]> {
    // Check cache first
    const cached = this.cache.get(userId);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    // Prevent duplicate calls
    if (this.pendingRequests.has(userId)) {
      // Wait for the pending request to complete
      return new Promise((resolve) => {
        const checkCache = () => {
          const cached = this.cache.get(userId);
          if (cached) {
            resolve(cached.data);
          } else {
            setTimeout(checkCache, 100);
          }
        };
        checkCache();
      });
    }

    this.pendingRequests.add(userId);

    try {
      const surveyChecks = await Promise.allSettled([
        // 2021 Survey
        (async () => {
          try {
            return await supabase
              .from('survey_2021_responses')
              .select('id, completed_at, *')
              .eq('user_id', userId)
              .not('completed_at', 'is', null)
              .maybeSingle();
          } catch (error) {
            console.warn('2021 survey table not accessible:', error);
            return { data: null, error: null };
          }
        })(),
        
        // Remove 2022 Survey (table doesn't exist)
        Promise.resolve({ data: null, error: null }),
        
        // 2023 Survey
        (async () => {
          try {
            return await supabase
              .from('survey_2023_responses')
              .select('id, completed_at, *')
              .eq('user_id', userId)
              .not('completed_at', 'is', null)
              .maybeSingle();
          } catch (error) {
            console.warn('2023 survey table not accessible:', error);
            return { data: null, error: null };
          }
        })(),
        
        // 2024 Survey
        (async () => {
          try {
            return await supabase
              .from('survey_2024_responses')
              .select('id, completed_at, *')
              .eq('user_id', userId)
              .not('completed_at', 'is', null)
              .maybeSingle();
          } catch (error) {
            console.warn('2024 survey table not accessible:', error);
            return { data: null, error: null };
          }
        })(),
        
        // Check all survey tables
        (async () => {
          try {
            const [survey2021, survey2022, survey2023, survey2024] = await Promise.all([
              supabase.from('survey_2021_responses').select('id, completed_at, *').eq('user_id', userId).not('completed_at', 'is', null).maybeSingle(),
              supabase.from('survey_2022_responses').select('id, completed_at, *').eq('user_id', userId).not('completed_at', 'is', null).maybeSingle(),
              supabase.from('survey_2023_responses').select('id, completed_at, *').eq('user_id', userId).not('completed_at', 'is', null).maybeSingle(),
              supabase.from('survey_2024_responses').select('id, completed_at, *').eq('user_id', userId).not('completed_at', 'is', null).maybeSingle()
            ]);
            
            // Return the first completed survey found
            const completedSurvey = survey2021.data || survey2022.data || survey2023.data || survey2024.data;
            return { data: completedSurvey, error: null };
          } catch (error) {
            console.warn('Survey tables not accessible:', error);
            return { data: null, error: null };
          }
        })()
      ]);

      // Process each survey check result
      const processSurveyResult = (check: PromiseSettledResult<any>, year: string) => {
        if (check.status === 'rejected') {
          console.warn(`Survey ${year} check failed:`, check.reason);
          return {
            year,
            completed: false,
            completedAt: undefined,
            data: undefined
          };
        }

        const { data, error } = check.value;
        if (error) {
          console.warn(`Survey ${year} query error:`, error);
          return {
            year,
            completed: false,
            completedAt: undefined,
            data: undefined
          };
        }

        return {
          year,
          completed: !!data,
          completedAt: data?.completed_at,
          data: data || undefined
        };
      };

      const statuses: SurveyStatus[] = [
        processSurveyResult(surveyChecks[0], '2021'),
        processSurveyResult(surveyChecks[1], '2022'),
        processSurveyResult(surveyChecks[2], '2023'),
        processSurveyResult(surveyChecks[3], '2024'),
        processSurveyResult(surveyChecks[4], 'current')
      ];

      // Cache the results
      this.cache.set(userId, {
        data: statuses,
        timestamp: Date.now()
      });

      // Notify all subscribers
      this.notify(userId, statuses);

      return statuses;
    } catch (error) {
      console.error('Error checking survey status:', error);
      return [];
    } finally {
      this.pendingRequests.delete(userId);
    }
  }

  clearCache(userId?: string) {
    if (userId) {
      this.cache.delete(userId);
    } else {
      this.cache.clear();
    }
  }
}

// Global instance
const surveyStatusManager = new SurveyStatusManager();

export const useSurveyStatus = () => {
  const [surveyStatuses, setSurveyStatuses] = useState<SurveyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const lastUserIdRef = useRef<string | null>(null);

  const checkSurveyStatus = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const statuses = await surveyStatusManager.fetchSurveyStatus(user.id);
      setSurveyStatuses(statuses);
    } catch (error) {
      console.error('Error checking survey status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSurveyStatus = (year: string): SurveyStatus | undefined => {
    return surveyStatuses.find(status => status.year === year);
  };

  const isSurveyCompleted = (year: string): boolean => {
    const status = getSurveyStatus(year);
    return status?.completed || false;
  };

  const getSurveyData = (year: string): any => {
    const status = getSurveyStatus(year);
    return status?.data;
  };

  useEffect(() => {
    if (user?.id) {
      // Only call if user ID actually changed
      if (lastUserIdRef.current !== user.id) {
        lastUserIdRef.current = user.id;
        checkSurveyStatus();
      }

      // Subscribe to global updates
      const unsubscribe = surveyStatusManager.subscribe((userId, data) => {
        if (userId === user.id) {
          setSurveyStatuses(data);
          setLoading(false);
        }
      });

      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    } else {
      // Clear data when user logs out
      setSurveyStatuses([]);
      setLoading(false);
      lastUserIdRef.current = null;
    }
  }, [user?.id]);

  const refreshSurveyStatus = () => {
    if (user?.id) {
      // Clear cache and force refresh
      surveyStatusManager.clearCache(user.id);
      checkSurveyStatus();
    }
  };

  return {
    surveyStatuses,
    loading,
    getSurveyStatus,
    isSurveyCompleted,
    getSurveyData,
    refreshSurveyStatus
  };
};
