"use client";

import AchievementSection from "@/components/admin/AchievementSection";
import EventSection from "@/components/admin/EventSection";
import TeamSection from "@/components/admin/TeamSection";

const AdminPage = () => {
  return (
    <section className="w-screen min-h-screen bg-zinc-200 text-black p-8 flex flex-col items-center justify-center gap-12">
      {/* Team Section */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-lg p-6 shadow-md">
        <TeamSection />
      </div>

      {/* Event Section */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-lg p-6 shadow-md">
        <EventSection />
      </div>

      {/* Achievement Section */}
      <div className="w-full max-w-5xl mx-auto bg-white rounded-lg p-6 shadow-md">
        <AchievementSection />
      </div>
    </section>
  );
};

export default AdminPage;
