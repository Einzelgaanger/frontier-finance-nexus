import { Resend } from 'npm:resend@4.0.0'
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

    const dashboardLink = `${supabaseUrl}/dashboard`
    const isApproved = status === 'approved'
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Application ${isApproved ? 'Approved' : 'Update'}</title>
</head>
<body style="background:#f5f5dc;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:40px 20px;">
    <h1 style="color:#000;margin:0 0 24px;font-size:24px;">${isApproved ? 'Congratulations!' : 'Application Update'}</h1>
    <p style="color:#333;font-size:16px;line-height:24px;margin:0 0 16px;">Dear ${application.company_name},</p>
    <p style="color:#333;font-size:16px;line-height:24px;margin:0 0 16px;">${isApproved
      ? 'We are pleased to inform you that your application to join the CFF Network has been approved! Welcome to our community of fund managers.'
      : `Your CFF Network membership application status has been updated to: ${status}.`}
    </p>
    ${adminNotes
      ? `<p style="color:#333;font-weight:600;margin:24px 0 8px;">Message from our team:</p>
         <div style="background:#f5f5dc;border:1px solid #000;padding:16px;border-radius:4px;color:#333;font-size:14px;line-height:20px;margin:0 0 24px;">${adminNotes}</div>`
      : ''}
    ${isApproved
      ? `<p style="color:#333;font-size:16px;line-height:24px;margin:0 0 12px;">You now have full access to the CFF Network platform. Log in to explore:</p>
         <p style="color:#333;font-size:16px;line-height:28px;margin:0 0 24px;">• Connect with other fund managers<br/>• Access exclusive resources and insights<br/>• Participate in network events<br/>• Share and view detailed fund information</p>
         <a href="${dashboardLink}" style="background:#000;color:#f5f5dc;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;font-weight:700;">Access Your Dashboard</a>`
      : ''}
    <p style="color:#333;font-size:16px;line-height:24px;margin:32px 0 0;">If you have any questions, please don't hesitate to reach out to our team.</p>
    <p style="color:#666;font-size:14px;line-height:20px;margin:16px 0 0;">Best regards,<br/>The CFF Network Team</p>
  </div>
</body>
</html>`

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
