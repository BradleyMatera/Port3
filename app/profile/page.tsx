'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ProfileClient from './profile-client';

export default function Profile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.accessToken) {
        try {
          // Fetch User Data
          const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setUserData(await userResponse.json());

          // Fetch Playlists
          const playlistsResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setPlaylists((await playlistsResponse.json()).items || []);

          // Fetch Top Tracks
          const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setTopTracks((await topTracksResponse.json()).items || []);

          // Fetch Top Artists
          const topArtistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setTopArtists((await topArtistsResponse.json()).items || []);

          // Fetch Recently Played Tracks
          const recentlyPlayedResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
            headers: { Authorization: `Bearer ${session.accessToken}` },
          });
          setRecentlyPlayed((await recentlyPlayedResponse.json()).items || []);
        } catch (err) {
          setError((err as any).message);
        }
      }
    };

    fetchData();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-6">You are not signed in</h1>
        <button
          onClick={() => signIn('spotify')}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
        >
          Sign in with Spotify
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {userData ? (
        <ProfileClient
          userData={userData}
          playlists={playlists}
          topTracks={topTracks}
          topArtists={topArtists}
          recentlyPlayed={recentlyPlayed}
        />
      ) : (
        <div className="flex items-center justify-center h-full">Loading profile...</div>
      )}
    </div>
  );
}