'use client';

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Log in with Spotify</h1>
      <button
        onClick={() => signIn("spotify")}
        className="bg-green-500 text-white px-6 py-3 rounded-lg"
      >
        Sign In
      </button>
    </div>
  );
}