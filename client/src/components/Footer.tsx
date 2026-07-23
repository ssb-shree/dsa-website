"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/user";

const socialLinks = [
  { name: "instagram", link: "https://www.instagram.com/dsa_apsit" },
  {
    name: "linkedin",
    link: "https://www.linkedin.com/in/dsa-apsit?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    name: "facebook",
    link: "https://www.facebook.com/p/Data-Science-Association-APSIT-100085633250918/",
  },
];

const navLinks = [
  { name: "register", link: "/register" },
  { name: "profile", link: "/profile" },
  { name: "home", link: "/" },
];

const adminControls = [
  { name: "events", link: "/events/create" },
  { name: "achievements", link: "/admin/achievements" },
  { name: "highlights", link: "/admin/highlights" },
];

const adminTools = [
  { name: "Image to Url", link: "/admin/tools/img" },
  { name: "Url to QR", link: "/events/ssb/feedback" },
  { name: "Team Access", link: "/admin/team" },
];

const FooterSection = ({ title, links }: { title: string; links: { name: string; link: string }[] }) => (
  <div className="flex flex-col items-start gap-3 mt-8 border-t lg:border-0 pt-3">
    <span>{title}</span>

    {links.map((item) => (
      <Link
        key={item.link}
        href={item.link}
        target={item.link.startsWith("http") ? "_blank" : undefined}
        className="underline capitalize"
      >
        {item.name}
      </Link>
    ))}
  </div>
);

const Footer = () => {
  const { user } = useUserStore();

  const isAdmin = user && user.role !== "USER";

  return (
    <>
      <footer
        id="socials"
        className="w-screen min-h-[40vh] md:h-[30vh] p-2 flex flex-col md:flex-row justify-around items-center overflow-hidden"
      >
        {/* Logo */}
        <div className="w-full md:w-[35%] flex flex-col">
          <span className="text-8xl md:text-9xl text-red-600 tracking-widest flex">
            {"DSA".split("").map((letter) => (
              <motion.span
                key={letter}
                whileHover={{ y: -2, scale: 1.2 }}
                className="font-extrabold inline-block cursor-pointer"
              >
                {letter}
              </motion.span>
            ))}
          </span>

          <p className="text-sm md:text-base">Representing the finest of Data Science department.</p>
        </div>

        {/* Links */}
        <div className={`w-[90%] md:w-[60%] grid gap-8 ${isAdmin ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2"}`}>
          <FooterSection title="Follow Us" links={socialLinks} />
          <FooterSection title="Navigate" links={navLinks} />

          {isAdmin && (
            <>
              <FooterSection title="Admin Controls" links={adminControls} />

              <FooterSection title="Admin Utils" links={adminTools} />
            </>
          )}
        </div>
      </footer>

      <Link
        href="https://www.linkedin.com/in/shree-bavachikar-a16493375/"
        target="_blank"
        className="flex justify-center my-16 text-md uppercase tracking-[0.45em] opacity-60 hover:opacity-100 transition"
      >
        SHREE MADE THAT ✌
      </Link>
    </>
  );
};

export default Footer;
