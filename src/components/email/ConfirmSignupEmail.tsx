import React from 'react';

interface ConfirmSignupEmailProps {
  confirmationUrl: string;
  userEmail?: string;
  userName?: string;
}

const ConfirmSignupEmail: React.FC<ConfirmSignupEmailProps> = ({
  confirmationUrl,
  userEmail,
  userName
}) => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px 30px',
        textAlign: 'center',
        borderRadius: '12px 12px 0 0'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          CFF
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>
          Welcome to CFF Survey Platform
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          Collaborative for Frontier Finance
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '40px 30px', backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '15px' }}>
            🎉 Almost There!
          </h2>
          <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: 1.6 }}>
            Thank you for joining the Collaborative for Frontier Finance (CFF) Survey Platform. 
            We're excited to have you as part of our community focused on advancing MSME financing 
            in Africa and the Middle East.
          </p>
        </div>

        {/* CTA Section */}
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <p style={{ marginBottom: '20px', fontSize: '16px', color: '#374151' }}>
            Please confirm your email address to complete your registration:
          </p>
          <a
            href={confirmationUrl}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
          >
            ✅ Confirm Your Account
          </a>
          <p style={{ marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
            This link will expire in 24 hours for security reasons.
          </p>
        </div>

        {/* Features Section */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '30px',
          margin: '30px 0',
          borderRadius: '8px'
        }}>
          <h3 style={{
            fontSize: '18px',
            color: '#1f2937',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            🚀 What You Can Do Next
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px'
          }}>
            {[
              { icon: '📊', title: 'Complete Surveys', desc: 'Access 2022, 2023, and 2024 MSME financing surveys' },
              { icon: '📈', title: 'View Analytics', desc: 'Explore comprehensive data insights and trends' },
              { icon: '🌐', title: 'Network Access', desc: 'Connect with other LCPs and industry professionals' },
              { icon: '📋', title: 'Track Progress', desc: 'Monitor your survey completion status' }
            ].map((feature, index) => (
              <div key={index} style={{ textAlign: 'center', padding: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  margin: '0 auto 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px'
                }}>
                  {feature.icon}
                </div>
                <h4 style={{ fontSize: '14px', color: '#1f2937', marginBottom: '5px' }}>
                  {feature.title}
                </h4>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <div style={{
          backgroundColor: '#fef3c7',
          borderLeft: '4px solid #f59e0b',
          padding: '20px',
          margin: '30px 0',
          borderRadius: '0 8px 8px 0'
        }}>
          <h4 style={{ color: '#92400e', fontSize: '16px', marginBottom: '10px' }}>
            🔒 Security Notice
          </h4>
          <p style={{ color: '#92400e', fontSize: '14px' }}>
            If you didn't create an account with CFF Survey Platform, please ignore this email. 
            Your account will not be activated without email confirmation.
          </p>
        </div>

        {/* Additional Information */}
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <p><strong>Need Help?</strong></p>
          <p>If you're having trouble with the confirmation link, you can copy and paste this URL into your browser:</p>
          <p style={{
            wordBreak: 'break-all',
            backgroundColor: '#f3f4f6',
            padding: '10px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px',
            margin: '10px 0'
          }}>
            {confirmationUrl}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        backgroundColor: '#1f2937',
        color: '#9ca3af',
        padding: '30px',
        textAlign: 'center',
        borderRadius: '0 0 12px 12px'
      }}>
        <h4 style={{ color: '#ffffff', fontSize: '16px', marginBottom: '15px' }}>
          Collaborative for Frontier Finance
        </h4>
        <p style={{ fontSize: '14px', marginBottom: '10px' }}>
          Advancing MSME financing in Africa and the Middle East
        </p>
        <p style={{ fontSize: '14px', marginBottom: '20px' }}>
          📍 Global Network | 🌍 Pan-Africa & MENA Focus
        </p>
        
        <div style={{ margin: '20px 0' }}>
          <a href="#" style={{ color: '#60a5fa', textDecoration: 'none', margin: '0 10px' }}>Website</a>
          <a href="#" style={{ color: '#60a5fa', textDecoration: 'none', margin: '0 10px' }}>LinkedIn</a>
          <a href="#" style={{ color: '#60a5fa', textDecoration: 'none', margin: '0 10px' }}>Twitter</a>
          <a href="#" style={{ color: '#60a5fa', textDecoration: 'none', margin: '0 10px' }}>Contact</a>
        </div>
        
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #374151' }}>
          <p style={{ fontSize: '12px' }}>
            This email was sent to you because you signed up for the CFF Survey Platform. 
            If you have any questions, please contact our support team.
          </p>
          <p style={{ fontSize: '12px', marginTop: '10px' }}>
            © 2024 Collaborative for Frontier Finance. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSignupEmail;
