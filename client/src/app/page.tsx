import Hero from "@/components/root/Hero";
import Events from "@/components/root/Events";
import BoreTeam from "@/components/root/BoreTeam";
import LenisProvider from "@/components/LenisProvider";

const Rootpage = () => {
  return (
    <>
      <LenisProvider>
        <Hero />
        <BoreTeam />
        <Events />
      </LenisProvider>
    </>
  );
};

export default Rootpage;
