'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function MusicSearch() {
  // State to manage the search query input
  const [searchQuery, setSearchQuery] = useState('');
  // State to store the search results fetched from Spotify API
  const [searchResults, setSearchResults] = useState([]);
  // State to track if the user is logged in (authenticated with Spotify)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Effect to check for authentication on component load.
   * If no access token is found, redirect the user to the login page.
   */
  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
      // Redirect the user to the login page if no token is found
      window.location.href = '/login';
    } else {
      // Set logged-in state to true if access token exists
      setIsLoggedIn(true);
    }
  }, []);

  /**
   * Handles search functionality by making a request to the Spotify API.
   */
  const handleSearch = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) return; // Abort if no access token

    try {
      // Fetch search results from Spotify API
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
      // Set the search results to the state
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
          {/* Search Input and Button */}
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

          {/* Display Search Results */}
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
        // Loading state for authentication check
        <p className="text-zinc-400">Loading authentication...</p>
      )}
    </div>
  );
}