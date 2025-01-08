import { NextResponse } from 'next/server';
import { generateRandomString } from '../../../../utils'; // Adjust the path based on your project structure

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!; // Use the environment variable

export async function GET() {
  console.log('Spotify Auth route hit. Redirecting to Spotify auth URL...');
  const state = generateRandomString(16);
  const scope = 'user-read-private user-read-email';

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(
    redirect_uri
  )}&state=${state}&scope=${encodeURIComponent(scope)}`;

  console.log('Generated Spotify Auth URL:', spotifyAuthUrl);
  return NextResponse.redirect(spotifyAuthUrl);
}