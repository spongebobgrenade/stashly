"use client";

import { signInWithGoogle } from "@/services/auth/auth.service";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => signInWithGoogle()}
        className="px-6 py-3 rounded-xl bg-black text-white"
      >
        Continue with Google
      </button>
    </main>
  );
}