'use client'

import { Button } from "@/components/ui/button"

export default function Wishlist() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Wishlist</h1>

      <div className="text-center space-y-4 mt-12">
        <h2 className="text-2xl font-semibold">Save places you love</h2>
        <p className="text-zinc-400">
          Keep track of your favorite destinations and stay organized for your next trip.
        </p>
        <Button className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white px-8">
          View your wishlist
        </Button>
      </div>
    </div>
  )
}