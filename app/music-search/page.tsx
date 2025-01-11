'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MusicSearch() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  const handleSearch = async () => {
    if (!searchQuery) return;

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
        throw new Error('Failed to fetch search results');
      }

      const data = await response.json();
      setSearchResults(data.tracks?.items || []);
    } catch (error) {
      console.error('Error searching Spotify:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Music Search</h1>
      <div>
        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for songs, artists, albums..."
            className="w-full p-3 rounded bg-zinc-800 text-white"
          />
          <Button
            className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white px-4"
            onClick={handleSearch}
          >
            Search
          </Button>
        </div>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((item) => (
              <div key={item.id} className="p-4 bg-zinc-800 rounded-lg">
                <img
                  src={item.album?.images[0]?.url || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-zinc-400">
                  {item.artists.map((artist) => artist.name).join(', ')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">No results found. Try searching for something else!</p>
        )}
      </div>
      <button
        onClick={() => signOut()}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
      >
        Sign out
      </button>
    </div>
  );
}