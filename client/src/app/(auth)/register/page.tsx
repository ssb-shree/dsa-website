"use client";

import { IdCard, IdCardIcon, Lock, User2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import type { Variants } from "framer-motion";
import axiosInstance from "@/services/axios";

import Cookie from "js-cookie";
import { toasty } from "@/components/ToastProvider";

import { usePathname, useRouter } from "next/navigation";

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState<{
    moodleID: string;
    password: string;
    name: string;
    department: string;
    division: string;
    year: string;
  }>({
    moodleID: "",
    password: "",
    name: "",
    department: "",
    division: "",
    year: "",
  });

  const departments = ["DS", "AIML", "IT", "COMP", "CIVIL", "MECH"];
  const divisions = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const years = ["FE", "SE", "TE", "BE"];

  const router = useRouter();

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

  const handleRegister = async () => {
    try {
      const { moodleID, password, name, department, division, year } = registerData;

      if (!moodleID || !password || !name || !department || !division || !year)
        return toasty("incomplete form cant be submitted");

      const { data } = await axiosInstance.post("/auth/register", registerData, { withCredentials: true });

      Cookie.set("jwt", data.token);

      router.push("/profile");
    } catch (error: any) {
      console.log(error.message || error);
      if (error.message.response.data.errors.length > 0) {
        return error.response.data.errors.map((err: { path: string; message: string }) => toasty(err.message));
      }

      toasty(error.response.data.message);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl flex flex-col gap-10"
      >
        {/* Heading */}
        <div>
          <h1 className="text-4xl font-bold uppercase">Register with dsa</h1>
          <p className="text-sm opacity-60 mt-2">Enter your academic details to continue.</p>
        </div>

        {/* Basic */}
        <div className="flex flex-col gap-8">
          <motion.div
            custom={0}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4"
          >
            <IdCard className="shrink-0" />

            <input
              className="flex-1 border-0 border-b bg-transparent outline-none uppercase text-lg"
              placeholder="Moodle ID"
              value={registerData.moodleID}
              onChange={(e) =>
                setRegisterData((p) => ({
                  ...p,
                  moodleID: e.target.value.toLowerCase(),
                }))
              }
            />
          </motion.div>

          <motion.div
            custom={1}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4"
          >
            <User2 className="shrink-0" />

            <input
              className="flex-1 border-0 border-b bg-transparent outline-none uppercase text-lg"
              placeholder="Full Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData((p) => ({
                  ...p,
                  name: e.target.value,
                }))
              }
            />
          </motion.div>
        </div>

        {/* Academic */}
        <motion.div
          custom={2}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-6"
        >
          <select
            className="flex-1 min-w-[180px] border-0 border-b bg-transparent outline-none uppercase text-lg"
            value={registerData.department}
            onChange={(e) =>
              setRegisterData((p) => ({
                ...p,
                department: e.target.value,
              }))
            }
          >
            <option className="bg-[#131F43]" disabled value="">
              Department
            </option>

            {departments.map((dept) => (
              <option key={dept} value={dept} className="bg-[#131F43]">
                {dept}
              </option>
            ))}
          </select>

          <select
            className="flex-1 min-w-[120px] border-0 border-b bg-transparent outline-none uppercase text-lg"
            value={registerData.division}
            onChange={(e) =>
              setRegisterData((p) => ({
                ...p,
                division: e.target.value,
              }))
            }
          >
            <option className="bg-[#131F43]" disabled value="">
              Division
            </option>

            {divisions.map((div) => (
              <option key={div} value={div} className="bg-[#131F43]">
                {div}
              </option>
            ))}
          </select>

          <select
            className="flex-1 min-w-[120px] border-0 border-b bg-transparent outline-none uppercase text-lg"
            value={registerData.year}
            onChange={(e) =>
              setRegisterData((p) => ({
                ...p,
                year: e.target.value,
              }))
            }
          >
            <option className="bg-[#131F43]" disabled value="">
              Year
            </option>

            {years.map((year) => (
              <option key={year} value={year} className="bg-[#131F43]">
                {year}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Password */}
        <motion.div
          custom={3}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4"
        >
          <Lock className="shrink-0" />

          <input
            className="flex-1 border-0 border-b bg-transparent outline-none text-lg"
            placeholder="Password"
            type="password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData((p) => ({
                ...p,
                password: e.target.value,
              }))
            }
          />
        </motion.div>

        {/* Button */}
        <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="flex justify-end">
          <motion.button
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="border-b text-lg uppercase tracking-wide cursor-pointer"
            onClick={handleRegister}
          >
            Submit Details
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RegisterPage;
