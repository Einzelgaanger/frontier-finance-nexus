# Data Field Visibility Strategy

## Overview
This document outlines the comprehensive data visibility strategy for all survey responses across years 2021-2024 and member surveys.

## Visibility Levels

### 🌍 Public
**Who can see:** Everyone (viewers, members, admins)
**What they see:**
- Basic organizational information (fund name, organization name, fund type)
- Geographic focus and markets
- Team composition (locations, size)
- Investment stage and sector focus
- SDG alignment and gender inclusion policies
- Fund status and structure

**Rationale:** These fields help with network discovery and matching without revealing sensitive competitive information.

---

### 👥 Member
**Who can see:** Members and admins only
**What they see:**
- Investment strategy details (ticket sizes, investment thesis)
- Fund operations (AUM, fundraising targets, amounts raised)
- Portfolio metrics (number of investments, exits)
- Team experience and capabilities
- Performance expectations and forecasts
- Value-add services and unique offerings
- Pipeline sourcing strategies
- Investment timeframes and exit strategies

**Rationale:** Members should see detailed operational and strategic information to facilitate meaningful collaboration, deal flow, and knowledge sharing within the network.

---

### 🔒 Admin
**Who can see:** Admins only
**What they see:**
- Personal contact information (emails, names)
- Actual financial performance (historical returns, revenue growth)
- LP capital sources and commitments
- GP financial commitments and fee structures
- Carried interest and hurdle rates
- Fundraising challenges and barriers
- Network feedback and participation preferences
- Research participation willingness

**Rationale:** Highly sensitive competitive, financial, and personal data that should only be accessible for administrative, research, and support purposes.

---

## Survey-Specific Visibility Rules

### 2021 Survey (COVID Impact Focus)
- **Public:** Firm name, geographic focus, fund stage, sectors, SDGs, gender policies
- **Member:** Fund sizes, investment metrics, portfolio needs, COVID impacts, exit data
- **Admin:** Contact info, IRR data, capital sources, network feedback, participation preferences

### 2022 Survey (Operational Deep Dive)
- **Public:** Organization, role, geographic markets, team locations, investment stage/type, sectors
- **Member:** Timeline milestones, team size/experience, fund operations, investment strategy, portfolio metrics
- **Admin:** Contact details, financial commitments, LP sources, management fees, IRR targets, actual performance

### 2023 Survey (Comprehensive Assessment)
- **Public:** Organization, fund name, markets, team locations, business stages, sectors, SDGs, gender lens
- **Member:** Timeline, team metrics, fund construct, investment thesis, pipeline sourcing, portfolio priorities, performance forecasts, job impacts
- **Admin:** Email, LP sources, GP commitments, fees, hurdle rates, historical performance, research participation

### 2024 Survey (Latest Comprehensive)
- **Public:** Organization, fund name, networks, markets, team locations, gender metrics, business stages, sectors, SDGs
- **Member:** Timeline, team size/experience, investment approval, fund construct, investment thesis, portfolio strategy, performance forecasts, job impacts
- **Admin:** Email, LP sources, hard commitments, GP fees, hurdle rates, currency hedging, historical performance, research participation

---

## Implementation Files

### 1. `insert_comprehensive_field_visibility.sql`
**Purpose:** Complete visibility configuration for all fields
**Contains:** 300+ field visibility definitions across all survey years
**When to use:** 
- Initial setup
- After database reset
- When adding comprehensive visibility controls

**Fields covered:**
- Member surveys: 32 fields
- 2021 survey: 97 fields
- 2022 survey: 42 fields
- 2023 survey: 87 fields
- 2024 survey: 88 fields

### 2. `delete_all_data.sql`
**Purpose:** Delete all data while preserving table structures
**Contains:** Basic member_surveys visibility restoration
**When to use:**
- Database cleanup
- Testing environment reset
- Development data refresh

**Note:** After running this, execute `insert_comprehensive_field_visibility.sql` for complete survey visibility.

---

## Field Naming Convention

All survey-specific fields are prefixed with the year:
- `2021_firm_name`
- `2022_organisation`
- `2023_organisation_name`
- `2024_organisation_name`

This prevents conflicts and makes it clear which survey year the field belongs to.

---

## Usage in Application

### Checking Visibility
```sql
-- Get visibility level for a field
SELECT visibility_level 
FROM public.data_field_visibility 
WHERE field_name = '2024_fund_name';

-- Get all member-visible fields for 2024 survey
SELECT field_name 
FROM public.data_field_visibility 
WHERE field_name LIKE '2024_%' 
  AND visibility_level IN ('public', 'member');
```

### User Role Check
```sql
-- Check if user can see a field
SELECT CASE 
  WHEN visibility_level = 'public' THEN true
  WHEN visibility_level = 'member' AND get_user_role(auth.uid()) IN ('member', 'admin') THEN true
  WHEN visibility_level = 'admin' AND get_user_role(auth.uid()) = 'admin' THEN true
  ELSE false
END as can_view
FROM public.data_field_visibility
WHERE field_name = '2024_target_fund_size_current';
```

---

## Maintenance

### Adding New Survey Year
1. Create new survey table (e.g., `survey_responses_2025`)
2. Add field visibility entries with `2025_` prefix
3. Categorize fields as public/member/admin based on sensitivity
4. Update this documentation

### Modifying Visibility
```sql
-- Change a field's visibility level
UPDATE public.data_field_visibility
SET visibility_level = 'member'
WHERE field_name = '2024_some_field';
```

### Bulk Updates
```sql
-- Make all contact fields admin-only
UPDATE public.data_field_visibility
SET visibility_level = 'admin'
WHERE field_name LIKE '%email%' 
   OR field_name LIKE '%contact%'
   OR field_name LIKE '%_name' 
   AND field_name NOT LIKE '%fund_name%'
   AND field_name NOT LIKE '%organisation_name%';
```

---

## Security Considerations

1. **RLS Policies:** Field visibility works in conjunction with Row Level Security policies
2. **API Layer:** Application should respect visibility settings when displaying data
3. **Export Functions:** Data exports must filter based on user role and field visibility
4. **Audit Trail:** Consider logging when admins access admin-only fields
5. **Regular Review:** Periodically review visibility settings with stakeholders

---

## Questions & Decisions

### Why separate visibility per survey year?
Each survey has different questions and sensitivity levels. A field that's public in one year might be sensitive in another.

### Why not use RLS for field-level security?
RLS controls row access. Field visibility is a business logic layer that determines which columns to show based on user role.

### Can visibility be changed after data collection?
Yes, but consider:
- User expectations when they submitted data
- Ethical implications of changing visibility
- Communication with affected users

---

## Summary Statistics

| Visibility Level | Approximate Field Count |
|-----------------|------------------------|
| Public          | ~120 fields            |
| Member          | ~150 fields            |
| Admin           | ~80 fields             |
| **Total**       | **~350 fields**        |

**Distribution by Survey:**
- Member Surveys: 32 fields
- 2021 Survey: 97 fields  
- 2022 Survey: 42 fields
- 2023 Survey: 87 fields
- 2024 Survey: 88 fields
