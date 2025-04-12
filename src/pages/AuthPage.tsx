
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AuthForm from "@/components/AuthForm";

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
    <div className="min-h-screen flex flex-col">
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      
      <main className="flex-1 p-4 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Join the College Community
          </h1>
          
          <AuthForm />
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
