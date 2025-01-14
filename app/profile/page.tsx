'use client';

/*
Updated Features:
1. Incorporates ErrorBoundary for safer rendering.
2. Includes SVG icons for better visual representation.
3. Uses UI components (e.g., Button, Card) for a cohesive design.
4. Improved loading state and error handling UI.
*/

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ProfileClient from './profile-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

export default function Profile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.accessToken) {
        setLoading(true);
        try {
          const fetchWithAuth = async (url: string) =>
            fetch(url, {
              headers: { Authorization: `Bearer ${session.accessToken}` },
            }).then((res) => res.json());

          const [user, playlistsData, tracksData, artistsData, recentlyPlayedData] = await Promise.all([
            fetchWithAuth('https://api.spotify.com/v1/me'),
            fetchWithAuth('https://api.spotify.com/v1/me/playlists'),
            fetchWithAuth('https://api.spotify.com/v1/me/top/tracks'),
            fetchWithAuth('https://api.spotify.com/v1/me/top/artists'),
            fetchWithAuth('https://api.spotify.com/v1/me/player/recently-played'),
          ]);

          setUserData(user);
          setPlaylists(playlistsData.items || []);
          setTopTracks(tracksData.items || []);
          setTopArtists(artistsData.items || []);
          setRecentlyPlayed(recentlyPlayedData.items || []);
        } catch (err) {
          setError((err as any).message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-bold mb-6">You are not signed in</h1>
        <Button variant="default" onClick={() => signIn('spotify')} className="bg-green-500">
          Sign in with Spotify
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <Card>{error}</Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <h1 className="text-2xl font-semibold">Loading your profile...</h1>
        </div>
      ) : (
        userData && (
          <ProfileClient
            userData={userData}
            playlists={playlists}
            topTracks={topTracks}
            topArtists={topArtists}
            recentlyPlayed={recentlyPlayed}
          />
        )
      )}
    </div>
  );
}