import { useState, useEffect, useCallback } from "react";
import { User, Post as PostType, UserRole } from "@/utils/types";
import { useToast } from "@/hooks/use-toast";
import { sampleUsers, samplePosts as defaultSamplePosts } from "@/data/sampleData";

export const usePosts = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const savePostsToLocalStorage = useCallback((postsToSave: PostType[]) => {
    localStorage.setItem('posts', JSON.stringify(postsToSave));
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        const storedPosts = localStorage.getItem('posts');
        
        if (storedPosts) {
          const parsedPosts = JSON.parse(storedPosts, (key, value) => {
            if (key === 'createdAt' || key === 'updatedAt') {
              return new Date(value);
            }
            // Role migration for authors within posts
            if (key === 'author' && value && typeof value === 'object' && value !== null) {
              const authorObj = value as any; 
              if (authorObj.createdAt && typeof authorObj.createdAt === 'string') {
                authorObj.createdAt = new Date(authorObj.createdAt);
              }
              if (authorObj.role === 'senior') authorObj.role = 'faculty';
              else if (authorObj.role === 'junior') authorObj.role = 'student';
            }
            // Role migration for authors within comments
            if (key === 'comments' && Array.isArray(value)) {
              value.forEach(comment => {
                const commentObj = comment as any;
                if (commentObj.createdAt && typeof commentObj.createdAt === 'string') {
                  commentObj.createdAt = new Date(commentObj.createdAt);
                }
                if (commentObj.author && typeof commentObj.author === 'object' && commentObj.author !== null) {
                  const commentAuthorObj = commentObj.author as any;
                  if (commentAuthorObj.createdAt && typeof commentAuthorObj.createdAt === 'string') {
                    commentAuthorObj.createdAt = new Date(commentAuthorObj.createdAt);
                  }
                  if (commentAuthorObj.role === 'senior') commentAuthorObj.role = 'faculty';
                  else if (commentAuthorObj.role === 'junior') commentAuthorObj.role = 'student';
                }
              });
            }
            return value;
          });

          const postsWithGuaranteedAuthors = parsedPosts.map((post: PostType) => {
            let finalAuthor = post.author;
            if (!finalAuthor && post.authorId) {
              // Try finding in sampleUsers first
              let foundAuthor = sampleUsers.find(u => u.id === post.authorId);
              if (!foundAuthor) {
                const allStoredUsers = localStorage.getItem('users');
                if (allStoredUsers) {
                  const parsedUsersList: User[] = JSON.parse(allStoredUsers, (k, v) => {
                    if (k === 'createdAt') return new Date(v);
                    if (k === 'role') {
                      if (v === 'senior') return 'faculty' as UserRole;
                      if (v === 'junior') return 'student' as UserRole;
                    }
                    return v;
                  });
                  foundAuthor = parsedUsersList.find((u: User) => u.id === post.authorId);
                }
              }
              finalAuthor = foundAuthor || { 
                id: post.authorId, name: "Unknown User", email: "", 
                role: "student" as UserRole, department: "N/A", year: "N/A", 
                createdAt: new Date() 
              };
            }
            
            if (finalAuthor) {
              const authorRoleAny = finalAuthor.role as any;
              if (authorRoleAny === 'senior') finalAuthor.role = 'faculty';
              else if (authorRoleAny === 'junior') finalAuthor.role = 'student';
              if (typeof finalAuthor.createdAt === 'string') {
                finalAuthor.createdAt = new Date(finalAuthor.createdAt);
              }
            }

            const finalComments = post.comments?.map(comment => {
              let commentAuthor = comment.author;
              if (commentAuthor) {
                const commentAuthorRoleAny = commentAuthor.role as any;
                if (commentAuthorRoleAny === 'senior') commentAuthor.role = 'faculty';
                else if (commentAuthorRoleAny === 'junior') commentAuthor.role = 'student';
                if (typeof commentAuthor.createdAt === 'string') {
                  commentAuthor.createdAt = new Date(commentAuthor.createdAt);
                }
              }
              return {
                ...comment,
                author: commentAuthor,
                createdAt: typeof comment.createdAt === 'string' ? new Date(comment.createdAt) : comment.createdAt,
              };
            });

            return { 
              ...post, 
              author: finalAuthor,
              comments: finalComments || [],
              createdAt: typeof post.createdAt === 'string' ? new Date(post.createdAt) : post.createdAt,
              updatedAt: typeof post.updatedAt === 'string' ? new Date(post.updatedAt) : post.updatedAt,
            };
          });

          setPosts(postsWithGuaranteedAuthors);
        } else {
          setPosts(defaultSamplePosts);
          savePostsToLocalStorage(defaultSamplePosts);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        toast({
          title: "Error loading posts",
          description: "Could not load posts. Please try again later.",
          variant: "destructive"
        });
        setPosts(defaultSamplePosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast, savePostsToLocalStorage]);

  const handlePostCreated = useCallback((newPost: PostType) => {
    setPosts(prevPosts => {
      const existingIndex = prevPosts.findIndex(post => post.id === newPost.id);

      let updatedPosts;
      if (existingIndex !== -1) {
        // Update only isFlagged if it's an existing post
        updatedPosts = prevPosts.map(post =>
          post.id === newPost.id
            ? { ...post, isFlagged: newPost.isFlagged }
            : post
        );
      } else if (newPost.isFlagged === null) {
        // Add only if isFlagged is null
        updatedPosts = [newPost, ...prevPosts];
      } else {
        // Do nothing if it's flagged and doesn't exist
        updatedPosts = prevPosts;
      }

      savePostsToLocalStorage(updatedPosts);
      return updatedPosts;
    });
  }, [savePostsToLocalStorage]);

  const handlePostUpdate = useCallback((updatedPost: PostType) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
      savePostsToLocalStorage(updatedPosts);
      return updatedPosts;
    });
  }, [savePostsToLocalStorage]);

  const handlePostDelete = useCallback((postId: string) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.filter(post => post.id !== postId);
      savePostsToLocalStorage(updatedPosts);
      return updatedPosts;
    });
  }, [savePostsToLocalStorage]);

  return { posts, isLoading, handlePostCreated, handlePostUpdate, handlePostDelete };
};
