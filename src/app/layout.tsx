import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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
    <ClerkProvider>
      <html lang="en" className={cn(inter.variable, sora.variable)}>
        <body className="bg-[#F8FAFC] text-[#1E293B] font-inter antialiased">
          <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-sora font-bold text-[#1E3A5F]">Fileora</span>
              </div>
              
              <div className="flex items-center gap-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-slate-600 hover:text-[#1E3A5F] transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-[#1E3A5F] rounded-lg hover:bg-[#1E3A5F]/90 transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </header>
          
          <main className="pt-16 min-h-screen">
            {children}
          </main>
          
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
