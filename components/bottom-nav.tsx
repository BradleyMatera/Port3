'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Heart, Home, MessageSquare, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 w-full bg-black border-t border-zinc-800">
      <div className="flex justify-around items-center h-16">
        <Link 
          href="/music-search" 
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/explore' ? 'text-white' : 'text-zinc-400'
          }`}
        >
          <Search size={24} />
          <span className="text-xs">Music Search</span>
        </Link>
        
        <Link 
          href="/wishlists" 
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/wishlists' ? 'text-white' : 'text-zinc-400'
          }`}
        >
          <Heart size={24} />
          <span className="text-xs">Wishlists</span>
        </Link>
        
        <Link 
          href="/trips" 
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/trips' ? 'text-white' : 'text-zinc-400'
          }`}
        >
          <Home size={24} />
          <span className="text-xs">Trips</span>
        </Link>
        
        <Link 
          href="/inbox" 
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/inbox' ? 'text-white' : 'text-zinc-400'
          }`}
        >
          <MessageSquare size={24} />
          <span className="text-xs">Inbox</span>
        </Link>
        
        <Link 
          href="/profile" 
          className={`flex flex-col items-center space-y-1 ${
            pathname === '/profile' ? 'text-white' : 'text-zinc-400'
          }`}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}

