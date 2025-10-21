"""
SQL MIGRATION EXECUTOR
Connects to PostgreSQL database and executes the combined migration SQL file
Handles large files by executing statements in batches

Run: python execute_migration.py
"""

import psycopg2
import os
from datetime import datetime
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def execute_sql_file():
    """Execute SQL file against PostgreSQL database"""
    
    # Configuration
    sql_file = r"C:\Users\almul\Downloads\Migration TXTs\COMBINED_MIGRATION.sql"
    
    # Get database password from environment or prompt
    db_password = os.getenv('SUPABASE_DB_PASSWORD')
    if not db_password:
        print("⚠️  SUPABASE_DB_PASSWORD not found in .env file")
        db_password = input("Enter your Supabase database password: ")
    
    # Database connection string
    # Direct connection (not pooler)
    db_host = "db.qiqxdivyyjcbegdlptuq.supabase.co"
    db_port = "5432"
    db_name = "postgres"
    db_user = "postgres"
    
    print("="*80)
    print("SQL MIGRATION EXECUTOR")
    print("="*80)
    print(f"SQL File: {sql_file}")
    print(f"Database: {db_host}")
    print("="*80)
    
    # Check if SQL file exists
    if not os.path.exists(sql_file):
        print(f"❌ Error: SQL file not found: {sql_file}")
        return
    
    # Get file size
    file_size = os.path.getsize(sql_file)
    print(f"\n📁 SQL file size: {file_size:,} bytes ({file_size / 1024 / 1024:.2f} MB)")
    
    # Read SQL file
    print("\n📖 Reading SQL file...")
    try:
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
    except Exception as e:
        print(f"❌ Error reading SQL file: {e}")
        return
    
    # Split into individual statements
    print("🔪 Splitting SQL statements...")
    
    # Remove comment-only lines but keep inline comments
    lines = sql_content.split('\n')
    cleaned_lines = []
    for line in lines:
        # Skip lines that are only comments or separators
        if line.strip().startswith('--') or line.strip().startswith('='):
            continue
        cleaned_lines.append(line)
    
    cleaned_content = '\n'.join(cleaned_lines)
    
    # Split by semicolon (statements end with ;)
    statements = cleaned_content.split(';')
    
    # Clean up statements
    statements = [stmt.strip() for stmt in statements if stmt.strip() and len(stmt.strip()) > 10]
    
    print(f"✓ Found {len(statements)} SQL statements to execute")
    
    # Connect to database
    print("\n🔌 Connecting to database...")
    try:
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            database=db_name,
            user=db_user,
            password=db_password
        )
        conn.autocommit = False  # Use transactions
        cursor = conn.cursor()
        print("✓ Connected successfully!")
    except Exception as e:
        print(f"❌ Error connecting to database: {e}")
        return
    
    # Execute statements in batches
    print("\n🚀 Executing SQL statements...")
    print("="*80)
    
    executed = 0
    failed = 0
    batch_size = 100
    total_batches = (len(statements) + batch_size - 1) // batch_size
    
    try:
        for i in range(0, len(statements), batch_size):
            batch = statements[i:i + batch_size]
            batch_num = (i // batch_size) + 1
            
            print(f"\n📦 Batch {batch_num}/{total_batches} ({len(batch)} statements)")
            
            for j, statement in enumerate(batch, 1):
                try:
                    # Skip empty statements
                    if not statement or len(statement) < 10:
                        continue
                    
                    # Execute statement
                    cursor.execute(statement)
                    executed += 1
                    
                    # Show progress every 10 statements
                    if j % 10 == 0:
                        print(f"  ✓ Executed {executed}/{len(statements)} statements")
                    
                except Exception as e:
                    failed += 1
                    error_msg = str(e)
                    # Show first 100 chars of statement
                    stmt_preview = statement[:100] + "..." if len(statement) > 100 else statement
                    print(f"  ⚠️  Error in statement {executed + failed}: {error_msg}")
                    print(f"     Statement: {stmt_preview}")
                    
                    # Ask user if they want to continue
                    if failed > 10:
                        response = input("\n⚠️  More than 10 errors. Continue? (y/n): ")
                        if response.lower() != 'y':
                            raise Exception("Migration aborted by user")
            
            # Commit batch
            conn.commit()
            print(f"  ✓ Batch {batch_num} committed successfully")
        
        print("\n" + "="*80)
        print("✅ MIGRATION COMPLETE!")
        print("="*80)
        print(f"Total statements: {len(statements)}")
        print(f"Successfully executed: {executed}")
        print(f"Failed: {failed}")
        print(f"Success rate: {(executed / len(statements) * 100):.2f}%")
        print("="*80)
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        print("Rolling back transaction...")
        conn.rollback()
        print("✓ Rollback complete")
    finally:
        cursor.close()
        conn.close()
        print("\n🔌 Database connection closed")

if __name__ == "__main__":
    execute_sql_file()
