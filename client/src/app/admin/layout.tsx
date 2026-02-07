"use client";
import axiosInstance from "@/services/axios";

import { useEffect, useState } from "react";
import NotFound from "../not-found";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [admin, setAdmin] = useState<boolean>(false);

  const checkAuth = async () => {
    try {
      await axiosInstance.get("/auth/check");
      setAdmin(true);
    } catch (error: any) {
      setAdmin(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, [setAdmin]);

  if (admin) return children;

  return <NotFound />;
}
