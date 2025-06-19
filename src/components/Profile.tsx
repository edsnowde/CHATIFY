import { useState } from "react"; // Keep useState if needed for local component state later
import { User, Post as PostType } from "@/utils/types";
import Post from "./Post";
import { Edit, MapPin, CalendarDays, Briefcase, Mail, BookUser, Award, Bookmark, Users, GraduationCap } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { format } from "date-fns";

interface ProfileProps {
  user: User;
  currentUser?: User;
  userPosts: PostType[];
  onPostUpdate?: (updatedPost: PostType) => void;
  onPostDelete?: (postId: string) => void;
}

const Profile = ({ user, currentUser, userPosts, onPostUpdate, onPostDelete }: ProfileProps) => {
  const isOwnProfile = currentUser?.id === user.id;
  
  const userRoleDisplay = user.role === "faculty" ? "Faculty" : "Student";

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="mb-6 overflow-hidden shadow-xl border-border rounded-xl bg-card"> {/* Ensure card bg */}
        <div 
          className="h-48 sm:h-64 bg-gradient-to-br from-primary via-accent/70 to-primary/80" // DSU gradient with accent
        />
        
        <div className="px-4 sm:px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-20 mb-6">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-4 border-background shadow-lg bg-card">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-4xl bg-muted text-primary font-semibold"> {/* Adjusted fallback bg */}
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pt-4 sm:pt-0 sm:pb-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
                    {user.name}
                    <Badge 
                      className={`text-xs sm:text-sm px-2.5 py-1 rounded-full capitalize font-medium ${
                        user.role === "faculty" 
                          ? "bg-dsu-maroon text-dsu-soft-white" 
                          : "bg-dsu-navy text-dsu-soft-white"
                      }`}
                    >
                       {user.role === "faculty" ? <Briefcase className="h-3.5 w-3.5 mr-1 inline-block" /> : <GraduationCap className="h-3.5 w-3.5 mr-1 inline-block" />} 
                       {userRoleDisplay}
                    </Badge>
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {user.department}, {user.year}
                  </p>
                </div>
                
                {isOwnProfile && (
                  <Button variant="outline" className="gap-2 mt-2 sm:mt-0 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary shadow-sm">
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {user.bio && (
            <Card className="mb-6 bg-muted/50 border-border/70 rounded-lg"> {/* Softer bio card */}
              <CardContent className="p-4">
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">{user.bio}</p>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            {/* Using DSU colors for icons where appropriate */}
            <InfoItem icon={<MapPin className="h-4 w-4 text-primary" />} label="Location" value={user.department || "Campus Wide"} /> {/* Default location */}
            <InfoItem icon={<Mail className="h-4 w-4 text-primary" />} label="Email" value={user.email} />
            <InfoItem icon={<Briefcase className="h-4 w-4 text-accent" />} label="Department" value={user.department} /> {/* Accent for department */}
            <InfoItem icon={<CalendarDays className="h-4 w-4 text-primary" />} label="Joined Chatify" value={format(new Date(user.createdAt), "MMMM yyyy")} />
            <InfoItem icon={<BookUser className="h-4 w-4 text-accent" />} label="Year / Title" value={`${user.year}`} /> {/* Accent for year/title */}
            <InfoItem icon={<Award className="h-4 w-4 text-primary" />} label="Role" value={userRoleDisplay} />
          </div>
        </div>
      </Card>
      
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3 sm:grid-cols-3 md:w-auto md:inline-flex bg-muted/60 p-1 rounded-lg"> {/* Updated to 3 cols */}
          <TabsTrigger value="posts" className="data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md flex items-center gap-1.5">
            <BookUser className="h-4 w-4" /> Posts
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md flex items-center gap-1.5">
            <Users className="h-4 w-4" /> About
          </TabsTrigger>
          <TabsTrigger value="bookmarked" className="data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-md rounded-md flex items-center gap-1.5">
            <Bookmark className="h-4 w-4" /> Bookmarked
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {userPosts.length === 0 ? (
            <Card className="shadow-md border-border rounded-xl bg-card">
              <CardContent className="pt-6">
                <div className="text-center py-16">
                  <BookUser className="h-16 w-16 text-muted-foreground/70 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-foreground">No Posts Yet</p>
                  {isOwnProfile && (
                    <p className="mt-2 text-muted-foreground">Share your thoughts, projects, or insights on Chatify!</p>
                  )}
                   {!isOwnProfile && (
                    <p className="mt-2 text-muted-foreground">{user.name} hasn't posted anything yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {userPosts.map(post => (
                <Post 
                  key={post.id} 
                  post={post} 
                  currentUser={currentUser}
                  onPostUpdate={onPostUpdate}
                  onPostDelete={onPostDelete}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="about">
          <Card className="shadow-md border-border rounded-xl bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground">About {user.name}</CardTitle>
              <CardDescription className="text-muted-foreground">Learn more about {user.name.split(' ')[0]}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-sm">
              <div>
                <h3 className="font-medium text-foreground mb-1">Bio</h3>
                <p className="text-foreground/90 leading-relaxed">{user.bio || "No bio provided."}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <AboutInfoItem label="Full Name" value={user.name} />
                <AboutInfoItem label="Email Address" value={user.email} />
                <AboutInfoItem label="Department" value={user.department} />
                <AboutInfoItem label="Academic Year / Title" value={user.year} /> {/* Updated label */}
                <AboutInfoItem label="Role" value={userRoleDisplay} /> {/* Updated value */}
                <AboutInfoItem label="Joined Chatify" value={format(new Date(user.createdAt), "MMMM dd, yyyy")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookmarked">
           <Card className="shadow-md border-border rounded-xl bg-card">
              <CardContent className="pt-6">
                <div className="text-center py-16">
                  <Bookmark className="h-16 w-16 text-muted-foreground/70 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-foreground">No Bookmarked Posts</p>
                  {isOwnProfile && (
                    <p className="mt-2 text-muted-foreground">You haven't bookmarked any posts yet. Saved items will appear here.</p>
                  )}
                   {!isOwnProfile && (
                    <p className="mt-2 text-muted-foreground">{user.name} hasn't bookmarked any posts.</p>
                  )}
                </div>
              </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper component for info items in the header
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg shadow-sm hover:bg-muted/60 transition-colors"> {/* Enhanced item styling */}
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="font-semibold text-foreground/90 text-[0.9rem]">{value}</p> {/* Adjusted text size */}
    </div>
  </div>
);

// Helper component for About section items
const AboutInfoItem = ({ label, value }: { label: string, value: string }) => (
  <div className="py-2 border-b border-border/30 last:border-b-0"> {/* Subtle separation */}
    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">{label}</p>
    <p className="text-foreground/90">{value}</p>
  </div>
);

export default Profile;
