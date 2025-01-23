'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export default function MusicSearchPage() {
  const { data: session } = useSession();
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const accessToken = session?.user?.accessToken;
      if (!accessToken) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch playlists');
        }

        const data = await response.json();
        setPlaylists(data.items || []);
      } catch (err) {
        console.error('Error fetching playlists:', err);
        setError('Failed to fetch playlists.');
      }
    };

    if (session) {
      fetchPlaylists();
    }
  }, [session]);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = session?.user?.accessToken;
      if (!accessToken) {
        setError('Access token is missing. Please log in again.');
        return;
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(`Failed to fetch tracks: ${errorData.error?.message || response.statusText}`);
        return;
      }

      const data = await response.json();
      setTracks(data.tracks?.items || []);
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setError('An error occurred while fetching music.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (trackUri: string) => {
    if (!selectedPlaylist) {
      setError('Please select a playlist to add the song.');
      return;
    }

    const accessToken = session?.user?.accessToken;
    if (!accessToken) {
      setError('Access token is missing. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: [trackUri],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(
          errorData.error?.message || 'Failed to add track to playlist'
        );
      }

      alert('Track added successfully!');
    } catch (err) {
      console.error('Error adding track to playlist:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while adding the track to the playlist.';
      setError(errorMessage);
    }
  };

const handlePlayTrack = async (trackUri: string) => {
  const accessToken = session?.user?.accessToken;
  if (!accessToken) {
    setError('Access token is missing. Please log in again.');
    return;
  }

  try {
    // Fetch active devices
    const deviceResponse = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!deviceResponse.ok) {
      throw new Error('Failed to fetch devices.');
    }

    const deviceData = await deviceResponse.json();

    if (!deviceData.devices || deviceData.devices.length === 0) {
      alert('No active devices found. Please open Spotify on a device and try again.');
      return;
    }

    // Get the first active device
    const activeDevice = deviceData.devices.find((device: any) => device.is_active) || deviceData.devices[0];
    const activeDeviceId = activeDevice.id;

    // Play the track on the selected device
    const playResponse = await fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uris: [trackUri],
        device_id: activeDeviceId,
      }),
    });

    if (!playResponse.ok) {
      throw new Error('Failed to play the track. Make sure Spotify is active on your device.');
    }

    alert('Playing track!');
  } catch (err) {
    console.error('Error playing track:', err);
    setError(err instanceof Error ? err.message : 'Failed to play the track.');
  }
};

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

  return (
    <ScrollArea className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Search Music</h1>
        <p className="text-lg text-muted">
          Discover your favorite songs and artists from Spotify!
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4 mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for music..."
          className="w-full max-w-lg p-4 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>

      {loading && <p className="text-center text-white text-lg">Loading tracks...</p>}
      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {tracks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform"
            >
              <Image
                src={track.album.images?.[0]?.url || '/images/placeholder-album.jpg'}
                alt={track.name}
                width={320}
                height={160}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-white">{track.name}</h3>
              <p className="text-zinc-400 text-sm">
                {track.artists.map((artist: { name: string }) => artist.name).join(', ')}
              </p>
              <div className="flex flex-col space-y-2 mt-4">
                <select
                  title="Select a playlist"
                  className="w-full p-3 rounded-lg bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  value={selectedPlaylist || ''}
                >
                  <option value="" disabled>
                    Select Playlist
                  </option>
                  {playlists.map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
                  onClick={() => handleAddToPlaylist(track.uri)}
                >
                  Add to Playlist
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg text-lg"
                  onClick={() => handlePlayTrack(track.uri)}
                >
                  Play
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}