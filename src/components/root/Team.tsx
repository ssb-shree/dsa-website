import { memberData, MemberType } from "@/data/member";
import * as motion from "motion/react-client";
import { Marquee } from "../ui/marquee";

import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: "700",
  subsets: ["latin"],
});

const Team = () => {
  return (
    <section
      id="team"
      className=" relative w-screen h-screen bg-[linear-gradient(to_bottom,black_0%,black_80%,white_100%)] overflow-hidden flex flex-col justify-center items-center"
    >
      <Marquee reverse>
        <h1
          className={`font-mono text-[10vh] md:text-[15vh] font-bold text-transparent 
               [-webkit-text-stroke:2px_white] uppercase ${poppins.className}`}
        >
          <span className="hidden md:flex">Meet The Team</span>
          <span className="flex md:hidden">Team</span>
        </h1>
      </Marquee>

      <div className="h-[60vh] w-full flex flex-row justify-center items-center">
        <Marquee className="[--duration:20s] h-full w-full">
          {memberData.map((member, index) => (
            <MemberCard member={member} key={index} />
          ))}
        </Marquee>
      </div>
      <p className="absolute w-full max-w-[70%] font-medium capitalize bottom-4 left-1/2 -translate-x-1/2 text-xs md:text-lg text-black text-center md:x-4">
        Our members innovate, lead, collaborate, and inspire. They bring skills, energy, ideas, and dedication, making
        the committee unstoppable and thriving.
      </p>
    </section>
  );
};

export default Team;

const MemberCard = ({ member }: { member: MemberType }) => {
  return (
    <motion.div
      className="h-[90%] md:h-[90%] w-64 md:w-72 border flex flex-col justify-start items-center rounded-xl bg-zinc-200 text-zinc-800 overflow-hidden shadow-md"
      initial="hidden"
      whileHover="show"
      whileTap="show"
    >
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0 },
        }}
        className="h-[15%] w-full flex flex-col justify-center items-center uppercase text-xl md:text-3xl"
      >
        {member.role}
      </motion.span>
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 10 },
          show: { opacity: 1, y: 0 },
        }}
        className=" w-full flex flex-col justify-center items-center uppercase text-xl md:text-lg"
      >
        {member.name}
      </motion.span>

      <motion.div className="relative bg-red-500  h-[85%] w-full" initial="hidden" whileHover="show" whileTap="show">
        <img src={member.imgUrl} alt="member photo" className="absolute inset-0 h-full w-full object-contain" />

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-2 left-2 text-lg font-medium text-black z-10"
        >
          {member.message}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
