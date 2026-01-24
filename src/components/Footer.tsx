import Link from "next/link";

import { Kelly_Slab } from "next/font/google";

const kelly = Kelly_Slab({
  weight: "400",
  subsets: ["latin"],
});

const Footer = () => {
  return (
    <>
      <footer className="w-screen h-[40vh] p-2 overflow-x-hidden flex flex-col md:flex-row gap-y-3 justify-around items-center">
        <div className="w-full md:w-[35%] flex flex-col justify-center items-start">
          <span className="text-8xl md:text-9xl text-red-600 tracking-widest">DSA</span>
          <p className="text-sm md:text-md">Representing the finest of Data Science department.</p>
        </div>
        <div className="w-full md:w-[40%] flex flex-row justify-around items-center">
          <div className="flex flex-col justify-center items-center gap-y-3">
            <span>list of links 1</span>
            {[1, 2, 3, 4].map((link, index) => (
              <Link href={"#"} key={index} className="underline text-md">
                link {link}
              </Link>
            ))}
          </div>
          <div className="flex flex-col justify-center items-center gap-y-3">
            <span>list of links 2</span>
            {[1, 2, 3, 4].map((link, index) => (
              <Link href={"#"} key={index} className="underline text-md">
                link {link}
              </Link>
            ))}
          </div>
        </div>
      </footer>
      <Link href={"#"} className="w-screen flex justify-center items-center mb-5">
        yours truly
      </Link>
    </>
  );
};

export default Footer;
