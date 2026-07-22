"use client";
import LenisProvider from "@/components/LenisProvider";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

const EventsPage = () => {
  const array = [1, 2, 3, 4, 5, 6];
  return (
    <LenisProvider>
      <section className="relative min-h-screen">
        <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pt-12">
          {array.map((_, i) => (
            <div key={i} className="aspect-[3/4] border border-white/10 flex items-center justify-center flex-col">
              <img src="#" alt={`${i}`} className="h-full w-full object-cover"/>
              <InteractiveHoverButton className="text-center w-full rounded-none bg-black">Register</InteractiveHoverButton>
            </div>
          ))}
        </div>
      </section>
    </LenisProvider>
  );
};

export default EventsPage;
