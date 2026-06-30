import { create } from "zustand";

interface SearchState {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  open: false,
  setOpen: (v) => set({ open: v }),
  toggle: () => set((s) => ({ open: !s.open })),
}));
