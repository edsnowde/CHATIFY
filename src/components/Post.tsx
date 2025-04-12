import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Post as PostType, Comment as CommentType } from "@/utils/types";
import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal, 
  Share, 
  Trash,
  Edit,
  Send
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PostProps {
  post: PostType;
  currentUser?: User;
  onPostUpdate?: (updatedPost: PostType) => void;
  onPostDelete?: (postId: string) => void;
}

const Post = ({ post, currentUser, onPostUpdate, onPostDelete }: PostProps) => {
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser?.id || ""));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentType[]>(post.comments || []);
  const { toast } = useToast();
  
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
    
    // Update like count
    setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);
    
    // Create updated post object
    const updatedLikes = newIsLiked 
      ? [...post.likes, currentUser.id]
      : post.likes.filter(id => id !== currentUser.id);
      
    const updatedPost = { ...post, likes: updatedLikes };
    
    // Call the update function
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
    
    // In a real app, you'd send this to your API
    toast({
      title: newIsLiked ? "Post liked" : "Post unliked",
      variant: "default"
    });
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
    
    // Create updated post object
    const updatedPost = { ...post, comments: updatedComments };
    
    // Call the update function
    if (onPostUpdate) {
      onPostUpdate(updatedPost);
    }
    
    // In a real app, you'd send this to your API
    toast({
      title: "Comment added",
      variant: "default"
    });
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
    
    // Call the delete function
    if (onPostDelete) {
      onPostDelete(post.id);
      
      toast({
        title: "Post deleted",
        description: "Your post has been removed",
        variant: "default"
      });
    }
  };

  const isAuthor = currentUser?.id === post.authorId;
  
  return (
    <Card className="mb-6 overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author?.avatar} />
              <AvatarFallback className="bg-purple-100 text-purple-800">
                {post.author?.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Link to={`/profile/${post.author?.id}`} className="font-medium hover:underline">
                  {post.author?.name}
                </Link>
                <Badge variant="outline" className="text-xs px-2 py-0">
                  {post.author?.role}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground flex gap-2">
                <span>{post.author?.department}</span>
                <span>•</span>
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Post</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete} 
                  className="flex items-center gap-2 text-red-500 focus:text-red-500"
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <div className="whitespace-pre-wrap mb-3">{post.content}</div>
        
        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                to={`/tag/${tag.replace("#", "")}`}
                className="text-purple-500 hover:text-purple-700 text-sm"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.images.map((image, index) => (
              <img 
                key={index} 
                src={image} 
                alt={`Post image ${index + 1}`} 
                className="rounded-md w-full object-cover max-h-96"
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-0 border-t">
        <div className="w-full">
          {/* Post actions */}
          <div className="flex border-b">
            <Button 
              variant="ghost" 
              className={`flex-1 gap-2 rounded-none py-5 ${isLiked ? 'text-red-500' : ''}`} 
              onClick={handleLike}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              className="flex-1 gap-2 rounded-none py-5" 
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length}</span>
            </Button>
            
            <Button variant="ghost" className="flex-1 gap-2 rounded-none py-5">
              <Share className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Comments section */}
          {showComments && (
            <div className="p-4">
              {/* Comment list */}
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author?.avatar} />
                        <AvatarFallback className="bg-purple-100 text-purple-800 text-xs">
                          {comment.author?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="bg-secondary p-3 rounded-lg">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <Link to={`/profile/${comment.author?.id}`} className="font-medium text-sm hover:underline">
                                {comment.author?.name}
                              </Link>
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {comment.author?.role}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Add comment */}
              <div className="flex gap-3 items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback className="bg-purple-100 text-purple-800">
                    {currentUser?.name.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 flex gap-2">
                  <Input 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleComment();
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleComment} disabled={!newComment.trim() || !currentUser}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default Post;
