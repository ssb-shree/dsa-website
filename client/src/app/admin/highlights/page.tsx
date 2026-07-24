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

  const [uploading, setUploading] = useState(false);

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
      <h1 className="text-3xl font-bold uppercase">Highlights</h1>

      <div className="border p-5 flex flex-col gap-4">
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-b bg-transparent outline-none py-2"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["img1Url", "img2Url", "img3Url"] as const).map((key) => (
            <div key={key} className="flex flex-col gap-2">
              {form[key] && <img src={form[key]} className="aspect-square border object-cover" />}

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
                      [key]: url,
                    }));

                    toasty("Image uploaded");
                  } catch (error: any) {
                    toasty(error.response?.data?.message || "Upload failed");
                  }
                }}
                className="border-b bg-transparent outline-none py-2 file:mr-4 file:border-0 file:bg-transparent"
              />
            </div>
          ))}
        </div>

        <button onClick={create} className="w-full border px-6 py-2 w-fit">
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
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        const url = await uploadImage(file);

                        setItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, [key]: url } : i)));

                        toasty("Image uploaded");
                      } catch (error: any) {
                        toasty(error.response?.data?.message || "Upload failed");
                      }
                    }}
                    className="border-b bg-transparent outline-none file:mr-4 file:border-0 file:bg-transparent"
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
