import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Fileora — Document Utility Platform",
  description:
    "Build ATS-ready CVs and handle all your PDF needs — free, fast, and professional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, sora.variable)}>
      <body className="bg-[#F8FAFC] text-[#1E293B] font-inter antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
