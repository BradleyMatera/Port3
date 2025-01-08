'use client'

import { Button } from "@/components/ui/button"

export default function Explore() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Explore</h1>

      <div className="text-center space-y-4 mt-12">
        <h2 className="text-2xl font-semibold">Discover new adventures</h2>
        <p className="text-zinc-400">
          Browse unique stays and explore exciting destinations around the globe.
        </p>
        <Button className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white px-8">
          Start exploring
        </Button>
      </div>
    </div>
  )
}