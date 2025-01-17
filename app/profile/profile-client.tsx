'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface ProfileClientProps {
  userData: {
    display_name: string;
    email: string;
    country: string;
    followers: { total: number };
    product: string;
    images: { url: string }[];
  };
  playlists: {
    id: string;
    name: string;
    images: { url: string }[];
  }[];
  topTracks: {
    id: string;
    name: string;
    album: { name: string; images: { url: string }[] };
    artists: { name: string }[];
  }[];
  topArtists: {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
  }[];
  recentlyPlayed: {
    track: {
      id: string;
      name: string;
      album: { name: string; images: { url: string }[] };
      artists: { name: string }[];
    };
    played_at: string;
  }[];
}

export default function ProfileClient({
  userData,
  playlists,
  topTracks,
  topArtists,
  recentlyPlayed,
}: ProfileClientProps) {
  return (
    <div className="space-y-8">
      {/* User Info */}
      <Card className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src={userData.images?.[0]?.url || '/placeholder-user.jpg'}
            alt={`${userData.display_name}'s profile`}
            width={150}
            height={150}
            className="rounded-full shadow-md"
          />
          <h1 className="text-3xl font-bold text-primary">{userData.display_name}</h1>
          <div className="text-zinc-400 space-y-1 text-center">
            <p>Email: {userData.email}</p>
            <p>Country: {userData.country}</p>
            <p>Followers: {userData.followers.total}</p>
            <p>Subscription: {userData.product}</p>
          </div>
        </div>
      </Card>

      {/* Playlists */}
      <Card className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Playlists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <Card key={playlist.id} className="p-4 bg-zinc-700 rounded-lg shadow-md">
              <Image
                src={playlist.images?.[0]?.url || '/placeholder.jpg'}
                alt={playlist.name}
                width={120}
                height={120}
                className="rounded-lg"
              />
              <p className="text-white mt-2">{playlist.name}</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Top Tracks */}
      <Card className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Top Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topTracks.map((track) => (
            <Card key={track.id} className="p-4 bg-zinc-700 rounded-lg shadow-md">
              <Image
                src={track.album.images?.[0]?.url || '/placeholder.jpg'}
                alt={track.name}
                width={120}
                height={120}
                className="rounded-lg"
              />
              <p className="text-white mt-2">{track.name}</p>
              <p className="text-zinc-400 text-sm">
                {track.artists.map((artist) => artist.name).join(', ')}
              </p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Top Artists */}
      <Card className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Top Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topArtists.map((artist) => (
            <Card key={artist.id} className="p-4 bg-zinc-700 rounded-lg shadow-md">
              <Image
                src={artist.images?.[0]?.url || '/placeholder.jpg'}
                alt={artist.name}
                width={120}
                height={120}
                className="rounded-lg"
              />
              <p className="text-white mt-2">{artist.name}</p>
              <p className="text-zinc-400 text-sm">{artist.genres.join(', ')}</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Recently Played */}
      <Card className="p-6 bg-gradient-to-b from-zinc-800 via-zinc-700 to-black rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Recently Played</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentlyPlayed.map((item) => (
            <Card key={item.track.id} className="p-4 bg-zinc-700 rounded-lg shadow-md">
              <Image
                src={item.track.album.images?.[0]?.url || '/placeholder.jpg'}
                alt={item.track.name}
                width={120}
                height={120}
                className="rounded-lg"
              />
              <p className="text-white mt-2">{item.track.name}</p>
              <p className="text-zinc-400 text-sm">
                {item.track.artists.map((artist) => artist.name).join(', ')}
              </p>
              <p className="text-zinc-400 text-xs">Played at: {new Date(item.played_at).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}