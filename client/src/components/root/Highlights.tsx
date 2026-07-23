import { Zalando_Sans_Expanded } from "next/font/google";
import axiosInstance from "@/services/axios";
import HighlightComponent from "./HighlightComponent";

export type HighlightType = {
  _id: string;
  title: string;
  img1Url: string;
  img2Url: string;
  img3Url: string;
};

const Highlights = async () => {
  const { data }: { data: { highlights: HighlightType[] } } = await axiosInstance.get("/highlights");

  return <HighlightComponent data={data.highlights} />;
};

export default Highlights;
