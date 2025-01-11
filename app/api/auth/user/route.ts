import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Load environment variables to handle Spotify API credentials
const client_id = process.env.SPOTIFY_CLIENT_ID!; // Spotify Client ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!; // Spotify Client Secret
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!; // Redirect URI for Spotify OAuth

/**
 * Handles incoming GET requests to the API route.
 * 
 * @returns {NextResponse} - A JSON response confirming route access and sets an example cookie.
 */
export async function GET() {
  // Access the cookies object to manage browser cookies
  const cookieStore = await cookies();

  // Example: Setting a cookie with secure and HTTP-only attributes
  await cookieStore.set('example_cookie', 'value', {
    httpOnly: true, // Ensures the cookie is inaccessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // Makes the cookie HTTPS-only in production
  });

  // Respond with a JSON object to indicate the route was accessed successfully
  return NextResponse.json({ message: 'User route accessed' });
}