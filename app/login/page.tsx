// The Login component handles the Spotify login functionality.
// It provides a simple UI to redirect users to the Spotify authentication flow.

export default function Login() {
  // Define the redirect URI for Spotify authentication. This URI triggers the backend API route
  // responsible for initiating the OAuth process with Spotify.
  const redirectUri = '/api/auth/spotify';

  return (
    // Full-screen container styled for a clean and centered login page.
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Page heading to inform the user about the purpose of the page. */}
      <h1 className="text-3xl font-bold mb-6">Log in with Spotify</h1>

      {/* Link element styled as a button to start the Spotify login process. */}
      {/* Clicking this link navigates to the defined redirect URI, kicking off the Spotify OAuth flow. */}
      <a
        href={redirectUri} // Navigates to the backend API endpoint for Spotify authentication.
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Login with Spotify
      </a>
    </div>
  );
}