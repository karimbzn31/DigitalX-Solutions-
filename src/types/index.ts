export interface Module {
  id: string;
  title: string;
  titleShort?: string;
  description?: string;
  videos: number;
  duration: string;
  level?: string;
  progress: number;
  status?: "completed" | "in-progress" | "locked";
  color?: { from: string; to: string };
}

export interface Video {
  id: string;
  moduleId: string;
  title: string;
  duration: string;
  order: number;
  completed?: boolean;
}

export interface Resource {
  id: string;
  type: "prompt" | "code" | "pdf" | "template";
  title: string;
  description: string;
  moduleId: string;
  content?: string;
  fileUrl?: string;
}

export interface CommunityPost {
  id: string;
  author: { name: string; initials: string; badge: string };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  channel: string;
  pinned: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  date: Date;
}

export interface User {
  id?: string;
  name: string;
  initials: string;
  email: string;
  isAdmin?: boolean;
  level?: string;
  totalProgress?: number;
  videosWatched?: number;
  totalVideos?: number;
  timeSpent?: string;
  certificates?: number;
  joinedAt?: string;
  status?: "pending" | "active" | "blocked";
  validationCode?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  conversationId?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  badge: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  image: string;
  tags: string[];
  readTime: number;
  publishedAt: string;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning";
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  enrolledAt: string;
  status: "active" | "inactive" | "suspended";
  progress: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  publishedAt: Date;
  status: "published" | "draft";
}
