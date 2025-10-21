"""
2022 Survey Data Import Script
===============================
Imports 2022 survey data (277 columns) from Excel into Supabase.
Creates users, profiles, and maps all Excel columns to database.
"""

import pandas as pd
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import sys
from datetime import datetime
import time

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
DEFAULT_PASSWORD = os.getenv('DEFAULT_USER_PASSWORD', 'FrontierFinance2022!')

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def clean_text(value):
    if pd.isna(value) or value == '' or value == 'NULL':
        return None
    return str(value).strip()

def create_or_get_user(email: str, company_name: str, full_name: str = None):
    try:
        auth_response = supabase.auth.admin.create_user({
            "email": email,
            "password": DEFAULT_PASSWORD,
            "email_confirm": True,
            "user_metadata": {
                "company_name": company_name,
                "full_name": full_name or "",
                "imported_from": "2022_survey",
                "imported_at": datetime.now().isoformat()
            }
        })
        print(f"  ✓ Created new user: {email}")
        return auth_response.user.id
    except Exception as e:
        if "already registered" in str(e).lower():
            print(f"  ℹ User exists: {email}, fetching ID...")
            users_response = supabase.auth.admin.list_users()
            for user in users_response:
                if user.email == email:
                    return user.id
        print(f"  ✗ Error: {e}")
        return None

def create_user_profile(user_id: str, email: str, company_name: str, full_name: str = None, role_title: str = None):
    try:
        supabase.table('user_profiles').upsert({
            "id": user_id,
            "email": email,
            "company_name": company_name,
            "full_name": full_name,
            "role_title": role_title,
            "user_role": "member",
            "is_active": True
        }).execute()
        print(f"  ✓ Profile created: {email}")
        return True
    except Exception as e:
        print(f"  ✗ Profile error: {e}")
        return False

def map_2022_row(row, user_id: str, company_name: str, cols):
    """Map Excel row to database - uses column index for '...' columns"""
    def get(i):
        return clean_text(row.get(cols[i])) if i < len(cols) else None
    
    return {
        "user_id": user_id,
        "company_name": company_name,
        # Basic (1-5)
        "row_number": get(0), "participant_name": get(1), "role_title": get(2),
        "email_address": get(3), "organization_name": get(4),
        # Timeline (6-8)
        "timeline_legal_entity": get(5), "timeline_first_close": get(6), "timeline_first_investment": get(7),
        # Geo Markets (9-17)
        "geo_market_us": get(8), "geo_market_europe": get(9), "geo_market_africa_west": get(10),
        "geo_market_africa_east": get(11), "geo_market_africa_central": get(12), "geo_market_africa_southern": get(13),
        "geo_market_africa_north": get(14), "geo_market_middle_east": get(15), "geo_market_other": get(16),
        # Team Based (18-26)
        "team_based_us": get(17), "team_based_europe": get(18), "team_based_africa_west": get(19),
        "team_based_africa_east": get(20), "team_based_africa_central": get(21), "team_based_africa_southern": get(22),
        "team_based_africa_north": get(23), "team_based_middle_east": get(24), "team_based_other": get(25),
        # FTEs (27-29)
        "ftes_current": get(26), "ftes_forecast_2023": get(27), "principals_count": get(28),
        # GP Experience (30-45)
        "gp_exp_new_not_applicable": get(29), "gp_exp_new_one_principal": get(30), "gp_exp_new_two_plus_principals": get(31),
        "gp_exp_adjacent_not_applicable": get(32), "gp_exp_adjacent_one_principal": get(33), "gp_exp_adjacent_two_plus_principals": get(34),
        "gp_exp_business_not_applicable": get(35), "gp_exp_business_one_principal": get(36), "gp_exp_business_two_plus_principals": get(37),
        "gp_exp_direct_no_data_not_applicable": get(38), "gp_exp_direct_no_data_one_principal": get(39), "gp_exp_direct_no_data_two_plus_principals": get(40),
        "gp_exp_direct_with_data_not_applicable": get(41), "gp_exp_direct_with_data_one_principal": get(42), "gp_exp_direct_with_data_two_plus_principals": get(43),
        "gp_exp_other": get(44),
        # Gender (46-51)
        "gender_women_ownership_50_plus": get(45), "gender_women_board_50_plus": get(46), "gender_women_staffing_50_plus": get(47),
        "gender_provide_reporting": get(48), "gender_require_reporting": get(49), "gender_other": get(50),
        # Team Exp (52-63)
        "team_exp_investments_0": get(51), "team_exp_exits_0": get(52), "team_exp_investments_1_4": get(53), "team_exp_exits_1_4": get(54),
        "team_exp_investments_5_9": get(55), "team_exp_exits_5_9": get(56), "team_exp_investments_10_14": get(57), "team_exp_exits_10_14": get(58),
        "team_exp_investments_15_24": get(59), "team_exp_exits_15_24": get(60), "team_exp_investments_25_plus": get(61), "team_exp_exits_25_plus": get(62),
        # Legal & Currency (64-67)
        "legal_domicile": get(63), "legal_domicile_other": get(64), "currency_investments": get(65), "currency_lp_commitments": get(66),
        # Fund Vehicle (68-69)
        "fund_vehicle_type_status": get(67), "fund_vehicle_other": get(68),
        # Fund Size (70-87) - 18 fields
        "fund_size_under_1m_current_raised": get(69), "fund_size_under_1m_current_invested": get(70), "fund_size_under_1m_target": get(71),
        "fund_size_1_4m_current_raised": get(72), "fund_size_1_4m_current_invested": get(73), "fund_size_1_4m_target": get(74),
        "fund_size_5_9m_current_raised": get(75), "fund_size_5_9m_current_invested": get(76), "fund_size_5_9m_target": get(77),
        "fund_size_10_19m_current_raised": get(78), "fund_size_10_19m_current_invested": get(79), "fund_size_10_19m_target": get(80),
        "fund_size_20_29m_current_raised": get(81), "fund_size_20_29m_current_invested": get(82), "fund_size_20_29m_target": get(83),
        "fund_size_30m_plus_current_raised": get(84), "fund_size_30m_plus_current_invested": get(85), "fund_size_30m_plus_target": get(86),
        # Investment Details (88-91)
        "target_number_investments": get(87), "follow_on_investments": get(88), "target_irr": get(89), "target_irr_other": get(90),
        # Concessionary (92-97)
        "concessionary_none": get(91), "concessionary_pre_launch": get(92), "concessionary_ongoing_costs": get(93),
        "concessionary_first_loss": get(94), "concessionary_business_dev": get(95), "concessionary_other": get(96),
        # LP Capital (98-114) - 17 fields
        "lp_local_hnw_existing": get(97), "lp_local_hnw_target": get(98), "lp_domestic_institutional_existing": get(99), "lp_domestic_institutional_target": get(100),
        "lp_local_govt_existing": get(101), "lp_local_govt_target": get(102), "lp_intl_fund_of_funds_existing": get(103), "lp_intl_fund_of_funds_target": get(104),
        "lp_intl_institutional_existing": get(105), "lp_intl_institutional_target": get(106), "lp_dfis_existing": get(107), "lp_dfis_target": get(108),
        "lp_intl_impact_existing": get(109), "lp_intl_impact_target": get(110), "lp_donors_existing": get(111), "lp_donors_target": get(112), "lp_other": get(113),
        # GP Fees (115-123)
        "gp_financial_commitment": get(114), "gp_mgmt_fee_not_applicable": get(115), "gp_mgmt_fee_under_2_pct": get(116), "gp_mgmt_fee_2_pct": get(117),
        "gp_mgmt_fee_over_2_pct": get(118), "gp_mgmt_fee_sliding_scale": get(119), "gp_mgmt_fee_other": get(120), "carried_interest_hurdle": get(121), "carried_interest_other": get(122),
        # Barriers (124-135)
        "barrier_geography": get(123), "barrier_fund_size": get(124), "barrier_sector_alignment": get(125), "barrier_fund_mgmt_experience": get(126),
        "barrier_target_returns": get(127), "barrier_portfolio_risk": get(128), "barrier_fund_economics": get(129), "barrier_currency": get(130),
        "barrier_domicile": get(131), "barrier_back_office": get(132), "barrier_governance": get(133), "barrier_other": get(134),
        # Stage (136-139)
        "stage_startup": get(135), "stage_early": get(136), "stage_growth": get(137), "stage_other": get(138),
        # Enterprise (140-143)
        "enterprise_livelihood": get(139), "enterprise_growth": get(140), "enterprise_dynamic": get(141), "enterprise_high_growth": get(142),
        # Financing (144-149)
        "financing_venture_launch": get(143), "financing_working_capital": get(144), "financing_small_assets": get(145),
        "financing_major_capital": get(146), "financing_growth_capital": get(147), "financing_other": get(148),
        # Sectors (150-165)
        "sector_1_name": get(149), "sector_1_current_pct": get(150), "sector_1_target_pct": get(151),
        "sector_2_name": get(152), "sector_2_current_pct": get(153), "sector_2_target_pct": get(154),
        "sector_3_name": get(155), "sector_3_current_pct": get(156), "sector_3_target_pct": get(157),
        "sector_4_name": get(158), "sector_4_current_pct": get(159), "sector_4_target_pct": get(160),
        "sector_5_name": get(161), "sector_5_current_pct": get(162), "sector_5_target_pct": get(163), "sector_other": get(164),
        # Instruments (166-174)
        "instrument_senior_debt_secured": get(165), "instrument_senior_debt_unsecured": get(166), "instrument_mezzanine": get(167),
        "instrument_convertible_notes": get(168), "instrument_safes": get(169), "instrument_shared_revenue": get(170),
        "instrument_preferred_equity": get(171), "instrument_common_equity": get(172), "instrument_other": get(173),
        # SDGs (175-177)
        "sdg_first": get(174), "sdg_second": get(175), "sdg_third": get(176),
        # GLI (178-205) - 28 fields
        "gli_majority_women_not_applicable": get(177), "gli_majority_women_consideration": get(178), "gli_majority_women_requirement": get(179),
        "gli_women_senior_mgmt_not_applicable": get(180), "gli_women_senior_mgmt_consideration": get(181), "gli_women_senior_mgmt_requirement": get(182),
        "gli_women_direct_workforce_not_applicable": get(183), "gli_women_direct_workforce_consideration": get(184), "gli_women_direct_workforce_requirement": get(185),
        "gli_women_indirect_workforce_not_applicable": get(186), "gli_women_indirect_workforce_consideration": get(187), "gli_women_indirect_workforce_requirement": get(188),
        "gli_gender_equality_policies_not_applicable": get(189), "gli_gender_equality_policies_consideration": get(190), "gli_gender_equality_policies_requirement": get(191),
        "gli_women_beneficiaries_not_applicable": get(192), "gli_women_beneficiaries_consideration": get(193), "gli_women_beneficiaries_requirement": get(194),
        "gli_enterprise_reporting_not_applicable": get(195), "gli_enterprise_reporting_consideration": get(196), "gli_enterprise_reporting_requirement": get(197),
        "gli_board_representation_not_applicable": get(198), "gli_board_representation_consideration": get(199), "gli_board_representation_requirement": get(200),
        "gli_female_ceo_not_applicable": get(201), "gli_female_ceo_consideration": get(202), "gli_female_ceo_requirement": get(203), "gli_other": get(204),
        # Tech & Pipeline (206-212)
        "technology_role": get(205), "pipeline_online": get(206), "pipeline_competition": get(207), "pipeline_referral": get(208),
        "pipeline_own_accelerator": get(209), "pipeline_third_party_accelerator": get(210), "pipeline_other": get(211),
        # Investment Size & Priorities (213-224)
        "avg_investment_size": get(212), "priority_senior_mgmt": get(213), "priority_financial_mgmt": get(214), "priority_fundraising": get(215),
        "priority_working_capital": get(216), "priority_strategic_planning": get(217), "priority_product_refinement": get(218), "priority_sales_marketing": get(219),
        "priority_human_capital": get(220), "priority_operations": get(221), "priority_digitalization": get(222), "priority_other": get(223),
        # Timeframe & Exits (225-234)
        "investment_timeframe": get(224), "exit_interest_repayment": get(225), "exit_self_liquidating": get(226), "exit_dividends": get(227),
        "exit_strategic_sale": get(228), "exit_management_buyout": get(229), "exit_financial_investor": get(230), "exit_other": get(231),
        "exits_equity_count": get(232), "exits_debt_count": get(233),
        # Investment Count (235-237)
        "investments_to_date": get(234), "investments_supplement": get(235), "exits_anticipated_12m": get(236),
        # Performance (238-242)
        "perf_revenue_12m_historical": get(237), "perf_cashflow_12m_historical": get(238), "perf_revenue_12m_forecast": get(239),
        "perf_cashflow_12m_forecast": get(240), "perf_other": get(241),
        # Employment (243-247)
        "jobs_direct_cumulative": get(242), "jobs_direct_forecast": get(243), "jobs_indirect_cumulative": get(244),
        "jobs_indirect_forecast": get(245), "jobs_other": get(246),
        # Fund Priorities (248-260)
        "fund_priority_capital_raising": get(247), "fund_priority_fund_economics": get(248), "fund_priority_pipeline_dev": get(249),
        "fund_priority_coinvestment": get(250), "fund_priority_new_investments": get(251), "fund_priority_follow_on": get(252),
        "fund_priority_post_investment": get(253), "fund_priority_talent_mgmt": get(254), "fund_priority_admin_tech": get(255),
        "fund_priority_exits": get(256), "fund_priority_legal_regulatory": get(257), "fund_priority_impact_metrics": get(258), "fund_priority_other": get(259),
        # Domestic Concerns (261-268)
        "concern_domestic_political": get(260), "concern_domestic_currency": get(261), "concern_domestic_interest_rates": get(262),
        "concern_domestic_regulatory": get(263), "concern_domestic_banking": get(264), "concern_domestic_supply_chain": get(265),
        "concern_domestic_covid": get(266), "concern_domestic_other": get(267),
        # International Concerns (269-276)
        "concern_intl_political": get(268), "concern_intl_export": get(269), "concern_intl_imports": get(270),
        "concern_intl_regulatory": get(271), "concern_intl_financial_system": get(272), "concern_intl_interest_rates": get(273),
        "concern_intl_covid": get(274), "concern_intl_other": get(275),
        # Survey Interest (277)
        "survey_results_interest": get(276),
        "completed_at": datetime.now().isoformat()
    }

def import_2022_survey_data(excel_file_path: str):
    print("\n" + "="*80)
    print("2022 SURVEY DATA IMPORT (277 columns)")
    print("="*80)
    
    try:
        df = pd.read_excel(excel_file_path)
        print(f"✓ Loaded {len(df)} rows")
    except Exception as e:
        print(f"✗ Error reading file: {e}")
        return
    
    total = len(df)
    success = failed = skipped = 0
    
    print(f"\n🚀 Starting import...")
    print("-" * 80)
    
    for idx, row in df.iterrows():
        num = idx + 1
        print(f"\n[Row {num}/{total}]")
        
        email = clean_text(row.get(df.columns[3]))  # Column 4: Email
        company = clean_text(row.get(df.columns[4]))  # Column 5: Organization
        name = clean_text(row.get(df.columns[1]))  # Column 2: Name
        role = clean_text(row.get(df.columns[2]))  # Column 3: Role
        
        if not email or not company:
            print(f"  ⚠ Skipped: Missing email or company")
            skipped += 1
            continue
        
        print(f"  📧 {email}")
        print(f"  🏢 {company}")
        
        try:
            user_id = create_or_get_user(email, company, name)
            if not user_id:
                failed += 1
                continue
            
            create_user_profile(user_id, email, company, name, role)
            survey_data = map_2022_row(row, user_id, company, df.columns.tolist())
            supabase.table('survey_responses_2022').upsert(survey_data).execute()
            print(f"  ✓ Imported successfully")
            success += 1
            time.sleep(0.1)
        except Exception as e:
            print(f"  ✗ Error: {e}")
            failed += 1
    
    print("\n" + "="*80)
    print("IMPORT SUMMARY")
    print("="*80)
    print(f"Total: {total} | ✓ Success: {success} | ✗ Failed: {failed} | ⚠ Skipped: {skipped}")
    print("="*80)
    if success > 0:
        print(f"\n🎉 {success} responses imported!")
        print(f"📝 Default password: {DEFAULT_PASSWORD}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python import_2022_survey_data.py <excel_file>")
        sys.exit(1)
    
    excel_file = sys.argv[1]
    if not os.path.exists(excel_file):
        print(f"Error: File not found: {excel_file}")
        sys.exit(1)
    
    import_2022_survey_data(excel_file)
