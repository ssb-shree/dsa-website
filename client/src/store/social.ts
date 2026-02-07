import { create } from "zustand";

type SocialStore = {
  selectedSocial: string | null;
  setSocial: (data: string) => void;
};

export const useSocialStore = create<SocialStore>()((set) => ({
  selectedSocial: null,
  setSocial: (data: string | null) => set({ selectedSocial: data }),
}));
