import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="w-16 h-16 mb-8">
        <Image
          src="/airbnb-logo.svg"
          alt="Logo"
          width={64}
          height={64}
          className="text-[#FF385C]"
        />
      </div>
      <h1 className="text-2xl font-semibold mb-4 text-center text-white">
        Welcome to Spotify-Integrated Airbnb
      </h1>
      <p className="text-zinc-400 mb-8 text-center max-w-md">
        Experience a new way of travel with your favorite music. Connect with Spotify to get started.
      </p>
      <Link href="/login" className="w-full max-w-md">
        <Button 
          className="w-full bg-[#1DB954] hover:bg-[#1DB954]/90 text-white py-6 rounded-lg font-semibold"
        >
          Get Started with Spotify
        </Button>
      </Link>
    </div>
  )
}

