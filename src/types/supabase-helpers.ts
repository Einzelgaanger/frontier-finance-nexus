// Temporary helper types for database tables until Supabase regenerates types
// This resolves TypeScript errors after migrations

export type SupabaseTable = 
  | 'user_profiles'
  | 'user_roles'
  | 'applications'
  | 'survey_responses_2021'
  | 'survey_responses_2022'
  | 'survey_responses_2023'
  | 'survey_responses_2024'
  | 'field_visibility';

// Helper function to safely cast table names
export const table = (name: SupabaseTable): any => name;
