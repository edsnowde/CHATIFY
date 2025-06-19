import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import AskGeminiPage from "./pages/AskGeminiPage";
import FloatingAskGeminiButton from "./components/ai/FloatingAskGeminiButton";
import { ScrollArea } from "@/components/ui/scroll-area";

const queryClient = new QueryClient();

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has a preference stored in localStorage
    const savedPreference = localStorage.getItem("darkMode");
    // Check if user has a system preference
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Return saved preference if it exists, otherwise use system preference
    return savedPreference !== null ? savedPreference === "true" : systemPreference;
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Update localStorage and body class when dark mode changes
  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode.toString());
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
            <Route path="/auth" element={<AuthPage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
            <Route path="/profile" element={<ProfilePage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
            <Route path="/profile/:id" element={<ProfilePage toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
            <Route path="/ask-gemini" element={<AskGeminiPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingAskGeminiButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
