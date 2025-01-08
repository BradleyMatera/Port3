'use client';

import { useEffect, useState } from 'react';

export default function SpotifyShowSearch() {
  const [query, setQuery] = useState('');
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Retrieve the access token from localStorage
      const storedToken = localStorage.getItem('spotify_access_token');
      if (!storedToken) {
        console.error('Access token is missing or expired.');
        redirectToLogin();
        return;
      }

      // Validate token scopes
      const requiredScopes = ['user-read-email', 'user-read-private', 'streaming'];
      if (!validateScopes(storedToken, requiredScopes)) {
        console.error('Access token is missing required scopes.');
        redirectToLogin();
        return;
      }

      // Set access token
      setAccessToken(storedToken);
    }
  }, []);

  const validateScopes = (token, requiredScopes) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      const tokenScopes = payload.scope?.split(' ') || [];
      return requiredScopes.every((scope) => tokenScopes.includes(scope));
    } catch (error) {
      console.error('Failed to validate token scopes:', error);
      return false;
    }
  };

  const redirectToLogin = () => {
    // Ensure redirect happens only once to avoid infinite loops
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=show&limit=10`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
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
      setError('An error occurred while searching for shows.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Spotify Show Search</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          placeholder="Search for shows..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Search
        </button>
      </form>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      <ul>
        {shows.map((show) => (
          <li key={show.id} className="mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={show.images[0]?.url || '/placeholder-show.jpg'}
                alt={show.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="text-xl font-medium">{show.name}</p>
                <p className="text-sm text-gray-400">{show.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}