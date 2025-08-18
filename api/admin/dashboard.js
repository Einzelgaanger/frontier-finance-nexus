import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Fetch all admin data in parallel for maximum performance
    const [applications, members, viewers, analytics, activity] = await Promise.all([
      fetchApplications(supabase),
      fetchMembers(supabase),
      fetchViewers(supabase),
      fetchAnalytics(supabase),
      fetchActivity(supabase)
    ]);

    res.json({
      applications,
      members,
      viewers,
      analytics,
      activity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function fetchApplications(supabase) {
  const { data, error } = await supabase
    .from('membership_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) throw error;
  return data || [];
}

async function fetchMembers(supabase) {
  const { data, error } = await supabase
    .from('member_surveys')
    .select('id, user_id, fund_name, website')
    .not('completed_at', 'is', null)
    .limit(50);

  if (error) throw error;
  return data || [];
}

async function fetchViewers(supabase) {
  // Optimized single query with join
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      user_id,
      role,
      assigned_at,
      profiles!inner(id, email, first_name, last_name)
    `)
    .eq('role', 'viewer')
    .order('assigned_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function fetchAnalytics(supabase) {
  const year = new Date().getFullYear();
  
  const { data, error } = await supabase
    .from('member_surveys')
    .select('aum, typical_check_size, primary_investment_region, fund_type, created_at')
    .not('completed_at', 'is', null)
    .gte('created_at', `${year}-01-01`)
    .lt('created_at', `${year + 1}-01-01`);

  if (error) throw error;

  // Pre-calculate all analytics on server
  const totalFunds = data?.length || 0;
  const totalCapital = data?.reduce((sum, survey) => {
    if (survey.aum) {
      const amount = parseFloat(survey.aum.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }
    return sum;
  }, 0) || 0;

  const ticketSizes = data
    ?.map(s => s.typical_check_size)
    .filter(Boolean)
    .map(size => {
      const match = size.match(/[\d,]+/);
      return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
    })
    .filter(size => size > 0) || [];

  const averageTicketSize = ticketSizes.length > 0 
    ? ticketSizes.reduce((sum, size) => sum + size, 0) / ticketSizes.length 
    : 0;

  const activeMarkets = [...new Set(
    data?.map(s => s.primary_investment_region).filter(Boolean) || []
  )];

  const typeCount = data?.reduce((acc, survey) => {
    const type = survey.fund_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}) || {};

  const fundsByType = Object.entries(typeCount).map(([name, value]) => ({
    name,
    value
  }));

  return {
    totalFunds,
    totalCapital,
    averageTicketSize,
    activeMarkets,
    fundsByType,
    growthMetrics: {
      monthlyGrowth: 0,
      newFundsThisMonth: 0,
      totalInvestments: 0
    }
  };
}

async function fetchActivity(supabase) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15);

  if (error) throw error;
  return data || [];
} 