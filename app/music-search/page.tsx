'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MusicSearch() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    if (!searchQuery.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track,artist,album&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to fetch search results: ${errorData.error?.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setSearchResults(data.tracks?.items || []);
    } catch (err) {
      console.error('Error searching Spotify:', err);
      setError('An error occurred while fetching search results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Music Search</h1>
        <p className="text-lg text-muted">Search for tracks, artists, and albums from Spotify!</p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col items-center space-y-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for songs, artists, albums..."
          aria-label="Search for music"
          className="w-full max-w-xl p-4 bg-zinc-800 text-white text-lg rounded-lg placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* Error States */}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((item) => (
            <Card
              key={item.id}
              className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={item.album?.images[0]?.url || '/images/placeholder.jpg'}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-white">{item.name || 'Unknown Track'}</h3>
              <p className="text-zinc-400 text-sm">
                {item.artists?.map((artist: { name: string }) => artist.name).join(', ') || 'Unknown Artist'}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <p className="text-center text-zinc-400 text-lg mt-12">
            No results found. Try searching for something else!
          </p>
        )
      )}

      {/* Logout Button */}
      <div className="text-center mt-8">
        <Button
          variant="destructive"
          size="lg"
          className="px-8 py-4"
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      </div>
    </ScrollArea>
  );
}