# 🎵 Spotify Profile Viewer

## 🚀 Overview
A modern, full-stack application built with Next.js and TypeScript to authenticate with Spotify, retrieve user data, and display your profile information in a visually stunning way.

## 📋 Table of Contents
1. [Technology Stack](#technology-stack)
2. [Prerequisites](#prerequisites)
3. [Installation and Setup](#installation-and-setup)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [Detailed Breakdown](#detailed-breakdown)
7. [Repository Setup](#repository-setup)
8. [Authentication Flow](#authentication-flow)
9. [Environment Configuration](#environment-configuration)
10. [How to Extend the App](#how-to-extend-the-app)
11. [Deployment](#deployment)
12. [Support](#support)
13. [License](#license)

## 🛠 Technology Stack

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript 5
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
- **Date Handling:** date-fns
- **Carousel:** Embla Carousel
- **Toast Notifications:** Sonner

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

Before starting, ensure you have:
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
1. **Spotify Authentication:** Secure OAuth2 flow with Spotify
2. **User Profile:** Display of user's Spotify profile information
3. **Top Artists:** Shows user's top 5 most listened-to artists
4. **Top Tracks:** Displays user's top 5 most played tracks
5. **Error Handling:** Comprehensive error handling for API failures
6. **Navigation:** Easy navigation between pages with home and logout options
7. **Responsive Design:** Mobile-friendly layout with grid system

## 🔍 Detailed Breakdown

### Authentication Flow
**File:** `api/auth/spotify/route.ts`  
**Purpose:** Redirects the user to Spotify's authorization endpoint.

```typescript
const spotifyAuthUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&redirect_uri=${encodeURIComponent(
  redirect_uri
)}&state=${state}&scope=${encodeURIComponent(scope)}`;
```

### Profile Data Retrieval
**File:** `app/profile/page.tsx`  
**Purpose:** Fetches user data and displays it on the profile page.

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
```

### Top Artists and Tracks
**File:** `app/profile/page.tsx`  
**Purpose:** Fetches top artists and tracks for the user.

```typescript
fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
  headers: { Authorization: `Bearer ${accessToken}` },
})
  .then((res) => res.json())
  .then(setTopArtists);

fetch('https://api.spotify.com/v1/me/top/tracks?limit=5', {
  headers: { Authorization: `Bearer ${accessToken}` },
})
  .then((res) => res.json())
  .then(setTopTracks);
```

### Error Handling
**File:** `app/profile/page.tsx`  
**Purpose:** Handles errors during API requests.

```typescript
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
```

## 📁 Repository Setup
- **Repository Type:** Public (ensures visibility for others)
- **Source Code Folder:** `/Users/bradleymatera/Desktop/Port3`
- **Key Files:**
  - `README.md`: Technical documentation
  - `.env`: Sensitive credentials
- **Branching Strategy:** All features and fixes are committed to the main branch

## 🔐 Authentication Implementation
### Login Flow
- Checks for valid JWT before redirecting to search page
- Redirects to login page if no valid JWT exists
- Implements secure token storage and management

```typescript
const accessToken = urlToken || localToken;

if (accessToken) {
  fetch('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${accessToken}` } })
    .then((response) => { ... });
} else {
  window.location.href = '/login';
}
```

### JWT Management
```typescript
await cookieStore.set('spotify_access_token', access_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 3600, // 1 hour
});
```

## 🔧 Environment Configuration
### Current Configuration
```env
SPOTIFY_CLIENT_ID=ea84c26d908148c488c45dd2a2afcac8
SPOTIFY_CLIENT_SECRET=d31fea65986f4e558de97c0bef843915
SPOTIFY_REDIRECT_URI=http://localhost:3001/auth/callback
PORT=3001
```

## 🚀 How to Extend the App

### Additional Features
- Implement playlist creation and management
- Add music playback controls using the Spotify Player SDK
- Show saved albums and recently played tracks
- Add search functionality for artists, tracks, and albums

## 🌐 Deployment

### Deploying on Vercel
1. **Build the Project:**
```bash
npm run build
```

2. **Deploy:**
```bash
npx vercel
```

3. **Environment Variables:**
Configure the following:
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REDIRECT_URI`

## 📊 Project Milestones
1. **Week 1:** Project setup, environment configuration, authentication
2. **Week 2:** Search functionality and linking results to Spotify Web Player
3. **Week 3:** Profile management and JWT integration
4. **Week 4:** Final testing and deployment

## 🛟 Support
For support, create an issue in the GitHub repository.

## 📜 License
This project is licensed under the MIT License.

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Spotify API.