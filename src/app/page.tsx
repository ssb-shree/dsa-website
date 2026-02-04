import Hero from "@/components/root/Hero";
import Events from "@/components/root/Events";
import Team from "@/components/root/Team";
import LenisProvider from "@/components/LenisProvider";

const Rootpage = () => {
  return (
    <>
      <LenisProvider>
        <Hero />
        <Team />
        <Events />
      </LenisProvider>
    </>
  );
};

export default Rootpage;
