"use client";

import { useUserStore } from "@/store/user";
import React, { ReactNode, useEffect, useState } from "react";
import NotFound from "../not-found";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setAdmin] = useState(false);

  const { user } = useUserStore();

  useEffect(() => {
    if (!user || user.role === "USER") {
      return setAdmin(false);
    }

    setAdmin(true);
  }, [user]);

  if (!isAdmin) {
    return <NotFound />;
  }

  return children;
};

export default AdminLayout;
