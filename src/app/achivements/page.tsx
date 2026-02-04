import { Desktop } from "@/components/achivements/Desktop";
import { Mobile } from "@/components/achivements/Mobile";

import Card from "@/components/achivements/Card";

const content = [
  {
    name: "Top Academic Performance",
    description:
      "The Data Science department has consistently delivered strong academic results, with students excelling in core areas such as Machine Learning, Statistics, and Data Engineering.",
    content: <Card imgUrl="/a-temp.jpg" alt="Academic excellence" />,
  },
  {
    name: "Industry-Oriented Projects",
    description:
      "Students regularly work on real-world, industry-focused projects involving predictive analytics, dashboards, and intelligent systems, preparing them for practical challenges.",
    content: (
      <Card
        imgUrl="/b-temp.png"
        alt="Industry projects"
      />
    ),
  },
  {
    name: "Hackathons & Competitions",
    description:
      "The department encourages participation in hackathons and data science competitions, where students showcase innovative thinking, teamwork, and problem-solving skills.",
    content: (
      <Card
        imgUrl="https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2021/04/07ac48b638be5b4974972c293bdd23e4.jpghttps://www.vershinin.biz/landscape-large-format-photography/"
        alt="Hackathons and competitions"
      />
    ),
  },
];

const AchivementsPage = () => {
  return (
    <section className="h-screen w-screen bg-zinc-950">
      <div key="pc" className="hidden md:flex w-full h-full justify-center items-center">
        <Desktop content={content} />
      </div>
      <div key="mobile" className="flex md:hidden w-full h-full  justify-center items-center">
        <Mobile content={content} />
      </div>
    </section>
  );
};

export default AchivementsPage;
