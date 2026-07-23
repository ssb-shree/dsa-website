"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";
import { toasty } from "@/components/ToastProvider";

type Highlight = {
  _id: string;
  title: string;
  img1Url: string;
  img2Url: string;
  img3Url: string;
};

const empty = {
  title: "",
  img1Url: "",
  img2Url: "",
  img3Url: "",
};

export default function HighlightPage() {
  const [items, setItems] = useState<Highlight[]>([]);
  const [form, setForm] = useState(empty);

  const fetchData = async () => {
    const { data } = await axiosInstance.get("/highlights");
    setItems(data.highlights);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const create = async () => {
    await axiosInstance.post("/highlights", form);
    setForm(empty);
    fetchData();
    toasty("Created");
  };

  const update = async (item: Highlight) => {
    await axiosInstance.put(`/highlights/${item._id}`, item);
    toasty("Updated");
  };

  const remove = async (id: string) => {
    await axiosInstance.delete(`/highlights/${id}`);
    fetchData();
    toasty("Deleted");
  };

  return (
    <section className="w-[90vw] mx-auto py-10 flex flex-col gap-10">
      <h1 className="text-3xl font-bold uppercase">Highlights</h1>

      <div className="border p-5 flex flex-col gap-4">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-b bg-transparent outline-none py-2"
        />

        <input
          placeholder="Image 1 URL"
          value={form.img1Url}
          onChange={(e) => setForm({ ...form, img1Url: e.target.value })}
          className="border-b bg-transparent outline-none py-2"
        />

        <input
          placeholder="Image 2 URL"
          value={form.img2Url}
          onChange={(e) => setForm({ ...form, img2Url: e.target.value })}
          className="border-b bg-transparent outline-none py-2"
        />

        <input
          placeholder="Image 3 URL"
          value={form.img3Url}
          onChange={(e) => setForm({ ...form, img3Url: e.target.value })}
          className="border-b bg-transparent outline-none py-2"
        />

        <button onClick={create} className="border px-6 py-2 w-fit">
          Create
        </button>
      </div>

      <div className="flex flex-col gap-8">
        {items.map((item) => (
          <div key={item._id} className="border p-5 flex flex-col gap-4">
            <input
              value={item.title}
              onChange={(e) => setItems(items.map((i) => (i._id === item._id ? { ...i, title: e.target.value } : i)))}
              className="border-b bg-transparent outline-none"
            />

            <div className="grid grid-cols-3 gap-4">
              {(["img1Url", "img2Url", "img3Url"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-2">
                  <img src={item[key]} className="aspect-square border object-cover" />

                  <input
                    value={item[key]}
                    onChange={(e) => {
                      setItems(items.map((i) => (i._id === item._id ? { ...i, [key]: e.target.value } : i)));
                    }}
                    className="border-b bg-transparent outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={() => update(item)} className="border px-5 py-2">
                Save
              </button>

              <button onClick={() => remove(item._id)} className="border px-5 py-2">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
