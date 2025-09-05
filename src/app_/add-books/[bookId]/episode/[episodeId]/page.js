"use client"

import React, { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Sidebar from "@/components/ui/Sidebar"
import Header from "@/components/ui/Header"
import AddEpisodes from "@/components/ui/AddEpisodes"

export default function EditEpisodePage() {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(false)
  const params = useParams()
  const router = useRouter()
  const bookId = params?.bookId
  const episodeId = params?.episodeId

  if (!bookId || !episodeId) {
    return <div className="text-red-500 p-6">Error: Book ID and Episode ID are required.</div>
  }

  return (
    <div className="min-h-screen bg-custom-bg flex">
      <Sidebar currentlyPlaying={currentlyPlaying} setCurrentlyPlaying={setCurrentlyPlaying} />
      <div className="flex-1 flex flex-col">
        <Header />
        <AddEpisodes isEdit={true} bookId={bookId} editId={episodeId} router={router} />
      </div>
    </div>
  )
}
