"use client";
import { EventType } from "@/app/events/create/page";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useUserStore } from "@/store/user";

import { toasty } from "../ToastProvider";
import axiosInstance from "@/services/axios";

const EventsDetails = ({ event }: { event: EventType }) => {
  const [loading, setLoading] = useState(false);

  const { user, isAuth } = useUserStore();

  const handleRegister = async () => {
    try {
      if (!user || !isAuth) {
        throw Error("log in to register");
      }

      const { data } = await axiosInstance.post(
        `/events/${event._id}/register`,
        { eventID: event._id, moodleID: user.moodleID },
        { withCredentials: true },
      );

      toasty("registered successfully");
    } catch (error: any) {
      toasty(error.response?.data.message || error.message);
    }
  };
  return (
    <div className="min-h-screen flex justify-center px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <section className="min-h-[80vh] w-[90vw]">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left */}
          {/* Banner */}
          <div className="w-full sm:w-[70%] md:w-[50%] lg:w-[30%] aspect-[3/4] border border-white/10 overflow-hidden">
            <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
          </div>

          {/* Right */}
          <div className="lg:w-1/2 flex flex-col gap-8">
            <div>
              <h1 className="text-5xl font-bold uppercase">{event.title}</h1>
            </div>

            <div className="flex flex-row gap-4">
              <div>
                <span className="text-xs uppercase opacity-50">Date</span>
                <p>{event.date}</p>
              </div>

              <div>
                <span className="text-xs uppercase opacity-50">Time</span>
                <p>{event.time}</p>
              </div>

              <div>
                <span className="text-xs uppercase opacity-50">Venue</span>
                <p>{event.venue}</p>
              </div>
            </div>

            <div>
              <h2 className="uppercase text-sm opacity-60 mb-2">About</h2>

              <p className="leading-7 whitespace-pre-line">{event.description}</p>
            </div>

            <div>
              <h2 className="uppercase text-sm opacity-60 mb-2">Tags</h2>

              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span key={tag} className="border px-3 py-1 text-sm uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {event.externalLinks.length > 0 && (
              <div>
                <h2 className="uppercase text-sm opacity-60 mb-2">Helpful Links</h2>

                <div className="flex flex-col gap-2">
                  {event.externalLinks.length > 0 &&
                    event.externalLinks.map((link) => (
                      <Link key={link.link} href={link.link} className="flex items-center gap-2 border-b w-fit pb-1">
                        <Link2 />
                        {link.name}
                      </Link>
                    ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-6">
              <button
                onClick={handleRegister}
                className="border-b text-xl uppercase tracking-wide hover:cursor-pointer"
              >
                {user && event.registerdStudentsID.includes(user.moodleID) ? "Already registered" : "register"}
              </button>
            </div>

          </div>
        </div>
            {user?.role === "ORGANIZOR" && (
              <div className="mt-20 w- pt-8 border-t border-white/10">
                <h2 className="text-sm uppercase tracking-widest opacity-60 mb-8">Admin Actions</h2>

                <div className="flex flex-wrap gap-x-10 gap-y-6">
                  <Link href={`${event.slug}/update`} className="border-b hover:opacity-70 transition text-red-400">
                    Update Event Details
                  </Link>
                </div>
              </div>
            )}
      </section>
    </div>
  );
};

export default EventsDetails;
