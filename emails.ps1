# PowerShell script to extract emails from Excel files

# File paths
$filePaths = @(
    "C:\Users\almul\Downloads\CFF2024.xlsx",
    "C:\Users\almul\Downloads\CFF2023.xlsx",
    "C:\Users\almul\Downloads\CFF2022.xlsx",
    "C:\Users\almul\Downloads\CFF2021.xlsx"
)

# Create Excel COM object
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

# Array to store all emails
$allEmails = @()

Write-Host "`nProcessing Excel files..." -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

foreach ($filePath in $filePaths) {
    try {
        if (Test-Path $filePath) {
            Write-Host "`nOpening: $filePath" -ForegroundColor Yellow
            
            # Open workbook
            $workbook = $excel.Workbooks.Open($filePath)
            $worksheet = $workbook.Sheets.Item(1)
            
            # Find the Email column
            $headerRow = 1
            $emailColumn = $null
            
            for ($col = 1; $col -le 50; $col++) {
                $header = $worksheet.Cells.Item($headerRow, $col).Text
                if ($header -eq "Email") {
                    $emailColumn = $col
                    break
                }
            }
            
            if ($emailColumn) {
                # Get the last used row
                $lastRow = $worksheet.UsedRange.Rows.Count
                
                # Extract emails
                $emailCount = 0
                for ($row = 2; $row -le $lastRow; $row++) {
                    $email = $worksheet.Cells.Item($row, $emailColumn).Text
                    if ($email -and $email.Trim() -ne "") {
                        $allEmails += $email.Trim()
                        $emailCount++
                    }
                }
                
                Write-Host "  ✓ Found $emailCount emails" -ForegroundColor Green
            }
            else {
                Write-Host "  ⚠ 'Email' column not found" -ForegroundColor Red
            }
            
            # Close workbook
            $workbook.Close($false)
        }
        else {
            Write-Host "  ✗ File not found: $filePath" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "  ✗ Error: $_" -ForegroundColor Red
    }
}

# Quit Excel
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

# Display results
Write-Host "`n" -NoNewline
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "Total emails collected: $($allEmails.Count)" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host ""

# Print all emails
for ($i = 0; $i -lt $allEmails.Count; $i++) {
    Write-Host "$($i + 1). $($allEmails[$i])"
}

# Save to file
$outputFile = "C:\Users\almul\Downloads\all_emails.txt"
$allEmails | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`n✓ Emails saved to: $outputFile" -ForegroundColor Green

# Show unique count
$uniqueEmails = $allEmails | Select-Object -Unique
Write-Host "Unique emails: $($uniqueEmails.Count)" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


