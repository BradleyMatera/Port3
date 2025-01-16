'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export default function ShowSearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface Show {
    id: string;
    name: string;
    description: string;
    publisher: string;
    images: { url: string }[];
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Sign In to Search Shows</h1>
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
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=show&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${(session.user as { accessToken: string }).accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to fetch shows: ${errorData.error?.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setShows(data.shows?.items || []);
    } catch (err) {
      console.error('Error fetching shows:', err);
      setError('An error occurred while fetching shows.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Search Shows</h1>
        <p className="text-lg text-muted">Find your favorite podcasts and shows from Spotify!</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for shows..."
          className="w-full max-w-lg p-4 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-white text-lg">Loading shows...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {/* Results Section */}
      {shows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => (
            <Card
              key={show.id}
              className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform"
            >
              <Image
                src={show.images?.[0]?.url || '/images/placeholder-show.jpg'}
                alt={show.name}
                width={320}
                height={160}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-white">{show.name}</h3>
              <p className="text-zinc-400 text-sm">{show.description || 'No description available.'}</p>
              <p className="text-zinc-400 text-sm">Publisher: {show.publisher || 'Unknown'}</p>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}