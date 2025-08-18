import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { year = new Date().getFullYear() } = req.query;

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Fetch all analytics data in parallel
    const [surveys, activityLogs] = await Promise.all([
      fetchSurveyData(supabase, year),
      fetchActivityLogs(supabase)
    ]);

    // Pre-calculate all analytics on server
    const analytics = calculateAnalytics(surveys, activityLogs, year);

    res.json({
      ...analytics,
      year: parseInt(year),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function fetchSurveyData(supabase, year) {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .eq('year', year)
    .not('completed_at', 'is', null);

  if (error) throw error;
  return data || [];
}

async function fetchActivityLogs(supabase) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data || [];
}

function calculateAnalytics(surveys, activityLogs, year) {
  // Calculate all metrics
  const totalFunds = surveys.length;
  
  const totalCapital = surveys.reduce((sum, survey) => {
    if (survey.target_capital) {
      return sum + (parseFloat(survey.target_capital) || 0);
    }
    return sum;
  }, 0);

  const averageTicketSize = surveys.reduce((sum, survey) => {
    if (survey.ticket_size_min && survey.ticket_size_max) {
      const avg = (parseFloat(survey.ticket_size_min) + parseFloat(survey.ticket_size_max)) / 2;
      return sum + avg;
    }
    return sum;
  }, 0) / (surveys.length || 1);

  // Geographic data
  const geographicData = surveys.reduce((acc, survey) => {
    if (survey.legal_domicile) {
      survey.legal_domicile.forEach(country => {
        acc[country] = (acc[country] || 0) + 1;
      });
    }
    return acc;
  }, {});

  // Sector data
  const sectorData = surveys.reduce((acc, survey) => {
    if (survey.sectors_allocation) {
      Object.entries(survey.sectors_allocation).forEach(([sector, allocation]) => {
        acc[sector] = (acc[sector] || 0) + parseFloat(allocation);
      });
    }
    return acc;
  }, {});

  // Team size data
  const teamSizeData = surveys.reduce((acc, survey) => {
    if (survey.team_size_min && survey.team_size_max) {
      const avgSize = Math.round((survey.team_size_min + survey.team_size_max) / 2);
      const range = `${avgSize - 2}-${avgSize + 2}`;
      acc[range] = (acc[range] || 0) + 1;
    }
    return acc;
  }, {});

  // Investment instruments data
  const instrumentsData = surveys.reduce((acc, survey) => {
    if (survey.investment_instruments_priority) {
      Object.entries(survey.investment_instruments_priority).forEach(([instrument, priority]) => {
        acc[instrument] = (acc[instrument] || 0) + parseFloat(priority);
      });
    }
    return acc;
  }, {});

  // Timeline data
  const timelineData = surveys.reduce((acc, survey) => {
    if (survey.created_at) {
      const month = new Date(survey.created_at).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
    }
    return acc;
  }, {});

  // Activity metrics
  const recentActivity = activityLogs.slice(0, 10);
  const activityByType = activityLogs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  return {
    // Core metrics
    totalFunds,
    totalCapital,
    averageTicketSize,
    
    // Geographic data
    geographicData: Object.entries(geographicData).map(([name, value]) => ({ name, value })),
    
    // Sector data
    sectorData: Object.entries(sectorData).map(([name, value]) => ({ name, value })),
    
    // Team data
    teamSizeData: Object.entries(teamSizeData).map(([name, value]) => ({ name, value })),
    
    // Investment instruments
    instrumentsData: Object.entries(instrumentsData).map(([name, value]) => ({ name, value })),
    
    // Timeline
    timelineData: Object.entries(timelineData).map(([name, value]) => ({ name, value })),
    
    // Activity
    recentActivity,
    activityByType: Object.entries(activityByType).map(([name, value]) => ({ name, value })),
    
    // Growth metrics
    growthMetrics: {
      monthlyGrowth: calculateMonthlyGrowth(surveys),
      newFundsThisMonth: calculateNewFundsThisMonth(surveys),
      totalInvestments: calculateTotalInvestments(surveys)
    }
  };
}

function calculateMonthlyGrowth(surveys) {
  const now = new Date();
  const thisMonth = surveys.filter(s => {
    const surveyDate = new Date(s.created_at);
    return surveyDate.getMonth() === now.getMonth() && surveyDate.getFullYear() === now.getFullYear();
  }).length;
  
  const lastMonth = surveys.filter(s => {
    const surveyDate = new Date(s.created_at);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    return surveyDate.getMonth() === lastMonthDate.getMonth() && surveyDate.getFullYear() === lastMonthDate.getFullYear();
  }).length;
  
  return lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;
}

function calculateNewFundsThisMonth(surveys) {
  const now = new Date();
  return surveys.filter(s => {
    const surveyDate = new Date(s.created_at);
    return surveyDate.getMonth() === now.getMonth() && surveyDate.getFullYear() === now.getFullYear();
  }).length;
}

function calculateTotalInvestments(surveys) {
  return surveys.reduce((sum, survey) => {
    if (survey.equity_investments_made) {
      return sum + (parseFloat(survey.equity_investments_made) || 0);
    }
    return sum;
  }, 0);
} 