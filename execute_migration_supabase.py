"""
SQL MIGRATION EXECUTOR (Supabase Client)
Uses Supabase client library to execute SQL statements via RPC
Alternative to direct PostgreSQL connection

Run: python execute_migration_supabase.py
"""

from supabase import create_client, Client
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def execute_sql_via_supabase():
    """Execute SQL file using Supabase client library"""
    
    # Configuration
    sql_file = r"C:\Users\almul\Downloads\Migration TXTs\COMBINED_MIGRATION.sql"
    
    # Get Supabase credentials
    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    
    if not supabase_url or not supabase_key:
        print("❌ Error: SUPABASE_URL or SUPABASE_SERVICE_KEY not found in .env file")
        return
    
    print("="*80)
    print("SQL MIGRATION EXECUTOR (Supabase Client)")
    print("="*80)
    print(f"SQL File: {sql_file}")
    print(f"Supabase URL: {supabase_url}")
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
    
    # Remove comment-only lines
    lines = sql_content.split('\n')
    cleaned_lines = []
    for line in lines:
        if line.strip().startswith('--') or line.strip().startswith('='):
            continue
        cleaned_lines.append(line)
    
    cleaned_content = '\n'.join(cleaned_lines)
    statements = cleaned_content.split(';')
    statements = [stmt.strip() for stmt in statements if stmt.strip() and len(stmt.strip()) > 10]
    
    print(f"✓ Found {len(statements)} SQL statements to execute")
    
    # Connect to Supabase
    print("\n🔌 Connecting to Supabase...")
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        print("✓ Connected successfully!")
    except Exception as e:
        print(f"❌ Error connecting to Supabase: {e}")
        return
    
    # Execute statements using SQL editor
    print("\n🚀 Executing SQL statements...")
    print("="*80)
    print("\n⚠️  Note: Supabase client doesn't support direct SQL execution.")
    print("We'll need to use the Supabase SQL Editor manually.\n")
    
    # Create smaller batch files
    print("📦 Creating batch files for manual execution...")
    
    batch_size = 1000
    total_batches = (len(statements) + batch_size - 1) // batch_size
    output_dir = r"C:\Users\almul\Downloads\Migration TXTs\Batches"
    
    # Create batches directory
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(0, len(statements), batch_size):
        batch = statements[i:i + batch_size]
        batch_num = (i // batch_size) + 1
        
        batch_file = os.path.join(output_dir, f"batch_{batch_num:03d}_of_{total_batches:03d}.sql")
        
        with open(batch_file, 'w', encoding='utf-8') as f:
            f.write(f"-- Batch {batch_num} of {total_batches}\n")
            f.write(f"-- Statements {i+1} to {min(i+batch_size, len(statements))}\n")
            f.write(f"-- Generated: {datetime.now().isoformat()}\n\n")
            
            for stmt in batch:
                f.write(stmt)
                f.write(';\n\n')
        
        print(f"  ✓ Created: batch_{batch_num:03d}_of_{total_batches:03d}.sql ({len(batch)} statements)")
    
    print("\n" + "="*80)
    print("✅ BATCH FILES CREATED!")
    print("="*80)
    print(f"Total batches: {total_batches}")
    print(f"Output directory: {output_dir}")
    print("\n📋 Next steps:")
    print("1. Go to Supabase Dashboard → SQL Editor")
    print("2. Open each batch file (starting with batch_001)")
    print("3. Copy and paste the contents")
    print("4. Click 'Run' to execute")
    print("5. Repeat for all batches")
    print("="*80)

if __name__ == "__main__":
    execute_sql_via_supabase()
