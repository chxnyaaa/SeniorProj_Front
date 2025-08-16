"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import NoSSRSelect from "@/components/ui/NoSSRSelect"
import { statusOptions } from "@/constants/selectOptions"
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

  const [existingCoverUrl, setExistingCoverUrl] = useState(null)
  const { user } = useAuth()
  const userId = user?.id || null

  useEffect(() => {
    const loadEpisode = async () => {
      if (isEdit && editId && bookId) {
        try {
          const episodeArr = await getEpisodeID(bookId, editId)
          const episode = episodeArr.detail || {}
          console.log("Fetched episode:", episode)
          if (episode) {
            setChapterTitle(episode.title || "")
            setChapterContent(episode.content || "")
            if (episode.release_date) {
              const isoDate = new Date(episode.release_date)
              const formattedDate = isoDate.toISOString().split("T")[0]
              setReleaseDate(formattedDate)
            }
            setPrice(episode.price || "")
            setStatus(episode.status || "draft")
            setPriority(episode.priority || "")
            setExistingCoverUrl(episode.cover || null)
            if (episode.cover) {
              // setCoverPreview(`${url}/uploads/books/${data.cover_image}`)
              setCoverPreview(`${url}/uploads/cover/${episode.cover}`)
            }
          }
        } catch (error) {
          console.error("Failed to fetch episode:", error)
        }
      }
    }
    loadEpisode()
  }, [isEdit, editId, bookId])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      if (coverPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreview)
      }
      setImageFile(file)
      setCoverPreview(URL.createObjectURL(file))
    } else {
      alert("Please upload an image file (JPG, PNG, etc.)")
    }
  }

  const removeImage = () => {
    if (coverPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreview)
    }
    setImageFile(null)
    setCoverPreview(null)
    setExistingCoverUrl(null)
  }

  const handleSubmit = async () => {
    if (!bookId || !chapterTitle || !chapterContent) {
      alert("Please fill in all required fields.")
      return
    }

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
    }

    try {
      const res = isEdit
        ? await UpdateEpisode(bookId, editId, data)
        : await CreateEpisode(bookId, data)

      console.log("Episode saved:", res)
      if (res) {
        alert(isEdit ? "Episode updated successfully!" : "Episode added successfully!")
        router.push(`/book/${bookId}`)
      } else {
        alert("Failed to save episode.")
      }
    } catch (err) {
      console.error("Episode error:", err)
      alert("An error occurred. Please try again.")
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
                  <p className="mt-20 mb-1 text-lg font-semibold">
                    Click or drop file to upload
                  </p>
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
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage()
                    }}
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

          {/* Chapter Title */}
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

          {/* Release Date */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">Release Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm mb-1 text-teal-300">
              Price 
             <span className="text-red-500"> (0 = free)</span>
            </label>
            <input
              type="number"
              min="0"
              className="w-full border p-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Status */} 
          <div>
            <label className="block text-sm mb-1 text-teal-300">Status</label>
            <NoSSRSelect
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === status)}
              onChange={(selected) => setStatus(selected.value)}
              className="text-black"
            />
          </div>
          

          {/* Chapter Content */}
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
        <Button
          className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600"
          onClick={handleSubmit}
        >
          {isEdit ? "Update Episode" : "Save Episode"}
        </Button>
        <Button
          className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          onClick={() => router.push(`/book/${bookId}`)}
        >
          Back to Book
        </Button>
      </div>
    </div>
  )
}
