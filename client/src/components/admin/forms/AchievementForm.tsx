"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";

type AchievementFormProps = {
  onClose?: () => void;
};

const AchievementForm = ({ onClose }: AchievementFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!imageFile) return;

    const uploadImage = async () => {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("image", imageFile);

        const res = await axiosInstance.post("/images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        setImgUrl(res.data.url);
      } catch (err) {
        console.log(err);
      } finally {
        setUploading(false);
      }
    };

    uploadImage();
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      date,
      imgUrl,
    };

    try {
      await axiosInstance.post("/achievements", payload, {
        withCredentials: true,
      });
      onClose?.();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-lg bg-white p-6">
        <h3 className="text-lg font-semibold">Add Achievement</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded border p-2"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full rounded border p-2"
          required
        />

        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Date (YYYY-MM-DD)"
          className="w-full rounded border p-2"
          required
        />

        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />

        <input value={imgUrl} placeholder="Image URL" className="w-full rounded border bg-gray-100 p-2" disabled />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded px-4 py-2">
            Cancel
          </button>

          <button
            type="submit"
            disabled={uploading}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AchievementForm;
