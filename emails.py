import pandas as pd

# List of file paths
file_paths = [
    r"C:\Users\almul\Downloads\CFF2024.xlsx",
    r"C:\Users\almul\Downloads\CFF2023.xlsx",
    r"C:\Users\almul\Downloads\CFF2022.xlsx",
    r"C:\Users\almul\Downloads\CFF2021.xlsx"
]

# List to store all emails
all_emails = []

# Process each file
for file_path in file_paths:
    try:
        # Read the Excel file
        df = pd.read_excel(file_path)
        
        # Check if 'Email' column exists
        if 'Email' in df.columns:
            # Get all non-null emails from this file
            emails = df['Email'].dropna().tolist()
            all_emails.extend(emails)
            print(f"✓ Processed {file_path}: Found {len(emails)} emails")
        else:
            print(f"⚠ Warning: 'Email' column not found in {file_path}")
            print(f"  Available columns: {', '.join(df.columns)}")
    
    except FileNotFoundError:
        print(f"✗ Error: File not found - {file_path}")
    except Exception as e:
        print(f"✗ Error processing {file_path}: {str(e)}")

# Display results
print(f"\n{'='*50}")
print(f"Total emails collected: {len(all_emails)}")
print(f"{'='*50}\n")

# Print all emails
for i, email in enumerate(all_emails, 1):
    print(f"{i}. {email}")

# Optional: Save to a text file
output_file = r"C:\Users\almul\Downloads\all_emails.txt"
with open(output_file, 'w') as f:
    for email in all_emails:
        f.write(f"{email}\n")

print(f"\n✓ Emails also saved to: {output_file}")

# Optional: Remove duplicates if needed
unique_emails = list(set(all_emails))
print(f"\nUnique emails: {len(unique_emails)}")