"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import NoSSRSelect from "@/components/ui/NoSSRSelect"
import { statusOptions } from "@/constants/selectOptions"
import { getEpisodeID, CreateEpisode, UpdateEpisode } from "@/lib/api/episode"

export default function AddEpisodes({ isEdit = false, editId = null, bookId, router }) {
  const [chapterTitle, setChapterTitle] = useState("")
  const [chapterContent, setChapterContent] = useState("")
  const [releaseDate, setReleaseDate] = useState("")
  const [price, setPrice] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [mp3File, setMp3File] = useState(null)
  const [status, setStatus] = useState("draft")

  const [existingCoverUrl, setExistingCoverUrl] = useState(null)
  const [existingFileUrl, setExistingFileUrl] = useState(null)
  const [existingAudioUrl, setExistingAudioUrl] = useState(null)

  useEffect(() => {
    const loadEpisode = async () => {
      if (isEdit && editId && bookId) {
        try {
          const episodeArr = await getEpisodeID(bookId, editId)
          const episode = episodeArr[0] || {}
          console.log("Loaded episode:", episode)
          if (episode) {
            setChapterTitle(episode.title || "")
            setChapterContent(episode.content_text || "")
             if (episode.release_date) {
              const isoDate = new Date(episode.release_date)
              const formattedDate = isoDate.toISOString().split("T")[0]
              setReleaseDate(formattedDate)
            }
            setPrice(episode.price || "")
            setStatus(episode.status || "draft")
            setExistingCoverUrl(episode.cover_url || null)
            setExistingFileUrl(episode.file_url || null)
            setExistingAudioUrl(episode.audio_url || null)
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
      setImageFile(file)
    } else {
      alert("Please upload an image file.")
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
    } else {
      alert("Please upload a PDF file.")
    }
  }

  const handleMp3Change = (e) => {
    const file = e.target.files?.[0]
    if (file && (file.type === "audio/mpeg" || file.type === "audio/mp3")) {
      setMp3File(file)
    } else {
      alert("Please upload an MP3 audio file.")
    }
  }

  const handleSubmit = async () => {
    if (!bookId || !chapterTitle || !chapterContent) {
      alert("Please fill in all required fields.")
      return
    }

    const data = {
      title: chapterTitle,
      content_text: chapterContent,
      release_date: releaseDate,
      price: price || 0,
      status,
      book_id: bookId,
      cover: imageFile,
      file: pdfFile,
      audio: mp3File,
      cover_url: !imageFile ? existingCoverUrl : null,
      file_url: !pdfFile ? existingFileUrl : null,
      audio_url: !mp3File ? existingAudioUrl : null,
    }

    try {
      const res = isEdit
        ? await UpdateEpisode(bookId, editId, data)
        : await CreateEpisode(bookId, data)

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
        <div className="md:col-span-12 space-y-4">
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
            <label className="block text-sm mb-1 text-teal-300">Chapter Content</label>
            <textarea
              className="w-full border p-2 rounded"
              rows={6}
              value={chapterContent}
              onChange={(e) => setChapterContent(e.target.value)}
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
            <label className="block text-sm mb-1 text-teal-300">Price</label>
            <input
              type="text"
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

          <div>
            <label className="block text-sm font-medium text-teal-300 mb-1">Upload Chapter Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-dashed border-gray-300 rounded-md p-2 cursor-pointer"
            />
            {imageFile
              ? <p className="text-sm text-white mt-1">🖼️ {imageFile.name}</p>
              : existingCoverUrl && <p className="text-sm text-white mt-1">🖼️ Existing: {existingCoverUrl.split("/").pop()}</p>
            }
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-300 mb-1">Upload Chapter PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfChange}
              className="w-full border border-dashed border-gray-300 rounded-md p-2 cursor-pointer"
            />
            {pdfFile
              ? <p className="text-sm text-white mt-1">📄 {pdfFile.name}</p>
              : existingFileUrl && <p className="text-sm text-white mt-1">📄 Existing: {existingFileUrl.split("/").pop()}</p>
            }
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-300 mb-1">Upload Chapter Audio (MP3)</label>
            <input
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={handleMp3Change}
              className="w-full border border-dashed border-gray-300 rounded-md p-2 cursor-pointer"
            />
            {mp3File
              ? <p className="text-sm text-white mt-1">🎵 {mp3File.name}</p>
              : existingAudioUrl && <p className="text-sm text-white mt-1">🎵 Existing: {existingAudioUrl.split("/").pop()}</p>
            }
          </div>
        </div>
      </div>

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
