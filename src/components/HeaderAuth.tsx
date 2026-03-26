'use client'

import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export function HeaderAuth() {
  return (
    <div className="flex items-center gap-4">
      <Show when="signed-out">
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
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}
