
// Type definitions for our application

export type UserRole = "senior" | "junior";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: string;
  year: string;
  role: UserRole;
  bio?: string;
  createdAt: Date;
}

export interface Post {
  id: string;
  content: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  author?: User;
  likes: string[]; // Array of user IDs
  comments: Comment[];
  tags: string[]; // Array of hashtags
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author?: User;
  postId: string;
  parentId?: string; // For replies to comments
  likes: string[]; // Array of user IDs
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "reply" | "mention" | "follow";
  title: string;
  message: string;
  seen: boolean;
  createdAt: Date;
  actorId: string; // User who triggered the notification
  actor?: User;
  recipientId: string; // User receiving the notification
  postId?: string;
  commentId?: string;
  link?: string; // Navigation link when clicked
}

export interface AppState {
  posts: Post[];
  notifications: Notification[];
  users: User[];
}
