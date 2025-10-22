import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ApplicationStatusEmailProps {
  companyName: string
  status: 'approved' | 'rejected'
  adminNotes?: string
  dashboardLink: string
}

export const ApplicationStatusEmail = ({ 
  companyName, 
  status, 
  adminNotes,
  dashboardLink 
}: ApplicationStatusEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {status === 'approved' 
        ? 'Your CFF Network membership application has been approved!' 
        : 'Update on your CFF Network membership application'}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://escpnetwork.net/CFF%20LOGO.png"
          width="150"
          height="60"
          alt="CFF Logo"
          style={logo}
        />
        <Heading style={h1}>
          {status === 'approved' 
            ? '🎉 Application Approved!' 
            : 'Application Update'}
        </Heading>
        <Text style={text}>
          Dear {companyName},
        </Text>
        {status === 'approved' ? (
          <>
            <Text style={text}>
              Congratulations! Your application for CFF Network membership has been approved.
            </Text>
            <Text style={infoBox}>
              <strong>You now have access to:</strong><br />
              • Complete survey questionnaires<br />
              • Full network directory with detailed profiles<br />
              • Industry analytics and insights<br />
              • Member-only resources and events
            </Text>
            <Link
              href={dashboardLink}
              target="_blank"
              style={button}
            >
              Access Your Dashboard
            </Link>
          </>
        ) : (
          <>
            <Text style={text}>
              Thank you for your interest in CFF Network membership. After careful review, 
              we are unable to approve your application at this time.
            </Text>
            {adminNotes && (
              <Text style={infoBox}>
                <strong>Admin Notes:</strong><br />
                {adminNotes}
              </Text>
            )}
            <Text style={text}>
              You can still access the network directory as a viewer. If you have any questions 
              or would like to discuss this decision, please don't hesitate to contact us.
            </Text>
          </>
        )}
        <Text style={footer}>
          Best regards,<br />
          The CFF Network Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ApplicationStatusEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Rubik, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
}

const logo = {
  margin: '0 auto 30px',
  display: 'block',
}

const h1 = {
  color: '#1a56db',
  fontSize: '28px',
  fontWeight: '700',
  margin: '30px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#1a56db',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'block',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 24px',
  margin: '24px 0',
}

const infoBox = {
  backgroundColor: '#f3f4f6',
  padding: '20px',
  borderRadius: '8px',
  color: '#374151',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '24px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '24px',
}
