"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useUserStore } from "@/store/user";
import { toasty } from "@/components/ToastProvider";
import axiosInstance from "@/services/axios";
import LoadingPage from "@/app/loading";
import Link from "next/link";

const ProfilePage = () => {
  const { user } = useUserStore();
  const router = useRouter();

  if (!user) {
    return <LoadingPage />;
  }

  return (
    <section className="relative min-h-screen w-screen overflow-x-hidden px-6 py-16">
      <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <div className="border-b pb-8">
        <h1 className="text-3xl font-black uppercase">{user.name}</h1>

        <p className="text-lg opacity-60">{user.moodleID}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 py-10">
        <div className="space-y-3">
          <p className="text-xs uppercase opacity-50">Department</p>
          <h2 className="text-2xl">{user.department}</h2>

          <p className="text-xs uppercase opacity-50 pt-4">Year</p>
          <h2 className="text-2xl">{user.year}</h2>

          <p className="text-xs uppercase opacity-50 pt-4">Division</p>
          <h2 className="text-2xl">{user.division}</h2>
        </div>

        <div className="flex flex-col gap5">
          <div>
          <p className="text-xs uppercase opacity-50">Joined</p>
          <h2 className="text-xl md:text-4xl mt-2">{new Date(user.createdAt).toLocaleString().split(",")[0]}</h2>
          </div>
          <div className="hidden md:flex flex-col mt-5">
          <p className="text-xs uppercase opacity-50">Last Updated</p>
          <h2 className="text-xl md:text-4xl mt-2">{new Date(user.createdAt).toLocaleString().split(",")[0]}</h2>
          </div>
        </div>

        <div className="md:text-right">
          <Link href="#" className="underline underline-offset-4">
            Update Details
          </Link>
        </div>
      </div>

      <div className="border-t pt-10">
        <h2 className="text-3xl mb-8">Events ({user.registeredEvents.length})</h2>

        <div className="space-y-4">
          {user.registeredEvents.length === 0 ? (
            <p className="opacity-50">No registrations.</p>
          ) : (
            user.registeredEvents.map((event, i) => (
              <div key={event._id} className="flex gap-6 border-b pb-3">
                <span className="opacity-40">{String(i + 1).padStart(2, "0")}</span>

                <span className="text-xl">{event.title}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
