import { Desktop } from "@/components/achievements/Desktop";
import { Mobile } from "@/components/achievements/Mobile";

import Card from "@/components/achievements/Card";
import axiosInstance from "@/services/axios";
import LoadingPage from "../loading";

const AchievementsPage = async () => {
  const { data } = await axiosInstance.get(`/achievements`);

  console.log(data)

  if (data.achievements.length === 0) {
    return <LoadingPage />;
  }

  const content = data.achievements.map((item: any) => ({
    name: item.title,
    description: item.description,
    content: <Card imgUrl={item.imgUrl} alt={item.title} />,
  }));

  return (
    <section className="h-screen w-screen bg-zinc-950">
      <div className="hidden md:flex w-full h-full justify-center items-center">
        <Desktop content={content} />
      </div>
      <div className="flex md:hidden w-full h-full justify-center items-center">
        <Mobile content={content} />
      </div>
    </section>
  );
};

export default AchievementsPage;
