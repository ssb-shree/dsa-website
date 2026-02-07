"use client";

import { Lock, User2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import type { Variants } from "framer-motion";
import axiosInstance from "@/services/axios";

import Cookie from "js-cookie";

import { useRouter } from "next/navigation";

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const LoginPage = () => {
  const [loginData, setLoginData] = useState<{ username: string; password: string }>({
    username: "",
    password: "",
  });

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { username, password } = loginData;

      if (!username || !password) return;

      const { data } = await axiosInstance.post("/auth/login", loginData, { withCredentials: true });

      Cookie.set("jwt", data.token);

      router.push("/admin");
    } catch (error: any) {
      console.log(error.message || error);
    }
  };

  return (
    <section className="w-screen h-screen overflow-hidden bg-[#101A38] flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col space-y-20"
      >
        {/* Username */}
        <motion.div
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center space-x-5"
        >
          <User2 />
          <input
            className="border-0 border-b bg-transparent uppercase text-lg md:text-3xl outline-none"
            placeholder="username"
            value={loginData.username}
            onChange={(e) => setLoginData((p) => ({ ...p, username: e.target.value.toLowerCase() }))}
            type="text"
          />
        </motion.div>

        {/* Password */}
        <motion.div
          custom={1}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center space-x-5"
        >
          <Lock />
          <input
            className="border-0 border-b bg-transparent uppercase text-lg md:text-3xl outline-none"
            placeholder="password"
            value={loginData.password}
            onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value.toLowerCase() }))}
            type="password"
          />
        </motion.div>

        {/* Button */}
        <motion.div
          custom={2}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center"
        >
          <motion.button
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-xl border-b"
            onClick={handleLogin}
          >
            Submit
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LoginPage;
