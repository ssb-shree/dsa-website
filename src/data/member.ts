export type MemberType = {
  name: string;
  year: string;
  role: string;
  message: string;
  imgUrl: string;
};

export const memberData: MemberType[] = [
  {
    name: "Darshan",
    year: "BE",
    role: "Secretary",
    message: "secures stuff @ APSIT, DS Department, something filler word, word2, word3",
    imgUrl: "/temp-sec1.png",
  },
  {
    name: "Varun",
    year: "TE",
    role: "Treasurer",
    message: "Treasuring stuff @ APSIT, DS Department, something filler word, word2, word3",
    imgUrl: "/temp-treasurer.png",
  },
  {
    name: "Srushti",
    year: "TE",
    role: "Secretary",
    message: "secures stuff @ APSIT, DS Department, something filler word, word2, word3",
    imgUrl: "/temp-sec2.png",
  },
];
