import { useState, useEffect } from "react";
import { User } from "@/utils/types";
import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PenSquare, HelpCircle } from "lucide-react"; // Academic icon & help icon
import MentalHealthSupportTrigger from "@/components/mental-health/MentalHealthSupportTrigger";
import MentalHealthSupportModal from "@/components/mental-health/MentalHealthSupportModal";

interface IndexProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Index = ({ toggleDarkMode, isDarkMode }: IndexProps) => {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // State for mental health support feature
  const [showMentalHealthPrompt, setShowMentalHealthPrompt] = useState(false);
  const [isMentalHealthModalOpen, setIsMentalHealthModalOpen] = useState(false);

  // Simulate condition to show prompt (e.g., after some time or a specific action)
  useEffect(() => {
    const timer = setTimeout(() => {
      // In a real app, this would be triggered by some event or analysis
      // For demo, we just show it after 5 seconds if user is logged in.
      if (currentUser) {
         // setShowMentalHealthPrompt(true); // Let's use a button to trigger it for demo
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentUser]);

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

  const handleOpenMentalHealthModal = () => {
    setIsMentalHealthModalOpen(true);
    setShowMentalHealthPrompt(false); // Hide trigger once modal is shown
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl mx-auto"> {/* Adjusted max-width for a more focused feed */}
          {/* Demo button to toggle the mental health prompt visibility */}
          {!isLoading && currentUser && (
            <div className="my-4 p-3 bg-card border rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">For demonstration purposes:</p>
              <Button 
                variant="ghost" 
                onClick={() => setShowMentalHealthPrompt(prev => !prev)}
                className="text-primary hover:bg-primary/10"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                {showMentalHealthPrompt ? "Hide" : "Show"} Mental Health Support Trigger
              </Button>
            </div>
          )}
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center mt-8">
              <div className="h-10 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/2 mb-8"></div>
              <div className="h-40 bg-muted rounded-lg w-full max-w-xl mb-8"></div>
              <div className="h-64 bg-muted rounded-lg w-full max-w-xl mb-8"></div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8 mt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Welcome to Chatify
                </h1>
                <p className="text-lg text-muted-foreground">
                  {currentUser 
                    ? `Share your insights, ${currentUser.name}!`
                    : "Connect, Share, and Learn with your University Community."}
                </p>
              </div>
              
              {!currentUser && (
                <div className="bg-card border border-border shadow-sm text-center p-6 md:p-8 rounded-xl mb-8">
                  <PenSquare className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Join the Conversation on Chatify!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Share experiences, ask questions, and collaborate with students and faculty.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link to="/auth?mode=signup">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/auth?mode=login">Login</Link>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          
          <Feed currentUser={currentUser} />
        </div>
      </main>

      {showMentalHealthPrompt && <MentalHealthSupportTrigger onOpenModal={handleOpenMentalHealthModal} />}
      <MentalHealthSupportModal isOpen={isMentalHealthModalOpen} onOpenChange={setIsMentalHealthModalOpen} />
    </div>
  );
};

export default Index;
