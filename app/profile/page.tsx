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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.accessToken) {
        try {
          const fetchWithAuth = (url: string) =>
            fetch(url, {
              headers: { Authorization: `Bearer ${session.user.accessToken}` },
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
        } catch {
          setError('Failed to load data');
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
        <button
          onClick={() => signIn('spotify')}
          className="bg-green-500 px-6 py-3 rounded-lg text-white"
        >
          Sign in with Spotify
        </button>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProfileClient
          userData={userData}
          playlists={playlists}
          topTracks={topTracks}
          topArtists={topArtists}
          recentlyPlayed={recentlyPlayed}
        />
      )}
    </div>
  );
}