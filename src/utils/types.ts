export type UserRole = "student" | "faculty";

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
  author: User;
  likes: string[];
  comments: string[];
  tags: string[];
  isFlagged: boolean | null;
  moderationScore: number | null;
  moderationDetails: any;
  moderationCheckedAt: Date | null;
  moderationError?: boolean;
}

export interface CommentType {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author?: User;
  postId: string;
  parentId?: string;
  likes: string[];
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "reply" | "mention" | "follow";
  title: string;
  message: string;
  seen: boolean;
  createdAt: Date;
  actorId: string;
  actor?: User;
  recipientId: string;
  postId?: string;
  commentId?: string;
  link?: string;
}

export interface AppState {
  posts: Post[];
  notifications: Notification[];
  users: User[];
}







