import { create } from "zustand";

type EventStore = {
  currentIndex: number;
  setCurrentIndex: (data: number) => void;
};

export const useEventStore = create<EventStore>()((set) => ({
  currentIndex: 0,
  setCurrentIndex: (data: number) => set({ currentIndex: data }),
}));
