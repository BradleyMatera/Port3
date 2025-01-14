'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AudiobooksSearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [audiobooks, setAudiobooks] = useState<
    { id: string; name: string; images: { url: string }[]; authors: { name: string }[]; narrators: { name: string }[] }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Sign In to Search Audiobooks</h1>
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
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=audiobook&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to fetch audiobooks: ${errorData.error?.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setAudiobooks(data.audiobooks?.items || []);
    } catch (err) {
      console.error('Error fetching audiobooks:', err);
      setError('An error occurred while fetching audiobooks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Search Audiobooks</h1>
        <p className="text-lg text-muted">
          Discover your next favorite audiobook from Spotify’s extensive collection!
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for audiobooks..."
          className="w-full max-w-lg p-4 bg-zinc-800 text-white placeholder-zinc-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-white text-lg">Loading audiobooks...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {/* Results Section */}
      {audiobooks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiobooks.map((audiobook) => (
            <Card
              key={audiobook.id}
              className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform"
            >
              <img
                src={audiobook.images[0]?.url || '/images/placeholder-audiobook.jpg'}
                alt={audiobook.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-white">{audiobook.name}</h3>
              <p className="text-zinc-400 text-sm">
                By {audiobook.authors?.map((author) => author.name).join(', ')}
              </p>
              <p className="text-zinc-400 text-sm">
                Narrated by {audiobook.narrators?.map((narrator) => narrator.name).join(', ')}
              </p>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}