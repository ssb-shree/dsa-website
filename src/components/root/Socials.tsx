"use client";
import { IconCloud } from "../ui/icon-cloud";

import Link from "next/link";

import { useSocialStore } from "@/store/social";

const slugs = ["instagram", "reddit", "github", "facebook", "instagram", "reddit", "github", "facebook"];

const Socials = () => {
  const { selectedSocial } = useSocialStore();
  const images = slugs.map((slug) => `https://cdn.simpleicons.org/${slug}/${slug}`);
  return (
    <section className="w-screen h-[50vh] overflow-hidden bg-zinc-50 text-black flex flex-col md:flex-row justify-around items-center">
      {/* Icon Cloud */}
      <div className="border border-black flex items-center justify-center w-full md:w-[40%] h-1/2 md:h-[80%]">
        <IconCloud images={images} slugs={slugs} />
      </div>

      {/* Text / Content */}
      <div className="border border-black flex items-center justify-center w-full md:w-[50%] h-1/2 md:h-[80%]">
        <SocialCard social={selectedSocial} />
      </div>
    </section>
  );
};

export default Socials;

const SocialMap: Record<string, SocialType> = {
  instagram: {
    name: "Instagram",
    description:
      "Catch all the highlights from our workshops, hackathons, and student projects through photos and stories.",
    link: "https://instagram.com",
  },
  reddit: {
    name: "Reddit",
    description:
      "Join our discussions, share ideas, and get answers to questions related to coding, data science, and projects.",
    link: "https://reddit.com",
  },
  github: {
    name: "GitHub",
    description: "Explore our open-source projects, coding challenges, and collaborative student work repositories.",
    link: "https://github.com",
  },
  facebook: {
    name: "Facebook",
    description: "Stay updated on upcoming events, webinars, and committee announcements from our official page.",
    link: "https://facebook.com",
  },
};

const SocialCard = ({ social }: { social: string | null }) => {
  if (!social) {
    return (
      <div className="space-y-3 text-center p-4 rounded-lg">
        <h1 className="text-2xl font-semibold tracking-tight">Connect with Us!</h1>
        <h1 className="text-2xl font-semibold tracking-tight">Click an icon to visit our account</h1>
        <p className="text-base leading-relaxed">
          Follow our social media platforms to stay updated on workshops, events, projects, and coding activities
          organized by our committee.
        </p>
      </div>
    );
  }

  const { name, description, link } = SocialMap[social];

  return (
    <div className="space-y-5 p-6 rounded-lg max-w-md flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-nowrap">{`Catch us on ${name}!`}</h1>
      <p className="text-lg md:text-xl leading-relaxed">{description}</p>
      <Link
        href={link}
        target="_blank"
        className="inline-block text-lg font-medium underline underline-offset-2 transition-transform duration-200 ease-out hover:scale-105 hover:underline"
      >
        Check it out
      </Link>
    </div>
  );
};
