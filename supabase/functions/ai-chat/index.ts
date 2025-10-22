import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    const { message } = await req.json()

    // Get user role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError) {
      throw new Error('Failed to get user role')
    }

    const userRole = roleData.role

    // Get field visibility rules
    const { data: fieldVisibility, error: visError } = await supabaseClient
      .from('field_visibility')
      .select('*')

    if (visError) {
      throw new Error('Failed to get field visibility')
    }

    // Filter fields based on user role
    const visibleFields = fieldVisibility.filter(field => {
      if (userRole === 'admin') return field.admin_visible
      if (userRole === 'member') return field.member_visible
      if (userRole === 'viewer') return field.viewer_visible
      return false
    })

    // Get survey data based on role visibility
    const surveyYears = [2021, 2022, 2023, 2024]
    const surveyData: any = {}

    for (const year of surveyYears) {
      const { data, error } = await supabaseClient
        .from(`survey_responses_${year}`)
        .select('*')
        .eq('submission_status', 'completed')

      if (!error && data) {
        // Filter form_data to only include visible fields
        surveyData[year] = data.map(response => {
          const filteredFormData: any = {}
          const yearFields = visibleFields.filter(f => f.survey_year === year)
          
          yearFields.forEach(field => {
            if (response.form_data && response.form_data[field.field_name]) {
              filteredFormData[field.field_name] = response.form_data[field.field_name]
            }
          })

          return {
            organisation_name: response.organisation_name,
            fund_name: response.fund_name,
            ...filteredFormData
          }
        })
      }
    }

    // Build context for AI
    const context = `
You are a helpful AI assistant for the CFF Network platform. You have access to survey data based on the user's role: ${userRole}.

User Role: ${userRole}
- Admin: Can see all survey data including sensitive financial information
- Member: Can see extended information including team details and strategies
- Viewer: Can only see basic public information

Available Survey Data:
${JSON.stringify(surveyData, null, 2)}

Visible Fields for this role:
${visibleFields.map(f => `- ${f.field_name} (${f.field_category})`).join('\n')}

Answer the user's question based ONLY on the data you can access. Be helpful and concise.
If the user asks about data you cannot access due to their role, politely explain that the information is restricted to higher roles.
`

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: context },
          { role: 'user', content: message }
        ],
      }),
    })

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.statusText}`)
    }

    const aiData = await aiResponse.json()
    const reply = aiData.choices[0].message.content

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ai-chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
