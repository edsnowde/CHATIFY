import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Post as PostType, CommentType, UserRole } from "@/utils/types"; // Added UserRole
import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal, 
  Share2 as Share, // Updated icon
  Trash2 as Trash, // Updated icon
  Edit3 as Edit, // Updated icon
  Send,
  Users, // For role badge - though GraduationCap/Briefcase might be better here
  Briefcase, // For department and faculty role
  Clock, // For time
  GraduationCap, // For student role
  AlertTriangle // For flagged content warning
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea"; // For editing post

interface PostProps {
  post: PostType;
  currentUser?: User;
  onPostUpdate?: (updatedPost: PostType) => void;
  onPostDelete?: (postId: string) => void;
}

const Post = ({ post, currentUser, onPostUpdate, onPostDelete }: PostProps) => {
  const [isLiked, setIsLiked] = useState(currentUser && post.likes ? post.likes.includes(currentUser.id) : false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>(post.comments || []);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);

  const { toast } = useToast();

  useEffect(() => {
    setIsLiked(currentUser && post.likes ? post.likes.includes(currentUser.id) : false);
    setLikeCount(post.likes?.length || 0);
    setComments(post.comments || []);
    setEditedContent(post.content); // Reset edited content if post prop changes
  }, [post, currentUser]);
  
  const handleLike = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive"
      });
      return;
    }
    
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
    
    const updatedLikes = newIsLiked 
      ? [...(post.likes || []), currentUser.id]
      : (post.likes || []).filter(id => id !== currentUser.id);
      
    const updatedPost = { ...post, likes: updatedLikes, updatedAt: new Date() };
    
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
  };
  
  const handleComment = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on posts",
        variant: "destructive"
      });
      return;
    }
    
    if (!newComment.trim()) return;
    
    const comment: CommentType = {
      id: Date.now().toString(),
      content: newComment,
      createdAt: new Date(),
      authorId: currentUser.id,
      author: currentUser,
      postId: post.id,
      likes: [],
    };
    
    const updatedComments = [...comments, comment];
    setComments(updatedComments);
    setNewComment("");
    
    const updatedPost = { ...post, comments: updatedComments, updatedAt: new Date() };
    
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
  };
  
  const handleDelete = () => {
    if (!currentUser || currentUser.id !== post.authorId) {
      toast({
        title: "Permission denied",
        description: "You can only delete your own posts",
        variant: "destructive"
      });
      return;
    }
    
    if (onPostDelete) {
      onPostDelete(post.id);
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
        variant: "default"
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!currentUser || currentUser.id !== post.authorId) {
      toast({ title: "Permission Denied", variant: "destructive" });
      return;
    }
    if (!editedContent.trim()) {
      toast({ title: "Content cannot be empty", variant: "destructive" });
      return;
    }
    const updatedPost = { ...post, content: editedContent, updatedAt: new Date() };
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
    setIsEditing(false);
    toast({ title: "Post Updated" });
  };

  const handleCancelEdit = () => {
    setEditedContent(post.content);
    setIsEditing(false);
  };

  const isAuthor = currentUser?.id === post.authorId;
  const postAuthor = post.author || { name: "Unknown User", avatar: undefined, role: "student" as UserRole, department: "N/A", id: "unknown", year: "N/A", createdAt: new Date() };
  
  return (
    <Card className="mb-6 shadow-lg border-border rounded-xl overflow-hidden transition-all hover:shadow-xl bg-card relative">
      {/* Flagged Content Indicator */}
      {post.isFlagged && (
        <div 
          className="absolute top-3 right-3 w-4 h-4 bg-red-500 rounded-full z-10 flex items-center justify-center shadow-md" 
          title="This content has been flagged as inappropriate"
        >
          <AlertTriangle className="h-2.5 w-2.5 text-white" />
        </div>
      )}
      
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${postAuthor.id}`}>
              <Avatar className="h-11 w-11 border-2 border-primary/20">
                <AvatarImage src={postAuthor.avatar} alt={postAuthor.name} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {postAuthor.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${postAuthor.id}`} className="font-semibold text-foreground hover:underline text-sm sm:text-base">
                  {postAuthor.name}
                </Link>
                <Badge 
                  variant="secondary" // Use a base variant, then conditional class
                  className={`capitalize text-xs px-2 py-0.5 rounded-full ${
                    postAuthor.role === "faculty" 
                      ? 'bg-dsu-maroon text-dsu-soft-white' 
                      : 'bg-dsu-navy text-dsu-soft-white'
                  }`}
                >
                  {postAuthor.role === "faculty" ? 
                    <Briefcase className="h-3 w-3 mr-1 inline-block" /> : 
                    <GraduationCap className="h-3 w-3 mr-1 inline-block" />
                  }
                  {postAuthor.role}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-x-2 gap-y-0.5">
                {postAuthor.department && (
                  <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{postAuthor.department}</span>
                )}
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1" title={format(new Date(post.createdAt), "PPPpp")}>
                  <Clock className="h-3 w-3" />{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  {post.createdAt?.getTime() !== post.updatedAt?.getTime() && " (edited)"}
                </span>
              </div>
            </div>
          </div>
          
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit} className="flex items-center gap-2 cursor-pointer">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                  <span>Edit Post</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        {isEditing ? (
          <div className="space-y-2">
            <Textarea 
              value={editedContent} 
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[100px] border-border focus-visible:ring-primary"
              rows={4}
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit}>Cancel</Button>
              <Button size="sm" onClick={handleSaveEdit} className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
            </div>
          </div>
        ) : (
          <div className="whitespace-pre-wrap text-foreground/90 mb-3 text-sm sm:text-base leading-relaxed">{post.content}</div>
        )}
        
        {post.tags && post.tags.length > 0 && !isEditing && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                to={`/tag/${tag.replace("#", "")}`} // Assuming a tag route
                className="text-primary hover:underline text-xs px-2 py-0.5 bg-primary/10 rounded-full transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        
        {post.images && post.images.length > 0 && !isEditing && (
          <div className={`grid gap-2 mb-3 rounded-lg overflow-hidden border border-border ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Post image ${index + 1}`} 
                className="w-full object-cover aspect-video" // Standard aspect ratio
              />
            ))}
          </div>
        )}
      </CardContent>
      
      {!isEditing && (
        <CardFooter className="p-0 border-t border-border">
          <div className="w-full">
            <div className="flex">
              <Button 
                variant="ghost" 
                className={`flex-1 gap-1.5 sm:gap-2 rounded-none py-3 text-sm ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`} 
                onClick={handleLike}
              >
                <Heart className={`h-4 sm:h-5 w-4 sm:w-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
              </Button>
              
              <Button 
                variant="ghost" 
                className="flex-1 gap-1.5 sm:gap-2 rounded-none py-3 text-sm text-muted-foreground hover:text-foreground" 
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</span>
              </Button>
              
              <Button variant="ghost" className="flex-1 gap-1.5 sm:gap-2 rounded-none py-3 text-sm text-muted-foreground hover:text-foreground">
                <Share className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>Share</span>
              </Button>
            </div>
            
            {showComments && (
              <div className="p-4 bg-muted/20 border-t border-border">
                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2">
                  {comments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4 text-sm">No comments yet. Be the first!</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5">
                        <Link to={`/profile/${comment.author?.id || 'unknown'}`}>
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage src={comment.author?.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {comment.author?.name.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        
                        <div className="flex-1">
                          <div className="bg-background p-2.5 rounded-lg border border-border shadow-sm">
                            <div className="flex justify-between items-center mb-0.5">
                              <div className="flex items-center gap-1.5">
                                <Link to={`/profile/${comment.author?.id || 'unknown'}`} className="font-medium text-xs hover:underline text-foreground">
                                  {comment.author?.name || "Anonymous"}
                                </Link>
                                {comment.author?.role && (
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 capitalize border-none ${
                                    comment.author.role === "faculty" 
                                      ? "bg-dsu-maroon/10 text-dsu-maroon" 
                                      : "bg-dsu-navy/10 text-dsu-navy"
                                    }`}>
                                    {comment.author.role === "faculty" ? 
                                      <Briefcase className="h-2.5 w-2.5 mr-0.5 inline-block" /> : 
                                      <GraduationCap className="h-2.5 w-2.5 mr-0.5 inline-block" />
                                    }
                                    {comment.author.role}
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground" title={format(new Date(comment.createdAt), "PPPpp")}>
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {currentUser && (
                  <div className="flex gap-2.5 items-center pt-2 border-t border-border">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={currentUser?.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {currentUser?.name.charAt(0).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 flex gap-2">
                      <Input 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a thoughtful comment..."
                        className="flex-1 text-sm bg-background focus-visible:ring-primary"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleComment();
                          }
                        }}
                      />
                      <Button size="icon" onClick={handleComment} disabled={!newComment.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Post;