import type { Metadata } from "next";
import "./globals.css";
import { Buda, Poppins, Roboto_Mono, Zalando_Sans_Expanded } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

import {Toaster} from "react-hot-toast"

const buda = Zalando_Sans_Expanded({
  weight: "500",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSA | APSIT",
  description:
    "The Data Science Student Committee of APSIT builds a strong coding culture through workshops, projects, hackathons, and technical events across data science and core computer science.",

  keywords: [
    "APSIT",
    "Data Science Student Committee",
    "CSE Data Science",
    "APSIT Clubs",
    "Coding Community",
    "Technical Committee APSIT",
  ],

  authors: [{ name: "Shree Bavachikar" }],

  creator: "Shree Bavachikar",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Data Science Student Committee | APSIT",
    description:
      "Building a strong student-driven coding culture at APSIT through learning, collaboration, and technical excellence.",
    url: "https://dsa-apsit.vercel.app",
    siteName: "DS Student Committee APSIT",
    images: [
      {
        url: "/dsa.png",
        width: 1200,
        height: 630,
        alt: "Data Science Student Committee APSIT",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Data Science Student Committee | APSIT",
    description: "A student-led committee fostering coding culture and technical growth at APSIT.",
    images: ["/dsa.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={` ${buda.className} antialiased overflow-x-hidden bg-black text-white relative`}>
        <SmoothCursor />
        <Navbar />
        <Toaster position="bottom-right" reverseOrder={false} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
