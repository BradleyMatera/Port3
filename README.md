<div align="center">
  
# 🎵 Spotify Profile Viewer

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Live Demo](https://port3-ten.vercel.app/) | [Report Bug](https://github.com/BradleyMatera/Port3/issues) | [Request Feature](https://github.com/BradleyMatera/Port3/issues)

![Spotify Profile Viewer Demo](https://raw.githubusercontent.com/BradleyMatera/Port3/refs/heads/main/Designs/Home.png)

A modern, full-stack application that brings your Spotify profile to life with stunning visualizations and seamless authentication.

</div>

## ✨ Features

## ✨ Features

<table>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/BradleyMatera/Port3/main/Designs/Home.png" alt="Home Page" width="200" height="150">
      <h3>Home Page</h3>
      <p>A modern, welcoming home page to get started with your Spotify journey.</p>
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/BradleyMatera/Port3/main/Designs/Profile.png" alt="Profile View" width="200" height="150">
      <h3>Profile View</h3>
      <p>Access detailed insights into your Spotify profile and listening habits.</p>
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/BradleyMatera/Port3/main/Designs/Music%20Search.png" alt="Music Search" width="200" height="150">
      <h3>Music Search</h3>
      <p>Discover new tracks and artists with a powerful search feature.</p>
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://raw.githubusercontent.com/BradleyMatera/Port3/main/Designs/Webplayer.png" alt="Web Player" width="200" height="150">
      <h3>Web Player</h3>
      <p>Play your favorite songs directly from the web player integration.</p>
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/BradleyMatera/Port3/main/Designs/Audiobooks.png" alt="Audiobooks" width="200" height="150">
      <h3>Audiobooks</h3>
      <p>Explore and enjoy Spotify’s audiobook collection effortlessly.</p>
    </td>
    <td>
      <img src="https://raw.githubusercontent.com/BradleyMatera/Port3/main/Designs/AudioBooksSearch.png" alt="Audiobooks Search" width="200" height="150">
      <h3>Audiobooks Search</h3>
      <p>Search for audiobooks quickly and efficiently.</p>
    </td>
  </tr>
</table>

## 🚀 Quick Start

### Prerequisites

<details>
<summary>Click to expand</summary>

- Node.js 16+ ([Download](https://nodejs.org/))
- npm 7+
- MongoDB ([Install](https://www.mongodb.com/try/download/community))
- Spotify Developer Account ([Dashboard](https://developer.spotify.com/dashboard/))

</details>

### Installation

1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/spotify-profile-viewer.git
cd spotify-profile-viewer
```

2️⃣ Install dependencies
```bash
npm install
```

3️⃣ Configure environment variables
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/auth/callback
```

4️⃣ Start development servers
```bash
# Backend
cd server && node server.js

# Frontend (new terminal)
npm run dev
```

## 🛠️ Tech Stack

<details>
<summary><b>Frontend</b></summary>

- **Framework:** Next.js 15 with TypeScript 5
- **UI Components:** 
  - Radix UI primitives
  - shadcn/ui components
  - Tailwind CSS
  - Lucide React icons
- **State & Forms:** React Hook Form + Zod
- **Data Visualization:** Recharts
- **Theme:** Next-themes
- **Utils:** date-fns, Embla Carousel

</details>

<details>
<summary><b>Backend</b></summary>

- **Runtime:** Node.js with Express
- **Database:** MongoDB + Mongoose
- **Auth:** Custom OAuth implementation
- **Networking:** Axios
- **Logging:** Morgan

</details>

## 📦 Project Structure

```
spotify-profile-viewer/
├── app/                    # Next.js application
│   ├── api/               # API routes
│   ├── profile/          # Profile pages
│   └── login/            # Authentication
├── components/            # React components
├── server/               # Backend server
└── public/               # Static assets
```

## 🎯 Core Features

### 🔐 Authentication Flow
```mermaid
sequenceDiagram
    User->>App: Click "Login with Spotify"
    App->>API: Redirect to `/api/auth/spotify`
    API->>Spotify: Request Auth (Client ID, Redirect URI, Scope, State)
    Spotify-->>User: Display Auth Prompt
    User->>Spotify: Approve Access
    Spotify-->>API: Return Auth Code via Callback
    API->>Spotify: Exchange Auth Code for Access Token
    Spotify-->>API: Respond with Access Token
    API-->>App: Forward Access Token
    App->>LocalStorage: Store Access Token
    App->>Spotify API: Make Authenticated Requests
    Spotify API-->>App: Respond with User Data
```



### 🎵 Music Discovery

- Top artists and tracks
- Personalized recommendations
- Playlist generation

## 🔄 API Integration

<details>
<summary>Available Endpoints</summary>

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/auth/spotify` | GET | Initiate Spotify OAuth |
| `/api/auth/callback` | GET | OAuth callback handler |
| `/api/profile` | GET | Get user profile |
| `/api/top-tracks` | GET | Get user's top tracks |

</details>

</div>

## 🚀 Deployment

### Vercel Deployment

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/username/spotify-profile-viewer)

1. Click the "Deploy" button
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy!

## 🤝 Contributing

We love your input! Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

<details>
<summary>Development Process</summary>

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

</details>

## 📈 Project Roadmap

- [x] Basic authentication
- [x] Profile viewing
- [ ] Top tracks/artists
- [ ] Playlist management
- [ ] Social features
- [ ] Advanced analytics

## 🙋 FAQ

<details>
<summary><b>How do I get Spotify API credentials?</b></summary>
1. Go to Spotify Developer Dashboard
2. Create a new application
3. Copy Client ID and Secret
4. Configure redirect URI
</details>

<details>
<summary><b>Can I use this with my free Spotify account?</b></summary>
Yes! The app works with both Free and Premium Spotify accounts, though some features may be limited with Free accounts.
</details>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Next.js Team](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

<div align="center">

Made with ❤️ by [Bradely Matera](https://github.com/BradleyMatera)

⭐️ Star us on GitHub — it helps!

</div>