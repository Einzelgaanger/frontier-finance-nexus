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
      applications: {
        Row: {
          amount_raised_to_date: string
          applicant_name: string
          created_at: string | null
          domicile_countries: string[] | null
          email: string
          expectations_from_network: string
          how_heard_about_network: string
          id: string
          investment_thesis: string
          number_of_investments: string
          organization_website: string | null
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          role_job_title: string
          status: string
          supporting_document_links: string[] | null
          supporting_documents: string[] | null
          team_overview: string
          topics_of_interest: string[] | null
          typical_check_size: string
          updated_at: string | null
          user_id: string
          vehicle_name: string
        }
        Insert: {
          amount_raised_to_date: string
          applicant_name: string
          created_at?: string | null
          domicile_countries?: string[] | null
          email: string
          expectations_from_network: string
          how_heard_about_network: string
          id?: string
          investment_thesis: string
          number_of_investments: string
          organization_website?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_job_title: string
          status?: string
          supporting_document_links?: string[] | null
          supporting_documents?: string[] | null
          team_overview: string
          topics_of_interest?: string[] | null
          typical_check_size: string
          updated_at?: string | null
          user_id: string
          vehicle_name: string
        }
        Update: {
          amount_raised_to_date?: string
          applicant_name?: string
          created_at?: string | null
          domicile_countries?: string[] | null
          email?: string
          expectations_from_network?: string
          how_heard_about_network?: string
          id?: string
          investment_thesis?: string
          number_of_investments?: string
          organization_website?: string | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_job_title?: string
          status?: string
          supporting_document_links?: string[] | null
          supporting_documents?: string[] | null
          team_overview?: string
          topics_of_interest?: string[] | null
          typical_check_size?: string
          updated_at?: string | null
          user_id?: string
          vehicle_name?: string
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
          organization_name: string | null
          role_title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          organization_name?: string | null
          role_title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          organization_name?: string | null
          role_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      survey_2021_business_model_targeted: {
        Row: {
          business_model_targeted: string
          created_at: string | null
          id: string
          response_id: string
        }
        Insert: {
          business_model_targeted: string
          created_at?: string | null
          id?: string
          response_id: string
        }
        Update: {
          business_model_targeted?: string
          created_at?: string | null
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_business_stage_targeted: {
        Row: {
          business_stage_targeted: string
          created_at: string | null
          id: string
          response_id: string
        }
        Insert: {
          business_stage_targeted: string
          created_at?: string | null
          id?: string
          response_id: string
        }
        Update: {
          business_stage_targeted?: string
          created_at?: string | null
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_covid_government_support: {
        Row: {
          covid_government_support: string
          created_at: string | null
          id: string
          response_id: string
        }
        Insert: {
          covid_government_support: string
          created_at?: string | null
          id?: string
          response_id: string
        }
        Update: {
          covid_government_support?: string
          created_at?: string | null
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_explicit_lens_focus: {
        Row: {
          created_at: string | null
          explicit_lens_focus: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          explicit_lens_focus: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          explicit_lens_focus?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_financing_needs: {
        Row: {
          created_at: string | null
          financing_needs: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          financing_needs: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          financing_needs?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_fund_vehicle_considerations: {
        Row: {
          created_at: string | null
          fund_vehicle_considerations: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          fund_vehicle_considerations: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          fund_vehicle_considerations?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_gender_considerations_investment: {
        Row: {
          created_at: string | null
          gender_considerations_investment: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          gender_considerations_investment: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          gender_considerations_investment?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_gender_considerations_requirement: {
        Row: {
          created_at: string | null
          gender_considerations_requirement: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          gender_considerations_requirement: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          gender_considerations_requirement?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_gender_fund_vehicle: {
        Row: {
          created_at: string | null
          gender_fund_vehicle: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          gender_fund_vehicle: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          gender_fund_vehicle?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_geographic_focus: {
        Row: {
          created_at: string | null
          geographic_focus: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          geographic_focus: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          geographic_focus?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_investment_forms: {
        Row: {
          created_at: string | null
          id: string
          investment_forms: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_forms: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_forms?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_investment_monetization: {
        Row: {
          created_at: string | null
          id: string
          investment_monetization: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_monetization: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_monetization?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_investment_vehicle_type: {
        Row: {
          created_at: string | null
          id: string
          investment_vehicle_type: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_vehicle_type: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_vehicle_type?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_present_demystifying_session: {
        Row: {
          created_at: string | null
          id: string
          present_demystifying_session: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          present_demystifying_session: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          present_demystifying_session?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_raising_capital_2021: {
        Row: {
          created_at: string | null
          id: string
          raising_capital_2021: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          raising_capital_2021: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          raising_capital_2021?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2021_responses: {
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
      survey_2021_target_capital_sources: {
        Row: {
          created_at: string | null
          id: string
          response_id: string
          target_capital_sources: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_id: string
          target_capital_sources: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_id?: string
          target_capital_sources?: string
        }
        Relationships: []
      }
      survey_2021_target_sectors: {
        Row: {
          created_at: string | null
          id: string
          response_id: string
          target_sectors: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_id: string
          target_sectors: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_id?: string
          target_sectors?: string
        }
        Relationships: []
      }
      survey_2021_team_based: {
        Row: {
          created_at: string | null
          id: string
          response_id: string
          team_based: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_id: string
          team_based: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_id?: string
          team_based?: string
        }
        Relationships: []
      }
      survey_2022_concessionary_capital: {
        Row: {
          concessionary_capital: string
          created_at: string | null
          id: string
          response_id: string
        }
        Insert: {
          concessionary_capital: string
          created_at?: string | null
          id?: string
          response_id: string
        }
        Update: {
          concessionary_capital?: string
          created_at?: string | null
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2022_enterprise_types: {
        Row: {
          created_at: string | null
          enterprise_types: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          enterprise_types: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          enterprise_types?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2022_gender_orientation: {
        Row: {
          created_at: string | null
          gender_orientation: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          gender_orientation: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          gender_orientation?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2022_geographic_markets: {
        Row: {
          created_at: string | null
          geographic_markets: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          geographic_markets: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          geographic_markets?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2022_investment_monetization_exit_forms: {
        Row: {
          created_at: string | null
          id: string
          investment_monetization_exit_forms: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_monetization_exit_forms: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_monetization_exit_forms?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2022_responses: {
        Row: {
          completed_at: string | null
          created_at: string | null
          email: string
          form_data: Json | null
          id: string
          legal_entity_date: string | null
          name: string | null
          organisation: string | null
          role_title: string | null
          submission_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          email: string
          form_data?: Json | null
          id?: string
          legal_entity_date?: string | null
          name?: string | null
          organisation?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          email?: string
          form_data?: Json | null
          id?: string
          legal_entity_date?: string | null
          name?: string | null
          organisation?: string | null
          role_title?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      survey_2022_team_based: {
        Row: {
          created_at: string | null
          id: string
          response_id: string
          team_based: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_id: string
          team_based: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_id?: string
          team_based?: string
        }
        Relationships: []
      }
      survey_2023_business_development_approach: {
        Row: {
          business_development_approach: string
          created_at: string | null
          id: string
          response_id: string
        }
        Insert: {
          business_development_approach: string
          created_at?: string | null
          id?: string
          response_id: string
        }
        Update: {
          business_development_approach?: string
          created_at?: string | null
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2023_concessionary_capital: {
        Row: {
          concessionary_capital: string
          created_at: string | null
          id: string
          response_id: string
        }
        Insert: {
          concessionary_capital: string
          created_at?: string | null
          id?: string
          response_id: string
        }
        Update: {
          concessionary_capital?: string
          created_at?: string | null
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2023_exit_form: {
        Row: {
          created_at: string | null
          exit_form: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          exit_form: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          exit_form?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2023_future_research_data: {
        Row: {
          created_at: string | null
          future_research_data: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          future_research_data: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          future_research_data?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2023_gender_inclusion: {
        Row: {
          created_at: string | null
          gender_inclusion: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          gender_inclusion: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          gender_inclusion?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2023_geographic_markets: {
        Row: {
          created_at: string | null
          geographic_markets: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          geographic_markets: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          geographic_markets?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2023_gp_financial_commitment: {
        Row: {
          created_at: string | null
          gp_financial_commitment: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          gp_financial_commitment: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          gp_financial_commitment?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2023_legal_domicile: {
        Row: {
          created_at: string | null
          id: string
          legal_domicile: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          legal_domicile: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          legal_domicile?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2023_responses: {
        Row: {
          completed_at: string | null
          created_at: string | null
          email_address: string
          form_data: Json | null
          fund_name: string | null
          funds_raising_investing: string | null
          id: string
          organisation_name: string | null
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
          funds_raising_investing?: string | null
          id?: string
          organisation_name?: string | null
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
          funds_raising_investing?: string | null
          id?: string
          organisation_name?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      survey_2023_sustainable_development_goals: {
        Row: {
          created_at: string | null
          id: string
          response_id: string
          sustainable_development_goals: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_id: string
          sustainable_development_goals: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_id?: string
          sustainable_development_goals?: string
        }
        Relationships: []
      }
      survey_2023_team_based: {
        Row: {
          created_at: string | null
          id: string
          response_id: string
          team_based: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_id: string
          team_based: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_id?: string
          team_based?: string
        }
        Relationships: []
      }
      survey_2024_business_development_approach: {
        Row: {
          business_development_approach: string
          created_at: string | null
          id: string
          response_id: string
        }
        Insert: {
          business_development_approach: string
          created_at?: string | null
          id?: string
          response_id: string
        }
        Update: {
          business_development_approach?: string
          created_at?: string | null
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_concessionary_capital: {
        Row: {
          concessionary_capital: string
          created_at: string | null
          id: string
          response_id: string
        }
        Insert: {
          concessionary_capital: string
          created_at?: string | null
          id?: string
          response_id: string
        }
        Update: {
          concessionary_capital?: string
          created_at?: string | null
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_data_sharing_willingness: {
        Row: {
          created_at: string | null
          data_sharing_willingness: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          data_sharing_willingness: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          data_sharing_willingness?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_domicile_reason: {
        Row: {
          created_at: string | null
          domicile_reason: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          domicile_reason: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          domicile_reason?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_gender_inclusion: {
        Row: {
          created_at: string | null
          gender_inclusion: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          gender_inclusion: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          gender_inclusion?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_geographic_markets: {
        Row: {
          created_at: string | null
          geographic_markets: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          geographic_markets: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          geographic_markets?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_gp_financial_commitment: {
        Row: {
          created_at: string | null
          gp_financial_commitment: string
          id: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          gp_financial_commitment: string
          id?: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          gp_financial_commitment?: string
          id?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_investment_approval: {
        Row: {
          created_at: string | null
          id: string
          investment_approval: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_approval: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_approval?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_investment_monetisation_forms: {
        Row: {
          created_at: string | null
          id: string
          investment_monetisation_forms: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_monetisation_forms: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_monetisation_forms?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_investment_networks: {
        Row: {
          created_at: string | null
          id: string
          investment_networks: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_networks: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_networks?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_legal_domicile: {
        Row: {
          created_at: string | null
          id: string
          legal_domicile: string
          response_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          legal_domicile: string
          response_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          legal_domicile?: string
          response_id?: string
        }
        Relationships: []
      }
      survey_2024_responses: {
        Row: {
          completed_at: string | null
          created_at: string | null
          email_address: string
          form_data: Json | null
          fund_name: string | null
          funds_raising_investing: string | null
          id: string
          organisation_name: string | null
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
          funds_raising_investing?: string | null
          id?: string
          organisation_name?: string | null
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
          funds_raising_investing?: string | null
          id?: string
          organisation_name?: string | null
          submission_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      survey_2024_team_based: {
        Row: {
          created_at: string | null
          id: string
          response_id: string
          team_based: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_id: string
          team_based: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_id?: string
          team_based?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          email: string
          id: string
          role: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          role?: string
          updated_at?: string | null
          user_id?: string | null
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
      create_admin_user: {
        Args: {
          p_email: string
          p_first_name?: string
          p_last_name?: string
          p_password: string
        }
        Returns: Json
      }
      create_user_with_profile: {
        Args: { org_name: string; user_email: string }
        Returns: string
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
      get_user_role_safe: {
        Args: { user_uuid: string }
        Returns: string
      }
      is_approved_member: {
        Args: { user_uuid: string }
        Returns: boolean
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
