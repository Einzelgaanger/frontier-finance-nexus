import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UseFormWatch } from 'react-hook-form';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseSurveyAutosaveProps {
  userId: string | undefined;
  surveyYear: '2021' | '2022' | '2023' | '2024';
  watch: UseFormWatch<any>;
  enabled?: boolean;
  saveInterval?: number; // in milliseconds
}

export function useSurveyAutosave({
  userId,
  surveyYear,
  watch,
  enabled = true,
  saveInterval = 3000, // 3 seconds default
}: UseSurveyAutosaveProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>('');

  const tableName = `survey_responses_${surveyYear}`;

  // Manual save function
  const saveDraft = async (formData: any, showToast: boolean = false) => {
    if (!userId) return { success: false, error: 'No user ID' };

    setSaveStatus('saving');

    try {
      // Check if draft exists
      const { data: existingDraft } = await supabase
        .from(tableName as any)
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      const surveyData = {
        user_id: userId,
        form_data: formData,
        submission_status: 'draft',
        updated_at: new Date().toISOString(),
      };

      let result;
      if (existingDraft) {
        // Update existing draft
        result = await supabase
          .from(tableName as any)
          .update(surveyData)
          .eq('user_id', userId);
      } else {
        // Insert new draft
        result = await supabase
          .from(tableName as any)
          .insert(surveyData);
      }

      if (result.error) throw result.error;

      setSaveStatus('saved');
      setLastSaveTime(new Date());
      lastSavedDataRef.current = JSON.stringify(formData);

      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);

      return { success: true };
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
      return { success: false, error };
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (!enabled || !userId) return;

    const subscription = watch((formData) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Check if data has changed
      const currentData = JSON.stringify(formData);
      if (currentData === lastSavedDataRef.current) {
        return; // No changes, don't save
      }

      // Set new timeout for autosave
      saveTimeoutRef.current = setTimeout(() => {
        saveDraft(formData, false);
      }, saveInterval);
    });

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      subscription.unsubscribe();
    };
  }, [enabled, userId, saveInterval]);

  return {
    saveStatus,
    lastSaveTime,
    saveDraft,
  };
}
