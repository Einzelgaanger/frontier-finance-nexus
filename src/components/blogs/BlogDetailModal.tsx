import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Image, Video, FileText, Heart } from "lucide-react";
import { BlogCommentSection } from "./BlogCommentSection";
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

interface BlogDetailModalProps {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleLike: (blogId: string, isLiked: boolean) => void;
}

export function BlogDetailModal({ blog, open, onOpenChange, onToggleLike }: BlogDetailModalProps) {
  if (!blog) return null;

  const getMediaIcon = (type: string | null) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={blog.author?.profile_picture_url || ""} />
              <AvatarFallback>
                {blog.author?.full_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl">
                  {blog.author?.full_name || "Unknown"}
                </DialogTitle>
                {blog.author?.total_points !== undefined && (
                  <span className="text-xl">
                    {getBadge(blog.author.total_points).icon}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{blog.author?.company_name}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(blog.created_at), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Badge variant="secondary" className="gap-1">
              {getMediaIcon(blog.media_type)}
              {blog.media_type || "text"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{blog.title}</h2>

          {blog.media_type === "image" && blog.media_url && (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={blog.media_url} 
                alt={blog.title}
                className="w-full max-h-[400px] object-contain bg-muted"
              />
            </div>
          )}

          {blog.media_type === "video" && blog.media_url && (
            <video 
              src={blog.media_url}
              controls
              className="w-full max-h-[400px] rounded-lg"
            />
          )}

          {blog.caption && (
            <p className="text-sm text-muted-foreground italic">
              {blog.caption}
            </p>
          )}

          {blog.content && (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{blog.content}</p>
            </div>
          )}

          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(blog.id, blog.is_liked || false);
              }}
              className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            >
              <Heart className={`w-5 h-5 ${blog.is_liked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="font-medium">{blog.like_count} likes</span>
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Comments</h3>
            <BlogCommentSection blogId={blog.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
