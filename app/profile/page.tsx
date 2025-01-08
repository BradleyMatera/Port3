'use client';

import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/layout/bottom-nav'; // Ensure the import path is correct
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('access_token');
    const localToken = localStorage.getItem('spotify_access_token');
    const accessToken = urlToken || localToken;

    if (urlToken) {
      localStorage.setItem('spotify_access_token', urlToken);
    }

    if (accessToken) {
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then((data) => setUserData(data))
        .catch((error) => {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('spotify_access_token');
          window.location.href = '/login';
        });
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    // Remove all tokens and redirect to login
    localStorage.removeItem('spotify_access_token');
    document.cookie = 'spotify_access_token=; Max-Age=0; path=/;';
    document.cookie = 'spotify_refresh_token=; Max-Age=0; path=/;';
    router.push('/login');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <p className="text-zinc-400">Loading your Spotify profile...</p>
      </div>
    );
  }

  const {
    display_name,
    email,
    images,
    id,
    uri,
    href,
    followers,
    explicit_content,
    country,
    product,
  } = userData;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-4">Your Spotify Profile</h1>
        <div className="flex items-center mb-6">
          <img
            src={images?.[0]?.url || '/placeholder-user.jpg'}
            alt="Profile"
            className="w-32 h-32 rounded-full bg-gray-800"
          />
          <div className="ml-4">
            <h2 className="text-2xl font-semibold">{display_name}</h2>
            <p className="text-gray-400">{email}</p>
          </div>
        </div>
        <ul className="space-y-2">
          <li><strong>User ID:</strong> {id}</li>
          <li><strong>Email:</strong> {email}</li>
          <li><strong>Country:</strong> {country}</li>
          <li><strong>Subscription:</strong> {product}</li>
          <li><strong>Followers:</strong> {followers?.total || 0}</li>
          <li><strong>Profile URI:</strong> <a href={uri} className="text-green-500">{uri}</a></li>
          <li><strong>API Link:</strong> <a href={href} className="text-green-500">{href}</a></li>
          <li>
            <strong>Explicit Content Filter:</strong>{' '}
            {explicit_content?.filter_enabled ? 'Enabled' : 'Disabled'}
          </li>
        </ul>
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => router.push('/')} // Redirect to the homepage
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Go Back to Home
          </button>
          <button
            onClick={handleLogout} // Call the logout handler
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
      <BottomNav /> {/* Add the bottom navigation */}
    </div>
  );
}