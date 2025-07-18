const fs = require('fs');
const path = require('path');

const envContent = `SUPABASE_URL=https://qiqxdivyyjcbegdlptuq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=4000
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
  console.log('⚠️  IMPORTANT: You need to add your Supabase Service Role Key to the .env file');
  console.log('   Go to your Supabase dashboard → Settings → API → Copy the "service_role" key');
  console.log('   Replace "your-service-role-key-here" in the .env file');
} else {
  console.log('✅ .env file already exists');
} 