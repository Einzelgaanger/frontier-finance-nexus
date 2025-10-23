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
      activity_log: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          points_earned: number
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: []
      }
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
      blog_comments: {
        Row: {
          blog_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_likes: {
        Row: {
          blog_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_blog_likes_blog"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          caption: string | null
          content: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          media_type: string | null
          media_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          caption?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          media_type?: string | null
          media_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          caption?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          media_type?: string | null
          media_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      field_visibility: {
        Row: {
          admin_visible: boolean | null
          created_at: string | null
          field_category: string
          field_name: string
          id: string
          member_visible: boolean | null
          survey_year: number | null
          table_name: string
          viewer_visible: boolean | null
        }
        Insert: {
          admin_visible?: boolean | null
          created_at?: string | null
          field_category: string
          field_name: string
          id?: string
          member_visible?: boolean | null
          survey_year?: number | null
          table_name: string
          viewer_visible?: boolean | null
        }
        Update: {
          admin_visible?: boolean | null
          created_at?: string | null
          field_category?: string
          field_name?: string
          id?: string
          member_visible?: boolean | null
          survey_year?: number | null
          table_name?: string
          viewer_visible?: boolean | null
        }
        Relationships: []
      }
      survey_responses_2021: {
        Row: {
          additional_comments: string | null
          business_model_targeted: string[] | null
          business_model_targeted_other: string | null
          business_stage_targeted: string[] | null
          business_stage_targeted_other: string | null
          carried_interest_principals: string | null
          communication_platform: string | null
          communication_platform_other: string | null
          completed_at: string | null
          convening_initiatives_other: string | null
          convening_initiatives_ranking: Json | null
          covid_government_support: string[] | null
          covid_government_support_other: string | null
          covid_impact_aggregate: string | null
          covid_impact_portfolio: Json | null
          created_at: string
          current_ftes: string | null
          current_fund_size: string | null
          email_address: string
          exits_achieved: string | null
          exits_achieved_other: string | null
          explicit_lens_focus: string[] | null
          explicit_lens_focus_other: string | null
          financing_needs: string[] | null
          financing_needs_other: string | null
          firm_name: string
          first_close_date: string | null
          first_investment_date: string | null
          form_data: Json | null
          fund_capabilities_other: string | null
          fund_capabilities_ranking: Json | null
          fund_stage: string | null
          fund_stage_other: string | null
          fund_vehicle_considerations: string[] | null
          fund_vehicle_considerations_other: string | null
          gender_considerations_investment: string[] | null
          gender_considerations_investment_other: string | null
          gender_considerations_requirement: string[] | null
          gender_considerations_requirement_other: string | null
          gender_fund_vehicle: string[] | null
          gender_fund_vehicle_other: string | null
          geographic_focus: string[] | null
          geographic_focus_other: string | null
          id: string
          impact_vs_financial_orientation: string | null
          impact_vs_financial_orientation_other: string | null
          investment_forms: string[] | null
          investment_forms_other: string | null
          investment_monetization: string[] | null
          investment_monetization_other: string | null
          investment_size_total_raise: string | null
          investment_size_your_amount: string | null
          investment_timeframe: string | null
          investment_timeframe_other: string | null
          investment_vehicle_type: string[] | null
          investment_vehicle_type_other: string | null
          investments_december_2020: string | null
          investments_march_2020: string | null
          legal_entity_date: string | null
          network_value_areas: Json | null
          network_value_rating: string | null
          new_webinar_suggestions: string | null
          new_working_group_suggestions: string | null
          optional_supplement: string | null
          other_sdgs: string[] | null
          participant_name: string
          participate_mentoring_program: string | null
          participate_mentoring_program_other: string | null
          portfolio_needs_other: string | null
          portfolio_needs_ranking: Json | null
          present_connection_session: string | null
          present_connection_session_other: string | null
          present_demystifying_session: string[] | null
          present_demystifying_session_other: string | null
          raising_capital_2021: string[] | null
          raising_capital_2021_other: string | null
          report_sustainable_development_goals: boolean | null
          role_title: string
          submission_status: string
          target_capital_sources: string[] | null
          target_capital_sources_other: string | null
          target_fund_size: string | null
          target_irr_achieved: string | null
          target_irr_targeted: string | null
          target_sectors: string[] | null
          target_sectors_other: string | null
          team_based: string[] | null
          team_based_other: string | null
          top_sdg_1: string | null
          top_sdg_2: string | null
          top_sdg_3: string | null
          top_sdgs: Json | null
          updated_at: string
          user_id: string
          webinar_content_ranking: Json | null
          working_groups_ranking: Json | null
        }
        Insert: {
          additional_comments?: string | null
          business_model_targeted?: string[] | null
          business_model_targeted_other?: string | null
          business_stage_targeted?: string[] | null
          business_stage_targeted_other?: string | null
          carried_interest_principals?: string | null
          communication_platform?: string | null
          communication_platform_other?: string | null
          completed_at?: string | null
          convening_initiatives_other?: string | null
          convening_initiatives_ranking?: Json | null
          covid_government_support?: string[] | null
          covid_government_support_other?: string | null
          covid_impact_aggregate?: string | null
          covid_impact_portfolio?: Json | null
          created_at?: string
          current_ftes?: string | null
          current_fund_size?: string | null
          email_address: string
          exits_achieved?: string | null
          exits_achieved_other?: string | null
          explicit_lens_focus?: string[] | null
          explicit_lens_focus_other?: string | null
          financing_needs?: string[] | null
          financing_needs_other?: string | null
          firm_name: string
          first_close_date?: string | null
          first_investment_date?: string | null
          form_data?: Json | null
          fund_capabilities_other?: string | null
          fund_capabilities_ranking?: Json | null
          fund_stage?: string | null
          fund_stage_other?: string | null
          fund_vehicle_considerations?: string[] | null
          fund_vehicle_considerations_other?: string | null
          gender_considerations_investment?: string[] | null
          gender_considerations_investment_other?: string | null
          gender_considerations_requirement?: string[] | null
          gender_considerations_requirement_other?: string | null
          gender_fund_vehicle?: string[] | null
          gender_fund_vehicle_other?: string | null
          geographic_focus?: string[] | null
          geographic_focus_other?: string | null
          id?: string
          impact_vs_financial_orientation?: string | null
          impact_vs_financial_orientation_other?: string | null
          investment_forms?: string[] | null
          investment_forms_other?: string | null
          investment_monetization?: string[] | null
          investment_monetization_other?: string | null
          investment_size_total_raise?: string | null
          investment_size_your_amount?: string | null
          investment_timeframe?: string | null
          investment_timeframe_other?: string | null
          investment_vehicle_type?: string[] | null
          investment_vehicle_type_other?: string | null
          investments_december_2020?: string | null
          investments_march_2020?: string | null
          legal_entity_date?: string | null
          network_value_areas?: Json | null
          network_value_rating?: string | null
          new_webinar_suggestions?: string | null
          new_working_group_suggestions?: string | null
          optional_supplement?: string | null
          other_sdgs?: string[] | null
          participant_name: string
          participate_mentoring_program?: string | null
          participate_mentoring_program_other?: string | null
          portfolio_needs_other?: string | null
          portfolio_needs_ranking?: Json | null
          present_connection_session?: string | null
          present_connection_session_other?: string | null
          present_demystifying_session?: string[] | null
          present_demystifying_session_other?: string | null
          raising_capital_2021?: string[] | null
          raising_capital_2021_other?: string | null
          report_sustainable_development_goals?: boolean | null
          role_title: string
          submission_status?: string
          target_capital_sources?: string[] | null
          target_capital_sources_other?: string | null
          target_fund_size?: string | null
          target_irr_achieved?: string | null
          target_irr_targeted?: string | null
          target_sectors?: string[] | null
          target_sectors_other?: string | null
          team_based?: string[] | null
          team_based_other?: string | null
          top_sdg_1?: string | null
          top_sdg_2?: string | null
          top_sdg_3?: string | null
          top_sdgs?: Json | null
          updated_at?: string
          user_id: string
          webinar_content_ranking?: Json | null
          working_groups_ranking?: Json | null
        }
        Update: {
          additional_comments?: string | null
          business_model_targeted?: string[] | null
          business_model_targeted_other?: string | null
          business_stage_targeted?: string[] | null
          business_stage_targeted_other?: string | null
          carried_interest_principals?: string | null
          communication_platform?: string | null
          communication_platform_other?: string | null
          completed_at?: string | null
          convening_initiatives_other?: string | null
          convening_initiatives_ranking?: Json | null
          covid_government_support?: string[] | null
          covid_government_support_other?: string | null
          covid_impact_aggregate?: string | null
          covid_impact_portfolio?: Json | null
          created_at?: string
          current_ftes?: string | null
          current_fund_size?: string | null
          email_address?: string
          exits_achieved?: string | null
          exits_achieved_other?: string | null
          explicit_lens_focus?: string[] | null
          explicit_lens_focus_other?: string | null
          financing_needs?: string[] | null
          financing_needs_other?: string | null
          firm_name?: string
          first_close_date?: string | null
          first_investment_date?: string | null
          form_data?: Json | null
          fund_capabilities_other?: string | null
          fund_capabilities_ranking?: Json | null
          fund_stage?: string | null
          fund_stage_other?: string | null
          fund_vehicle_considerations?: string[] | null
          fund_vehicle_considerations_other?: string | null
          gender_considerations_investment?: string[] | null
          gender_considerations_investment_other?: string | null
          gender_considerations_requirement?: string[] | null
          gender_considerations_requirement_other?: string | null
          gender_fund_vehicle?: string[] | null
          gender_fund_vehicle_other?: string | null
          geographic_focus?: string[] | null
          geographic_focus_other?: string | null
          id?: string
          impact_vs_financial_orientation?: string | null
          impact_vs_financial_orientation_other?: string | null
          investment_forms?: string[] | null
          investment_forms_other?: string | null
          investment_monetization?: string[] | null
          investment_monetization_other?: string | null
          investment_size_total_raise?: string | null
          investment_size_your_amount?: string | null
          investment_timeframe?: string | null
          investment_timeframe_other?: string | null
          investment_vehicle_type?: string[] | null
          investment_vehicle_type_other?: string | null
          investments_december_2020?: string | null
          investments_march_2020?: string | null
          legal_entity_date?: string | null
          network_value_areas?: Json | null
          network_value_rating?: string | null
          new_webinar_suggestions?: string | null
          new_working_group_suggestions?: string | null
          optional_supplement?: string | null
          other_sdgs?: string[] | null
          participant_name?: string
          participate_mentoring_program?: string | null
          participate_mentoring_program_other?: string | null
          portfolio_needs_other?: string | null
          portfolio_needs_ranking?: Json | null
          present_connection_session?: string | null
          present_connection_session_other?: string | null
          present_demystifying_session?: string[] | null
          present_demystifying_session_other?: string | null
          raising_capital_2021?: string[] | null
          raising_capital_2021_other?: string | null
          report_sustainable_development_goals?: boolean | null
          role_title?: string
          submission_status?: string
          target_capital_sources?: string[] | null
          target_capital_sources_other?: string | null
          target_fund_size?: string | null
          target_irr_achieved?: string | null
          target_irr_targeted?: string | null
          target_sectors?: string[] | null
          target_sectors_other?: string | null
          team_based?: string[] | null
          team_based_other?: string | null
          top_sdg_1?: string | null
          top_sdg_2?: string | null
          top_sdg_3?: string | null
          top_sdgs?: Json | null
          updated_at?: string
          user_id?: string
          webinar_content_ranking?: Json | null
          working_groups_ranking?: Json | null
        }
        Relationships: []
      }
      survey_responses_2022: {
        Row: {
          anticipated_exits_12_months: string | null
          average_investment_size_per_company: string | null
          business_stages: Json | null
          business_stages_other_description: string | null
          carried_interest_hurdle: string | null
          carried_interest_hurdle_other: string | null
          cash_flow_growth_next_12_months: number | null
          cash_flow_growth_recent_12_months: number | null
          completed_at: string | null
          concessionary_capital: string[] | null
          concessionary_capital_other: string | null
          created_at: string
          currency_investments: string | null
          currency_lp_commitments: string | null
          current_amount_invested: string | null
          current_ftes: string | null
          current_funds_raised: string | null
          debt_repayments_achieved: number | null
          direct_jobs_anticipated_change: number | null
          direct_jobs_created_cumulative: number | null
          domestic_factors_concerns: Json | null
          domestic_factors_concerns_other_description: string | null
          email: string
          enterprise_types: string[] | null
          equity_exits_achieved: number | null
          exits_experience: string | null
          financial_instruments: Json | null
          financial_instruments_other_description: string | null
          financing_needs: Json | null
          financing_needs_other_description: string | null
          first_close_date: string | null
          first_investment_date: string | null
          follow_on_permitted: string | null
          form_data: Json | null
          fund_operations: string | null
          fund_operations_other: string | null
          fund_priority_areas: Json | null
          fund_priority_areas_other_description: string | null
          fundraising_constraints: Json | null
          fundraising_constraints_other_description: string | null
          gender_lens_investing: Json | null
          gender_lens_investing_other_description: string | null
          gender_orientation: string[] | null
          gender_orientation_other: string | null
          geographic_focus: string | null
          geographic_markets: string[] | null
          geographic_markets_other: string | null
          gp_commitment: string | null
          gp_experience: Json | null
          gp_experience_other_description: string | null
          id: string
          indirect_jobs_anticipated_change: number | null
          indirect_jobs_created_cumulative: number | null
          international_factors_concerns: Json | null
          international_factors_concerns_other_description: string | null
          investment_monetization_exit_forms: string[] | null
          investment_monetization_exit_forms_other: string | null
          investment_size: string | null
          investment_stage: string | null
          investment_type: string | null
          investments_experience: string | null
          investments_made_to_date: number | null
          jobs_impact_other_description: string | null
          legal_domicile: string | null
          legal_domicile_other: string | null
          legal_entity_date: string | null
          lp_capital_sources: Json | null
          lp_capital_sources_other_description: string | null
          management_fee: string | null
          management_fee_other: string | null
          name: string
          organisation: string
          other_investments_supplement: string | null
          pipeline_sourcing: Json | null
          pipeline_sourcing_other_description: string | null
          portfolio_performance_other_description: string | null
          portfolio_value_creation_other_description: string | null
          portfolio_value_creation_priorities: Json | null
          principals_count: string | null
          receive_results: boolean | null
          revenue_growth_next_12_months: number | null
          revenue_growth_recent_12_months: number | null
          role_title: string
          sdg_targets: Json | null
          sector_activities: Json | null
          sector_activities_other_description: string | null
          sector_focus: string | null
          submission_status: string
          target_fund_size: string | null
          target_investments: string | null
          target_irr: string | null
          target_irr_other: string | null
          team_based: string[] | null
          team_based_other: string | null
          technology_role_investment_thesis: string | null
          typical_investment_timeframe: string | null
          updated_at: string
          user_id: string
          value_add_services: string | null
          ye2023_ftes: string | null
        }
        Insert: {
          anticipated_exits_12_months?: string | null
          average_investment_size_per_company?: string | null
          business_stages?: Json | null
          business_stages_other_description?: string | null
          carried_interest_hurdle?: string | null
          carried_interest_hurdle_other?: string | null
          cash_flow_growth_next_12_months?: number | null
          cash_flow_growth_recent_12_months?: number | null
          completed_at?: string | null
          concessionary_capital?: string[] | null
          concessionary_capital_other?: string | null
          created_at?: string
          currency_investments?: string | null
          currency_lp_commitments?: string | null
          current_amount_invested?: string | null
          current_ftes?: string | null
          current_funds_raised?: string | null
          debt_repayments_achieved?: number | null
          direct_jobs_anticipated_change?: number | null
          direct_jobs_created_cumulative?: number | null
          domestic_factors_concerns?: Json | null
          domestic_factors_concerns_other_description?: string | null
          email: string
          enterprise_types?: string[] | null
          equity_exits_achieved?: number | null
          exits_experience?: string | null
          financial_instruments?: Json | null
          financial_instruments_other_description?: string | null
          financing_needs?: Json | null
          financing_needs_other_description?: string | null
          first_close_date?: string | null
          first_investment_date?: string | null
          follow_on_permitted?: string | null
          form_data?: Json | null
          fund_operations?: string | null
          fund_operations_other?: string | null
          fund_priority_areas?: Json | null
          fund_priority_areas_other_description?: string | null
          fundraising_constraints?: Json | null
          fundraising_constraints_other_description?: string | null
          gender_lens_investing?: Json | null
          gender_lens_investing_other_description?: string | null
          gender_orientation?: string[] | null
          gender_orientation_other?: string | null
          geographic_focus?: string | null
          geographic_markets?: string[] | null
          geographic_markets_other?: string | null
          gp_commitment?: string | null
          gp_experience?: Json | null
          gp_experience_other_description?: string | null
          id?: string
          indirect_jobs_anticipated_change?: number | null
          indirect_jobs_created_cumulative?: number | null
          international_factors_concerns?: Json | null
          international_factors_concerns_other_description?: string | null
          investment_monetization_exit_forms?: string[] | null
          investment_monetization_exit_forms_other?: string | null
          investment_size?: string | null
          investment_stage?: string | null
          investment_type?: string | null
          investments_experience?: string | null
          investments_made_to_date?: number | null
          jobs_impact_other_description?: string | null
          legal_domicile?: string | null
          legal_domicile_other?: string | null
          legal_entity_date?: string | null
          lp_capital_sources?: Json | null
          lp_capital_sources_other_description?: string | null
          management_fee?: string | null
          management_fee_other?: string | null
          name: string
          organisation: string
          other_investments_supplement?: string | null
          pipeline_sourcing?: Json | null
          pipeline_sourcing_other_description?: string | null
          portfolio_performance_other_description?: string | null
          portfolio_value_creation_other_description?: string | null
          portfolio_value_creation_priorities?: Json | null
          principals_count?: string | null
          receive_results?: boolean | null
          revenue_growth_next_12_months?: number | null
          revenue_growth_recent_12_months?: number | null
          role_title: string
          sdg_targets?: Json | null
          sector_activities?: Json | null
          sector_activities_other_description?: string | null
          sector_focus?: string | null
          submission_status?: string
          target_fund_size?: string | null
          target_investments?: string | null
          target_irr?: string | null
          target_irr_other?: string | null
          team_based?: string[] | null
          team_based_other?: string | null
          technology_role_investment_thesis?: string | null
          typical_investment_timeframe?: string | null
          updated_at?: string
          user_id: string
          value_add_services?: string | null
          ye2023_ftes?: string | null
        }
        Update: {
          anticipated_exits_12_months?: string | null
          average_investment_size_per_company?: string | null
          business_stages?: Json | null
          business_stages_other_description?: string | null
          carried_interest_hurdle?: string | null
          carried_interest_hurdle_other?: string | null
          cash_flow_growth_next_12_months?: number | null
          cash_flow_growth_recent_12_months?: number | null
          completed_at?: string | null
          concessionary_capital?: string[] | null
          concessionary_capital_other?: string | null
          created_at?: string
          currency_investments?: string | null
          currency_lp_commitments?: string | null
          current_amount_invested?: string | null
          current_ftes?: string | null
          current_funds_raised?: string | null
          debt_repayments_achieved?: number | null
          direct_jobs_anticipated_change?: number | null
          direct_jobs_created_cumulative?: number | null
          domestic_factors_concerns?: Json | null
          domestic_factors_concerns_other_description?: string | null
          email?: string
          enterprise_types?: string[] | null
          equity_exits_achieved?: number | null
          exits_experience?: string | null
          financial_instruments?: Json | null
          financial_instruments_other_description?: string | null
          financing_needs?: Json | null
          financing_needs_other_description?: string | null
          first_close_date?: string | null
          first_investment_date?: string | null
          follow_on_permitted?: string | null
          form_data?: Json | null
          fund_operations?: string | null
          fund_operations_other?: string | null
          fund_priority_areas?: Json | null
          fund_priority_areas_other_description?: string | null
          fundraising_constraints?: Json | null
          fundraising_constraints_other_description?: string | null
          gender_lens_investing?: Json | null
          gender_lens_investing_other_description?: string | null
          gender_orientation?: string[] | null
          gender_orientation_other?: string | null
          geographic_focus?: string | null
          geographic_markets?: string[] | null
          geographic_markets_other?: string | null
          gp_commitment?: string | null
          gp_experience?: Json | null
          gp_experience_other_description?: string | null
          id?: string
          indirect_jobs_anticipated_change?: number | null
          indirect_jobs_created_cumulative?: number | null
          international_factors_concerns?: Json | null
          international_factors_concerns_other_description?: string | null
          investment_monetization_exit_forms?: string[] | null
          investment_monetization_exit_forms_other?: string | null
          investment_size?: string | null
          investment_stage?: string | null
          investment_type?: string | null
          investments_experience?: string | null
          investments_made_to_date?: number | null
          jobs_impact_other_description?: string | null
          legal_domicile?: string | null
          legal_domicile_other?: string | null
          legal_entity_date?: string | null
          lp_capital_sources?: Json | null
          lp_capital_sources_other_description?: string | null
          management_fee?: string | null
          management_fee_other?: string | null
          name?: string
          organisation?: string
          other_investments_supplement?: string | null
          pipeline_sourcing?: Json | null
          pipeline_sourcing_other_description?: string | null
          portfolio_performance_other_description?: string | null
          portfolio_value_creation_other_description?: string | null
          portfolio_value_creation_priorities?: Json | null
          principals_count?: string | null
          receive_results?: boolean | null
          revenue_growth_next_12_months?: number | null
          revenue_growth_recent_12_months?: number | null
          role_title?: string
          sdg_targets?: Json | null
          sector_activities?: Json | null
          sector_activities_other_description?: string | null
          sector_focus?: string | null
          submission_status?: string
          target_fund_size?: string | null
          target_investments?: string | null
          target_irr?: string | null
          target_irr_other?: string | null
          team_based?: string[] | null
          team_based_other?: string | null
          technology_role_investment_thesis?: string | null
          typical_investment_timeframe?: string | null
          updated_at?: string
          user_id?: string
          value_add_services?: string | null
          ye2023_ftes?: string | null
        }
        Relationships: []
      }
      survey_responses_2023: {
        Row: {
          average_investment_size: string | null
          average_investment_size_per_company: string | null
          business_development_approach: string[] | null
          business_development_approach_other: string | null
          business_development_support: string[] | null
          business_development_support_other: string | null
          business_stages: Json | null
          capital_raise_percentage: number | null
          cash_flow_growth_expected: number | null
          cash_flow_growth_historical: number | null
          completed_at: string | null
          concerns_ranking: Json | null
          concerns_ranking_other: string | null
          concessionary_capital: string[] | null
          concessionary_capital_other: string | null
          created_at: string
          currency_investments: string | null
          currency_lp_commitments: string | null
          current_amount_invested: number | null
          current_funds_raised: number | null
          debt_exits_anticipated: number | null
          email_address: string
          equity_exits_anticipated: number | null
          exit_form: string[] | null
          exit_form_other: string | null
          financial_instruments: Json | null
          financing_needs: Json | null
          first_close_achieved: string | null
          first_investment_achieved: string | null
          follow_on_investment_permitted: string | null
          form_data: Json | null
          fte_staff_2022: number | null
          fte_staff_2024_est: number | null
          fte_staff_current: number | null
          fund_name: string
          fund_priorities: Json | null
          fund_priorities_other_description: string | null
          fund_type_status: string | null
          fund_type_status_other: string | null
          fundraising_constraints: Json | null
          fundraising_constraints_other: string | null
          funds_raising_investing: string
          future_research_data: string[] | null
          future_research_data_other: string | null
          gender_inclusion: string[] | null
          gender_inclusion_other: string | null
          gender_lens_investing: Json | null
          gender_lens_investing_other: string | null
          geographic_markets: string[] | null
          geographic_markets_other: string | null
          gp_financial_commitment: string[] | null
          gp_financial_commitment_other: string | null
          gp_management_fee: string | null
          gp_management_fee_other: string | null
          growth_expectations: Json | null
          hurdle_rate_currency: string | null
          hurdle_rate_currency_other: string | null
          hurdle_rate_percentage: number | null
          id: string
          investment_timeframe: string | null
          jobs_impact: Json | null
          jobs_impact_expected_direct: number | null
          jobs_impact_expected_indirect: number | null
          jobs_impact_expected_other: string | null
          jobs_impact_historical_direct: number | null
          jobs_impact_historical_indirect: number | null
          jobs_impact_historical_other: string | null
          jobs_impact_other_description: string | null
          legal_domicile: string[] | null
          legal_domicile_other: string | null
          legal_entity_achieved: string | null
          lp_capital_sources_existing: Json | null
          lp_capital_sources_target: Json | null
          one_on_one_meeting: string | null
          organisation_name: string
          other_investments: string | null
          other_investments_description: string | null
          pipeline_sourcing: Json | null
          pipeline_sourcing_other: string | null
          portfolio_funding_mix: Json | null
          portfolio_funding_mix_other: string | null
          portfolio_performance: Json | null
          portfolio_performance_other_description: string | null
          portfolio_priorities: Json | null
          portfolio_priorities_other: string | null
          portfolio_value_creation_other: string | null
          portfolio_value_creation_priorities: Json | null
          principals_count: number | null
          receive_survey_results: boolean | null
          revenue_growth_expected: number | null
          revenue_growth_historical: number | null
          sdg_ranking: Json | null
          sector_focus: Json | null
          sector_focus_other: string | null
          submission_status: string
          sustainable_development_goals: string[] | null
          target_fund_size: number | null
          target_investments_count: number | null
          target_local_currency_return: number | null
          target_local_currency_return_methods: Json | null
          team_based: string[] | null
          team_based_other: string | null
          team_experience_exits: Json | null
          team_experience_investments: Json | null
          team_experience_other: string | null
          technical_assistance_funding: Json | null
          technical_assistance_funding_other: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_investment_size?: string | null
          average_investment_size_per_company?: string | null
          business_development_approach?: string[] | null
          business_development_approach_other?: string | null
          business_development_support?: string[] | null
          business_development_support_other?: string | null
          business_stages?: Json | null
          capital_raise_percentage?: number | null
          cash_flow_growth_expected?: number | null
          cash_flow_growth_historical?: number | null
          completed_at?: string | null
          concerns_ranking?: Json | null
          concerns_ranking_other?: string | null
          concessionary_capital?: string[] | null
          concessionary_capital_other?: string | null
          created_at?: string
          currency_investments?: string | null
          currency_lp_commitments?: string | null
          current_amount_invested?: number | null
          current_funds_raised?: number | null
          debt_exits_anticipated?: number | null
          email_address: string
          equity_exits_anticipated?: number | null
          exit_form?: string[] | null
          exit_form_other?: string | null
          financial_instruments?: Json | null
          financing_needs?: Json | null
          first_close_achieved?: string | null
          first_investment_achieved?: string | null
          follow_on_investment_permitted?: string | null
          form_data?: Json | null
          fte_staff_2022?: number | null
          fte_staff_2024_est?: number | null
          fte_staff_current?: number | null
          fund_name: string
          fund_priorities?: Json | null
          fund_priorities_other_description?: string | null
          fund_type_status?: string | null
          fund_type_status_other?: string | null
          fundraising_constraints?: Json | null
          fundraising_constraints_other?: string | null
          funds_raising_investing: string
          future_research_data?: string[] | null
          future_research_data_other?: string | null
          gender_inclusion?: string[] | null
          gender_inclusion_other?: string | null
          gender_lens_investing?: Json | null
          gender_lens_investing_other?: string | null
          geographic_markets?: string[] | null
          geographic_markets_other?: string | null
          gp_financial_commitment?: string[] | null
          gp_financial_commitment_other?: string | null
          gp_management_fee?: string | null
          gp_management_fee_other?: string | null
          growth_expectations?: Json | null
          hurdle_rate_currency?: string | null
          hurdle_rate_currency_other?: string | null
          hurdle_rate_percentage?: number | null
          id?: string
          investment_timeframe?: string | null
          jobs_impact?: Json | null
          jobs_impact_expected_direct?: number | null
          jobs_impact_expected_indirect?: number | null
          jobs_impact_expected_other?: string | null
          jobs_impact_historical_direct?: number | null
          jobs_impact_historical_indirect?: number | null
          jobs_impact_historical_other?: string | null
          jobs_impact_other_description?: string | null
          legal_domicile?: string[] | null
          legal_domicile_other?: string | null
          legal_entity_achieved?: string | null
          lp_capital_sources_existing?: Json | null
          lp_capital_sources_target?: Json | null
          one_on_one_meeting?: string | null
          organisation_name: string
          other_investments?: string | null
          other_investments_description?: string | null
          pipeline_sourcing?: Json | null
          pipeline_sourcing_other?: string | null
          portfolio_funding_mix?: Json | null
          portfolio_funding_mix_other?: string | null
          portfolio_performance?: Json | null
          portfolio_performance_other_description?: string | null
          portfolio_priorities?: Json | null
          portfolio_priorities_other?: string | null
          portfolio_value_creation_other?: string | null
          portfolio_value_creation_priorities?: Json | null
          principals_count?: number | null
          receive_survey_results?: boolean | null
          revenue_growth_expected?: number | null
          revenue_growth_historical?: number | null
          sdg_ranking?: Json | null
          sector_focus?: Json | null
          sector_focus_other?: string | null
          submission_status?: string
          sustainable_development_goals?: string[] | null
          target_fund_size?: number | null
          target_investments_count?: number | null
          target_local_currency_return?: number | null
          target_local_currency_return_methods?: Json | null
          team_based?: string[] | null
          team_based_other?: string | null
          team_experience_exits?: Json | null
          team_experience_investments?: Json | null
          team_experience_other?: string | null
          technical_assistance_funding?: Json | null
          technical_assistance_funding_other?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_investment_size?: string | null
          average_investment_size_per_company?: string | null
          business_development_approach?: string[] | null
          business_development_approach_other?: string | null
          business_development_support?: string[] | null
          business_development_support_other?: string | null
          business_stages?: Json | null
          capital_raise_percentage?: number | null
          cash_flow_growth_expected?: number | null
          cash_flow_growth_historical?: number | null
          completed_at?: string | null
          concerns_ranking?: Json | null
          concerns_ranking_other?: string | null
          concessionary_capital?: string[] | null
          concessionary_capital_other?: string | null
          created_at?: string
          currency_investments?: string | null
          currency_lp_commitments?: string | null
          current_amount_invested?: number | null
          current_funds_raised?: number | null
          debt_exits_anticipated?: number | null
          email_address?: string
          equity_exits_anticipated?: number | null
          exit_form?: string[] | null
          exit_form_other?: string | null
          financial_instruments?: Json | null
          financing_needs?: Json | null
          first_close_achieved?: string | null
          first_investment_achieved?: string | null
          follow_on_investment_permitted?: string | null
          form_data?: Json | null
          fte_staff_2022?: number | null
          fte_staff_2024_est?: number | null
          fte_staff_current?: number | null
          fund_name?: string
          fund_priorities?: Json | null
          fund_priorities_other_description?: string | null
          fund_type_status?: string | null
          fund_type_status_other?: string | null
          fundraising_constraints?: Json | null
          fundraising_constraints_other?: string | null
          funds_raising_investing?: string
          future_research_data?: string[] | null
          future_research_data_other?: string | null
          gender_inclusion?: string[] | null
          gender_inclusion_other?: string | null
          gender_lens_investing?: Json | null
          gender_lens_investing_other?: string | null
          geographic_markets?: string[] | null
          geographic_markets_other?: string | null
          gp_financial_commitment?: string[] | null
          gp_financial_commitment_other?: string | null
          gp_management_fee?: string | null
          gp_management_fee_other?: string | null
          growth_expectations?: Json | null
          hurdle_rate_currency?: string | null
          hurdle_rate_currency_other?: string | null
          hurdle_rate_percentage?: number | null
          id?: string
          investment_timeframe?: string | null
          jobs_impact?: Json | null
          jobs_impact_expected_direct?: number | null
          jobs_impact_expected_indirect?: number | null
          jobs_impact_expected_other?: string | null
          jobs_impact_historical_direct?: number | null
          jobs_impact_historical_indirect?: number | null
          jobs_impact_historical_other?: string | null
          jobs_impact_other_description?: string | null
          legal_domicile?: string[] | null
          legal_domicile_other?: string | null
          legal_entity_achieved?: string | null
          lp_capital_sources_existing?: Json | null
          lp_capital_sources_target?: Json | null
          one_on_one_meeting?: string | null
          organisation_name?: string
          other_investments?: string | null
          other_investments_description?: string | null
          pipeline_sourcing?: Json | null
          pipeline_sourcing_other?: string | null
          portfolio_funding_mix?: Json | null
          portfolio_funding_mix_other?: string | null
          portfolio_performance?: Json | null
          portfolio_performance_other_description?: string | null
          portfolio_priorities?: Json | null
          portfolio_priorities_other?: string | null
          portfolio_value_creation_other?: string | null
          portfolio_value_creation_priorities?: Json | null
          principals_count?: number | null
          receive_survey_results?: boolean | null
          revenue_growth_expected?: number | null
          revenue_growth_historical?: number | null
          sdg_ranking?: Json | null
          sector_focus?: Json | null
          sector_focus_other?: string | null
          submission_status?: string
          sustainable_development_goals?: string[] | null
          target_fund_size?: number | null
          target_investments_count?: number | null
          target_local_currency_return?: number | null
          target_local_currency_return_methods?: Json | null
          team_based?: string[] | null
          team_based_other?: string | null
          team_experience_exits?: Json | null
          team_experience_investments?: Json | null
          team_experience_other?: string | null
          technical_assistance_funding?: Json | null
          technical_assistance_funding_other?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      survey_responses_2024: {
        Row: {
          additional_sdgs: string | null
          amount_invested_2022: number | null
          amount_invested_current: number | null
          business_development_approach: string[] | null
          business_development_approach_other: string | null
          business_stages: Json | null
          completed_at: string | null
          concessionary_capital: string[] | null
          concessionary_capital_other: string | null
          created_at: string
          currency_hedging_details: string | null
          currency_hedging_strategy: string | null
          currency_investments: string | null
          currency_lp_commitments: string | null
          data_sharing_other: string | null
          data_sharing_willingness: string[] | null
          debt_investments_made: number | null
          debt_repayments_achieved: number | null
          debt_repayments_anticipated: number | null
          direct_jobs_anticipated: number | null
          direct_jobs_current: number | null
          domicile_reason: string[] | null
          domicile_reason_other: string | null
          email_address: string
          employment_impact_other_category: string | null
          employment_impact_other_description: string | null
          employment_impact_other_value: number | null
          equity_exits_achieved: number | null
          equity_exits_anticipated: number | null
          equity_investments_made: number | null
          existing_lp_sources: Json | null
          existing_lp_sources_other_description: string | null
          financial_instruments_ranking: Json | null
          financing_needs: Json | null
          first_close_achieved: string | null
          first_investment_achieved: string | null
          follow_on_permitted: string | null
          form_data: Json | null
          fte_staff_2023_actual: number | null
          fte_staff_2025_forecast: number | null
          fte_staff_current: number | null
          fund_name: string
          fund_priorities_next_12m: Json | null
          fund_priorities_other_category: string | null
          fund_priorities_other_description: string | null
          fund_type_status: string | null
          fund_type_status_other: string | null
          fundraising_barriers: Json | null
          fundraising_barriers_other_description: string | null
          funds_raising_investing: string
          gender_inclusion: string[] | null
          gender_inclusion_other: string | null
          gender_lens_investing: Json | null
          geographic_markets: string[] | null
          geographic_markets_other: string | null
          gp_financial_commitment: string[] | null
          gp_financial_commitment_other: string | null
          gp_management_fee: string | null
          gp_management_fee_other: string | null
          hard_commitments_2022: number | null
          hard_commitments_current: number | null
          hurdle_rate_currency: string | null
          hurdle_rate_currency_other: string | null
          hurdle_rate_percentage: number | null
          id: string
          indirect_jobs_anticipated: number | null
          indirect_jobs_current: number | null
          investment_approval: string[] | null
          investment_approval_other: string | null
          investment_considerations: Json | null
          investment_considerations_other: string | null
          investment_monetisation_forms: string[] | null
          investment_monetisation_other: string | null
          investment_networks: string[] | null
          investment_networks_other: string | null
          legal_domicile: string[] | null
          legal_domicile_other: string | null
          legal_entity_achieved: string | null
          organisation_name: string
          other_investments_supplement: string | null
          pipeline_sources_quality: Json | null
          pipeline_sources_quality_other_description: string | null
          pipeline_sources_quality_other_score: number | null
          portfolio_cashflow_growth_12m: number | null
          portfolio_cashflow_growth_next_12m: number | null
          portfolio_performance_other_category: string | null
          portfolio_performance_other_description: string | null
          portfolio_performance_other_value: number | null
          portfolio_revenue_growth_12m: number | null
          portfolio_revenue_growth_next_12m: number | null
          post_investment_priorities: Json | null
          post_investment_priorities_other_description: string | null
          post_investment_priorities_other_score: number | null
          principals_total: number | null
          principals_women: number | null
          receive_results: boolean | null
          regulatory_impact: Json | null
          regulatory_impact_other: string | null
          revenue_growth_mix: Json | null
          sector_target_allocation: Json | null
          sgb_financing_trends: Json | null
          submission_status: string
          survey_sender: string | null
          target_fund_size_2022: number | null
          target_fund_size_current: number | null
          target_lp_sources: Json | null
          target_lp_sources_other_description: string | null
          target_number_investments: number | null
          target_return_above_govt_debt: number | null
          team_based: string[] | null
          team_based_other: string | null
          team_experience_exits: Json | null
          team_experience_investments: Json | null
          technical_assistance_funding: Json | null
          top_sdgs: string[] | null
          typical_investment_size: string | null
          typical_investment_timeframe: string | null
          unique_offerings: Json | null
          unique_offerings_other_description: string | null
          unique_offerings_other_score: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_sdgs?: string | null
          amount_invested_2022?: number | null
          amount_invested_current?: number | null
          business_development_approach?: string[] | null
          business_development_approach_other?: string | null
          business_stages?: Json | null
          completed_at?: string | null
          concessionary_capital?: string[] | null
          concessionary_capital_other?: string | null
          created_at?: string
          currency_hedging_details?: string | null
          currency_hedging_strategy?: string | null
          currency_investments?: string | null
          currency_lp_commitments?: string | null
          data_sharing_other?: string | null
          data_sharing_willingness?: string[] | null
          debt_investments_made?: number | null
          debt_repayments_achieved?: number | null
          debt_repayments_anticipated?: number | null
          direct_jobs_anticipated?: number | null
          direct_jobs_current?: number | null
          domicile_reason?: string[] | null
          domicile_reason_other?: string | null
          email_address: string
          employment_impact_other_category?: string | null
          employment_impact_other_description?: string | null
          employment_impact_other_value?: number | null
          equity_exits_achieved?: number | null
          equity_exits_anticipated?: number | null
          equity_investments_made?: number | null
          existing_lp_sources?: Json | null
          existing_lp_sources_other_description?: string | null
          financial_instruments_ranking?: Json | null
          financing_needs?: Json | null
          first_close_achieved?: string | null
          first_investment_achieved?: string | null
          follow_on_permitted?: string | null
          form_data?: Json | null
          fte_staff_2023_actual?: number | null
          fte_staff_2025_forecast?: number | null
          fte_staff_current?: number | null
          fund_name: string
          fund_priorities_next_12m?: Json | null
          fund_priorities_other_category?: string | null
          fund_priorities_other_description?: string | null
          fund_type_status?: string | null
          fund_type_status_other?: string | null
          fundraising_barriers?: Json | null
          fundraising_barriers_other_description?: string | null
          funds_raising_investing: string
          gender_inclusion?: string[] | null
          gender_inclusion_other?: string | null
          gender_lens_investing?: Json | null
          geographic_markets?: string[] | null
          geographic_markets_other?: string | null
          gp_financial_commitment?: string[] | null
          gp_financial_commitment_other?: string | null
          gp_management_fee?: string | null
          gp_management_fee_other?: string | null
          hard_commitments_2022?: number | null
          hard_commitments_current?: number | null
          hurdle_rate_currency?: string | null
          hurdle_rate_currency_other?: string | null
          hurdle_rate_percentage?: number | null
          id?: string
          indirect_jobs_anticipated?: number | null
          indirect_jobs_current?: number | null
          investment_approval?: string[] | null
          investment_approval_other?: string | null
          investment_considerations?: Json | null
          investment_considerations_other?: string | null
          investment_monetisation_forms?: string[] | null
          investment_monetisation_other?: string | null
          investment_networks?: string[] | null
          investment_networks_other?: string | null
          legal_domicile?: string[] | null
          legal_domicile_other?: string | null
          legal_entity_achieved?: string | null
          organisation_name: string
          other_investments_supplement?: string | null
          pipeline_sources_quality?: Json | null
          pipeline_sources_quality_other_description?: string | null
          pipeline_sources_quality_other_score?: number | null
          portfolio_cashflow_growth_12m?: number | null
          portfolio_cashflow_growth_next_12m?: number | null
          portfolio_performance_other_category?: string | null
          portfolio_performance_other_description?: string | null
          portfolio_performance_other_value?: number | null
          portfolio_revenue_growth_12m?: number | null
          portfolio_revenue_growth_next_12m?: number | null
          post_investment_priorities?: Json | null
          post_investment_priorities_other_description?: string | null
          post_investment_priorities_other_score?: number | null
          principals_total?: number | null
          principals_women?: number | null
          receive_results?: boolean | null
          regulatory_impact?: Json | null
          regulatory_impact_other?: string | null
          revenue_growth_mix?: Json | null
          sector_target_allocation?: Json | null
          sgb_financing_trends?: Json | null
          submission_status?: string
          survey_sender?: string | null
          target_fund_size_2022?: number | null
          target_fund_size_current?: number | null
          target_lp_sources?: Json | null
          target_lp_sources_other_description?: string | null
          target_number_investments?: number | null
          target_return_above_govt_debt?: number | null
          team_based?: string[] | null
          team_based_other?: string | null
          team_experience_exits?: Json | null
          team_experience_investments?: Json | null
          technical_assistance_funding?: Json | null
          top_sdgs?: string[] | null
          typical_investment_size?: string | null
          typical_investment_timeframe?: string | null
          unique_offerings?: Json | null
          unique_offerings_other_description?: string | null
          unique_offerings_other_score?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_sdgs?: string | null
          amount_invested_2022?: number | null
          amount_invested_current?: number | null
          business_development_approach?: string[] | null
          business_development_approach_other?: string | null
          business_stages?: Json | null
          completed_at?: string | null
          concessionary_capital?: string[] | null
          concessionary_capital_other?: string | null
          created_at?: string
          currency_hedging_details?: string | null
          currency_hedging_strategy?: string | null
          currency_investments?: string | null
          currency_lp_commitments?: string | null
          data_sharing_other?: string | null
          data_sharing_willingness?: string[] | null
          debt_investments_made?: number | null
          debt_repayments_achieved?: number | null
          debt_repayments_anticipated?: number | null
          direct_jobs_anticipated?: number | null
          direct_jobs_current?: number | null
          domicile_reason?: string[] | null
          domicile_reason_other?: string | null
          email_address?: string
          employment_impact_other_category?: string | null
          employment_impact_other_description?: string | null
          employment_impact_other_value?: number | null
          equity_exits_achieved?: number | null
          equity_exits_anticipated?: number | null
          equity_investments_made?: number | null
          existing_lp_sources?: Json | null
          existing_lp_sources_other_description?: string | null
          financial_instruments_ranking?: Json | null
          financing_needs?: Json | null
          first_close_achieved?: string | null
          first_investment_achieved?: string | null
          follow_on_permitted?: string | null
          form_data?: Json | null
          fte_staff_2023_actual?: number | null
          fte_staff_2025_forecast?: number | null
          fte_staff_current?: number | null
          fund_name?: string
          fund_priorities_next_12m?: Json | null
          fund_priorities_other_category?: string | null
          fund_priorities_other_description?: string | null
          fund_type_status?: string | null
          fund_type_status_other?: string | null
          fundraising_barriers?: Json | null
          fundraising_barriers_other_description?: string | null
          funds_raising_investing?: string
          gender_inclusion?: string[] | null
          gender_inclusion_other?: string | null
          gender_lens_investing?: Json | null
          geographic_markets?: string[] | null
          geographic_markets_other?: string | null
          gp_financial_commitment?: string[] | null
          gp_financial_commitment_other?: string | null
          gp_management_fee?: string | null
          gp_management_fee_other?: string | null
          hard_commitments_2022?: number | null
          hard_commitments_current?: number | null
          hurdle_rate_currency?: string | null
          hurdle_rate_currency_other?: string | null
          hurdle_rate_percentage?: number | null
          id?: string
          indirect_jobs_anticipated?: number | null
          indirect_jobs_current?: number | null
          investment_approval?: string[] | null
          investment_approval_other?: string | null
          investment_considerations?: Json | null
          investment_considerations_other?: string | null
          investment_monetisation_forms?: string[] | null
          investment_monetisation_other?: string | null
          investment_networks?: string[] | null
          investment_networks_other?: string | null
          legal_domicile?: string[] | null
          legal_domicile_other?: string | null
          legal_entity_achieved?: string | null
          organisation_name?: string
          other_investments_supplement?: string | null
          pipeline_sources_quality?: Json | null
          pipeline_sources_quality_other_description?: string | null
          pipeline_sources_quality_other_score?: number | null
          portfolio_cashflow_growth_12m?: number | null
          portfolio_cashflow_growth_next_12m?: number | null
          portfolio_performance_other_category?: string | null
          portfolio_performance_other_description?: string | null
          portfolio_performance_other_value?: number | null
          portfolio_revenue_growth_12m?: number | null
          portfolio_revenue_growth_next_12m?: number | null
          post_investment_priorities?: Json | null
          post_investment_priorities_other_description?: string | null
          post_investment_priorities_other_score?: number | null
          principals_total?: number | null
          principals_women?: number | null
          receive_results?: boolean | null
          regulatory_impact?: Json | null
          regulatory_impact_other?: string | null
          revenue_growth_mix?: Json | null
          sector_target_allocation?: Json | null
          sgb_financing_trends?: Json | null
          submission_status?: string
          survey_sender?: string | null
          target_fund_size_2022?: number | null
          target_fund_size_current?: number | null
          target_lp_sources?: Json | null
          target_lp_sources_other_description?: string | null
          target_number_investments?: number | null
          target_return_above_govt_debt?: number | null
          team_based?: string[] | null
          team_based_other?: string | null
          team_experience_exits?: Json | null
          team_experience_investments?: Json | null
          technical_assistance_funding?: Json | null
          top_sdgs?: string[] | null
          typical_investment_size?: string | null
          typical_investment_timeframe?: string | null
          unique_offerings?: Json | null
          unique_offerings_other_description?: string | null
          unique_offerings_other_score?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          ai_usage_count: number | null
          blog_posts_count: number | null
          created_at: string | null
          id: string
          last_login_date: string | null
          login_streak: number | null
          total_points: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_usage_count?: number | null
          blog_posts_count?: number | null
          created_at?: string | null
          id?: string
          last_login_date?: string | null
          login_streak?: number | null
          total_points?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_usage_count?: number | null
          blog_posts_count?: number | null
          created_at?: string | null
          id?: string
          last_login_date?: string | null
          login_streak?: number | null
          total_points?: number | null
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
          description: string | null
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
          website: string | null
        }
        Insert: {
          company_id?: string | null
          company_name: string
          created_at?: string | null
          description?: string | null
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
          website?: string | null
        }
        Update: {
          company_id?: string | null
          company_name?: string
          created_at?: string | null
          description?: string | null
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
          website?: string | null
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
      award_points: {
        Args: {
          p_activity_type: string
          p_description?: string
          p_points: number
          p_user_id: string
        }
        Returns: undefined
      }
      get_user_role: { Args: { _user_id: string }; Returns: string }
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
