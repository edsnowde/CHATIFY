
import { useState, ChangeEvent } from "react";
import { User, Post } from "@/utils/types";
import { Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CreatePostProps {
  currentUser?: User;
  onPostCreated: (post: Post) => void;
}

const CreatePost = ({ currentUser, onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Extract hashtags from content
  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    return text.match(hashtagRegex) || [];
  };

  // Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newImages: string[] = [];
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 4) {
      toast({
        title: "Too many images",
        description: "You can upload a maximum of 4 images per post.",
        variant: "destructive",
      });
      return;
    }
    
    files.forEach(file => {
      // In a real app, you'd upload to a server and get URLs back
      // For this demo, we'll use local URLs
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result.toString());
          if (newImages.length === files.length) {
            setImages([...images, ...newImages]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (!content.trim() && images.length === 0) return;
    
    setIsSubmitting(true);
    
    // Create new post
    const newPost: Post = {
      id: Date.now().toString(),
      content: content.trim(),
      images: images.length > 0 ? [...images] : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: currentUser?.id || "",
      author: currentUser,
      likes: [],
      comments: [],
      tags: extractHashtags(content),
    };
    
    // In a real app, you'd send this to your API
    setTimeout(() => {
      onPostCreated(newPost);
      setContent("");
      setImages([]);
      setIsSubmitting(false);
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      });
    }, 500);
  };
  
  if (!currentUser) return null;
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback className="bg-purple-100 text-purple-800">
              {currentUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder={`Share something with your ${currentUser.role === "senior" ? "juniors" : "seniors"}, ${currentUser.name}...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24 resize-none border-none focus-visible:ring-0 p-0 shadow-none text-base"
            />
            
            {/* Image preview */}
            {images.length > 0 && (
              <div className={`grid gap-2 mt-3 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Upload ${index + 1}`} 
                      className="rounded-md w-full object-cover h-48"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex justify-between">
        <div>
          <label htmlFor="image-upload">
            <Button variant="ghost" size="sm" type="button" className="gap-2" asChild>
              <div className="cursor-pointer">
                <Image className="h-5 w-5" />
                <span>Image</span>
              </div>
            </Button>
          </label>
          <input 
            id="image-upload" 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageUpload} 
            className="hidden"
          />
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={(!content.trim() && images.length === 0) || isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePost;
