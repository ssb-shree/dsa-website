"use client";

import { InteractiveHoverButton } from "../ui/interactive-hover-button";

const CheckEventsButton = () => {
  return (
    <InteractiveHoverButton
      className="bg-white text-black rounded-full md:px-5 md:py-2 text-nowrap"
      onClick={() => window?.lenis?.scrollTo("#events")}
    >
      Check Our Events
    </InteractiveHoverButton>
  );
};

export default CheckEventsButton;
