import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Globe, Calendar, Target, DollarSign, CheckCircle, Building2, Mail } from 'lucide-react';

interface Survey2021Data {
  id: string;
  firm_name: string;
  participant_name: string;
  role_title: string;
  email_address?: string;
  team_based: string[];
  team_based_other?: string;
  geographic_focus: string[];
  geographic_focus_other?: string;
  fund_stage: string;
  fund_stage_other?: string;
  legal_entity_date: string;
  first_close_date: string;
  first_investment_date: string;
  investments_march_2020: string;
  investments_december_2020: string;
  optional_supplement?: string;
  investment_vehicle_type: string[];
  investment_vehicle_type_other?: string;
  current_fund_size: string;
  target_fund_size: string;
  investment_timeframe: string;
  business_model_targeted: string[];
  business_model_targeted_other?: string;
  business_stage_targeted: string[];
  business_stage_targeted_other?: string;
  financing_needs: string[];
  financing_needs_other?: string;
  target_capital_sources: string[];
  target_capital_sources_other?: string;
  target_irr_achieved: string;
  target_irr_targeted: string;
  impact_vs_financial_orientation: string;
  explicit_lens_focus: string[];
  explicit_lens_focus_other?: string;
  report_sustainable_development_goals: boolean;
  top_sdg_1?: string;
  top_sdg_2?: string;
  top_sdg_3?: string;
  gender_considerations_investment: string[];
  gender_considerations_investment_other?: string;
  investment_size_your_amount: string;
  investment_size_total_raise: string;
  investment_forms: string[];
  investment_forms_other?: string;
  target_sectors: string[];
  target_sectors_other?: string;
  carried_interest_principals: string;
  current_ftes: string;
  // Section 4
  portfolio_needs_ranking?: Record<string, string>;
  portfolio_needs_other?: string;
  investment_monetization: string[];
  investment_monetization_other?: string;
  exits_achieved: string;
  fund_capabilities_ranking?: Record<string, string>;
  fund_capabilities_other?: string;
  // Section 5
  covid_impact_aggregate: string;
  covid_impact_portfolio?: Record<string, Record<string, string>>;
  covid_government_support: string[];
  covid_government_support_other?: string;
  raising_capital_2021: string[];
  raising_capital_2021_other?: string;
  fund_vehicle_considerations: string[];
  fund_vehicle_considerations_other?: string;
  // Section 6
  network_value_rating: string;
  working_groups_ranking?: Record<string, string>;
  new_working_group_suggestions?: string;
  webinar_content_ranking?: Record<string, string>;
  new_webinar_suggestions?: string;
  communication_platform: string;
  network_value_areas?: Record<string, string>;
  present_connection_session: boolean;
  convening_initiatives_ranking?: Record<string, string>;
  convening_initiatives_other?: string;
  // Section 7
  participate_mentoring_program?: string;
  present_demystifying_session: string[];
  present_demystifying_session_other?: string;
  additional_comments?: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Card className="shadow-sm border-gray-200">
    <CardHeader className="pb-4">
      <CardTitle className="text-lg text-gray-800">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {children}
      </div>
    </CardContent>
  </Card>
);

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    return null;
  }
  return (
    <div className="p-4 rounded-lg border bg-white border-gray-200">
      <dt className="text-sm font-semibold text-gray-700 mb-2">{label}</dt>
      <dd className="text-base text-gray-900">{Array.isArray(value) ? value.join(', ') : value}</dd>
    </div>
  );
};

const FieldArray: React.FC<{ label: string; values?: string[] }> = ({ label, values }) => {
  if (!values || values.length === 0) return null;
  return (
    <div className="p-4 rounded-lg border bg-white border-gray-200">
      <dt className="text-sm font-semibold text-gray-700 mb-2">{label}</dt>
      <dd className="text-base text-gray-900">
        <ul className="list-disc ml-4 space-y-1">
          {values.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </dd>
    </div>
  );
};

const FieldRecord: React.FC<{ label: string; recordObj?: Record<string, string> }> = ({ label, recordObj }) => {
  if (!recordObj || Object.keys(recordObj).length === 0) return null;
  const entries = Object.entries(recordObj);
  return (
    <div className="p-4 rounded-lg border bg-white border-gray-200">
      <dt className="text-sm font-semibold text-gray-700 mb-2">{label}</dt>
      <dd className="text-base text-gray-900">
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-md">
          {entries.map(([k, v]) => (
            <div key={k} className="flex items-start justify-between p-2">
              <span className="text-sm text-gray-700 pr-3">{k}</span>
              <span className="text-sm font-medium text-gray-900">{v}</span>
            </div>
          ))}
        </div>
      </dd>
    </div>
  );
};

const FieldNestedRecord: React.FC<{ label: string; nested?: Record<string, Record<string, string>> }> = ({ label, nested }) => {
  if (!nested || Object.keys(nested).length === 0) return null;
  const outer = Object.entries(nested);
  return (
    <div className="p-4 rounded-lg border bg-white border-gray-200 lg:col-span-2">
      <dt className="text-sm font-semibold text-gray-700 mb-2">{label}</dt>
      <dd className="text-base text-gray-900 space-y-3">
        {outer.map(([k, inner]) => (
          <div key={k} className="border border-gray-100 rounded-md">
            <div className="px-3 py-2 bg-gray-50 text-sm font-medium text-gray-800">{k}</div>
            <div className="divide-y divide-gray-100">
              {Object.entries(inner).map(([ik, iv]) => (
                <div key={ik} className="flex items-start justify-between p-2">
                  <span className="text-sm text-gray-700 pr-3">{ik}</span>
                  <span className="text-sm font-medium text-gray-900">{iv}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </dd>
    </div>
  );
};

const FieldBoolean: React.FC<{ label: string; value?: boolean }> = ({ label, value }) => {
  if (value === undefined || value === null) return null;
  return (
    <div className="p-4 rounded-lg border bg-white border-gray-200">
      <dt className="text-sm font-semibold text-gray-700 mb-2">{label}</dt>
      <dd className="text-base text-gray-900">
        <Badge variant="secondary" className={value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}>
          {value ? 'Yes' : 'No'}
        </Badge>
      </dd>
    </div>
  );
};

const Survey2021Responses: React.FC<{ data: Survey2021Data; role: 'admin' | 'member' | 'viewer' }> = ({ data, role }) => {
  const isAdmin = role === 'admin';
  const isMember = role === 'member';

  // Member sees fewer sections; admin sees all
  const showAll = isAdmin;

  return (
    <div className="space-y-6">
      {/* Section 1: Background */}
      <Section title="Background Information">
        <Field label="Firm Name" value={data.firm_name} />
        <Field label="Participant Name" value={data.participant_name} />
        <Field label="Email Address" value={data.email_address} />
        <Field label="Role / Title" value={data.role_title} />
        <Field label="Team Based" value={data.team_based} />
        <Field label="Team Based (Other)" value={data.team_based_other} />
        <Field label="Geographic Focus" value={data.geographic_focus} />
        <Field label="Geographic Focus (Other)" value={data.geographic_focus_other} />
        <Field label="Fund Stage" value={data.fund_stage === 'Other' ? `${data.fund_stage} - ${data.fund_stage_other || ''}` : data.fund_stage} />
        <Field label="Legal Entity Date" value={data.legal_entity_date} />
        <Field label="First Close Date" value={data.first_close_date} />
        <Field label="First Investment Date" value={data.first_investment_date} />
      </Section>

      {/* Section 2: Investment Thesis & Capital Construct */}
      {(showAll || isMember) && (
        <Section title="Investment Thesis & Capital Construct">
          <Field label="Investments (March 2020)" value={data.investments_march_2020} />
          <Field label="Investments (December 2020)" value={data.investments_december_2020} />
          <Field label="Investment Vehicle Type" value={data.investment_vehicle_type} />
          <Field label="Investment Vehicle Type (Other)" value={data.investment_vehicle_type_other} />
          <Field label="Current Fund Size" value={data.current_fund_size} />
          <Field label="Target Fund Size" value={data.target_fund_size} />
          <Field label="Investment Timeframe" value={data.investment_timeframe} />
          <Field label="Business Models Targeted" value={data.business_model_targeted} />
          <Field label="Business Models Targeted (Other)" value={data.business_model_targeted_other} />
          <Field label="Business Stage Targeted" value={data.business_stage_targeted} />
          <Field label="Business Stage Targeted (Other)" value={data.business_stage_targeted_other} />
          <Field label="Financing Needs" value={data.financing_needs} />
          <Field label="Financing Needs (Other)" value={data.financing_needs_other} />
          <Field label="Target Capital Sources" value={data.target_capital_sources} />
          <Field label="Target Capital Sources (Other)" value={data.target_capital_sources_other} />
          <Field label="IRR Achieved" value={data.target_irr_achieved} />
          <Field label="IRR Targeted" value={data.target_irr_targeted} />
          <Field label="Impact vs Financial Orientation" value={data.impact_vs_financial_orientation} />
          <Field label="Explicit Lens Focus" value={data.explicit_lens_focus} />
          <Field label="Explicit Lens Focus (Other)" value={data.explicit_lens_focus_other} />
          <FieldBoolean label="Reports on SDGs" value={data.report_sustainable_development_goals} />
          <Field label="Top SDG #1" value={data.top_sdg_1} />
          <Field label="Top SDG #2" value={data.top_sdg_2} />
          <Field label="Top SDG #3" value={data.top_sdg_3} />
          <Field label="Gender Considerations in Investment" value={data.gender_considerations_investment} />
          <Field label="Gender Considerations (Other)" value={data.gender_considerations_investment_other} />
        </Section>
      )}

      {/* Section 3: Portfolio Construction and Team */}
      {showAll && (
        <Section title="Portfolio Construction & Team">
          <Field label="Investment Size (Your Amount)" value={data.investment_size_your_amount} />
          <Field label="Investment Size (Total Raise)" value={data.investment_size_total_raise} />
          <Field label="Investment Forms" value={data.investment_forms} />
          <Field label="Investment Forms (Other)" value={data.investment_forms_other} />
          <Field label="Target Sectors" value={data.target_sectors} />
          <Field label="Target Sectors (Other)" value={data.target_sectors_other} />
          <Field label="Carried Interest Principals" value={data.carried_interest_principals} />
          <Field label="Current FTEs" value={data.current_ftes} />
        </Section>
      )}

      {/* Section 4: Portfolio Development & Investment Return Monetization */}
      {showAll && (
        <Section title="Portfolio Development & Investment Return Monetization">
          <FieldRecord label="Portfolio Needs Ranking" recordObj={data.portfolio_needs_ranking} />
          <Field label="Portfolio Needs (Other)" value={data.portfolio_needs_other} />
          <FieldArray label="Investment Monetization Methods" values={data.investment_monetization} />
          <Field label="Investment Monetization (Other)" value={data.investment_monetization_other} />
          <Field label="Exits Achieved" value={data.exits_achieved} />
          <FieldRecord label="Fund Capabilities Ranking" recordObj={data.fund_capabilities_ranking} />
          <Field label="Fund Capabilities (Other)" value={data.fund_capabilities_other} />
        </Section>
      )}

      {/* Section 5: Impact of COVID-19 on Vehicle and Portfolio */}
      {showAll && (
        <Section title="Impact of COVID-19 on Vehicle and Portfolio">
          <Field label="Overall COVID-19 Impact" value={data.covid_impact_aggregate} />
          <FieldNestedRecord label="Portfolio COVID Impact (by dimension)" nested={data.covid_impact_portfolio} />
          <FieldArray label="Government Support Received" values={data.covid_government_support} />
          <Field label="Government Support (Other)" value={data.covid_government_support_other} />
          <FieldArray label="Raising Capital in 2021" values={data.raising_capital_2021} />
          <Field label="Raising Capital (Other)" value={data.raising_capital_2021_other} />
          <FieldArray label="Fund Vehicle Considerations" values={data.fund_vehicle_considerations} />
          <Field label="Fund Vehicle Considerations (Other)" value={data.fund_vehicle_considerations_other} />
        </Section>
      )}

      {/* Section 6: Feedback on ESCP Network Membership */}
      {showAll && (
        <Section title="Feedback on ESCP Network Membership">
          <Field label="Network Value Rating" value={data.network_value_rating} />
          <FieldRecord label="Working Groups Priority" recordObj={data.working_groups_ranking} />
          <Field label="New Working Group Suggestions" value={data.new_working_group_suggestions} />
          <FieldRecord label="Webinar Content Priority" recordObj={data.webinar_content_ranking} />
          <Field label="New Webinar Suggestions" value={data.new_webinar_suggestions} />
          <Field label="Preferred Communication Platform" value={data.communication_platform} />
          <FieldRecord label="Network Value Areas" recordObj={data.network_value_areas} />
          <FieldBoolean label="Willing to Present Connection Session" value={data.present_connection_session} />
          <FieldRecord label="Convening Initiatives Priority" recordObj={data.convening_initiatives_ranking} />
          <Field label="Convening Initiatives (Other)" value={data.convening_initiatives_other} />
        </Section>
      )}

      {/* Section 7: 2021 Convening Objectives & Goals */}
      {showAll && (
        <Section title="2021 Convening Objectives & Goals">
          <Field label="Participate in Mentoring Program" value={data.participate_mentoring_program} />
          <FieldArray label="Demystifying Session Topics" values={data.present_demystifying_session} />
          <Field label="Demystifying Session (Other)" value={data.present_demystifying_session_other} />
          <Field label="Additional Comments" value={data.additional_comments} />
        </Section>
      )}
    </div>
  );
};

export default Survey2021Responses;


