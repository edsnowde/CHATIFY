
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle } from 'lucide-react'; // Using Bot as per prompt
import GeminiMiniChat from './GeminiMiniChat'; // We'll create this next

const FloatingAskGeminiButton = () => {
  const [isMiniChatOpen, setIsMiniChatOpen] = useState(false);

  // For now, context is hardcoded. This would be dynamic later.
  const [currentContext, setCurrentContext] = useState("General Help"); 

  // Example: Detect context based on URL (very basic)
  React.useEffect(() => {
    if (window.location.pathname.includes('/profile')) {
      setCurrentContext("Profile Help");
    } else if (window.location.pathname.endsWith('/new-post')) { // Assuming a route for new post creation
      setCurrentContext("Post Creation Help");
    } else {
      setCurrentContext("General Help");
    }
  }, [window.location.pathname]);


  const toggleMiniChat = () => {
    setIsMiniChatOpen(!isMiniChatOpen);
  };

  return (
    <>
      <Button
        onClick={toggleMiniChat}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-in fade-in-0 zoom-in-90 slide-in-from-bottom-10"
        aria-label="Ask Gemini"
      >
        <Bot className="h-7 w-7 text-primary-foreground" />
      </Button>
      <GeminiMiniChat
        isOpen={isMiniChatOpen}
        onClose={() => setIsMiniChatOpen(false)}
        context={currentContext}
      />
    </>
  );
};

export default FloatingAskGeminiButton;
