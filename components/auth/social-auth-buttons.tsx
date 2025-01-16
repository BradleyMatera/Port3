'use client';

export default function SocialAuthButtons() {
  return (
    <div className="flex space-x-4">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Sign in with Facebook</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded">Sign in with Google</button>
      <button className="bg-green-500 text-white px-4 py-2 rounded">Sign in with Spotify</button>
    </div>
  );
}