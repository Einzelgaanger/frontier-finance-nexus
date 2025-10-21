"""
Excel Column Inspector
======================
This script shows all column names in your Excel file
so we can map them correctly to the database.
"""

import pandas as pd
import sys

if len(sys.argv) < 2:
    print("Usage: python inspect_excel_columns.py <excel_file>")
    sys.exit(1)

excel_file = sys.argv[1]

print("\n" + "="*80)
print("EXCEL FILE COLUMN INSPECTION")
print("="*80)
print(f"\nFile: {excel_file}\n")

try:
    # Read Excel file
    df = pd.read_excel(excel_file)
    
    print(f"Total Rows: {len(df)}")
    print(f"Total Columns: {len(df.columns)}")
    print("\n" + "-"*80)
    print("COLUMN NAMES (in order):")
    print("-"*80)
    
    for idx, col in enumerate(df.columns, 1):
        print(f"{idx:3d}. {col}")
    
    print("\n" + "-"*80)
    print("FIRST ROW SAMPLE DATA:")
    print("-"*80)
    
    if len(df) > 0:
        first_row = df.iloc[0]
        for col in df.columns[:10]:  # Show first 10 columns
            value = first_row[col]
            if pd.notna(value):
                value_str = str(value)[:50]  # Truncate long values
                print(f"{col}: {value_str}")
    
    print("\n" + "="*80)
    print("✓ Inspection complete!")
    print("="*80)
    
except Exception as e:
    print(f"\n✗ Error reading file: {e}")
    sys.exit(1)
