"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Autoplay, EffectCards, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

import { EventType } from "@/app/events/create/page";

import { cn } from "@/lib/utils";

const EventCards = ({ data }: { data: EventType[] }) => {
  const images = data.map((event) => ({
    src: event.banner,
    alt: event.title,
  }));

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden">
      <SwiperCards autoplay={true} className="" images={images} loop={true} />
    </div>
  );
};

export { EventCards };

import { useEventStore } from "@/store/events";

const SwiperCards = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 40,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_002 {
    padding-bottom: 50px !important;
  }
  `;

  const { setCurrentIndex } = useEventStore();
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("relative w-full", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay
            ? {
                delay: 3000,
                disableOnInteraction: false,
              }
            : false
        }
        effect="cards"
        grabCursor={true}
        loop={loop}
        pagination={false}
        navigation={false}
        className="h-90 w-65"
        modules={[EffectCards, Autoplay]}
        onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        cardsEffect={{
          slideShadows: false,
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="h-full rounded-xl overflow-hidden">
            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export { SwiperCards };
