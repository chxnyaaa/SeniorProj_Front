"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import AddEpisodes from "@/components/ui/AddEpisodes"

export default function AddEpisodePage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const router = useRouter()
  const params = useParams()
  const bookId = params?.bookId

  if (!bookId) {
    return <div className="text-red-500 p-6">Error: Book ID is required.</div>
  }

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
      <div className="flex-1 flex flex-col">
        <Header />
        <AddEpisodes isEdit={false} bookId={bookId} router={router} />
      </div>
    </div>
  )
}
