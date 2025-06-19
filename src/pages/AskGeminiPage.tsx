import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User, Send, ArrowLeft, Edit3, BookOpen, Briefcase, GraduationCap, MessageCircle, Joystick } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/Navbar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface ContextOption {
  id: string;
  name: string;
  icon: React.ElementType;
  prompt?: string;
}

const contextOptions: ContextOption[] = [
  { id: 'general', name: 'General Help', icon: GraduationCap },
  { id: 'post-creation', name: 'Post Creation', icon: Edit3, prompt: "Need help with grammar or topic ideas?" },
  { id: 'comment-writing', name: 'Comment Writing', icon: MessageCircle, prompt: "Need help crafting a comment?" },
  { id: 'profile-editing', name: 'Profile Editing', icon: User, prompt: "Updating your profile? I can help with your bio!" },
  { id: 'math-help', name: 'Math Help', icon: BookOpen },
  { id: 'writing-feedback', name: 'Writing Feedback', icon: Edit3 },
  { id: 'career-advice', name: 'Career Advice', icon: Briefcase },
  { id: 'whatsapp-chat', name: 'Whatsapp Chat', icon: Joystick, prompt: "WHO DO YOU WANT TO CONNECT WITH?" },
];

const AskGeminiPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeContext, setActiveContext] = useState<ContextOption>(contextOptions[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Handle context set on mount
  useEffect(() => {
    const navState = location.state as { context?: string; contextId?: string };
    let initialContext = contextOptions[0];

    if (navState?.contextId) {
      const ctx = contextOptions.find(c => c.id === navState.contextId);
      if (ctx) initialContext = ctx;
    } else if (navState?.context) {
      const ctx = contextOptions.find(c => c.name.toLowerCase().includes(navState.context.toLowerCase()));
      if (ctx) initialContext = ctx;
    }

    setActiveContext(initialContext);
    if (initialContext.prompt) {
      setMessages([{ id: 'initial', text: initialContext.prompt, sender: 'ai' }]);
    } else {
      setMessages([]);
    }
  }, [location.state]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    const newUserMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: `Responding to "${inputValue}" in context: ${activeContext.name}`,
      sender: 'ai',
    };
    setMessages(prev => [...prev, newUserMsg, aiMsg]);
    setInputValue('');
  };

  const handleContextChange = (option: ContextOption) => {
    setActiveContext(option);
    if (option.prompt) {
      setMessages([{ id: 'prompt', text: option.prompt, sender: 'ai' }]);
    } else {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2 hover:bg-primary/80">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Bot className="h-7 w-7 mr-3" />
          <h1 className="text-xl font-semibold">Ask Gemini - {activeContext.name}</h1>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-1/4 min-w-[200px] max-w-[280px] bg-card border-r border-border p-4 overflow-y-auto hidden md:block">
          <h2 className="text-lg font-semibold mb-3">Choose Context</h2>
          <div className="space-y-2">
            {contextOptions.map(option => (
              <Button
                key={option.id}
                variant={activeContext.id === option.id ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start text-sm',
                  activeContext.id === option.id && 'font-semibold bg-primary/10 text-primary'
                )}
                onClick={() => handleContextChange(option)}
              >
                <option.icon className="h-4 w-4 mr-2" />
                {option.name}
              </Button>
            ))}
          </div>
        </aside>

        {/* Main Chat Section */}
        <main className="flex-1 flex flex-col bg-background/50">
          <ScrollArea className="flex-1 p-4 md:p-6">
            {activeContext.id === 'whatsapp-chat' ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Select a Contact</h2>
                {[
                  { name: 'Emergency', phone: '+919035407870' },
                  { name: 'Ayesha', phone: '+919876543210' },
                  { name: 'Dr. Ramesh', phone: '+918888888888' },
                  { name: 'Mrs. Sharma', phone: '+919999998888' },
                  { name: 'Riyan', phone: '+917777773333' },
                  { name: 'Rekha', phone: '+917766554433' },
                  { name: 'Mr. Mehta', phone: '+919887766554' },
                  { name: 'MedPlus Pharmacy', phone: '+918855441122' },
                  { name: 'Yogesh', phone: '9590363525' },
                  { name: 'Satish', phone: '6361002354' },
                ].map(contact => (
                  <div
                    key={contact.phone}
                    className="flex items-center justify-between border border-border bg-card p-3 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.phone}</p>
                    </div>
                    <Button
                      onClick={() => {
                        const cleaned = contact.phone.replace(/[^\d]/g, '');
                        window.open(`https://wa.me/${cleaned}`, '_blank');
                      }}
                    >
                      Open WhatsApp
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">Select a context or start typing.</p>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-start space-x-3 max-w-[85%]',
                        msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                      )}
                    >
                      {msg.sender === 'ai' && <Bot className="h-7 w-7 text-primary flex-shrink-0 mt-1" />}
                      {msg.sender === 'user' && <User className="h-7 w-7 text-secondary-foreground flex-shrink-0 mt-1" />}
                      <div
                        className={cn(
                          'p-3 rounded-xl shadow-sm',
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-card-foreground'
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </ScrollArea>

          {activeContext.id !== 'whatsapp-chat' && (
            <div className="border-t border-border p-4 bg-card">
              <div className="flex items-center space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask something related to ${activeContext.name}...`}
                  className="flex-1 text-base py-3 px-4 h-auto"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="lg" className="bg-primary hover:bg-primary/90">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Gemini can make mistakes. Consider checking important information.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AskGeminiPage;
