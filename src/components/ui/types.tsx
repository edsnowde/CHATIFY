// types.tsx or any .tsx file in your project

export type UserRole = "student" | "faculty";

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  department: string;
  year: string;
  createdAt: Date;
}

export interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author?: User;
  postId: string;
  likes: string[];
}

export interface Post {
  id: string;
  content: string;
  images?: string[];
  videos?: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author: User;
  likes: string[];
  comments: CommentType[];
  tags: string[];
  isFlagged?: boolean; // Indicates if the post is flagged for review
}
