import NotFound from '@/app/not-found';
import UpdateEventDetails, { EventType } from '@/components/events/UpdateEventDetails';
import axiosInstance from '@/services/axios';
import React from 'react'

const UpdateEventPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  try {
    const { slug } = await params;

    const { data }: { data: { event: EventType } } = await axiosInstance.get(`/events/${slug}`);

    return (
      <section className="relative min-h-[70vh] flex justify-center items-center">
        <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

        <UpdateEventDetails event={data.event} />
      </section>
    );
  } catch (error: any) {
    return <NotFound />;
  }
};


export default UpdateEventPage