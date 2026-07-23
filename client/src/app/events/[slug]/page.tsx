import LoadingPage from "@/app/loading";
import NotFound from "@/app/not-found";
import EventsDetails from "@/components/events/EventsDetails";

import axiosInstance from "@/services/axios";
import { EventType } from "../create/page";

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  try {
    const { slug } = await params;

    const { data }: { data: { event: EventType } } = await axiosInstance.get(`/events/${slug}`);

    return (
      <section className="relative min-h-[70vh] flex justify-center items-center">
        <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

        <EventsDetails event={data.event} />
      </section>
    );
  } catch (error: any) {
    return <NotFound />;
  }
};

export default EventDetailsPage;
