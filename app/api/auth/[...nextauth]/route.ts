import NextAuth, { AuthOptions } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { JWT } from 'next-auth/jwt';
import { Account, Session } from 'next-auth';

const authOptions: AuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID || '',
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET || '',
      authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,playlist-modify-private,playlist-modify-public,user-modify-playback-state,user-read-playback-state,streaming',
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
  if (account) {
    token.accessToken = account.access_token;
    token.refreshToken = account.refresh_token; // Save refresh token
    token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : 0; // Spotify's `expires_at` is in seconds
  }

  // Refresh token if accessToken has expired
  if (Date.now() > (typeof token.accessTokenExpires === 'number' ? token.accessTokenExpires : 0)) {
    try {
      const url = 'https://accounts.spotify.com/api/token';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken as string,
        }),
      });
      const refreshedTokens = await response.json();
      if (!response.ok) throw refreshedTokens;

      token.accessToken = refreshedTokens.access_token;
      token.accessTokenExpires = Date.now() + refreshedTokens.expires_in * 1000;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return { ...token, error: 'RefreshAccessTokenError' };
    }
  }

  return token;
},
    async session({ session, token }: { session: Session, token: JWT }) {
      session.user = {
        ...session.user,
        id: token.sub || '', // Ensure `id` is assigned
        accessToken: token.accessToken as string, // Assign `accessToken`
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };