"""
DYNAMIC SURVEY DATA MIGRATION SCRIPT
Creates independent tables for each survey response with questions/answers as key-value pairs
Generates individual SQL .txt files for manual execution in Supabase

Features:
- Normalizes company names for future linking across years
- Creates independent response tables (one per Excel row)
- Stores only non-null questions and answers
- Infers data types from response values
- No email tracking (responses are independent)
- Generates individual SQL .txt files per response

Run: python datamigration.py
Output: C:\\Users\\almul\\Downloads\\Migration TXTs\\
"""

import pandas as pd
from datetime import datetime
import logging
import sys
import os
import re
from typing import List, Dict, Any, Optional, Tuple
from collections import defaultdict
import unicodedata

# Configure logging with UTF-8 encoding for Windows
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('datamigration.log', encoding='utf-8'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')


class CompanyNameNormalizer:
    """Normalizes company names for matching across different years"""
    
    @staticmethod
    def normalize(company_name: str) -> str:
        """
        Normalize company name by:
        - Converting to lowercase
        - Removing extra whitespace
        - Removing special characters
        - Removing common suffixes (Ltd, Inc, Corp, etc.)
        """
        if not company_name or pd.isna(company_name):
            return ""
        
        # Convert to string and lowercase
        name = str(company_name).lower().strip()
        
        # Remove unicode accents
        name = unicodedata.normalize('NFKD', name)
        name = ''.join([c for c in name if not unicodedata.combining(c)])
        
        # Remove common company suffixes
        suffixes = [
            r'\bltd\.?$', r'\blimited$', r'\binc\.?$', r'\bincorporated$',
            r'\bcorp\.?$', r'\bcorporation$', r'\bllc\.?$', r'\bplc\.?$',
            r'\bco\.?$', r'\bcompany$', r'\bgroup$', r'\bholdings?$'
        ]
        for suffix in suffixes:
            name = re.sub(suffix, '', name, flags=re.IGNORECASE)
        
        # Remove special characters except spaces
        name = re.sub(r'[^a-z0-9\s]', '', name)
        
        # Remove extra whitespace
        name = re.sub(r'\s+', ' ', name).strip()
        
        return name


class DataTypeInferencer:
    """Infers PostgreSQL data types from pandas values"""
    
    @staticmethod
    def infer_postgres_type(value: Any) -> str:
        """Infer PostgreSQL data type from a value"""
        if pd.isna(value) or value == "" or str(value).strip().upper() in ['N/A', 'NA', 'NULL']:
            return "TEXT"  # Default for null values
        
        # Try to infer from actual value
        if isinstance(value, bool):
            return "BOOLEAN"
        elif isinstance(value, int):
            return "INTEGER"
        elif isinstance(value, float):
            return "NUMERIC"
        elif isinstance(value, datetime):
            return "TIMESTAMP"
        elif isinstance(value, str):
            # Check if it's a date string
            if DataTypeInferencer._is_date(value):
                return "TIMESTAMP"
            # Check if it's a number string
            elif DataTypeInferencer._is_integer(value):
                return "INTEGER"
            elif DataTypeInferencer._is_numeric(value):
                return "NUMERIC"
            # Check if it's a boolean string
            elif value.lower() in ['true', 'false', 'yes', 'no', 't', 'f', 'y', 'n']:
                return "BOOLEAN"
            else:
                return "TEXT"
        else:
            return "TEXT"
    
    @staticmethod
    def _is_date(value: str) -> bool:
        """Check if string is a date"""
        try:
            pd.to_datetime(value)
            return True
        except:
            return False
    
    @staticmethod
    def _is_integer(value: str) -> bool:
        """Check if string is an integer"""
        try:
            int(value)
            return True
        except:
            return False
    
    @staticmethod
    def _is_numeric(value: str) -> bool:
        """Check if string is numeric"""
        try:
            float(value)
            return True
        except:
            return False


class DynamicSurveyMigrator:
    """Handles dynamic survey data migration with custom tables per company per year"""
    
    # Survey year configurations
    SURVEY_CONFIGS = {
        2021: {
            'file_path': r"C:\Users\almul\Downloads\CFF2021.xlsx",
            'company_column': '1. Name of firm'
        },
        2022: {
            'file_path': r"C:\Users\almul\Downloads\CFF2022.xlsx",
            'company_column': 'Name of organisation'
        },
        2023: {
            'file_path': r"C:\Users\almul\Downloads\CFF2023.xlsx",
            'company_column': 'Name of organisation'
        },
        2024: {
            'file_path': r"C:\Users\almul\Downloads\CFF2024.xlsx",
            'company_column': 'Name of your organization'
        }
    }
    
    def __init__(self, output_dir: str = r"C:\Users\almul\Downloads\Migration TXTs"):
        """Initialize the migrator"""
        self.output_dir = output_dir
        self.company_registry: Dict[str, Dict] = {}  # normalized_name -> {id, original_name}
        self.company_id_counter = 1
        self.response_id_counter = 1
        self.all_sql_statements: List[str] = []
        
        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)
    
    def add_sql(self, sql: str, description: str = ""):
        """Add SQL statement to the collection"""
        self.all_sql_statements.append(f"-- {description}\n{sql};\n")
        logger.info(f"  ✓ Generated SQL: {description}")
    
    def create_master_tables(self):
        """Create companies and survey_responses master tables"""
        logger.info("\n" + "="*80)
        logger.info("CREATING MASTER TABLES")
        logger.info("="*80)
        
        # Create companies table
        companies_sql = """
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    company_name TEXT NOT NULL,
    normalized_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
)"""
        self.add_sql(companies_sql, "Create companies master table")
        
        # Create survey_responses metadata table
        survey_responses_sql = """
CREATE TABLE IF NOT EXISTS survey_responses (
    response_id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    survey_year INTEGER NOT NULL,
    table_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
)"""
        self.add_sql(survey_responses_sql, "Create survey_responses metadata table")
        
        logger.info("✓ Master tables SQL generated\n")
    
    def get_or_create_company(self, company_name: str) -> int:
        """Get existing company ID (companies are pre-registered in first pass)"""
        normalized = CompanyNameNormalizer.normalize(company_name)
        
        if not normalized:
            logger.warning(f"  ! Empty company name, skipping")
            return None
        
        # Get from registry (should already exist from first pass)
        if normalized in self.company_registry:
            company_id = self.company_registry[normalized]['id']
            return company_id
        
        # Should not reach here if first pass worked correctly
        logger.warning(f"  ! Company not found in registry: {company_name}")
        return None
    
    def is_value_empty(self, value: Any) -> bool:
        """Check if a value should be considered empty/null"""
        if pd.isna(value):
            return True
        if value == "":
            return True
        if isinstance(value, str) and value.strip().upper() in ['N/A', 'NA', 'NULL', '']:
            return True
        return False
    
    def sanitize_column_name(self, column_name: str) -> str:
        """Sanitize column name for PostgreSQL"""
        # Remove special characters, replace spaces with underscores
        sanitized = re.sub(r'[^a-zA-Z0-9_]', '_', str(column_name))
        sanitized = re.sub(r'_+', '_', sanitized)  # Remove duplicate underscores
        sanitized = sanitized.strip('_').lower()
        
        # Ensure it doesn't start with a number
        if sanitized and sanitized[0].isdigit():
            sanitized = 'col_' + sanitized
        
        return sanitized or 'unnamed_column'
    
    def create_dynamic_table_for_response(self, company_id: int, company_name: str, 
                                         year: int, row_data: pd.Series) -> Optional[str]:
        """Create a dynamic table based on non-null columns in the response"""
        
        # Filter non-null columns
        non_null_columns = {}
        for col_name, value in row_data.items():
            if not self.is_value_empty(value):
                sanitized_col = self.sanitize_column_name(col_name)
                non_null_columns[sanitized_col] = {
                    'original_name': col_name,
                    'value': value,
                    'data_type': DataTypeInferencer.infer_postgres_type(value)
                }
        
        if not non_null_columns:
            logger.warning(f"  ! No non-null columns found for {company_name} ({year})")
            return None
        
        # Generate table name using response_id for uniqueness
        response_id = self.response_id_counter
        self.response_id_counter += 1
        table_name = f"survey_response_{response_id}_year_{year}"
        
        logger.info(f"  → Creating table: {table_name} with {len(non_null_columns)} columns")
        
        # Build CREATE TABLE statement
        column_definitions = []
        column_definitions.append("response_id SERIAL PRIMARY KEY")
        column_definitions.append("company_id INTEGER NOT NULL")
        column_definitions.append("original_question TEXT")
        column_definitions.append("response_value TEXT")
        column_definitions.append("created_at TIMESTAMP DEFAULT NOW()")
        
        # Actually, we need a different approach - store as key-value pairs
        # Let me create a table that stores question-answer pairs
        
        create_table_sql = f"""CREATE TABLE IF NOT EXISTS {table_name} (
    id SERIAL PRIMARY KEY,
    question_column TEXT NOT NULL,
    original_question TEXT NOT NULL,
    response_value TEXT,
    data_type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
)"""
        
        self.add_sql(create_table_sql, f"Create table {table_name}")
        
        # Insert data as question-answer pairs
        for sanitized_col, col_info in non_null_columns.items():
            original_q = col_info['original_name'].replace("'", "''")
            response_val = str(col_info['value']).replace("'", "''")
            data_type = col_info['data_type']
            
            insert_sql = f"""INSERT INTO {table_name} (question_column, original_question, response_value, data_type)
VALUES ('{sanitized_col}', '{original_q}', '{response_val}', '{data_type}')"""
            
            self.add_sql(insert_sql, f"Insert response for {sanitized_col}")
        
        logger.info(f"  ✓ Populated table {table_name} with {len(non_null_columns)} responses")
        
        return table_name, response_id
    
    def register_survey_response(self, response_id: int, company_id: int, company_name: str, year: int, table_name: str):
        """Register survey response in metadata table"""
        insert_sql = f"""INSERT INTO survey_responses (response_id, company_id, company_name, survey_year, table_name)
VALUES ({response_id}, {company_id}, '{company_name.replace("'", "''")}', {year}, '{table_name}')"""
        
        self.add_sql(insert_sql, f"Register survey response {response_id} for company {company_id}, year {year}")
        logger.info(f"  ✓ Generated SQL for survey response registration")
    
    def process_survey_year(self, year: int):
        """Process all responses for a given survey year"""
        config = self.SURVEY_CONFIGS.get(year)
        if not config:
            logger.warning(f"No configuration found for year {year}")
            return
        
        logger.info("\n" + "="*80)
        logger.info(f"PROCESSING SURVEY YEAR: {year}")
        logger.info("="*80)
        logger.info(f"File: {config['file_path']}")
        logger.info(f"Company column: {config['company_column']}")
        
        # Read Excel file
        try:
            df = pd.read_excel(config['file_path'])
            logger.info(f"✓ Loaded {len(df)} rows from Excel file")
        except Exception as e:
            logger.error(f"✗ Failed to read Excel file: {e}")
            return
        
        # Check if required columns exist
        if config['company_column'] not in df.columns:
            logger.error(f"✗ Company column '{config['company_column']}' not found in Excel file")
            logger.info(f"Available columns: {list(df.columns)[:10]}...")
            return
        
        # First pass: collect all companies
        logger.info("\n📋 First pass: Collecting companies...")
        companies_to_create = []
        
        for idx, row in df.iterrows():
            company_name = row[config['company_column']]
            if not self.is_value_empty(company_name):
                normalized = CompanyNameNormalizer.normalize(company_name)
                if normalized and normalized not in self.company_registry:
                    companies_to_create.append(company_name)
                    # Pre-register to avoid duplicates
                    company_id = self.company_id_counter
                    self.company_id_counter += 1
                    self.company_registry[normalized] = {
                        'id': company_id,
                        'original_name': company_name
                    }
        
        logger.info(f"✓ Found {len(companies_to_create)} new companies")
        
        # Second pass: process responses
        logger.info("\n📋 Second pass: Processing responses...")
        processed = 0
        skipped = 0
        
        for idx, row in df.iterrows():
            company_name = row[config['company_column']]
            
            if self.is_value_empty(company_name):
                logger.warning(f"  ! Row {idx+2}: Empty company name, skipping")
                skipped += 1
                continue
            
            logger.info(f"\n[Row {idx+2}] Processing: {company_name}")
            
            # Get company ID (already registered)
            normalized = CompanyNameNormalizer.normalize(company_name)
            company_id = self.company_registry[normalized]['id']
            
            # Track SQL statements for this response
            response_sql_start = len(self.all_sql_statements)
            
            # Create dynamic table and populate
            result = self.create_dynamic_table_for_response(
                company_id, company_name, year, row
            )
            
            if result:
                table_name, response_id = result
                # Register in survey_responses metadata
                self.register_survey_response(response_id, company_id, company_name, year, table_name)
                
                # Don't save individual files - we'll combine everything at the end
                processed += 1
            else:
                skipped += 1
        
        logger.info(f"\n✓ Year {year} complete: {processed} processed, {skipped} skipped")
    
    def save_response_sql_file(self, response_id: int, company_name: str, year: int, sql_statements: List[str]):
        """Save SQL statements for a specific response to a separate file"""
        try:
            # Sanitize company name for filename
            safe_name = re.sub(r'[^a-zA-Z0-9_]', '_', company_name)
            filename = f"response_{response_id}_{safe_name}_year_{year}.txt"
            filepath = os.path.join(self.output_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(f"-- Response ID: {response_id}\n")
                f.write(f"-- Company: {company_name}\n")
                f.write(f"-- Survey Year: {year}\n")
                f.write(f"-- Generated: {datetime.now().isoformat()}\n\n")
                f.write("\n".join(sql_statements))
            
            logger.info(f"  ✓ Saved SQL to: {filename}")
        except Exception as e:
            logger.error(f"  ✗ Failed to save SQL file for {company_name}: {e}")
    
    def save_master_sql_file(self):
        """Save master tables SQL to a separate file"""
        try:
            filepath = os.path.join(self.output_dir, "00_master_tables.txt")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write("-- MASTER TABLES CREATION\n")
                f.write(f"-- Generated: {datetime.now().isoformat()}\n\n")
                # Get first 2 SQL statements (companies and survey_responses tables)
                master_sql = "\n".join(self.all_sql_statements[:2])
                f.write(master_sql)
            
            logger.info(f"✓ Saved master tables SQL to: 00_master_tables.txt")
        except Exception as e:
            logger.error(f"✗ Failed to save master SQL file: {e}")
    
    def save_companies_sql_file(self):
        """Save all company INSERT statements to a separate file"""
        try:
            filepath = os.path.join(self.output_dir, "01_companies_data.txt")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write("-- COMPANIES DATA\n")
                f.write(f"-- Generated: {datetime.now().isoformat()}\n")
                f.write(f"-- Total companies: {len(self.company_registry)}\n\n")
                
                # Generate INSERT statements for all companies
                for normalized, company_info in sorted(self.company_registry.items(), key=lambda x: x[1]['id']):
                    company_id = company_info['id']
                    company_name = company_info['original_name']
                    
                    insert_sql = f"""-- Company ID: {company_id}
INSERT INTO companies (company_id, company_name, normalized_name)
VALUES ({company_id}, '{company_name.replace("'", "''")}', '{normalized}');\n\n"""
                    
                    f.write(insert_sql)
            
            logger.info(f"✓ Saved companies data SQL to: 01_companies_data.txt ({len(self.company_registry)} companies)")
        except Exception as e:
            logger.error(f"✗ Failed to save companies SQL file: {e}")
    
    def migrate_all(self):
        """Run complete migration for all survey years"""
        try:
            logger.info("\n" + "="*80)
            logger.info("DYNAMIC SURVEY DATA MIGRATION - SQL GENERATION")
            logger.info("="*80)
            logger.info(f"Output directory: {self.output_dir}")
            logger.info("="*80)
            
            # Create master tables
            self.create_master_tables()
            
            # Save master tables SQL
            self.save_master_sql_file()
            
            # Process each survey year
            for year in sorted(self.SURVEY_CONFIGS.keys()):
                self.process_survey_year(year)
            
            # Generate company INSERT statements
            self.save_companies_sql_file()
            
            # Save all response SQL to one file
            self.save_all_responses_sql_file()
            
            logger.info("\n" + "="*80)
            logger.info("SQL GENERATION COMPLETE")
            logger.info("="*80)
            logger.info(f"Total companies: {len(self.company_registry)}")
            logger.info(f"Output directory: {self.output_dir}")
            logger.info(f"Total SQL statements: {len(self.all_sql_statements)}")
            logger.info("="*80)
            logger.info("\nNext steps:")
            logger.info("1. Review the generated SQL files in the output directory")
            logger.info("2. Run combine_sql_files.py to create COMBINED_MIGRATION.sql")
            logger.info("3. Run execute_migration_supabase.py to create batch files")
            logger.info("4. Execute batches in Supabase SQL Editor")
            logger.info("="*80)
            
        except Exception as e:
            logger.error(f"✗ Migration failed: {e}")
            import traceback
            logger.error(traceback.format_exc())
            raise


def main():
    """Main execution function"""
    
    # Output directory
    output_dir = r"C:\Users\almul\Downloads\Migration TXTs"
    
    # Create migrator
    migrator = DynamicSurveyMigrator(output_dir=output_dir)
    
    # Run migration
    try:
        migrator.migrate_all()
        return 0
    except Exception as e:
        logger.error(f"\n[ABORT] Migration aborted: {e}")
        return 2


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
