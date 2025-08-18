const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Performance monitoring endpoint
app.get('/api/performance', (req, res) => {
  res.json({
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Admin dashboard endpoint
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    // Fetch all admin data in parallel for maximum performance
    const [applications, members, viewers, analytics, activity] = await Promise.all([
      fetchApplications(),
      fetchMembers(),
      fetchViewers(),
      fetchAnalytics(),
      fetchActivity()
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
});

// Analytics dashboard endpoint
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    const { data, error } = await supabase
      .from('member_surveys')
      .select('aum, typical_check_size, primary_investment_region, fund_type, created_at, number_of_investments')
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
      .filter(size => size > 0);
    
    const averageTicketSize = ticketSizes.length > 0 
      ? ticketSizes.reduce((sum, size) => sum + size, 0) / ticketSizes.length 
      : 0;

    const activeMarkets = [...new Set(
      data
        ?.map(s => s.primary_investment_region)
        .filter(Boolean)
    )];

    const typeCount = data?.reduce((acc, survey) => {
      const type = survey.fund_type || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}) || {};

    const fundsByType = Object.entries(typeCount).map(([name, value]) => ({
      name, value
    }));

    const regionCount = data?.reduce((acc, survey) => {
      const region = survey.primary_investment_region || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {}) || {};

    const fundsByRegion = Object.entries(regionCount).map(([name, value]) => ({
      name, value
    }));

    res.json({
      totalFunds,
      totalCapital,
      averageTicketSize,
      activeMarkets: activeMarkets.length,
      fundsByType,
      fundsByRegion,
      year,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Network profiles endpoint
app.get('/api/network/profiles', async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('member_surveys')
      .select('id, user_id, fund_name, website, primary_investment_region, fund_type, aum, typical_check_size')
      .not('completed_at', 'is', null);

    if (search) {
      query = query.or(`fund_name.ilike.%${search}%,primary_investment_region.ilike.%${search}%,fund_type.ilike.%${search}%`);
    }

    const { data, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get total count for pagination
    const { count } = await supabase
      .from('member_surveys')
      .select('*', { count: 'exact', head: true })
      .not('completed_at', 'is', null);

    res.json({
      profiles: data || [],
      total: count || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil((count || 0) / limit),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Network API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
async function fetchApplications() {
  const { data, error } = await supabase
    .from('membership_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(25);

  if (error) throw error;
  return data || [];
}

async function fetchMembers() {
  const { data, error } = await supabase
    .from('member_surveys')
    .select('id, user_id, fund_name, website')
    .not('completed_at', 'is', null)
    .limit(50);

  if (error) throw error;
  return data || [];
}

async function fetchViewers() {
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

async function fetchAnalytics() {
  const year = new Date().getFullYear();
  
  const { data, error } = await supabase
    .from('member_surveys')
    .select('aum, typical_check_size, primary_investment_region, fund_type, created_at')
    .not('completed_at', 'is', null)
    .gte('created_at', `${year}-01-01`)
    .lt('created_at', `${year + 1}-01-01`);

  if (error) throw error;

  const totalFunds = data?.length || 0;
  const totalCapital = data?.reduce((sum, survey) => {
    if (survey.aum) {
      const amount = parseFloat(survey.aum.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }
    return sum;
  }, 0) || 0;

  return {
    totalFunds,
    totalCapital,
    year
  };
}

async function fetchActivity() {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 