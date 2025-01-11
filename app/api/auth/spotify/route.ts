import { NextResponse } from 'next/server'; // Import Next.js's server response helper for redirects.
import { generateRandomString } from '../../../../utils'; // Utility function to generate a secure random state string.

// Extract Spotify credentials from environment variables.
// The client ID identifies the app in the Spotify API, while the redirect URI is where Spotify sends the user after authentication.
const client_id = process.env.SPOTIFY_CLIENT_ID!;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET() {
  // Log for debugging purposes to confirm the route is being accessed.
  console.log('Spotify Auth route hit. Redirecting to Spotify auth URL...');
  
  // Generate a random state string to protect against CSRF attacks.
  const state = generateRandomString(16);

  // Define the required OAuth scopes. These determine what user data or actions the app can access.
  const scope = 'user-read-private user-read-email';

  // Construct the Spotify authorization URL with all required query parameters.
  // - `response_type=code`: Specifies the authorization code grant type.
  // - `client_id`: Identifies the app.
  // - `redirect_uri`: Specifies where the user is redirected after granting/denying access.
  // - `state`: Ensures the response to this request is from Spotify and not an attacker.
  // - `scope`: Specifies the permissions the app is requesting.
  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&state=${state}&scope=${encodeURIComponent(scope)}`;

  // Log the constructed Spotify Auth URL for debugging purposes.
  console.log('Generated Spotify Auth URL:', spotifyAuthUrl);

  // Redirect the user to the constructed Spotify authorization URL.
  return NextResponse.redirect(spotifyAuthUrl);
}