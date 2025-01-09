export default function Login() {
  const redirectUri = '/api/auth/spotify';

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Log in with Spotify</h1>
      <a
        href={redirectUri}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Login with Spotify
      </a>
    </div>
  );
}