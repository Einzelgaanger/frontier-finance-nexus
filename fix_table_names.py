#!/usr/bin/env python3
"""
Script to fix table names across all files
Changes survey_responses_202X to survey_202X_responses
"""

import os
import re

def fix_table_names_in_file(file_path):
    """Fix table names in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace old table names with new ones
        replacements = [
            ('survey_responses_2021', 'survey_2021_responses'),
            ('survey_responses_2022', 'survey_2022_responses'),
            ('survey_responses_2023', 'survey_2023_responses'),
            ('survey_responses_2024', 'survey_2024_responses'),
        ]
        
        original_content = content
        for old_name, new_name in replacements:
            content = content.replace(old_name, new_name)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed: {file_path}")
            return True
        else:
            print(f"⏭️  No changes needed: {file_path}")
            return False
            
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main function to fix all files"""
    # Files that need fixing
    files_to_fix = [
        'src/components/network/AdminNetworkCards.tsx',
        'src/components/dashboard/AdminDashboardV2.tsx',
        'src/pages/NetworkV2.tsx',
        'src/pages/FundManagerDetail.tsx',
        'src/pages/Analytics2024.tsx',
        'src/pages/Analytics2023.tsx',
        'src/pages/Analytics2022.tsx',
        'src/components/network/MemberNetworkCards.tsx',
        'src/components/survey/ReadOnlySurvey2021.tsx',
        'src/hooks/useSurveyStatus.ts',
        'src/components/admin/AdminFundManagers.tsx',
        'src/pages/Analytics2021.tsx',
        'src/pages/AnalyticsV2.tsx',
        'src/integrations/supabase/types.ts'
    ]
    
    print("🔧 Fixing table names across all files...")
    fixed_count = 0
    
    for file_path in files_to_fix:
        if os.path.exists(file_path):
            if fix_table_names_in_file(file_path):
                fixed_count += 1
        else:
            print(f"⚠️  File not found: {file_path}")
    
    print(f"\n✅ Fixed {fixed_count} files")
    print("🎉 All table names have been updated!")

if __name__ == "__main__":
    main()
