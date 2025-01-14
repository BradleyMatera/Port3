'use client';

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const handleSignIn = async () => {
    try {
      await signIn("spotify", {
        redirect: true, // Ensures redirection after login
        callbackUrl: "/profile", // Redirect to profile page after successful login
        scope: "user-top-read user-read-recently-played playlist-read-private user-read-email user-read-private",
      });
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Log in with Spotify</h1>
      <button
        onClick={handleSignIn}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Sign In
      </button>
    </div>
  );
}