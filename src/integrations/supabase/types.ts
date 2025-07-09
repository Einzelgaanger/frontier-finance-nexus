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
      membership_requests: {
        Row: {
          created_at: string | null
          email: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
          vehicle_name: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
          vehicle_name: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
          vehicle_name?: string
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
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          capital_in_market: number | null
          capital_raised: number | null
          completed_at: string | null
          created_at: string | null
          current_status: string | null
          equity_investments_exited: number | null
          equity_investments_made: number | null
          expectations: string | null
          first_close_date_from: number | null
          first_close_date_to: number | null
          first_close_month_from: number | null
          first_close_month_to: number | null
          fund_stage: string[] | null
          how_heard_about_network: string | null
          id: string
          information_sharing: string | null
          investment_instruments_priority: Json | null
          legal_domicile: string[] | null
          legal_entity_date_from: number | null
          legal_entity_date_to: number | null
          legal_entity_month_from: number | null
          legal_entity_month_to: number | null
          markets_operated: Json | null
          sectors_allocation: Json | null
          self_liquidating_exited: number | null
          self_liquidating_made: number | null
          supporting_document_url: string | null
          target_capital: number | null
          target_return_max: number | null
          target_return_min: number | null
          team_description: string | null
          team_members: Json | null
          team_size_max: number | null
          team_size_min: number | null
          thesis: string | null
          ticket_description: string | null
          ticket_size_max: number | null
          ticket_size_min: number | null
          updated_at: string | null
          user_id: string
          vehicle_type: string | null
          vehicle_type_other: string | null
          vehicle_websites: string[] | null
          year: number
        }
        Insert: {
          capital_in_market?: number | null
          capital_raised?: number | null
          completed_at?: string | null
          created_at?: string | null
          current_status?: string | null
          equity_investments_exited?: number | null
          equity_investments_made?: number | null
          expectations?: string | null
          first_close_date_from?: number | null
          first_close_date_to?: number | null
          first_close_month_from?: number | null
          first_close_month_to?: number | null
          fund_stage?: string[] | null
          how_heard_about_network?: string | null
          id?: string
          information_sharing?: string | null
          investment_instruments_priority?: Json | null
          legal_domicile?: string[] | null
          legal_entity_date_from?: number | null
          legal_entity_date_to?: number | null
          legal_entity_month_from?: number | null
          legal_entity_month_to?: number | null
          markets_operated?: Json | null
          sectors_allocation?: Json | null
          self_liquidating_exited?: number | null
          self_liquidating_made?: number | null
          supporting_document_url?: string | null
          target_capital?: number | null
          target_return_max?: number | null
          target_return_min?: number | null
          team_description?: string | null
          team_members?: Json | null
          team_size_max?: number | null
          team_size_min?: number | null
          thesis?: string | null
          ticket_description?: string | null
          ticket_size_max?: number | null
          ticket_size_min?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_type?: string | null
          vehicle_type_other?: string | null
          vehicle_websites?: string[] | null
          year: number
        }
        Update: {
          capital_in_market?: number | null
          capital_raised?: number | null
          completed_at?: string | null
          created_at?: string | null
          current_status?: string | null
          equity_investments_exited?: number | null
          equity_investments_made?: number | null
          expectations?: string | null
          first_close_date_from?: number | null
          first_close_date_to?: number | null
          first_close_month_from?: number | null
          first_close_month_to?: number | null
          fund_stage?: string[] | null
          how_heard_about_network?: string | null
          id?: string
          information_sharing?: string | null
          investment_instruments_priority?: Json | null
          legal_domicile?: string[] | null
          legal_entity_date_from?: number | null
          legal_entity_date_to?: number | null
          legal_entity_month_from?: number | null
          legal_entity_month_to?: number | null
          markets_operated?: Json | null
          sectors_allocation?: Json | null
          self_liquidating_exited?: number | null
          self_liquidating_made?: number | null
          supporting_document_url?: string | null
          target_capital?: number | null
          target_return_max?: number | null
          target_return_min?: number | null
          team_description?: string | null
          team_members?: Json | null
          team_size_max?: number | null
          team_size_min?: number | null
          thesis?: string | null
          ticket_description?: string | null
          ticket_size_max?: number | null
          ticket_size_min?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_type?: string | null
          vehicle_type_other?: string | null
          vehicle_websites?: string[] | null
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
