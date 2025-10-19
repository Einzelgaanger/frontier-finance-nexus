import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if the user is an admin
    const { data: userRole, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || userRole?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    const { email, password, survey_data, survey_year } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create the user using the service role key
    const serviceRoleClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const userMetadata = {
      first_name: survey_data?.first_name || 'Viewer',
      last_name: survey_data?.last_name || 'User'
    };
    
    console.log('Creating user with metadata:', userMetadata);
    
    const { data: newUser, error: createError } = await serviceRoleClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: userMetadata
    })

    if (createError) {
      return new Response(
        JSON.stringify({ error: createError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

// Manually create profile and role since trigger may not work with service role
console.log('Creating profile and role manually for user:', newUser.user.id);

const emailName = email.split('@')[0];
const firstName = survey_data?.first_name || emailName || 'Viewer';
const lastName = survey_data?.last_name || 'User';

// Create profile
const { error: profileError } = await serviceRoleClient
  .from('profiles')
  .insert({
    id: newUser.user.id,
    email: email,
    first_name: firstName,
    last_name: lastName
  });
  
if (profileError) {
  console.error('Profile creation error:', profileError);
} else {
  console.log('Profile created successfully for user:', newUser.user.id);
}

// Create role
const { error: roleInsertError } = await serviceRoleClient
  .from('user_roles')
  .insert({
    user_id: newUser.user.id,
    role: 'viewer'
  });
  
if (roleInsertError) {
  console.error('Role creation error:', roleInsertError);
} else {
  console.log('Role created successfully for user:', newUser.user.id);
}

// Create survey data using the database function (best-effort)
if (survey_data && newUser.user) {
  const { error: surveyError } = await serviceRoleClient.rpc('create_viewer_survey_data', {
    p_user_id: newUser.user.id,
    p_survey_data: survey_data,
    p_survey_year: survey_year || new Date().getFullYear()
  });

  if (surveyError) {
    console.error('Survey creation error:', surveyError);
    // Don't fail the entire request if survey creation fails
  }
}

return new Response(
  JSON.stringify({ 
    success: true, 
    user: newUser.user,
    message: 'Viewer created successfully' 
  }),
  { 
    status: 200, 
    headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
  }
)

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 