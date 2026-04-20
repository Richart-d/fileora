'use client'

import { useAuth, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Settings } from "lucide-react";

export function HeaderAuth() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-9 w-20 bg-slate-100 animate-pulse rounded-lg" />;
  }

  return (
    <div className="flex items-center gap-4">
      {!isSignedIn ? (
        <>
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
        </>
      ) : (
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Settings"
              href="/settings"
              labelIcon={<Settings className="w-4 h-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
      )}
    </div>
  );
}
