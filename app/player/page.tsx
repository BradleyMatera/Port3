'use client';

import { useState, useEffect } from 'react';

export default function SpotifyPlayerPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [playlistUri, setPlaylistUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');

    if (token) {
      localStorage.setItem('spotify_access_token', token);
      setAccessToken(token);
    } else {
      const savedToken = localStorage.getItem('spotify_access_token');
      if (savedToken) {
        setAccessToken(savedToken);
      } else {
        window.location.href = 'http://localhost:3001/login';
      }
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchUserPlaylists = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expired. Please log in again.');
            localStorage.removeItem('spotify_access_token');
            window.location.href = 'http://localhost:3001/login';
          } else {
            throw new Error(`Failed to fetch playlists: ${response.statusText}`);
          }
        } else {
          const data = await response.json();
          if (data?.items?.length > 0) {
            setPlaylistUri(data.items[0].uri);
          } else {
            setError('No playlists found.');
          }
        }
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError('An error occurred while fetching playlists.');
      }
    };

    fetchUserPlaylists();
  }, [accessToken]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Spotify Web Player</h1>
      {error && <p className="text-red-500">{error}</p>}
      {playlistUri ? (
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlistUri.split(':')[2]}`}
          width="100%"
          height="380"
          frameBorder="0"
          allow="encrypted-media"
          allowFullScreen
          className="rounded-lg"
        ></iframe>
      ) : (
        !error && <p className="text-gray-400">Loading your playlist...</p>
      )}
    </div>
  );
}