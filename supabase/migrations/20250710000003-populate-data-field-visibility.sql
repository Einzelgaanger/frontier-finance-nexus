-- Populate data field visibility table with all survey fields
-- This ensures the admin dashboard has data to display and manage

INSERT INTO public.data_field_visibility (field_name, visibility_level) VALUES
-- Vehicle Information
('vehicle_type', 'public'),
('vehicle_type_other', 'member'),
('vehicle_websites', 'public'),
('thesis', 'member'),

-- Team & Leadership
('team_members', 'member'),
('team_size_min', 'member'),
('team_size_max', 'member'),
('team_description', 'member'),

-- Geographic & Market Focus
('legal_domicile', 'public'),
('markets_operated', 'member'),

-- Investment Strategy
('ticket_size_min', 'member'),
('ticket_size_max', 'member'),
('ticket_description', 'member'),
('target_capital', 'member'),
('capital_raised', 'member'),
('capital_in_market', 'member'),

-- Fund Operations
('supporting_document_url', 'admin'),
('information_sharing', 'member'),
('expectations', 'member'),
('how_heard_about_network', 'member'),

-- Fund Status & Timeline
('fund_stage', 'member'),
('current_status', 'member'),
('legal_entity_date_from', 'member'),
('legal_entity_date_to', 'member'),
('legal_entity_month_from', 'member'),
('legal_entity_month_to', 'member'),
('first_close_date_from', 'member'),
('first_close_date_to', 'member'),
('first_close_month_from', 'member'),
('first_close_month_to', 'member'),

-- Investment Instruments
('investment_instruments_priority', 'member'),

-- Sector Focus & Returns
('sectors_allocation', 'member'),
('target_return_min', 'member'),
('target_return_max', 'member'),
('equity_investments_made', 'member'),
('equity_investments_exited', 'member'),
('self_liquidating_made', 'member'),
('self_liquidating_exited', 'member')
ON CONFLICT (field_name) DO UPDATE SET
  visibility_level = EXCLUDED.visibility_level,
  updated_at = NOW(); 