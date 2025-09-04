import { create } from "zustand";

interface ContactModalState {
  isOpen: boolean;
  toggle: () => void;
}

export const useContactModal = create<ContactModalState>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
