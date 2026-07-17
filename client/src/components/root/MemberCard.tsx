"use client";

import { MemberType } from "@/data/member";

import { motion, AnimatePresence } from "framer-motion";

import { useState } from "react";
import { Zalando_Sans_Expanded } from "next/font/google";

const buda = Zalando_Sans_Expanded({
  weight: "200",
  subsets: ["latin"],
});

const MemberStack = ({ memberArray, type }: { memberArray: MemberType[]; type: string }) => {
  const [stack, setStack] = useState(memberArray);

  const bringToFront = (index: number) => {
    const updated = [...stack];
    const [clicked] = updated.splice(index, 1);
    updated.unshift(clicked); // move to front
    setStack(updated);
  };

  return (
    <div className="relative h-[93%] w-[55vw] md:w-[20vw] flex flex-col items-center justify-start pb-6">
      <AnimatePresence>
        {stack.map((member, i) => (
          <MemberCard member={member} num={i} key={member.id} onClick={() => bringToFront(i)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MemberStack;

const MemberCard = ({ member, num, onClick }: { member: MemberType; num: number; onClick: () => void }) => {
  return (
    <motion.div
      layout
      onClick={onClick}
      className="absolute cursor-pointer"
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{
        opacity: 1,
        scale: 1 - num * 0.02,
        top: num * 10,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      style={{
        zIndex: num,
      }}
    >
      <div className="w-[50vw] md:w-[15vw] flex items-center h-[35vh] md:h-[45vh] ">
        <div className="relative border border-purple-300/35 py-1 px-2 md:h-[95%] h-[80%] w-[55vw] md:w-[16vw] rounded-xl bg-[#1F2225]">
          <div className="absolute z-10 h-full w-[95%] mt-5 flex flex-row justify-between items-start">
            <h1
              className={`flex flex-col h-full justify-start items-center capitalize text-slate-100/70 text-xs md:text-md ${buda.className}`}
            >
              {member.role.split("").map((word, i) => (
                <span className="">{word}</span>
              ))}
            </h1>
          </div>
          <div className="absolute z-20 h-full w-full flex flex-col justify-center items-center">
            <img src={member.imgUrl} className="h-full w-full object-contain object-center mb-15 md:mb-30" />
          </div>
          <div className="absolute z-30 h-full w-full flex flex-col justify-end items-end p-1 pr-3 md:pr-5 pb-2 md:pb-5  ">
            <div className="bg-black/20 backdrop-blur w-full px-2 py-1 rounded-lg md:rounded-xl">
              <h1 className="text-sm md:text-xl capitalize">{member.name}</h1>
              <h2 className={`${buda.className} text-xs md:text-sm capitalize`}>{member.type} Team</h2>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
