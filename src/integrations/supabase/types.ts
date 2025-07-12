export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      data_field_visibility: {
        Row: {
          field_name: string
          id: string
          updated_at: string | null
          updated_by: string | null
          visibility_level: string
        }
        Insert: {
          field_name: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          visibility_level?: string
        }
        Update: {
          field_name?: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          visibility_level?: string
        }
        Relationships: []
      }
      invitation_codes: {
        Row: {
          code: string
          created_at: string | null
          created_by: string
          email: string | null
          expires_at: string
          id: string
          used_at: string | null
          used_by: string | null
          vehicle_name: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by: string
          email?: string | null
          expires_at: string
          id?: string
          used_at?: string | null
          used_by?: string | null
          vehicle_name?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string
          email?: string | null
          expires_at?: string
          id?: string
          used_at?: string | null
          used_by?: string | null
          vehicle_name?: string | null
        }
        Relationships: []
      }
      member_surveys: {
        Row: {
          amount_raised_to_date: string | null
          aum: string | null
          completed_at: string | null
          contact_information: Json | null
          created_at: string | null
          current_fund_status: string | null
          diversity_metrics: Json | null
          fund_name: string
          fund_structure: string | null
          fund_type: string
          fundraising_target: string | null
          historical_returns: Json | null
          id: string
          investment_instruments: string[] | null
          investment_thesis: string | null
          key_team_members: Json | null
          legal_entity_name: string | null
          notable_exits: string | null
          number_of_investments: number | null
          primary_investment_region: string | null
          regional_allocation: Json | null
          regulatory_jurisdiction: string | null
          secondary_regions: string[] | null
          sector_focus: string[] | null
          social_media_links: Json | null
          stage_focus: string[] | null
          team_size: number | null
          typical_check_size: string | null
          typical_ownership_sought: string | null
          updated_at: string | null
          user_id: string
          value_add_services: string | null
          website: string | null
          year_founded: number | null
        }
        Insert: {
          amount_raised_to_date?: string | null
          aum?: string | null
          completed_at?: string | null
          contact_information?: Json | null
          created_at?: string | null
          current_fund_status?: string | null
          diversity_metrics?: Json | null
          fund_name?: string
          fund_structure?: string | null
          fund_type?: string
          fundraising_target?: string | null
          historical_returns?: Json | null
          id?: string
          investment_instruments?: string[] | null
          investment_thesis?: string | null
          key_team_members?: Json | null
          legal_entity_name?: string | null
          notable_exits?: string | null
          number_of_investments?: number | null
          primary_investment_region?: string | null
          regional_allocation?: Json | null
          regulatory_jurisdiction?: string | null
          secondary_regions?: string[] | null
          sector_focus?: string[] | null
          social_media_links?: Json | null
          stage_focus?: string[] | null
          team_size?: number | null
          typical_check_size?: string | null
          typical_ownership_sought?: string | null
          updated_at?: string | null
          user_id: string
          value_add_services?: string | null
          website?: string | null
          year_founded?: number | null
        }
        Update: {
          amount_raised_to_date?: string | null
          aum?: string | null
          completed_at?: string | null
          contact_information?: Json | null
          created_at?: string | null
          current_fund_status?: string | null
          diversity_metrics?: Json | null
          fund_name?: string
          fund_structure?: string | null
          fund_type?: string
          fundraising_target?: string | null
          historical_returns?: Json | null
          id?: string
          investment_instruments?: string[] | null
          investment_thesis?: string | null
          key_team_members?: Json | null
          legal_entity_name?: string | null
          notable_exits?: string | null
          number_of_investments?: number | null
          primary_investment_region?: string | null
          regional_allocation?: Json | null
          regulatory_jurisdiction?: string | null
          secondary_regions?: string[] | null
          sector_focus?: string[] | null
          social_media_links?: Json | null
          stage_focus?: string[] | null
          team_size?: number | null
          typical_check_size?: string | null
          typical_ownership_sought?: string | null
          updated_at?: string | null
          user_id?: string
          value_add_services?: string | null
          website?: string | null
          year_founded?: number | null
        }
        Relationships: []
      }
      membership_requests: {
        Row: {
          additional_comments: string | null
          applicant_name: string
          aum: string | null
          country_of_operation: string | null
          created_at: string | null
          email: string
          fund_vehicle_name: string | null
          fund_vehicle_type: string | null
          fundraising_status: string | null
          id: string
          investment_focus: string | null
          motivation: string | null
          notable_investments: string | null
          organization_name: string | null
          organization_website: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          team_overview: string | null
          user_id: string
          vehicle_name: string
          year_founded: number | null
        }
        Insert: {
          additional_comments?: string | null
          applicant_name?: string
          aum?: string | null
          country_of_operation?: string | null
          created_at?: string | null
          email: string
          fund_vehicle_name?: string | null
          fund_vehicle_type?: string | null
          fundraising_status?: string | null
          id?: string
          investment_focus?: string | null
          motivation?: string | null
          notable_investments?: string | null
          organization_name?: string | null
          organization_website?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          team_overview?: string | null
          user_id: string
          vehicle_name: string
          year_founded?: number | null
        }
        Update: {
          additional_comments?: string | null
          applicant_name?: string
          aum?: string | null
          country_of_operation?: string | null
          created_at?: string | null
          email?: string
          fund_vehicle_name?: string | null
          fund_vehicle_type?: string | null
          fundraising_status?: string | null
          id?: string
          investment_focus?: string | null
          motivation?: string | null
          notable_investments?: string | null
          organization_name?: string | null
          organization_website?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          team_overview?: string | null
          user_id?: string
          vehicle_name?: string
          year_founded?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          profile_picture_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          profile_picture_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          capital_raised_description: string
          completed_at: string | null
          created_at: string | null
          email: string
          expectations: string
          first_close_month_from: number | null
          first_close_month_to: number | null
          how_heard_about_network: string
          id: string
          information_sharing_topics: string[] | null
          legal_entity_month_from: number | null
          legal_entity_month_to: number | null
          location: string
          name: string
          portfolio_count: number
          role_job_title: string
          supporting_document_urls: string[] | null
          team_size_description: string
          thesis: string
          ticket_size: string
          updated_at: string | null
          user_id: string
          vehicle_name: string
          vehicle_type_other: string | null
          vehicle_website: string | null
          year: number
        }
        Insert: {
          capital_raised_description?: string
          completed_at?: string | null
          created_at?: string | null
          email?: string
          expectations?: string
          first_close_month_from?: number | null
          first_close_month_to?: number | null
          how_heard_about_network?: string
          id?: string
          information_sharing_topics?: string[] | null
          legal_entity_month_from?: number | null
          legal_entity_month_to?: number | null
          location?: string
          name?: string
          portfolio_count?: number
          role_job_title?: string
          supporting_document_urls?: string[] | null
          team_size_description?: string
          thesis?: string
          ticket_size?: string
          updated_at?: string | null
          user_id: string
          vehicle_name?: string
          vehicle_type_other?: string | null
          vehicle_website?: string | null
          year: number
        }
        Update: {
          capital_raised_description?: string
          completed_at?: string | null
          created_at?: string | null
          email?: string
          expectations?: string
          first_close_month_from?: number | null
          first_close_month_to?: number | null
          how_heard_about_network?: string
          id?: string
          information_sharing_topics?: string[] | null
          legal_entity_month_from?: number | null
          legal_entity_month_to?: number | null
          location?: string
          name?: string
          portfolio_count?: number
          role_job_title?: string
          supporting_document_urls?: string[] | null
          team_size_description?: string
          thesis?: string
          ticket_size?: string
          updated_at?: string | null
          user_id?: string
          vehicle_name?: string
          vehicle_type_other?: string | null
          vehicle_website?: string | null
          year?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          viewers_count: number
          members_count: number
          admins_count: number
          surveys_completed: number
          new_registrations_today: number
          active_users_today: number
        }[]
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "viewer" | "member" | "admin"
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
    Enums: {
      app_role: ["viewer", "member", "admin"],
    },
  },
} as const
