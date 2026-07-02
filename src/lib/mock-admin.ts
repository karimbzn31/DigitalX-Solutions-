export interface AccessCode {
  id: string;
  code: string;
  tag: string;
  uses: number;
  maxUses: number | null;
  expiry: string | null;
  status: "active" | "expired" | "depleted";
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  publishedAt: string;
  status: "published" | "draft";
}

export interface Student {
  id: string;
  name: string;
  initials: string;
  email: string;
  enrolledAt: string;
  status: "active" | "inactive" | "suspended";
  progress: number;
  emailVerified: boolean;
  lastActive: string;
  moduleEnCours: string;
  totalVideos: number;
  videosWatched: number;
  timeSpent: string;
}

export interface PendingRequest {
  id: string;
  name: string;
  email: string;
  initials: string;
  message?: string;
  plan: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface Activity {
  id: string;
  type: "inscription" | "validation" | "progression" | "certificat" | "message";
  user: { name: string; email: string };
  date: string;
  status: "completed" | "pending" | "warning";
  details: string;
}

export const ADMIN_USER = {
  name: "Karim Benzema",
  initials: "KB",
  email: "karim@dx.academy",
  role: "Super Admin",
};

export const STUDENTS: Student[] = [
  { id: "s1", name: "Amine Khelifa", initials: "AK", email: "amine@email.com", enrolledAt: "2026-06-28T10:00:00Z", status: "active", progress: 78, emailVerified: true, lastActive: "2026-07-02T09:00:00Z", moduleEnCours: "Vibe Coding 101", totalVideos: 24, videosWatched: 18, timeSpent: "12h" },
  { id: "s2", name: "Sarah Bouaziz", initials: "SB", email: "sarah@email.com", enrolledAt: "2026-07-01T14:30:00Z", status: "active", progress: 45, emailVerified: true, lastActive: "2026-07-02T11:00:00Z", moduleEnCours: "API Mastery", totalVideos: 24, videosWatched: 10, timeSpent: "6h" },
  { id: "s3", name: "Yacine Benali", initials: "YB", email: "yacine@email.com", enrolledAt: "2026-06-15T09:00:00Z", status: "inactive", progress: 92, emailVerified: true, lastActive: "2026-06-25T14:00:00Z", moduleEnCours: "Déploiement Cloud", totalVideos: 24, videosWatched: 22, timeSpent: "18h" },
  { id: "s4", name: "Lina Hadjadj", initials: "LH", email: "lina@email.com", enrolledAt: "2026-06-20T11:00:00Z", status: "active", progress: 67, emailVerified: true, lastActive: "2026-07-01T16:00:00Z", moduleEnCours: "Agents IA", totalVideos: 30, videosWatched: 20, timeSpent: "14h" },
  { id: "s5", name: "Rayan Mansouri", initials: "RM", email: "rayan@email.com", enrolledAt: "2026-06-30T08:00:00Z", status: "active", progress: 33, emailVerified: false, lastActive: "2026-07-01T10:00:00Z", moduleEnCours: "Vibe Coding 101", totalVideos: 24, videosWatched: 8, timeSpent: "5h" },
  { id: "s6", name: "Inès Cherif", initials: "IC", email: "ines@email.com", enrolledAt: "2026-07-02T16:00:00Z", status: "active", progress: 15, emailVerified: false, lastActive: "2026-07-02T16:30:00Z", moduleEnCours: "Bienvenue", totalVideos: 10, videosWatched: 1, timeSpent: "0.5h" },
  { id: "s7", name: "Mohamed Amine", initials: "MA", email: "m.amine@email.com", enrolledAt: "2026-05-10T10:00:00Z", status: "active", progress: 88, emailVerified: true, lastActive: "2026-07-02T08:00:00Z", moduleEnCours: "Déploiement Cloud", totalVideos: 24, videosWatched: 21, timeSpent: "16h" },
  { id: "s8", name: "Nadia Taleb", initials: "NT", email: "nadia@email.com", enrolledAt: "2026-06-01T12:00:00Z", status: "suspended", progress: 55, emailVerified: true, lastActive: "2026-06-20T09:00:00Z", moduleEnCours: "API Mastery", totalVideos: 24, videosWatched: 13, timeSpent: "9h" },
];

export const PENDING_REQUESTS: PendingRequest[] = [
  { id: "pr1", name: "Malik Z.", email: "malik@email.com", initials: "MZ", message: "Je souhaite rejoindre la formation pour apprendre le Vibe Coding et créer mon premier SaaS.", plan: "Formation Complète", status: "pending", createdAt: "2026-07-01T09:00:00Z" },
  { id: "pr2", name: "Amina S.", email: "amina@email.com", initials: "AS", message: "Intéressée par le module Agents IA.", plan: "Formation Complète", status: "pending", createdAt: "2026-07-01T14:30:00Z" },
  { id: "pr3", name: "Reda M.", email: "reda@email.com", initials: "RM", message: "Je veux lancer mon SaaS en Algérie.", plan: "Formation Complète", status: "pending", createdAt: "2026-06-30T11:00:00Z" },
  { id: "pr4", name: "Sofia K.", email: "sofia@email.com", initials: "SK", plan: "Module IA Gratuite", status: "pending", createdAt: "2026-06-29T16:45:00Z" },
  { id: "pr5", name: "Hichem B.", email: "hichem@email.com", initials: "HB", plan: "Formation Complète", status: "approved", createdAt: "2026-06-28T08:00:00Z" },
  { id: "pr6", name: "Imane R.", email: "imane@email.com", initials: "IR", message: "Je suis développeur et je veux me spécialiser en IA.", plan: "Formation Complète", status: "rejected", createdAt: "2026-06-27T10:00:00Z" },
  { id: "pr7", name: "Younes T.", email: "younes@email.com", initials: "YT", plan: "Module SaaS", status: "approved", createdAt: "2026-06-25T09:00:00Z" },
  { id: "pr8", name: "Meriem D.", email: "meriem@email.com", initials: "MD", message: "Je veux me reconvertir dans le développement IA.", plan: "Formation Complète", status: "rejected", createdAt: "2026-06-24T14:00:00Z" },
];

export const RECENT_ACTIVITIES: Activity[] = [
  { id: "a1", type: "inscription", user: { name: "Malik Z.", email: "malik@email.com" }, date: "2026-07-01T09:00:00Z", status: "pending", details: "Nouvelle demande d'inscription" },
  { id: "a2", type: "validation", user: { name: "Hichem B.", email: "hichem@email.com" }, date: "2026-06-28T08:00:00Z", status: "completed", details: "Compte activé avec succès" },
  { id: "a3", type: "progression", user: { name: "Amine K.", email: "amine@email.com" }, date: "2026-07-01T12:00:00Z", status: "completed", details: "A terminé le module 1" },
  { id: "a4", type: "progression", user: { name: "Sarah B.", email: "sarah@email.com" }, date: "2026-06-30T15:00:00Z", status: "completed", details: "Module 2 - progression 67%" },
  { id: "a5", type: "certificat", user: { name: "Yacine B.", email: "yacine@email.com" }, date: "2026-06-29T10:00:00Z", status: "completed", details: "Certificat délivré - Module 1" },
  { id: "a6", type: "message", user: { name: "Rayan M.", email: "rayan@email.com" }, date: "2026-07-01T18:30:00Z", status: "warning", details: "Message signalé dans la communauté" },
  { id: "a7", type: "inscription", user: { name: "Sofia K.", email: "sofia@email.com" }, date: "2026-06-29T16:45:00Z", status: "pending", details: "Nouvelle demande d'inscription" },
];

export const DAILY_REGISTRATIONS: { day: string; count: number }[] = [
  { day: "Lun", count: 3 },
  { day: "Mar", count: 5 },
  { day: "Mer", count: 2 },
  { day: "Jeu", count: 7 },
  { day: "Ven", count: 4 },
  { day: "Sam", count: 1 },
  { day: "Dim", count: 6 },
];

export const ACCESS_CODES: AccessCode[] = [
  { id: "c1", code: "DX-VIBE-2026", tag: "Early Access", uses: 12, maxUses: 20, expiry: "2026-12-31T23:59:00Z", status: "active" },
  { id: "c2", code: "DX-AGENTS-01", tag: "Module Agents", uses: 5, maxUses: 10, expiry: "2026-09-30T23:59:00Z", status: "active" },
  { id: "c3", code: "DX-PREMIUM", tag: "Premium", uses: 3, maxUses: 5, expiry: "2026-08-15T23:59:00Z", status: "active" },
  { id: "c4", code: "DX-FREE-2026", tag: "Accès Gratuit", uses: 45, maxUses: null, expiry: null, status: "active" },
  { id: "c5", code: "DX-ALUMNI", tag: "Anciens", uses: 20, maxUses: 20, expiry: "2026-06-01T23:59:00Z", status: "depleted" },
  { id: "c6", code: "DX-SPRING", tag: "Promo Printemps", uses: 15, maxUses: 15, expiry: "2026-05-31T23:59:00Z", status: "expired" },
];

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  { id: "a1", title: "Lancement du module Agents IA", content: "Nous sommes ravis d'annoncer le lancement du nouveau module Agents IA dans la formation complète.", pinned: true, publishedAt: "2026-06-28T09:00:00Z", status: "published" },
  { id: "a2", title: "Rappel : Session live Q&A", content: "Ne manquez pas notre session live questions/réponses ce vendredi à 18h.", pinned: false, publishedAt: "2026-07-01T10:00:00Z", status: "published" },
  { id: "a3", title: "Nouveau défi Vibe Coding", content: "Participez au défi et gagnez un accès premium.", pinned: false, publishedAt: "2026-06-25T14:00:00Z", status: "draft" },
];
