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
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { message, messages } = await req.json()

    // Support both single message and messages array formats
    const userMessage = message || (messages && messages[messages.length - 1]?.content) || ''
    const conversationHistory = messages || [{ role: 'user', content: userMessage }]

    // Get user role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    const userRole = roleError || !roleData?.role ? 'viewer' : roleData.role

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

    // Build optimized data context based on role
    const dataContext: any = {}
    const surveyYears = [2021, 2022, 2023, 2024]
    
    // Get survey field names for efficient queries
    const surveyFieldsByYear: Record<number, string[]> = {}
    surveyYears.forEach(year => {
      const yearFields = visibleFields.filter(f => f.table_name === `survey_responses_${year}`)
      surveyFieldsByYear[year] = yearFields.length > 0 
        ? ['id', 'email_address', 'email', 'organisation_name', 'organization_name', 'firm_name', 'fund_name', ...yearFields.map(f => f.field_name)]
        : ['id', 'email_address', 'email', 'organisation_name', 'organization_name', 'firm_name', 'fund_name']
    })

    // Fetch survey data efficiently - only visible fields
    dataContext.surveys = {}
    let totalSurveys = 0
    
    for (const year of surveyYears) {
      const fieldsToSelect = [...new Set(surveyFieldsByYear[year])].join(', ')
      
      const { data, error } = await supabaseClient
        .from(`survey_responses_${year}`)
        .select(fieldsToSelect)
        .eq('submission_status', 'completed')
        .limit(100) // Reasonable limit

      if (!error && data && data.length > 0) {
        dataContext.surveys[year] = data
        totalSurveys += data.length
      }
    }

    dataContext.survey_summary = {
      total_responses: totalSurveys,
      years_with_data: Object.keys(dataContext.surveys)
    }

    // User's own credits (all roles)
    const { data: creditsData } = await supabaseClient
      .from('user_credits')
      .select('total_points, ai_usage_count, blog_posts_count, login_streak')
      .eq('user_id', user.id)
      .maybeSingle()

    if (creditsData) {
      dataContext.user_credits = creditsData
    }

    // Leaderboard (members & admins)
    if (userRole === 'member' || userRole === 'admin') {
      const { data: leaderboard } = await supabaseClient
        .from('user_credits')
        .select('user_id, total_points')
        .order('total_points', { ascending: false })
        .limit(10)

      if (leaderboard) {
        dataContext.leaderboard = leaderboard
      }
    }

    // Recent activity (user's own)
    const { data: activityData } = await supabaseClient
      .from('activity_log')
      .select('activity_type, points_earned, created_at, description')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (activityData) {
      dataContext.my_activity = activityData
    }

    // Applications (admin only)
    if (userRole === 'admin') {
      const { data: applicationsData } = await supabaseClient
        .from('applications')
        .select('company_name, applicant_name, email, status, created_at, vehicle_name')
        .order('created_at', { ascending: false })
        .limit(50)

      if (applicationsData) {
        dataContext.applications = applicationsData
      }
    }

    // Published blogs (all roles)
    const { data: blogsData } = await supabaseClient
      .from('blogs')
      .select('title, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (blogsData) {
      dataContext.recent_blogs = blogsData
    }

    // Network profiles summary (members & admins)
    if (userRole === 'member' || userRole === 'admin') {
      const { data: profilesData } = await supabaseClient
        .from('user_profiles')
        .select('id, company_name, email')
        .limit(100)

      if (profilesData) {
        dataContext.network_profiles_count = profilesData.length
      }
    }

    // Build focused, efficient context for AI
    const accessibleFields = visibleFields.map(f => 
      `${f.table_name}.${f.field_name} (${f.field_category})`
    ).join('\n')

    const context = `You are PortIQ, an AI assistant for the CFF Network platform analyzing fund manager data and user engagement.

# USER CONTEXT
Role: **${userRole}** | Email: ${user.email}
${creditsData ? `Points: ${creditsData.total_points} | AI Uses: ${creditsData.ai_usage_count} | Blogs: ${creditsData.blog_posts_count}` : ''}

# AVAILABLE DATA
${JSON.stringify(dataContext, null, 2)}

# ACCESSIBLE FIELDS (${userRole} role)
${accessibleFields}

# INSTRUCTIONS
1. **Answer precisely** using the data provided above. Cite specific numbers and examples.
2. **Format with markdown**: Use **bold**, bullet points, ### headings, and \`code\` for field names.
3. **Handle restrictions gracefully**: If data isn't available for their role, explain clearly and suggest alternatives.
4. **Be specific**: Reference actual data points (fund names, numbers, dates) from the context.
5. **Keep responses concise** but informative. Use sections for organization.
6. **Suggest follow-ups**: End with 2-3 relevant questions they can ask next.

# KEY RULES
- Admins: Full access to all data including financial details and applications
- Members: Extended fund data, network profiles, their own activity
- Viewers: Basic fund info and their own profile
- Always acknowledge when data is restricted by role
- For general knowledge (e.g., "What is IRR?"), provide clear explanations and note it's not from platform data`

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
          ...conversationHistory
        ],
      }),
    })

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI rate limit exceeded. Please try again shortly.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage credits exceeded. Please add credits to your Lovable workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const errText = await aiResponse.text()
      console.error('AI API error:', aiResponse.status, errText)
      return new Response(
        JSON.stringify({ error: 'AI gateway error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const aiData = await aiResponse.json()
    const reply = aiData.choices[0].message.content

    // Award points for AI usage (fire and forget)
    supabaseClient.rpc('award_points', {
      p_user_id: user.id,
      p_activity_type: 'ai_usage',
      p_points: 5,
      p_description: 'Used AI assistant'
    }).then(() => console.log('Points awarded')).catch(e => console.error('Failed to award points:', e))

    return new Response(
      JSON.stringify({ reply, response: reply, message: reply }),
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
