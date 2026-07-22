"use client";

import { ReactNode, useEffect } from "react";

import { useUserStore } from "@/store/user";
import axiosInstance from "@/services/axios";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setAuth } = useUserStore();
  const checkAuth = async () => {
    try {
      await axiosInstance.get("/auth/check", { withCredentials: true });

      setAuth(true);
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
