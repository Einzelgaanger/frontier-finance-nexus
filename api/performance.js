export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const dbStartTime = Date.now();
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    const dbResponseTime = Date.now() - dbStartTime;

    const totalResponseTime = Date.now() - startTime;

    const performance = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      metrics: {
        totalResponseTime,
        databaseResponseTime: dbResponseTime,
        apiOverhead: totalResponseTime - dbResponseTime
      },
      database: {
        connected: !error,
        error: error?.message || null
      },
      environment: process.env.NODE_ENV || 'development'
    };

    res.json(performance);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime
    });
  }
} 