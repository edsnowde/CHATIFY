
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";
import { GraduationCap, BookOpenCheck } from "lucide-react"; // Added BookOpenCheck for logo

interface AuthPageProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const AuthPage = ({ toggleDarkMode, isDarkMode }: AuthPageProps) => {
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/20 to-background dark:from-background dark:via-muted/10 dark:to-background"> {/* Subtle gradient */}
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      
      <main className="flex-1 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            {/* University Logo Placeholder */}
            <div className="mb-4 flex justify-center items-center">
              <BookOpenCheck className="h-12 w-12 text-primary opacity-70" /> 
              {/* Replace with actual <img /> tag when logo is available */}
              {/* <img src="/path-to-your-uni-logo.png" alt="University Logo" className="h-16 w-auto" /> */}
            </div>
            <GraduationCap className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight"> {/* Adjusted size and tracking */}
              Welcome to Chatify
            </h1>
            <p className="text-muted-foreground text-lg"> {/* Adjusted size */}
              Your University's Hub for Connection & Collaboration.
            </p>
          </div>
          
          <AuthForm />
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
