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

// Allow CORS for your frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Generate random state for CSRF protection
function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Route: Login
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';

  const authURL =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      state,
    });

  console.log('Generated Auth URL:', authURL); // Debugging
  res.redirect(authURL);
});

// Route: Spotify Callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;

  console.log('Callback hit with code:', code); // Debugging
  console.log('Callback hit with state:', state); // Debugging

  if (!state || !code) {
    console.error('State or code is missing from the callback.');
    return res.status(400).send('State or code is missing from the callback.');
  }

  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  const authOptions = {
    method: 'POST',
    url: tokenEndpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    }),
  };

  try {
    console.log('Sending token request with options:', authOptions); // Debugging
    const tokenResponse = await axios(authOptions);

    console.log('Token Response:', tokenResponse.data); // Debugging

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      console.error('Access token is missing in response.');
      return res.status(500).send('Failed to retrieve access token.');
    }

    // Redirect to frontend with access token
    const profileRedirectURL = `http://localhost:3000/profile?access_token=${access_token}`;
    console.log('Redirecting to:', profileRedirectURL); // Debugging
    res.redirect(profileRedirectURL);
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message); // Improved Debugging
    res.status(500).send('Internal Server Error during token exchange.');
  }
});

// Start Server
console.log('Starting server...');
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});