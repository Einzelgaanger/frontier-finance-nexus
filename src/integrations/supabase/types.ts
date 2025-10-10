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
          role_badge: string | null
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
          role_badge?: string | null
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
          role_badge?: string | null
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
          capital_raised: string | null
          country_of_operation: string | null
          created_at: string | null
          domicile_country: string | null
          email: string
          expectations: string | null
          fund_vehicle_name: string | null
          fund_vehicle_type: string | null
          fundraising_status: string | null
          how_heard_about_network: string | null
          id: string
          information_sharing: Json | null
          investment_focus: string | null
          location: string | null
          motivation: string | null
          notable_investments: string | null
          organization_name: string | null
          organization_website: string | null
          portfolio_investments: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role_job_title: string | null
          status: string
          supporting_documents: string | null
          team_overview: string | null
          team_size: string | null
          thesis: string | null
          ticket_size: string | null
          user_id: string
          vehicle_name: string
          vehicle_website: string | null
          year_founded: number | null
        }
        Insert: {
          additional_comments?: string | null
          applicant_name?: string
          aum?: string | null
          capital_raised?: string | null
          country_of_operation?: string | null
          created_at?: string | null
          domicile_country?: string | null
          email: string
          expectations?: string | null
          fund_vehicle_name?: string | null
          fund_vehicle_type?: string | null
          fundraising_status?: string | null
          how_heard_about_network?: string | null
          id?: string
          information_sharing?: Json | null
          investment_focus?: string | null
          location?: string | null
          motivation?: string | null
          notable_investments?: string | null
          organization_name?: string | null
          organization_website?: string | null
          portfolio_investments?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_job_title?: string | null
          status?: string
          supporting_documents?: string | null
          team_overview?: string | null
          team_size?: string | null
          thesis?: string | null
          ticket_size?: string | null
          user_id: string
          vehicle_name: string
          vehicle_website?: string | null
          year_founded?: number | null
        }
        Update: {
          additional_comments?: string | null
          applicant_name?: string
          aum?: string | null
          capital_raised?: string | null
          country_of_operation?: string | null
          created_at?: string | null
          domicile_country?: string | null
          email?: string
          expectations?: string | null
          fund_vehicle_name?: string | null
          fund_vehicle_type?: string | null
          fundraising_status?: string | null
          how_heard_about_network?: string | null
          id?: string
          information_sharing?: Json | null
          investment_focus?: string | null
          location?: string | null
          motivation?: string | null
          notable_investments?: string | null
          organization_name?: string | null
          organization_website?: string | null
          portfolio_investments?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_job_title?: string | null
          status?: string
          supporting_documents?: string | null
          team_overview?: string | null
          team_size?: string | null
          thesis?: string | null
          ticket_size?: string | null
          user_id?: string
          vehicle_name?: string
          vehicle_website?: string | null
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
          capital_in_market: number | null
          capital_raised: number | null
          capital_raised_description: string
          completed_at: string | null
          created_at: string | null
          current_status: string | null
          current_status_other: string | null
          email: string
          equity_investments_exited: number | null
          equity_investments_made: number | null
          expectations: string
          first_close_date_from: number | null
          first_close_date_to: number | null
          first_close_month_from: number | null
          first_close_month_to: number | null
          fund_stage: string[] | null
          how_heard_about_network: string
          how_heard_about_network_other: string | null
          id: string
          information_sharing_topics: string[] | null
          investment_instruments_data: Json | null
          investment_instruments_priority: Json | null
          legal_domicile: string[] | null
          legal_domicile_other: string | null
          legal_entity_date_from: number | null
          legal_entity_date_to: number | null
          legal_entity_month_from: number | null
          legal_entity_month_to: number | null
          location: string
          markets_operated: Json | null
          markets_operated_other: string | null
          name: string
          portfolio_count: number
          role_badge: string | null
          role_job_title: string
          sectors_allocation: Json | null
          self_liquidating_exited: number | null
          self_liquidating_made: number | null
          supporting_document_url: string | null
          supporting_document_urls: string[] | null
          target_capital: number | null
          target_return_max: number | null
          target_return_min: number | null
          team_description: string | null
          team_members: Json | null
          team_size_description: string
          team_size_max: number | null
          team_size_min: number | null
          thesis: string
          ticket_description: string | null
          ticket_size: string
          ticket_size_max: number | null
          ticket_size_min: number | null
          updated_at: string | null
          user_id: string
          vehicle_name: string
          vehicle_type: string | null
          vehicle_type_other: string | null
          vehicle_website: string | null
          vehicle_websites: string[] | null
          year: number
        }
        Insert: {
          capital_in_market?: number | null
          capital_raised?: number | null
          capital_raised_description?: string
          completed_at?: string | null
          created_at?: string | null
          current_status?: string | null
          current_status_other?: string | null
          email?: string
          equity_investments_exited?: number | null
          equity_investments_made?: number | null
          expectations?: string
          first_close_date_from?: number | null
          first_close_date_to?: number | null
          first_close_month_from?: number | null
          first_close_month_to?: number | null
          fund_stage?: string[] | null
          how_heard_about_network?: string
          how_heard_about_network_other?: string | null
          id?: string
          information_sharing_topics?: string[] | null
          investment_instruments_data?: Json | null
          investment_instruments_priority?: Json | null
          legal_domicile?: string[] | null
          legal_domicile_other?: string | null
          legal_entity_date_from?: number | null
          legal_entity_date_to?: number | null
          legal_entity_month_from?: number | null
          legal_entity_month_to?: number | null
          location?: string
          markets_operated?: Json | null
          markets_operated_other?: string | null
          name?: string
          portfolio_count?: number
          role_badge?: string | null
          role_job_title?: string
          sectors_allocation?: Json | null
          self_liquidating_exited?: number | null
          self_liquidating_made?: number | null
          supporting_document_url?: string | null
          supporting_document_urls?: string[] | null
          target_capital?: number | null
          target_return_max?: number | null
          target_return_min?: number | null
          team_description?: string | null
          team_members?: Json | null
          team_size_description?: string
          team_size_max?: number | null
          team_size_min?: number | null
          thesis?: string
          ticket_description?: string | null
          ticket_size?: string
          ticket_size_max?: number | null
          ticket_size_min?: number | null
          updated_at?: string | null
          user_id: string
          vehicle_name?: string
          vehicle_type?: string | null
          vehicle_type_other?: string | null
          vehicle_website?: string | null
          vehicle_websites?: string[] | null
          year: number
        }
        Update: {
          capital_in_market?: number | null
          capital_raised?: number | null
          capital_raised_description?: string
          completed_at?: string | null
          created_at?: string | null
          current_status?: string | null
          current_status_other?: string | null
          email?: string
          equity_investments_exited?: number | null
          equity_investments_made?: number | null
          expectations?: string
          first_close_date_from?: number | null
          first_close_date_to?: number | null
          first_close_month_from?: number | null
          first_close_month_to?: number | null
          fund_stage?: string[] | null
          how_heard_about_network?: string
          how_heard_about_network_other?: string | null
          id?: string
          information_sharing_topics?: string[] | null
          investment_instruments_data?: Json | null
          investment_instruments_priority?: Json | null
          legal_domicile?: string[] | null
          legal_domicile_other?: string | null
          legal_entity_date_from?: number | null
          legal_entity_date_to?: number | null
          legal_entity_month_from?: number | null
          legal_entity_month_to?: number | null
          location?: string
          markets_operated?: Json | null
          markets_operated_other?: string | null
          name?: string
          portfolio_count?: number
          role_badge?: string | null
          role_job_title?: string
          sectors_allocation?: Json | null
          self_liquidating_exited?: number | null
          self_liquidating_made?: number | null
          supporting_document_url?: string | null
          supporting_document_urls?: string[] | null
          target_capital?: number | null
          target_return_max?: number | null
          target_return_min?: number | null
          team_description?: string | null
          team_members?: Json | null
          team_size_description?: string
          team_size_max?: number | null
          team_size_min?: number | null
          thesis?: string
          ticket_description?: string | null
          ticket_size?: string
          ticket_size_max?: number | null
          ticket_size_min?: number | null
          updated_at?: string | null
          user_id?: string
          vehicle_name?: string
          vehicle_type?: string | null
          vehicle_type_other?: string | null
          vehicle_website?: string | null
          vehicle_websites?: string[] | null
          year?: number
        }
        Relationships: []
      }
      survey_2021_responses: {
        Row: {
          additional_comments: string | null
          business_model_targeted: string[]
          business_stage_targeted: string[]
          carried_interest_principals: string
          communication_platform: string
          completed_at: string | null
          convening_initiatives_ranking: Json
          covid_government_support: string[]
          covid_impact_aggregate: string
          covid_impact_portfolio: Json
          created_at: string | null
          current_ftes: string
          current_fund_size: string
          exits_achieved: string
          explicit_lens_focus: string[]
          financing_needs: string[]
          firm_name: string
          first_close_date: string
          first_investment_date: string
          fund_capabilities_ranking: Json
          fund_stage: string
          fund_vehicle_considerations: string[]
          gender_considerations_investment: string[]
          gender_considerations_requirement: string[]
          gender_fund_vehicle: string[]
          geographic_focus: string[]
          id: string
          impact_vs_financial_orientation: string
          investment_forms: string[]
          investment_monetization: string[]
          investment_size_total_raise: string
          investment_size_your_amount: string
          investment_timeframe: string
          investment_vehicle_type: string[]
          investments_december_2020: string
          investments_march_2020: string
          legal_entity_date: string
          network_value_areas: Json
          network_value_rating: string
          new_webinar_suggestions: string | null
          new_working_group_suggestions: string | null
          optional_supplement: string | null
          participant_name: string
          participate_mentoring_program: string | null
          portfolio_needs_ranking: Json
          present_connection_session: boolean
          present_demystifying_session: string[]
          raising_capital_2021: string[]
          report_sustainable_development_goals: boolean
          role_title: string
          target_capital_sources: string[]
          target_fund_size: string
          target_irr_achieved: string
          target_irr_targeted: string
          target_sectors: string[]
          team_based: string[]
          top_sdg_1: string | null
          top_sdg_2: string | null
          top_sdg_3: string | null
          updated_at: string | null
          user_id: string | null
          webinar_content_ranking: Json
          working_groups_ranking: Json
        }
        Insert: {
          additional_comments?: string | null
          business_model_targeted: string[]
          business_stage_targeted: string[]
          carried_interest_principals: string
          communication_platform: string
          completed_at?: string | null
          convening_initiatives_ranking: Json
          covid_government_support: string[]
          covid_impact_aggregate: string
          covid_impact_portfolio: Json
          created_at?: string | null
          current_ftes: string
          current_fund_size: string
          exits_achieved: string
          explicit_lens_focus: string[]
          financing_needs: string[]
          firm_name: string
          first_close_date: string
          first_investment_date: string
          fund_capabilities_ranking: Json
          fund_stage: string
          fund_vehicle_considerations: string[]
          gender_considerations_investment: string[]
          gender_considerations_requirement: string[]
          gender_fund_vehicle: string[]
          geographic_focus: string[]
          id?: string
          impact_vs_financial_orientation: string
          investment_forms: string[]
          investment_monetization: string[]
          investment_size_total_raise: string
          investment_size_your_amount: string
          investment_timeframe: string
          investment_vehicle_type: string[]
          investments_december_2020: string
          investments_march_2020: string
          legal_entity_date: string
          network_value_areas: Json
          network_value_rating: string
          new_webinar_suggestions?: string | null
          new_working_group_suggestions?: string | null
          optional_supplement?: string | null
          participant_name: string
          participate_mentoring_program?: string | null
          portfolio_needs_ranking: Json
          present_connection_session: boolean
          present_demystifying_session: string[]
          raising_capital_2021: string[]
          report_sustainable_development_goals: boolean
          role_title: string
          target_capital_sources: string[]
          target_fund_size: string
          target_irr_achieved: string
          target_irr_targeted: string
          target_sectors: string[]
          team_based: string[]
          top_sdg_1?: string | null
          top_sdg_2?: string | null
          top_sdg_3?: string | null
          updated_at?: string | null
          user_id?: string | null
          webinar_content_ranking: Json
          working_groups_ranking: Json
        }
        Update: {
          additional_comments?: string | null
          business_model_targeted?: string[]
          business_stage_targeted?: string[]
          carried_interest_principals?: string
          communication_platform?: string
          completed_at?: string | null
          convening_initiatives_ranking?: Json
          covid_government_support?: string[]
          covid_impact_aggregate?: string
          covid_impact_portfolio?: Json
          created_at?: string | null
          current_ftes?: string
          current_fund_size?: string
          exits_achieved?: string
          explicit_lens_focus?: string[]
          financing_needs?: string[]
          firm_name?: string
          first_close_date?: string
          first_investment_date?: string
          fund_capabilities_ranking?: Json
          fund_stage?: string
          fund_vehicle_considerations?: string[]
          gender_considerations_investment?: string[]
          gender_considerations_requirement?: string[]
          gender_fund_vehicle?: string[]
          geographic_focus?: string[]
          id?: string
          impact_vs_financial_orientation?: string
          investment_forms?: string[]
          investment_monetization?: string[]
          investment_size_total_raise?: string
          investment_size_your_amount?: string
          investment_timeframe?: string
          investment_vehicle_type?: string[]
          investments_december_2020?: string
          investments_march_2020?: string
          legal_entity_date?: string
          network_value_areas?: Json
          network_value_rating?: string
          new_webinar_suggestions?: string | null
          new_working_group_suggestions?: string | null
          optional_supplement?: string | null
          participant_name?: string
          participate_mentoring_program?: string | null
          portfolio_needs_ranking?: Json
          present_connection_session?: boolean
          present_demystifying_session?: string[]
          raising_capital_2021?: string[]
          report_sustainable_development_goals?: boolean
          role_title?: string
          target_capital_sources?: string[]
          target_fund_size?: string
          target_irr_achieved?: string
          target_irr_targeted?: string
          target_sectors?: string[]
          team_based?: string[]
          top_sdg_1?: string | null
          top_sdg_2?: string | null
          top_sdg_3?: string | null
          updated_at?: string | null
          user_id?: string | null
          webinar_content_ranking?: Json
          working_groups_ranking?: Json
        }
        Relationships: []
      }
      survey_2023_responses: {
        Row: {
          additional_comments: string | null
          briefing_acknowledged: boolean
          business_model_targeted: string[]
          business_model_targeted_other: string | null
          capital_construct: string
          capital_construct_other: string | null
          completed_at: string | null
          convening_initiatives_other: string | null
          convening_initiatives_ranking: Json
          covid_adaptations: string[]
          covid_adaptations_other: string | null
          covid_impact_portfolio: string
          covid_impact_portfolio_other: string | null
          covid_impact_vehicle: string
          covid_impact_vehicle_other: string | null
          created_at: string
          deal_flow_sources: string[]
          deal_flow_sources_other: string | null
          exit_strategies: string[]
          exit_strategies_other: string | null
          firm_name: string
          fund_stage: string
          fund_stage_other: string | null
          geographic_focus: string[]
          geographic_focus_other: string | null
          id: string
          investment_committee: string
          investment_committee_other: string | null
          investment_criteria: string[]
          investment_criteria_other: string | null
          investment_process: string
          investment_process_other: string | null
          investment_thesis: string
          investment_thesis_other: string | null
          investment_vehicle_type: string[]
          investment_vehicle_type_other: string | null
          network_engagement_level: string
          network_engagement_level_other: string | null
          network_value_areas: Json
          participate_mentoring_program: string
          participate_mentoring_program_other: string | null
          portfolio_development_stage: string
          portfolio_development_stage_other: string | null
          portfolio_size: string
          portfolio_size_other: string | null
          present_connection_session: boolean | null
          present_demystifying_session: string[]
          present_demystifying_session_other: string | null
          return_expectations: string
          return_expectations_other: string | null
          role_title: string
          target_sectors: string[]
          target_sectors_other: string | null
          team_based: string[]
          team_based_other: string | null
          team_expertise: string[]
          team_expertise_other: string | null
          team_structure: string
          team_structure_other: string | null
          updated_at: string
          user_id: string
          value_add_services: string[]
          value_add_services_other: string | null
        }
        Insert: {
          additional_comments?: string | null
          briefing_acknowledged?: boolean
          business_model_targeted: string[]
          business_model_targeted_other?: string | null
          capital_construct: string
          capital_construct_other?: string | null
          completed_at?: string | null
          convening_initiatives_other?: string | null
          convening_initiatives_ranking: Json
          covid_adaptations: string[]
          covid_adaptations_other?: string | null
          covid_impact_portfolio: string
          covid_impact_portfolio_other?: string | null
          covid_impact_vehicle: string
          covid_impact_vehicle_other?: string | null
          created_at?: string
          deal_flow_sources: string[]
          deal_flow_sources_other?: string | null
          exit_strategies: string[]
          exit_strategies_other?: string | null
          firm_name: string
          fund_stage: string
          fund_stage_other?: string | null
          geographic_focus: string[]
          geographic_focus_other?: string | null
          id?: string
          investment_committee: string
          investment_committee_other?: string | null
          investment_criteria: string[]
          investment_criteria_other?: string | null
          investment_process: string
          investment_process_other?: string | null
          investment_thesis: string
          investment_thesis_other?: string | null
          investment_vehicle_type: string[]
          investment_vehicle_type_other?: string | null
          network_engagement_level: string
          network_engagement_level_other?: string | null
          network_value_areas: Json
          participate_mentoring_program: string
          participate_mentoring_program_other?: string | null
          portfolio_development_stage: string
          portfolio_development_stage_other?: string | null
          portfolio_size: string
          portfolio_size_other?: string | null
          present_connection_session?: boolean | null
          present_demystifying_session: string[]
          present_demystifying_session_other?: string | null
          return_expectations: string
          return_expectations_other?: string | null
          role_title: string
          target_sectors: string[]
          target_sectors_other?: string | null
          team_based: string[]
          team_based_other?: string | null
          team_expertise: string[]
          team_expertise_other?: string | null
          team_structure: string
          team_structure_other?: string | null
          updated_at?: string
          user_id: string
          value_add_services: string[]
          value_add_services_other?: string | null
        }
        Update: {
          additional_comments?: string | null
          briefing_acknowledged?: boolean
          business_model_targeted?: string[]
          business_model_targeted_other?: string | null
          capital_construct?: string
          capital_construct_other?: string | null
          completed_at?: string | null
          convening_initiatives_other?: string | null
          convening_initiatives_ranking?: Json
          covid_adaptations?: string[]
          covid_adaptations_other?: string | null
          covid_impact_portfolio?: string
          covid_impact_portfolio_other?: string | null
          covid_impact_vehicle?: string
          covid_impact_vehicle_other?: string | null
          created_at?: string
          deal_flow_sources?: string[]
          deal_flow_sources_other?: string | null
          exit_strategies?: string[]
          exit_strategies_other?: string | null
          firm_name?: string
          fund_stage?: string
          fund_stage_other?: string | null
          geographic_focus?: string[]
          geographic_focus_other?: string | null
          id?: string
          investment_committee?: string
          investment_committee_other?: string | null
          investment_criteria?: string[]
          investment_criteria_other?: string | null
          investment_process?: string
          investment_process_other?: string | null
          investment_thesis?: string
          investment_thesis_other?: string | null
          investment_vehicle_type?: string[]
          investment_vehicle_type_other?: string | null
          network_engagement_level?: string
          network_engagement_level_other?: string | null
          network_value_areas?: Json
          participate_mentoring_program?: string
          participate_mentoring_program_other?: string | null
          portfolio_development_stage?: string
          portfolio_development_stage_other?: string | null
          portfolio_size?: string
          portfolio_size_other?: string | null
          present_connection_session?: boolean | null
          present_demystifying_session?: string[]
          present_demystifying_session_other?: string | null
          return_expectations?: string
          return_expectations_other?: string | null
          role_title?: string
          target_sectors?: string[]
          target_sectors_other?: string | null
          team_based?: string[]
          team_based_other?: string | null
          team_expertise?: string[]
          team_expertise_other?: string | null
          team_structure?: string
          team_structure_other?: string | null
          updated_at?: string
          user_id?: string
          value_add_services?: string[]
          value_add_services_other?: string | null
        }
        Relationships: []
      }
      survey_2024_responses: {
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
          created_at: string | null
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
          employment_impact_other: string | null
          equity_exits_achieved: number | null
          equity_exits_anticipated: number | null
          equity_investments_made: number | null
          existing_lp_sources: Json | null
          financial_instruments_ranking: Json | null
          financing_needs: Json | null
          first_close_achieved: string | null
          first_investment_achieved: string | null
          follow_on_permitted: string | null
          fte_staff_2023_actual: number | null
          fte_staff_2025_forecast: number | null
          fte_staff_current: number | null
          fund_name: string
          fund_priorities_next_12m: Json | null
          fund_type_status: string | null
          fund_type_status_other: string | null
          fundraising_barriers: Json | null
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
          hurdle_rate_percentage: number | null
          id: string
          indirect_jobs_anticipated: number | null
          indirect_jobs_current: number | null
          investment_approval: string[] | null
          investment_approval_other: string | null
          investment_considerations: Json | null
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
          portfolio_cashflow_growth_12m: number | null
          portfolio_cashflow_growth_next_12m: number | null
          portfolio_performance_other: string | null
          portfolio_revenue_growth_12m: number | null
          portfolio_revenue_growth_next_12m: number | null
          post_investment_priorities: Json | null
          principals_total: number | null
          principals_women: number | null
          receive_results: boolean | null
          regulatory_impact: Json | null
          revenue_growth_mix: Json | null
          sector_target_allocation: Json | null
          sgb_financing_trends: Json | null
          survey_sender: string | null
          target_fund_size_2022: number | null
          target_fund_size_current: number | null
          target_lp_sources: Json | null
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
          updated_at: string | null
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
          created_at?: string | null
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
          employment_impact_other?: string | null
          equity_exits_achieved?: number | null
          equity_exits_anticipated?: number | null
          equity_investments_made?: number | null
          existing_lp_sources?: Json | null
          financial_instruments_ranking?: Json | null
          financing_needs?: Json | null
          first_close_achieved?: string | null
          first_investment_achieved?: string | null
          follow_on_permitted?: string | null
          fte_staff_2023_actual?: number | null
          fte_staff_2025_forecast?: number | null
          fte_staff_current?: number | null
          fund_name: string
          fund_priorities_next_12m?: Json | null
          fund_type_status?: string | null
          fund_type_status_other?: string | null
          fundraising_barriers?: Json | null
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
          hurdle_rate_percentage?: number | null
          id?: string
          indirect_jobs_anticipated?: number | null
          indirect_jobs_current?: number | null
          investment_approval?: string[] | null
          investment_approval_other?: string | null
          investment_considerations?: Json | null
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
          portfolio_cashflow_growth_12m?: number | null
          portfolio_cashflow_growth_next_12m?: number | null
          portfolio_performance_other?: string | null
          portfolio_revenue_growth_12m?: number | null
          portfolio_revenue_growth_next_12m?: number | null
          post_investment_priorities?: Json | null
          principals_total?: number | null
          principals_women?: number | null
          receive_results?: boolean | null
          regulatory_impact?: Json | null
          revenue_growth_mix?: Json | null
          sector_target_allocation?: Json | null
          sgb_financing_trends?: Json | null
          survey_sender?: string | null
          target_fund_size_2022?: number | null
          target_fund_size_current?: number | null
          target_lp_sources?: Json | null
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
          updated_at?: string | null
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
          created_at?: string | null
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
          employment_impact_other?: string | null
          equity_exits_achieved?: number | null
          equity_exits_anticipated?: number | null
          equity_investments_made?: number | null
          existing_lp_sources?: Json | null
          financial_instruments_ranking?: Json | null
          financing_needs?: Json | null
          first_close_achieved?: string | null
          first_investment_achieved?: string | null
          follow_on_permitted?: string | null
          fte_staff_2023_actual?: number | null
          fte_staff_2025_forecast?: number | null
          fte_staff_current?: number | null
          fund_name?: string
          fund_priorities_next_12m?: Json | null
          fund_type_status?: string | null
          fund_type_status_other?: string | null
          fundraising_barriers?: Json | null
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
          hurdle_rate_percentage?: number | null
          id?: string
          indirect_jobs_anticipated?: number | null
          indirect_jobs_current?: number | null
          investment_approval?: string[] | null
          investment_approval_other?: string | null
          investment_considerations?: Json | null
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
          portfolio_cashflow_growth_12m?: number | null
          portfolio_cashflow_growth_next_12m?: number | null
          portfolio_performance_other?: string | null
          portfolio_revenue_growth_12m?: number | null
          portfolio_revenue_growth_next_12m?: number | null
          post_investment_priorities?: Json | null
          principals_total?: number | null
          principals_women?: number | null
          receive_results?: boolean | null
          regulatory_impact?: Json | null
          revenue_growth_mix?: Json | null
          sector_target_allocation?: Json | null
          sgb_financing_trends?: Json | null
          survey_sender?: string | null
          target_fund_size_2022?: number | null
          target_fund_size_current?: number | null
          target_lp_sources?: Json | null
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
          updated_at?: string | null
          user_id?: string
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
      admin_create_viewer: {
        Args: {
          p_email: string
          p_password: string
          p_survey_data: Json
          p_survey_year: number
        }
        Returns: Json
      }
      create_user_as_admin: {
        Args: {
          p_email: string
          p_first_name?: string
          p_last_name?: string
          p_password: string
          p_role?: string
        }
        Returns: Json
      }
      create_user_by_admin: {
        Args: {
          p_email: string
          p_first_name?: string
          p_last_name?: string
          p_password: string
        }
        Returns: Json
      }
      create_viewer_survey_data: {
        Args: { p_survey_data: Json; p_survey_year: number; p_user_id: string }
        Returns: string
      }
      create_viewer_with_survey: {
        Args: {
          survey_data: Json
          survey_year: number
          viewer_email: string
          viewer_password: string
        }
        Returns: string
      }
      get_admin_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_users_today: number
          admins_count: number
          members_count: number
          new_registrations_today: number
          surveys_completed: number
          viewers_count: number
        }[]
      }
      get_previous_survey_data: {
        Args: { user_uuid: string }
        Returns: Json
      }
      get_survey_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_completion_time: unknown
          completed_surveys: number
          surveys_this_month: number
          total_surveys: number
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
