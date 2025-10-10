-- =====================================================
-- DATABASE SETUP SCRIPT FOR ALL SURVEYS
-- =====================================================
-- Run this script in your Supabase SQL editor or database client
-- This will create all the necessary tables for the surveys
-- =====================================================

-- First, let's create the main survey tables
-- Survey 2021
\i create_survey2021_tables.sql

-- Survey 2022  
\i create_survey2022_tables.sql

-- Survey 2023
\i create_survey2023_tables.sql

-- Survey 2024
\i create_survey2024_tables.sql

-- =====================================================
-- ALTERNATIVE: If you can't use \i commands, 
-- copy and paste the contents of each SQL file directly
-- =====================================================

