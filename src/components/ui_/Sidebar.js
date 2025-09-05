"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import TextLink from "@/components/ui/TextLink"
import NowPlaying from "@/components/ui/NowPlaying"
import { Calendar, Clock, Bookmark, Book, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  // 🔄 โหลด user จาก sessionStorage ตอน component mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.error("Failed to parse user from sessionStorage", err)
      }
    }
  }, [])


  return (
    <div className="w-64 bg-custom-bg border-r border-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-white text-4xl font-bold flex items-center gap-2">
          Loft <Book className="w-10 h-10 text-teal-300" />
        </h1>
        <h2 className="text-white text-4xl font-bold">Library</h2>
      </div>

      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <TextLink href="/Daily" className="w-full flex items-center gap-3 text-white hover:bg-gray-700 p-2 rounded">
            <Calendar className="w-4 h-4" />
            Daily
          </TextLink>
          <TextLink href="/History" className="w-full flex items-center gap-3 text-white hover:bg-gray-700 p-2 rounded">
            <Clock className="w-4 h-4" />
            History
          </TextLink>
          <TextLink href="/Bookmark" className="w-full flex items-center gap-3 text-white hover:bg-gray-700 p-2 rounded">
            <Bookmark className="w-4 h-4" />
            Bookmark
          </TextLink>

        
        </nav>
      </div>

      {/* Now Playing Section */}
      <NowPlaying
        currentlyPlaying={currentlyPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
      />
    </div>
  )
}
