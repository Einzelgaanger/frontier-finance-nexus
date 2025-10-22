-- Create blogs table for member posts
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    media_type TEXT CHECK (media_type IN ('text', 'image', 'video')),
    media_url TEXT,
    caption TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_credits table for gamification
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    total_points INTEGER DEFAULT 0,
    ai_usage_count INTEGER DEFAULT 0,
    blog_posts_count INTEGER DEFAULT 0,
    login_streak INTEGER DEFAULT 0,
    last_login_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create activity_log table to track all point-earning activities
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('ai_usage', 'blog_post', 'daily_login', 'survey_completion', 'network_interaction')),
    points_earned INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blogs
CREATE POLICY "Members can view all published blogs"
ON public.blogs
FOR SELECT
TO authenticated
USING (
    is_published = true 
    AND EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() 
        AND role IN ('member', 'admin')
    )
);

CREATE POLICY "Members can create their own blogs"
ON public.blogs
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() 
        AND role IN ('member', 'admin')
    )
);

CREATE POLICY "Users can update their own blogs"
ON public.blogs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blogs"
ON public.blogs
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for user_credits
CREATE POLICY "Users can view their own credits"
ON public.user_credits
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
ON public.user_credits
FOR ALL
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for activity_log
CREATE POLICY "Users can view their own activity log"
ON public.activity_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activity log"
ON public.activity_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create function to award points
CREATE OR REPLACE FUNCTION public.award_points(
    p_user_id UUID,
    p_activity_type TEXT,
    p_points INTEGER,
    p_description TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert into user_credits or update if exists
    INSERT INTO public.user_credits (user_id, total_points)
    VALUES (p_user_id, p_points)
    ON CONFLICT (user_id)
    DO UPDATE SET 
        total_points = user_credits.total_points + p_points,
        updated_at = NOW();
    
    -- Log the activity
    INSERT INTO public.activity_log (user_id, activity_type, points_earned, description)
    VALUES (p_user_id, p_activity_type, p_points, p_description);
    
    -- Update specific counters
    IF p_activity_type = 'ai_usage' THEN
        UPDATE public.user_credits 
        SET ai_usage_count = ai_usage_count + 1
        WHERE user_id = p_user_id;
    ELSIF p_activity_type = 'blog_post' THEN
        UPDATE public.user_credits 
        SET blog_posts_count = blog_posts_count + 1
        WHERE user_id = p_user_id;
    END IF;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.award_points(UUID, TEXT, INTEGER, TEXT) TO authenticated;

-- Create trigger for blog post points
CREATE OR REPLACE FUNCTION public.handle_blog_post_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Award 10 points for creating a blog post
    PERFORM public.award_points(NEW.user_id, 'blog_post', 10, 'Created blog post: ' || NEW.title);
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_blog_post_created
    AFTER INSERT ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_blog_post_points();

-- Create indexes for performance
CREATE INDEX idx_blogs_user_id ON public.blogs(user_id);
CREATE INDEX idx_blogs_created_at ON public.blogs(created_at DESC);
CREATE INDEX idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at DESC);