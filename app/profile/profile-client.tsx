'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface UserData {
  display_name: string;
  email: string;
  country: string;
  followers: { total: number };
  product: string;
  images?: { url: string }[];
}

interface Playlist {
  id: string;
  name: string;
  images?: { url: string }[];
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
}

interface RecentlyPlayedItem {
  track: Track;
}

interface ProfileClientProps {
  userData: UserData;
  playlists: Playlist[];
  topTracks: Track[];
  topArtists: { id: string; name: string }[];
  recentlyPlayed: RecentlyPlayedItem[];
}

export default function ProfileClient({
  userData,
  playlists,
  topTracks,
  topArtists,
  recentlyPlayed,
}: ProfileClientProps) {
  const handleLogout = () => {
    document.cookie = 'spotify_access_token=; Max-Age=0; path=/;';
    localStorage.removeItem('spotify_access_token');
    window.location.href = '/login';
  };

  return (
    <ScrollArea className="space-y-12 p-8 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white min-h-screen">
      {/* User Profile Section */}
      <Card className="p-8 flex items-center space-x-8 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-900 rounded-lg shadow-xl hover:shadow-2xl transition-shadow">
        <Avatar className="w-24 h-24">
          <Image
            src={userData.images?.[0]?.url || '/images/placeholder-user.jpg'}
            alt="Profile"
            width={96}
            height={96}
            className="rounded-full"
          />
        </Avatar>
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-extrabold text-primary">{userData.display_name}</h1>
          <p className="text-lg text-muted">Email: {userData.email}</p>
          <p className="text-lg text-muted">Country: {userData.country}</p>
          <p className="text-lg text-muted">Followers: {userData.followers?.total}</p>
          <p className="text-lg text-muted">
            Account Type: <Badge variant="default">{userData.product}</Badge>
          </p>
        </div>
      </Card>

      {/* Playlists Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-secondary">Your Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Card
              key={playlist.id}
              className="p-6 bg-gradient-to-b from-zinc-800 via-gray-700 to-gray-900 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <Image
                src={playlist.images?.[0]?.url || '/images/placeholder-playlist.jpg'}
                alt={playlist.name}
                width={160}
                height={160}
                className="rounded-md shadow-md"
              />
              <p className="text-center mt-4 text-lg font-semibold text-zinc-100">{playlist.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Tracks Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">Your Top Tracks</h2>
        <ul className="space-y-4">
          {topTracks.map((track) => (
            <li key={track.id} className="flex items-center space-x-6 bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-lg">
              <Image
                src="/images/music-note.svg"
                alt="Track Icon"
                width={32}
                height={32}
                className="mr-4"
              />
                <span className="text-lg font-semibold">{track.name}</span>
              <span className="ml-auto text-sm text-zinc-400">
                by {track.artists.map((artist) => artist.name).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top Artists Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-secondary">Your Top Artists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {topArtists.map((artist) => (
            <Card
              key={artist.id}
              className="flex items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-md hover:shadow-lg"
            >
              <Image
                src="/images/artist-icon.svg"
                alt="Artist Icon"
                width={48}
                height={48}
                className="mr-4"
              />
              <p className="text-lg font-semibold">{artist.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Recently Played Tracks Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-primary">Recently Played Tracks</h2>
        <ul className="space-y-4">
          {recentlyPlayed.map((item) => (
            <li key={item.track.id} className="flex items-center space-x-6 bg-zinc-800 p-4 rounded-lg shadow-md hover:shadow-lg">
              <Image
                src="/images/recent-play.svg"
                alt="Recently Played Icon"
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold">{item.track.name}</span>
              <span className="ml-auto text-sm text-zinc-400">
                by {item.track.artists.map((artist) => artist.name).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Logout Button */}
      <div className="text-center mt-12">
        <Button variant="destructive" size="lg" className="px-8 py-4" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </ScrollArea>
  );
}