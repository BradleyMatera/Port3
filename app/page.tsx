import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      {/* Logo Section */}
      <div className="w-16 h-16 mb-8">
        <Image
          src="/spotify-logo.svg"
          alt="Spotify Logo"
          width={64}
          height={64}
          className="text-[#1DB954]"
        />
      </div>

      {/* Title Section */}
      <h1 className="text-3xl font-semibold mb-4 text-center text-white">
        Welcome to Spotify Profile Viewer
      </h1>
      <p className="text-zinc-400 mb-8 text-center max-w-md">
        Dive into your personalized Spotify data. Connect your Spotify account to explore your top tracks, artists, and more in a visually engaging way.
      </p>

      {/* Call-to-Action */}
      <Link href="/login" className="w-full max-w-md">
        <Button
          className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-white py-6 rounded-lg font-semibold"
        >
          Connect with Spotify
        </Button>
      </Link>
    </div>
  );
}