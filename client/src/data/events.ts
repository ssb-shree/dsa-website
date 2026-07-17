export type EventType = {
  title: string;
  description: string;
  registrationLink: string | null;
  imgUrl: string;
  date: string;
};

export const events: EventType[] = [
  {
    title: "mini project roadmap",
    description:
      "Stuck on what to do, how to start, or what exactly to submit for your mini project? 🤯 Relax, we've planned something just for you. Join our Mini Project Roadmap Session, where we break everything down, from documentation tips to technical implementation, all in one smooth session. No stress, no confusion, just clear guidance. ✨ 💡 Learn what really matters 📘 Understand the process end to end 🎯 Get clarity before deadlines hit",
    registrationLink: "https://apsit-events.vercel.app/event/6963a7c8539763c427bee240",
    imgUrl: "bannerURL",
    date: "12/12/25",
  },
];
