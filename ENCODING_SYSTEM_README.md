# Data Privacy Encoding System

This system allows data entry workers to manually enter survey data without knowing the real identities of fund managers.

## System Overview

### Character Encoding
Each character (a-z, A-Z, 0-9, and special characters) is mapped to a unique number starting from 10. Characters are separated by hyphens when encoded.

**Example:** 
- If `z = 890`, `a = 7878`, `q = 12`
- Then `"zaq"` becomes `"890-7878-12"`

### Components

#### 1. R Script (`encode_excel_files.R`)
- Located in the project root
- Encodes specific columns in Excel files
- Creates backups of original files
- Run in R Studio to encode your Excel files

**Files it processes:**
- `C:\Users\almul\Downloads\CFF2021.xlsx`
- `C:\Users\almul\Downloads\CFF2022.xlsx`
- `C:\Users\almul\Downloads\CFF2023.xlsx`
- `C:\Users\almul\Downloads\CFF2024.xlsx`

**Columns encoded by year:**

- **2021**: Email Address, "1. Name of firm", "2. Name of participant"
- **2022**: Name, Email address, Name of organisation
- **2023**: Email address, Name of organisation, Name of Fund to which this survey applies
- **2024**: Email address, Name of your organization

#### 2. Encoded Login (`/encoded-auth`)
- Special login page for data entry workers
- Accepts encoded email and password
- Decodes credentials before authentication
- Default encoded password: `25-10-28-28-32-24-27-13-63-64-65` (represents "password123")

#### 3. Encoded Display Mode
- Admin toggle to switch between encoded/normal display
- Located in Admin Dashboard
- When enabled, shows encoded emails throughout the app:
  - Header/profile
  - Network pages
  - Survey forms (first few questions only)

#### 4. Survey Forms
Specific questions accept encoded input but store decoded data:

- **2021 Survey**: Questions 1, 2, 3 (Email, Firm name, Participant name)
- **2022 Survey**: Questions 1, 3, 4 (Name, Email, Organisation)
- **2023 Survey**: Questions 1, 2, 4 (Email, Organisation, Fund name)
- **2024 Survey**: Questions 1, 3 (Email, Organisation)

## Workflow for Data Entry

### For the Admin (You):

1. **Prepare Excel Files:**
   ```r
   # In R Studio, run:
   source("encode_excel_files.R")
   ```
   This creates encoded versions of your Excel files with backups.

2. **Enable Encoded Mode:**
   - Go to Admin Dashboard
   - Toggle "Data Privacy Mode" to ON
   - This hides real identities throughout the system

3. **Share with Data Entry Workers:**
   - Give them the encoded Excel files
   - Provide the encoded login URL: `https://your-app.com/encoded-auth`
   - Share the default encoded password: `25-10-28-28-32-24-27-13-63-64-65`

4. **After Data Entry is Complete:**
   - Go back to Admin Dashboard
   - Toggle "Data Privacy Mode" to OFF
   - All data will display normally again

### For Data Entry Workers:

1. **Login:**
   - Go to the provided encoded auth URL
   - Copy the encoded email from the Excel file
   - Use the provided encoded password
   - Click Login

2. **Navigate to Survey:**
   - Go to the Survey section
   - Select the appropriate year

3. **Enter Data:**
   - For the first few questions:
     - Copy the encoded values from Excel
     - Paste them into the form
     - The system will decode and save the actual data
   - For all other questions:
     - Find the actual answer in the Excel
     - Select/enter it normally in the survey

4. **Important Notes:**
   - You will see encoded emails everywhere (header, network, etc.)
   - This is intentional for privacy
   - You're entering real survey data, just with masked identities
   - The database always stores actual (decoded) data

## Technical Details

### Encoding/Decoding Functions
Located in `src/utils/encodingSystem.ts`:
- `encodeString(input)`: Converts text to encoded format
- `decodeString(encoded)`: Converts encoded format back to text
- `displayString(original)`: Shows encoded or normal based on mode
- `isEncodedModeEnabled()`: Checks current display mode
- `setEncodedMode(enabled)`: Toggles display mode

### Security Features
- No encoded/decoded data visible in console
- Database always stores decoded (actual) data
- Encoding is only for display and data entry
- Backend verifies decoded credentials

### Database Storage
All data in Supabase is stored in **decoded** (actual) format:
- Emails are real emails
- Company names are real company names
- Names are real names

The encoding is purely a frontend privacy layer for data entry.

## Character Map Reference

The R script and TypeScript utility use the same character mapping:
- Lowercase `a-z`: 10-35
- Uppercase `A-Z`: 36-61
- Digits `0-9`: 62-71
- Special chars ` .-@_!#$%&*+=?/`: 72-86

## Troubleshooting

### "Invalid encoded email or password format"
- Ensure you're copying the complete encoded string
- Check that there are no extra spaces
- Verify you're using hyphens to separate numbers

### "Invalid credentials"
- The decoded email might not exist in the system
- The decoded password might be incorrect
- Contact admin to verify the account exists

### Encoded display not working
- Check that "Data Privacy Mode" is enabled in Admin Dashboard
- Refresh the page after toggling the mode
- Clear browser cache if needed

### R Script errors
- Ensure file paths in script match your actual file locations
- Verify Excel files exist at specified paths
- Check that required R packages are installed (`openxlsx`)

## Example Data Flow

1. **Original Excel:** `email: john@example.com`
2. **After R Script:** `email: 45-24-43-23-75-14-33-10-22-25-21-14-73-12-24-22`
3. **Worker Copies:** Encoded string to login form
4. **System Decodes:** `john@example.com`
5. **Database Stores:** `john@example.com` (actual value)
6. **Display (Mode ON):** `45-24-43-23-75-14-33-10-22-25-21-14-73-12-24-22`
7. **Display (Mode OFF):** `john@example.com`
