
import { useState } from "react";
import { User, Post as PostType } from "@/utils/types";
import Post from "./Post";
import { Edit, MapPin, Calendar, Briefcase, Mail } from "lucide-react";
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
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile header */}
      <Card className="mb-6 overflow-hidden">
        {/* Cover photo */}
        <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500" />
        
        <div className="px-6 pb-6">
          {/* Avatar and basic info */}
          <div className="flex flex-col sm:flex-row gap-4 -mt-12 mb-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-2xl bg-purple-100 text-purple-800">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pt-2 sm:pt-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {user.name}
                    <Badge className={user.role === "senior" ? "bg-blue-500" : "bg-green-500"}>
                      {user.role}
                    </Badge>
                  </h1>
                  <p className="text-muted-foreground">{user.department}, {user.year} Year</p>
                </div>
                
                {isOwnProfile && (
                  <Button variant="outline" className="gap-2">
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Bio */}
          {user.bio && (
            <p className="mb-4">{user.bio}</p>
          )}
          
          {/* Additional info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Campus Building XYZ</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{user.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Joined {format(user.createdAt, "MMMM yyyy")}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Profile content */}
      <Tabs defaultValue="posts">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          {userPosts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posts yet</p>
                  {isOwnProfile && (
                    <p className="mt-2">Share your thoughts or advice with the community!</p>
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
          <Card>
            <CardHeader>
              <CardTitle>About {user.name}</CardTitle>
              <CardDescription>Additional information about this user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Bio</h3>
                <p>{user.bio || "No bio available"}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Academic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p>{user.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p>{user.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p>{user.role === "senior" ? "Senior Student" : "Junior Student"}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{user.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
