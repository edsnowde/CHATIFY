import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Post as PostType } from "@/utils/types";
import Navbar from "@/components/Navbar";
import Profile from "@/components/Profile";
import { useToast } from "@/hooks/use-toast";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          // Role migration for authors within posts
          if (key === 'author' && value && typeof value === 'object' && value !== null) {
            const authorObj = value as any;
            if (authorObj.createdAt && typeof authorObj.createdAt === 'string') authorObj.createdAt = new Date(authorObj.createdAt);
            if (authorObj.role === 'senior') authorObj.role = 'faculty';
            else if (authorObj.role === 'junior') authorObj.role = 'student';
          }
          // Role migration for authors within comments
          if (key === 'comments' && Array.isArray(value)) {
            value.forEach(comment => {
              const commentObj = comment as any;
              if (commentObj.createdAt && typeof commentObj.createdAt === 'string') commentObj.createdAt = new Date(commentObj.createdAt);
              if (commentObj.author && typeof commentObj.author === 'object' && commentObj.author !== null) {
                const commentAuthorObj = commentObj.author as any;
                if (commentAuthorObj.createdAt && typeof commentAuthorObj.createdAt === 'string') commentAuthorObj.createdAt = new Date(commentAuthorObj.createdAt);
                if (commentAuthorObj.role === 'senior') commentAuthorObj.role = 'faculty';
                else if (commentAuthorObj.role === 'junior') commentAuthorObj.role = 'student';
              }
            });
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
  const fetchUsers = (): User[] => {
    try {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers, (key, value) => {
          if (key === 'createdAt') {
            return new Date(value);
          }
          if (key === 'role' && (value === 'senior' || value === 'junior')) {
            return value === 'senior' ? 'faculty' : 'student';
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
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const storedUserString = localStorage.getItem("user");
        if (storedUserString) {
          let parsedUser = JSON.parse(storedUserString, (key, value) => {
            if (key === 'createdAt') {
              return new Date(value);
            }
            // Migration for old roles if present in "user" item
            if (key === 'role' && (value === 'senior' || value === 'junior')) {
                return value === 'senior' ? 'faculty' : 'student';
            }
            return value;
          }) as User;

          // If role migration happened for the current user, update the "user" item in localStorage
          // This check ensures that if the original stored role was old, it gets updated
          const originalUserForRoleCheck = JSON.parse(storedUserString) as any;
          if (originalUserForRoleCheck.role === 'senior' || originalUserForRoleCheck.role === 'junior') {
             // Re-save the parsedUser (which now has correct student/faculty role) to localStorage
             localStorage.setItem("user", JSON.stringify(parsedUser));
          }

          setCurrentUser(parsedUser);
          
          if (!id) {
            setProfileUser(parsedUser);
            const allPostsData = fetchPosts(); // fetchPosts now has refined migration
            setUserPosts(allPostsData.filter(post => post.authorId === parsedUser.id).map(post => {
                // Ensure author within these posts also has correctly typed role and dates
                let authorForPost = post.author;
                if(authorForPost){
                    if(typeof authorForPost.createdAt === 'string') authorForPost.createdAt = new Date(authorForPost.createdAt);
                    const authorRoleAny = authorForPost.role as any;
                    if(authorRoleAny === 'senior') authorForPost.role = 'faculty';
                    else if(authorRoleAny === 'junior') authorForPost.role = 'student';
                }
                return {...post, author: authorForPost};
            }));
          }
        } else if (!id) {
          navigate("/auth?mode=login");
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast({
          title: "Error loading profile data",
          description: "There was a problem initializing profile information.",
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
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const users = fetchUsers(); // fetchUsers handles its own role migration
          const user = users.find(u => u.id === id);
          
          if (user) {
            // Ensure the specific profile user's role is correct if somehow missed (should be redundant)
            const userRoleAny = user.role as any;
            if (userRoleAny === 'senior') user.role = 'faculty';
            else if (userRoleAny === 'junior') user.role = 'student';

            setProfileUser(user);
            
            const allPostsData = fetchPosts(); // fetchPosts now has refined migration
            const filteredPosts = allPostsData.filter(post => post.authorId === id);
            
            const postsWithAuthors = filteredPosts.map(post => {
              // Find author from the already migrated 'users' list
              const author = users.find(u => u.id === post.authorId); 
              // The author object from `users` should already have the correct role.
              // The check below is a safeguard but ideally not needed if fetchUsers and fetchPosts are robust.
              if (author) {
                  const authorRoleAny = author.role as any;
                  if (authorRoleAny === 'senior' || authorRoleAny === 'junior') {
                      author.role = authorRoleAny === 'senior' ? 'faculty' : 'student';
                  }
                  if (typeof author.createdAt === 'string') { // Ensure date type
                      author.createdAt = new Date(author.createdAt);
                  }
              }
              return {
                ...post,
                author: author // This author comes from `users` which should be correctly typed by fetchUsers
              };
            });
            
            setUserPosts(postsWithAuthors);
          } else {
            toast({
              title: "User not found",
              description: "The requested Chatify profile could not be found.",
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
      const updatedUserPosts = userPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
      setUserPosts(updatedUserPosts);
      
      const allPosts = fetchPosts(); // Refetch to ensure we're working with the latest full list
      const updatedAllPostsStorage = allPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
      localStorage.setItem("posts", JSON.stringify(updatedAllPostsStorage));
      
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
      const remainingUserPosts = userPosts.filter(post => post.id !== postId);
      setUserPosts(remainingUserPosts);
      
      const allPosts = fetchPosts(); // Refetch
      const updatedAllPostsStorage = allPosts.filter(post => post.id !== postId);
      localStorage.setItem("posts", JSON.stringify(updatedAllPostsStorage));
      
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
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse space-y-8 mt-8">
              <div className="h-48 sm:h-64 bg-muted rounded-xl w-full"></div>
              <div className="flex items-end gap-4 -mt-16 sm:-mt-20 px-4 sm:px-6">
                <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-muted border-4 border-background"></div>
                <div className="flex-1 space-y-3 pb-4">
                  <div className="h-7 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </div>
              </div>
              <div className="px-4 sm:px-6 space-y-4 mt-4">
                <div className="h-16 bg-muted rounded-lg w-full"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="h-12 bg-muted rounded-md"></div>
                  <div className="h-12 bg-muted rounded-md"></div>
                  <div className="h-12 bg-muted rounded-md"></div>
                </div>
              </div>
              <div className="h-10 bg-muted rounded-lg w-1/3 mt-6 mx-4 sm:mx-6"></div>
              <div className="h-64 bg-muted rounded-lg w-full mt-2 mx-4 sm:mx-6"></div>
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
            <div className="text-center py-20">
              <Users className="h-20 w-20 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Profile Not Found</h2>
              <p className="text-muted-foreground">The Chatify profile you're looking for doesn't exist or could not be loaded.</p>
              <Button onClick={() => navigate('/')} className="mt-6">Go to Home</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
