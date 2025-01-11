import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import querystring from 'querystring';
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json()); // Parse JSON bodies

// Generate random state for CSRF protection
function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length })
    .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
    .join('');
}

// Route: Login
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope =
    'user-read-private user-read-email user-library-read playlist-read-private user-modify-playback-state user-read-playback-state streaming';

  const authURL =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state,
    });

  res.redirect(authURL);
});

// Route: Spotify Callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.status(400).send('Code is missing from the callback.');
  }

  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  try {
    const tokenResponse = await axios.post(
      tokenEndpoint,
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    const { access_token } = tokenResponse.data;

    if (access_token) {
      res.redirect(`http://localhost:3000/player?access_token=${access_token}`);
    } else {
      res.status(500).send('Failed to retrieve access token.');
    }
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).send('Internal Server Error during token exchange.');
  }
});

// Route: Get User's Playlists
app.get('/playlists', async (req, res) => {
  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).json({ error: 'Access token is required.' });
  }

  try {
    const playlistsResponse = await axios.get('https://api.spotify.com/v1/me/playlists', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (playlistsResponse.data) {
      res.json(playlistsResponse.data);
    } else {
      res.status(404).json({ error: 'No playlists found.' });
    }
  } catch (error) {
    console.error('Error fetching playlists:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || 'Internal Server Error',
    });
  }
});

// Route: Add Track to Playlist
app.post('/add-to-playlist', async (req, res) => {
  const { playlistId, trackUri, access_token } = req.body;

  if (!playlistId || !trackUri || !access_token) {
    return res.status(400).json({ error: 'playlistId, trackUri, and access_token are required.' });
  }

  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      { uris: [trackUri] },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).send('Track added to playlist successfully!');
  } catch (error) {
    console.error('Error adding track to playlist:', error.response?.data || error.message);
    res.status(500).send('Internal Server Error while adding track.');
  }
});

// Route: Playback Controls
app.put('/playback/:action', async (req, res) => {
  const { access_token } = req.body;
  const { action } = req.params;

  if (!access_token) {
    return res.status(400).json({ error: 'Access token is required.' });
  }

  const endpoints = {
    play: 'https://api.spotify.com/v1/me/player/play',
    pause: 'https://api.spotify.com/v1/me/player/pause',
    next: 'https://api.spotify.com/v1/me/player/next',
    previous: 'https://api.spotify.com/v1/me/player/previous',
  };

  const url = endpoints[action];
  if (!url) {
    return res.status(400).json({ error: 'Invalid playback action.' });
  }

  try {
    await axios({
      method: 'PUT',
      url,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    res.status(200).send(`${action} playback action succeeded.`);
  } catch (error) {
    console.error(`Error during ${action}:`, error.response?.data || error.message);
    res.status(500).send(`Internal Server Error during ${action}.`);
  }
});

// Route: Refresh Token
app.get('/refresh_token', async (req, res) => {
  const refreshToken = req.query.refresh_token;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required.' });
  }

  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  try {
    const refreshResponse = await axios.post(
      tokenEndpoint,
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    res.json(refreshResponse.data);
  } catch (error) {
    console.error('Error refreshing access token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to refresh token.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});