import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, User } from "@/types";

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  sidebarCollapsed: boolean;
  chatMessages: Record<string, ChatMessage[]>;
  isChatLoading: boolean;
  watchedVideos: Record<string, boolean>;

  setUser: (user: User | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  addChatMessage: (convId: string, message: ChatMessage) => void;
  setChatMessages: (convId: string, messages: ChatMessage[]) => void;
  setChatLoading: (loading: boolean) => void;
  setVideoWatched: (videoId: string, watched: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      sidebarCollapsed: false,
      chatMessages: {},
      isChatLoading: false,
      watchedVideos: {},

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      addChatMessage: (convId, message) =>
        set((state) => ({
          chatMessages: {
            ...state.chatMessages,
            [convId]: [...(state.chatMessages[convId] || []), message],
          },
        })),
      setChatMessages: (convId, messages) =>
        set((state) => ({
          chatMessages: { ...state.chatMessages, [convId]: messages },
        })),
      setChatLoading: (loading) => set({ isChatLoading: loading }),
      setVideoWatched: (videoId, watched) =>
        set((state) => ({
          watchedVideos: { ...state.watchedVideos, [videoId]: watched },
        })),
    }),
    {
      name: "dx-academy-store",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
