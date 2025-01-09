'use client';

import { useState, useEffect } from 'react';

export default function ShowSearchPage() {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('spotify_access_token');
      if (!token) {
        console.error('Access token is missing or expired.');
        window.location.href = '/login';
      } else {
        setAccessToken(token);
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    if (!accessToken) {
      console.error('Access token missing or expired.');
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=show&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShows(data.shows?.items || []);
      } else if (response.status === 403) {
        console.error('Permission denied. Ensure proper scopes.');
        setError('Permission denied. Check your Spotify scopes.');
      } else {
        console.error('Failed to fetch shows:', response.status);
        setError(`Failed to fetch shows. Status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching shows:', err);
      setError('An error occurred while fetching shows.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Search Shows</h1>

      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for shows..."
          className="w-full p-3 text-black rounded"
        />
        <button
          onClick={handleSearch}
          className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Search
        </button>
      </div>

      {loading && <div>Loading shows...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <ul>
        {shows.map((show) => (
          <li key={show.id} className="mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={show.images[0]?.url || '/placeholder-show.jpg'}
                alt={show.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="text-xl font-medium">{show.name}</p>
                <p className="text-sm text-gray-400">{show.description}</p>
                <p className="text-sm text-gray-400">Publisher: {show.publisher}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}