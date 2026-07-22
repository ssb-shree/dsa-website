"use client";

import { IdCard, IdCardIcon, Lock, User2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import type { Variants } from "framer-motion";
import axiosInstance from "@/services/axios";

import Cookie from "js-cookie";
import { toasty } from "@/components/ToastProvider";

import { useRouter } from "next/navigation";

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

      if (!moodleID || !password || !name || !department || !division || !year) return toasty("incomplete form cant be submitted");

      const { data } = await axiosInstance.post("/auth/register", registerData, { withCredentials: true });

      Cookie.set("jwt", data.token);

      router.push("/profile");
    } catch (error: any) {
      console.log(error.message || error);
      toasty(error.response.data.message);
    }
  };

  return (
    <section className=" relative w-screen h-screen overflow-hidden bg-transparent flex justify-center items-center">
      <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col space-y-20"
      >
        {/* moodleID */}
        <motion.div
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center space-x-5"
        >
          <IdCard />
          <input
            className="border-0 border-b bg-transparent uppercase text-lg md:text-xl outline-none"
            placeholder="moodle ID"
            value={registerData.moodleID}
            onChange={(e) => setRegisterData((p) => ({ ...p, moodleID: e.target.value.toLowerCase() }))}
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
            className="border-0 border-b bg-transparent uppercase text-lg md:text-xl outline-none"
            placeholder="password"
            value={registerData.password}
            onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value.toLowerCase() }))}
            type="password"
          />
        </motion.div>

        {/* Full Name */}
        <motion.div
          custom={0}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center space-x-5"
        >
          <User2 />
          <input
            className="border-0 border-b bg-transparent uppercase text-lg md:text-xl outline-none"
            placeholder="Full Name"
            value={registerData.name}
            onChange={(e) => setRegisterData((p) => ({ ...p, name: e.target.value.toLowerCase() }))}
            type="text"
          />
        </motion.div>

        {/* Department related details  */}
        <div className="grid grid-cols-3 gap-3">
          <label className="form-control w-full ">
            <select
              className="border-0 border-b bg-transparent uppercase text-lg md:text-xl outline-none w-full"
              value={registerData.department}
              onChange={(e) => setRegisterData((p) => ({ ...p, department: e.target.value }))}
            >
              <option className="bg-[#131F43] border " disabled value="">
                Dept
              </option>
              {departments.map((val, index) => (
                <option className="bg-[#131F43] uppercase text-sm md:text-lg outline-none " key={index} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control w-full ">
            <select
              className="border-0 border-b bg-transparent uppercase text-lg md:text-xl outline-none w-full"
              value={registerData.division}
              onChange={(e) => setRegisterData((p) => ({ ...p, division: e.target.value }))}
            >
              <option className="bg-[#131F43] border " disabled value="">
                Div
              </option>
              {divisions.map((val, index) => (
                <option
                  className="bg-[#131F43] underline uppercase text-sm md:text-lg outline-none "
                  key={index}
                  value={val}
                >
                  {val}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control w-full ">
            <select
              className="border-0 border-b bg-transparent uppercase text-lg md:text-xl outline-none w-full"
              value={registerData.year}
              onChange={(e) => setRegisterData((p) => ({ ...p, year: e.target.value }))}
            >
              <option className="bg-[#131F43] border " disabled value="">
                Year
              </option>
              {years.map((val, index) => (
                <option className="bg-[#131F43] uppercase text-sm md:text-lg outline-none " key={index} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </label>
        </div>

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
            className="text-xl border-b text-white hover:cursor-pointer"
            onClick={handleRegister}
          >
            Submit
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RegisterPage;
