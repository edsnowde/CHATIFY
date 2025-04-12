
import { useState, useEffect } from "react";
import { User } from "@/utils/types";
import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";
import { useToast } from "@/hooks/use-toast";

interface IndexProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Index = ({ toggleDarkMode, isDarkMode }: IndexProps) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is logged in
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
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
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        toast({
          title: "Authentication error",
          description: "There was an error checking your login status.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserAuth();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 bg-muted rounded w-64 mb-6"></div>
              <div className="h-32 bg-muted rounded-lg w-full max-w-md mb-8"></div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6 text-center">
                {currentUser 
                  ? `Welcome ${currentUser.role === "senior" ? "Senior" : "Junior"} ${currentUser.name}!` 
                  : "Connect with Seniors and Juniors"}
              </h1>
              
              {!currentUser && (
                <div className="bg-purple-50 dark:bg-purple-900/20 text-center p-6 rounded-lg mb-8">
                  <p className="text-lg mb-4">
                    Join the community to connect with seniors and juniors at your college!
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Share experiences, ask questions, and help each other succeed in college.
                  </p>
                </div>
              )}
            </>
          )}
          
          <Feed currentUser={currentUser} />
        </div>
      </main>
    </div>
  );
};

export default Index;
