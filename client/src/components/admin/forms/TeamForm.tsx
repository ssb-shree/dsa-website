"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";

type TeamFormProps = {
  onClose?: () => void;
};

const TeamForm = ({ onClose }: TeamFormProps) => {
  // make below 4 in one object and its imgUrl not imgUrl
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [role, setRole] = useState("");
  const [imgUrl, setimgUrl] = useState("");

  const [message, setMessage] = useState("");

  const [imgFile, setimgFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // upload image when file changes
  useEffect(() => {
    if (!imgFile) return;

    const uploadImage = async () => {
      try {
        setUploading(true);

        const formData = new FormData();
        formData.append("image", imgFile);

        const res = await axiosInstance.post("/images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        setimgUrl(res.data.url);
      } catch (err) {
        console.log(err);
      } finally {
        setUploading(false);
      }
    };

    uploadImage();
  }, [imgFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      year,
      role,
      message,
      imgUrl,
    };

    try {
      await axiosInstance.post("/teams", payload, {
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
        <h3 className="text-lg font-semibold">Add Team Member</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full rounded border p-2"
          required
        />

        <input
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year"
          className="w-full rounded border p-2"
          required
        />

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role"
          className="w-full rounded border p-2"
          required
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className="w-full rounded border p-2"
        />

        <input type="file" accept="image/*" onChange={(e) => setimgFile(e.target.files?.[0] || null)} />

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

export default TeamForm;
