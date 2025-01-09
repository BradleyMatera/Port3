'use client';

import { useState, useEffect } from 'react';

export default function SpotifyPlayerPage() {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState('');
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState({
    name: 'No Track Playing',
    album: { images: [{ url: '/placeholder.jpg' }] },
    artists: [{ name: 'Unknown Artist' }],
  });
  const [accessToken, setAccessToken] = useState(null);
  const requiredScopes = ['streaming', 'user-read-email', 'user-read-private'];

  // Fetch the access token from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('spotify_access_token');
      if (token) {
        setAccessToken(token);
      } else {
        console.error('Access token not found. Please log in again.');
      }
    }
  }, []);

  // Validate token scopes and load Spotify Web Playback SDK
  useEffect(() => {
    if (!accessToken) return;

    const validateScopes = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error('Invalid access token.');
        }

        const data = await response.json();
        const tokenScopes = data.scopes || [];
        const missingScopes = requiredScopes.filter((scope) => !tokenScopes.includes(scope));

        if (missingScopes.length > 0) {
          throw new Error(`Missing required scopes: ${missingScopes.join(', ')}`);
        }

        return true;
      } catch (error) {
        console.error('Token validation error:', error.message);
        return false;
      }
    };

    const loadSpotifySDK = async () => {
      const scopesValid = await validateScopes();
      if (!scopesValid) return;

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;

      script.onload = () => {
        if (!window.Spotify) {
          console.error('Spotify SDK failed to initialize.');
          return;
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
          const spotifyPlayer = new window.Spotify.Player({
            name: 'Web Playback SDK Player',
            getOAuthToken: (cb) => cb(accessToken),
            volume: 0.5,
          });

          setPlayer(spotifyPlayer);

          // Add event listeners
          spotifyPlayer.addListener('ready', ({ device_id }) => {
            setDeviceId(device_id);
          });

          spotifyPlayer.addListener('not_ready', ({ device_id }) => {
            console.error('Device ID is not ready:', device_id);
          });

          spotifyPlayer.addListener('player_state_changed', (state) => {
            if (state) {
              setCurrentTrack(state.track_window.current_track);
              setIsPaused(state.paused);
            }
          });

          spotifyPlayer.addListener('initialization_error', ({ message }) => {
            console.error('Initialization error:', message);
          });

          spotifyPlayer.addListener('authentication_error', ({ message }) => {
            console.error('Authentication error:', message);
          });

          spotifyPlayer.addListener('account_error', ({ message }) => {
            console.error('Account error:', message);
          });

          spotifyPlayer.addListener('playback_error', ({ message }) => {
            console.error('Playback error:', message);
          });

          spotifyPlayer.connect();
        };
      };

      script.onerror = () => {
        console.error('Failed to load Spotify SDK script.');
      };

      document.body.appendChild(script);

      return () => {
        if (player) {
          player.disconnect();
        }
        document.body.removeChild(script);
      };
    };

    loadSpotifySDK();
  }, [accessToken]);

  const handleTogglePlay = () => {
    if (player) {
      player.togglePlay().then(() => {
        console.log(isPaused ? 'Resumed playback' : 'Paused playback');
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Spotify Web Player</h1>

      <div className="flex items-center mb-6">
        <img
          src={currentTrack.album.images[0]?.url || '/placeholder.jpg'}
          alt="Album Cover"
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div className="ml-4">
          <p className="text-lg font-semibold">{currentTrack.name}</p>
          <p className="text-sm text-gray-400">
            {currentTrack.artists.map((artist) => artist.name).join(', ')}
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
          onClick={handleTogglePlay}
        >
          {isPaused ? 'Play' : 'Pause'}
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {deviceId
          ? `Connected to Device ID: ${deviceId}`
          : 'No active device. Open Spotify and select this player.'}
      </p>
    </div>
  );
}