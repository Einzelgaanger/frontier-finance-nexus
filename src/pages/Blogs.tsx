import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Image, Video, FileText, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { CreateBlogModal } from "@/components/blogs/CreateBlogModal";
import { BlogDetailModal } from "@/components/blogs/BlogDetailModal";
import { format } from "date-fns";
import { getBadge } from "@/utils/badgeSystem";

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

export default function Blogs() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    document.title = "Blogs | CFF Network";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Share insights and connect with fund managers through our community blog");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const fetchBlogs = async () => {
    try {
      const { data: blogsData, error: blogsError } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (blogsError) throw blogsError;

      // Fetch author profiles and credits
      const userIds = [...new Set(blogsData?.map(blog => blog.user_id) || [])];
      const [profilesRes, creditsRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("id, full_name, company_name, profile_picture_url")
          .in("id", userIds),
        supabase
          .from("user_credits")
          .select("user_id, total_points")
          .in("user_id", userIds)
      ]);

      // Fetch user likes
      let userLikes = new Set<string>();
      if (user) {
        const { data: likesData } = await supabase
          .from("blog_likes" as any)
          .select("blog_id")
          .eq("user_id", user.id);
        userLikes = new Set(likesData?.map((l: any) => l.blog_id) || []);
      }

      // Fetch like counts
      const { data: likeCounts } = await supabase
        .from("blog_likes" as any)
        .select("blog_id");
      const likeCountMap = new Map<string, number>();
      likeCounts?.forEach((like: any) => {
        likeCountMap.set(like.blog_id, (likeCountMap.get(like.blog_id) || 0) + 1);
      });

      // Fetch comment counts
      const { data: commentCounts } = await supabase
        .from("blog_comments")
        .select("blog_id");
      const commentCountMap = new Map<string, number>();
      commentCounts?.forEach((comment: any) => {
        commentCountMap.set(comment.blog_id, (commentCountMap.get(comment.blog_id) || 0) + 1);
      });

      const blogsWithAuthors = (blogsData?.map(blog => {
        const profile = profilesRes.data?.find(p => p.id === blog.user_id);
        const credit = creditsRes.data?.find(c => c.user_id === blog.user_id);
        return {
          ...blog,
          media_type: blog.media_type as 'text' | 'image' | 'video' | null,
          like_count: likeCountMap.get(blog.id) || 0,
          comment_count: commentCountMap.get(blog.id) || 0,
          is_liked: userLikes.has(blog.id),
          author: profile ? { ...profile, total_points: credit?.total_points || 0 } : undefined
        };
      }) || []) as Blog[];

      setBlogs(blogsWithAuthors);
    } catch (error: any) {
      toast.error("Failed to load blogs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (blogId: string, isLiked: boolean) => {
    if (!user) return;

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
      await fetchBlogs();
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

  return (
    <SidebarLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Community Blogs</h1>
            <p className="text-muted-foreground">Share insights and connect with fellow fund managers</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <PlusCircle className="h-5 w-5" />
            Create Post
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No blogs yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share your insights!</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Card 
                key={blog.id} 
                className="hover:shadow-lg transition-shadow group cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={blog.author?.profile_picture_url || ""} />
                        <AvatarFallback>
                          {blog.author?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{blog.author?.full_name || "Unknown"}</p>
                          {blog.author?.total_points !== undefined && (
                            <span className="text-lg">
                              {getBadge(blog.author.total_points).icon}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{blog.author?.company_name}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      {getMediaIcon(blog.media_type)}
                      {blog.media_type || "text"}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold line-clamp-2">{blog.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(blog.created_at), "MMM d, yyyy")}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {blog.media_type === "image" && blog.media_url && (
                    <div className="relative rounded-lg overflow-hidden">
                      <img 
                        src={blog.media_url} 
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge 
                        variant="secondary" 
                        className="absolute top-2 left-2 bg-black/60 text-white backdrop-blur-sm"
                      >
                        {blog.author?.company_name}
                      </Badge>
                    </div>
                  )}
                  {blog.media_type === "video" && blog.media_url && (
                    <video 
                      src={blog.media_url}
                      muted
                      loop
                      playsInline
                      className="w-full h-48 object-cover rounded-lg"
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  )}
                  {blog.caption && (
                    <p className="text-sm text-muted-foreground italic line-clamp-2">
                      {blog.caption}
                    </p>
                  )}
                  {blog.content && (
                    <p className="text-sm line-clamp-3">{blog.content}</p>
                  )}
                  
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(blog.id, blog.is_liked || false);
                      }}
                      className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${blog.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{blog.like_count}</span>
                    </button>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                      <span>{blog.comment_count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CreateBlogModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={fetchBlogs}
        />

        <BlogDetailModal
          blog={selectedBlog}
          open={!!selectedBlog}
          onOpenChange={(open) => !open && setSelectedBlog(null)}
          onToggleLike={toggleLike}
        />
      </div>
    </SidebarLayout>
  );
}
