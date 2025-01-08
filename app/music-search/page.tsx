'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function MusicSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      window.location.href = '/login'; // Redirect to login if not authenticated
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSearch = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchQuery
        )}&type=track,artist,album&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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
      <h1 className="text-3xl font-semibold mb-6">Music Search</h1>
      {isLoggedIn ? (
        <div>
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for songs, artists, albums..."
              className="w-full p-3 rounded bg-zinc-800 text-white"
            />
            <Button className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white px-4" onClick={handleSearch}>
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
      ) : (
        <p className="text-zinc-400">Loading authentication...</p>
      )}
    </div>
  );
}