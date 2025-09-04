import { create } from "zustand";

interface CirclesState {
  circles: boolean;
  toggleCircles: () => void;
}

const useCircles = create<CirclesState>((set) => ({
  circles: true,
  toggleCircles: () => set((state) => ({ circles: !state.circles })),
}));

export default useCircles;
