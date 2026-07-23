"use client";

import axiosInstance from "@/services/axios";
import { useEffect, useState } from "react";

import { useUserStore } from "@/store/user";
import { toasty } from "@/components/ToastProvider";

export type MemberType = { name: string; department: string; year: string; moodleID: string; division: string };

const ManageMembers = () => {
  const [inputData, setInputData] = useState("");

  const [displayMembers, setDisplayMembers] = useState<{_id : string, moodleID : string, name : string}[]>([]);

  const { user } = useUserStore();

  const fetchOrgDetails = async () => {
    try {
      const { data } = await axiosInstance.get("/organizations/dsa");
      setDisplayMembers(()=> data.organization.members.map((member : string)=> member))
    } catch (error: any) {
      toasty(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchOrgDetails();
  }, [user]);

  const addMember = async () => {
    if (!inputData) return;
    try {
      if (!displayMembers) throw new Error("org has 0 members, contact dev");
      const { data } = await axiosInstance.put(
        "/organizations/members",
        { moodleID: inputData, slug: "dsa" },
        { withCredentials: true },
      );

      setDisplayMembers([...displayMembers, data.user]);
      toasty(`${data.user.name} added`);
    } catch (error: any) {
      toasty(error.response.data.message || "failed to add id");
    } finally {
      setInputData("");
    }
  };

  const removeMember = async () => {
    if (!inputData) return;
    try {
      if (!displayMembers) throw new Error("org has 0 members, contact dev");

      const { data } = await axiosInstance.delete("/organizations/members", {
        data: {
          moodleID: inputData,
          slug : "dsa",
        },
        withCredentials: true,
      });

      setDisplayMembers(displayMembers.filter((val) => val !== data.user));
      toasty(`${data.user.name} removed`);
    } catch (error: any) {
      toasty(error.response.data.message || "failed to remove id");
    } finally {
      setInputData("");
    }
  };

  return (
    displayMembers && (
      <section className="w-[90vw] min-h-[80vh] mx-auto py-10 mt-10">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left */}
          <div className="w-full lg:w-[35%] flex flex-col gap-8">
            <div>
              <h1 className="text-5xl font-bold uppercase">Members</h1>

              <p className="mt-3 text-xs uppercase opacity-50">Manage organization members</p>
            </div>

            <div className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Moodle ID"
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                className="border-0 border-b bg-transparent outline-none"
              />

              <div className="flex gap-8">
                <button onClick={addMember} className="border-b hover:opacity-70 transition">
                  Add Member
                </button>

                <button onClick={removeMember} className="border-b text-red-400 hover:opacity-70 transition">
                  Remove Member
                </button>
              </div>

              <p className="text-xs opacity-50 leading-6">
                Members can edit the organization, create events and manage registrations.
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:flex-1 flex flex-col gap-8">
            <div>
              <h2 className="text-3xl font-semibold uppercase">Current Members</h2>

              <p className="mt-2 text-xs uppercase opacity-50">{displayMembers.length} Members</p>
            </div>

            {displayMembers.length ? (
              <div className="border-t border-white/10">
                {displayMembers.map((member) => (
                  <div key={member._id} className="flex justify-between items-center border-b border-white/10 py-5">
                    <span>{member.name}</span>
                    <span>{member.moodleID}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-white/10 pt-6">
                <span className="opacity-50">No members added yet.</span>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  );
};

export default ManageMembers;
