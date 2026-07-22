import { create } from "zustand";

export type UserType = {
  department: string;
  division: string;
  email: string;
  moodleID: string;
  name: string;
  organizationID: { _id: string; name: string; slug: string; logoUrl: string }[];
  registeredEvents: { title: string; _id: string; slug: string }[];
  role: string;
  _id: string;
  createdAt: string;
};

type userStore = {
  user: UserType | null;
  setUser: (data: UserType) => void;
  isAuth: boolean;
  setAuth: (data: boolean) => void;
};

export const useUserStore = create<userStore>()((set) => ({
  user: null,
  setUser: (data: UserType) => set(() => ({ user: data })),
  isAuth: false,
  setAuth: (data: boolean) => set(() => ({ isAuth: data })),
}));
