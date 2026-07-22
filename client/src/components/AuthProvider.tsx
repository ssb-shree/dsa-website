"use client";

import { ReactNode, useEffect } from "react";

import { useUserStore } from "@/store/user";
import axiosInstance from "@/services/axios";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setAuth, setUser } = useUserStore();
  const checkAuth = async () => {
    try {
      const { data } = await axiosInstance.get("/auth/check", { withCredentials: true });
      setAuth(true);

      setUser(data.user);
    } catch (error) {
      setAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return children;
};

export default AuthProvider;
