import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;

export async function GET() {
  const cookieStore = await cookies();

  // Example of setting a cookie
  await cookieStore.set('example_cookie', 'value', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json({ message: 'User route accessed' });
}