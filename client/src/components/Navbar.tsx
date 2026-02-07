"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { IoMdAdd } from "react-icons/io";

const quickNavs = ["events", "team", "achievements"];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleNav = async (nav: string) => {
    setOpen(false);

    if (nav === "achievements") {
      router.push("/achievements");
      return;
    }

    // If already on home, just scroll
    if (pathname === "/") {
      window?.lenis?.scrollTo(`#${nav}`);
      return;
    }

    // If NOT on home:
    // 1. go to home
    // 2. wait for route
    // 3. scroll
    router.push("/");

    // small delay so DOM + lenis are ready
    setTimeout(() => {
      window?.lenis?.scrollTo(`#${nav}`);
    }, 800);
  };

  return (
    <>
      <nav className="w-screen h-12 bg-black/20 backdrop-blur fixed top-0 left-0 z-30 overflow-x-hidden flex justify-between items-center px-6 md:px-10">
        {/* LOGO */}
        <Link href="/" className="h-10" onClick={() => window?.lenis?.scrollTo("#hero")}>
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src="/dsa.png"
            className="h-full object-contain rounded-xl"
            alt="dsa emblem"
          />
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center w-[40%] justify-between">
          {quickNavs.map((nav, idx) => (
            <div key={idx} className="flex flex-col capitalize cursor-pointer">
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                onClick={() =>
                  nav === quickNavs[2] ? router.push("/achievements") : window?.lenis?.scrollTo(`#${nav}`)
                }
              >
                {nav}
              </motion.span>
              <motion.div
                className="bg-white h-[1px] w-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          ))}
        </div>

        {/* DESKTOP LOGIN */}
        <Link href="/login" className="hidden md:flex flex-col cursor-pointer">
          <motion.span initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            Login
          </motion.span>
          <motion.div
            className="bg-white h-[1px] w-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.333, delay: 1 }}
            style={{ transformOrigin: "left" }}
          />
        </Link>

        {/* MOBILE HAMBURGER */}
        <button className="md:hidden flex flex-col gap-1.5" onClick={() => setOpen(true)} aria-label="Open menu">
          <span className="w-6 h-[2px] bg-white" />
          <span className="w-6 h-[2px] bg-white" />
          <span className="w-6 h-[2px] bg-white" />
        </button>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed md:hidden top-0 right-0 w-screen h-screen bg-slate-300/99 z-40 flex flex-col"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="p-6 text-blue-700 text-xl self-start rotate-45"
              aria-label="Close menu"
            >
              <IoMdAdd size={30} />
            </button>

            {/* LINKS */}
            <div className="flex flex-col gap-8 px-6 mt-4 flex-1">
              {quickNavs.map((nav) => (
                <span
                  key={nav}
                  className="text-[2.25rem] font-semibold tracking-tight capitalize text-blue-700 cursor-pointer transition hover:translate-x-1 border-0 border-b border-blue-300"
                  onClick={() => handleNav(nav)}
                >
                  {nav}
                </span>
              ))}

              <span
                className="mt-4 text-[2.25rem] font-semibold tracking-tight text-blue-700 cursor-pointer transition hover:translate-x-1 border-0 border-b border-blue-300"
                onClick={() => {
                  setOpen(false);
                  router.push("/login");
                }}
              >
                Login
              </span>
            </div>

            {/* BOTTOM TEXT */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="px-6 pb-10 text-slate-800 max-w-md"
            >
              <p className="text-md font-medium leading-relaxed opacity-90">
                We are a student-led committee from the Data Science department.
              </p>

              <p className="text-md font-medium leading-relaxed opacity-90 mt-2">
                Bringing together technology, creativity, and community.
              </p>

              <p className="text-md font-medium leading-relaxed opacity-80 mt-4">
                From hands-on workshops to social and non-technical events, we create spaces to learn, connect, and
                grow. This is where curiosity turns into collaboration.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
