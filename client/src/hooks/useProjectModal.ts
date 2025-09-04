import { create } from "zustand";

interface ProjectModalState {
  isOpen: boolean;
  link: string | null;
  toggle: (link?: string) => void;
}

export const useProjectModal = create<ProjectModalState>((set) => ({
  isOpen: false,
  link: null,
  toggle: (link?: string) =>
    set((state) => ({
      isOpen: !state.isOpen,
      link: link || null,
    })),
}));
