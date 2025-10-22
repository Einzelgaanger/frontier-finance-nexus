# Supabase Auth Email Template Configuration

## How to Use These Email Templates with Supabase

### 1. Upload Templates to Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Email Templates**
3. Select **Confirm signup** template
4. Replace the default template with the content from `confirm-signup-simple.html`

### 2. Template Variables

The templates use the following Supabase Auth variables:
- `{{ .ConfirmationURL }}` - The confirmation link
- `{{ .SiteURL }}` - Your site URL (if needed)
- `{{ .Email }}` - User's email address (if needed)

### 3. Customization Options

#### Logo Integration
To add your actual logo:
1. Host your logo image on a CDN or your domain
2. Replace the CSS logo with: `<img src="https://yourdomain.com/logo.png" alt="CFF Logo" style="width: 80px; height: 80px;">`

#### Brand Colors
Update the gradient colors in the CSS:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Replace with your brand colors.

#### Company Information
Update the footer information with your actual:
- Company name
- Contact information
- Social media links
- Physical address

### 4. Advanced Features

#### Dynamic Content
You can add more dynamic content by using Supabase's template variables:
- `{{ .User.Name }}` - User's name
- `{{ .SiteURL }}` - Your application URL
- `{{ .RedirectTo }}` - Redirect URL after confirmation

#### A/B Testing
Create multiple versions and test which performs better:
- Version A: Current template
- Version B: Simplified version
- Version C: Different color scheme

### 5. Testing

#### Test the Template
1. Use Supabase's "Send test email" feature
2. Check rendering in different email clients:
   - Gmail
   - Outlook
   - Apple Mail
   - Mobile clients

#### Mobile Responsiveness
The templates are mobile-responsive and will work well on:
- Desktop email clients
- Mobile email apps
- Webmail interfaces

### 6. Security Considerations

#### Link Expiration
- Confirmation links expire in 24 hours by default
- This is configurable in Supabase Auth settings
- Consider your security requirements

#### HTTPS Requirements
- Ensure your site uses HTTPS
- Confirmation links must be served over HTTPS
- This is required for security

### 7. Analytics and Tracking

#### Email Open Tracking
Consider adding tracking pixels (if compliant with privacy laws):
```html
<img src="https://yourdomain.com/track?email={{ .Email }}" width="1" height="1" style="display:none;">
```

#### Click Tracking
Track confirmation link clicks:
```html
<a href="https://yourdomain.com/track-click?token={{ .ConfirmationURL }}">Confirm Account</a>
```

### 8. Compliance

#### GDPR Compliance
- Include unsubscribe links if required
- Respect user privacy preferences
- Store minimal data

#### CAN-SPAM Compliance
- Include physical address
- Clear sender identification
- Easy unsubscribe process

### 9. Backup Templates

Keep backup versions of your templates:
- `confirm-signup.html` - Full-featured version
- `confirm-signup-simple.html` - Simplified version
- `confirm-signup.txt` - Text-only version

### 10. Monitoring

#### Email Delivery
Monitor email delivery rates:
- Check Supabase Auth logs
- Monitor bounce rates
- Track spam folder placement

#### User Engagement
Track user behavior:
- Confirmation rates
- Time to confirmation
- Drop-off points
