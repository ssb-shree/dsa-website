"use client";

import { Zalando_Sans_Expanded } from "next/font/google";
import { useState } from "react";
import { HighlightType } from "./Highlights";

const buda = Zalando_Sans_Expanded({
  weight: "700",
  subsets: ["latin"],
});

const HighlightComponent = ({ data }: { data: HighlightType[] }) => {
  const [activeHighlight, setActiveHighlight] = useState(data[0]);

  return (
    <section
      className={`h-[85vh] w-screen flex flex-col md:flex-row justify-center items-center md:px-10 ${buda.className}`}
    >
      <div className="h-full w-full md:w-[60%] flex flex-row gap-2 justify-center items-start p-3">
        <div className="h-[90%] w-[40%] flex justify-center items-center border">
          <img src={activeHighlight.img1Url || ""} alt={activeHighlight.title} className="h-full w-full object-cover" />
        </div>
        <div className="h-full w-[60%] flex flex-col justify-start gap-2 items-start">
          <div className="h-[40%] w-full border flex justify-center items-center">
            <img src={activeHighlight.img2Url || ""} alt={activeHighlight.title} className="h-full w-full object-cover" />
          </div>
          <div className="h-[45%] w-[70%] border flex justify-center items-center">
            <img src={activeHighlight.img3Url || ""} alt={activeHighlight.title} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="h-full w-full md:w-[40%] flex flex-col">
        <h1
          className={`${buda.className} h-[15%] md:h-[25%] w-full flex justify-center items-center text-[5vh] md:text-[10vh]`}
        >
          HIGHLIGHTS
        </h1>
        <div className="h-[75%] w-full flex flex-col flex-wrap gap-2 justify-start items-start p-5">
          {data.map((highlight, index) => (
            <span
              key={highlight._id}
              className="capitalize hover:cursor-pointer md:text-xl"
              onClick={() => setActiveHighlight(highlight)}
            >{`[ ${highlight.title} ]`}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightComponent;
