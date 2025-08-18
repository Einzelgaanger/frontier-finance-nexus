// Shared type for survey form data
export interface TeamMember {
  name: string;
  email?: string;
  phone?: string;
  role: string;
  experience?: string;
}

export interface SurveyFormData {
  vehicle_name?: string;
  vehicle_websites?: string[];
  vehicle_type?: string;
  vehicle_type_other?: string;
  thesis?: string;
  team_members?: TeamMember[];
  team_size_min?: number;
  team_size_max?: number;
  team_description?: string;
  legal_domicile?: string[];
  legal_domicile_other?: string;
  markets_operated?: Record<string, number>;
  markets_operated_other?: string;
  ticket_size_min?: number;
  ticket_size_max?: number;
  ticket_description?: string;
  target_capital?: number;
  capital_raised?: number;
  capital_in_market?: number;
  supporting_document_url?: string;
  expectations?: string;
  how_heard_about_network?: string;
  how_heard_about_network_other?: string;
  fund_stage?: string[];
  current_status?: string;
  current_status_other?: string;
  legal_entity_date_from?: number;
  legal_entity_date_to?: number | 'present';
  legal_entity_month_from?: number;
  legal_entity_month_to?: number;
  first_close_date_from?: number;
  first_close_date_to?: number | 'present';
  first_close_month_from?: number;
  first_close_month_to?: number;
  investment_instruments_priority?: Record<string, number>;
  investment_instruments_data?: Array<{
    name: string;
    committed: number;
    committedPercentage: number;
    deployed: number;
    deployedValue: number;
    priority: number;
  }>;
  sectors_allocation?: Record<string, number>;
  target_return_min?: number;
  target_return_max?: number;
  equity_investments_made?: number;
  equity_investments_exited?: number;
  self_liquidating_made?: number;
  self_liquidating_exited?: number;
  // Metadata
  id?: string;
  year?: number;
  created_at?: string;
  completed_at?: string;
}
