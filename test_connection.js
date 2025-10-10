// =====================================================
// DATABASE CONNECTION TEST
// =====================================================
// Run this in your browser console to test Supabase connection
// =====================================================

// Test Supabase connection
async function testSupabaseConnection() {
    try {
        console.log('Testing Supabase connection...');
        
        // Import supabase client (you'll need to adjust this based on your setup)
        const { createClient } = await import('@supabase/supabase-js');
        
        // Your Supabase URL and anon key (replace with your actual values)
        const supabaseUrl = 'https://qiqxdivyyjcbegdlptuq.supabase.co';
        const supabaseKey = 'your-anon-key-here'; // Replace with your actual anon key
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Test basic connection
        const { data, error } = await supabase
            .from('survey_2024_responses')
            .select('count')
            .limit(1);
            
        if (error) {
            console.error('❌ Supabase connection failed:', error);
            return false;
        }
        
        console.log('✅ Supabase connection successful!');
        return true;
        
    } catch (error) {
        console.error('❌ Connection test failed:', error);
        return false;
    }
}

// Run the test
testSupabaseConnection();
