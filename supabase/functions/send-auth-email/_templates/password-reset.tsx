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

interface PasswordResetEmailProps {
  resetLink: string
}

export const PasswordResetEmail = ({ resetLink }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your CFF Network password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://escpnetwork.net/CFF%20LOGO.png"
          width="150"
          height="60"
          alt="CFF Logo"
          style={logo}
        />
        <Heading style={h1}>Reset Your Password</Heading>
        <Text style={text}>
          We received a request to reset your password for your CFF Network account.
        </Text>
        <Text style={text}>
          Click the button below to create a new password:
        </Text>
        <Link
          href={resetLink}
          target="_blank"
          style={button}
        >
          Reset Password
        </Link>
        <Text style={text}>
          Or copy and paste this link into your browser:
        </Text>
        <Text style={linkText}>{resetLink}</Text>
        <Text style={footer}>
          If you didn't request a password reset, you can safely ignore this email.
          This link will expire in 1 hour for security reasons.
        </Text>
        <Text style={footer}>
          Best regards,<br />
          The CFF Network Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PasswordResetEmail

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

const linkText = {
  color: '#1a56db',
  fontSize: '14px',
  wordBreak: 'break-all' as const,
  margin: '16px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  marginTop: '24px',
}
