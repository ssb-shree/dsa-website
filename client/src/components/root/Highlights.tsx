import { Zalando_Sans_Expanded } from "next/font/google";

const buda = Zalando_Sans_Expanded({
  weight: "700",
  subsets: ["latin"],
});

const dummyEventLIst = ["ojus", "dataweb 2", "dataweb", "dataverse", "dataverse 2"];

const Highlights = () => {
  return (
    <section className=" h-[85vh] w-screen flex flex-col md:flex-row justify-center items-center md:px-10">

      <div className="h-full w-full md:w-[60%] flex flex-row gap-2 justify-center items-start p-3">
        <div className="h-[90%] w-[40%] flex justify-center items-center border">
          <img src="#" alt="img1" className="h-full w-full object-cover" />
        </div>
        <div className="h-full w-[60%] flex flex-col justify-start gap-2 items-start">
          <div className="h-[40%] w-full border flex justify-center items-center">
            <img src="#" alt="img2" className="h-full w-full object-cover" />
          </div>
          <div className="h-[45%] w-[70%] border flex justify-center items-center">
            <img src="#" alt="img3" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      <div className="h-full w-full md:w-[40%] flex flex-col md:flex-col-reverse">
        <h1 className={`${buda.className} h-[15%] md:h-[25%] w-full flex justify-center items-center text-[5vh] md:text-[10vh]`}>HIGHLIGHTS</h1>
        <div className="h-[75%] w-full flex flex-col flex-wrap gap-2 justify-start items-start p-5">
          {dummyEventLIst.map((name, index) => (
            <span key={name} className="capitalize hover:cursor-pointer md:text-xl">{`[ ${name} ]`}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
