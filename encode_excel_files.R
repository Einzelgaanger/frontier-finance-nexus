# R Script to Encode Excel Files for Data Privacy
# This script encodes specific columns in survey Excel files

library(openxlsx)

# Character encoding map
character_map <- list(
  'a' = 10, 'b' = 11, 'c' = 12, 'd' = 13, 'e' = 14, 'f' = 15, 'g' = 16, 'h' = 17, 'i' = 18, 'j' = 19,
  'k' = 20, 'l' = 21, 'm' = 22, 'n' = 23, 'o' = 24, 'p' = 25, 'q' = 26, 'r' = 27, 's' = 28, 't' = 29,
  'u' = 30, 'v' = 31, 'w' = 32, 'x' = 33, 'y' = 34, 'z' = 35,
  'A' = 36, 'B' = 37, 'C' = 38, 'D' = 39, 'E' = 40, 'F' = 41, 'G' = 42, 'H' = 43, 'I' = 44, 'J' = 45,
  'K' = 46, 'L' = 47, 'M' = 48, 'N' = 49, 'O' = 50, 'P' = 51, 'Q' = 52, 'R' = 53, 'S' = 54, 'T' = 55,
  'U' = 56, 'V' = 57, 'W' = 58, 'X' = 59, 'Y' = 60, 'Z' = 61,
  '0' = 62, '1' = 63, '2' = 64, '3' = 65, '4' = 66, '5' = 67, '6' = 68, '7' = 69, '8' = 70, '9' = 71,
  ' ' = 72, '.' = 73, '-' = 74, '@' = 75, '_' = 76, '!' = 77, '#' = 78, '$' = 79, '%' = 80, '&' = 81,
  '*' = 82, '+' = 83, '=' = 84, '?' = 85, '/' = 86
)

# Function to encode a string
encode_string <- function(input_str) {
  if (is.na(input_str) || input_str == "") {
    return("")
  }
  
  chars <- strsplit(as.character(input_str), "")[[1]]
  encoded_nums <- sapply(chars, function(char) {
    code <- character_map[[char]]
    if (is.null(code)) {
      return(72)  # Default to space if character not found
    }
    return(code)
  })
  
  return(paste(encoded_nums, collapse = "-"))
}

# Function to encode specific columns in a dataframe
encode_columns <- function(df, columns_to_encode, skip_rows = 1) {
  # Skip header rows
  if (nrow(df) <= skip_rows) {
    return(df)
  }
  
  # Encode specified columns (starting after skip_rows)
  for (col in columns_to_encode) {
    if (col %in% colnames(df)) {
      for (i in (skip_rows + 1):nrow(df)) {
        df[i, col] <- encode_string(df[i, col])
      }
    }
  }
  
  return(df)
}

# File paths
file_paths <- list(
  "2021" = "C:/Users/almul/Downloads/CFF2021.xlsx",
  "2022" = "C:/Users/almul/Downloads/CFF2022.xlsx",
  "2023" = "C:/Users/almul/Downloads/CFF2023.xlsx",
  "2024" = "C:/Users/almul/Downloads/CFF2024.xlsx"
)

# Columns to encode for each year
columns_config <- list(
  "2021" = list(
    columns = c("Email Address", "1. Name of firm", "2. Name of participant"),
    skip_rows = 1
  ),
  "2022" = list(
    columns = c("Name", "Email address", "Name of organisation"),
    skip_rows = 2
  ),
  "2023" = list(
    columns = c("Email address", "Name of organisation", "Name of Fund  to which this survey applies (that is Fund 1)"),
    skip_rows = 2
  ),
  "2024" = list(
    columns = c("Email address", "Name of your organization"),
    skip_rows = 2
  )
)

# Process each file
for (year in names(file_paths)) {
  file_path <- file_paths[[year]]
  
  cat(paste("\nProcessing", year, "survey...\n"))
  
  # Check if file exists
  if (!file.exists(file_path)) {
    cat(paste("Warning: File not found:", file_path, "\n"))
    next
  }
  
  # Read Excel file
  tryCatch({
    df <- read.xlsx(file_path, sheet = 1)
    
    # Get configuration for this year
    config <- columns_config[[year]]
    
    # Encode specified columns
    df_encoded <- encode_columns(df, config$columns, config$skip_rows)
    
    # Create backup file
    backup_path <- sub(".xlsx", "_backup.xlsx", file_path)
    file.copy(file_path, backup_path, overwrite = TRUE)
    cat(paste("Backup created:", backup_path, "\n"))
    
    # Save encoded file
    write.xlsx(df_encoded, file_path, overwrite = TRUE)
    cat(paste("Encoded file saved:", file_path, "\n"))
    cat(paste("Columns encoded:", paste(config$columns, collapse = ", "), "\n"))
    
  }, error = function(e) {
    cat(paste("Error processing", year, ":", e$message, "\n"))
  })
}

cat("\n=== Encoding Complete ===\n")
cat("All files have been processed.\n")
cat("Original files backed up with '_backup.xlsx' suffix.\n")
cat("\nDefault encoded password: 25-10-28-28-32-24-27-13-63-64-65\n")
cat("(This is 'password123' encoded)\n")
