"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const socialLinks: { name: string; link: string }[] = [
  { name: "instagram", link: "https://www.instagram.com/dsa_apsit" },
  {
    name: "linkedin",
    link: "https://www.linkedin.com/in/dsa-apsit?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  { name: "facebook", link: "https://www.facebook.com/p/Data-Science-Association-APSIT-100085633250918/" },
];

const Footer = () => {
  return (
    <>
      <footer id="socials" className="w-screen h-[40vh] p-2 overflow-x-hidden flex flex-col md:flex-row gap-y-3 justify-around items-center">
        <div className="w-full md:w-[35%] flex flex-col justify-center items-start">
          <span className="text-8xl md:text-9xl text-red-600 tracking-widest flex flex-row justify-center items-center space-x-2">
            {"DSA".split("").map((letter, index) => (
              <motion.span key={index} whileHover={{ y: -2, scale: 1.2 }} className="inline-block hover:cursor-pointer font-extrabold">
                {letter}
              </motion.span>
            ))}
          </span>
          <p className="text-sm md:text-md">Representing the finest of Data Science department.</p>
        </div>
        <div className="w-full md:w-[40%] flex flex-row justify-around items-center">
          <div className="flex flex-col justify-center items-start gap-y-3">
            <span>Follow Us</span>
            {socialLinks.map((item, index) => (
              <Link href={item.link} target="_blank" key={index} className="underline text-md capitalize text-left">
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center gap-y-3">
            <span>list of links 2</span>
            {[1, 2, 3].map((link, index) => (
              <Link href={"#"} key={index} className="underline text-md">
                link {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
      <Link
        href="https://www.linkedin.com/in/shree-bavachikar-a16493375/"
        target="_blank"
        className="w-screen flex justify-center items-center mb-5"
      >
        Built by Shree
      </Link>
    </>
  );
};

export default Footer;
