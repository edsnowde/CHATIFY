
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming this exists or will be added
import { Send, ExternalLink, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GeminiMiniChatProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const GeminiMiniChat: React.FC<GeminiMiniChatProps> = ({ isOpen, onClose, context }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const newUserMessage: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
    // Simulate AI response
    const aiResponse: Message = { id: (Date.now() + 1).toString(), text: `Thinking about: "${inputValue}" in context of ${context}...`, sender: 'ai' };
    setMessages(prevMessages => [...prevMessages, newUserMessage, aiResponse].slice(-4)); // Keep last few messages
    setInputValue('');
  };

  const openFullChat = () => {
    onClose();
    navigate('/ask-gemini', { state: { context } }); // Pass context to full page
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="sm:max-w-md p-0 fixed bottom-24 right-6 w-[calc(100vw-3rem)] max-w-sm md:w-96 shadow-xl rounded-lg bg-card border-border"
        onPointerDownOutside={(e) => e.preventDefault()} // Prevents closing when clicking outside if needed
      >
        <DialogHeader className="p-4 border-b border-border">
          <DialogTitle className="flex items-center text-base">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            Ask Gemini <span className="text-xs text-muted-foreground ml-2 truncate">(Context: {context})</span>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-64 p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No messages yet. Ask something!</p>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "p-2 rounded-lg max-w-[80%]",
                msg.sender === 'user' ? 'bg-primary/10 text-primary-foreground self-end ml-auto' : 'bg-muted text-muted-foreground self-start mr-auto'
              )}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </ScrollArea>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button onClick={handleSendMessage} size="icon" variant="ghost" className="text-primary">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-border sm:justify-between">
           <DialogClose asChild>
            <Button type="button" variant="ghost" size="sm">
              Close
            </Button>
          </DialogClose>
          <Button onClick={openFullChat} variant="outline" size="sm" className="text-primary border-primary/50 hover:bg-primary/5">
            Open Full Chat
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeminiMiniChat;
