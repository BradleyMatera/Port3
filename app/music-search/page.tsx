'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export default function MusicSearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface Track {
    id: string;
    name: string;
    artists: { name: string }[];
    album: { images: { url: string }[] };
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Sign In to Search Music</h1>
        <Button
          onClick={() => signIn('spotify')}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg rounded-lg"
        >
          Sign in with Spotify
        </Button>
      </div>
    );
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = session.user?.accessToken;
      if (!accessToken) {
        setError('Access token is missing. Please log in again.');
        return;
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to fetch tracks: ${errorData.error?.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setTracks(data.tracks?.items || []);
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setError('An error occurred while fetching music.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Search Music</h1>
        <p className="text-lg text-muted">
          Discover your favorite songs and artists from Spotify!
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for music..."
          className="w-full max-w-lg p-4 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {loading && <p className="text-center text-white text-lg">Loading tracks...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {tracks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform"
            >
              <Image
                src={track.album.images?.[0]?.url || '/images/placeholder-album.jpg'}
                alt={track.name}
                width={320}
                height={160}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-white">{track.name}</h3>
              <p className="text-zinc-400 text-sm">
                Artist: {track.artists.map((artist) => artist.name).join(', ')}
              </p>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}