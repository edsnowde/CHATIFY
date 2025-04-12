
import { useState, useEffect } from "react";
import { User, Post as PostType } from "@/utils/types";
import CreatePost from "./CreatePost";
import Post from "./Post";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data - in a real app, this would come from an API
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    department: "Computer Science",
    year: "4th",
    role: "senior",
    bio: "Senior CS student passionate about web development and mentoring.",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    department: "Computer Science",
    year: "2nd",
    role: "junior",
    bio: "Sophomore interested in machine learning and algorithms.",
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    avatar: "https://i.pravatar.cc/150?img=8",
    department: "Engineering",
    year: "4th",
    role: "senior",
    bio: "Final year engineering student with internship experience at top companies.",
    createdAt: new Date("2023-03-10"),
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    avatar: "https://i.pravatar.cc/150?img=9",
    department: "Business",
    year: "1st",
    role: "junior",
    bio: "Freshman business student looking for guidance on course selection.",
    createdAt: new Date("2023-04-05"),
  },
];

const samplePosts: PostType[] = [
  {
    id: "1",
    content: "Just finished my internship at Google! Feel free to reach out if you need any tips for applying to tech companies. #Internship #TechJobs",
    images: ["https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80"],
    createdAt: new Date("2023-08-10T14:30:00"),
    updatedAt: new Date("2023-08-10T14:30:00"),
    authorId: "1",
    author: sampleUsers[0],
    likes: ["2", "4"],
    comments: [
      {
        id: "1",
        content: "That's amazing! I'd love to hear more about your experience.",
        createdAt: new Date("2023-08-10T15:45:00"),
        authorId: "2",
        author: sampleUsers[1],
        postId: "1",
        likes: [],
      },
      {
        id: "2",
        content: "Congrats! Did you work remotely or on-site?",
        createdAt: new Date("2023-08-10T16:20:00"),
        authorId: "4",
        author: sampleUsers[3],
        postId: "1",
        likes: [],
      },
    ],
    tags: ["#Internship", "#TechJobs"],
  },
  {
    id: "2",
    content: "Can any seniors recommend good electives for second-year Computer Science students? Looking for something challenging but interesting. #StudyTips #CourseSelection",
    createdAt: new Date("2023-08-09T10:15:00"),
    updatedAt: new Date("2023-08-09T10:15:00"),
    authorId: "2",
    author: sampleUsers[1],
    likes: ["1", "3"],
    comments: [
      {
        id: "3",
        content: "I'd recommend Advanced Algorithms if you're interested in theoretical CS, or Web Development if you prefer practical skills.",
        createdAt: new Date("2023-08-09T11:05:00"),
        authorId: "1",
        author: sampleUsers[0],
        postId: "2",
        likes: ["2"],
      },
    ],
    tags: ["#StudyTips", "#CourseSelection"],
  },
  {
    id: "3",
    content: "Hosting a resume workshop next Friday at the Engineering building. Open to all students! #CareerAdvice #ResumeHelp",
    images: [
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    createdAt: new Date("2023-08-08T16:45:00"),
    updatedAt: new Date("2023-08-08T16:45:00"),
    authorId: "3",
    author: sampleUsers[2],
    likes: ["2", "4", "1"],
    comments: [],
    tags: ["#CareerAdvice", "#ResumeHelp"],
  },
  {
    id: "4",
    content: "First day of classes and I'm already lost. Any advice for navigating the campus? #FirstYear #CampusLife",
    createdAt: new Date("2023-08-07T09:30:00"),
    updatedAt: new Date("2023-08-07T09:30:00"),
    authorId: "4",
    author: sampleUsers[3],
    likes: [],
    comments: [
      {
        id: "4",
        content: "Download the campus map app, it's a lifesaver! Also, don't hesitate to ask upperclassmen for directions, we're happy to help.",
        createdAt: new Date("2023-08-07T10:15:00"),
        authorId: "3",
        author: sampleUsers[2],
        postId: "4",
        likes: ["4"],
      },
      {
        id: "5",
        content: "I felt the same way last year! It gets easier, I promise. Join some clubs to meet people who can show you around.",
        createdAt: new Date("2023-08-07T11:20:00"),
        authorId: "2",
        author: sampleUsers[1],
        postId: "4",
        likes: [],
      },
    ],
    tags: ["#FirstYear", "#CampusLife"],
  },
];

interface FeedProps {
  currentUser?: User;
}

type FilterType = "all" | "seniors" | "juniors";

const Feed = ({ currentUser }: FeedProps) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Simulate loading posts from API
  useEffect(() => {
    // In a real app, you'd fetch posts from your backend
    const fetchPosts = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if we have stored posts in localStorage
        const storedPosts = localStorage.getItem('posts');
        
        if (storedPosts) {
          // Parse stored posts and convert date strings back to Date objects
          const parsedPosts = JSON.parse(storedPosts, (key, value) => {
            if (key === 'createdAt' || key === 'updatedAt') {
              return new Date(value);
            }
            return value;
          });
          setPosts(parsedPosts);
        } else {
          // Use sample data if no stored posts
          setPosts(samplePosts);
          // Save sample data to localStorage
          savePosts(samplePosts);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        toast({
          title: "Error loading posts",
          description: "Could not load posts. Please try again later.",
          variant: "destructive"
        });
        // Fallback to sample data in case of error
        setPosts(samplePosts);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [toast]);
  
  // Save posts to localStorage
  const savePosts = (postsToSave: PostType[]) => {
    localStorage.setItem('posts', JSON.stringify(postsToSave));
  };
  
  // Handle creating a new post
  const handlePostCreated = (newPost: PostType) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };
  
  // Handle updating a post (likes, comments)
  const handlePostUpdate = (updatedPost: PostType) => {
    const updatedPosts = posts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    );
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };
  
  // Handle deleting a post
  const handlePostDelete = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    savePosts(updatedPosts);
  };
  
  // Filter posts based on selection
  const filteredPosts = posts.filter(post => {
    if (filter === "all") return true;
    if (filter === "seniors") return post.author?.role === "senior";
    if (filter === "juniors") return post.author?.role === "junior";
    return true;
  });
  
  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "latest") {
      return b.createdAt.getTime() - a.createdAt.getTime();
    } else {
      // Sort by likes count
      return b.likes.length - a.likes.length;
    }
  });
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Create post */}
      <CreatePost currentUser={currentUser} onPostCreated={handlePostCreated} />
      
      {/* Filters */}
      <div className="mb-6 flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </Button>
        
        {showFilters && (
          <div className="flex gap-2">
            <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="seniors">Seniors Only</SelectItem>
                <SelectItem value="juniors">Juniors Only</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "latest" | "popular")}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Liked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      {/* Posts */}
      <div className="space-y-6">
        {isLoading ? (
          // Loading state
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-lg mb-2"></div>
                <div className="h-64 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found. Adjust your filters or be the first to post!</p>
          </div>
        ) : (
          sortedPosts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              currentUser={currentUser}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
