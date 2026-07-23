"use client";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import axiosInstance from "@/services/axios";
import { toasty } from "@/components/ToastProvider";

import { useUserStore } from "@/store/user";
import NotFound from "@/app/not-found";
import { TrashIcon } from "lucide-react";
import Link from "next/link";

import download from "downloadjs"

export type EventType = {
  _id: string;
  title: string;
  date: string; // change to Date
  day: string; // change to Date

  time: string;
  banner: string;
  venue: string;
  speakers: string[];
  description: string;
  tags: string[];
  externalLinks: { name: string; link: string }[];
  slug: string;

  // filters
  allowedYears: string[];
  allowedDepartments: string[];
  allowedDivisions: string[];

  // org info
  organizationID: string;

  // data handling of students
  registerdStudentsID: string[];

  //bools to hide/show certain action for the user
  canRegister: boolean;
  isPublic: boolean;
};

const UpdateEventDetails = ({ event }: { event: EventType }) => {
  const [editState, setEditState] = useState<EventType>({ ...event });

  const [disable, setDisable] = useState(false);

  const [isAdmin, setAdmin] = useState(false);

  const [commaInputs, setCommaInputs] = useState<{ tags: string; speakers: string }>({
    tags: event.tags.join(","),
    speakers: event.speakers.join(","),
  });

  const { user } = useUserStore();

  useEffect(() => {
    if (!user || user.role === "USER") {
      return setAdmin(false);
    }

    setAdmin(true);
  }, [user]);

  useEffect(() => {
    console.log({ editState, commaInputs });
  }, [editState, commaInputs]);

  const router = useRouter();

  const allowedYears = ["FE", "SE", "TE", "BE"];
  const allowedDepartments = ["COMP", "DS", "AIML", "CIVIL", "MECH"];
  const allowedDivisions = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const handleAllowedYears = (value: string, checked: boolean) => {
    if (!editState) return;
    if (checked) {
      setEditState(() => ({ ...editState, allowedYears: [...editState.allowedYears, value] }));
    } else {
      setEditState(() => ({ ...editState, allowedYears: editState.allowedYears.filter((v) => v !== value) }));
    }
  };

  const handleAllowedDepartments = (value: string, checked: boolean) => {
    if (!editState) return;
    if (checked) {
      setEditState(() => ({ ...editState, allowedDepartments: [...editState.allowedDepartments, value] }));
    } else {
      setEditState(() => ({
        ...editState,
        allowedDepartments: editState.allowedDepartments.filter((v) => v !== value),
      }));
    }
  };

  const handleAllowedDivisions = (value: string, checked: boolean) => {
    if (!editState) return;
    if (checked) {
      setEditState(() => ({ ...editState, allowedDivisions: [...editState.allowedDivisions, value] }));
    } else {
      setEditState(() => ({ ...editState, allowedDivisions: editState.allowedDivisions.filter((v) => v !== value) }));
    }
  };

  const updateEvents = async () => {
    setDisable(true);
    try {
      // submit the data
      const { data }: { data: { event: EventType } } = await axiosInstance.patch(
        `/events/${event._id}`,
        {
          ...editState,
          organizationID: user!.organizationID[0]._id,
          tags: commaInputs.tags.split(","),
          speakers: commaInputs.speakers.split(","),
        },
        {
          withCredentials: true,
        },
      );

      toasty("event updated successfully");

      router.push(`/events?search=${data.event.slug}`);
    } catch (error: any) {
      console.log(error.message || error);
      if (error.message.response.data.errors.length > 0) {
        return error.response.data.errors.map((err: { path: string; message: string }) => toasty(err.message));
      }

      toasty(error.response.data.message);
      return;
    } finally {
      setDisable(false);
    }
  };




  const downloadAttendanceList = async () => {
    try {
      if (!editState?._id) throw new Error("try again, failed to get event id");
      const res = await axiosInstance.get(`/events/${editState._id}/attended`, {
        withCredentials: true,
        responseType: "blob",
      });

      download(res.data, "attendance-list.csv", "text/csv");
    } catch (error: any) {
      toasty(error.response.data.message || "failed to get your list");
    }
  };

  const downloadRegistrationList = async () => {
    try {
      if (!editState?._id) throw new Error("try again, failed to get event id");
      const res = await axiosInstance.get(`/events/${editState._id}/register`, {
        withCredentials: true,
        responseType: "blob",
      });

      download(res.data, "registration-list.csv", "text/csv");
    } catch (error: any) {
      toasty(error.response.data.message || "failed to get your list");
    }
  };

  const registrationToggle = async () => {
    try {
      if (!user) {
        throw new Error("user is not logged in");
      }

      const { data }: { data: { event: EventType } } = await axiosInstance.patch(
        `/events/${event._id}`,
        {
          canRegister: !editState.canRegister,
          organizationID: user.organizationID[0]._id,
        },
        {
          withCredentials: true,
        },
      );

      toasty("event updated successfully");

      setEditState((p) => ({ ...p, canRegister: data.event.canRegister }));
    } catch (error: any) {
      toasty(error.message);
    }
  };

  if (!isAdmin) {
    return <NotFound />;
  }

  return (
    <section className="relative min-h-screen w-screen flex justify-center px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex flex-col gap-12"
      >
        {/* Heading */}
        <div>
          <h1 className="text-5xl font-bold uppercase">Update an Event</h1>
        </div>

        {/* Title */}
        <motion.div variants={{}} initial="hidden" animate="visible">
          <input
            name="title"
            placeholder="Event Title"
            value={editState.title}
            onChange={(e) =>
              setEditState({
                ...editState,
                title: e.target.value,
              })
            }
            className="w-full bg-transparent border-0 border-b outline-none text-5xl font-bold"
          />

          <input
            name="banner"
            placeholder="Banner Link"
            value={editState.banner}
            onChange={(e) =>
              setEditState({
                ...editState,
                banner: e.target.value,
              })
            }
            className="w-full mt-4 bg-transparent border-0 border-b outline-none text-5xl font-bold"
          />
        </motion.div>

        {/* Meta */}
        <div className="flex flex-wrap gap-8">
          <input
            className="flex-1 min-w-[150px] border-0 border-b bg-transparent outline-none"
            placeholder="Date"
            name="date"
            value={editState.date}
            onChange={(e) =>
              setEditState({
                ...editState,
                date: e.target.value,
              })
            }
          />

          <input
            className="w-40 border-0 border-b bg-transparent outline-none"
            placeholder="Time"
            name="time"
            value={editState.time}
            onChange={(e) =>
              setEditState({
                ...editState,
                time: e.target.value,
              })
            }
          />

          <input
            className="flex-1 min-w-[180px] border-0 border-b bg-transparent outline-none"
            placeholder="Venue"
            name="venue"
            value={editState.venue}
            onChange={(e) =>
              setEditState({
                ...editState,
                venue: e.target.value,
              })
            }
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-3">
          <p className="uppercase text-sm opacity-60">Description</p>

          <textarea
            name="description"
            value={editState.description}
            placeholder="Tell people about your event..."
            onChange={(e) =>
              setEditState({
                ...editState,
                description: e.target.value,
              })
            }
            className="w-full min-h-20 resize-none bg-transparent border-0 border-b outline-none"
          />
        </div>

        {/* Tags & Speakers */}
        <div className="flex flex-wrap gap-10">
          <div className="flex-1 min-w-[250px]">
            <p className="uppercase text-sm opacity-60 mb-3">Tags</p>

            <input
              name="tags"
              value={commaInputs.tags}
              onChange={(e) =>
                setCommaInputs({
                  ...commaInputs,
                  tags: e.target.value,
                })
              }
              placeholder="ai, workshop, backend"
              className="w-full border-0 border-b bg-transparent outline-none"
            />
          </div>

          <div className="flex-1 min-w-[250px]">
            <p className="uppercase text-sm opacity-60 mb-3">Speakers</p>

            <input
              name="speakers"
              value={commaInputs.speakers}
              onChange={(e) =>
                setCommaInputs({
                  ...commaInputs,
                  speakers: e.target.value,
                })
              }
              placeholder="John, Jane..."
              className="w-full border-0 border-b bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Departments */}

        <div className="flex flex-col gap-4">
          <h2 className="uppercase text-sm opacity-60">Allowed Departments</h2>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {allowedDepartments.map((dept) => (
              <label key={dept} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editState.allowedDepartments.includes(dept)}
                  onChange={(e) => handleAllowedDepartments(dept, e.target.checked)}
                />

                {dept}
              </label>
            ))}
          </div>
        </div>

        {/* Years */}

        <div className="flex flex-col gap-4">
          <h2 className="uppercase text-sm opacity-60">Allowed Years</h2>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {allowedYears.map((year) => (
              <label key={year} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editState.allowedYears.includes(year)}
                  onChange={(e) => handleAllowedYears(year, e.target.checked)}
                />

                {year}
              </label>
            ))}
          </div>
        </div>

        {/* Divisions */}

        <div className="flex flex-col gap-4">
          <h2 className="uppercase text-sm opacity-60">Allowed Divisions</h2>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {allowedDivisions.map((div) => (
              <label key={div} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editState.allowedDivisions.includes(div)}
                  onChange={(e) => handleAllowedDivisions(div, e.target.checked)}
                />

                {div}
              </label>
            ))}
          </div>
        </div>

        {/* External Links */}
        <div className="flex flex-col gap-6">
          {editState.externalLinks.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 md:items-center">
              <input
                type="text"
                placeholder="Name"
                value={item.name}
                onChange={(e) => {
                  const updated = [...editState.externalLinks];
                  updated[index] = { ...updated[index], name: e.target.value };
                  setEditState({ ...editState, externalLinks: updated });
                }}
                className="w-full md:flex-1 border-0 border-b bg-transparent outline-none"
              />

              <div className="flex items-center gap-3 w-full md:flex-[2]">
                <input
                  type="text"
                  placeholder="https://..."
                  value={item.link}
                  onChange={(e) => {
                    const updated = [...editState.externalLinks];
                    updated[index] = { ...updated[index], link: e.target.value };
                    setEditState({ ...editState, externalLinks: updated });
                  }}
                  className="flex-1 border-0 border-b bg-transparent outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setEditState({
                      ...editState,
                      externalLinks: editState.externalLinks.filter((_, i) => i !== index),
                    })
                  }
                  className="opacity-60 hover:opacity-100 transition shrink-0"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}

        <div className="flex justify-end pt-6">
          <motion.button
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.97 }}
            disabled={disable}
            onClick={updateEvents}
            className="border-b text-xl uppercase tracking-wide"
          >
            Update →
          </motion.button>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10">
          <h2 className="text-sm uppercase tracking-widest opacity-60 mb-8">Event Actions</h2>

          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <button onClick={downloadRegistrationList} className="border-b hover:opacity-70 transition">
              Download Registration List
            </button>

            <button onClick={downloadAttendanceList} className="border-b hover:opacity-70 transition">
              Download Attendance List
            </button>

            <Link href="attendance" className="border-b hover:opacity-70 transition">
              Mark Attendance
            </Link>

            <Link href="feedback" className="border-b hover:opacity-70 transition">
              Start Feedback
            </Link>

            <button onClick={registrationToggle} className="border-b text-red-400 hover:opacity-70 transition">
              {editState.canRegister ? "Close" : "Open"} Registration
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default UpdateEventDetails;
