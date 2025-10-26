import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    year = new Date().getFullYear(),
    geography,
    sector,
    vehicleType,
    limit = 50,
    offset = 0
  } = req.query;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Build optimized query with filters
    let query = supabase
      .from('survey_responses')
      .select(`
        id,
        user_id,
        year,
        vehicle_name,
        vehicle_websites,
        vehicle_type,
        thesis,
        team_size_min,
        team_size_max,
        team_description,
        legal_domicile,
        markets_operated,
        ticket_size_min,
        ticket_size_max,
        target_capital,
        capital_raised,
        sectors_allocation,
        investment_instruments_priority,
        profiles!inner(id, email, first_name, last_name)
      `)
      .eq('year', year)
      .not('completed_at', 'is', null)
      .range(offset, offset + limit - 1);

    // Apply filters
    if (geography) {
      query = query.contains('legal_domicile', [geography]);
    }
    
    if (sector) {
      query = query.contains('sectors_allocation', { [sector]: { $gt: 0 } });
    }
    
    if (vehicleType) {
      query = query.eq('vehicle_type', vehicleType);
    }

    const { data: profiles, error } = await query;

    if (error) throw error;

    // Get total count for pagination
    let countQuery = supabase
      .from('survey_responses')
      .select('id', { count: 'exact' })
      .eq('year', year)
      .not('completed_at', 'is', null);

    if (geography) {
      countQuery = countQuery.contains('legal_domicile', [geography]);
    }
    
    if (sector) {
      countQuery = countQuery.contains('sectors_allocation', { [sector]: { $gt: 0 } });
    }
    
    if (vehicleType) {
      countQuery = countQuery.eq('vehicle_type', vehicleType);
    }

    const { count } = await countQuery;

    // Get filter options
    const [geographyOptions, sectorOptions, vehicleTypeOptions] = await Promise.all([
      getGeographyOptions(supabase, year),
      getSectorOptions(supabase, year),
      getVehicleTypeOptions(supabase, year)
    ]);

    res.json({
      profiles: profiles || [],
      pagination: {
        total: count || 0,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < (count || 0)
      },
      filters: {
        geography: geographyOptions,
        sector: sectorOptions,
        vehicleType: vehicleTypeOptions
      },
      year: parseInt(year),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Network profiles API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getGeographyOptions(supabase, year) {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('legal_domicile')
    .eq('year', year)
    .not('completed_at', 'is', null);

  if (error) return [];

  const countries = new Set();
  data?.forEach(survey => {
    if (survey.legal_domicile) {
      survey.legal_domicile.forEach(country => {
        countries.add(country);
      });
    }
  });

  return Array.from(countries).sort();
}

async function getSectorOptions(supabase, year) {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('sectors_allocation')
    .eq('year', year)
    .not('completed_at', 'is', null);

  if (error) return [];

  const sectors = new Set();
  data?.forEach(survey => {
    if (survey.sectors_allocation) {
      Object.keys(survey.sectors_allocation).forEach(sector => {
        sectors.add(sector);
      });
    }
  });

  return Array.from(sectors).sort();
}

async function getVehicleTypeOptions(supabase, year) {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('vehicle_type')
    .eq('year', year)
    .not('completed_at', 'is', null)
    .not('vehicle_type', 'is', null);

  if (error) return [];

  const types = new Set();
  data?.forEach(survey => {
    if (survey.vehicle_type) {
      types.add(survey.vehicle_type);
    }
  });

  return Array.from(types).sort();
} 