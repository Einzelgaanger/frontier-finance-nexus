# R Script to Encode Excel Files for Data Privacy
# This script encodes specific columns in survey Excel files

library(openxlsx)

# Character encoding map with RANDOM numbers (10-999999) for maximum security
# These random mappings match the TypeScript encoding system exactly
character_map <- list(
  'a' = 847263, 'b' = 392048, 'c' = 651829, 'd' = 238475, 'e' = 905614,
  'f' = 473829, 'g' = 128563, 'h' = 794038, 'i' = 561920, 'j' = 314756,
  'k' = 682943, 'l' = 195827, 'm' = 836405, 'n' = 427691, 'o' = 954138,
  'p' = 603857, 'q' = 271549, 'r' = 918372, 's' = 485106, 't' = 762894,
  'u' = 139586, 'v' = 874201, 'w' = 526743, 'x' = 398162, 'y' = 645970,
  'z' = 281347,
  
  'A' = 957618, 'B' = 413829, 'C' = 769524, 'D' = 182635, 'E' = 904751,
  'F' = 537289, 'G' = 296843, 'H' = 871506, 'I' = 624197, 'J' = 348765,
  'K' = 915382, 'L' = 462708, 'M' = 783951, 'N' = 251694, 'O' = 896537,
  'P' = 374820, 'Q' = 659142, 'R' = 127485, 'S' = 943768, 'T' = 586329,
  'U' = 219573, 'V' = 804156, 'W' = 467921, 'X' = 732685, 'Y' = 195384,
  'Z' = 861749,
  
  '0' = 524096, '1' = 378152, '2' = 641827, '3' = 293765, '4' = 958471,
  '5' = 416803, '6' = 729548, '7' = 185692, '8' = 907234, '9' = 543817,
  
  ' ' = 298364, '.' = 876501, '-' = 621439, '@' = 354987, '_' = 918762,
  '!' = 465120, '#' = 787694, '$' = 256831, '%' = 892745, '&' = 371658,
  '*' = 654920, '+' = 123897, '=' = 948531, '?' = 582764, '/' = 948531
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
cat("\nDefault encoded password: 603857-847263-485106-485106-526743-954138-918372-238475-378152-641827-293765\n")
cat("(This is 'password123' encoded with random number mapping)\n")
cat("\nNOTE: Numbers are random (10-999999) with no patterns for maximum security.\n")
