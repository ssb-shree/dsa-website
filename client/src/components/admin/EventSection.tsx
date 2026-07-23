"use client";

import { useEffect, useState } from "react";
import { EventType } from "@/app/events/create/page";
import axiosInstance from "@/services/axios";
import EventForm from "./forms/EventForm";

const EventSection = () => {
  const [open, setOpen] = useState(false);
  const [eventData, setEventData] = useState<EventType[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get("/events");

        setEventData(data.events);
      } catch (error: any) {
        console.log(error.message || error);
      }
    };

    getData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <h2 className="text-xl font-semibold">Events</h2>
        <button onClick={() => setOpen(true)} className="rounded-md bg-black px-4 py-2 text-white">
          Add Event
        </button>
      </div>

      {/* Empty state */}
      {eventData.length === 0 && <p className="text-sm text-gray-500">No events yet.</p>}

      {/* Event list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {eventData.map((event) => (
          <EventCard key={event.title} data={event} />
        ))}
      </div>

      {/* Modal Form */}
      {open && <EventForm onClose={() => setOpen(false)} />}
    </div>
  );
};

export default EventSection;

const EventCard = ({ data }: { data: EventType }) => {
  return (
    <div className="border rounded p-4 shadow-sm flex flex-col">
      {/* Title */}
      <h3 className="font-semibold text-lg">{data.title}</h3>

      {/* Date */}
      <p className="text-xs text-gray-500 mt-1">{data.date}</p>

      {/* Optional image */}
      {data.banner && <img src={data.banner} alt={data.title} className="mt-2 w-full max-h-48 object-cover rounded" />}
    </div>
  );
};
