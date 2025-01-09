# 🎵 Spotify Profile Viewer

## 🚀 Overview
A modern, full-stack application built with Next.js and TypeScript to authenticate with Spotify, retrieve user data, and display your profile information in a visually stunning way.

## 📋 Table of Contents
- [🛠 Technology Stack](#-technology-stack)
- [🛠 Prerequisites](#-prerequisites)
- [💻 Installation and Setup](#-installation-and-setup)
- [📂 Project Structure](#-project-structure)
- [🚀 Features](#-features)
- [🔍 Detailed Breakdown](#-detailed-breakdown)
- [📁 Repository Setup](#-repository-setup)
- [🔐 Authentication Flow](#-authentication-flow)
- [🔧 Environment Configuration](#-environment-configuration)
- [🚀 How to Extend the App](#-how-to-extend-the-app)
- [🌐 Deployment](#-deployment)
- [🛟 Support](#-support)
- [📜 License](#-license)

## 🛠 Technology Stack

### Frontend
- **Framework:** 
  - Next.js 15
  - Language: TypeScript 5

- **UI Components:**
  - Radix UI primitives (Accordion, Dialog, Navigation, etc.)
  - Tailwind CSS for styling
  - shadcn/ui components
  - Lucide React for icons
  - Recharts for data visualization

- **State Management & Forms:**
  - React Hook Form with Zod validation
  - Context API for state management

- **Styling & Utilities:**
  - Tailwind CSS with animations
  - Class Variance Authority
  - clsx and tailwind-merge for class manipulation
  - Next-themes for theme management
  - Date Handling: date-fns
  - Carousel: Embla Carousel
  - Toast Notifications: Sonner

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Custom OAuth implementation with Spotify API
- **Middleware:**
  - CORS for cross-origin requests
  - Morgan for logging
- **Environment Variables:** dotenv
- **Networking:** Axios for HTTP requests

## 🛠 Prerequisites

Make sure you have the following installed:
- Node.js (v16 or later) - [Download Node.js](https://nodejs.org/)
- npm (v7 or later)
- MongoDB - [Install MongoDB](https://www.mongodb.com/try/download/community)
- Spotify Developer Account - [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)

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
├── .env
├── README.md
└── package.json
```

## 🚀 Features

### Current Features
1. **Spotify Authentication:** 
   - Secure OAuth2 flow with Spotify
   - JWT token management
   - Automatic token refresh

2. **User Profile:** 
   - Display of user's Spotify profile information
   - Profile image display
   - Account details and statistics

3. **Top Artists:** 
   - Shows user's top 5 most listened-to artists
   - Artist images and genres
   - Popularity metrics

4. **Top Tracks:** 
   - Displays user's top 5 most played tracks
   - Track details and album art
   - Audio preview integration

5. **Error Handling:** 
   - Comprehensive error handling for API failures
   - User-friendly error messages
   - Automatic retry mechanisms

6. **Navigation:** 
   - Easy navigation between pages
   - Home and logout options
   - Breadcrumb navigation

7. **Responsive Design:** 
   - Mobile-friendly layout with grid system
   - Adaptive UI components
   - Cross-browser compatibility

## 🔍 Detailed Breakdown

### Authentication Flow
**File:** `api/auth/spotify/route.ts`  
**Purpose:** Redirects the user to Spotify's authorization endpoint.

```typescript
const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(
  redirect_uri
)}&state=${state}&scope=${encodeURIComponent(scope)}`;
```

### Callback Handler
**File:** `api/auth/callback/route.ts`
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return new Response('Missing code or state', { status: 400 });
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      code,
      redirect_uri,
      grant_type: 'authorization_code',
    }),
  });

  const { access_token, refresh_token } = await tokenResponse.json();
  
  await cookieStore.set('spotify_access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600,
  });

  return Response.redirect('/profile');
}
```

### Profile Data Retrieval
**File:** `app/profile/page.tsx`  
```typescript
useEffect(() => {
  const accessToken = localStorage.getItem('spotify_access_token');
  if (!accessToken) return (window.location.href = '/login');

  fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then((res) => res.json())
    .then(setUserData)
    .catch(() => window.location.href = '/login');
}, []);

// Top Artists Fetch
fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
  headers: { Authorization: `Bearer ${accessToken}` },
})
  .then((res) => res.json())
  .then(setTopArtists);

// Top Tracks Fetch
fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
  headers: { Authorization: `Bearer ${accessToken}` },
})
  .then((res) => res.json())
  .then(setTopTracks);
```

### Error Handling
**File:** `app/profile/page.tsx`  
```typescript
if (error) {
  return (
    <div className="p-4">
      <h1 className="text-red-500">Error: {error}</h1>
      <button 
        onClick={handleLogout} 
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      >
        Return to Login
      </button>
    </div>
  );
}
```

### Search Results Component
**File:** `app/search/page.tsx`
```typescript
if (searchResults.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <p className="text-gray-400 text-lg">No results found. Try a different search.</p>
      <button 
        onClick={() => setSearchQuery('')}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
      >
        Clear Search
      </button>
    </div>
  );
}
```

## 📁 Repository Setup
- **Repository Type:** Public
- **Source Code Location:** `/Users/bradleymatera/Desktop/Port3`
- **Key Files:**
  ```
  - README.md: Technical documentation
  - .env: Sensitive credentials
  - package.json: Dependencies and scripts
  - tsconfig.json: TypeScript configuration
  ```
- **Branching Strategy:** Feature-based branching with main branch protection

## 🔐 Authentication Flow

### Login Flow Implementation
```typescript
// login/page.tsx
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Login to Spotify Profile Viewer</h1>
        <a 
          href={redirectUri}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg block text-center"
        >
          Login with Spotify
        </a>
      </div>
    </div>
  );
}
```

### Token Management
```typescript
// api/auth/callback/route.ts
async function handleTokenRefresh(refresh_token: string) {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  const data = await response.json();
  return data.access_token;
}
```

## 🔧 Environment Configuration
```env
# Spotify Configuration
SPOTIFY_CLIENT_ID=ea84c26d908148c488c45dd2a2afcac8
SPOTIFY_CLIENT_SECRET=d31fea65986f4e558de97c0bef843915
SPOTIFY_REDIRECT_URI=http://localhost:3001/auth/callback

# Server Configuration
PORT=3001
MONGODB_URI=mongodb://localhost:27017/spotify-profile
NODE_ENV=development

# Security
JWT_SECRET=your-jwt-secret-key
COOKIE_SECRET=your-cookie-secret
```

## 🚀 How to Extend the App

### Additional Features
1. **Playlist Management:**
   ```typescript
   async function createPlaylist(name: string, tracks: string[]) {
     const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
       method: 'POST',
       headers: {
         Authorization: `Bearer ${accessToken}`,
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({
         name,
         public: false,
         description: 'Created with Spotify Profile Viewer',
       }),
     });
     
     const playlist = await response.json();
     return playlist;
   }
   ```

2. **Playback Controls:**
   ```typescript
   const SpotifyPlayer = () => {
     const [player, setPlayer] = useState(null);
     
     useEffect(() => {
       const script = document.createElement('script');
       script.src = 'https://sdk.scdn.co/spotify-player.js';
       document.body.appendChild(script);
       
       window.onSpotifyWebPlaybackSDKReady = () => {
         const player = new Spotify.Player({
           name: 'Spotify Profile Viewer Player',
           getOAuthToken: cb => cb(accessToken),
         });
         setPlayer(player);
       };
     }, []);
     
     return (
       // Player UI Components
     );
   };
   ```

3. **Recently Played:**
   ```typescript
   async function getRecentlyPlayed() {
     const response = await fetch('https://api.spotify.com/v1/me/player/recently-played', {
       headers: { Authorization: `Bearer ${accessToken}` },
     });
     return await response.json();
   }
   ```

## 🌐 Deployment

### Vercel Deployment Steps

1. **Build Configuration**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/next"
       }
     ]
   }
   ```

2. **Environment Setup**
   ```bash
   vercel env add SPOTIFY_CLIENT_ID
   vercel env add SPOTIFY_CLIENT_SECRET
   vercel env add SPOTIFY_REDIRECT_URI
   ```

3. **Deploy Command**
   ```bash
   npm run build
   npx vercel --prod
   ```

## 📊 Project Milestones
1. **Week 1:** Project setup, environment configuration, authentication
2. **Week 2:** Search functionality and linking results to Spotify Web Player
3. **Week 3:** Profile management and JWT integration
4. **Week 4:** Final testing and deployment

## 🛟 Support
For support, please create an issue in the GitHub repository or contact the development team at support@example.com.

## 📜 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Spotify API.