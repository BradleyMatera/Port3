import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET(request: Request) {
  console.log('Callback route hit. Request URL:', request.url);

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  console.log('Extracted query params:', { code, state });

  if (!code || !state) {
    console.error("Missing 'code' or 'state' parameter.");
    return NextResponse.redirect('/login?error=missing_code_or_state');
  }

  try {
    console.log('Exchanging code for token...');
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
      }),
    });

    console.log('Token response status:', tokenResponse.status);
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect('/login?error=token_exchange_failed');
    }

    const { access_token, refresh_token } = await tokenResponse.json();
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);

    console.log('Fetching user profile...');
    const userResponse = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    console.log('User profile response status:', userResponse.status);
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Failed to fetch user profile:', errorText);
      return NextResponse.redirect('/login?error=user_fetch_failed');
    }

    const userData = await userResponse.json();
    console.log('User Data:', userData);

    const cookieStore = await cookies();

    console.log('Setting cookies...');
    await cookieStore.set('spotify_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hour
    });

    await cookieStore.set('spotify_refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    await cookieStore.set('spotify_user', JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    });

    console.log('Redirecting to /profile...');
    return NextResponse.redirect('/profile');
  } catch (error) {
    console.error('Error during Spotify callback:', error);
    return NextResponse.redirect('/login?error=server_error');
  }
}