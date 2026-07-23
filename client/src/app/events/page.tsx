"use client";
import LenisProvider from "@/components/LenisProvider";
import { toasty } from "@/components/ToastProvider";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

import axiosInstance from "@/services/axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { EventType } from "./create/page";

const EventsPage = () => {
  const [eventData, setEventData] = useState<EventType[]>([]);

  const fetchEvents = async () => {
    try {
      const {data} = await axiosInstance.get("/events");
      setEventData(data.events)
    } catch (error: any) {
      toasty(error.response.data.message || error.message);
    }
  };
  useEffect(()=>{
    fetchEvents()
  }, []);

  return (
    <LenisProvider>
      <section className="relative min-h-screen">
        <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pt-12">
          {eventData.map((event, i) => (
            <div key={i} className="aspect-[3/4] border border-white/10 flex items-center justify-center flex-col">
              <Link className="h-full w-full" href={`/events/${event.title}`}>
              <img src={event.banner} alt={`${event.title}`} className="h-full w-full object-cover" />
              </Link>
              <InteractiveHoverButton className="text-center w-full rounded-none bg-black">
                Register
              </InteractiveHoverButton>
            </div>
          ))}
        </div>
      </section>
    </LenisProvider>
  );
};

export default EventsPage;
