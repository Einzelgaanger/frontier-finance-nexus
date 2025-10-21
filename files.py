import requests
from datetime import datetime
SUPABASE_URL = "https://qiqxdivyyjcbegdlptuq.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcXhkaXZ5eWpjYmVnZGxwdHVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MjA4NDUsImV4cCI6MjA2NzQ5Njg0NX0.jkOmX28FJaWdMP2oFMflVwTpErCEU5WavvRzdnuyGRg"
try:
    # Get OpenAPI schema
    url = f"{SUPABASE_URL}/rest/v1/"
    params = {"apikey": SUPABASE_KEY}
    headers = {
        "apikey": SUPABASE_KEY,
        "Accept": "application/json"
    }
    
    response = requests.get(url, params=params, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        print(response.text)
    else:
        data = response.json()
        
        # Extract table info from OpenAPI spec
        schema_info = {}
        
        if 'definitions' in data:
            for table_name, table_schema in data['definitions'].items():
                if not table_name.startswith('_'):
                    props = table_schema.get('properties', {})
                    schema_info[table_name] = props
        
        # Create text file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"database_schema_{timestamp}.txt"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("=" * 90 + "\n")
            f.write("DATABASE SCHEMA INFORMATION - SUPABASE\n")
            f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=" * 90 + "\n\n")
            
            if schema_info:
                f.write(f"SUCCESS! Schema exported to: {filename}\n")
                f.write(f"Found {len(schema_info)} tables\n\n")
                f.write("=" * 90 + "\n")
                f.write("DETAILED SCHEMA:\n")
                f.write("=" * 90 + "\n\n")
                
                for table_name in sorted(schema_info.keys()):
                    columns = schema_info[table_name]
                    col_count = len(columns)
                    
                    f.write(f"\nTABLE: {table_name} ({col_count} columns)\n")
                    f.write("-" * 90 + "\n")
                    f.write(f"{'Column Name':<35} {'Data Type':<35} {'Format':<20}\n")
                    f.write("-" * 90 + "\n")
                    
                    for col_name in sorted(columns.keys()):
                        col_info = columns[col_name]
                        col_type = col_info.get('type', 'unknown')
                        format_type = col_info.get('format', 'N/A')
                        f.write(f"{col_name:<35} {col_type:<35} {format_type:<20}\n")
                
                f.write(f"\n{'='*90}\n")
                f.write(f"TOTAL TABLES: {len(schema_info)}\n")
                f.write(f"{'='*90}\n")
                
                print(f"File saved: {filename}")
            else:
                f.write("No tables found\n")
                print(f"File saved: {filename} (no tables found)")
except Exception as e:
    print(f"Error: {e}")
    print("Make sure you have requests: pip install requests")