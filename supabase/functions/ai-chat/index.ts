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

    // Build comprehensive data context based on role
    const dataContext: any = {}

    // ============================================================================
    // SURVEY DATA (2021-2024)
    // ============================================================================
    const surveyYears = [2021, 2022, 2023, 2024]
    dataContext.surveys = {}

    for (const year of surveyYears) {
      const { data, error } = await supabaseClient
        .from(`survey_responses_${year}`)
        .select('*')
        .eq('submission_status', 'completed')

      if (!error && data && data.length > 0) {
        const yearFields = visibleFields.filter(f => f.table_name === `survey_responses_${year}`)
        
        // If there are specific visible fields for this table, filter to those
        // Otherwise, provide a summary with basic metadata
        if (yearFields.length > 0) {
          dataContext.surveys[year] = data.map(response => {
            const filtered: any = {
              id: response.id,
              email_address: response.email_address || response.email,
              organisation_name: response.organisation_name || response.organization_name || response.firm_name,
              fund_name: response.fund_name
            }
            yearFields.forEach(field => {
              if (response[field.field_name] !== undefined) {
                filtered[field.field_name] = response[field.field_name]
              }
            })
            return filtered
          })
        } else {
          // Provide summary info even if no specific fields visible
          dataContext.surveys[year] = {
            count: data.length,
            sample_fund_names: data.slice(0, 5).map((r: any) => r.fund_name || r.organisation_name || r.firm_name).filter(Boolean)
          }
        }
      }
    }

    // Add survey summary
    dataContext.survey_summary = {
      total_responses: Object.values(dataContext.surveys).reduce((acc: number, yearData: any) => {
        return acc + (Array.isArray(yearData) ? yearData.length : (yearData?.count || 0))
      }, 0),
      years_with_data: Object.keys(dataContext.surveys).filter(year => {
        const yearData = dataContext.surveys[year]
        return Array.isArray(yearData) ? yearData.length > 0 : (yearData?.count || 0) > 0
      })
    }

    // ============================================================================
    // USER CREDITS & GAMIFICATION (all roles can see their own)
    // ============================================================================
    if (visibleFields.some(f => f.table_name === 'user_credits')) {
      const { data: creditsData } = await supabaseClient
        .from('user_credits')
        .select('total_points, ai_usage_count, blog_posts_count, login_streak')
        .eq('user_id', user.id)
        .maybeSingle()

      if (creditsData) {
        dataContext.user_credits = creditsData
      }

      // Leaderboard for members and admins
      if (userRole === 'member' || userRole === 'admin') {
        const { data: leaderboard } = await supabaseClient
          .from('user_credits')
          .select('user_id, total_points, ai_usage_count, blog_posts_count, login_streak')
          .order('total_points', { ascending: false })
          .limit(50)

        if (leaderboard) {
          dataContext.leaderboard = leaderboard
        }
      }
    }

    // ============================================================================
    // ACTIVITY LOG (users can see their own, admins can see all)
    // ============================================================================
    if (visibleFields.some(f => f.table_name === 'activity_log')) {
      if (userRole === 'admin') {
        const { data: activityData } = await supabaseClient
          .from('activity_log')
          .select('user_id, activity_type, points_earned, created_at, description')
          .order('created_at', { ascending: false })
          .limit(100)

        if (activityData) {
          dataContext.activity_log = activityData
        }
      } else {
        const { data: activityData } = await supabaseClient
          .from('activity_log')
          .select('activity_type, points_earned, created_at, description')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (activityData) {
          dataContext.my_activity = activityData
        }
      }
    }

    // ============================================================================
    // APPLICATIONS (admin only)
    // ============================================================================
    if (userRole === 'admin' && visibleFields.some(f => f.table_name === 'applications')) {
      const { data: applicationsData } = await supabaseClient
        .from('applications')
        .select('company_name, applicant_name, email, status, created_at, vehicle_name, investment_thesis')
        .order('created_at', { ascending: false })

      if (applicationsData) {
        dataContext.applications = applicationsData
      }
    }

    // ============================================================================
    // BLOGS (all authenticated users can see published blogs)
    // ============================================================================
    if (visibleFields.some(f => f.table_name === 'blogs')) {
      const { data: blogsData } = await supabaseClient
        .from('blogs')
        .select('title, content, created_at, user_id')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(50)

      if (blogsData) {
        dataContext.blogs = blogsData
      }
    }

    // ============================================================================
    // USER PROFILES (members and admins can see network profiles)
    // ============================================================================
    if ((userRole === 'member' || userRole === 'admin') && visibleFields.some(f => f.table_name === 'user_profiles')) {
      const profileFields = visibleFields.filter(f => f.table_name === 'user_profiles')
      const selectFields = profileFields.map(f => f.field_name).join(', ')
      
      const { data: profilesData } = await supabaseClient
        .from('user_profiles')
        .select(selectFields)

      if (profilesData) {
        dataContext.network_profiles = profilesData
      }
    }

    // Build comprehensive context for AI
    const context = `
You are PortIQ, the AI assistant for the CFF (Capital for the Continent) Network platform. You help users understand and analyze fund manager data, track their engagement, and answer questions about the network.

# USER INFORMATION
- User ID: ${user.id}
- User Role: ${userRole}
- Email: ${user.email}

# ROLE PERMISSIONS
**Admin**: Full access to all data including sensitive financial information, contact details, applications, and system-wide analytics.
**Member**: Access to extended fund information, network profiles, team details, investment strategies, blogs, and their own gamification data.
**Viewer**: Access to basic public information about funds and their own profile.

# DATABASE STATUS
${dataContext.survey_summary ? `
**Survey Data Available**: ${dataContext.survey_summary.total_responses} total completed survey responses across ${dataContext.survey_summary.years_with_data.join(', ')}.
` : 'No survey data available.'}

# AVAILABLE DATA CONTEXT
You have access to the following data based on the user's role (${userRole}):

${JSON.stringify(dataContext, null, 2)}

# VISIBLE FIELDS BY TABLE
The user can access these specific fields:
${visibleFields.length > 0 ? visibleFields.map(f => `- ${f.table_name}.${f.field_name} (${f.field_category})${f.survey_year ? ` [${f.survey_year}]` : ''}`).join('\n') : 'Limited field visibility for viewer role.'}

# IMPORTANT FORMATTING RULES
1. **Use markdown formatting** for all responses:
   - **Bold** important terms with **double asterisks**
   - Use bullet points with - or *
   - Use numbered lists with 1. 2. 3.
   - Use ### for section headings
   - Use \`code\` for field names or technical terms
   
2. **Structure your responses**:
   - Start with a brief summary
   - Use sections for different aspects
   - End with actionable insights or suggestions

# INSTRUCTIONS
1. **Answer using available data**: Base your responses on the data context provided above. Be specific and cite numbers when relevant.

2. **Handle restricted data gracefully**: If the user asks about data they cannot access, politely explain:
   - "I don't have access to that information with your current **${userRole}** role."
   - For viewers: Suggest they contact an admin about member access.
   - For members: Explain that financial details are admin-only.

3. **Multi-table queries**: You can answer questions that span multiple data sources:
   - "Show me funds from 2024 survey in East Africa"
   - "How many members have earned over 100 points?"
   - "What are the top sectors in the 2023 survey?"
   - "Show me pending applications" (admin only)

4. **Gamification queries**:
   - Users can ask about their own points, streaks, and activity
   - Members/admins can ask about leaderboards
   - Suggest ways to earn more points

5. **General knowledge**: For questions outside the dataset (e.g., "What is IRR?"), provide helpful explanations and clearly note the answer isn't from platform data.

6. **Be conversational and helpful**: Keep answers clear, concise, and actionable. Use bullet points for lists. Highlight interesting insights.

7. **Suggest follow-up queries**: After answering, suggest 2-3 related questions the user might find interesting based on their role.

# EXAMPLES OF WELL-FORMATTED RESPONSES

**Example 1: Survey Data Query**
### Survey Data Overview

I found **${dataContext.survey_summary?.total_responses || 0}** completed survey responses in the database across multiple years.

**Available Years:**
${dataContext.survey_summary?.years_with_data?.map((y: string) => `- **${y}**: Survey data available`).join('\n') || '- No data currently available'}

**What you can ask:**
- Specific fund information by year
- Geographic distribution of funds
- Sector focus trends
- Investment strategies and sizes

**Example 2: Restricted Access**
I understand you're looking for **financial details**, but as a **${userRole}**, I only have access to basic fund information. For detailed financial data like fund sizes, IRR targets, or LP commitments, you would need **member** or **admin** access.

**What I can help with:**
- Fund names and organizations
- General investment focus
- Geographic markets
- Public information

Would you like to know more about what information is available to you?
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
