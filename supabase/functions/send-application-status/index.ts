import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { ApplicationStatusEmail } from '../send-auth-email/_templates/application-status.tsx'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { applicationId, status, adminNotes } = await req.json()

    if (!applicationId || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Fetch application details
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('user_id, email, company_name')
      .eq('id', applicationId)
      .single()

    if (appError || !application) {
      console.error('Error fetching application:', appError)
      return new Response(
        JSON.stringify({ error: 'Application not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email
    const dashboardLink = `${supabaseUrl.replace('.supabase.co', '')}/dashboard`
    const html = await renderAsync(
      React.createElement(ApplicationStatusEmail, {
        companyName: application.company_name,
        status,
        adminNotes,
        dashboardLink,
      })
    )

    const { error: emailError } = await resend.emails.send({
      from: 'CFF Network <onboarding@resend.dev>',
      to: [application.email],
      subject: status === 'approved' 
        ? '🎉 Your CFF Network Membership Application Has Been Approved!' 
        : 'Update on Your CFF Network Membership Application',
      html,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      throw emailError
    }

    console.log('Application status email sent to:', application.email)

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error) {
    console.error('Error in send-application-status function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
