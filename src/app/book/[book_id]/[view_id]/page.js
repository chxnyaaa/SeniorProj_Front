"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"
import { getEpisodeId } from "@/lib/api/book"
import { Play, Pause, SkipBack, SkipForward, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"

const url = process.env.NEXT_PUBLIC_API_URL

export default function ReaderPage() {
  const params = useParams()
  const bookId = params.book_id
  const episodeId = params.view_id

  const [title, setTitle] = useState("")
  const [contentText, setContentText] = useState("")
  const [audioUrl, setAudioUrl] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [fileUrl, setFileUrl] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef(null)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getEpisodeId(bookId, episodeId)
        const ep = data?.data?.[0]
        if (ep) {
          setTitle(ep.title)
          setContentText(ep.content_text)
          if(ep.audio_url) {
            setAudioUrl(url + ep.audio_url)
          }
          if(ep.cover_url) {
            setCoverUrl(url + ep.cover_url)
          }
          if(ep.file_url) {
            setFileUrl(url + ep.file_url)
          }
        }
      } catch (err) {
        console.error("Error fetching book data:", err)
      }
    }
    fetchBook()
  }, [bookId, episodeId])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
    }
  }, [])

  const toggleAudio = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleProgressChange = (value) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 bg-white">
        <Link href={`/book/${bookId}`} className="inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-5 h-5 mr-2" />
          กลับไปยังหน้ารายละเอียดหนังสือ
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          
         {/* Content Text */}
        {contentText && (
          <>
           {/* <div className="w-full max-w-4xl bg-white rounded-lg p-6 text-gray-800 shadow mb-8 leading-relaxed whitespace-pre-line"> */}
            {contentText}
           {/* </div> */}
          </>
        )}
        </div>

        {/* Cover */}
        {coverUrl && (
          <img
            src={coverUrl}
            alt="cover"
            className="w-full max-w-md h-auto object-cover rounded-lg shadow mb-8"
          />
        )}

        {/* Audio Player */}
        {audioUrl && (
          <div className="w-full max-w-2xl bg-white rounded-xl p-6 shadow border border-gray-200 mb-8">
            <audio ref={audioRef} src={audioUrl} preload="metadata" className="hidden" />

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <Button variant="ghost" size="sm">
                <SkipBack className="w-6 h-6 text-gray-600" />
              </Button>
              <Button
                onClick={toggleAudio}
                className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="w-6 h-6 text-gray-600" />
              </Button>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 w-12">{formatTime(currentTime)}</span>
              <div className="flex-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleProgressChange}
                />
              </div>
              <span className="text-sm text-gray-500 w-12">{formatTime(duration)}</span>
            </div>
          </div>
        )}

       

        {/* PDF Viewer */}
        {/* {fileUrl && (
          <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-300 mb-8" style={{ height: "600px" }}>
            <iframe
              src={fileUrl}
              width="100%"
              height="100%"
              className="rounded-2xl"
              style={{ border: "none" }}
              title="Chapter PDF"
            />
          </div>
        )} */}
      </div>
    </div>
  )
}
