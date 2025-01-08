import { Button } from "@/components/ui/button"
import { Mail, Apple } from 'lucide-react'
import Image from "next/image"

export function SocialAuthButtons() {
  return (
    <div className="space-y-3">
      <button className="flex items-center justify-center gap-3 w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full">
        <Mail className="w-6 h-6" />
        <span className="font-semibold">CONTINUE WITH EMAIL</span>
      </button>

      <button className="flex items-center justify-center gap-3 w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full">
        <Apple className="w-6 h-6" />
        <span className="font-semibold">CONTINUE WITH APPLE</span>
      </button>

      <button className="flex items-center justify-center gap-3 w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full">
        <Image src="/google.svg" alt="Google" width={24} height={24} />
        <span className="font-semibold">CONTINUE WITH GOOGLE</span>
      </button>

      <button className="flex items-center justify-center gap-3 w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full">
        <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
        <span className="font-semibold">CONTINUE WITH FACEBOOK</span>
      </button>
    </div>
  )
}

