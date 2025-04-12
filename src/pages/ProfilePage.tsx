
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Post as PostType } from "@/utils/types";
import Navbar from "@/components/Navbar";
import Profile from "@/components/Profile";
import { useToast } from "@/hooks/use-toast";

interface ProfilePageProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const ProfilePage = ({ toggleDarkMode, isDarkMode }: ProfilePageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [profileUser, setProfileUser] = useState<User | undefined>(undefined);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Fetch all posts from localStorage
  const fetchPosts = () => {
    try {
      const storedPosts = localStorage.getItem("posts");
      if (storedPosts) {
        const parsedPosts = JSON.parse(storedPosts, (key, value) => {
          // Convert string dates back to Date objects
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
        return parsedPosts as PostType[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        title: "Error fetching posts",
        description: "Could not load posts. Please try again later.",
        variant: "destructive"
      });
      return [];
    }
  };

  // Fetch all users from localStorage
  const fetchUsers = () => {
    try {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers, (key, value) => {
          // Convert string dates back to Date objects
          if (key === 'createdAt') {
            return new Date(value);
          }
          return value;
        });
        return parsedUsers as User[];
      }
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  
  // Check if user is logged in
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser, (key, value) => {
            // Convert string dates back to Date objects
            if (key === 'createdAt') {
              return new Date(value);
            }
            return value;
          });
          setCurrentUser(parsedUser);
          
          // If no ID provided, show current user's profile
          if (!id) {
            setProfileUser(parsedUser);
            const allPosts = fetchPosts();
            setUserPosts(allPosts.filter(post => post.authorId === parsedUser.id));
          }
        } else if (!id) {
          // Not logged in and no ID provided, redirect to login
          navigate("/auth?mode=login");
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading this profile.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate, toast]);
  
  // If ID provided, fetch that user
  useEffect(() => {
    if (id) {
      const loadUserData = async () => {
        setIsLoading(true);
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Fetch users from localStorage
          const users = fetchUsers();
          const user = users.find(user => user.id === id);
          
          if (user) {
            setProfileUser(user);
            
            // Fetch all posts and filter for this user
            const allPosts = fetchPosts();
            const filteredPosts = allPosts.filter(post => post.authorId === id);
            
            // Attach author information to each post
            const postsWithAuthors = filteredPosts.map(post => {
              // Find author for this post
              const author = users.find(u => u.id === post.authorId);
              return {
                ...post,
                author: author
              };
            });
            
            setUserPosts(postsWithAuthors);
          } else {
            // User not found
            toast({
              title: "User not found",
              description: "The requested profile could not be found.",
              variant: "destructive"
            });
            navigate("/not-found");
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: "There was a problem loading this profile.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      loadUserData();
    }
  }, [id, navigate, toast]);

  // Function to handle post updates
  const handlePostUpdate = (updatedPost: PostType) => {
    try {
      // Update posts in state
      const updatedPosts = userPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
      setUserPosts(updatedPosts);
      
      // Update posts in localStorage
      const allPosts = fetchPosts();
      const updatedAllPosts = allPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
      localStorage.setItem("posts", JSON.stringify(updatedAllPosts));
      
      toast({
        title: "Post updated",
        description: "Your post has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error updating post",
        description: "There was a problem updating your post.",
        variant: "destructive"
      });
    }
  };
  
  // Function to handle post deletion
  const handlePostDelete = (postId: string) => {
    try {
      // Remove post from state
      const remainingPosts = userPosts.filter(post => post.id !== postId);
      setUserPosts(remainingPosts);
      
      // Remove post from localStorage
      const allPosts = fetchPosts();
      const updatedAllPosts = allPosts.filter(post => post.id !== postId);
      localStorage.setItem("posts", JSON.stringify(updatedAllPosts));
      
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error deleting post",
        description: "There was a problem deleting your post.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-8">
              <div className="h-48 bg-muted rounded-lg w-full"></div>
              <div className="h-24 -mt-12 ml-6 rounded-full w-24 bg-muted"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-64 bg-muted rounded-lg w-full"></div>
            </div>
          ) : profileUser ? (
            <Profile 
              user={profileUser}
              currentUser={currentUser}
              userPosts={userPosts}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ) : (
            <div className="text-center py-12">
              <p>Profile not found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
