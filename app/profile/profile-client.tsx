'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function ProfileClient({ userData }: { userData: any }) {
  const handleLogout = () => {
    // Clear cookies
    document.cookie = 'spotify_access_token=; Max-Age=0; path=/;';
    document.cookie = 'spotify_refresh_token=; Max-Age=0; path=/;';
    document.cookie = 'spotify_user=; Max-Age=0; path=/;';
    // Clear localStorage
    localStorage.removeItem('spotify_access_token');
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-6 space-y-6">
        {userData ? (
          <>
            <div className="flex items-center space-x-4">
              <Image
                src={userData.images?.[0]?.url || '/placeholder.svg'}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full bg-zinc-800"
              />
              <div>
                <h1 className="text-2xl font-semibold">{userData.display_name}</h1>
                <p className="text-zinc-400">{userData.email}</p>
              </div>
            </div>
            <section>
              <h2 className="text-lg font-medium">Spotify Data</h2>
              <pre className="bg-zinc-900 p-4 rounded">{JSON.stringify(userData, null, 2)}</pre>
            </section>
            <button
              onClick={handleLogout}
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-zinc-400 mb-4">Please log in to view your Spotify profile.</p>
            <button
              onClick={() => (window.location.href = '/login')}
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}