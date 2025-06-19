
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  LogOut, 
  Menu, 
  Moon, 
  Search, 
  Sun, 
  User as UserIcon, // Renamed to avoid conflict with user state
  X,
  GraduationCap // Academic icon
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User } from "@/utils/types"; // Import User type

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ toggleDarkMode, isDarkMode }: NavbarProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Use User type
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Basic validation for parsedUser
          if (parsedUser && parsedUser.id && parsedUser.name) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            // Invalid user data, clear it
            localStorage.removeItem("user");
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
          localStorage.removeItem("user"); // Clear corrupted data
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    
    checkAuth();
    // Listen for custom auth change events if you implement them elsewhere
    // window.addEventListener('authChange', checkAuth);
    // return () => window.removeEventListener('authChange', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    // Optionally, dispatch a custom event if other components need to react to logout
    // window.dispatchEvent(new CustomEvent('authChange'));
    navigate("/auth?mode=login"); // Redirect to login after logout
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold text-primary">Chatify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search Chatify..."
                className="pl-10 pr-4 py-2 text-sm rounded-full bg-muted border border-transparent focus:bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-48 lg:w-64 transition-all"
              />
            </div>
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated && user ? (
              <>
                <Button asChild variant="ghost" size="icon" aria-label="Notifications">
                  <Link to="/notifications"> {/* Assuming a /notifications route */}
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 h-auto">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-1 ring-primary/20">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <span className="font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span className="font-medium text-sm hidden lg:block">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {/* Add more items like Settings here if needed */}
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/5 hover:text-primary">
                  <Link to="/auth?mode=login">Login</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-b border-border shadow-md animate-in slide-in-from-top-2 duration-300">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="relative mx-2 my-3">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search Chatify..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-md bg-muted border border-transparent focus:bg-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            
            {isAuthenticated && user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  to="/notifications" 
                  className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notifications
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth?mode=login" 
                  className="block px-3 py-2 text-base font-medium hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/auth?mode=signup" 
                  className="block px-3 py-2 text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <button 
              onClick={() => {
                toggleDarkMode();
                setIsMenuOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-base font-medium hover:bg-muted rounded-md"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
