'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function ShowSearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    if (!query.trim()) {
      setError('Please enter a search term.');
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
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          setError('Permission denied. Check your Spotify scopes.');
        } else {
          setError(`Failed to fetch shows. Status: ${response.status}`);
        }
        console.error('Error fetching shows:', response.status, errorData);
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