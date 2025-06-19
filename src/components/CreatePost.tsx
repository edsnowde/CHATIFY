import { useState, ChangeEvent } from "react";
import { User } from "@/utils/types";
import { Image as ImageIcon, X, Send, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export interface Post {
  id: string;
  content: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: User;
  likes: string[];
  comments: string[];
  tags: string[];
  // Moderation fields
  isFlagged: boolean | null;
  moderationScore: number | null;
  moderationDetails: any;
  moderationCheckedAt: Date | null;
  moderationError?: boolean;
}

interface CreatePostProps {
  currentUser?: User;
  onPostCreated: (post: Post) => void;
  onPostUpdated?: (postId: string, updates: Partial<Post>) => void; // New prop for updating posts
}

// Generate unique ID function
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const CreatePost = ({ currentUser, onPostCreated, onPostUpdated }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Extract hashtags from content
  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return text.match(hashtagRegex) || [];
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newImages: string[] = [];
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 4) {
      toast({
        title: "Image Limit Exceeded",
        description: "You can upload a maximum of 4 images per post.",
        variant: "destructive",
      });
      return;
    }
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit per image
        toast({
          title: "Image Too Large",
          description: `File "${file.name}" exceeds the 5MB limit.`,
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result.toString());
          if (newImages.length === files.filter(f => f.size <= 5 * 1024 * 1024).length) {
            setImages(prevImages => [...prevImages, ...newImages].slice(0, 4));
          }
        }
      };
      reader.onerror = () => {
        toast({
          title: "Image Read Error",
          description: `Could not read file "${file.name}".`,
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Background deepfake checking function
  const performDeepfakeCheck = async (postId: string, content: string, images: string[]) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/deepfake-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          images,
          userId: currentUser?.id,
          postId,
        }),
      });

      const result = await response.json();
      
      // Update the specific post with moderation results
      if (onPostUpdated) {
        onPostUpdated(postId, {
          isFlagged: result.isUnsafe || false,
          moderationScore: result.score || 0,
          moderationDetails: result.details || null,
          moderationCheckedAt: new Date(),
        });
      }

      // Show notification if content is flagged
      if (result.isUnsafe) {
        toast({
          title: "Content Flagged",
          description: "Your post has been flagged for review and may have limited visibility.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Deepfake check failed:', error);
      
      // Update post to indicate moderation check failed
      if (onPostUpdated) {
        onPostUpdated(postId, {
          isFlagged: false, // Default to safe if check fails
          moderationError: true,
          moderationCheckedAt: new Date(),
        });
      }
    }
  };
  
  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      toast({
        title: "Empty Post",
        description: "Please add some content or an image to your post.",
        variant: "destructive"
      });
      return;
    }
    if (!currentUser) {
       toast({
        title: "Not Authenticated",
        description: "Please log in to create a post.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Generate unique ID for tracking
    const postId = generateUniqueId();
    
    // Create post object with moderation fields
    const newPost: Post = {
      id: postId,
      content: content.trim(),
      images: images.length > 0 ? [...images] : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: currentUser.id,
      author: currentUser,
      likes: [],
      comments: [],
      tags: extractHashtags(content),
      // Moderation fields
      isFlagged: null, // Unknown initially
      moderationScore: null,
      moderationDetails: null,
      moderationCheckedAt: null,
      moderationError: false,
    };
    
    // Save post immediately to display it
    onPostCreated(newPost);
    
    // Clear form
    const postContent = content.trim();
    const postImages = [...images];
    setContent("");
    setImages([]);
    setIsSubmitting(false);
    
    // Show success message
    toast({
      title: "Post Shared!",
      description: "Your thoughts are now live on Chatify. Checking content in background...",
      className: "bg-green-500 text-white",
    });

    // Perform background deepfake check (non-blocking)
    if (postImages.length > 0 || postContent.trim().length > 0) {
      performDeepfakeCheck(postId, postContent, postImages);
    }
  };
  
  if (!currentUser) return null;
  
  return (
    <Card className="mb-6 shadow-lg border-border rounded-xl overflow-hidden">
      <CardHeader className="bg-muted/30 p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold text-foreground">
            Create New Post
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="mt-1">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {currentUser.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder={`What's on your mind, ${currentUser.name}? Share insights, questions, or updates...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none w-full border-border focus-visible:ring-1 focus-visible:ring-primary p-3 text-base rounded-md shadow-sm"
              rows={4}
            />
            
            {/* Image preview */}
            {images.length > 0 && (
              <div className={`grid gap-2 mt-3 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} ${images.length > 2 ? 'md:grid-cols-2' : ''} max-h-60 overflow-y-auto p-1`}>
                {images.map((image, index) => (
                  <div key={index} className="relative group aspect-video">
                    <img 
                      src={image} 
                      alt={`Preview ${index + 1}`} 
                      className="rounded-md w-full h-full object-cover border border-border"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 h-7 w-7 bg-black/60 hover:bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus-visible:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-border p-4 flex justify-between items-center bg-muted/30">
        <div>
          <label htmlFor="image-upload-create" className="cursor-pointer">
            <Button variant="outline" size="sm" type="button" className="gap-2 text-primary border-primary/30 hover:bg-primary/5" asChild>
              <div>
                <ImageIcon className="h-5 w-5" />
                <span>{images.length > 0 ? `Add More (${images.length}/4)` : "Add Image"}</span>
              </div>
            </Button>
          </label>
          <input 
            id="image-upload-create" 
            type="file" 
            accept="image/png, image/jpeg, image/gif" 
            multiple 
            onChange={handleImageUpload} 
            className="hidden"
            disabled={images.length >= 4}
          />
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={(!content.trim() && images.length === 0) || isSubmitting}
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          {isSubmitting ? "Sharing..." : <><Send className="h-4 w-4" /> Share Post</>}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;