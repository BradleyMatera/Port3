'use client';

import { useEffect } from 'react';

export function SpotifyAuth() {
  useEffect(() => {
    const accessToken = new URLSearchParams(window.location.search).get('access_token');

    if (accessToken) {
      console.log('Spotify Access Token:', accessToken);
      localStorage.setItem('spotify_access_token', accessToken);
      window.location.href = '/profile'; // Redirect to profile page
    }
  }, []);

  const handleSpotifyLogin = () => {
    window.location.href = 'http://localhost:3001/auth/login'; // Redirect to backend login route
  };

  return (
    <button
      onClick={handleSpotifyLogin}
      className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-white font-semibold py-6 rounded-lg"
    >
      Continue with Spotify
    </button>
  );
}