
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  LogOut, 
  Menu, 
  Moon, 
  Search, 
  Sun, 
  User, 
  X 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Mock authentication - replace with real authentication later
const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "senior" as const,
  avatar: "",
  department: "Computer Science",
  year: "4th",
  createdAt: new Date(),
};

interface NavbarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ toggleDarkMode, isDarkMode }: NavbarProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(mockUser);

  // Mock login for demonstration
  useEffect(() => {
    // This simulates checking if a user is logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              {/* 🖼️ Logo image */}
              <img 
                src="/logo.png"  // Update this path based on where your image is located (e.g., /public/logo.png)
                alt="Chatify Logo" 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold text-purple-500">CHATIFY</span>
            </Link>
          </div>
  

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-full bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
              />
            </div>
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <>
                <Button asChild variant="ghost" size="icon">
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full" />
                        ) : (
                          <span className="text-purple-800 font-medium">{user.name.charAt(0)}</span>
                        )}
                      </div>
                      <span className="font-medium hidden lg:block">{user.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-500">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link to="/auth?mode=login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth?mode=signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b animate-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="flex items-center mx-4 my-3">
              <Search className="text-muted-foreground h-4 w-4 mr-2" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 p-2 rounded-md bg-secondary text-sm focus:outline-none"
              />
            </div>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-base font-medium hover:bg-secondary rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/notifications" 
                  className="block px-4 py-2 text-base font-medium hover:bg-secondary rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notifications
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-red-500 hover:bg-secondary rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth?mode=login" 
                  className="block px-4 py-2 text-base font-medium hover:bg-secondary rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/auth?mode=signup" 
                  className="block px-4 py-2 text-base font-medium hover:bg-secondary rounded-md"
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
              className="flex items-center w-full px-4 py-2 text-base font-medium hover:bg-secondary rounded-md"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-5 w-5 mr-2" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5 mr-2" />
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
