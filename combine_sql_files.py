"""
SQL FILE COMBINER
Combines all individual .txt SQL files from Migration TXTs folder into one master SQL file

Run: python combine_sql_files.py
"""

import os
from datetime import datetime
import glob

def combine_sql_files():
    """Combine all .txt files from Migration TXTs folder into one master SQL file"""
    
    # Paths
    input_dir = r"C:\Users\almul\Downloads\Migration TXTs"
    output_file = r"C:\Users\almul\Downloads\Migration TXTs\COMBINED_MIGRATION.sql"
    
    print("="*80)
    print("SQL FILE COMBINER")
    print("="*80)
    print(f"Input directory: {input_dir}")
    print(f"Output file: {output_file}")
    print("="*80)
    
    # Check if input directory exists
    if not os.path.exists(input_dir):
        print(f"❌ Error: Directory not found: {input_dir}")
        return
    
    # Get all .txt files in the directory
    txt_files = glob.glob(os.path.join(input_dir, "*.txt"))
    
    if not txt_files:
        print(f"❌ Error: No .txt files found in {input_dir}")
        return
    
    # Sort files: master tables first (00_master_tables.txt), then others
    txt_files.sort()
    
    print(f"\n📁 Found {len(txt_files)} .txt files")
    print("\nFiles to combine:")
    for i, file in enumerate(txt_files, 1):
        filename = os.path.basename(file)
        file_size = os.path.getsize(file)
        print(f"  {i}. {filename} ({file_size:,} bytes)")
    
    # Combine all files
    print("\n🔄 Combining files...")
    
    try:
        with open(output_file, 'w', encoding='utf-8') as outfile:
            # Write header
            outfile.write("-- ============================================================================\n")
            outfile.write("-- COMBINED SURVEY DATA MIGRATION SQL\n")
            outfile.write(f"-- Generated: {datetime.now().isoformat()}\n")
            outfile.write(f"-- Total files combined: {len(txt_files)}\n")
            outfile.write("-- ============================================================================\n\n")
            
            # Combine each file
            for i, txt_file in enumerate(txt_files, 1):
                filename = os.path.basename(txt_file)
                print(f"  ✓ Processing: {filename}")
                
                # Write separator
                outfile.write(f"\n-- ============================================================================\n")
                outfile.write(f"-- FILE {i}/{len(txt_files)}: {filename}\n")
                outfile.write(f"-- ============================================================================\n\n")
                
                # Read and write file content
                with open(txt_file, 'r', encoding='utf-8') as infile:
                    content = infile.read()
                    outfile.write(content)
                    outfile.write("\n\n")
        
        # Get output file size
        output_size = os.path.getsize(output_file)
        
        print("\n" + "="*80)
        print("✅ SUCCESS!")
        print("="*80)
        print(f"Combined SQL file created: {output_file}")
        print(f"Total size: {output_size:,} bytes ({output_size / 1024:.2f} KB)")
        print(f"Files combined: {len(txt_files)}")
        print("\n📋 Next steps:")
        print("1. Open Supabase SQL Editor")
        print("2. Copy and paste the contents of COMBINED_MIGRATION.sql")
        print("3. Execute the SQL")
        print("="*80)
        
    except Exception as e:
        print(f"\n❌ Error combining files: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    combine_sql_files()
