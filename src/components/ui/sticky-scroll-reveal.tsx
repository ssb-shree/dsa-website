"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
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

  const gradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(gradients[0]);

  useEffect(() => {
    setBackgroundGradient(gradients[activeCard % gradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      ref={ref}
      className="
        relative flex flex-col lg:flex-row
        h-[calc(100dvh-8rem)] lg:h-[70%]
        max-h-[calc(100dvh-8rem)]
        gap-10
        overflow-y-auto
        rounded-md
        border
        bg-transparent
        p-4 sm:p-6 lg:p-10
        md:w-full
      "
    >
      {/* Left content */}
      <div className="relative flex w-full items-center px-2 sm:px-4">
        <div className="w-full max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-12 sm:my-20">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="mt-6 max-w-sm text-slate-300"
              >
                {item.description}
              </motion.p>

              {/* Mobile preview */}
              {activeCard === index && (
                <div
                  style={{ background: backgroundGradient }}
                  className="mt-6 h-48 w-full overflow-hidden rounded-md lg:hidden"
                >
                  {item.content ?? null}
                </div>
              )}
            </div>
          ))}

          <div className="h-24" />
        </div>
      </div>

      {/* Desktop sticky preview */}
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-20 hidden h-60 w-80 xl:h-72 xl:w-96 overflow-hidden rounded-md lg:block",
          contentClassName,
        )}
      >
        {content[activeCard]?.content ?? null}
      </div>
    </motion.div>
  );
};
