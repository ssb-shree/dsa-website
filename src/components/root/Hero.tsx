"use client";

import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import { Ripple } from "../ui/ripple";

import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="h-screen w-screen relative overflow-hidden text-white">
      {/* Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 4 }}
          className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
        >
          {/* Ripple behind */}
          <Ripple className="absolute inset-0 z-0" numCircles={8} />

          {/* Card/image above Ripple */}
          <CardContainer className="relative z-10 w-full h-full flex justify-center items-center">
            <CardBody className="relative z-10 w-full h-full flex justify-center items-center">
              <CardItem translateZ="100" className="hover:cursor-pointer">
                <img src="/dsa.png" className="h-32 w-64 object-contain rounded-xl" alt="dsa emblem" />
              </CardItem>
            </CardBody>
          </CardContainer>
        </motion.div>
      </div>

      {/* Top text box */}
      <div className=" absolute z-20 top-[20%] left-[30%] -translate-x-1/2 md:top-20 md:left-[10%] md:translate-x-0 px-4 py-3 md:h-[80%] flex flex-col justify-around items-start">
        <div className="flex flex-col gap-y-1">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 2 }}
            className="text-nowrap uppercase text-xl md:text-4xl"
          >
            We Turn
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-nowrap text-xl md:text-4xl"
          >
            Intrest Into Skills
          </motion.span>
        </div>

        <div className="hidden md:flex flex-col gap-y-1 justify-around items-start">
          <div className="flex flex-col justify-center items-start">
            {["Setting", "The standard", "On campus"].map((text, idx) => (
              <motion.span
                key={text}
                className="text-nowrap text-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2 }}
              >
                {text}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="bg-white h-[1px] w-[30px] mt-5"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 2 }}
            style={{ transformOrigin: "left" }}
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg text-xs mt-5 flex flex-col"
          >
            <span>We are a student-led committee from the Data Science department.</span>
            <span>Bringing together technology, creativity, and community.</span>
            <span>
              From hands-on workshops to social and non-technical events, we create spaces to learn, connect, and grow.
              This is where curiosity turns into collaboration.
            </span>
          </motion.p>
        </div>
      </div>

      {/* Bottom text box */}
      <div className="absolute z-20 bottom-20 left-1/2 -translate-x-1/2 md:bottom-30 md:right-[20%] md:left-auto md:translate-x-0 text-sm text-right  md:h-[80%] flex flex-col justify-end items-start">
        <div className="flex flex-col justify-center items-start">
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 3 }}
            className="text-nowrap uppercase text-2xl md:text-4xl"
          >
            We Are
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-nowrap text-2xl md:text-4xl"
          >
            Redefining
          </motion.span>
        </div>

        <motion.div
          className="bg-white h-[1px] w-[60%] md:mt-5"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 3 }}
          style={{ transformOrigin: "left" }}
        />
      </div>

      {/* Bottom Center CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3 }}
        className="absolute z-20 mt-5 md:mt-0 bottom-6 left-1/2 -translate-x-1/2 text-sm text-center flex flex-col justify-center items-center"
      >
        <InteractiveHoverButton className="bg-white text-black rounded-full md:px-5 md:py-2 text-nowrap">
          Check Our Events
        </InteractiveHoverButton>
      </motion.div>
    </section>
  );
};

export default Hero;
