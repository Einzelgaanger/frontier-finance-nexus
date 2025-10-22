import React from 'npm:react@18.3.1'
import { Resend } from 'npm:resend@4.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

// Application Status Email Template
interface ApplicationStatusEmailProps {
  companyName: string
  status: string
  adminNotes?: string
  dashboardLink: string
}

const ApplicationStatusEmail = ({
  companyName,
  status,
  adminNotes,
  dashboardLink,
}: ApplicationStatusEmailProps) => {
  const isApproved = status === 'approved'
  
  return (
    <Html>
      <Head />
      <Preview>
        {isApproved 
          ? 'Your CFF Network membership application has been approved!' 
          : 'Update on your CFF Network membership application'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isApproved ? '🎉 Congratulations!' : 'Application Update'}
          </Heading>
          <Text style={text}>
            Dear {companyName},
          </Text>
          <Text style={text}>
            {isApproved 
              ? 'We are pleased to inform you that your application to join the CFF Network has been approved! Welcome to our community of fund managers.'
              : `Your CFF Network membership application status has been updated to: ${status}.`}
          </Text>
          {adminNotes && (
            <>
              <Text style={{ ...text, fontWeight: 'bold', marginTop: '24px' }}>
                Message from our team:
              </Text>
              <Text style={noteBox}>{adminNotes}</Text>
            </>
          )}
          {isApproved && (
            <>
              <Text style={text}>
                You now have full access to the CFF Network platform. Log in to explore:
              </Text>
              <Text style={bulletList}>
                • Connect with other fund managers<br/>
                • Access exclusive resources and insights<br/>
                • Participate in network events<br/>
                • Share and view detailed fund information
              </Text>
              <Link href={dashboardLink} style={button}>
                Access Your Dashboard
              </Link>
            </>
          )}
          <Text style={{ ...text, marginTop: '32px' }}>
            If you have any questions, please don't hesitate to reach out to our team.
          </Text>
          <Text style={footer}>
            Best regards,<br/>
            The CFF Network Team
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f5f5dc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
}

const h1 = {
  color: '#000000',
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '32px',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
}

const noteBox = {
  backgroundColor: '#f5f5dc',
  border: '1px solid #000000',
  borderRadius: '4px',
  padding: '16px',
  color: '#333333',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '24px',
}

const bulletList = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '28px',
  marginTop: '12px',
  marginBottom: '24px',
}

const button = {
  backgroundColor: '#000000',
  color: '#f5f5dc',
  padding: '12px 32px',
  borderRadius: '4px',
  textDecoration: 'none',
  display: 'inline-block',
  fontWeight: 'bold',
  marginTop: '16px',
  marginBottom: '16px',
}

const footer = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  marginTop: '32px',
}

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
