import express from 'express';
import querystring from 'querystring';
import axios from 'axios';

const router = express.Router();

// Debugging environment variables
console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID || 'NOT SET');
console.log('SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET || 'NOT SET');
console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI || 'NOT SET');

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

if (!client_id || !client_secret || !redirect_uri) {
  throw new Error("Missing Spotify environment variables. Ensure they are set in your .env file.");
}

// Utility function to generate a random string
function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Route for user login
router.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';

  const spotifyAuthUrl =
    'https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id,
      scope,
      redirect_uri,
      state,
    });

  console.log("Redirecting to Spotify Auth URL:", spotifyAuthUrl);
  res.redirect(spotifyAuthUrl);
});

// Route to handle Spotify callback
router.get('/callback', async (req, res) => {
  console.log("Callback hit with query:", req.query);
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (!state || !code) {
    console.error("State or code is missing from the callback.");
    return res.status(400).send('State or code is missing from the callback.');
  }

  const tokenEndpoint = 'https://accounts.spotify.com/api/token';

  const authOptions = {
    method: 'POST',
    url: tokenEndpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
    },
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    }),
  };

  try {
    console.log("Requesting token from Spotify...");
    const tokenResponse = await axios(authOptions);
    console.log("Token Response:", tokenResponse.data);

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      console.error("Access token is missing in response.");
      return res.status(500).send('Failed to retrieve access token.');
    }

    // Redirect to frontend with access token
    const profileRedirectURL = `http://localhost:3000/profile?access_token=${access_token}`;
    console.log("Redirecting to:", profileRedirectURL);
    res.redirect(profileRedirectURL);
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).send('Internal Server Error during token exchange.');
  }
});

export default router;