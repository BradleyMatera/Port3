'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ProfileClient from './profile-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserData {
  id: string;
  display_name: string;
  email: string;
  country: string;
  followers: { total: number };
  product: string;
  images: { url: string }[];
}

interface Playlist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface Track {
  id: string;
  name: string;
  album: { name: string; images: { url: string }[] };
  artists: { name: string }[];
}

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
}

interface RecentlyPlayed {
  track: Track;
  played_at: string;
}

export default function Profile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.accessToken) return;

      const fetchWithAuth = async (url: string) =>
        fetch(url, {
          headers: {
            Authorization: `Bearer ${(session.user as { accessToken: string }).accessToken}`,
          },
        }).then((res) => res.json());

      try {
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
        console.error('Error fetching profile data:', err);
        setError('Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white">
        <h1 className="text-4xl font-bold mb-8">You are not signed in</h1>
        <Button
          onClick={() => signIn('spotify')}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-lg"
        >
          Sign in with Spotify
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <Card className="p-6 bg-zinc-800 text-center">{error}</Card>
      </div>
    );
  }

  return (
    <ScrollArea className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-8">
      <Card className="p-6 bg-zinc-800 shadow-md rounded-lg">
        {loading ? (
          <p className="text-center text-gray-400">Loading profile...</p>
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
      </Card>
    </ScrollArea>
  );
}