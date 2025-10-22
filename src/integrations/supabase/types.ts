export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          admin_notes: string | null
          amount_raised_to_date: string | null
          applicant_name: string | null
          application_text: string
          company_name: string
          created_at: string | null
          email: string
          expectations_from_network: string | null
          how_heard_about_network: string | null
          id: string
          investment_thesis: string | null
          number_of_investments: string | null
          organization_website: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role_job_title: string | null
          status: string
          team_overview: string | null
          typical_check_size: string | null
          updated_at: string | null
          user_id: string
          vehicle_name: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount_raised_to_date?: string | null
          applicant_name?: string | null
          application_text: string
          company_name: string
          created_at?: string | null
          email: string
          expectations_from_network?: string | null
          how_heard_about_network?: string | null
          id?: string
          investment_thesis?: string | null
          number_of_investments?: string | null
          organization_website?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_job_title?: string | null
          status?: string
          team_overview?: string | null
          typical_check_size?: string | null
          updated_at?: string | null
          user_id: string
          vehicle_name?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount_raised_to_date?: string | null
          applicant_name?: string | null
          application_text?: string
          company_name?: string
          created_at?: string | null
          email?: string
          expectations_from_network?: string | null
          how_heard_about_network?: string | null
          id?: string
          investment_thesis?: string | null
          number_of_investments?: string | null
          organization_website?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_job_title?: string | null
          status?: string
          team_overview?: string | null
          typical_check_size?: string | null
          updated_at?: string | null
          user_id?: string
          vehicle_name?: string | null
        }
        Relationships: []
      }
      field_visibility: {
        Row: {
          admin_visible: boolean | null
          created_at: string | null
          field_category: string
          field_name: string
          id: string
          member_visible: boolean | null
          survey_year: number
          viewer_visible: boolean | null
        }
        Insert: {
          admin_visible?: boolean | null
          created_at?: string | null
          field_category: string
          field_name: string
          id?: string
          member_visible?: boolean | null
          survey_year: number
          viewer_visible?: boolean | null
        }
        Update: {
          admin_visible?: boolean | null
          created_at?: string | null
          field_category?: string
          field_name?: string
          id?: string
          member_visible?: boolean | null
          survey_year?: number
          viewer_visible?: boolean | null
        }
        Relationships: []
      }
      survey_responses_2021: {
        Row: {
          completed_at: string | null
          created_at: string | null
          email_address: string
          firm_name: string | null
          form_data: Json | null
          fund_stage: string | null
          id: string
          participant_name: string | null
          role_title: string | null
          submission_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          email_address: string
          firm_name?: string | null
          form_data?: Json | null
          fund_stage?: string | null
          id?: string
          participant_name?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          email_address?: string
          firm_name?: string | null
          form_data?: Json | null
          fund_stage?: string | null
          id?: string
          participant_name?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      survey_responses_2022: {
        Row: {
          completed_at: string | null
          created_at: string | null
          email_address: string
          firm_name: string | null
          form_data: Json | null
          fund_stage: string | null
          id: string
          participant_name: string | null
          role_title: string | null
          submission_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          email_address: string
          firm_name?: string | null
          form_data?: Json | null
          fund_stage?: string | null
          id?: string
          participant_name?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          email_address?: string
          firm_name?: string | null
          form_data?: Json | null
          fund_stage?: string | null
          id?: string
          participant_name?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      survey_responses_2023: {
        Row: {
          completed_at: string | null
          created_at: string | null
          email_address: string
          form_data: Json | null
          fund_name: string | null
          fund_stage: string | null
          id: string
          organisation_name: string
          participant_name: string | null
          role_title: string | null
          submission_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          email_address: string
          form_data?: Json | null
          fund_name?: string | null
          fund_stage?: string | null
          id?: string
          organisation_name: string
          participant_name?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          email_address?: string
          form_data?: Json | null
          fund_name?: string | null
          fund_stage?: string | null
          id?: string
          organisation_name?: string
          participant_name?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      survey_responses_2024: {
        Row: {
          completed_at: string | null
          created_at: string | null
          email_address: string
          form_data: Json | null
          fund_name: string | null
          fund_stage: string | null
          id: string
          organisation_name: string
          participant_name: string | null
          role_title: string | null
          submission_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          email_address: string
          form_data?: Json | null
          fund_name?: string | null
          fund_stage?: string | null
          id?: string
          organisation_name: string
          participant_name?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          email_address?: string
          form_data?: Json | null
          fund_name?: string | null
          fund_stage?: string | null
          id?: string
          organisation_name?: string
          participant_name?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          company_id: string | null
          company_name: string
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string | null
          id: string
          is_active: boolean | null
          last_login_at: string | null
          metadata: Json | null
          phone: string | null
          profile_picture_url: string | null
          role_title: string | null
          updated_at: string | null
          user_role: string
        }
        Insert: {
          company_id?: string | null
          company_name: string
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          last_login_at?: string | null
          metadata?: Json | null
          phone?: string | null
          profile_picture_url?: string | null
          role_title?: string | null
          updated_at?: string | null
          user_role?: string
        }
        Update: {
          company_id?: string | null
          company_name?: string
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          metadata?: Json | null
          phone?: string | null
          profile_picture_url?: string | null
          role_title?: string | null
          updated_at?: string | null
          user_role?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
