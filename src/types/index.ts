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

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  totalProgress: number;
  videosWatched: number;
  totalVideos: number;
  timeSpent: string;
  certificates: number;
  joinedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Certificate {
  id: string;
  moduleId: string;
  moduleTitle: string;
  studentName: string;
  completedAt: Date;
  grade: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
