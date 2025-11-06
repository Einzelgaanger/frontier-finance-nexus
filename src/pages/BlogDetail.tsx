import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Image, Video, FileText, Heart, ArrowLeft, Loader2 } from "lucide-react";
import { BlogCommentSection } from "@/components/blogs/BlogCommentSection";
import { getBadge } from "@/utils/badgeSystem";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Blog {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  media_type: 'text' | 'image' | 'video' | null;
  media_url: string | null;
  caption: string | null;
  created_at: string;
  like_count: number;
  comment_count: number;
  author?: {
    full_name: string;
    company_name: string;
    profile_picture_url: string | null;
    total_points?: number;
  };
  is_liked?: boolean;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const { data: blogData, error: blogError } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (blogError) throw blogError;

      // Fetch author profile and credits
      const [profileRes, creditRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("id, full_name, company_name, profile_picture_url")
          .eq("id", blogData.user_id)
          .single(),
        supabase
          .from("user_credits")
          .select("total_points")
          .eq("user_id", blogData.user_id)
          .single()
      ]);

      // Fetch user like status
      let isLiked = false;
      if (user) {
        const { data: likeData } = await supabase
          .from("blog_likes" as any)
          .select("id")
          .eq("blog_id", id)
          .eq("user_id", user.id)
          .maybeSingle();
        isLiked = !!likeData;
      }

      // Fetch like count
      const { data: likeCounts } = await supabase
        .from("blog_likes" as any)
        .select("*")
        .eq("blog_id", blogData.id);
      const likeCount = likeCounts?.length || 0;

      // Fetch comment count
      const { data: commentCounts } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("blog_id", blogData.id);
      const commentCount = commentCounts?.length || 0;

      const fullBlog: Blog = {
        ...blogData,
        media_type: blogData.media_type as 'text' | 'image' | 'video' | null,
        like_count: likeCount,
        comment_count: commentCount,
        is_liked: isLiked,
        author: profileRes.data ? { 
          ...profileRes.data, 
          total_points: creditRes.data?.total_points || 0 
        } : undefined
      };

      setBlog(fullBlog);
    } catch (error: any) {
      console.error('Error fetching blog:', error);
      toast.error("Failed to load blog post");
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (blogId: string, isLiked: boolean) => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from("blog_likes" as any)
          .delete()
          .eq("blog_id", blogId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("blog_likes" as any)
          .insert({ blog_id: blogId, user_id: user.id });
      }
      await fetchBlog();
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like");
    }
  };

  const getMediaIcon = (type: string | null) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </SidebarLayout>
    );
  }

  if (!blog) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
            <Button onClick={() => navigate('/blogs')}>Back to Blogs</Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/blogs')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>
          </div>

          {/* Blog Content */}
          <Card className="shadow-xl border-2 border-blue-100 bg-white/90 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-blue-200">
                    <AvatarImage src={blog.author?.profile_picture_url || ""} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl">
                      {blog.author?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {blog.author?.full_name || "Unknown"}
                      </h3>
                      {blog.author?.total_points !== undefined && (
                        <span className="text-2xl">
                          {getBadge(blog.author.total_points).icon}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{blog.author?.company_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(new Date(blog.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="secondary" 
                  className="gap-1 bg-blue-100/80 text-blue-700 border-blue-300 backdrop-blur-sm"
                >
                  {getMediaIcon(blog.media_type)}
                  {blog.media_type || "text"}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{blog.title}</h1>

              {blog.media_type === "image" && blog.media_url && (
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={blog.media_url} 
                    alt={blog.title}
                    className="w-full max-h-[600px] object-contain bg-gradient-to-br from-gray-50 to-gray-100"
                  />
                </div>
              )}

              {blog.media_type === "video" && blog.media_url && (
                <video 
                  src={blog.media_url}
                  controls
                  className="w-full max-h-[600px] rounded-xl shadow-lg"
                />
              )}

              {blog.caption && (
                <p className="text-lg text-gray-600 italic border-l-4 border-blue-400 pl-4 py-2 bg-blue-50/50 rounded-r-lg">
                  {blog.caption}
                </p>
              )}

              {blog.content && (
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{blog.content}</p>
                </div>
              )}

              <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleLike(blog.id, blog.is_liked || false)}
                  className="flex items-center gap-2 hover:text-pink-600 transition-colors group/like"
                >
                  <Heart className={`w-6 h-6 transition-all ${blog.is_liked ? 'fill-pink-500 text-pink-500 scale-110' : 'group-hover/like:scale-110'}`} />
                  <span className="font-semibold text-lg">{blog.like_count} likes</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t bg-gray-50/50 p-6">
              <h3 className="font-bold text-xl mb-4 text-gray-800">Comments</h3>
              <BlogCommentSection blogId={blog.id} />
            </div>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
}


