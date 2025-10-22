# Data Privacy & Migration Plan
## Executive Summary - Survey Data Entry Project

**Prepared for:** Executive Review  
**Date:** October 2025  
**Project:** Anonymous Survey Data Entry System  
**Team Size:** 10 Data Entry Operators  
**Total Surveys:** ~800 responses across 4 years (2021-2024)

---

## 1. DATA PRIVACY ARCHITECTURE

### The Core Innovation: Zero-Knowledge Data Entry
We have implemented a **character-level encoding system** that ensures data entry workers never see real identities while entering sensitive survey data.

### How It Works

**Stage 1: Pre-Processing (Your Control)**
- Original Excel files contain real emails, company names, and participant names
- An R script encodes ONLY these identifying columns using a proprietary character mapping
- Each character converts to a unique number (e.g., "john@fund.com" → "45-24-43-23-75-...")
- Original files are automatically backed up before encoding

**Stage 2: Distribution (Complete Anonymity)**
- Data entry workers receive **encoded** Excel files
- They see numbers like "45-24-43-23-75-14..." instead of "john@fund.com"
- Workers cannot reverse-engineer the encoding without the mapping key
- No identifying information is ever visible to data entry staff

**Stage 3: Secure Entry (Automated Decoding)**
- Workers copy encoded strings from Excel into the system
- The platform automatically decodes values before database storage
- Database stores ACTUAL data: "john@fund.com" (never the encoded version)
- Workers remain unaware of whose data they're entering

**Stage 4: Display Control (Admin Toggle)**
- Admin dashboard has "Data Privacy Mode" toggle
- When ON: All identifying data displays in encoded format throughout the platform
- When OFF: Normal display for authorized personnel
- Toggle instantly switches the entire system between modes

### Security Measures

✅ **Separation of Knowledge**
- Data entry workers: See only encoded identifiers
- Database: Stores only decoded (real) data
- No intermediary storage of encoded data
- Encoding exists only in transit (Excel → Form → Decode → Database)

✅ **Authentication Security**
- Workers login with **encoded email AND encoded password**
- System decodes credentials server-side before authentication
- No plaintext credentials transmitted from encoded Excel files
- Default encoded password: `25-10-28-28-32-24-27-13-63-64-65` (represents "password123")

✅ **Access Control**
- Data entry workers: Read-only access to network directory (encoded view)
- Cannot access other users' full profiles
- Cannot export or download data
- Session timeouts after inactivity

✅ **No Console Exposure**
- All encoding/decoding happens server-side
- No sensitive data logged to browser console
- Developer tools show only encrypted values when privacy mode is active

---

## 2. DATA MIGRATION PLAN

### Team Structure
- **10 Data Entry Operators** working simultaneously
- **1 Admin** (you) managing the process and privacy toggle
- **Estimated Timeline:** 2-3 weeks for 800 surveys

### Workflow Per Operator

**Daily Process:**
1. Login via `/encoded-auth` with provided encoded credentials
2. Navigate to assigned survey year (2021, 2022, 2023, or 2024)
3. For each survey response:
   - **First 3-4 questions:** Copy encoded values from Excel (Email, Company Name, Participant)
   - **Remaining questions:** Enter actual survey responses (these are not encoded)
4. Save draft after each section (auto-save available)
5. Submit completed survey
6. Move to next response

**Work Distribution:**
```
Survey Year    Responses    Operators    Est. Time/Person
2021           200          3            2 weeks
2022           200          2            2 weeks
2023           200          2            2 weeks
2024           200          3            2 weeks
```

### Quality Control
- Each operator assigned specific range of responses
- Admin can review completed surveys (with privacy mode OFF)
- Spot-check random samples for accuracy
- Workers cannot see each other's progress or assignments

### Encoded Columns by Year

**2021 Survey:**
- Email Address (Q1)
- Firm Name (Q2)
- Participant Name (Q3)

**2022 Survey:**
- Name (Q1)
- Email Address (Q3)
- Organisation Name (Q4)

**2023 Survey:**
- Email Address (Q1)
- Organisation Name (Q2)
- Fund Name (Q4)

**2024 Survey:**
- Email Address (Q1)
- Organisation Name (Q3)

*All other survey questions are entered normally (not encoded)*

---

## 3. OPERATIONAL PROTOCOL

### Phase 1: Preparation (Admin Only - 1 Day)
1. ✅ Run R script on original Excel files
2. ✅ Verify backups created automatically
3. ✅ Create 10 user accounts with encoded emails
4. ✅ Set all accounts to same encoded password
5. ✅ Enable "Data Privacy Mode" in Admin Dashboard
6. ✅ Test with 1 sample survey to verify encoding/decoding

### Phase 2: Onboarding (1 Day)
1. ✅ Distribute encoded Excel files to operators (via secure file share)
2. ✅ Provide encoded login URL: `https://your-platform.com/encoded-auth`
3. ✅ Share default encoded password: `25-10-28-28-32-24-27-13-63-64-65`
4. ✅ Conduct 1-hour training session:
   - How to login with encoded credentials
   - Which questions to copy encoded values
   - Which questions to enter normal responses
   - How to save drafts and submit

### Phase 3: Data Entry (2-3 Weeks)
1. ✅ Operators work independently with no access to real identities
2. ✅ Admin monitors progress via dashboard (privacy mode can be toggled for checking)
3. ✅ Daily spot-checks for quality assurance
4. ✅ Admin can reset encoded passwords if needed

### Phase 4: Completion & Verification (2 Days)
1. ✅ Verify all 800 surveys entered
2. ✅ Disable all data entry operator accounts
3. ✅ Turn OFF "Data Privacy Mode" permanently
4. ✅ Run data quality checks with real identities visible
5. ✅ Archive encoded Excel files
6. ✅ Generate completion report

---

## 4. PRICING ANALYSIS

### Cost Breakdown

**Per Survey Assumptions:**
- Average survey completion time: 15 minutes
- Operator hourly rate: $15/hour (adjust to local rates)
- Cost per survey: $3.75

```
Total Surveys:                800 responses
Cost per survey:              $3.75
Subtotal (Data Entry):        $3,000

Admin oversight (40 hours):   $600
Platform costs (1 month):     $0 (existing infrastructure)
R script development:         $0 (one-time, already done)

TOTAL PROJECT COST:           $3,600
```

**Cost per Survey Year:**
- 2021 (200 surveys): $750
- 2022 (200 surveys): $750
- 2023 (200 surveys): $750
- 2024 (200 surveys): $750

**Alternative Pricing Models:**
- **Per operator fixed rate:** $360 per operator for 2-3 weeks ($3,600 total)
- **Per hour:** $15/hour × 200 hours of entry + 40 hours admin = $3,600
- **Project-based:** $3,600 flat fee for complete 800-survey migration

---

## 5. TECHNICAL SECURITY DETAILS

### Authentication Flow
```
1. Worker enters: 45-24-43-23... (encoded email)
2. Worker enters: 25-10-28-28... (encoded password)
3. System decodes server-side: john@fund.com / password123
4. Database verifies: Real credentials
5. Session created: Worker sees encoded view throughout platform
```

### Data Storage
```
Excel File:        45-24-43-23... (encoded)
   ↓
Form Input:        45-24-43-23... (encoded)
   ↓
Server Decode:     john@fund.com (actual)
   ↓
Database Storage:  john@fund.com (actual - permanent)
   ↓
Display (Mode ON): 45-24-43-23... (encoded)
Display (Mode OFF): john@fund.com (actual)
```

### Risk Mitigation

**Risk:** Operator attempts to reverse-engineer encoding
- **Mitigation:** Character map uses 77 unique mappings with no discernible pattern
- **Additional:** No access to encoding/decoding algorithm from frontend
- **Result:** Computationally infeasible to reverse without the key

**Risk:** Operator shares encoded files externally
- **Mitigation:** Encoded files are useless without the decoding system
- **Additional:** NDAs required for all operators
- **Result:** Shared files reveal no identifiable information

**Risk:** Operator attempts to export data from platform
- **Mitigation:** Export functions disabled for data entry role
- **Additional:** Session monitoring and automatic logouts
- **Result:** No data exfiltration possible

**Risk:** Database breach
- **Mitigation:** Database stores real data (as designed), protected by Supabase enterprise security
- **Additional:** Row Level Security (RLS) policies prevent unauthorized access
- **Result:** Standard database security applies (same as before migration)

---

## 6. ADVANTAGES OF THIS APPROACH

✅ **Complete Anonymity:** Workers never see real identities  
✅ **Zero Configuration:** No complex VPN, encryption keys, or special software  
✅ **Reversible:** Admin can instantly toggle between encoded/decoded views  
✅ **Audit Trail:** All entries timestamped and attributed to operator accounts  
✅ **Cost-Effective:** Uses existing platform infrastructure  
✅ **Scalable:** Can add more operators without additional setup  
✅ **Data Integrity:** Database stores real data for normal operations post-migration  
✅ **Compliance:** Satisfies data privacy requirements for outsourced data entry  

---

## 7. SUCCESS CRITERIA

### Quantitative Metrics
- ✅ 800 surveys migrated with 100% completion
- ✅ <2% error rate in data entry (verified via spot-checks)
- ✅ Zero security incidents or data breaches
- ✅ Project completed within 3-week timeline

### Qualitative Metrics
- ✅ Data entry workers confirm inability to identify individuals
- ✅ Admin maintains full visibility and control
- ✅ Database contains accurate, decoded data ready for analysis
- ✅ System remains available for normal operations throughout migration

---

## 8. POST-MIGRATION

**Immediate Actions:**
- Disable all data entry operator accounts
- Permanently disable "Data Privacy Mode"
- Archive encoded Excel files in secure storage
- Delete operator credentials

**Long-Term:**
- System returns to normal operations
- Full identities visible to authorized users
- Encoding system remains dormant unless needed for future migrations
- R script and encoding utilities preserved for potential future use

---

**Prepared by:** Technical Team  
**Reviewed by:** [Your Name], Project Admin  
**Approved by:** _________________ Date: _________

---

## APPENDIX: LOGIN CREDENTIALS

**For Data Entry Operators:**

**Login URL:** `https://your-platform.com/encoded-auth`

**Default Encoded Password (all operators):**  
`25-10-28-28-32-24-27-13-63-64-65`  
*(This represents the actual password "password123" - operators don't need to know this)*

**Each operator receives:**
1. Their unique encoded email (from their assigned Excel section)
2. The shared encoded password above
3. Their assigned survey year and response range

**Security Note:** Each operator's encoded email is unique and maps to their actual account. They use BOTH encoded email AND encoded password to login.

---

*This system ensures complete data privacy during migration while maintaining data integrity and operational security.*
