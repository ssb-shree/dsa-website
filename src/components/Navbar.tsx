"use client";

import Link from "next/link";
import { motion } from "framer-motion"; 

import {useRouter} from "next/navigation"

const quickNavs = ["events", "team", "achivements"];

const Navbar = () => {

  const router = useRouter()
  return (
    <nav className="w-screen h-12 bg-black/20 backdrop-blur fixed top-0 left-0 z-30 overflow-x-hidden flex flex-row justify-between items-center px-10">
      {/* LOGO  */}
      <Link href={"/"} className="h-10" onClick={() => window?.lenis?.scrollTo(`#hero`)}>
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src="/dsa.png"
          className="h-full object-contain rounded-xl"
          alt="dsa emblem"
        />
      </Link>
      {/* QUICK NAVIGATION TO SECTIONS  */}
      <div className="hidden md:flex flex-row justify-between items-center w-[40%]">
        {quickNavs.map((nav, idx) => (
          <div key={idx} className="flex flex-col capitalize mx-3 hover:cursor-pointer ">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="transform hover:-translate-y-px transition duration-400"
              onClick={() => nav === quickNavs[2] ? router.push(quickNavs[2]) : window?.lenis?.scrollTo(`#${nav}`)}
            >
              {nav}
            </motion.span>
            <motion.div
              className="bg-white h-[1px] w-full"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 1 }}
              whileHover={{ opacity: 1, scaleX: 1 }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        ))}
      </div>
      {/* ADMIN LOGIN  */}

      <button className="flex flex-col hover:cursor-pointer">
        <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
          Login
        </motion.span>
        <motion.div
          className="bg-white h-[1px] w-full"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.333, delay: 1 }}
          style={{ transformOrigin: "left" }}
        />
      </button>
    </nav>
  );
};

export default Navbar;
