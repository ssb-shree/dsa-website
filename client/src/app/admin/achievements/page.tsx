"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";
import { toasty } from "@/components/ToastProvider";

type Achievement = {
  _id: string;
  title: string;
  description: string;
  date: string;
  imgUrl: string;
};

const empty = {
  title: "",
  description: "",
  date: "",
  imgUrl: "",
};

export default function AchievementPage() {
  const [items, setItems] = useState<Achievement[]>([]);
  const [form, setForm] = useState(empty);

  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const { data } = await axiosInstance.get("/achievements");
    setItems(data.achievements);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const create = async () => {
    await axiosInstance.post("/achievements", form, { withCredentials: true });
    setForm(empty);
    fetchData();
    toasty("Created");
  };

  const update = async (item: Achievement) => {
    await axiosInstance.put(`/achievements/${item._id}`, item, { withCredentials: true });
    toasty("Updated");
  };

  const remove = async (id: string) => {
    await axiosInstance.delete(`/achievements/${id}`, { withCredentials: true });
    fetchData();
    toasty("Deleted");
  };

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

  return (
    <section className="w-[90vw] mx-auto py-10 flex flex-col gap-10 mt-10">
      <h1 className="text-3xl font-bold uppercase">Achievements</h1>

      {/* Create */}

      <div className=" p-5 flex flex-col gap-4">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-b bg-transparent outline-none py-2"
        />

        <input
          placeholder="Date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border-b bg-transparent outline-none py-2"
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

              setForm((prev) => ({
                ...prev,
                imgUrl: url,
              }));

              toasty("Image uploaded");
            } catch (error: any) {
              toasty(error.response?.data?.message || "Upload failed");
            }
          }}
          className="border-b bg-transparent outline-none py-2 file:mr-4 file:border-0 file:bg-transparent"
        />

        {form.imgUrl && <img src={form.imgUrl} className="w-40 h-40 object-cover border" />}

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border-b p-2 outline-none bg-transparent min-h-32"
        />

        <button onClick={create} className="border py-2 w-fit px-6">
          Create
        </button>
      </div>

      {/* Existing */}

      <div className="flex flex-col gap-8">
        {items.map((item) => (
          <div key={item._id} className="border p-5 flex gap-6">
            <img src={item.imgUrl} className="w-40 h-40 object-cover border shrink-0" />

            <div className="flex-1 flex flex-col gap-3">
              <input
                value={item.title}
                onChange={(e) => {
                  setItems(items.map((i) => (i._id === item._id ? { ...i, title: e.target.value } : i)));
                }}
                className="border-b bg-transparent outline-none"
              />

              <input
                value={item.date}
                onChange={(e) => {
                  setItems(items.map((i) => (i._id === item._id ? { ...i, date: e.target.value } : i)));
                }}
                className="border-b bg-transparent outline-none"
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

                    setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, imgUrl: url } : i)));

                    toasty("Image uploaded");
                  } catch (error: any) {
                    toasty(error.response?.data?.message || "Upload failed");
                  }
                }}
                className="border-b bg-transparent outline-none file:mr-4 file:border-0 file:bg-transparent"
              />

              <textarea
                value={item.description}
                onChange={(e) => {
                  setItems(items.map((i) => (i._id === item._id ? { ...i, description: e.target.value } : i)));
                }}
                className="border p-2 bg-transparent outline-none"
              />

              <div className="flex gap-4">
                <button onClick={() => update(item)} className="border px-5 py-2">
                  Save
                </button>

                <button onClick={() => remove(item._id)} className="border px-5 py-2">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
