🌐 FINAL MASTER BUILD PROMPT
🔹 Project Title: Fund Manager Database – Collaborative for Frontier Finance (CFF)
 🔹 Platform: Early Stage Capital Provider (ESCP) Network

🎯 Purpose
Develop a professional, secure, and structured web platform to manage fund manager onboarding, approvals, and data profiling under the ESCP Network. The system enables:
A controlled application and admin-approval workflow


Secure signup restricted to approved users


One survey per year, editable and versioned


A powerful admin analytics dashboard


Full activity logging of user/admin actions



👥 User Roles
1. Visitor
Access the homepage


Submit an application form (admin approval required before signup)


2. Admin
Accessed via hardcoded password: CFFdbdb123#


Can:


View/manage applications


Approve/reject members


View/edit submitted surveys


Access member directory


View logs of platform activity



3. Member (Approved User)
Sign up via Supabase Auth (email + password) only after admin approval


Can:


Submit one survey per calendar year


View and edit previously submitted surveys


Browse profiles of other fund managers in the network



🌐 Pages Overview
1. Homepage
Static marketing page that explains:


Who the platform is for


Benefits of joining the ESCP Network


CTA to the application form



2. Application Form Page
Replaces basic form with the official ESCP Network Application Form, consisting of four sections.
A. Background Information
Name *


Email Address *


Vehicle Name *


Vehicle Website *


B. Team Information
Role/Job Title & Relevant Experience *


Team Size & Co-founder Details *


Team Location & Relocation Plans *


C. Vehicle Information
Investment Thesis *


Average Ticket Size (USD) *


Number of Investments Made *


Capital Raised (soft + hard commitments; include self-contribution) *


Upload Supporting Documents (PDFs, max 5 files, 10MB each) *


D. Network Expectations
Topics you're willing to share expertise on (multi-select) *


Expectations from the ESCP Network *


How did you hear about the Network? * (If "Other", allow input)


📥 All application data saved to Supabase
 🛑 Signup only possible after admin approval

3. Signup Page
Auth via Supabase email + password


Access only for emails that are whitelisted by the admin



4. Member Portal
a. Networks Page
View all fund manager profiles from submitted surveys


Filterable by:


Geography


Sector


Vehicle type


Year


Click to view full survey details


b. Survey Page
Users can submit one survey per calendar year


Select/confirm survey year before starting


Past surveys: view/edit anytime


All changes are timestamped and logged for admin review


Survey Page Features:
No autosave (must be completed in one go)


Multi-section navigation


Dropdown to view past survey years


Survey ID = user_id + survey_year



📝 Full Survey Breakdown
Section 1: Vehicle Information
Vehicle Name


Vehicle Website(s)


Vehicle Type (VC, PE, Angel, Other)


If "Other", specify


Investment Thesis *


Fund Stage (Ideation, Pilot, Scale, Implementation)



Section 2: Team & Leadership
Team Size (Minimum)


Team Size (Maximum)


Team Description *


GP Partners (Dynamic add):


Name *


Email *


Phone


Role/Position *



Section 3: Geographic & Market Focus
Legal Domicile (multi-select from global country list)


Markets Operated In (country multi-select + % allocation)



Section 4: Investment Strategy (Admin-Only View)
Minimum Ticket Size (USD)


Maximum Ticket Size (USD)


Ticket Size Description *


Target Capital (USD)


Capital Raised (USD)


Capital in Market (USD)


Dry Powder (auto-calculated = raised – in market)


First Investment Date



Section 5: Fund Operations
Supporting Document URL(s) (Admin-only)


Expectations from the Network *


How You Heard About the Network (LinkedIn, Referral, Conference, etc. If “Other”, allow free input)



Section 6: Fund Status & Timeline
Fund Stage


Current Status (free-text description)


Legal Entity Date Range


First Close Date Range



Section 7: Investment Instruments
Instrument Types: User ranks all they use (Ranked Choice UI)


Senior Debt (Secured)


Senior Debt (Unsecured)


Mezzanine / Subordinated Debt


Convertible Notes


SAFEs


Shared Revenue / Earnings Instruments


Preferred Equity


Common Equity



Section 8: Sector Focus & Returns
Sector Allocation (%):
 User assigns percentage allocation to any selected sectors. The total must add to exactly 100%.
Agri: SME / Food value chain / Agritech


Agri: Primary Agriculture


Software Services / SaaS


Clean Energy / Renewable / E-Mobility


Manufacturing


Healthcare / Medical Services


Education


Tech / Telecom / Data Infrastructure


FMCG


Logistics / Transport / Distribution


Merchandising / Retail / On-time Retail


Other Fields:
Target Return Range (%)


Equity Investments Made


Equity Investments Exited


Self-Liquidating Investments Made


Self-Liquidating Investments Exited



🔐 Admin Portal
Accessed via static hardcoded password CFFdbdb123#
1. Dashboard (Advanced enhanced Analytic dashboards)
Automatically visualize trends and key insights using all available survey data.
Includes:
Capital Raised vs Deployed


Regional Investment Activity


Sector Trends


Ticket Size Distribution


Fund Stage Distribution


Instrument Usage


Year-over-Year Trends


Target Return Ranges



2. Membership Requests
List of all pending applications


Click → View full application


Approve → Whitelist email


Reject → Disable signup for that email



3. Network Directory
List of all approved members


Filter by:


Year


Region


Sector


Instrument


Stage


Click any profile → View full survey(s)


Option to browse by Survey Year



4. Logs
Track every system event including:
Application submission


Admin approval/rejection


Signup attempt


Survey creation/edit with year


File uploads


Admin logins


Member logins


Survey deletion



🧠 Survey Page Logic
On page load:


If current year survey does not exist → Show “Start Survey”


If it does exist → Show “View/Edit Survey”


Survey ID = user_id + survey_year


Past surveys can be viewed/edited


All actions are logged for auditability



🧾 Supabase Tables
1. applications
All application fields


status (pending, approved, rejected)


2. users
Supabase Auth


Metadata (role: admin/member, approval status, etc.)


3. surveys
Fields for all 8 sections


survey_year, user_id, editable, timestamps


4. logs
Action


Actor (user/admin)


Year


Context (application/survey/login/etc)


Timestamp



🎨 Design Guidelines
Color Theme: Flat Blue, White, Black, Gold


No gradients


Icon Set: Lucide, Heroicons, Font Awesome


Frontend Framework: Next.js (preferred), fallback: React


CSS Framework: Tailwind CSS


Responsive Design: Mobile-first, tablet, and desktop breakpoints


High UX/UI polish with clear feedback on all interactions



✅ Key Features Recap
Rich application form with team, thesis, documents


Secure admin approval flow


Supabase Auth signup for approved users


One editable survey per year


Full member directory with filters


Transparent full-activity logging


Fully responsive modern UI
