"use client";

import { ReactNode, useEffect } from "react";

import { useUserStore } from "@/store/user";
import axiosInstance from "@/services/axios";
import { toasty } from "./ToastProvider";
import { useRouter, usePathname } from "next/navigation";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setAuth, setUser } = useUserStore();

  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = async () => {
    try {
      const { data } = await axiosInstance.get("/auth/check", { withCredentials: true });
      setAuth(true);

      setUser(data.user);
    } catch (error: any) {
      if (error.response.data.message === "jwt malformed") {
        toasty("cookie expired, login again");

        if (pathname === "/profile") {
          router.push("/login?redirect=/profile");
        }
      }

      if (error.response.data.message === "unauthorized no token provided" && pathname === "/profile") {
        toasty("login into your accoun to see profile");
        router.push("/login?redirect=/profile");
      }
      setAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return children;
};

export default AuthProvider;
