"use client";

import { useEffect, useState } from "react";
import { MemberType } from "@/data/member";
import TeamForm from "./forms/TeamForm";
import axiosInstance from "@/services/axios";
import { FaTrashCan } from "react-icons/fa6";

const TeamSection = () => {
  const [open, setOpen] = useState(false);
  const [teamData, setTeamData] = useState<MemberType[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/teams", { withCredentials: true });
        setTeamData(data.members);
      } catch (error: any) {
        console.log(error.message || error);
      }
    };
    getData();
  }, []);

  // Delete member handler
  const handleDelete = async (id : string | undefined) => {
    try {
      await axiosInstance.delete(`/teams/${id}`, { withCredentials: true });
      // Optimistically update the UI
      setTeamData((prev) => prev.filter((member) => member._id !== id));
    } catch (error: any) {
      console.log(error.message || error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Team</h2>
        <button onClick={() => setOpen(true)} className="rounded-md bg-black px-4 py-2 text-white">
          Add Member
        </button>
      </div>

      {teamData.length === 0 ? (
        <p className="text-sm text-gray-500">No team members. Add one to get started.</p>
      ) : (
        teamData.map((member) => <MemberCard key={member._id} member={member} onDelete={handleDelete} />)
      )}

      {open && <TeamForm onClose={() => setOpen(false)} />}
    </div>
  );
};

export default TeamSection;

const MemberCard = ({ member, onDelete }: { member: MemberType; onDelete: (id: string) => void }) => {
  return (
    <div className="flex items-center justify-between border p-2 rounded-md">
      <span>{member.name}</span>
      <button onClick={() => onDelete(member._id)} className="text-red-500 hover:text-red-700 font-bold">
        X
      </button>
    </div>
  );
};
