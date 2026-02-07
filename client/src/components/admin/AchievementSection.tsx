"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";

export type AchievementType = {
  id?: string;
  title: string;
  description: string;
  date: string;
  imgUrl: string;
};

import AchievementForm from "./forms/AchievementForm";

const AchievementSection = () => {
  const [achievementData, setAchievementData] = useState<AchievementType[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/achievements", {
          withCredentials: true,
        });

        setAchievementData(data.achievements);
      } catch (error: any) {
        console.log(error.message || error);
      }
    };

    getData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Achievements</h2>

        <button onClick={() => setOpen(true)} className="rounded-md bg-black px-4 py-2 text-white">
          Add Achievement
        </button>
      </div>

      {achievementData.length === 0 ? (
        <p className="text-sm text-gray-500">No achievements yet.</p>
      ) : (
        achievementData.map((achievement) => <AchievementCard key={achievement.id} data={achievement} />)
      )}

      {open && <AchievementForm onClose={() => setOpen(false)} />}
    </div>
  );
};

export default AchievementSection;

const AchievementCard = ({ data }: { data: AchievementType }) => {
  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold">{data.title}</h3>
      <p className="text-sm">{data.description}</p>
      <p className="text-xs text-gray-500">{data.date}</p>
      {data.imgUrl && <img src={data.imgUrl} alt={data.title} className="mt-2 w-full max-h-48 object-cover" />}
    </div>
  );
};
