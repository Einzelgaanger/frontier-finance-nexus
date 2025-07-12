import { supabase } from '@/integrations/supabase/client';

export const populateMemberSurveys = async () => {
  try {
    console.log('Starting member surveys population...');
    
    // Get all completed survey responses
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .not('completed_at', 'is', null);

    if (responsesError) {
      console.error('Error fetching survey responses:', responsesError);
      return;
    }

    console.log(`Found ${responses?.length || 0} completed survey responses`);

    if (!responses || responses.length === 0) {
      console.log('No completed survey responses found');
      return;
    }

    // Process each response and create/update member survey
    for (const response of responses) {
      try {
        // Parse JSON fields
        let sectorFocus: string[] = [];
        let stageFocus: string[] = [];
        let marketsOperated: any = {};

        try {
          if (response.sectors_allocation) {
            sectorFocus = typeof response.sectors_allocation === 'string' 
              ? Object.keys(JSON.parse(response.sectors_allocation))
              : Object.keys(response.sectors_allocation || {});
          }
          if (response.fund_stage) {
            stageFocus = typeof response.fund_stage === 'string'
              ? JSON.parse(response.fund_stage)
              : response.fund_stage || [];
          }
          if (response.markets_operated) {
            marketsOperated = typeof response.markets_operated === 'string'
              ? JSON.parse(response.markets_operated)
              : response.markets_operated || {};
          }
        } catch (e) {
          console.warn('Error parsing JSON fields for response:', response.id, e);
        }

        // Determine website
        let website = null;
        if (response.vehicle_websites) {
          if (Array.isArray(response.vehicle_websites)) {
            website = response.vehicle_websites[0];
          } else if (typeof response.vehicle_websites === 'string') {
            try {
              const parsed = JSON.parse(response.vehicle_websites);
              website = Array.isArray(parsed) ? parsed[0] : null;
            } catch (e) {
              website = response.vehicle_websites;
            }
          }
        }

        const memberSurveyData = {
          user_id: response.user_id,
          fund_name: response.vehicle_name || 'Unknown Fund',
          website: website,
          fund_type: response.vehicle_type || 'Unknown',
          primary_investment_region: Object.keys(marketsOperated).join(', ') || null,
          year_founded: response.legal_entity_date_from || null,
          team_size: response.team_size_max || null,
          typical_check_size: response.ticket_size_min && response.ticket_size_max
            ? `$${response.ticket_size_min.toLocaleString()} - $${response.ticket_size_max.toLocaleString()}`
            : null,
          aum: response.capital_raised ? `$${response.capital_raised.toLocaleString()}` : null,
          investment_thesis: response.thesis || null,
          sector_focus: sectorFocus,
          stage_focus: stageFocus,
          completed_at: response.completed_at
        };

        // Check if member survey already exists
        const { data: existingMemberSurvey } = await supabase
          .from('member_surveys')
          .select('id')
          .eq('user_id', response.user_id)
          .single();

        if (existingMemberSurvey) {
          // Update existing member survey
          const { error: updateError } = await supabase
            .from('member_surveys')
            .update(memberSurveyData)
            .eq('user_id', response.user_id);

          if (updateError) {
            console.error('Error updating member survey for user:', response.user_id, updateError);
          } else {
            console.log('Updated member survey for user:', response.user_id);
          }
        } else {
          // Create new member survey
          const { error: insertError } = await supabase
            .from('member_surveys')
            .insert([memberSurveyData]);

          if (insertError) {
            console.error('Error creating member survey for user:', response.user_id, insertError);
          } else {
            console.log('Created member survey for user:', response.user_id);
          }
        }
      } catch (error) {
        console.error('Error processing response:', response.id, error);
      }
    }

    console.log('Member surveys population completed');
  } catch (error) {
    console.error('Error in populateMemberSurveys:', error);
  }
}; 