import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface AppState {
  user: { name: string; initials: string; email: string; isAdmin: boolean } | null;
  isAuthenticated: boolean;
  sidebarOpen: boolean;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;

  setUser: (user: AppState["user"]) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setChatLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  sidebarOpen: false,
  chatMessages: [],
  isChatLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setChatMessages: (messages) => set({ chatMessages: messages }),
  setChatLoading: (loading) => set({ isChatLoading: loading }),
}));
