"use client";

import { IdCard, IdCardIcon, Lock, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { Variants } from "framer-motion";
import axiosInstance from "@/services/axios";

import Cookie from "js-cookie";
import { toasty } from "@/components/ToastProvider";

import { useUserStore } from "@/store/user";

import { useRouter } from "next/navigation";
import LoadingPage from "@/app/loading";

const ProfileUpdatePage = () => {
  const [updateData, setUpdateData] = useState<{
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
  const { isAuth, user, setUser } = useUserStore();

  useEffect(() => {
    if (!user) return;

    setUpdateData({
      department: user.department,
      division: user.division,
      moodleID: user.moodleID,
      name: user.name,
      year: user.year,
      password : ""
    });
  }, [user]);

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

  const handleUpdate = async () => {
    try {
      const { moodleID, password, name, department, division, year } = updateData;

      if (!moodleID || !name || !department || !division || !year)
        return toasty("incomplete form cant be submitted");

      const { data } = await axiosInstance.patch("/auth/update", updateData, { withCredentials: true });

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

  if (!isAuth || !user) {
    return <LoadingPage />;
  }

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
          <h1 className="text-4xl font-bold uppercase">Update Profile</h1>
          <p className="text-sm opacity-60 mt-2">Keep your academic details up to date.</p>
        </div>

        {/* Basic Info */}
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
              value={updateData.moodleID}
              onChange={(e) =>
                setUpdateData((p) => ({
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
              value={updateData.name}
              onChange={(e) =>
                setUpdateData((p) => ({
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
            value={updateData.department}
            onChange={(e) =>
              setUpdateData((p) => ({
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
            value={updateData.division}
            onChange={(e) =>
              setUpdateData((p) => ({
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
            value={updateData.year}
            onChange={(e) =>
              setUpdateData((p) => ({
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
            className="flex-1 border-0 border-b bg-transparent outline-none uppercase text-lg"
            placeholder="New Password"
            type="password"
            value={updateData.password}
            onChange={(e) =>
              setUpdateData((p) => ({
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
            className="border-b text-lg uppercase tracking-wide cursor-pointer"
            onClick={handleUpdate}
          >
            Update Profile
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProfileUpdatePage;
