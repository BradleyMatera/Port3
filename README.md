# 🎵 Spotify Profile Viewer

## 🚀 Unlock your Spotify Profile in Style!

A modern, full-stack application built with Next.js and TypeScript to authenticate with Spotify, retrieve user data, and display your profile information in a visually stunning way.

## 📋 Table of Contents

- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation and Setup](#-installation-and-setup)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Detailed Breakdown](#-detailed-breakdown)
- [How to Extend the App](#-how-to-extend-the-app)
- [Deployment](#-deployment)
- [Support](#-support)
- [License](#-license)

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript 5
- **UI Components**:
  - Radix UI primitives (Accordion, Dialog, Navigation, etc.)
  - Tailwind CSS for styling
  - shadcn/ui components
  - Lucide React for icons
  - Recharts for data visualization
- **State Management & Forms**:
  - React Hook Form with Zod validation
  - Context API for state management
- **Styling & Utilities**:
  - Tailwind CSS with animations
  - Class Variance Authority
  - clsx and tailwind-merge for class manipulation
  - Next-themes for theme management
- **Date Handling**: date-fns
- **Carousel**: Embla Carousel
- **Toast Notifications**: Sonner

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom OAuth implementation with Spotify API
- **Middleware**:
  - CORS for cross-origin requests
  - Morgan for logging
- **Environment**: dotenv for configuration
- **Networking**: Axios for HTTP requests

## 🛠 Prerequisites

Make sure you have the following installed:

- Node.js (LTS or later) - [Download Node.js](https://nodejs.org)
- npm (Version 7 or later)
- MongoDB (Latest version)
- Spotify Developer Account - [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

## 💻 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/spotify-profile-viewer.git
cd spotify-profile-viewer
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Spotify Configuration
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/auth/callback

# Server Configuration
PORT=3001
MONGODB_URI=your_mongodb_connection_string

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Start the Backend

```bash
cd server
node server.js
```

### 5. Start the Frontend

```bash
npm run dev
```

### 6. Access the App

Open your browser and navigate to: `http://localhost:3000`

## 📂 Project Structure

```
.
├── app
│   ├── api
│   │   └── auth
│   │       ├── callback/route.ts
│   │       ├── spotify/route.ts
│   │       └── user/route.ts
│   ├── profile
│   │   ├── page.tsx
│   │   └── profile-client.tsx
│   ├── login/page.tsx
│   ├── layout.tsx
│   ├── globals.css
├── components
│   ├── auth/spotify-auth.tsx
│   ├── ui/button.tsx
├── server
│   ├── routes/auth.js
│   ├── server.js
├── public
│   ├── placeholder-user.jpg
│   ├── spotify-logo.svg
├── styles/globals.css
├── README.md
└── package.json
```

## 🚀 Features

### Current Features
1. **Spotify Authentication**: Secure OAuth2 flow with Spotify
2. **User Profile**: Display of user's Spotify profile information
3. **Top Artists**: Shows user's top 5 most listened to artists
4. **Top Tracks**: Displays user's top 5 most played tracks
5. **Error Handling**: Comprehensive error handling for API failures
6. **Navigation**: Easy navigation between pages with home and logout options
7. **Responsive Design**: Mobile-friendly layout with grid system

## 🔍 Detailed Breakdown

### Frontend Pages

#### 1. Profile Page (`app/profile/page.tsx`)

Purpose: Displays user Spotify data, top artists, and top tracks after authentication.

```typescript
'use client';

import { useEffect, useState } from 'react';

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface UserData {
  display_name: string;
  email: string;
  images: { url: string }[];
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) return (window.location.href = '/login');

    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const userData = await userResponse.json();
        if (!userResponse.ok) throw new Error(userData.error?.message || 'Failed to fetch user data');
        setUserData(userData);

        // Fetch top artists
        const artistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const artistsData = await artistsResponse.json();
        if (!artistsResponse.ok) throw new Error(artistsData.error?.message || 'Failed to fetch top artists');
        setTopArtists(artistsData.items);

        // Fetch top tracks
        const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const tracksData = await tracksResponse.json();
        if (!tracksResponse.ok) throw new Error(tracksData.error?.message || 'Failed to fetch top tracks');
        setTopTracks(tracksData.items);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('spotify_access_token');
    window.location.href = '/login';
  };

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-red-500">Error: {error}</h1>
        <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Return to Login
        </button>
      </div>
    );
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {userData.display_name}</h1>
        <div>
          <button onClick={() => window.location.href = '/'} className="mr-4 px-4 py-2 bg-gray-500 text-white rounded">
            Home
          </button>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      </div>

      {/* Top Artists Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Top Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topArtists.map(artist => (
            <div key={artist.id} className="p-4 border rounded">
              {artist.images[0] && (
                <img src={artist.images[0].url} alt={artist.name} className="w-full rounded mb-2" />
              )}
              <p className="font-medium text-center">{artist.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Tracks Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Top Tracks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topTracks.map(track => (
            <div key={track.id} className="p-4 border rounded">
              {track.album.images[0] && (
                <img src={track.album.images[0].url} alt={track.name} className="w-full rounded mb-2" />
              )}
              <p className="font-medium text-center">{track.name}</p>
              <p className="text-sm text-center text-gray-600">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

#### 2. Login Page (`app/login/page.tsx`)

```typescript
'use client';

export default function Login() {
  return (
    <div>
      <h1>Login with Spotify</h1>
      <a href="http://localhost:3001/login">
        <button>Login</button>
      </a>
    </div>
  );
}
```

### Backend

#### Server (`server/server.js`)

```javascript
app.get('/login', (req, res) => {
  const scope = 'user-read-private user-read-email user-top-read';
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID;

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code || null;

  const response = await axios.post('https://accounts.spotify.com/api/token', {
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  });

  const { access_token } = response.data;
  res.redirect(`/profile?access_token=${access_token}`);
});
```

## 🚀 How to Extend the App

### Add More Spotify Features
- Implement playlist creation and management
- Add music playback controls
- Include recently played tracks
- Show user's saved albums and tracks
- Add search functionality

### Add Visualization Features
Utilize the Recharts library to create beautiful visualizations of your music data:
- Listening history trends
- Top artists/tracks charts
- Genre distribution pie charts
- Mood analysis visualization

### Enhance UI Components
Take advantage of the comprehensive Radix UI primitive components:
- Use `Dialog` for modal windows
- Implement `NavigationMenu` for better navigation
- Add `Toast` notifications for better user feedback
- Implement `HoverCard` for track/artist previews
- Use `Tabs` for organizing different views

### Add Theme Support
Leverage next-themes to implement dark/light mode switching with Tailwind CSS.

### Data Management Improvements
- Implement caching with React Query
- Add error boundaries for better error handling
- Implement proper loading states with Suspense
- Add offline support with service workers

## 🌐 Deployment

### Deploying on Vercel

1. Build the App:
```bash
npm run build
```

2. Deploy:
```bash
npx vercel
```

3. Production URL: Vercel will provide a live deployment URL after setup.

### Environment Setup
Make sure to configure the following in your deployment environment:
- Set all environment variables
- Configure MongoDB connection string
- Update Spotify callback URLs
- Set up proper CORS configurations
- Configure proper security headers

## 🛟 Support

For support, please create an issue in the GitHub repository or reach out to the maintainers.

## 📜 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js, TypeScript, and the Spotify API