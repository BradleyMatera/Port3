import { Button } from "@/components/ui/button"

export default function Trips() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Trips</h1>
      
      <div className="text-center space-y-4 mt-12">
        <h2 className="text-2xl font-semibold">Say hello to the world again</h2>
        <p className="text-zinc-400">
          Plan a new trip and explore places to stay close to all the places you love.
        </p>
        <Button className="bg-[#FF385C] hover:bg-[#FF385C]/90 text-white px-8">
          Start exploring
        </Button>
      </div>
    </div>
  )
}

