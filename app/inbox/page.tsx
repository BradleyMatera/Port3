'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Inbox() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-semibold mb-6">Inbox</h1>
      
      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="w-full bg-transparent border-b border-zinc-800">
          <TabsTrigger 
            value="messages"
            className="flex-1 bg-transparent text-lg data-[state=active]:text-[#FF385C] data-[state=active]:border-b-2 data-[state=active]:border-[#FF385C]"
          >
            Messages
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className="flex-1 bg-transparent text-lg data-[state=active]:text-[#FF385C] data-[state=active]:border-b-2 data-[state=active]:border-[#FF385C]"
          >
            Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="messages" className="mt-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">You have no unread messages</h2>
            <p className="text-zinc-400">
              When you contact a host or send a reservation request, you'll see your messages here.
            </p>
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">No notifications yet</h2>
            <p className="text-zinc-400">
              We'll let you know when we have any updates for you.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

