"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/services/axios";
import { toasty } from "@/components/ToastProvider";

import { useUserStore } from "@/store/user";
import NotFound from "@/app/not-found";

const ImageToUrlTool = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setUrl("");
  };

  const handleUpload = async () => {
    if (!image) {
      return toasty("Select an image first");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);

      const { data } = await axiosInstance.post("/image-to-url", formData);

      setUrl(data.url);

      navigator.clipboard.writeText(data.url);
      toasty("Uploaded & copied to clipboard");
    } catch (error: any) {
      toasty(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const { user } = useUserStore();

  if (user && user.role === "USER") {
    return <NotFound />;
  }

  return (
    <section className="w-[90vw] max-w-5xl mx-auto py-10 flex flex-col gap-8 mt-10">
      <div>
        <h1 className="text-2xl font-semibold uppercase">Image → URL</h1>
        <p className="text-sm opacity-50 mt-1">Upload an image and instantly get a public URL.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Preview */}
        <div className="w-full md:w-64 h-64 border overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm opacity-50">No Image Selected</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-5 w-full">
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="border p-2 text-sm file:mr-4 file:border-0 file:bg-transparent file:font-medium"
          />

          <button
            onClick={handleUpload}
            disabled={loading || !image}
            className="border px-5 py-2 w-fit hover:bg-white/5 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>

          <div className="flex flex-col gap-2">
            <span className="text-sm uppercase opacity-50">Generated URL</span>

            <input
              readOnly
              value={url}
              placeholder="URL will appear here..."
              className="border p-2 bg-transparent outline-none text-sm"
            />
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(url);
              toasty("Copied");
            }}
            disabled={!url}
            className="border px-5 py-2 w-fit hover:bg-white/5 transition disabled:opacity-50"
          >
            Copy URL
          </button>
        </div>
      </div>
    </section>
  );
};

export default ImageToUrlTool;
