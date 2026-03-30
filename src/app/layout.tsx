import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { UserSync } from "@/components/UserSync";
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
  title: "Fileora — CV Builder & PDF Tools",
  description: "Build your CV and manage your PDFs in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={cn(inter.variable, sora.variable)}>
        <body className="bg-[#F8FAFC] text-[#1E293B] font-inter antialiased">
          <Providers>
            <UserSync />
            <Navbar />
            
            <main className="pt-16 min-h-screen">
              {children}
            </main>
            
            <Toaster richColors position="top-right" />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
