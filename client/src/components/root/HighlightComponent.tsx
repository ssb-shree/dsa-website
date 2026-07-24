"use client";

import { Zalando_Sans_Expanded } from "next/font/google";
import { useState } from "react";
import { HighlightType } from "./Highlights";
import LoadingPage from "@/app/loading";

import { motion } from "framer-motion";

const buda = Zalando_Sans_Expanded({
  weight: "700",
  subsets: ["latin"],
});

const HighlightComponent = ({ data }: { data: HighlightType[] }) => {
  const [activeHighlight, setActiveHighlight] = useState(data[0]);

  if (!data.length) {
    return <LoadingPage />;
  }

  return (
    <section
      className={`h-[85vh] w-screen flex flex-col md:flex-row justify-center items-center md:px-10 ${buda.className}`}
    >
      <div className="h-full w-full md:w-[60%] flex flex-row gap-2 justify-center items-start p-3">
        <div className="h-[90%] w-[40%] flex justify-center items-center ">
          <motion.img
            key={activeHighlight.img1Url}
            src={activeHighlight.img1Url}
            alt={activeHighlight.title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="h-full w-[60%] flex flex-col justify-start gap-2 items-start">
          <div className="h-[40%] w-full  flex justify-center items-center">
            <motion.img
              key={activeHighlight.img1Url}
              src={activeHighlight.img2Url}
              alt={activeHighlight.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-[45%] w-[70%]  flex justify-center items-center">
            <motion.img
              key={activeHighlight.img1Url}
              src={activeHighlight.img3Url}
              alt={activeHighlight.title}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="h-full w-full md:w-[40%] flex flex-col">
        <h1
          className={`${buda.className} h-[15%] md:h-[25%] w-full flex justify-center items-center text-[5vh] md:text-[10vh]`}
        >
          HIGHLIGHTS
        </h1>
        <div className="h-[75%] w-full flex flex-col flex-wrap gap-2 justify-start items-start p-5">
          {data.map((highlight, index) => (
            <motion.span
              key={highlight._id}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.96 }}
              animate={{
                opacity: activeHighlight._id === highlight._id ? 1 : 0.45,
                x: activeHighlight._id === highlight._id ? 12 : 0,
                scale: activeHighlight._id === highlight._id ? 1.08 : 1,
              }}
              transition={{ duration: 0.25 }}
              className="capitalize cursor-pointer md:text-xl"
              onClick={() => setActiveHighlight(highlight)}
            >
              [{highlight.title}]
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightComponent;
