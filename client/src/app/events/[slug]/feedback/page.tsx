"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

const FeedbackPage = () => {
  const [link, setLink] = useState("");

  return (
    <section className="relative min-h-screen flex justify-center items-center px-6">
      <div className="absolute inset-0 -z-10 bg-[#131F43] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <div className="w-full max-w-5xl flex flex-col items-center gap-10">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-wide">
          Feedback
        </h1>

        <input
          type="text"
          placeholder="Paste feedback link..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full max-w-2xl border-0 border-b bg-transparent outline-none text-center text-lg"
        />

        {link && (
          <>
            <div className="bg-white p-6 md:p-8">
              <QRCode value={link} size={420} />
            </div>

            <p className="text-lg md:text-2xl uppercase tracking-widest opacity-70">
              Scan to submit feedback
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default FeedbackPage;