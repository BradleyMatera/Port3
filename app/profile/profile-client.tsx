'use client';

import Image from 'next/image';

export default function ProfileClient({ userData, playlists, topTracks, topArtists, recentlyPlayed }) {
  const handleLogout = () => {
    document.cookie = 'spotify_access_token=; Max-Age=0; path=/;';
    localStorage.removeItem('spotify_access_token');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-8">
      {/* User Profile Header */}
      <div className="flex items-center space-x-4">
        <Image
          src={userData.images?.[0]?.url || '/placeholder.svg'}
          alt="Profile"
          width={64}
          height={64}
          className="rounded-full bg-zinc-800"
        />
        <div>
          <h1 className="text-2xl font-semibold">{userData.display_name}</h1>
          <p className="text-zinc-400">Email: {userData.email}</p>
          <p className="text-zinc-400">Country: {userData.country}</p>
          <p className="text-zinc-400">Followers: {userData.followers?.total}</p>
          <p className="text-zinc-400">Account Type: {userData.product}</p>
        </div>
      </div>

      {/* Playlists Section */}
      <section>
        <h2 className="text-lg font-medium">Your Playlists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <div key={playlist.id} className="p-4 bg-zinc-800 rounded-lg">
              <Image
                src={playlist.images?.[0]?.url || '/placeholder-playlist.jpg'}
                alt={playlist.name}
                width={128}
                height={128}
                className="rounded-md mb-4"
              />
              <p>{playlist.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Tracks Section */}
      <section>
        <h2 className="text-lg font-medium">Your Top Tracks</h2>
        <ul>
          {topTracks.map((track) => (
            <li key={track.id} className="mb-4">
              {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
            </li>
          ))}
        </ul>
      </section>

      {/* Top Artists Section */}
      <section>
        <h2 className="text-lg font-medium">Your Top Artists</h2>
        <ul>
          {topArtists.map((artist) => (
            <li key={artist.id} className="mb-4">{artist.name}</li>
          ))}
        </ul>
      </section>

      {/* Recently Played Tracks */}
      <section>
        <h2 className="text-lg font-medium">Recently Played Tracks</h2>
        <ul>
          {recentlyPlayed.map((item) => (
            <li key={item.track.id} className="mb-4">
              {item.track.name} by {item.track.artists.map((artist) => artist.name).join(', ')}
            </li>
          ))}
        </ul>
      </section>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}