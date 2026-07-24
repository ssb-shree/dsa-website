"use client";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import axiosInstance from "@/services/axios";
import { toasty } from "@/components/ToastProvider";

import { useUserStore } from "@/store/user";
import LoadingPage from "@/app/loading";
import NotFound from "@/app/not-found";
import { TrashIcon } from "lucide-react";

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

export const initialEventState: EventType = {
  _id: "",
  title: "",
  slug: "",
  date: "",
  day: "",
  time: "",
  banner: "",
  venue: "",
  speakers: [],
  description: "",
  tags: ["example1", "example2"],
  externalLinks: [],

  organizationID: "",

  canRegister: false,
  isPublic: false,

  registerdStudentsID: [],

  allowedYears: [],
  allowedDepartments: [],
  allowedDivisions: [],
};

const CreateEvent = () => {
  const [editState, setEditState] = useState<EventType>(initialEventState);

  const [disable, setDisable] = useState(false);

  const [isAdmin, setAdmin] = useState(false);

  const [commaInputs, setCommaInputs] = useState<{ tags: string; speakers: string }>({ tags: "", speakers: "" });

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

  const hostEvent = async () => {
    setDisable(true);
    try {
      // submit the data
      const { data }: { data: { event: EventType } } = await axiosInstance.post(
        `/events`,
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

      toasty("event created successfully");

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

  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axiosInstance.post("/image-to-url", formData);

      return data.url;
    } finally {
      setUploading(false);
    }
  };

  if (!isAdmin) {
    return <NotFound />;
  }

  return (
    <section className="relative min-h-screen flex justify-center px-6 py-20">
      <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl flex flex-col gap-12"
      >
        {/* Heading */}
        <div>
          <h1 className="text-5xl font-bold uppercase">Host an Event</h1>
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
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                const url = await uploadImage(file);

                setEditState((prev) => ({
                  ...prev,
                  banner: url,
                }));

                toasty("Banner uploaded");
              } catch (error: any) {
                toasty(error.response?.data?.message || "Upload failed");
              }
            }}
            className="w-full mt-4 file:mr-4 file:border-0 file:bg-transparent"
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
        <div className="flex flex-col gap-4">
          <h2 className="uppercase text-sm opacity-60">Helpful Links</h2>

          <div className="flex flex-col gap-6">
            {editState.externalLinks.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => {
                    const updated = [...editState.externalLinks];
                    updated[index] = { ...updated[index], name: e.target.value };
                    setEditState({ ...editState, externalLinks: updated });
                  }}
                  className="flex-1 border-0 border-b bg-transparent outline-none"
                />

                <input
                  type="text"
                  placeholder="https://..."
                  value={item.link}
                  onChange={(e) => {
                    const updated = [...editState.externalLinks];
                    updated[index] = { ...updated[index], link: e.target.value };
                    setEditState({ ...editState, externalLinks: updated });
                  }}
                  className="flex-[2] border-0 border-b bg-transparent outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setEditState({
                      ...editState,
                      externalLinks: editState.externalLinks.filter((_, i) => i !== index),
                    })
                  }
                  className="opacity-60 hover:opacity-100 transition"
                >
                  <TrashIcon size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-start pt-2">
            <button
              type="button"
              onClick={() =>
                setEditState({
                  ...editState,
                  externalLinks: [...editState.externalLinks, { name: "", link: "" }],
                })
              }
              className="border-b uppercase tracking-wide"
            >
              + Add Link
            </button>
          </div>
        </div>

        {/* Submit */}

        <div className="flex justify-end pt-6">
          <motion.button
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.97 }}
            disabled={disable}
            onClick={hostEvent}
            className="border-b text-xl uppercase tracking-wide"
          >
            Publish →
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default CreateEvent;
