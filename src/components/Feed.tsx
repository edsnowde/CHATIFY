import { useState, useMemo } from "react";
import { User, Post as PostType, UserRole } from "@/utils/types";
import CreatePost from "./CreatePost";
import Post from "./Post";
import FeedFilters, { FilterType, SortByType } from "./FeedFilters";
import FeedLoadingSkeleton from "./FeedLoadingSkeleton";
import NoPostsMessage from "./NoPostsMessage";
import { usePosts } from "@/hooks/usePosts";

interface FeedProps {
  currentUser?: User;
}

const Feed = ({ currentUser }: FeedProps) => {
  const { 
    posts, 
    isLoading, 
    handlePostCreated, 
    handlePostUpdate, 
    handlePostDelete 
  } = usePosts();
  
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortByType>("latest");
  const [showFilters, setShowFilters] = useState(false);

  // Handler for updating specific posts (for moderation results)
  const handlePostUpdated = (postId: string, updates: Partial<PostType>) => {
    handlePostUpdate(postId, updates);
  };
  
  // Filter posts based on selection
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (!post.author) return false; 
      if (filter === "all") return true;
      // Type assertion for UserRole filters
      return post.author.role === (filter as UserRole); 
    });
  }, [posts, filter]);
  
  // Sort posts with additional logic for flagged content
  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      // Prioritize unflagged content over flagged content
      if (a.isFlagged !== b.isFlagged) {
        if (a.isFlagged === true && b.isFlagged !== true) return 1;
        if (b.isFlagged === true && a.isFlagged !== true) return -1;
      }

      // Then apply the selected sorting
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else { // popular
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
    });
  }, [filteredPosts, sortBy]);

  return (
    <div className="w-full">
      {currentUser && (
        <CreatePost 
          currentUser={currentUser} 
          onPostCreated={handlePostCreated}
          onPostUpdated={handlePostUpdated}
        />
      )}
      
      <FeedFilters 
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      
      <div className="space-y-6">
        {isLoading ? (
          <FeedLoadingSkeleton />
        ) : sortedPosts.length === 0 ? (
          <NoPostsMessage />
        ) : (
          sortedPosts.map(post => (
            <Post 
              key={post.id} 
              post={post} 
              currentUser={currentUser}
              onPostUpdate={handlePostUpdate}
              onPostDelete={handlePostDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;