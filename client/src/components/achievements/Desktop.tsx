"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import styles from "./sticky-scroll.module.css";

export const Desktop = ({
  content,
  contentClassName,
}: {
  content: {
    name: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end end"],
  });

  const cardCount = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (cardCount <= 1) return;

    const breakpoints = content.map((_, i) => i / (cardCount - 1));

    const closest = breakpoints.reduce((acc, bp, i) => {
      return Math.abs(latest - bp) < Math.abs(latest - breakpoints[acc]) ? i : acc;
    }, 0);

    setActiveCard(closest);
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative flex w-full h-[80%]",
        "items-start gap-16",
        "overflow-y-auto overflow-x-hidden",
        "rounded-md p-10 scrollbar-none",
        styles.scrollContainer,
      )}
    >
      {/* Text column */}
      <div className="relative flex items-start justify-start px-4">
        <div className="max-w-2xl pb-32">
          {content.map((item, index) => (
            <div key={item.name + index} className="my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-snug text-slate-100"
              >
                {item.name}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="mt-6 text-lg sm:text-xl leading-relaxed tracking-wide text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky preview */}
      <div className={cn("sticky top-10 self-start", "w-[45%] flex justify-center items-start", contentClassName)}>
        {content[activeCard]?.content ?? null}
      </div>
    </motion.div>
  );
};
