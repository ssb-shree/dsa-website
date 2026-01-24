"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { FiLock } from "react-icons/fi";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";

import { EventCards } from "../EventCards";

import { useEventStore } from "@/store/events";
import { events } from "@/data/events";

const Events = () => {
  const { currentIndex } = useEventStore();
  return (
    <section className="w-screen h-screen md:h-[80vh] overflow-hidden bg-zinc-50 text-black flex flex-col-reverse md:flex-row justify-around items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-[95%] h-1/2 md:w-[55%] md:h-[95%] flex flex-col justify-center items-start gap-y-5 px-3 md:px-20 overflow-hidden"
        >
          <h1 className="text-lg md:text-4xl uppercase text-nowrap">{events[currentIndex].title}</h1>

          <p className="text-sm md:text-md">{events[currentIndex].description}</p>

          {events[currentIndex].registrationLink ? (
            <InteractiveHoverButton>
              <Link href={events[currentIndex].registrationLink} target="_blank">
                Register For Event
              </Link>
            </InteractiveHoverButton>
          ) : (
            <button className="flex items-center gap-2 text-md opacity-70 cursor-not-allowed">
              <FiLock size={16} />
              Registration Not Available
            </button>
          )}

          <span className="text-sm">Date : {events[currentIndex].date}</span>
        </motion.div>
      </AnimatePresence>
      <div className=" w-full h-1/2 md:w-[40%] md:h-[95%] flex justify-center items-center">
        <EventCards />
      </div>
    </section>
  );
};

export default Events;
