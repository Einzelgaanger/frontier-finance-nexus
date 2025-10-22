import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  author_name?: string;
  author_company?: string;
  author_avatar?: string;
}

interface BlogDetailModalProps {
  blog: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLikeToggle: () => void;
  isLiked: boolean;
  likeCount: number;
}

export function BlogDetailModal({ blog, open, onOpenChange, onLikeToggle, isLiked, likeCount }: BlogDetailModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && blog) {
      fetchComments();
    }
  }, [open, blog]);

  const fetchComments = async () => {
    try {
      const { data: commentsData, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_id', blog.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch user profiles for comment authors
      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map(c => c.user_id))];
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('id, company_name, full_name, profile_picture_url')
          .in('id', userIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        const enrichedComments = commentsData.map(comment => ({
          ...comment,
          author_name: profileMap.get(comment.user_id)?.full_name || 'Unknown',
          author_company: profileMap.get(comment.user_id)?.company_name,
          author_avatar: profileMap.get(comment.user_id)?.profile_picture_url
        }));

        setComments(enrichedComments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          blog_id: blog.id,
          user_id: user?.id,
          content: newComment.trim()
        });

      if (error) throw error;

      toast({
        title: "Comment posted",
        description: "Your comment has been added"
      });

      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return '🖼️';
      case 'video':
        return '🎬';
      default:
        return '📝';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getMediaIcon(blog.media_type)} {blog.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Author info */}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={blog.author_avatar} />
              <AvatarFallback>{blog.author_name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{blog.author_name}</p>
              <p className="text-sm text-muted-foreground">{blog.author_company}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(blog.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Media */}
          {blog.media_url && (
            <div className="rounded-lg overflow-hidden">
              {blog.media_type === 'video' ? (
                <video
                  src={blog.media_url}
                  controls
                  className="w-full max-h-[500px] object-contain bg-black"
                />
              ) : (
                <img
                  src={blog.media_url}
                  alt={blog.title}
                  className="w-full max-h-[500px] object-contain"
                />
              )}
              {blog.caption && (
                <p className="mt-2 text-sm text-muted-foreground italic">{blog.caption}</p>
              )}
            </div>
          )}

          {/* Content */}
          {blog.content && (
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{blog.content}</p>
            </div>
          )}

          {/* Like button */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={onLikeToggle}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
            </div>
          </div>

          {/* Comments section */}
          <div className="space-y-4">
            <h3 className="font-semibold">Comments</h3>
            
            {/* Comment input */}
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="min-h-[80px]"
                disabled={loading}
              />
              <Button
                onClick={handleSubmitComment}
                disabled={loading || !newComment.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Comments list */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.author_avatar} />
                    <AvatarFallback>{comment.author_name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{comment.author_name}</p>
                      {comment.author_company && (
                        <Badge variant="secondary" className="text-xs">
                          {comment.author_company}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
