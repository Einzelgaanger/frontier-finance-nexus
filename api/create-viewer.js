const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Simple CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'CORS test successful', timestamp: new Date().toISOString() });
});

app.post('/create-viewer', async (req, res) => {
  try {
    const { email, password, firstName, lastName, vehicle_name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName || vehicle_name || 'User',
        last_name: lastName || 'Account'
      }
    });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(400).json({ error: error.message });
    }
    
    res.status(200).json({ user: data.user });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`CORS enabled for http://localhost:8080`);
  console.log(`Test endpoint available at http://localhost:4000/test`);
}); 