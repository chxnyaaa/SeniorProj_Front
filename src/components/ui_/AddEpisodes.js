"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import NoSSRSelect from "@/components/ui/NoSSRSelect"
import { statusOptions, soundOptions } from "@/constants/selectOptions"
import { getEpisodeID, CreateEpisode, UpdateEpisode } from "@/lib/api/episode"
import { useAuth } from "@/contexts/AuthContext"

const url = process.env.NEXT_PUBLIC_API_URL || ""

export default function AddEpisodes({ isEdit = false, editId = null, bookId, router }) {
  const [chapterTitle, setChapterTitle] = useState("")
  const [chapterContent, setChapterContent] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [price, setPrice] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [status, setStatus] = useState("draft")
  const [priority, setPriority] = useState("")
  const [sound, setSound] = useState("103")
  const [urlSound, setUrlSound] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  const [existingCoverUrl, setExistingCoverUrl] = useState(null)
  const { user } = useAuth()
  const userId = user?.id || null

  useEffect(() => {
    if (isEdit && editId && bookId) {
      getEpisodeID(bookId, editId)
        .then(episodeArr => {
          const episode = episodeArr.detail || {}
          if (!episode) return
          setChapterTitle(episode.title || "")
          setChapterContent(episode.content || "")
          setReleaseDate(episode.release_date ? new Date(episode.release_date).toISOString().split("T")[0] : "")
          setPrice(episode.price || "")
          setStatus(episode.status || "draft")
          setPriority(episode.priority || "")
          setExistingCoverUrl(episode.cover || null)
          setSound(episode.sound || "103")
          if (episode.cover) setCoverPreview(`${url}/uploads/cover/${episode.cover}`)
        })
        .catch(err => console.error("Failed to fetch episode:", err))
    }
  }, [isEdit, editId, bookId])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith("image/")) return alert("Please upload an image file (JPG, PNG, etc.)")
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview)
    setImageFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    if (coverPreview?.startsWith("blob:")) URL.revokeObjectURL(coverPreview)
    setImageFile(null)
    setCoverPreview(null)
    setExistingCoverUrl(null)
  }

  const handleSubmit = async () => {
    if (!bookId || !chapterTitle || !chapterContent) return alert("Please fill in all required fields.")
    const data = {
      book_id: bookId,
      user_id: userId,
      title: chapterTitle,
      content: chapterContent,
      is_free: false,
      price: price || 0,
      release_date: releaseDate,
      status,
      cover: imageFile,
      cover_url: !imageFile ? existingCoverUrl : null,
      priority: priority || "",
      sound: sound || "103",
    }
    try {
      const res = isEdit ? await UpdateEpisode(bookId, editId, data) : await CreateEpisode(bookId, data)
      alert(isEdit ? "Episode updated successfully!" : "Episode added successfully!")
      router.push(`/book/${bookId}`)
    } catch (err) {
      console.error("Episode error:", err)
      alert("An error occurred. Please try again.")
    }
  }

  const handleAudioSampleClick = (sampleId) => {
    setSound(sampleId)
    const sampleMap = {
      103: "https://botnoi-dictionary.s3.amazonaws.com/d0a12887a6e294630e672cde7286af6728b8705a431e878488dc5e466d205e6f_09022025160718802110.mp3",
      100: "https://botnoi-dictionary.s3.amazonaws.com/d0a12887a6e294630e672cde7286af6728b8705a431e878488dc5e466d205e6f_09022025162446851500.mp3",
      99: "https://botnoi-dictionary.s3.amazonaws.com/d0a12887a6e294630e672cde7286af6728b8705a431e878488dc5e466d205e6f_09022025162603101889.mp3",
    }
    const url = sampleMap[sampleId] || null
    setUrlSound(url)
    if (!url || !audioRef.current) return
    audioRef.current.pause()
    audioRef.current.src = url
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.log("Play error:", err))
  }

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-teal-300 mb-6">
        {isEdit ? "Edit Episode" : "Add New Episode"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Upload Chapter Image */}
        <div className="md:col-span-4">
          <label className="block text-sm mb-1 text-teal-300">Upload Chapter Image</label>
          <div
            className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-teal-600 transition-colors"
            onClick={() => document.getElementById("chapterImageInput").click()}
          >
            <input
              id="chapterImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {!coverPreview && !existingCoverUrl ? (
              <div className="text-teal-400 text-center select-none">
                <p className="mt-20 mb-1 text-lg font-semibold">Click or drop file to upload</p>
                <p className="text-sm">Supported: JPG, PNG</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={coverPreview || existingCoverUrl}
                  alt="Chapter Preview"
                  className="w-full h-auto object-cover rounded-lg shadow-md mb-3"
                />
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  onClick={(e) => { e.stopPropagation(); removeImage() }}
                >
                  Remove Chapter Image
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          <div>
            <label className="block text-sm mb-1 text-teal-300">Episode</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Chapter Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Release Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">
              Price <span className="text-red-500"> (0 = free)</span>
            </label>
            <input
              type="number"
              min="0"
              className="w-full border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Status</label>
            <NoSSRSelect
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === status)}
              onChange={(selected) => setStatus(selected.value)}
              className="text-black"
            />
          </div>

          {/* Audio */}
          <audio ref={audioRef} preload="metadata" />


          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-6 justify-items-center">
            {[ 
              { id: 103, name: "Elvin", img: "/botnoi/103.png" },
              { id: 100, name: "Irene", img: "/botnoi/100.png" },
              { id: 99, name: "Polly", img: "/botnoi/99.png" }
            ].map((sound) => (
              <div key={sound.id} className="flex flex-col items-center cursor-pointer" onClick={() => handleAudioSampleClick(sound.id)}>
                <div className="rounded-lg overflow-hidden w-36 h-48 shadow-lg mb-2 hover:scale-105 transition-transform">
                  <img src={sound.img} alt={sound.name} className="object-cover w-full h-full" />
                </div>
                <p className="text-white text-sm text-center">Test Sound {sound.name}</p>
              </div>
            ))}
          </div>

      <div style={{ display: "none" }}>
        <div className="mt-2">
          <Button onClick={toggleAudio} className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
            {isPlaying ? "Pause Audio" : "Play Audio"}
          </Button>
        </div>
        </div>

         

          <div>
            <label className="block text-sm mb-1 text-teal-300">Sound Sample</label>
            <NoSSRSelect
              options={soundOptions}
              value={soundOptions.find((opt) => opt.value == sound)}
              onChange={(selected) => setSound(selected.value)}
              className="text-black"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-teal-300">Chapter Content</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={6}
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex space-x-4">
        <Button className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600" onClick={handleSubmit}>
          {isEdit ? "Update Episode" : "Save Episode"}
        </Button>
        <Button className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600" onClick={() => router.push(`/book/${bookId}`)}>
          Back to Book
        </Button>
      </div>
    </div>
  )
}
