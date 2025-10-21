"""
2021 SURVEY DATA MIGRATION SCRIPT WITH SUPABASE AUTH
Migrates Excel data to PostgreSQL survey_responses_2021 table
Creates authenticated users via Supabase Auth API
Groups responses by company (firm_name as unique identifier)

Run: python migrate_2021_survey.py
"""

import pandas as pd
from datetime import datetime
import logging
import sys
from typing import List, Dict, Any, Optional, Tuple
import requests
import json
from collections import defaultdict
import time
import certifi
import ssl
from supabase import create_client, Client

# Configure logging with UTF-8 encoding for Windows
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('migration_2021.log', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Fix Windows console encoding
import sys
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')


class SupabaseAuthManager:
    """Handles Supabase Authentication API operations"""
    
    def __init__(self, supabase_url: str, service_role_key: str):
        self.supabase_url = supabase_url.rstrip('/')
        self.service_role_key = service_role_key
        self.auth_url = f"{self.supabase_url}/auth/v1/admin/users"
        self.headers = {
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
            "Content-Type": "application/json"
        }
        
        # Create a session with SSL verification
        self.session = requests.Session()
        self.session.verify = certifi.where()
    
    def create_user(self, email: str, password: str, metadata: Dict = None) -> Optional[str]:
        """Create a new user in Supabase Auth and return user_id"""
        try:
            payload = {
                "email": email,
                "password": password,
                "email_confirm": True,  # Auto-confirm email
                "user_metadata": metadata or {}
            }
            
            response = self.session.post(
                self.auth_url,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200 or response.status_code == 201:
                user_data = response.json()
                user_id = user_data.get('id')
                logger.info(f"  [OK] Created user: {email} (ID: {user_id})")
                return user_id
            elif response.status_code == 422:
                # User already exists, try to get existing user
                logger.warning(f"  [!] User already exists: {email}, fetching existing user...")
                return self.get_user_by_email(email)
            else:
                logger.error(f"  [X] Failed to create user {email}: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"  [X] Error creating user {email}: {e}")
            return None
    
    def get_user_by_email(self, email: str) -> Optional[str]:
        """Get existing user ID by email"""
        try:
            # List all users and find by email
            url = f"{self.supabase_url}/auth/v1/admin/users"
            response = self.session.get(url, headers=self.headers, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                users = data.get('users', [])
                for user in users:
                    if user.get('email', '').lower() == email.lower():
                        user_id = user.get('id')
                        logger.info(f"  [OK] Found existing user: {email} (ID: {user_id})")
                        return user_id
            
            logger.warning(f"  [!] Could not find existing user: {email}")
            return None
            
        except Exception as e:
            logger.error(f"  [X] Error fetching user {email}: {e}")
            return None


class Survey2021Migrator:
    """Handles migration of 2021 survey data from Excel to PostgreSQL"""
    
    # Column mapping: Excel column name -> SQL column name
    COLUMN_MAPPING = {
        'Timestamp': 'timestamp',
        'Email Address': 'email_address',
        '1. Name of firm': 'firm_name',
        '2. Name of participant': 'participant_name',
        '3. Role / title of participant': 'role_title',
        '4. Where is your team based?': 'team_based',
        '5. What is the geographic focus of your fund/vehicle?': 'geographic_focus',
        '6. What is the stage of your current fund/vehicle\'s operations?': 'fund_stage',
        
        # Timeline columns (9-22)
        '7. When did your current fund/investment vehicle achieve each of the following? [N/A]': 'timeline_na',
        '7. When did your current fund/investment vehicle achieve each of the following? [Prior to 2000]': 'timeline_prior_2000',
        '7. When did your current fund/investment vehicle achieve each of the following? [2000-2010]': 'timeline_2000_2010',
        '7. When did your current fund/investment vehicle achieve each of the following? [2011]': 'timeline_2011',
        '7. When did your current fund/investment vehicle achieve each of the following? [2012]': 'timeline_2012',
        '7. When did your current fund/investment vehicle achieve each of the following? [2013]': 'timeline_2013',
        '7. When did your current fund/investment vehicle achieve each of the following? [2014]': 'timeline_2014',
        '7. When did your current fund/investment vehicle achieve each of the following? [2015]': 'timeline_2015',
        '7. When did your current fund/investment vehicle achieve each of the following? [2016]': 'timeline_2016',
        '7. When did your current fund/investment vehicle achieve each of the following? [2017]': 'timeline_2017',
        '7. When did your current fund/investment vehicle achieve each of the following? [2018]': 'timeline_2018',
        '7. When did your current fund/investment vehicle achieve each of the following? [2019]': 'timeline_2019',
        '7. When did your current fund/investment vehicle achieve each of the following? [2020]': 'timeline_2020',
        '7. When did your current fund/investment vehicle achieve each of the following? [2021]': 'timeline_2021',
        
        # Investment columns (23-28)
        '8. Please specify the number of investments made to date by your current vehicle [0]': 'investments_0',
        '8. Please specify the number of investments made to date by your current vehicle [1-4]': 'investments_1_4',
        '8. Please specify the number of investments made to date by your current vehicle [5-9]': 'investments_5_9',
        '8. Please specify the number of investments made to date by your current vehicle [10-14]': 'investments_10_14',
        '8. Please specify the number of investments made to date by your current vehicle [15-24]': 'investments_15_24',
        '8. Please specify the number of investments made to date by your current vehicle [25+]': 'investments_25_plus',
        
        # Vehicle info columns (29-37)
        '9. Optional supplement to question above - if no direct investments made to date please specify (eg warehoused investments, facilitated 3rd party investment eg with angel investors etc)': 'optional_supplement',
        '10. Type of investment vehicle': 'investment_vehicle_type',
        '11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [< $1 million]': 'fund_size_under_1m',
        '11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$1-4 million]': 'fund_size_1_4m',
        '11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$5-9 million]': 'fund_size_5_9m',
        '11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$10-19 million]': 'fund_size_10_19m',
        '11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$20-29 million]': 'fund_size_20_29m',
        '11. What is the current (hard commitments raised) and target size of your fund / investment vehicle? [$30 million or more]': 'fund_size_30m_plus',
        '12. Typical investment timeframe': 'investment_timeframe',
        
        # Business model columns (38-49)
        '13. Type of business model targeted': 'business_model_targeted',
        '14. Stage of business model targeted': 'business_stage_targeted',
        '15. Key financing needs of portfolio enterprises (at time of initial investment/funding)': 'financing_needs',
        '16.\tTarget sources of capital for your fund': 'target_capital_sources',
        '17.\tWhat is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [< or = 5%]': 'target_irr_under_5',
        '17.\tWhat is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [6-9%]': 'target_irr_6_9',
        '17.\tWhat is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [10-15%]': 'target_irr_10_15',
        '17.\tWhat is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [16-20%]': 'target_irr_16_20',
        '17.\tWhat is your target Internal Rate of Return (IRR) for investors (in USD equivalent)? [20%+]': 'target_irr_20_plus',
        '18. How would you frame the impact vs financial return orientation of your capital vehicle?': 'impact_vs_financial_orientation',
        '19.\tDoes your fund/vehicle have an explicit lens/focus?': 'explicit_lens_focus',
        '20. Does your fund/investment vehicle specifically report any Sustainable Development Goals?': 'report_sdgs',
        
        # SDG columns (50-66)
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [No Poverty]': 'sdg_no_poverty',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Zero Hunger]': 'sdg_zero_hunger',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Good Health and Well-Being]': 'sdg_good_health',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Quality Education]': 'sdg_quality_education',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Gender Equality]': 'sdg_gender_equality',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Clean Water and Sanitation]': 'sdg_clean_water',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Affordable and Clean Energy]': 'sdg_clean_energy',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Decent Work and Economic Growth]': 'sdg_decent_work',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Industry Innovation and Infrastructure]': 'sdg_industry_innovation',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Reduced Inequalities]': 'sdg_reduced_inequalities',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Sustainable Cities and Communities]': 'sdg_sustainable_cities',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Responsible Consumption and Production]': 'sdg_responsible_consumption',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Climate Action]': 'sdg_climate_action',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Life Below Water]': 'sdg_life_below_water',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Life on Land]': 'sdg_life_on_land',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Peace, Justice, and Strong Institutions]': 'sdg_peace_justice',
        '21. If yes, please list the top 3 Sustainable Development Goals (or as many as apply): [Partnerships for the Goals]': 'sdg_partnerships',
        
        # Gender columns (67-77)
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Majority women ownership (>50%)]': 'gender_majority_women_ownership',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Greater than 33% of women in senior management]': 'gender_women_senior_mgmt',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Women represent at least 33% - 50% of direct workforce]': 'gender_women_direct_workforce',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Women represent at least 33% - 50% of indirect workforce (e.g. supply chain/distribution channel, or both)]': 'gender_women_indirect_workforce',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Have policies in place that promote gender equality (e.g. equal compensation)]': 'gender_equality_policies',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Women are target beneficiaries of the product/service]': 'gender_women_beneficiaries',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Enterprise reports on specific gender related indicators to investors]': 'gender_reporting_indicators',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Board member female representation (>33%)]': 'gender_board_representation',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Female CEO]': 'gender_female_ceo',
        '22. Do any of the following gender considerations apply when making investment/financing considerations? [Other]': 'gender_other',
        '23. Do any of the following apply to your fund/vehicle?': 'gender_fund_vehicle',
        
        # Investment size columns (78-83)
        '24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [<$100,000]': 'investment_size_under_100k',
        '24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [$100,000 - $199,000]': 'investment_size_100k_199k',
        '24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [$200,000 - $499,000]': 'investment_size_200k_499k',
        '24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [$500,000 - $999,000]': 'investment_size_500k_999k',
        '24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [$1,000,000 - $1,999,000]': 'investment_size_1m_2m',
        '24. What is the typical size of investment in your portfolio companies at the time of initial investment (in USD)? [≥$2,000,000]': 'investment_size_2m_plus',
        
        # Portfolio columns (84-87)
        '25.\tWhat forms of investment do you typically make?': 'investment_forms',
        '26.\tWhat are your target investment sectors/focus areas?': 'target_sectors',
        '27.\tNumber of current carried-interest/equity-interest principals': 'carried_interest_principals',
        '28.\tNumber of current Full Time Equivalent staff members (FTEs) including principals': 'current_ftes',
        
        # Portfolio needs columns (88-97)
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Finance, budgeting, accounting, cash and tax management]': 'portfolio_need_finance_budgeting',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising including access to working capital resources]': 'portfolio_need_fundraising',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Strategic / organizational planning]': 'portfolio_need_strategic_planning',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Product/services proof of concept /market share / competitor positioning]': 'portfolio_need_product_market',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Human capital management – hiring/retention/training]': 'portfolio_need_human_capital',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Technology (CRM, MIS, telecommunications, etc)]': 'portfolio_need_technology',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Legal / regulatory]': 'portfolio_need_legal_regulatory',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Operations/ production / facilities and infrastructure]': 'portfolio_need_operations',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Management training]': 'portfolio_need_management_training',
        '29.\tDuring the first 3 years of an investment, what are the key needs of portfolio enterprises?  Please provide one ranking per row: 1=highest need, 5=lowest need [Other]': 'portfolio_need_other',
        
        # Exit columns (98-99)
        '30.\tWhat is the typical form of investment monetization/exit?': 'investment_monetization',
        '31.\tHow many exits has your vehicle achieved to date (ie exits/monetizations for equity investments and full repayments for debt investments)?': 'exits_achieved',
        
        # Fund capabilities columns (100-114)
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to global LPs]': 'fund_capability_global_lps',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to local LPs]': 'fund_capability_local_lps',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to warehousing capital]': 'fund_capability_warehousing',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to grant capital for vehicle OPEX]': 'fund_capability_grant_opex',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fundraising with access to TA support]': 'fund_capability_ta_support',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fund economics]': 'fund_capability_economics',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fund structuring]': 'fund_capability_structuring',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Investment process (eg origination, due diligence, structuring, closing)]': 'fund_capability_investment_process',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Post investment process (eg monitoring, reporting, exits, Technical Assistance)]': 'fund_capability_post_investment',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Fund staff/Human capital management and development]': 'fund_capability_human_capital',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Back office (financial/impact reporting, accounting, CFO, software, templates, etc)]': 'fund_capability_back_office',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Exit/monetization opportunities]': 'fund_capability_exit_opportunities',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Legal/regulatory support]': 'fund_capability_legal_regulatory',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Application of impact metrics]': 'fund_capability_impact_metrics',
        '32.\tFund capabilities and resources – what are the areas of desired investment/support for your fund? Please provide one ranking per row: 1=highest need, 5=lowest need [Other]': 'fund_capability_other',
        
        # COVID impact columns (115-127)
        '33.\tAt an aggregate level, please indicate the impact of COVID-19 on your investment vehicle and operations.': 'covid_impact_aggregate',
        '34.\tWhat impact has COVID-19 had on the following aspects of your portfolio companies? [Staff attendance]': 'covid_impact_staff_attendance',
        '34.\tWhat impact has COVID-19 had on the following aspects of your portfolio companies? [Customer demand]': 'covid_impact_customer_demand',
        '34.\tWhat impact has COVID-19 had on the following aspects of your portfolio companies? [Ability to pay staff salaries]': 'covid_impact_pay_salaries',
        '34.\tWhat impact has COVID-19 had on the following aspects of your portfolio companies? [Ability to pay fixed operating cost (eg rent, etc.)]': 'covid_impact_fixed_costs',
        '34.\tWhat impact has COVID-19 had on the following aspects of your portfolio companies? [Ability to pay existing business loans]': 'covid_impact_business_loans',
        '34.\tWhat impact has COVID-19 had on the following aspects of your portfolio companies? [Access to supply inputs / raw materials]': 'covid_impact_supply_access',
        '34.\tWhat impact has COVID-19 had on the following aspects of your portfolio companies? [Ability to pay for raw inputs / raw materials]': 'covid_impact_pay_inputs',
        '34.\tWhat impact has COVID-19 had on the following aspects of your portfolio companies? [Need to pivot business model]': 'covid_impact_pivot_model',
        '35. Have you received any financial or non-financial support from any government programs or grant funding related to COVID-19?': 'covid_government_support',
        '36. Do you anticipating raising new LP/investor funds in 2021? If yes, for what purpose?': 'raising_capital_2021',
        '37. Regarding your current fund/investment vehicle, which of the following is under consideration?': 'fund_vehicle_considerations',
        '38.\tOverall, how valuable have you found your participation in the ESCP network?': 'network_value_rating',
        
        # Working groups columns (128-133)
        '39.\tPlease indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [Fund Economics]': 'working_group_fund_economics',
        '39.\tPlease indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [LP Profiles]': 'working_group_lp_profiles',
        '39.\tPlease indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [Market Data]': 'working_group_market_data',
        '39.\tPlease indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [Purpose Definition]': 'working_group_purpose_definition',
        '39.\tPlease indicate which working groups you have found the most valuable. Please provide one ranking per row (or for each group you have engaged with): 1=most valuable, 5=least valuable [Access to Capital (DfID proposal)]': 'working_group_access_capital',
        '40.\tDo you have suggestions of new working group topics/formats you would like to see?': 'working_group_suggestions',
        
        # Webinar columns (134-145)
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Gender lens investing (facilitated by Suzanne Biegel)]': 'webinar_gender_lens',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [COVID-19 Response (peer discussion)]': 'webinar_covid_response',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Fundraising (presentations from I&P, Capria & DGGF)]': 'webinar_fundraising',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Portfolio Support (presentations from 10-Xe and AMI)]': 'webinar_portfolio_support',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [SGB COVID-19 Capital Bridge Facility (presentation from CFF)]': 'webinar_sgb_bridge',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Fundraising 2.0 (peer discussion)]': 'webinar_fundraising_2',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Human Capital (peer discussion)]': 'webinar_human_capital',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Co-investing workshop with ADAP (peer discussion)]': 'webinar_coinvesting',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Fundraising 3.0 – local capital (peer discussion)]': 'webinar_fundraising_3',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Ag/food tech: Investing across emerging and mature markets (collaboration with GITA)]': 'webinar_ag_food_tech',
        '41.\tPlease indicate which webinar content you have found the most valuable. Please provide one ranking per row (or for each webinar you attended/watched): 1=most valuable, 5=least valuable [Mentoring Pilot Kick-off]': 'webinar_mentoring_pilot',
        '42.\tDo you have suggestions of new webinar topics/formats you would like to see?': 'webinar_suggestions',
        '43.\tDo you prefer Slack or WhatsApp as a communication platform for the network?': 'communication_platform',
        
        # Network value columns (147-150)
        '44.\tWhat are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1=most valuable, 5=least valuable [Peer connections and peer learning]': 'network_value_peer_connections',
        '44.\tWhat are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1=most valuable, 5=least valuable [Advocacy for early stage investing ]': 'network_value_advocacy',
        '44.\tWhat are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1=most valuable, 5=least valuable [Raised profile/visibility (individual or collective)]': 'network_value_visibility',
        '44.\tWhat are the main areas of value that you have received from the network to date? Please provide one ranking per row: 1=most valuable, 5=least valuable [Systems change to drive more capital towards local capital providers]': 'network_value_systems_change',
        '45.\tWould you like to present in Session 1: "Connection/Reconnection" on Tuesday February 16th to provide a brief (1-2 min update) on your activities/progress (please note you are not required to present in order to attend this session – presenting is optional!)?': 'present_connection_session',
        
        # Convening initiatives columns (152-164)
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Warehousing/seed funding for fund managers to build track record]': 'initiative_warehousing',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [TA facility to support early fund economics and activities]': 'initiative_ta_facility',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Advocacy for the early-stage investing ecosystem]': 'initiative_advocacy',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Mentoring program (expert led)]': 'initiative_mentoring_expert',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Mentoring program (peer-led)]': 'initiative_mentoring_peer',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Webinars with peer-to-peer feedback sessions]': 'initiative_webinars_peer',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Webinars with expert-led feedback sessions]': 'initiative_webinars_expert',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Fundraising Readiness Advisory Program for fund managers]': 'initiative_fundraising_advisory',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Investment readiness for portfolio companies]': 'initiative_investment_readiness',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Fund Manager Portal (ie library of resources, templates etc)]': 'initiative_fund_manager_portal',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Shared financial and impact performance data (eg a "Bloomberg" for early stage funds)]': 'initiative_shared_data',
        '46.        In advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Joint back office between actively investing fund managers]': 'initiative_joint_back_office',
        '46.\tIn advance of Session 3: "Planning for 2021" on Tuesday February 23rd, please indicate which of the below initiatives you would be interested in, that you believe will add most value to your organization. Please provide one ranking per row: 1=very interested, 2=possibly interested, 3=not interested [Other]': 'initiative_other',
        
        # Final columns (165-167)
        '47.\tWould you be interested in participating in a peer mentoring program?': 'participate_mentoring_program',
        '48.\tWould you like to present in Session 4: "Demystifying frontier finance" on Thursday February 25th, and if so, please indicate which sub-topic(s) you would be interested in presenting on (please note you are not required to present in order to attend this session – presenting is optional!)?': 'present_demystifying_session',
        '49.\tAny other comments / feedback that you would like to share?': 'additional_comments',
    }
    
    # Columns that should be arrays (TEXT[])
    ARRAY_COLUMNS = [
        'team_based', 'geographic_focus', 'investment_vehicle_type', 
        'business_model_targeted', 'business_stage_targeted', 'financing_needs',
        'target_capital_sources', 'explicit_lens_focus', 'gender_fund_vehicle',
        'investment_forms', 'target_sectors', 'investment_monetization',
        'covid_government_support', 'raising_capital_2021', 'fund_vehicle_considerations',
        'present_demystifying_session'
    ]
    
    # Boolean column
    BOOLEAN_COLUMN = 'report_sdgs'
    
    def __init__(self, db_config: Dict[str, str], supabase_url: str, service_role_key: str, default_password: str, dry_run: bool = False):
        """Initialize migrator with database and Supabase configuration"""
        self.db_config = db_config
        self.conn = None
        self.cursor = None
        self.auth_manager = SupabaseAuthManager(supabase_url, service_role_key)
        self.default_password = default_password
        self.dry_run = dry_run
        self.user_cache = {}  # Cache for created users: email -> user_id
        self.company_cache = {}  # Cache for companies: firm_name -> company_name
        
    def connect(self):
        """Establish database connection"""
        try:
            self.conn = psycopg2.connect(**self.db_config)
            self.cursor = self.conn.cursor()
            logger.info("[OK] Database connection established")
        except Exception as e:
            logger.error(f"[X] Database connection failed: {e}")
            raise
    
    def disconnect(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
        logger.info("Database connection closed")
    
    def normalize_company_name(self, firm_name: str) -> str:
        """Normalize firm name to use as company identifier"""
        if not firm_name or pd.isna(firm_name):
            return None
        
        # Convert to lowercase and strip whitespace
        normalized = str(firm_name).lower().strip()
        return normalized
    
    def get_or_create_user(self, email: str, firm_name: str, participant_name: str) -> Optional[str]:
        """Get existing user or create new one in Supabase Auth"""
        if self.dry_run:
            logger.info(f"  [DRY RUN] Would create user: {email}")
            return "dry-run-user-id"
        
        # Check cache first
        if email in self.user_cache:
            logger.info(f"  [CACHE] Using cached user: {email}")
            return self.user_cache[email]
        
        # Create user metadata
        metadata = {
            "firm_name": firm_name,
            "participant_name": participant_name,
            "imported_from": "2021_survey",
            "import_date": datetime.now().isoformat()
        }
        
        # Create user via Supabase Auth
        user_id = self.auth_manager.create_user(email, self.default_password, metadata)
        
        if user_id:
            self.user_cache[email] = user_id
        
        # Small delay to avoid rate limiting
        time.sleep(0.1)
        
        return user_id
    
    def clean_value(self, value: Any) -> Optional[Any]:
        """Clean and normalize values from Excel"""
        if pd.isna(value):
            return None
        if isinstance(value, str):
            value = value.strip()
            if value.upper() in ['NULL', 'NA', 'N/A', '-', '']:
                return None
        return value
    
    def convert_to_array(self, value: Any) -> Optional[List[str]]:
        """Convert comma-separated string to PostgreSQL array"""
        cleaned = self.clean_value(value)
        if cleaned is None:
            return None
        
        if isinstance(cleaned, str):
            # Split by comma and clean each item
            items = [item.strip() for item in cleaned.split(',')]
            return [item for item in items if item]
        
        return None
    
    def convert_to_boolean(self, value: Any) -> Optional[bool]:
        """Convert string to boolean"""
        cleaned = self.clean_value(value)
        if cleaned is None:
            return None
        
        if isinstance(cleaned, str):
            if cleaned.lower() in ['yes', 'true', '1']:
                return True
            elif cleaned.lower() in ['no', 'false', '0']:
                return False
        
        return None
    
    def convert_timestamp(self, value: Any) -> Optional[datetime]:
        """Convert Excel timestamp to datetime"""
        cleaned = self.clean_value(value)
        if cleaned is None:
            return None
        
        if isinstance(cleaned, datetime):
            return cleaned
        
        if isinstance(cleaned, str):
            try:
                return pd.to_datetime(cleaned)
            except:
                logger.warning(f"Could not parse timestamp: {cleaned}")
                return None
        
        return None
    
    def prepare_row(self, row: pd.Series, user_id: str, company_name: str) -> Dict[str, Any]:
        """Prepare a single row for insertion"""
        prepared = {
            'user_id': user_id,
            'company_name': company_name
        }
        
        for excel_col, sql_col in self.COLUMN_MAPPING.items():
            if excel_col not in row.index:
                logger.warning(f"Column '{excel_col}' not found in Excel data")
                prepared[sql_col] = None
                continue
            
            value = row[excel_col]
            
            # Special handling for timestamp
            if sql_col == 'timestamp':
                prepared[sql_col] = self.convert_timestamp(value)
            # Special handling for boolean
            elif sql_col == self.BOOLEAN_COLUMN:
                prepared[sql_col] = self.convert_to_boolean(value)
            # Special handling for arrays
            elif sql_col in self.ARRAY_COLUMNS:
                prepared[sql_col] = self.convert_to_array(value)
            # Regular text handling
            else:
                prepared[sql_col] = self.clean_value(value)
        
        return prepared
    
    def build_insert_query(self) -> str:
        """Build the INSERT query with all columns"""
        columns = ['user_id', 'company_name'] + list(self.COLUMN_MAPPING.values())
        placeholders = [f"%({col})s" for col in columns]
        
        query = f"""
        INSERT INTO public.survey_responses_2021 (
            {', '.join(columns)}
        ) VALUES (
            {', '.join(placeholders)}
        )
        """
        return query
    
    def group_by_company(self, df: pd.DataFrame) -> Dict[str, pd.DataFrame]:
        """Group responses by company (firm_name)"""
        logger.info("Grouping responses by company...")
        
        # Add normalized company column
        df['normalized_company'] = df['1. Name of firm'].apply(self.normalize_company_name)
        
        # Group by normalized company
        grouped = df.groupby('normalized_company')
        
        company_groups = {}
        for company_name, group_df in grouped:
            if company_name:  # Skip None/empty company names
                company_groups[company_name] = group_df
                self.company_cache[company_name] = company_name
        
        logger.info(f"[OK] Found {len(company_groups)} unique companies")
        for company_name, group_df in company_groups.items():
            logger.info(f"  - {company_name}: {len(group_df)} response(s)")
        
        return company_groups
    
    def validate_data(self, df: pd.DataFrame) -> bool:
        """Validate the Excel data before migration"""
        logger.info("Validating Excel data...")
        
        # Normalize Excel column names (replace multiple whitespace/tabs with single space)
        import re
        df.columns = [re.sub(r'\s+', ' ', str(col).strip()) for col in df.columns]
        
        # Check if all required columns exist
        missing_cols = []
        available_cols = set(df.columns)
        
        for excel_col in self.COLUMN_MAPPING.keys():
            # Normalize the expected column name too
            normalized_excel_col = re.sub(r'\s+', ' ', excel_col.strip())
            
            if normalized_excel_col not in available_cols:
                # Try fuzzy matching
                found = False
                for avail_col in available_cols:
                    # Compare normalized versions
                    if normalized_excel_col.lower() == avail_col.lower():
                        # Update the mapping to use the actual column name
                        self.COLUMN_MAPPING[excel_col] = self.COLUMN_MAPPING.get(excel_col, excel_col)
                        found = True
                        break
                
                if not found:
                    missing_cols.append(excel_col)
        
        if missing_cols:
            logger.error(f"[X] Missing columns in Excel: {len(missing_cols)} columns")
            logger.error(f"First 5 missing: {missing_cols[:5]}")
            # Print first 10 actual columns for debugging
            logger.info(f"First 10 Excel columns found: {list(df.columns)[:10]}")
            return False
        
        # Check for email addresses (required field)
        email_col = 'Email Address'
        if email_col not in df.columns:
            logger.error(f"[X] Email Address column not found")
            return False
            
        if df[email_col].isna().all():
            logger.error("[X] No email addresses found in data")
            return False
        
        # Check for firm names (required for grouping)
        firm_col = '1. Name of firm'
        if firm_col not in df.columns:
            logger.error(f"[X] Firm name column not found")
            return False
            
        if df[firm_col].isna().all():
            logger.error("[X] No firm names found in data")
            return False
        
        null_emails = df[email_col].isna().sum()
        null_firms = df[firm_col].isna().sum()
        
        if null_emails > 0:
            logger.warning(f"[!] {null_emails} rows with missing email addresses will be skipped")
        if null_firms > 0:
            logger.warning(f"[!] {null_firms} rows with missing firm names will be skipped")
        
        logger.info(f"[OK] Data validation passed")
        logger.info(f"  - Total rows: {len(df)}")
        logger.info(f"  - Total columns: {len(df.columns)}")
        logger.info(f"  - Rows with valid emails: {len(df) - null_emails}")
        logger.info(f"  - Rows with valid firms: {len(df) - null_firms}")
        
        return True
    
    def migrate(self, excel_file: str, batch_size: int = 50):
        """Main migration method"""
        logger.info("="*80)
        logger.info("STARTING 2021 SURVEY DATA MIGRATION WITH SUPABASE AUTH")
        logger.info("="*80)
        
        if self.dry_run:
            logger.warning("⚠ DRY RUN MODE - No actual data will be inserted")
        
        try:
            # Read Excel file
            logger.info(f"Reading Excel file: {excel_file}")
            df = pd.read_excel(excel_file)
            logger.info(f"[OK] Excel file loaded: {len(df)} rows, {len(df.columns)} columns")
            
            # Validate data
            if not self.validate_data(df):
                raise ValueError("Data validation failed")
            
            # Filter out rows with no email or firm name
            df_valid = df[df['Email Address'].notna() & df['1. Name of firm'].notna()].copy()
            total_rows = len(df_valid)
            
            logger.info(f"Processing {total_rows} valid rows...")
            
            # Group by company
            company_groups = self.group_by_company(df_valid)
            
            # Connect to database
            self.connect()
            
            # Process each company
            logger.info("\n" + "="*80)
            logger.info("CREATING USERS AND INSERTING DATA")
            logger.info("="*80 + "\n")
            
            inserted_count = 0
            error_count = 0
            users_created = 0
            
            for company_name, company_df in company_groups.items():
                logger.info(f"\n[>>] Processing company: {company_name}")
                logger.info(f"     Responses: {len(company_df)}")
                
                # Process each response for this company
                for idx, row in company_df.iterrows():
                    email = row['Email Address']
                    firm_name = row['1. Name of firm']
                    participant_name = self.clean_value(row.get('2. Name of participant', ''))
                    
                    logger.info(f"\n  [USER] Processing: {email} ({participant_name or 'Unknown'})")
                    
                    # Create or get user
                    user_id = self.get_or_create_user(email, firm_name, participant_name)
                    
                    if not user_id:
                        logger.error(f"    [X] Failed to create/get user for {email}")
                        error_count += 1
                        continue
                    
                    if user_id not in [v for k, v in self.user_cache.items() if k != email]:
                        users_created += 1
                    
                    # Prepare row data
                    try:
                        prepared_row = self.prepare_row(row, user_id, company_name)
                        
                        # Insert into database
                        if not self.dry_run:
                            insert_query = self.build_insert_query()
                            self.cursor.execute(insert_query, prepared_row)
                            self.conn.commit()
                            logger.info(f"    [OK] Survey response inserted")
                        else:
                            logger.info(f"    [DRY RUN] Would insert survey response")
                        
                        inserted_count += 1
                        
                    except Exception as e:
                        if not self.dry_run:
                            self.conn.rollback()
                        logger.error(f"    [X] Failed to insert response: {e}")
                        error_count += 1
            
            # Summary
            logger.info("\n" + "="*80)
            logger.info("MIGRATION COMPLETED")
            logger.info("="*80)
            logger.info(f"Total rows in Excel: {len(df)}")
            logger.info(f"Valid rows (with email & firm): {total_rows}")
            logger.info(f"Unique companies: {len(company_groups)}")
            logger.info(f"Users created: {users_created}")
            logger.info(f"Survey responses inserted: {inserted_count}")
            logger.info(f"Failed: {error_count}")
            logger.info(f"Success rate: {(inserted_count/total_rows*100):.2f}%")
            logger.info("\n📋 Company Summary:")
            for company_name, group_df in company_groups.items():
                logger.info(f"  - {company_name}: {len(group_df)} response(s)")
            logger.info("="*80)
            
            return inserted_count, error_count, users_created
            
        except Exception as e:
            logger.error(f"✗ Migration failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            raise
        finally:
            self.disconnect()


def main():
    """Main execution function"""
    
    # Configuration from your Supabase credentials
    # Load from environment variables
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    DEFAULT_PASSWORD = "@ESCPNetwork2025#"
    DRY_RUN = False  # Set to True for testing without actual inserts
    
    # We'll use Supabase client instead of direct PostgreSQL connection
    DB_CONFIG = None  # Not needed - we'll use Supabase client
    logger.info("="*80)
    logger.info(f"Supabase URL: {SUPABASE_URL}")
    logger.info(f"Excel file: {EXCEL_FILE}")
    logger.info(f"Default password: {DEFAULT_PASSWORD}")
    logger.info(f"Dry run mode: {DRY_RUN}")
    logger.info("="*80 + "\n")
    
    # Create migrator instance
    migrator = Survey2021Migrator(
        db_config=DB_CONFIG,
        supabase_url=SUPABASE_URL,
        service_role_key=SUPABASE_SERVICE_ROLE_KEY,
        default_password=DEFAULT_PASSWORD,
        dry_run=DRY_RUN
    )
    
    # Run migration
    try:
        inserted, failed, users = migrator.migrate(EXCEL_FILE, batch_size=50)
        
        if failed == 0:
            logger.info("\n[SUCCESS] All data migrated successfully!")
            logger.info(f"[OK] {users} users created")
            logger.info(f"[OK] {inserted} survey responses inserted")
            return 0
        else:
            logger.warning(f"\n[WARNING] Migration completed with {failed} failures")
            logger.info(f"[OK] {users} users created")
            logger.info(f"[OK] {inserted} survey responses inserted")
            return 1
            
    except Exception as e:
        logger.error(f"\n[ABORT] Migration aborted: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return 2


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)