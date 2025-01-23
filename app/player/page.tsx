'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PlaylistItem {
  id: string;
  name: string;
  uri: string;
}

export default function SpotifyPlayerPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
  const [selectedPlaylistUri, setSelectedPlaylistUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserPlaylists = async () => {
    if (!accessToken) return;

    setLoading(true);
    try {
      const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('spotify_access_token');
          window.location.href = 'http://localhost:3001/login';
        } else {
          throw new Error(`Failed to fetch playlists: ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        if (data?.items?.length > 0) {
          const playlistData = data.items.map((item: PlaylistItem) => ({
            id: item.id,
            name: item.name,
            uri: item.uri,
          }));
          setPlaylists(playlistData);
        } else {
          setError('No playlists found.');
        }
      }
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('An error occurred while fetching playlists.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('access_token');
    const playlistUri = urlParams.get('playlist_uri'); // Get the playlist URI from query params

    if (token) {
      localStorage.setItem('spotify_access_token', token);
      setAccessToken(token);
    } else {
      const savedToken = localStorage.getItem('spotify_access_token');
      if (savedToken) {
        setAccessToken(savedToken);
      } else {
        window.location.href = 'http://localhost:3001/login';
      }
    }

    if (playlistUri) {
      setSelectedPlaylistUri(playlistUri); // Set the playlist to auto-play
    }
  }, []);

  useEffect(() => {
    fetchUserPlaylists(); // Fetch playlists whenever the access token changes
  }, [accessToken]);

  const handleReloadPlaylist = () => {
    fetchUserPlaylists(); // Force refresh the playlist when triggered
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-8">
      <Card className="p-6 bg-gradient-to-b from-zinc-800 to-zinc-700 shadow-md rounded-lg">
        <h1 className="text-4xl font-bold text-primary mb-4 text-center">
          Spotify Web Player
        </h1>
        {loading && (
          <p className="text-lg text-center text-gray-400">Loading your playlists...</p>
        )}
        {error && (
          <p className="text-center text-red-500 text-lg mb-4">{error}</p>
        )}
        {playlists.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Select a Playlist</h2>
            <select
              title="Select a playlist"
              className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedPlaylistUri || ''}
              onChange={(e) => setSelectedPlaylistUri(e.target.value)}
            >
              <option value="" disabled>
                Choose a playlist
              </option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.uri}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>
        )}
        {selectedPlaylistUri ? (
          <iframe
            src={`https://open.spotify.com/embed/playlist/${selectedPlaylistUri.split(':')[2]}?utm_source=web`}
            width="100%"
            height="380"
            frameBorder="0"
            allow="encrypted-media"
            allowFullScreen
            className="rounded-lg shadow-md"
          ></iframe>
        ) : (
          !error &&
          !loading && (
            <p className="text-center text-gray-400 text-lg">
              Select a playlist to start playing.
            </p>
          )
        )}
      </Card>

      <div className="mt-8 flex justify-center space-x-4">
        <Button variant="default" onClick={handleReloadPlaylist}>
          Reload Playlists
        </Button>
        <Button
          variant="destructive"
          onClick={() => {
            localStorage.removeItem('spotify_access_token');
            window.location.href = 'http://localhost:3001/login';
          }}
        >
          Log Out
        </Button>
      </div>
    </div>
  );
}