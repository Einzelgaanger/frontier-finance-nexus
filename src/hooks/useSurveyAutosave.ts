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

      // Ensure required non-null fields are populated for drafts
      const { data: authData } = await supabase.auth.getUser();
      const userEmail = authData?.user?.email;

      let requiredFields: Record<string, any> = {};
      switch (surveyYear) {
        case '2021':
          requiredFields = {
            email_address: formData?.email_address || userEmail || `draft+${userId}@placeholder.local`,
            firm_name: formData?.firm_name || 'Draft',
            participant_name: formData?.participant_name || 'Draft',
            role_title: formData?.role_title || 'Draft',
          };
          break;
        case '2022':
          requiredFields = {
            name: formData?.name || 'Draft',
            role_title: formData?.role_title || 'Draft',
            email: formData?.email || userEmail || `draft+${userId}@placeholder.local`,
            organisation: formData?.organisation || 'Draft',
          };
          break;
        case '2023':
          requiredFields = {
            email_address: formData?.email_address || userEmail || `draft+${userId}@placeholder.local`,
            organisation_name: formData?.organisation_name || 'Draft',
            funds_raising_investing: formData?.funds_raising_investing || 'Draft',
            fund_name: formData?.fund_name || 'Draft',
          };
          break;
        case '2024':
          requiredFields = {
            email_address: formData?.email_address || userEmail || `draft+${userId}@placeholder.local`,
            organisation_name: formData?.organisation_name || 'Draft',
            funds_raising_investing: formData?.funds_raising_investing || 'Draft',
            fund_name: formData?.fund_name || 'Draft',
          };
          break;
      }

      const surveyData = {
        user_id: userId,
        ...requiredFields,
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

      // Reset to idle after 2 seconds (no toast notification)
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
