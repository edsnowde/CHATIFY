
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription, // No longer used
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/utils/types"; // Import UserRole

// Schema for login
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// Schema for signup
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["student", "faculty"], { // Updated roles
    required_error: "Please select your role (Student or Faculty)",
  }),
  department: z.string().min(1, { message: "Please select your department" }),
  year: z.string().min(1, { message: "Please select your academic year or title" }), // Adjusted message for faculty
});

// Types
type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

const AuthForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const { toast } = useToast();
  
  // Create forms
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student" as UserRole, // Default to student
      department: "",
      year: "",
    },
  });

  // Submit handlers
  const onLoginSubmit = (values: LoginValues) => {
    console.log("Login values:", values);
    
    // Mock authentication - in a real app, this would call your auth API
    // For demo, let's assume login fetches a pre-existing user or uses a default
    // This part would ideally check against a list of users.
    // For now, let's simulate a student login.
    // If you want to test faculty, you might need to sign up as faculty first.
    const usersString = localStorage.getItem("users");
    let userToLogin = null;
    if (usersString) {
      const users = JSON.parse(usersString);
      userToLogin = users.find((u: any) => u.email === values.email);
    }

    if (userToLogin) {
       localStorage.setItem("user", JSON.stringify(userToLogin));
    } else {
      // If user not found, create a default one for login demonstration
      // This is not secure for a real app.
      const defaultUser = {
        id: "1", // This ID should be unique if multiple users are stored
        name: "Demo User", // A generic name
        email: values.email,
        role: "student" as UserRole, // Default to student
        department: "General Studies",
        year: "1st",
        createdAt: new Date(),
      };
      localStorage.setItem("user", JSON.stringify(defaultUser));
      // Optionally, add this new demo user to the 'users' list as well
      const allUsers = usersString ? JSON.parse(usersString) : [];
      allUsers.push(defaultUser);
      localStorage.setItem("users", JSON.stringify(allUsers));
    }
    
    toast({
      title: "Login successful",
      description: "Welcome back to Chatify!", // Updated
    });
    
    navigate("/");
  };

  const onSignupSubmit = (values: SignupValues) => {
    console.log("Signup values:", values);
    
    const newUser = {
      id: Date.now().toString(), // Simple unique ID
      name: values.name,
      email: values.email,
      role: values.role,
      department: values.department,
      year: values.year,
      createdAt: new Date(),
      // Add other fields like avatar later if needed
    };
    
    // Mock user creation - in a real app, this would call your auth API
    localStorage.setItem("user", JSON.stringify(newUser));

    // Store in a list of users as well for profile page lookups
    const usersString = localStorage.getItem("users");
    const users = usersString ? JSON.parse(usersString) : [];
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    toast({
      title: "Account created",
      description: `Welcome to Chatify, ${values.name}!`, // Updated
    });
    
    navigate("/");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-xl shadow-xl border border-border/50"> {/* Enhanced card styling */}
      <Tabs defaultValue={mode} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/60 p-1 rounded-lg"> {/* Subtle background for tabs list */}
          <TabsTrigger 
            value="login" 
            onClick={() => navigate("/auth?mode=login")}
            className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md"
          >
            Login
          </TabsTrigger>
          <TabsTrigger 
            value="signup" 
            onClick={() => navigate("/auth?mode=signup")}
            className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>
        
        {/* Login Form */}
        <TabsContent value="login">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6"> {/* Increased spacing */}
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">University Email</FormLabel> {/* Adjusted Label */}
                    <FormControl>
                      <Input 
                        placeholder="your.email@university.edu" 
                        {...field}
                        type="email"
                        className="bg-background/70 border-border/70 focus:border-primary" // Enhanced input styling
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your password" 
                        {...field}
                        type="password"
                        className="bg-background/70 border-border/70 focus:border-primary" // Enhanced input styling
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base"> {/* Enhanced button */}
                Login to Chatify
              </Button>
            </form>
          </Form>
        </TabsContent>
        
        {/* Signup Form */}
        <TabsContent value="signup">
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6"> {/* Increased spacing */}
              <FormField
                control={signupForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dr. Jane Doe / Alex Smith" {...field} className="bg-background/70 border-border/70 focus:border-primary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">University Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your.email@university.edu" 
                        {...field}
                        type="email"
                        className="bg-background/70 border-border/70 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Create Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Min. 8 characters" 
                        {...field}
                        type="password"
                        className="bg-background/70 border-border/70 focus:border-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">I am a</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/70 border-border/70 focus:border-primary">
                            <SelectValue placeholder="Select your role..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={signupForm.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground/90">Year / Title</FormLabel> {/* Updated label */}
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/70 border-border/70 focus:border-primary">
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Options can be dynamic based on role if needed in future */}
                          <SelectItem value="1st Year">1st Year</SelectItem>
                          <SelectItem value="2nd Year">2nd Year</SelectItem>
                          <SelectItem value="3rd Year">3rd Year</SelectItem>
                          <SelectItem value="4th Year">4th Year</SelectItem>
                          <SelectItem value="5th+ Year">5th+ Year</SelectItem>
                          <SelectItem value="Graduate Student">Graduate Student</SelectItem>
                          <SelectItem value="Professor">Professor</SelectItem>
                          <SelectItem value="Lecturer">Lecturer</SelectItem>
                          <SelectItem value="Researcher">Researcher</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Other Faculty">Other Faculty</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={signupForm.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground/90">Department / Area</FormLabel> {/* Updated label */}
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background/70 border-border/70 focus:border-primary">
                          <SelectValue placeholder="Select your department or area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Business Administration">Business Administration</SelectItem>
                        <SelectItem value="Economics">Economics</SelectItem>
                        <SelectItem value="Digital Arts & Design">Digital Arts & Design</SelectItem>
                        <SelectItem value="English Literature">English Literature</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Psychology">Psychology</SelectItem>
                        <SelectItem value="University Administration">University Administration</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base"> {/* Enhanced button */}
                Create Chatify Account
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
