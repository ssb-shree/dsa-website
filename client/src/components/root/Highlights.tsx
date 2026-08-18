import { Zalando_Sans_Expanded } from "next/font/google";
import axiosInstance from "@/services/axios";
import HighlightComponent from "./HighlightComponent";
import LoadingPage from "@/app/loading";

export type HighlightType = {
  _id: string;
  title: string;
  img1Url: string;
  img2Url: string;
  img3Url: string;
};

const Highlights = async () => {
  try {
    const { data }: { data: { highlights: HighlightType[] } } = await axiosInstance.get("/highlights");
    return <HighlightComponent data={data.highlights} />;
  } catch (error) {
    return <LoadingPage />;
  }
};

export default Highlights;
