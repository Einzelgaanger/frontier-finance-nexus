-- =====================================================
-- ADD RLS POLICIES FOR ALL SURVEY TABLES
-- Run this AFTER 2_CREATE_COMPLETE_SCHEMA.sql
-- Run this ONLY if policies don't already exist
-- =====================================================

-- RLS Policies for survey_responses_2021
DO $$ 
BEGIN
    BEGIN
        CREATE POLICY "Users can view own 2021 surveys"
            ON public.survey_responses_2021 FOR SELECT
            USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can insert own 2021 surveys"
            ON public.survey_responses_2021 FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can update own 2021 surveys"
            ON public.survey_responses_2021 FOR UPDATE
            USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Admins and members can view all 2021 surveys"
            ON public.survey_responses_2021 FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_profiles
                    WHERE id = auth.uid() AND user_role IN ('admin', 'member')
                )
            );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- RLS Policies for survey_responses_2022
DO $$ 
BEGIN
    BEGIN
        CREATE POLICY "Users can view own 2022 surveys"
            ON public.survey_responses_2022 FOR SELECT
            USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can insert own 2022 surveys"
            ON public.survey_responses_2022 FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can update own 2022 surveys"
            ON public.survey_responses_2022 FOR UPDATE
            USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Admins and members can view all 2022 surveys"
            ON public.survey_responses_2022 FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_profiles
                    WHERE id = auth.uid() AND user_role IN ('admin', 'member')
                )
            );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- RLS Policies for survey_responses_2023
DO $$ 
BEGIN
    BEGIN
        CREATE POLICY "Users can view own 2023 surveys"
            ON public.survey_responses_2023 FOR SELECT
            USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can insert own 2023 surveys"
            ON public.survey_responses_2023 FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can update own 2023 surveys"
            ON public.survey_responses_2023 FOR UPDATE
            USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Admins and members can view all 2023 surveys"
            ON public.survey_responses_2023 FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_profiles
                    WHERE id = auth.uid() AND user_role IN ('admin', 'member')
                )
            );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- RLS Policies for survey_responses_2024
DO $$ 
BEGIN
    BEGIN
        CREATE POLICY "Users can view own 2024 surveys"
            ON public.survey_responses_2024 FOR SELECT
            USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can insert own 2024 surveys"
            ON public.survey_responses_2024 FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Users can update own 2024 surveys"
            ON public.survey_responses_2024 FOR UPDATE
            USING (auth.uid() = user_id);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;

    BEGIN
        CREATE POLICY "Admins and members can view all 2024 surveys"
            ON public.survey_responses_2024 FOR SELECT
            USING (
                EXISTS (
                    SELECT 1 FROM public.user_profiles
                    WHERE id = auth.uid() AND user_role IN ('admin', 'member')
                )
            );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
END $$;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'RLS Policies Added Successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Policies created for:';
    RAISE NOTICE '  ✓ survey_responses_2021';
    RAISE NOTICE '  ✓ survey_responses_2022';
    RAISE NOTICE '  ✓ survey_responses_2023';
    RAISE NOTICE '  ✓ survey_responses_2024';
    RAISE NOTICE '========================================';
END $$;
